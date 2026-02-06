import { Metadata } from 'next';
import { GuidanceHero } from '@/components/guidance/GuidanceHero';
import { GuidanceSteps } from '@/components/guidance/GuidanceSteps';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { AuthProvider } from '@/components/AuthProvider';
import { createClient } from '@/lib/supabase-ssr';

import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'GuidancePage.metadata' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function GuidancePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const t = await getTranslations({ locale, namespace: 'GuidancePage.guides' });

  const guideIds = ['firstWeek', 'essentialServices', 'housingGuide', 'taxGuide', 'healthcareGuide'] as const;

  const guides = guideIds.map(id => {
    const rawSteps = t.raw(`${id}.steps`);
    const steps = Object.keys(rawSteps).map((stepKey, index) => ({
      stepNumber: index + 1,
      title: t(`${id}.steps.${stepKey}.title`),
      description: t(`${id}.steps.${stepKey}.description`),
      details: t.raw(`${id}.steps.${stepKey}.details`),
      relatedDocs: [] // These were hardcoded, but not present in JSON yet. Keeping empty or could add to JSON later.
    }));

    return {
      id,
      title: t(`${id}.title`),
      description: t(`${id}.description`),
      duration: t(`${id}.duration`),
      steps
    };
  });

  return (
    <AuthProvider initialUser={user}>
      <Header />
      <main>
        <GuidanceHero />
        <GuidanceSteps guides={guides} />
        <Footer />
      </main>
    </AuthProvider>
  );
}

