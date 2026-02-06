'use client';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Link } from '@/i18n/navigation';
import { useTranslations, useFormatter } from 'next-intl';

export function PrivacyPageClient() {
  const t = useTranslations('PrivacyPage');
  const tCommon = useTranslations('Common');
  const format = useFormatter();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header onAuthChange={() => { }} />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full bg-background py-24 sm:py-32 border-b border-border/40">
          <div className="container mx-auto px-4 sm:px-6 lg:px-12">
            <div className="max-w-4xl mx-auto space-y-8">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-muted-foreground hover:text-danish-red transition-colors"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                {tCommon('nav.backToHome')}
              </Link>

              <div className="space-y-6">
                <span className="px-3 py-1 rounded-full bg-secondary text-primary text-[10px] font-bold tracking-widest uppercase border border-primary/5">
                  {tCommon('footer.legal')}
                </span>
                <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-medium text-foreground tracking-tight leading-tight">
                  {t('title')}
                </h1>
                <p className="text-muted-foreground text-xl sm:text-2xl leading-relaxed font-sans font-light">
                  {t('lastUpdated', {
                    date: format.dateTime(new Date('2026-02-05'), {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })
                  })}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="w-full bg-background py-24 sm:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-12">
            <div className="max-w-4xl mx-auto space-y-16">

              {/* Introduction */}
              <div className="space-y-6">
                <p className="text-foreground/80 text-lg leading-relaxed font-light">
                  {t('introduction')}
                </p>
              </div>

              {/* Section 1 */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-danish-red" />
                  <h2 className="font-serif text-3xl sm:text-4xl font-medium text-foreground tracking-tight">
                    {t('sections.dataCollection.title')}
                  </h2>
                </div>
                <div className="pl-6 space-y-6 text-foreground/70 leading-relaxed">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-foreground">{t('sections.dataCollection.personalInfo.title')}</h3>
                    <p>{t('sections.dataCollection.personalInfo.intro')}</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>{t('sections.dataCollection.personalInfo.items.email')}</li>
                      <li>{t('sections.dataCollection.personalInfo.items.displayName')}</li>
                      <li>{t('sections.dataCollection.personalInfo.items.profile')}</li>
                      <li>{t('sections.dataCollection.personalInfo.items.credentials')}</li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-foreground">{t('sections.dataCollection.usageInfo.title')}</h3>
                    <p>{t('sections.dataCollection.usageInfo.intro')}</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>{t('sections.dataCollection.usageInfo.items.chat')}</li>
                      <li>{t('sections.dataCollection.usageInfo.items.usage')}</li>
                      <li>{t('sections.dataCollection.usageInfo.items.device')}</li>
                      <li>{t('sections.dataCollection.usageInfo.items.ip')}</li>
                      <li>{t('sections.dataCollection.usageInfo.items.cookies')}</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Section 2 */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-danish-red" />
                  <h2 className="font-serif text-3xl sm:text-4xl font-medium text-foreground tracking-tight">
                    {t('sections.dataUse.title')}
                  </h2>
                </div>
                <div className="pl-6 space-y-4 text-foreground/70 leading-relaxed">
                  <p>{t('sections.dataUse.intro')}</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>{t('sections.dataUse.items.provide')}</li>
                    <li>{t('sections.dataUse.items.personalize')}</li>
                    <li>{t('sections.dataUse.items.process')}</li>
                    <li>{t('sections.dataUse.items.notify')}</li>
                    <li>{t('sections.dataUse.items.analyze')}</li>
                    <li>{t('sections.dataUse.items.prevent')}</li>
                    <li>{t('sections.dataUse.items.comply')}</li>
                  </ul>
                </div>
              </div>

              {/* Section 3 */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-danish-red" />
                  <h2 className="font-serif text-3xl sm:text-4xl font-medium text-foreground tracking-tight">
                    {t('sections.legalBasis.title')}
                  </h2>
                </div>
                <div className="pl-6 space-y-4 text-foreground/70 leading-relaxed">
                  <p>{t('sections.legalBasis.intro')}</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>{t('sections.legalBasis.items.consent').split(':')[0]}:</strong> {t('sections.legalBasis.items.consent').split(':').slice(1).join(':')}</li>
                    <li><strong>{t('sections.legalBasis.items.contract').split(':')[0]}:</strong> {t('sections.legalBasis.items.contract').split(':').slice(1).join(':')}</li>
                    <li><strong>{t('sections.legalBasis.items.legal').split(':')[0]}:</strong> {t('sections.legalBasis.items.legal').split(':').slice(1).join(':')}</li>
                    <li><strong>{t('sections.legalBasis.items.legitimate').split(':')[0]}:</strong> {t('sections.legalBasis.items.legitimate').split(':').slice(1).join(':')}</li>
                  </ul>
                </div>
              </div>

              {/* Section 4 */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-danish-red" />
                  <h2 className="font-serif text-3xl sm:text-4xl font-medium text-foreground tracking-tight">
                    {t('sections.dataSharing.title')}
                  </h2>
                </div>
                <div className="pl-6 space-y-6 text-foreground/70 leading-relaxed">
                  <p>{t('sections.dataSharing.intro')}</p>
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-foreground">{t('sections.dataSharing.serviceProviders.title')}</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>{t('sections.dataSharing.serviceProviders.items.supabase')}</li>
                      <li>{t('sections.dataSharing.serviceProviders.items.openai')}</li>
                      <li>{t('sections.dataSharing.serviceProviders.items.hosting')}</li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-foreground">{t('sections.dataSharing.legal.title')}</h3>
                    <p>{t('sections.dataSharing.legal.description')}</p>
                  </div>
                </div>
              </div>

              {/* Section 5 */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-danish-red" />
                  <h2 className="font-serif text-3xl sm:text-4xl font-medium text-foreground tracking-tight">
                    {t('sections.dataSecurity.title')}
                  </h2>
                </div>
                <div className="pl-6 space-y-4 text-foreground/70 leading-relaxed">
                  <p>
                    {t('sections.dataSecurity.intro')}
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>{t('sections.dataSecurity.items.encryption')}</li>
                    <li>{t('sections.dataSecurity.items.database')}</li>
                    <li>{t('sections.dataSecurity.items.audits')}</li>
                    <li>{t('sections.dataSecurity.items.datacenters')}</li>
                  </ul>
                  <p className="mt-4">
                    {t('sections.dataSecurity.disclaimer')}
                  </p>
                </div>
              </div>

              {/* Section 6 */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-danish-red" />
                  <h2 className="font-serif text-3xl sm:text-4xl font-medium text-foreground tracking-tight">
                    {t('sections.userRights.title')}
                  </h2>
                </div>
                <div className="pl-6 space-y-4 text-foreground/70 leading-relaxed">
                  <p>{t('sections.userRights.intro')}</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>{t('sections.userRights.items.access').split(':')[0]}:</strong> {t('sections.userRights.items.access').split(':').slice(1).join(':')}</li>
                    <li><strong>{t('sections.userRights.items.rectification').split(':')[0]}:</strong> {t('sections.userRights.items.rectification').split(':').slice(1).join(':')}</li>
                    <li><strong>{t('sections.userRights.items.erasure').split(':')[0]}:</strong> {t('sections.userRights.items.erasure').split(':').slice(1).join(':')}</li>
                    <li><strong>{t('sections.userRights.items.restrict').split(':')[0]}:</strong> {t('sections.userRights.items.restrict').split(':').slice(1).join(':')}</li>
                    <li><strong>{t('sections.userRights.items.portability').split(':')[0]}:</strong> {t('sections.userRights.items.portability').split(':').slice(1).join(':')}</li>
                    <li><strong>{t('sections.userRights.items.object').split(':')[0]}:</strong> {t('sections.userRights.items.object').split(':').slice(1).join(':')}</li>
                    <li><strong>{t('sections.userRights.items.withdraw').split(':')[0]}:</strong> {t('sections.userRights.items.withdraw').split(':').slice(1).join(':')}</li>
                  </ul>
                  <p className="mt-4">
                    {t('sections.userRights.contact')}
                  </p>
                </div>
              </div>

              {/* Section 7 */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-danish-red" />
                  <h2 className="font-serif text-3xl sm:text-4xl font-medium text-foreground tracking-tight">
                    {t('sections.cookies.title')}
                  </h2>
                </div>
                <div className="pl-6 space-y-4 text-foreground/70 leading-relaxed">
                  <p>{t('sections.cookies.intro')}</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>{t('sections.cookies.items.session')}</li>
                    <li>{t('sections.cookies.items.preferences')}</li>
                    <li>{t('sections.cookies.items.analyze')}</li>
                    <li>{t('sections.cookies.items.improve')}</li>
                  </ul>
                  <p className="mt-4">
                    {t('sections.cookies.control')}
                  </p>
                </div>
              </div>

              {/* Section 8 */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-danish-red" />
                  <h2 className="font-serif text-3xl sm:text-4xl font-medium text-foreground tracking-tight">
                    {t('sections.dataRetention.title')}
                  </h2>
                </div>
                <div className="pl-6 space-y-4 text-foreground/70 leading-relaxed">
                  <p>
                    {t('sections.dataRetention.intro')}
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>{t('sections.dataRetention.items.account')}</li>
                    <li>{t('sections.dataRetention.items.chat')}</li>
                    <li>{t('sections.dataRetention.items.logs')}</li>
                    <li>{t('sections.dataRetention.items.legal')}</li>
                  </ul>
                  <p className="mt-4">
                    {t('sections.dataRetention.deletion')}
                  </p>
                </div>
              </div>

              {/* Section 9 */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-danish-red" />
                  <h2 className="font-serif text-3xl sm:text-4xl font-medium text-foreground tracking-tight">
                    {t('sections.internationalTransfers.title')}
                  </h2>
                </div>
                <div className="pl-6 space-y-4 text-foreground/70 leading-relaxed">
                  <p>
                    {t('sections.internationalTransfers.intro')}
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>{t('sections.internationalTransfers.items.scc')}</li>
                    <li>{t('sections.internationalTransfers.items.adequacy')}</li>
                    <li>{t('sections.internationalTransfers.items.other')}</li>
                  </ul>
                </div>
              </div>

              {/* Section 10 */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-danish-red" />
                  <h2 className="font-serif text-3xl sm:text-4xl font-medium text-foreground tracking-tight">
                    {t('sections.childrenPrivacy.title')}
                  </h2>
                </div>
                <div className="pl-6 space-y-4 text-foreground/70 leading-relaxed">
                  <p>
                    {t('sections.childrenPrivacy.description')}
                  </p>
                </div>
              </div>

              {/* Section 11 */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-danish-red" />
                  <h2 className="font-serif text-3xl sm:text-4xl font-medium text-foreground tracking-tight">
                    {t('sections.policyChanges.title')}
                  </h2>
                </div>
                <div className="pl-6 space-y-4 text-foreground/70 leading-relaxed">
                  <p>
                    {t('sections.policyChanges.intro')}
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>{t('sections.policyChanges.items.posting')}</li>
                    <li>{t('sections.policyChanges.items.date')}</li>
                    <li>{t('sections.policyChanges.items.email')}</li>
                  </ul>
                  <p className="mt-4">
                    {t('sections.policyChanges.acceptance')}
                  </p>
                </div>
              </div>

              {/* Section 12 */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-danish-red" />
                  <h2 className="font-serif text-3xl sm:text-4xl font-medium text-foreground tracking-tight">
                    {t('sections.contact.title')}
                  </h2>
                </div>
                <div className="pl-6 space-y-4 text-foreground/70 leading-relaxed">
                  <p>
                    {t('sections.contact.intro')}
                  </p>
                  <div className="p-6 border border-border/40 bg-card/50 backdrop-blur-xl space-y-2">
                    <p className="font-medium text-foreground">{t('sections.contact.company')}</p>
                    <p>{t('sections.contact.email')}</p>
                    <p>{t('sections.contact.location')}</p>
                  </div>
                  <p className="mt-4">
                    {t('sections.contact.complaint')}
                  </p>
                </div>
              </div>

              {/* Bottom CTA */}
              <div className="pt-12 border-t border-border/40">
                <div className="p-8 border border-border/40 bg-secondary/30 backdrop-blur-xl space-y-6">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-danish-red" />
                    <h3 className="text-[10px] font-black tracking-[0.2em] text-foreground uppercase">
                      {t('cta.title')}
                    </h3>
                  </div>
                  <p className="text-foreground/70 leading-relaxed">
                    {t('cta.description')}
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Link
                      href="/terms"
                      className="inline-flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-muted-foreground hover:text-danish-red transition-colors"
                    >
                      {t('cta.readTerms')}
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                    <Link
                      href="/"
                      className="inline-flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-danish-red hover:text-danish-red/80 transition-colors"
                    >
                      {t('cta.contactSupport')}
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
