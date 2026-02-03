'use client';

import { Logo } from '@/components/Logo';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-foreground text-background py-24 lg:py-32 dark:bg-card dark:text-foreground border-t border-border/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-24 items-start">
          {/* Brand/Legal */}
          <div className="lg:col-span-6 space-y-12">
            <Logo light />
            <div className="space-y-6">
              <p className="text-background/60 dark:text-muted-foreground text-sm max-w-sm font-light leading-relaxed font-sans">
                A thoughtful digital assistant built to help you navigate and thrive in Denmark's unique administrative landscape.
              </p>
              <div className="flex items-center gap-6">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black tracking-widest uppercase text-background dark:text-foreground">Location</span>
                  <span className="text-xs text-background/60 dark:text-muted-foreground tracking-[0.3em] uppercase">Denmark</span>
                </div>
                <div className="w-[1px] h-8 bg-background/20 dark:bg-border" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-black tracking-widest uppercase text-background dark:text-foreground">Contact</span>
                  <span className="text-xs text-background/60 dark:text-muted-foreground">hello@localdesk.dk</span>
                </div>
              </div>
            </div>
          </div>

          {/* Links Grid */}
          <div className="lg:col-span-6 grid grid-cols-2 md:grid-cols-3 gap-12 text-background dark:text-foreground">
            <div className="space-y-6">
              <h4 className="text-[10px] font-black tracking-[0.3em] uppercase text-background/50 dark:text-muted-foreground">Knowledge</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-xs font-medium hover:text-danish-red transition-colors uppercase tracking-widest">Tax Library</a></li>
                <li><a href="#" className="text-xs font-medium hover:text-danish-red transition-colors uppercase tracking-widest">Visa Guide</a></li>
                <li><a href="#" className="text-xs font-medium hover:text-danish-red transition-colors uppercase tracking-widest">Housing Help</a></li>
              </ul>
            </div>
            <div className="space-y-6">
              <h4 className="text-[10px] font-black tracking-[0.3em] uppercase text-background/50 dark:text-muted-foreground">Legal</h4>
              <ul className="space-y-3">
                <li><a href="/privacy" className="text-xs font-medium hover:text-danish-red transition-colors uppercase tracking-widest">Privacy</a></li>
                <li><a href="/terms" className="text-xs font-medium hover:text-danish-red transition-colors uppercase tracking-widest">Terms</a></li>
                <li><a href="#" className="text-xs font-medium hover:text-danish-red transition-colors uppercase tracking-widest">GDPR</a></li>
              </ul>
            </div>
            <div className="space-y-6">
              <h4 className="text-[10px] font-black tracking-[0.3em] uppercase text-background/50 dark:text-muted-foreground">Connect</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-xs font-medium hover:text-danish-red transition-colors uppercase tracking-widest">LinkedIn</a></li>
                <li><a href="#" className="text-xs font-medium hover:text-danish-red transition-colors uppercase tracking-widest">X / Twitter</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-background/10 dark:border-border/40 mt-32 pt-12 flex flex-col md:flex-row justify-between items-center gap-8">
          <span className="text-[10px] font-black tracking-[0.5em] uppercase text-background/40 dark:text-muted-foreground/40">
            © {currentYear} LocalDesk / Guidance for Expats
          </span>
          <div className="flex items-center gap-4">
            <div className="w-2 h-2 rounded-full bg-danish-red" />
            <span className="text-[10px] font-black tracking-[0.8em] uppercase text-background/40 dark:text-muted-foreground/40">
              Denmark Heritage
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
