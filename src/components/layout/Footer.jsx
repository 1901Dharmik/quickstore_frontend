import Link from 'next/link';

const Facebook = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const Twitter = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
  </svg>
);

const Instagram = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const Youtube = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/>
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/>
  </svg>
);

const FOOTER_COLUMNS = [
  {
    heading: 'Shop',
    links: [
      { href: '/collections/new', label: 'New arrivals' },
      { href: '/collections/bestsellers', label: 'Bestsellers' },
      { href: '/collections/men', label: "Men's collection" },
      { href: '/collections/women', label: "Women's collection" },
      { href: '/collections/sale', label: 'Sale & offers' },
    ],
  },
  {
    heading: 'Customer service',
    links: [
      { href: '/contact', label: 'Contact us' },
      { href: '/faq', label: 'FAQ' },
      { href: '/shipping', label: 'Shipping & returns' },
      { href: '/track-order', label: 'Track order' },
      { href: '/size-guide', label: 'Size guide' },
    ],
  },
  {
    heading: 'About us',
    links: [
      { href: '/about', label: 'Our story' },
      { href: '/careers', label: 'Careers' },
      { href: '/blog', label: 'Journal' },
    ],
  },
];

const SOCIALS = [
  { Icon: Facebook, label: 'Facebook' },
  { Icon: Twitter, label: 'Twitter' },
  { Icon: Instagram, label: 'Instagram' },
  { Icon: Youtube, label: 'YouTube' },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-[1600px] px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr] lg:gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-2">
              <img src="/logo-icon.jpg" alt="QuickStore Icon" className="h-8 w-auto dark:invert" />
              <img src="/logo.jpg" alt="QuickStore" className="h-7 w-auto dark:invert" />
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              Curated timepieces for collectors — precision movements and considered design, delivered.
            </p>
            <div className="flex gap-4 pt-1">
              {SOCIALS.map(({ Icon, label }) => (
                <a key={label} href="#" aria-label={label} className="text-muted-foreground transition-colors hover:text-foreground">
                  <Icon className="h-[18px] w-[18px]" />
                </a>
              ))}
            </div>
          </div>

          {FOOTER_COLUMNS.map((col) => (
            <div key={col.heading}>
              <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-foreground">{col.heading}</h3>
              <ul className="mt-5 space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="tick-track mt-12 flex flex-col items-center gap-4 pt-6 sm:mt-16 sm:flex-row sm:justify-between">
          <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
            &copy; {currentYear} QuickStore. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
            <Link href="/privacy-policy" className="transition-colors hover:text-foreground">Privacy policy</Link>
            <Link href="/terms-of-service" className="transition-colors hover:text-foreground">Terms of service</Link>
            <Link href="/cookie-policy" className="transition-colors hover:text-foreground">Cookie policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
