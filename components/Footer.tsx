'use client';

import { Logo } from '@/components/Logo';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-primary text-primary-foreground py-16 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-16 items-start">
          {/* Brand/Legal */}
          <div className="lg:col-span-6 space-y-8">
            <Logo light />
            <p className="text-primary-foreground/70 text-sm max-w-sm font-light leading-relaxed font-sans">
              An independent digital consulting system designed for the Danish administrative landscape. All data processing is executed under secure protocols.
            </p>
          </div>

          {/* Links Grid */}
          <div className="lg:col-span-6 grid grid-cols-2 md:grid-cols-3 gap-8 text-primary-foreground/90">
            <div className="space-y-4">
              <h4 className="text-xs font-bold tracking-widest uppercase text-primary-foreground/50">Legal</h4>
              <ul className="space-y-2">
                <li><a href="/privacy" className="text-sm font-light hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="/terms" className="text-sm font-light hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-xs font-bold tracking-widest uppercase text-primary-foreground/50">Systems</h4>
              <ul className="space-y-2">
                <li><a href="#chat-interface" className="text-sm font-light hover:text-white transition-colors">Interface</a></li>
                <li><a href="/" className="text-sm font-light hover:text-white transition-colors">Protocols</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-xs font-bold tracking-widest uppercase text-primary-foreground/50">Connect</h4>
              <ul className="space-y-2">
                <li><a href="/contact" className="text-sm font-light hover:text-white transition-colors">Contact</a></li>
                <li><a href="/" className="text-sm font-light hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="text-[10px] font-bold tracking-widest uppercase text-primary-foreground/40">
            © {currentYear} LocalDesk / All Rights Reserved
          </span>
          <span className="text-[10px] font-bold tracking-widest uppercase text-primary-foreground/40">
            Copenhagen / Denmark
          </span>
        </div>
      </div>
    </footer>
  );
}
