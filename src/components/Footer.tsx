import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const footerLinks = [
  { key: 'home', href: '/' },
  { key: 'about', href: '/about' },
  { key: 'whyJoin', href: '/why-join' },
  { key: 'activities', href: '/activities' },
  { key: 'joinNow', href: '/join' },
  { key: 'contact', href: '/contact' },
] as const;

const social = [
  { name: 'Facebook', icon: 'f' },
  { name: 'Instagram', icon: '◎' },
  { name: 'YouTube', icon: '▶' },
  { name: 'Telegram', icon: '✈' },
];

export default function Footer() {
  const { t, language } = useLanguage();
  const tamilClass = language === 'ta' ? 'tamil-text' : '';

  return (
    <footer className="border-t-2 border-primary bg-black py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid gap-10 md:grid-cols-3">
          <div className="space-y-4">
            <p className={`section-title ${tamilClass}`}>{t.logo}</p>
            <div className="section-divider !mx-0" />
            <h3 className={`text-xl font-semibold text-white ${tamilClass}`}>
              {t.empowering}. {t.preserving}. {t.building}.
            </h3>
            <p className={`max-w-md leading-7 text-muted ${tamilClass}`}>{t.footerDesc}</p>
          </div>

          <div>
            <p className={`text-xs font-semibold uppercase tracking-[0.24em] text-white ${tamilClass}`}>{t.quickLinks}</p>
            <div className="mt-6 grid gap-3 text-muted">
              {footerLinks.map((link) => (
                <Link key={link.href} to={link.href} className={`transition hover:text-accent ${tamilClass}`}>
                  {t[link.key]}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className={`text-xs font-semibold uppercase tracking-[0.24em] text-white ${tamilClass}`}>{t.followUs}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              {social.map((item) => (
                <a
                  key={item.name}
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/40 bg-card text-accent transition hover:border-accent hover:shadow-logo"
                  aria-label={item.name}
                >
                  {item.icon}
                </a>
              ))}
            </div>
            <div className="mt-6 flex gap-4 text-xs text-muted">
              <Link to="#" className="hover:text-accent">{t.privacy}</Link>
              <Link to="#" className="hover:text-accent">{t.terms}</Link>
            </div>
          </div>
        </div>

        <div className={`mt-12 border-t border-primary/30 pt-6 text-xs text-muted ${tamilClass}`}>{t.copyright}</div>
      </div>
    </footer>
  );
}
