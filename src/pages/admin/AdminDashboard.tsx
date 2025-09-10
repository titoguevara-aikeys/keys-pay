'use client';

import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from 'react-i18next';
import AdminShell from '@/components/admin/AdminShell';

type Role = 'viewer' | 'editor' | 'approver' | 'admin';

export default function AdminDashboard() {
  const { t } = useTranslation();
  const [role, setRole] = useState<Role>('viewer');

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const email = session?.user?.email;
      if (!email) return;
      
      const { data } = await supabase
        .from('admin_users')
        .select('role, active')
        .eq('email', email)
        .maybeSingle();
        
      if (data?.active && data?.role) setRole(data.role as Role);
    })();
  }, []);

  const isAdmin = role === 'admin';

  return (
    <AdminShell>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link 
          to="/admin/taglines" 
          className="rounded-xl border p-4 shadow-sm hover:shadow transition-shadow"
        >
          <div className="text-lg font-semibold">{t('admin.title')}</div>
          <div className="mt-1 text-sm text-muted-foreground">
            {t('admin.managingTaglines')}
          </div>
        </Link>
        
        <Link 
          to="/admin/allowlist" 
          className={`rounded-xl border p-4 shadow-sm hover:shadow transition-shadow ${
            !isAdmin ? 'opacity-60 hover:shadow-none pointer-events-none' : ''
          }`}
        >
          <div className="text-lg font-semibold">{t('admin.allowlist')}</div>
          <div className="mt-1 text-sm text-muted-foreground">
            {t('admin.managingUsers')}
          </div>
        </Link>
        
        <div className="rounded-xl border p-4 opacity-60">
          <div className="text-lg font-semibold">{t('admin.systemStatus')}</div>
          <div className="mt-1 text-sm text-muted-foreground">
            {t('admin.supabaseRunning')}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}