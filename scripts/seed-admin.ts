import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
if (!url || !serviceKey) throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');

const adminUserId = process.env.ADMIN_USER_ID ?? '';
const adminEmail = process.env.ADMIN_EMAIL ?? '';

const supabase = createClient(url, serviceKey, { 
  auth: { 
    autoRefreshToken: false,
    persistSession: false 
  } 
});

async function resolveUserId(): Promise<{ id: string; email: string | null }> {
  if (adminUserId) {
    const { data, error } = await supabase.auth.admin.getUserById(adminUserId);
    if (error || !data.user) throw new Error(`UserId not found: ${error?.message || 'User does not exist'}`);
    return { id: data.user.id, email: data.user.email ?? null };
  }
  if (adminEmail) {
    // Fallback: scan pages to find the email
    let page = 1;
    const perPage = 1000;
    while (true) {
      const { data, error } = await supabase.auth.admin.listUsers({ page, perPage });
      if (error) throw error;
      const hit = data.users.find(u => (u.email ?? '').toLowerCase() === adminEmail.toLowerCase());
      if (hit) return { id: hit.id, email: hit.email ?? null };
      if (data.users.length < perPage) break;
      page++;
    }
    throw new Error(`No user with email ${adminEmail}`);
  }
  throw new Error('Set ADMIN_USER_ID or ADMIN_EMAIL in env');
}

async function ensureProfileIsAdmin(userId: string) {
  // Upsert profile row with is_admin=true
  const { error } = await supabase
    .from('profiles')
    .upsert({ user_id: userId, is_admin: true }, { onConflict: 'user_id' });
  if (error) throw error;
}

async function setAppMetadataAdmin(userId: string) {
  const { data, error } = await supabase.auth.admin.getUserById(userId);
  if (error || !data.user) throw new Error('User fetch failed');
  const roles = Array.isArray((data.user.app_metadata as any)?.roles)
    ? ([...(data.user.app_metadata as any).roles] as string[])
    : [];
  if (!roles.includes('admin')) roles.push('admin');
  const { error: updErr } = await supabase.auth.admin.updateUserById(userId, {
    app_metadata: { ...(data.user.app_metadata as any), roles, is_admin: true },
  } as any);
  if (updErr) throw updErr;
}

(async () => {
  try {
    const { id, email } = await resolveUserId();
    await ensureProfileIsAdmin(id);
    await setAppMetadataAdmin(id);
    console.log(`✅ Seeded admin: ${id}${email ? ` (${email})` : ''}`);
    process.exit(0);
  } catch (e: any) {
    console.error('❌ Admin seed failed:', e?.message || e);
    process.exit(1);
  }
})();