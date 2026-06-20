import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const navItems = [
  { key: 'home', href: '/' },
  { key: 'about', href: '/about' },
  { key: 'whyJoin', href: '/why-join' },
  { key: 'activities', href: '/activities' },
  { key: 'joinNow', href: '/join' },
  { key: 'contact', href: '/contact' },
] as const;

export default function Header() {
  const { language, setLanguage, t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const tamilClass = language === 'ta' ? 'tamil-text' : '';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 m-0 border-b border-primary bg-navbar p-0 transition-shadow duration-300 ${
        scrolled ? 'shadow-[0_4px_30px_rgba(139,0,0,0.35)]' : ''
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-10">
        <Link to="/" className="group flex min-w-0 items-center gap-2.5 sm:gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border-2 border-secondary bg-black shadow-logo transition group-hover:border-accent sm:h-12 sm:w-12">
            <img
              src="/dmk-logo.jpeg"
              alt="Tamil Maanavar Mandram Logo"
              width={48}
              height={48}
              className="h-9 w-9 rounded-md object-cover sm:h-10 sm:w-10"
            />
          </div>
          <div className="min-w-0 leading-tight">
            <p className={`truncate text-sm font-bold text-secondary sm:text-base ${tamilClass}`}>{t.logo}</p>
            <p className="hidden text-[10px] font-medium uppercase tracking-widest text-accent sm:block">Student Movement</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-3 xl:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`whitespace-nowrap text-xs font-medium text-muted transition hover:text-accent ${tamilClass}`}
            >
              {t[item.key]}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <div className="inline-flex items-center gap-0.5 rounded-full border border-primary/50 bg-card p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setLanguage('ta')}
              className={`rounded-full px-2.5 py-1 transition tamil-text ${language === 'ta' ? 'bg-gradient-to-r from-primary to-secondary font-semibold text-white' : 'text-muted hover:text-accent'}`}
            >
              தமிழ்
            </button>
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`rounded-full px-2.5 py-1 transition ${language === 'en' ? 'bg-gradient-to-r from-primary to-secondary font-semibold text-white' : 'text-muted hover:text-accent'}`}
            >
              EN
            </button>
          </div>

          <button
            type="button"
            className="inline-flex rounded-lg border border-primary/50 bg-card px-3 py-2 text-accent xl:hidden"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Toggle menu"
          >
            ☰
          </button>
        </div>
      </div>

      {menuOpen ? (
        <div className="border-t border-primary/40 bg-navbar px-4 py-3 xl:hidden">
          <nav className="grid gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setMenuOpen(false)}
                className={`rounded-lg px-3 py-2.5 text-sm font-medium text-muted transition hover:bg-primary/20 hover:text-accent ${tamilClass}`}
              >
                {t[item.key]}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
