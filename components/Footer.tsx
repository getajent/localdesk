'use client';

import { Logo } from '@/components/Logo';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export function Footer() {
  const t = useTranslations('Common.footer');
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-foreground text-background py-16 sm:py-20 md:py-24 lg:py-32 dark:bg-card dark:text-foreground border-t border-border/40">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16 md:gap-20 lg:gap-24 items-start">
          {/* Brand/Legal */}
          <div className="lg:col-span-6 space-y-12">
            <Logo light />
            <div className="space-y-6">
              <p className="text-background/60 dark:text-muted-foreground text-sm max-w-sm font-light leading-relaxed font-sans">
                {t('tagline')}
              </p>
              <div className="flex items-center gap-6">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black tracking-widest uppercase text-background dark:text-foreground">{t('location')}</span>
                  <span className="text-xs text-background/60 dark:text-muted-foreground tracking-[0.3em] uppercase">{t('locationValue')}</span>
                </div>
                <div className="w-[1px] h-8 bg-background/20 dark:bg-border" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-black tracking-widest uppercase text-background dark:text-foreground">{t('contact')}</span>
                  <span className="text-xs text-background/60 dark:text-muted-foreground">{t('contactEmail')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Links Grid */}
          <div className="lg:col-span-6 grid grid-cols-2 md:grid-cols-3 gap-12 text-background dark:text-foreground">
            <div className="space-y-6">
              <h4 className="text-[10px] font-black tracking-[0.3em] uppercase text-background/50 dark:text-muted-foreground">{t('resourcesTitle')}</h4>
              <ul className="space-y-3">
                <li><a href="https://skat.dk/" target="_blank" rel="noopener noreferrer" className="text-xs font-medium hover:text-danish-red transition-colors uppercase tracking-widest">{t('resourceSkat')}</a></li>
                <li><a href="https://www.nyidanmark.dk/en-GB" target="_blank" rel="noopener noreferrer" className="text-xs font-medium hover:text-danish-red transition-colors uppercase tracking-widest">{t('resourceImmigration')}</a></li>
                <li><a href="https://www.borger.dk/english" target="_blank" rel="noopener noreferrer" className="text-xs font-medium hover:text-danish-red transition-colors uppercase tracking-widest">{t('resourceBorger')}</a></li>
                <li><a href="https://www.workindenmark.dk/" target="_blank" rel="noopener noreferrer" className="text-xs font-medium hover:text-danish-red transition-colors uppercase tracking-widest">{t('resourceWork')}</a></li>
              </ul>
            </div>
            <div className="space-y-6">
              <h4 className="text-[10px] font-black tracking-[0.3em] uppercase text-background/50 dark:text-muted-foreground">{t('servicesTitle')}</h4>
              <ul className="space-y-3">
                <li><a href="https://www.sundhed.dk/borger/" target="_blank" rel="noopener noreferrer" className="text-xs font-medium hover:text-danish-red transition-colors uppercase tracking-widest">{t('serviceHealthcare')}</a></li>
                <li><a href="https://www.mitid.dk/en-gb/" target="_blank" rel="noopener noreferrer" className="text-xs font-medium hover:text-danish-red transition-colors uppercase tracking-widest">{t('serviceMitID')}</a></li>
                <li><a href="https://private.e-boks.com/danmark/en" target="_blank" rel="noopener noreferrer" className="text-xs font-medium hover:text-danish-red transition-colors uppercase tracking-widest">{t('serviceEBoks')}</a></li>
                <li><a href="https://international.kk.dk/" target="_blank" rel="noopener noreferrer" className="text-xs font-medium hover:text-danish-red transition-colors uppercase tracking-widest">{t('serviceCPH')}</a></li>
              </ul>
            </div>
            <div className="space-y-6">
              <h4 className="text-[10px] font-black tracking-[0.3em] uppercase text-background/50 dark:text-muted-foreground">{t('legalTitle')}</h4>
              <ul className="space-y-3">
                <li><Link href="/privacy" className="text-xs font-medium hover:text-danish-red transition-colors uppercase tracking-widest">{t('privacy')}</Link></li>
                <li><Link href="/terms" className="text-xs font-medium hover:text-danish-red transition-colors uppercase tracking-widest">{t('terms')}</Link></li>
              </ul>
              <h4 className="text-[10px] font-black tracking-[0.3em] uppercase text-background/50 dark:text-muted-foreground mt-8">{t('connectTitle')}</h4>
              <ul className="space-y-3">
                <li><a href={`mailto:${t('contactEmail')}`} className="text-xs font-medium hover:text-danish-red transition-colors uppercase tracking-widest">{t('contactLink')}</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-background/10 dark:border-border/40 mt-32 pt-12 flex flex-col md:flex-row justify-between items-center gap-8">
          <span className="text-[10px] font-black tracking-[0.5em] uppercase text-background/40 dark:text-muted-foreground/40">
            {t('copyright', { year: currentYear })}
          </span>
          <div className="flex items-center gap-4">
            <div className="w-2 h-2 rounded-full bg-danish-red" />
            <span className="text-[10px] font-black tracking-[0.8em] uppercase text-background/40 dark:text-muted-foreground/40">
              {t('heritage')}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
