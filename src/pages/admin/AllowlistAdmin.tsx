'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from 'react-i18next';
import AdminShell from '@/components/admin/AdminShell';

type Role = 'viewer' | 'editor' | 'approver' | 'admin';
type AdminUser = { 
  id: number; 
  email: string; 
  role: Role; 
  active: boolean; 
  created_at: string 
};

export default function AllowlistAdmin() {
  const { t } = useTranslation();
  const [session, setSession] = useState<any>(null);
  const [myRole, setMyRole] = useState<Role>('viewer');
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [email, setEmail] = useState(''); 
  const [role, setRole] = useState<Role>('viewer'); 
  const [active, setActive] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => { 
    supabase.auth.getSession().then(({data}) => setSession(data.session)); 
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s)); 
    return () => { sub.subscription.unsubscribe(); }; 
  }, []);

  useEffect(() => { 
    (async () => { 
      if (!session?.user?.email) return; 
      const { data } = await supabase
        .from('admin_users')
        .select('role, active')
        .eq('email', session.user.email)
        .maybeSingle(); 
      if (data?.active && data?.role) setMyRole(data.role as Role); 
      else setMyRole('viewer'); 
    })(); 
  }, [session]);

  const isAdmin = myRole === 'admin';

  async function loadUsers() { 
    setLoading(true); 
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .order('role', {ascending: true})
      .order('email', {ascending: true}); 
    if (error) alert(error.message); 
    setUsers((data as AdminUser[]) || []); 
    setLoading(false); 
  }

  useEffect(() => { 
    if (isAdmin) loadUsers(); 
  }, [isAdmin]);

  async function addUser(e: React.FormEvent) { 
    e.preventDefault(); 
    if (!isAdmin) return; 
    const cleanEmail = email.trim().toLowerCase(); 
    if (!cleanEmail) return alert('Email required'); 
    const { error } = await supabase
      .from('admin_users')
      .insert({ email: cleanEmail, role, active }); 
    if (error) return alert(error.message); 
    setEmail(''); 
    setRole('viewer'); 
    setActive(true); 
    loadUsers(); 
  }

  async function updateUser(u: AdminUser) { 
    if (!isAdmin) return; 
    const { error } = await supabase
      .from('admin_users')
      .update({ role: u.role, active: u.active })
      .eq('id', u.id); 
    if (error) return alert(error.message); 
    loadUsers(); 
  }

  async function deleteUser(id: number) { 
    if (!isAdmin) return; 
    if (!confirm('Delete this user from allowlist?')) return; 
    const { error } = await supabase
      .from('admin_users')
      .delete()
      .eq('id', id); 
    if (error) return alert(error.message); 
    loadUsers(); 
  }

  if (!isAdmin) { 
    return (
      <AdminShell>
        <div className="mx-auto max-w-lg space-y-3">
          <h1 className="text-xl font-semibold">{t('admin.allowlist')}</h1>
          <p className="text-sm text-muted-foreground">
            You're signed in as <strong>{session?.user?.email}</strong> with role <strong>{myRole}</strong>. 
            Only <strong>admin</strong> can manage the allowlist.
          </p>
        </div>
      </AdminShell>
    ); 
  }

  return (
    <AdminShell>
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">{t('admin.allowlist')} (admin)</h1>
          <button 
            onClick={loadUsers} 
            className="rounded border px-3 py-1"
          >
            {loading ? 'Loading…' : 'Refresh'}
          </button>
        </div>

        <form onSubmit={addUser} className="flex flex-wrap items-end gap-2 rounded border p-3">
          <div className="flex-1 min-w-[220px]">
            <label className="block text-xs text-muted-foreground">{t('admin.email')}</label>
            <input 
              className="w-full rounded border px-3 py-2" 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              placeholder="user@keys-pay.com" 
              required
            />
          </div>
          <div>
            <label className="block text-xs text-muted-foreground">{t('admin.role')}</label>
            <select 
              className="rounded border px-3 py-2" 
              value={role} 
              onChange={e => setRole(e.target.value as Role)}
            >
              <option value="viewer">viewer</option>
              <option value="editor">editor</option>
              <option value="approver">approver</option>
              <option value="admin">admin</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <input 
              id="active" 
              type="checkbox" 
              checked={active} 
              onChange={e => setActive(e.target.checked)} 
            />
            <label htmlFor="active" className="text-sm">{t('admin.active')}</label>
          </div>
          <button className="rounded bg-primary px-4 py-2 text-primary-foreground">
            {t('admin.add')}
          </button>
        </form>

        <div className="rounded border">
          <table className="w-full text-sm">
            <thead className="bg-secondary">
              <tr className="text-left">
                <th className="py-2 pl-3">{t('admin.email')}</th>
                <th>{t('admin.role')}</th>
                <th>{t('admin.active')}</th>
                <th>{t('admin.created')}</th>
                <th className="w-40">{t('admin.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-t">
                  <td className="py-2 pl-3">{u.email}</td>
                  <td>
                    <select 
                      className="rounded border px-2 py-1" 
                      value={u.role} 
                      onChange={e => {
                        const val = e.target.value as Role; 
                        setUsers(prev => prev.map(x => x.id === u.id ? {...x, role: val} : x));
                      }}
                    >
                      <option value="viewer">viewer</option>
                      <option value="editor">editor</option>
                      <option value="approver">approver</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                  <td className="text-center">
                    <input 
                      type="checkbox" 
                      checked={u.active} 
                      onChange={e => {
                        const val = e.target.checked; 
                        setUsers(prev => prev.map(x => x.id === u.id ? {...x, active: val} : x));
                      }}
                    />
                  </td>
                  <td>{new Date(u.created_at).toLocaleString()}</td>
                  <td className="flex gap-2 py-2">
                    <button 
                      onClick={() => updateUser(u)} 
                      className="rounded bg-green-600 px-3 py-1 text-white"
                    >
                      {t('admin.save')}
                    </button>
                    <button 
                      onClick={() => deleteUser(u.id)} 
                      className="rounded bg-red-600 px-3 py-1 text-white"
                    >
                      {t('admin.delete')}
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td className="py-3 pl-3 text-muted-foreground" colSpan={5}>
                    No entries yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="text-xs text-muted-foreground">
          Tip: keep at least one <strong>admin</strong> user to avoid locking yourself out.
        </div>
      </div>
    </AdminShell>
  );
}