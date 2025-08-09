import React, { useEffect } from 'react';
import Navigation from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import SumsubKYC from '@/components/SumsubKYC';

function upsertMeta(name: string, content: string) {
  const existing = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
  if (existing) {
    existing.content = content;
  } else {
    const tag = document.createElement('meta');
    tag.name = name;
    tag.content = content;
    document.head.appendChild(tag);
  }
}

function upsertLink(rel: string, href: string) {
  const existing = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (existing) {
    existing.href = href;
  } else {
    const tag = document.createElement('link');
    tag.rel = rel;
    tag.href = href;
    document.head.appendChild(tag);
  }
}

const KYC: React.FC = () => {
  useEffect(() => {
    document.title = 'KYC Verification | AIKEYS Financial';
    upsertMeta('description', 'Start your KYC verification securely with Sumsub WebSDK.');
    upsertLink('canonical', window.location.origin + '/kyc');
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold">KYC Verification</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Verify your identity to unlock full account features. Click "Start KYC" below.
          </p>
        </header>

        <section aria-labelledby="kyc-section">
          <article id="kyc-section" className="space-y-4">
            <SumsubKYC />
          </article>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default KYC;
