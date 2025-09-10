'use client';

import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

type Role = 'viewer' | 'editor' | 'approver' | 'admin';

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const { t, i18n } = useTranslation();
  const location = useLocation();

  const [session, setSession] = useState<any>(null);
  const [role, setRole] = useState<Role>('viewer');
  const [active, setActive] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => { sub.subscription.unsubscribe(); };
  }, []);

  useEffect(() => {
    (async () => {
      if (!session?.user?.email) { 
        setLoading(false); 
        return; 
      }
      const { data } = await supabase
        .from('admin_users')
        .select('role, active')
        .eq('email', session.user.email)
        .maybeSingle();
      
      if (data) { 
        setRole((data.role ?? 'viewer') as Role); 
        setActive(!!data.active); 
      } else { 
        setRole('viewer'); 
        setActive(false); 
      }
      setLoading(false);
    })();
  }, [session]);

  const isAllowlisted = active;
  const isAdmin = isAllowlisted && role === 'admin';

  const navItems = useMemo(() => [
    { href: '/admin', label: t('admin.dashboard') },
    { href: '/admin/taglines', label: t('admin.title') },
    ...(isAdmin ? [{ href: '/admin/allowlist', label: t('admin.allowlist') }] : []),
  ], [t, isAdmin]);

  function isActive(href: string) { 
    return location.pathname === href; 
  }

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    await supabase.auth.signInWithOtp({
      email,
      options: { 
        emailRedirectTo: typeof window !== 'undefined' ? window.location.href : undefined 
      }
    });
    alert(t('admin.checkEmail'));
  }

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground">
        Loading…
      </div>
    );
  }

  if (!session) {
    return (
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center p-6">
        <h1 className="mb-4 text-xl font-semibold">Admin Control Panel</h1>
        <p className="mb-3 text-sm text-muted-foreground">
          Sign in with your work email to continue.
        </p>
        <form onSubmit={signIn} className="flex gap-2">
          <input 
            type="email" 
            required 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            placeholder="you@keys-pay.com" 
            className="flex-1 rounded border px-3 py-2" 
          />
          <button className="rounded bg-primary px-4 py-2 text-primary-foreground">
            {t('admin.signIn')}
          </button>
        </form>
      </div>
    );
  }

  if (!isAllowlisted) {
    return (
      <div className="mx-auto flex min-h-screen max-w-lg flex-col justify-center p-6">
        <h1 className="mb-2 text-xl font-semibold">Admin Control Panel</h1>
        <p className="text-sm text-muted-foreground">
          You're signed in as <strong>{session.user.email}</strong>, but {t('admin.notAllowlisted')}
        </p>
        <div className="mt-4">
          <button 
            onClick={() => supabase.auth.signOut()} 
            className="rounded border px-3 py-1"
          >
            {t('admin.signOut')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-secondary/20">
      {/* Sidebar */}
      <aside className="hidden w-60 flex-col bg-primary text-primary-foreground md:flex">
        <div className="px-4 py-4 text-lg font-semibold">Keys Pay · Admin</div>
        <nav className="flex-1 px-2 py-2">
          {navItems.map(item => (
            <Link 
              key={item.href} 
              to={item.href} 
              className={[
                'block rounded px-3 py-2 text-sm hover:bg-white/10 transition-colors',
                isActive(item.href) ? 'bg-white/10' : ''
              ].join(' ')}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="px-3 py-3 text-xs text-primary-foreground/70">
          <div>{session.user.email}</div>
          <div>{t('admin.role')}: <span className="uppercase">{role}</span></div>
          <div className="mt-2 flex gap-2">
            <button 
              onClick={toggleLanguage}
              className="rounded border border-white/20 px-2 py-1 text-xs hover:bg-white/10 transition-colors"
            >
              {i18n.language === 'ar' ? 'EN' : 'AR'}
            </button>
            <button 
              onClick={() => supabase.auth.signOut()} 
              className="rounded border border-white/20 px-2 py-1 text-xs hover:bg-white/10 transition-colors"
            >
              {t('admin.signOut')}
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
          <div className="mx-auto flex h-12 max-w-7xl items-center justify-between px-4">
            <div className="font-medium">Admin Control Panel</div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="hidden sm:inline">{session.user.email}</span>
              <span className="rounded bg-secondary px-2 py-0.5 text-xs uppercase">
                {role}
              </span>
            </div>
          </div>
        </header>
        <main className="mx-auto w-full max-w-7xl flex-1 p-4">
          {children}
        </main>
      </div>
    </div>
  );
}