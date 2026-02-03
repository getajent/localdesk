'use client';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-gradient-to-b from-neutral-50 to-white border-t border-slate-200 py-8 md:py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
          {/* Copyright Notice */}
          <div className="text-slate-700 text-sm leading-[1.6] font-normal">
            © {currentYear} LocalDesk. All rights reserved.
          </div>

          {/* Legal Links */}
          <div className="flex items-center gap-4 sm:gap-6">
            <a
              href="/privacy"
              className="text-slate-700 text-sm font-normal leading-[1.5] hover:text-danish-red transition-all duration-200 focus:text-danish-red focus:underline focus:outline-none focus:ring-2 focus:ring-danish-red focus:ring-offset-2 rounded-sm px-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-danish-red after:transition-all after:duration-200 hover:after:w-full"
              aria-label="Privacy Policy"
            >
              Privacy Policy
            </a>
            <a
              href="/terms"
              className="text-slate-700 text-sm font-normal leading-[1.5] hover:text-danish-red transition-all duration-200 focus:text-danish-red focus:underline focus:outline-none focus:ring-2 focus:ring-danish-red focus:ring-offset-2 rounded-sm px-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-danish-red after:transition-all after:duration-200 hover:after:w-full"
              aria-label="Terms of Service"
            >
              Terms of Service
            </a>
            <a
              href="/contact"
              className="text-slate-700 text-sm font-normal leading-[1.5] hover:text-danish-red transition-all duration-200 focus:text-danish-red focus:underline focus:outline-none focus:ring-2 focus:ring-danish-red focus:ring-offset-2 rounded-sm px-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-danish-red after:transition-all after:duration-200 hover:after:w-full"
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
