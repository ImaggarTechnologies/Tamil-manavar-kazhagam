import PageShell from '../../components/PageShell';
import { useLanguage } from '../../context/LanguageContext';

const sections = [
  { titleKey: 'history' as const, descKey: 'historyDesc' as const },
  { titleKey: 'vision' as const, descKey: 'visionPageDesc' as const },
  { titleKey: 'mission' as const, descKey: 'missionDesc' as const },
  { titleKey: 'objectives' as const, descKey: 'objectivesDesc' as const },
  { titleKey: 'coreValues' as const, descKey: 'coreValuesDesc' as const },
];

export default function AboutPage() {
  const { t, language } = useLanguage();
  const tamilClass = language === 'ta' ? 'tamil-text' : '';

  return (
    <PageShell>
      {/* Banner Image */}
      <div className="relative mb-12 w-full overflow-hidden rounded-[28px] border border-primary/30 shadow-glow" style={{ aspectRatio: '1920/710' }}>
        <img
          src="/img3.png"
          alt="Tamil Maanavar Mandram Banner"
          className="h-full w-full object-cover object-center sm:object-[20%_center] animate-fade-in"
        />
      </div>

      <section className="mb-16">
        <div className="max-w-3xl">
          <p className={`section-title ${tamilClass}`}>{t.aboutUs}</p>
          <h1 className={`mt-5 text-4xl font-semibold text-white sm:text-5xl ${tamilClass}`}>{t.aboutPageTitle}</h1>
          <p className={`mt-6 text-lg leading-8 text-gray-300 ${tamilClass}`}>{t.aboutPageDesc}</p>
        </div>
      </section>
      <section className="grid gap-8 lg:grid-cols-2">
        {sections.map((section, index) => (
          <article key={section.titleKey} className="card p-10 transition hover:border-primary/30">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">{index + 1}</div>
            <h2 className={`text-2xl font-semibold text-white ${tamilClass}`}>{t[section.titleKey]}</h2>
            <p className={`mt-4 leading-7 text-gray-300 ${tamilClass}`}>{t[section.descKey]}</p>
          </article>
        ))}
      </section>
    </PageShell>
  );
}
