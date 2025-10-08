-- Create financial_lessons table for Shariah-compliant financial education
CREATE TABLE IF NOT EXISTS public.financial_lessons (
  id TEXT PRIMARY KEY,
  track TEXT NOT NULL,
  lesson_number INTEGER NOT NULL,
  title_en TEXT NOT NULL,
  title_ar TEXT NOT NULL,
  trigger TEXT NOT NULL,
  copy_en TEXT NOT NULL,
  copy_ar TEXT NOT NULL,
  cta_en TEXT NOT NULL,
  cta_ar TEXT NOT NULL,
  primary_metric TEXT NOT NULL,
  
  -- Shariah compliance fields
  shariah_compatible BOOLEAN NOT NULL DEFAULT true,
  shariah_notes_en TEXT DEFAULT '',
  shariah_notes_ar TEXT DEFAULT '',
  shariah_prohibited_flags TEXT[] DEFAULT '{}',
  shariah_alternative_en TEXT DEFAULT '',
  shariah_alternative_ar TEXT DEFAULT '',
  
  -- Metadata
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- Constraints
  CONSTRAINT unique_track_lesson UNIQUE (track, lesson_number),
  CONSTRAINT valid_lesson_number CHECK (lesson_number > 0)
);

-- Create user_lesson_progress table
CREATE TABLE IF NOT EXISTS public.user_lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id TEXT NOT NULL REFERENCES public.financial_lessons(id) ON DELETE CASCADE,
  completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMPTZ,
  action_taken BOOLEAN NOT NULL DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  CONSTRAINT unique_user_lesson UNIQUE (user_id, lesson_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_financial_lessons_track ON public.financial_lessons(track);
CREATE INDEX IF NOT EXISTS idx_financial_lessons_active ON public.financial_lessons(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_user_lesson_progress_user ON public.user_lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_lesson_progress_completed ON public.user_lesson_progress(completed);

-- Enable RLS
ALTER TABLE public.financial_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_lesson_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies for financial_lessons (public read for authenticated users)
CREATE POLICY "Anyone can view active lessons"
  ON public.financial_lessons
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage lessons"
  ON public.financial_lessons
  FOR ALL
  USING (is_admin());

-- RLS Policies for user_lesson_progress
CREATE POLICY "Users can view their own progress"
  ON public.user_lesson_progress
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress"
  ON public.user_lesson_progress
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
  ON public.user_lesson_progress
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_financial_lessons_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_financial_lessons_timestamp
  BEFORE UPDATE ON public.financial_lessons
  FOR EACH ROW
  EXECUTE FUNCTION update_financial_lessons_updated_at();

CREATE TRIGGER update_user_lesson_progress_timestamp
  BEFORE UPDATE ON public.user_lesson_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_financial_lessons_updated_at();

-- Insert sample Shariah-compliant lessons
INSERT INTO public.financial_lessons (id, track, lesson_number, title_en, title_ar, trigger, copy_en, copy_ar, cta_en, cta_ar, primary_metric, shariah_compatible, shariah_notes_en, shariah_alternative_en) VALUES
('emergency-fund-101', 'savings', 1, 'Build Your Emergency Fund', 'بناء صندوق الطوارئ الخاص بك', 'low_savings', 
'Start building financial security with an emergency fund. Aim for 3-6 months of expenses in a Shariah-compliant savings account.',
'ابدأ ببناء الأمان المالي من خلال صندوق الطوارئ. اهدف إلى توفير 3-6 أشهر من النفقات في حساب توفير متوافق مع الشريعة.',
'Start Saving Today', 'ابدأ التوفير اليوم', 'savings_rate', true, '', ''),

('halal-investing-basics', 'investment', 1, 'Halal Investing Principles', 'مبادئ الاستثمار الحلال', 'no_investments',
'Learn the fundamentals of Shariah-compliant investing. Avoid riba (interest), gharar (uncertainty), and maysir (gambling).',
'تعلم أساسيات الاستثمار المتوافق مع الشريعة. تجنب الربا والغرر والميسر.',
'Explore Halal Options', 'استكشف الخيارات الحلال', 'investment_growth', true, '', ''),

('zakat-calculator', 'zakat', 1, 'Calculate Your Zakat', 'احسب زكاتك', 'wealth_threshold',
'Fulfill your Islamic obligation by calculating and paying Zakat. Our calculator helps you determine the exact amount based on your assets.',
'أوف بالتزامك الإسلامي من خلال حساب ودفع الزكاة. يساعدك حاسبنا على تحديد المبلغ الدقيق بناءً على أصولك.',
'Calculate Zakat', 'احسب الزكاة', 'zakat_due', true, '', '');
