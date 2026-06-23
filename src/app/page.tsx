import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AnimatedCounter from '../components/AnimatedCounter';
import Footer from '../components/Footer';
import Header from '../components/Header';
import AdminRegistrationsPage from './admin/registrations/page';
import { useLanguage } from '../context/LanguageContext';
import { homeEvents } from '../constants/translations';

const stats = [
  { value: '5000+', labelKey: 'students' as const },
  { value: '100+', labelKey: 'colleges' as const },
  { value: '38', labelKey: 'districts' as const },
  { value: '200+', labelKey: 'activitiesLabel' as const },
];

const benefits = [
  { titleKey: 'leadershipDev' as const, descKey: 'leadershipDesc' as const },
  { titleKey: 'networking' as const, descKey: 'networkingDesc' as const },
  { titleKey: 'tamilCulture' as const, descKey: 'cultureDesc' as const },
  { titleKey: 'socialService' as const, descKey: 'serviceDesc' as const },
];

export default function HomePage() {
  const { t, language } = useLanguage();
  const events = homeEvents[language];
  const tamilClass = language === 'ta' ? 'tamil-text' : '';

  const [isAdmin, setIsAdmin] = useState(false);
  const [adminView, setAdminView] = useState(false);

  const checkAuth = () => {
    const token = localStorage.getItem('adminToken');
    setIsAdmin(!!token);
    const viewPref = localStorage.getItem('adminViewActive') === 'true';
    setAdminView(!!token && viewPref);
  };

  useEffect(() => {
    checkAuth();
    window.addEventListener('admin-auth-change', checkAuth);
    window.addEventListener('storage', checkAuth);
    return () => {
      window.removeEventListener('admin-auth-change', checkAuth);
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  const toggleAdminView = (active: boolean) => {
    localStorage.setItem('adminViewActive', String(active));
    setAdminView(active);
    window.dispatchEvent(new Event('admin-auth-change'));
  };

  if (adminView) {
    return (
      <div className="min-h-screen bg-surface text-white">
        <Header />
        <main className="mx-auto max-w-7xl px-6 pb-16 pt-24 lg:px-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-primary/20 pb-4">
            <div>
              <h1 className={`text-2xl font-bold text-accent ${tamilClass}`}>
                {language === 'ta' ? 'நிர்வாகப் பதிவுகள் தரவுத்தளம்' : 'Registrations Database'}
              </h1>
              <p className={`text-xs text-gray-400 mt-1 ${tamilClass}`}>
                {language === 'ta' ? 'மாணவர்களின் பதிவு விவரங்களை நிர்வகித்தல்' : 'Manage and view registered student profiles'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => toggleAdminView(false)}
              className={`btn-outline !py-2 !px-5 !text-xs self-start sm:self-auto cursor-pointer ${tamilClass}`}
            >
              {language === 'ta' ? '← பொதுப் பக்கத்திற்குச் செல்' : '← Back to Public Home'}
            </button>
          </div>
          <AdminRegistrationsPage />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface text-white">
      <Header />
      {isAdmin && (
        <div className="bg-primary/25 border-b border-primary/40 py-2.5 px-6 text-center text-xs flex flex-wrap justify-center items-center gap-3 mt-16 z-40 relative animate-fade-in">
          <span className={`text-accent font-semibold ${tamilClass}`}>
            {language === 'ta' ? '⭐ நிர்வாகியாக உள்நுழைந்துள்ளீர்கள்' : '⭐ Logged in as Administrator'}
          </span>
          <button
            type="button"
            onClick={() => toggleAdminView(true)}
            className={`bg-accent text-black font-bold px-4 py-1.5 rounded-full hover:bg-white transition cursor-pointer text-[11px] ${tamilClass}`}
          >
            {language === 'ta' ? 'பதிவுகள் தரவுத்தளத்தைக் காட்டு' : 'View Registrations Database'}
          </button>
        </div>
      )}
      <main className="m-0 overflow-hidden p-0">
        {/* Hero — starts immediately below navbar */}
        <section className="hero-gradient relative border-b border-primary/30 px-6 pb-16 pt-16 lg:px-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(139,0,0,0.25),transparent_45%),radial-gradient(circle_at_70%_80%,rgba(193,18,31,0.15),transparent_40%)]" />
          <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.3fr_0.9fr]">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative z-10 animate-fade-up">
              {/* Left Side Background Watermark */}
              <div 
                className="pointer-events-none absolute -left-12 -top-24 -z-10 h-[140%] w-[125%] opacity-[0.15] select-none"
                style={{
                  WebkitMaskImage: 'radial-gradient(circle at center, black 30%, transparent 75%)',
                  maskImage: 'radial-gradient(circle at center, black 30%, transparent 75%)',
                }}
              >
                <img 
                  src="/leaders.jpg" 
                  alt="Leaders Background" 
                  className="w-full h-full object-cover object-left filter grayscale contrast-125 brightness-75" 
                />
              </div>
              <span className={`inline-flex rounded-full border border-secondary/50 bg-card/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-accent backdrop-blur ${tamilClass}`}>
                {t.logo}
              </span>
              <h1 className={`mt-6 max-w-2xl text-5xl font-bold leading-tight text-white sm:text-6xl lg:text-7xl ${tamilClass}`}>
                {language === 'ta' ? (
                  <>
                    தமிழ் <span className="text-highlight">மாணவர்</span> மன்றம்
                  </>
                ) : (
                  <>
                    Tamil <span className="text-highlight">Maanavar</span> Mandram
                  </>
                )}
              </h1>
              <p className={`mt-6 max-w-xl text-lg leading-8 text-muted sm:text-xl ${tamilClass}`}>
                {language === 'ta' ? (
                  <>
                    <span className="text-highlight">தமிழை</span> வளர்ப்போம் · மாணவர்களை இணைப்போம் ·{' '}
                    <span className="text-gold">எதிர்கால தலைவர்களை</span> உருவாக்குவோம்
                  </>
                ) : (
                  <>
                    <span className="text-highlight">Grow Tamil</span> · Connect Students ·{' '}
                    <span className="text-gold">Build Future Leaders</span>
                  </>
                )}
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link to="/join" className="btn-primary">{t.joinNow}</Link>
                <Link to="/about" className="btn-outline">{t.learnMore}</Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="card animate-glow p-6"
            >
              <div className="flex flex-col items-center rounded-card bg-gradient-to-br from-primary/30 via-black to-secondary/20 p-8">
                <div className="mb-6 flex h-28 w-28 items-center justify-center rounded-2xl border-2 border-accent bg-black shadow-logo">
                  <img src="/dmk-logo.jpeg" alt="Logo" width={96} height={96} className="h-24 w-24 rounded-xl object-cover" />
                </div>
                <p className={`text-xs uppercase tracking-[0.24em] text-accent ${tamilClass}`}>{t.studentMovement}</p>
                <h2 className={`mt-2 text-2xl font-semibold text-white ${tamilClass}`}>தமிழ் மாணவர்கள்</h2>
                <div className="mt-6 w-full space-y-2 rounded-card border border-primary/40 bg-black/70 p-5">
                  {[
                    [t.collegeReach, '100+'],
                    [t.districts, '38'],
                    [t.registrations, '5000+'],
                  ].map(([label, val]) => (
                    <div key={String(label)} className="flex items-center justify-between text-sm text-muted">
                      <span className={tamilClass}>{label}</span>
                      <span className="font-bold text-accent">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="about" className="border-b border-primary/20 px-6 py-20 lg:px-10">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.95fr_0.8fr]">
            <div className="card p-10">
              <span className={`section-title ${tamilClass}`}>{t.aboutUs}</span>
              <div className="section-divider !mx-0" />
              <h2 className={`mt-6 text-3xl font-semibold text-white sm:text-4xl ${tamilClass}`}>{t.aboutTitle}</h2>
              <p className={`mt-4 max-w-2xl leading-8 text-muted ${tamilClass}`}>{t.aboutDesc}</p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {[
                  { title: t.ourVision, desc: t.visionDesc },
                  { title: t.studentDevelopment, desc: t.developmentDesc },
                ].map((item) => (
                  <div key={item.title} className="rounded-card border border-primary/30 bg-black/60 p-6 transition hover:border-secondary/50">
                    <h3 className={`font-semibold text-white ${tamilClass}`}>{item.title}</h3>
                    <p className={`mt-3 text-sm text-muted ${tamilClass}`}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="card bg-gradient-to-br from-primary/20 via-card to-black p-8">
              <p className={`text-xs uppercase tracking-[0.2em] text-accent ${tamilClass}`}>{t.tamilIdentity}</p>
              <h3 className="mt-4 text-3xl font-semibold text-white">Cultural pride with <span className="text-highlight">modern student energy</span>.</h3>
              <p className={`mt-6 rounded-card border border-primary/30 bg-black/50 p-4 text-sm leading-7 text-muted ${tamilClass}`}>{t.identityDesc}</p>
            </div>
          </div>
        </section>

        <section className="border-b border-primary/20 px-6 py-20 lg:px-10">
          <div className="mx-auto max-w-7xl text-center">
            <p className={`section-title ${tamilClass}`}>{t.whyJoin}</p>
            <div className="section-divider" />
            <h2 className={`mt-6 text-3xl font-semibold text-white sm:text-4xl ${tamilClass}`}>{t.whyJoinTitle}</h2>
          </div>
          <div className="mx-auto mt-12 grid max-w-7xl gap-6 md:grid-cols-2 xl:grid-cols-4">
            {benefits.map((item) => (
              <motion.article key={item.titleKey} whileHover={{ y: -6, scale: 1.02 }} className="card p-8">
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-card bg-primary/30 text-accent">
                  <span className="text-xl">★</span>
                </div>
                <h3 className={`text-xl font-semibold text-white ${tamilClass}`}>{t[item.titleKey]}</h3>
                <p className={`mt-4 leading-7 text-muted ${tamilClass}`}>{t[item.descKey]}</p>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="border-b border-primary/20 px-6 py-20 lg:px-10">
          <div className="mx-auto max-w-7xl card p-10">
            <div className="grid gap-8 md:grid-cols-4">
              {stats.map((stat) => (
                <AnimatedCounter key={stat.labelKey} value={stat.value} label={t[stat.labelKey]} />
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-primary/20 px-6 py-20 lg:px-10">
          <div className="mx-auto max-w-7xl text-center">
            <p className={`section-title ${tamilClass}`}>{t.latestEvents}</p>
            <div className="section-divider" />
            <h2 className={`mt-6 text-3xl font-semibold text-white sm:text-4xl ${tamilClass}`}>{t.eventTitle}</h2>
          </div>
          <div className="mx-auto mt-10 grid max-w-7xl gap-6 lg:grid-cols-3">
            {events.map((event) => (
              <div key={event.title} className="card p-8 transition hover:-translate-y-1">
                <p className="text-xs uppercase tracking-[0.24em] text-accent">{event.date}</p>
                <h3 className={`mt-4 text-2xl font-semibold text-white ${tamilClass}`}>{event.title}</h3>
                <p className={`mt-4 leading-7 text-muted ${tamilClass}`}>{event.description}</p>
                <Link to="/events" className="btn-primary mt-8 !px-5 !py-3 !text-xs">{t.readMore}</Link>
              </div>
            ))}
          </div>
        </section>

        <section className="px-6 py-20 lg:px-10">
          <div className="mx-auto max-w-7xl rounded-card border border-secondary/50 bg-gradient-to-r from-primary/30 via-card to-primary/30 p-12 text-center shadow-glow">
            <h2 className={`text-3xl font-semibold text-white sm:text-4xl ${tamilClass}`}>{t.becomeMember}</h2>
            <p className={`mx-auto mt-4 max-w-2xl leading-8 text-muted ${tamilClass}`}>{t.memberDesc}</p>
            <Link to="/join" className="btn-primary mt-8">{t.registerNow}</Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
