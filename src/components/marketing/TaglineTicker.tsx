'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';

type Props = { 
  sticky?: boolean; 
  height?: number; 
  insideHeader?: boolean; 
};

export default function TaglineTicker({ 
  sticky = true, 
  height = 44, 
  insideHeader = false 
}: Props) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language.startsWith('ar');
  const [items, setItems] = useState<string[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    
    const fetchTaglines = async () => {
      try {
        const now = new Date().toISOString();
        const { data, error } = await supabase
          .from('taglines')
          .select('text, position')
          .eq('locale', i18n.language.startsWith('ar') ? 'ar' : 'en')
          .eq('is_active', true)
          .eq('status', 'published')
          .lte('publish_at', now)
          .order('position', { ascending: true });

        if (!cancelled) {
          const taglines = data?.map(item => item.text) || [];
          setItems(taglines.length ? taglines : null);
        }
      } catch (error) {
        console.error('Error fetching taglines:', error);
        if (!cancelled) setItems(null);
      }
    };

    fetchTaglines();
    return () => { cancelled = true; };
  }, [i18n.language]);

  const fallbackItems = useMemo(
    () => t('taglineTicker.fallbackItems').split('·').map(s => s.trim()).filter(Boolean),
    [t]
  );
  
  const list = items && items.length ? items : fallbackItems;

  const aria = t('taglineTicker.labels.aria');
  const pauseTitle = t('taglineTicker.labels.pause');
  const toggleTitle = t('taglineTicker.labels.toggle'); 
  const toggleText = isRTL ? t('taglineTicker.labels.toEN') : t('taglineTicker.labels.toAR');

  const toggleLanguage = () => {
    const newLang = isRTL ? 'en' : 'ar';
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
  };

  return (
    <section
      role="region"
      aria-label={aria}
      className={[
        'group/ticker w-full overflow-hidden bg-primary text-primary-foreground relative',
        sticky && !insideHeader ? 'sticky top-0 z-40' : '',
        insideHeader ? 'relative' : 'relative'
      ].join(' ')}
      style={{ height: `${height}px` }}
    >
      {/* Fade mask */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
          maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)'
        }}
      />
      
      {/* Scrolling content */}
      <div className="absolute inset-0 flex items-center">
        <div className="marquee flex items-center whitespace-nowrap will-change-transform">
          <ul className="marqueeGroup flex items-center gap-6 pr-6">
            {list.map((txt, i) => (
              <li 
                key={`a-${i}`} 
                className="rounded-full border border-white/15 bg-white/5 px-4 py-1 text-sm leading-none shadow-sm backdrop-blur-sm"
              >
                {txt}
              </li>
            ))}
          </ul>
          <ul className="marqueeGroup flex items-center gap-6 pr-6" aria-hidden="true">
            {list.map((txt, i) => (
              <li 
                key={`b-${i}`} 
                className="rounded-full border border-white/15 bg-white/5 px-4 py-1 text-sm leading-none shadow-sm backdrop-blur-sm"
              >
                {txt}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-2">
        <button
          type="button" 
          aria-label={pauseTitle} 
          title={pauseTitle}
          className="rounded-full border border-white/15 bg-white/10 px-2 py-0.5 text-[11px] leading-none hover:bg-white/20 transition-colors"
          onMouseEnter={(e) => { 
            (e.currentTarget.closest('section') as HTMLElement)?.style.setProperty('--ticker-playstate', 'paused'); 
          }}
          onMouseLeave={(e) => { 
            (e.currentTarget.closest('section') as HTMLElement)?.style.setProperty('--ticker-playstate', 'running'); 
          }}
        >
          ⏸︎
        </button>
        <button 
          onClick={toggleLanguage}
          aria-label={toggleTitle} 
          title={toggleTitle}
          className="rounded-full border border-white/15 bg-white/10 px-2 py-0.5 text-[11px] leading-none hover:bg-white/20 transition-colors"
        >
          {toggleText}
        </button>
      </div>

    </section>
  );
}