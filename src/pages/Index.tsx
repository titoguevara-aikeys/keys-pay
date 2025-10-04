import DarkNavbar from '@/components/marketing/DarkNavbar';
import DarkHero from '@/components/marketing/DarkHero';
import Features from '@/components/marketing/Features';
import Pricing from '@/components/marketing/Pricing';
import FAQ from '@/components/marketing/FAQ';
import Footer from '@/components/marketing/Footer';

export default function Index() {
  return (
    <div className="min-h-screen bg-slate-950">
      <DarkNavbar />
      <main>
        <DarkHero />
        <Features />
        <Pricing />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
