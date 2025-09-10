-- TAGLINES TABLE + INDEXES + RLS
CREATE TABLE IF NOT EXISTS public.taglines (
  id bigserial PRIMARY KEY,
  locale text NOT NULL CHECK (locale IN ('en','ar')),
  text text NOT NULL,
  position int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  status text NOT NULL DEFAULT 'published' CHECK (status IN ('draft','published')),
  publish_at timestamptz DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS taglines_pub_idx ON public.taglines (locale, status, is_active, publish_at, position);
CREATE INDEX IF NOT EXISTS taglines_locale_pos_idx ON public.taglines (locale, position);

-- ALLOWLIST TABLE + RLS
CREATE TABLE IF NOT EXISTS public.admin_users (
  id bigserial PRIMARY KEY,
  email text UNIQUE NOT NULL,
  role text NOT NULL CHECK (role IN ('viewer','editor','approver','admin')),
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.taglines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES FOR TAGLINES
-- Public can read PUBLISHED taglines
CREATE POLICY "Public read published taglines"
ON public.taglines FOR SELECT
TO anon, authenticated
USING (is_active = true AND status = 'published' AND COALESCE(publish_at, now()) <= now());

-- Allowlisted users can read ALL taglines
CREATE POLICY "Allowlisted can read all taglines"
ON public.taglines FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users au
    WHERE LOWER(au.email) = LOWER((auth.jwt() ->> 'email')::text)
      AND au.active = true
  )
);

-- Insert: editor/approver/admin only
CREATE POLICY "Editors can insert taglines"
ON public.taglines FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.admin_users au
    WHERE LOWER(au.email) = LOWER((auth.jwt() ->> 'email')::text)
      AND au.active = true
      AND au.role IN ('editor','approver','admin')
  )
);

-- Update: role-aware permissions
CREATE POLICY "Role-aware tagline updates"
ON public.taglines FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users au
    WHERE LOWER(au.email) = LOWER((auth.jwt() ->> 'email')::text)
      AND au.active = true
  )
)
WITH CHECK (
  (
    status <> 'published'
    AND EXISTS (
      SELECT 1 FROM public.admin_users au
      WHERE LOWER(au.email) = LOWER((auth.jwt() ->> 'email')::text)
        AND au.active = true
        AND au.role IN ('editor','approver','admin')
    )
  ) OR (
    status = 'published'
    AND EXISTS (
      SELECT 1 FROM public.admin_users au
      WHERE LOWER(au.email) = LOWER((auth.jwt() ->> 'email')::text)
        AND au.active = true
        AND au.role IN ('approver','admin')
    )
  )
);

-- Delete: admin only
CREATE POLICY "Admins delete taglines"
ON public.taglines FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users au
    WHERE LOWER(au.email) = LOWER((auth.jwt() ->> 'email')::text)
      AND au.active = true
      AND au.role = 'admin'
  )
);

-- RLS POLICIES FOR ADMIN_USERS
-- Self can read own role
CREATE POLICY "Self read admin role"
ON public.admin_users FOR SELECT
TO authenticated
USING (LOWER(email) = LOWER((auth.jwt() ->> 'email')::text));

-- Admins manage allowlist
CREATE POLICY "Admins manage allowlist"
ON public.admin_users FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users au
    WHERE LOWER(au.email) = LOWER((auth.jwt() ->> 'email')::text)
      AND au.role = 'admin' 
      AND au.active = true
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.admin_users au
    WHERE LOWER(au.email) = LOWER((auth.jwt() ->> 'email')::text)
      AND au.role = 'admin' 
      AND au.active = true
  )
);

-- Seed initial admin user and taglines
INSERT INTO public.admin_users (email, role, active) VALUES
('admin@keys-pay.com','admin',true),
('tito.guevara@gmail.com','admin',true)
ON CONFLICT (email) DO UPDATE SET 
  role = EXCLUDED.role, 
  active = EXCLUDED.active;

-- Seed default taglines
INSERT INTO public.taglines (locale, text, position, is_active, status, publish_at) VALUES
('en','Money that Builds Tomorrow.',10,true,'published',now()),
('en','Move Money. Live Freely.',20,true,'published',now()),
('en','Money that Moves with You.',30,true,'published',now()),
('en','Money in One Tap.',40,true,'published',now()),
('en','Money Without Borders.',50,true,'published',now()),
('en','Secure Money, Seamless Life.',60,true,'published',now()),
('ar','المال الذي يبني الغد.',10,true,'published',now()),
('ar','حرّك مالك. عِش بحرية.',20,true,'published',now()),
('ar','المال الذي يتحرك معك.',30,true,'published',now()),
('ar','أموالك بلمسة واحدة.',40,true,'published',now()),
('ar','المال بلا حدود.',50,true,'published',now()),
('ar','مال آمن، حياة سلسة.',60,true,'published',now())
ON CONFLICT DO NOTHING;