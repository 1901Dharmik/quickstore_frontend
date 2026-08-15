import Link from 'next/link';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-[#e5e5e5] bg-white">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 font-sans text-[12px] font-medium text-[#737373]">
          <Link href="/shop" className="hover:text-black transition-colors">Shop</Link>
          <Link href="/collections" className="hover:text-black transition-colors">Collections</Link>
          <Link href="/about" className="hover:text-black transition-colors">About</Link>
          <Link href="/contact" className="hover:text-black transition-colors">Contact</Link>
          <Link href="/privacy-policy" className="hover:text-black transition-colors">Privacy</Link>
          <Link href="/terms-of-service" className="hover:text-black transition-colors">Terms</Link>
        </div>
        <p className="font-sans text-[12px] text-[#737373]">
          &copy; {currentYear} QuickStore
        </p>
      </div>
    </footer>
  );
};

export default Footer;
