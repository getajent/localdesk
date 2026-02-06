import { Metadata } from 'next';
import { KnowledgeHero } from '@/components/knowledge/KnowledgeHero';
import { KnowledgeCategories } from '@/components/knowledge/KnowledgeCategories';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { AuthProvider } from '@/components/AuthProvider';
import { createClient } from '@/lib/supabase-ssr';

import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'KnowledgePage.metadata' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

const KNOWLEDGE_CATEGORIES = [
  {
    id: 'arrival',
    title: 'Arrival Process',
    description: 'Essential registrations and procedures when you first arrive',
    icon: 'Plane',
    topics: [
      'CPR Number Registration',
      'MitID Setup',
      'Health Insurance Card',
      'GP Registration',
      'Bank Account Opening',
      'Tax Card Application',
      'Digital Post Registration',
      'ICS Centers'
    ],
    documentCount: 10
  },
  {
    id: 'employment',
    title: 'Employment',
    description: 'Working in Denmark: contracts, rights, and workplace culture',
    icon: 'Briefcase',
    topics: [
      'Employment Contracts',
      'Salary and Payslips',
      'Working Hours',
      'Unions and A-kasse',
      'Workplace Rights',
      'Parental Leave'
    ],
    documentCount: 7
  },
  {
    id: 'housing',
    title: 'Housing',
    description: 'Finding, renting, and maintaining your home in Denmark',
    icon: 'Home',
    topics: [
      'Housing Types',
      'Rental Contracts',
      'Deposits and Utilities',
      'Tenant Insurance',
      'Tenant Rights',
      'Moving Procedures'
    ],
    documentCount: 7
  },
  {
    id: 'tax-finance',
    title: 'Tax & Finance',
    description: 'Understanding Danish taxation and managing your finances',
    icon: 'Calculator',
    topics: [
      'Tax System Overview',
      'Income Tax',
      'Tax Deductions',
      'Annual Tax Return',
      'SKAT Registration',
      'Self-Employment Tax'
    ],
    documentCount: 8
  },
  {
    id: 'social-benefits',
    title: 'Social Benefits',
    description: 'Healthcare, pensions, and social support systems',
    icon: 'Heart',
    topics: [
      'Child Benefits',
      'Unemployment Benefits',
      'Parental Leave',
      'Housing Support (Boligstøtte)',
      'Pension System',
      'Student Support (SU)',
      'Disability Benefits',
      'Elderly Care'
    ],
    documentCount: 10
  },
  {
    id: 'essential-services',
    title: 'Essential Services',
    description: 'Healthcare, banking, education, and transportation',
    icon: 'Zap',
    topics: [
      'Healthcare System',
      'Banking Services',
      'Digital Government',
      'Education and Childcare',
      'Transportation'
    ],
    documentCount: 5
  },
  {
    id: 'practical-living',
    title: 'Practical Living',
    description: 'Daily life, culture, and community in Denmark',
    icon: 'Coffee',
    topics: [
      'Cultural Norms',
      'Cycling Culture',
      'Shopping Guide',
      'Dining Culture',
      'Mobile and Internet',
      'Public Holidays',
      'Sports and Recreation',
      'Community Resources',
      'Waste and Recycling'
    ],
    documentCount: 11
  }
];

export default async function KnowledgePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <AuthProvider initialUser={user}>
      <Header />
      <main>
        <KnowledgeHero />
        <KnowledgeCategories categories={KNOWLEDGE_CATEGORIES} />
        <Footer />
      </main>
    </AuthProvider>
  );
}
