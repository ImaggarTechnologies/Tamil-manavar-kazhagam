import PageShell from '../../components/PageShell';
import { useLanguage } from '../../context/LanguageContext';

const cards = [
  { titleKey: 'leadershipOpp' as const, descKey: 'leadershipOppDesc' as const },
  { titleKey: 'skillDev' as const, descKey: 'skillDevDesc' as const },
  { titleKey: 'publicSpeaking' as const, descKey: 'publicSpeakingDesc' as const },
  { titleKey: 'volunteer' as const, descKey: 'volunteerDesc' as const },
  { titleKey: 'networkingBenefit' as const, descKey: 'networkingBenefitDesc' as const },
  { titleKey: 'certificates' as const, descKey: 'certificatesDesc' as const },
  { titleKey: 'communityService' as const, descKey: 'communityServiceDesc' as const },
  { titleKey: 'careerGrowth' as const, descKey: 'careerGrowthDesc' as const },
];

export default function WhyJoinPage() {
  const { t, language } = useLanguage();
  const tamilClass = language === 'ta' ? 'tamil-text' : '';

  return (
    <PageShell>
      <section className="mb-16 text-center">
        <p className={`section-title ${tamilClass}`}>{t.whyJoin}</p>
        <h1 className={`mt-5 text-4xl font-semibold text-white sm:text-5xl ${tamilClass}`}>{t.whyJoinTitle}</h1>
        <p className={`mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-300 ${tamilClass}`}>{t.whyJoinPageDesc}</p>
      </section>
      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div key={card.titleKey} className="card p-8 transition hover:-translate-y-1 hover:border-primary/30">
            <p className="text-xs uppercase tracking-[0.2em] text-primary">{t.benefit}</p>
            <h2 className={`mt-4 text-xl font-semibold text-white ${tamilClass}`}>{t[card.titleKey]}</h2>
            <p className={`mt-3 leading-7 text-gray-300 ${tamilClass}`}>{t[card.descKey]}</p>
          </div>
        ))}
      </section>
    </PageShell>
  );
}
