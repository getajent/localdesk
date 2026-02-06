'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { useTransition, useState, useRef, useEffect } from 'react';
import { localeConfigs } from '@/i18n/locales';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown when scrolling (header will hide)
  useEffect(() => {
    if (!isOpen) return;

    function handleScroll() {
      setIsOpen(false);
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isOpen]);

  function onSelect(newLocale: string) {
    setIsOpen(false);
    startTransition(() => {
      router.replace(pathname, { locale: newLocale });
    });
  }

  const currentLocaleConfig = localeConfigs.find(l => l.code === locale) || localeConfigs[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        className={cn(
          "flex items-center gap-2 h-9 px-3 text-[9px] font-black uppercase tracking-[0.15em]",
          "bg-background border border-border transition-all cursor-pointer",
          "hover:border-danish-red/40 hover:bg-danish-red/5",
          isOpen && "border-danish-red/40 bg-danish-red/5",
          isPending && "opacity-50 cursor-not-allowed"
        )}
        aria-label="Select language"
        aria-expanded={isOpen}
      >
        <span className="truncate">{currentLocaleConfig.nativeName}</span>
        <ChevronDown className={cn("h-3 w-3 opacity-50 transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-1 w-[140px] bg-card/95 backdrop-blur-xl border border-border/40 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-100">
          <div className="py-1">
            {localeConfigs.map((lang) => (
              <button
                key={lang.code}
                onClick={() => onSelect(lang.code)}
                className={cn(
                  "w-full text-left px-4 py-2.5 text-[9px] font-bold uppercase tracking-wider flex items-center justify-between",
                  "hover:bg-danish-red/10 hover:text-danish-red transition-colors",
                  locale === lang.code ? "text-danish-red bg-danish-red/5" : "text-muted-foreground"
                )}
              >
                {lang.nativeName}
                {locale === lang.code && <Check className="h-3 w-3 ml-2" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
