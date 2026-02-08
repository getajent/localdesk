'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

export function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false);
    const t = useTranslations('CookieConsent');

    useEffect(() => {
        // Check if consent has already been given/declined
        const consent = localStorage.getItem('cookie-consent');
        if (!consent) {
            // Small delay for better UX
            const timer = setTimeout(() => setIsVisible(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleConsent = (status: 'accepted' | 'declined') => {
        localStorage.setItem('cookie-consent', status);

        // Update Google Ads Consent Mode
        if (typeof window.gtag === 'function') {
            window.gtag('consent', 'update', {
                'ad_storage': status === 'accepted' ? 'granted' : 'denied',
                'ad_user_data': status === 'accepted' ? 'granted' : 'denied',
                'ad_personalization': status === 'accepted' ? 'granted' : 'denied',
                'analytics_storage': status === 'accepted' ? 'granted' : 'denied'
            });
        }

        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6"
                >
                    <div className="max-w-4xl mx-auto bg-background/95 backdrop-blur-xl border border-border/40 shadow-2xl rounded-none md:rounded-lg p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex-1 space-y-2 text-center md:text-left">
                            <h3 className="text-[10px] font-black tracking-[0.2em] text-danish-red uppercase">
                                {t('title')}
                            </h3>
                            <p className="text-sm text-muted-foreground font-light leading-relaxed max-w-2xl">
                                {t('description')}{' '}
                                <Link
                                    href="/privacy"
                                    className="text-foreground font-medium underline underline-offset-4 hover:text-danish-red transition-colors"
                                >
                                    {t('privacyPolicy')}
                                </Link>
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                            <Button
                                variant="outline"
                                onClick={() => handleConsent('declined')}
                                className="w-full sm:w-auto px-8 rounded-none border-border/60 text-xs font-bold tracking-widest uppercase hover:bg-secondary transition-all"
                            >
                                {t('decline')}
                            </Button>
                            <Button
                                onClick={() => handleConsent('accepted')}
                                className="w-full sm:w-auto px-8 rounded-none bg-danish-red hover:bg-danish-red/90 text-white text-xs font-bold tracking-widest uppercase transition-all shadow-lg shadow-danish-red/20"
                            >
                                {t('accept')}
                            </Button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// Add global type for gtag
declare global {
    interface Window {
        gtag: (...args: any[]) => void;
    }
}
