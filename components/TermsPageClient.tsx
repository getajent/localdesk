'use client';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { useTranslations, useFormatter } from 'next-intl';

export function TermsPageClient() {
  const t = useTranslations('TermsPage');
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
                    {t('sections.acceptance.title')}
                  </h2>
                </div>
                <div className="pl-6 space-y-4 text-foreground/70 leading-relaxed">
                  <p>
                    {t('sections.acceptance.content')}
                  </p>
                </div>
              </div>

              {/* Section 2 */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-danish-red" />
                  <h2 className="font-serif text-3xl sm:text-4xl font-medium text-foreground tracking-tight">
                    {t('sections.serviceDescription.title')}
                  </h2>
                </div>
                <div className="pl-6 space-y-4 text-foreground/70 leading-relaxed">
                  <p>
                    {t('sections.serviceDescription.content')}
                  </p>
                </div>
              </div>

              {/* Section 3 */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-danish-red" />
                  <h2 className="font-serif text-3xl sm:text-4xl font-medium text-foreground tracking-tight">
                    {t('sections.userAccounts.title')}
                  </h2>
                </div>
                <div className="pl-6 space-y-4 text-foreground/70 leading-relaxed">
                  <p>
                    {t('sections.userAccounts.intro')}
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>{t('sections.userAccounts.items.confidentiality')}</li>
                    <li>{t('sections.userAccounts.items.activities')}</li>
                    <li>{t('sections.userAccounts.items.unauthorized')}</li>
                    <li>{t('sections.userAccounts.items.accurate')}</li>
                  </ul>
                </div>
              </div>

              {/* Section 4 */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-danish-red" />
                  <h2 className="font-serif text-3xl sm:text-4xl font-medium text-foreground tracking-tight">
                    {t('sections.acceptableUse.title')}
                  </h2>
                </div>
                <div className="pl-6 space-y-4 text-foreground/70 leading-relaxed">
                  <p>
                    {t('sections.acceptableUse.intro')}
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>{t('sections.acceptableUse.items.illegal')}</li>
                    <li>{t('sections.acceptableUse.items.access')}</li>
                    <li>{t('sections.acceptableUse.items.interfere')}</li>
                    <li>{t('sections.acceptableUse.items.automated')}</li>
                    <li>{t('sections.acceptableUse.items.malicious')}</li>
                    <li>{t('sections.acceptableUse.items.impersonate')}</li>
                  </ul>
                </div>
              </div>

              {/* Section 5 */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-danish-red" />
                  <h2 className="font-serif text-3xl sm:text-4xl font-medium text-foreground tracking-tight">
                    {t('sections.intellectualProperty.title')}
                  </h2>
                </div>
                <div className="pl-6 space-y-4 text-foreground/70 leading-relaxed">
                  <p>
                    {t('sections.intellectualProperty.content')}
                  </p>
                </div>
              </div>

              {/* Section 6 */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-danish-red" />
                  <h2 className="font-serif text-3xl sm:text-4xl font-medium text-foreground tracking-tight">
                    {t('sections.dataPrivacy.title')}
                  </h2>
                </div>
                <div className="pl-6 space-y-4 text-foreground/70 leading-relaxed">
                  <p>
                    {t('sections.dataPrivacy.content')}
                  </p>
                </div>
              </div>

              {/* Section 7 */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-danish-red" />
                  <h2 className="font-serif text-3xl sm:text-4xl font-medium text-foreground tracking-tight">
                    {t('sections.disclaimerWarranties.title')}
                  </h2>
                </div>
                <div className="pl-6 space-y-4 text-foreground/70 leading-relaxed">
                  <p>
                    {t('sections.disclaimerWarranties.intro')}
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>{t('sections.disclaimerWarranties.items.uninterrupted')}</li>
                    <li>{t('sections.disclaimerWarranties.items.accurate')}</li>
                    <li>{t('sections.disclaimerWarranties.items.requirements')}</li>
                    <li>{t('sections.disclaimerWarranties.items.corrected')}</li>
                  </ul>
                </div>
              </div>

              {/* Section 8 */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-danish-red" />
                  <h2 className="font-serif text-3xl sm:text-4xl font-medium text-foreground tracking-tight">
                    {t('sections.limitationLiability.title')}
                  </h2>
                </div>
                <div className="pl-6 space-y-4 text-foreground/70 leading-relaxed">
                  <p>
                    {t('sections.limitationLiability.content')}
                  </p>
                </div>
              </div>

              {/* Section 9 */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-danish-red" />
                  <h2 className="font-serif text-3xl sm:text-4xl font-medium text-foreground tracking-tight">
                    {t('sections.termination.title')}
                  </h2>
                </div>
                <div className="pl-6 space-y-4 text-foreground/70 leading-relaxed">
                  <p>
                    {t('sections.termination.intro')}
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>{t('sections.termination.items.violates')}</li>
                    <li>{t('sections.termination.items.harmful')}</li>
                    <li>{t('sections.termination.items.liability')}</li>
                  </ul>
                  <p>
                    {t('sections.termination.userTermination')}
                  </p>
                </div>
              </div>

              {/* Section 10 */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-danish-red" />
                  <h2 className="font-serif text-3xl sm:text-4xl font-medium text-foreground tracking-tight">
                    {t('sections.changesTerms.title')}
                  </h2>
                </div>
                <div className="pl-6 space-y-4 text-foreground/70 leading-relaxed">
                  <p>
                    {t('sections.changesTerms.intro')}
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>{t('sections.changesTerms.items.posting')}</li>
                    <li>{t('sections.changesTerms.items.date')}</li>
                    <li>{t('sections.changesTerms.items.email')}</li>
                  </ul>
                  <p>
                    {t('sections.changesTerms.acceptance')}
                  </p>
                </div>
              </div>

              {/* Section 11 */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-danish-red" />
                  <h2 className="font-serif text-3xl sm:text-4xl font-medium text-foreground tracking-tight">
                    {t('sections.governingLaw.title')}
                  </h2>
                </div>
                <div className="pl-6 space-y-4 text-foreground/70 leading-relaxed">
                  <p>
                    {t('sections.governingLaw.content')}
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
        </section>
      </main>

      <Footer />
    </div>
  );
}
