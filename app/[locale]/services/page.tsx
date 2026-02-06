import { Metadata } from 'next';
import { ServicesHero } from '@/components/services/ServicesHero';
import { ServicesGrid } from '@/components/services/ServicesGrid';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { AuthProvider } from '@/components/AuthProvider';
import { createClient } from '@/lib/supabase-ssr';

export const metadata: Metadata = {
  title: 'Services | LocalDesk Denmark',
  description: 'Expert guidance and support for expats settling in Denmark. From CPR registration to tax guidance, housing search, and personalized consulting.',
};

const SERVICES_DATA = [
  { id: 'consulting' },
  { id: 'documents' },
  { id: 'relocation' },
  { id: 'ongoing' }
];

export default async function ServicesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <AuthProvider initialUser={user}>
      <Header />
      <main>
        <ServicesHero />
        <ServicesGrid services={SERVICES_DATA} />
        <Footer />
      </main>
    </AuthProvider>
  );
}
