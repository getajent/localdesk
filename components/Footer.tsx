'use client';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-white border-t border-slate-200 py-8 md:py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
          {/* Copyright Notice */}
          <div className="text-slate-600 text-sm">
            © {currentYear} LocalDesk. All rights reserved.
          </div>

          {/* Legal Links */}
          <div className="flex items-center gap-4 sm:gap-6">
            <a
              href="/privacy"
              className="text-slate-600 text-sm hover:text-danish-red transition-colors focus:text-danish-red focus:underline"
              aria-label="Privacy Policy"
            >
              Privacy Policy
            </a>
            <a
              href="/terms"
              className="text-slate-600 text-sm hover:text-danish-red transition-colors focus:text-danish-red focus:underline"
              aria-label="Terms of Service"
            >
              Terms of Service
            </a>
            <a
              href="/contact"
              className="text-slate-600 text-sm hover:text-danish-red transition-colors focus:text-danish-red focus:underline"
              aria-label="Contact"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
