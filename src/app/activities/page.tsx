import PageShell from '../../components/PageShell';
import { useLanguage } from '../../context/LanguageContext';
import { activityItems } from '../../constants/translations';

export default function ActivitiesPage() {
  const { t, language } = useLanguage();
  const activities = activityItems[language];
  const tamilClass = language === 'ta' ? 'tamil-text' : '';

  return (
    <PageShell>
      <section className="mb-16 text-center">
        <p className={`section-title ${tamilClass}`}>{t.activities}</p>
        <h1 className={`mt-5 text-4xl font-semibold text-white sm:text-5xl ${tamilClass}`}>{t.activitiesPageTitle}</h1>
        <p className={`mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-300 ${tamilClass}`}>{t.activitiesPageDesc}</p>
      </section>
      <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {activities.map((activity) => (
          <article key={activity} className="card p-8 transition hover:-translate-y-1">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-3xl bg-primary/10 text-2xl text-primary">★</div>
            <h2 className={`text-xl font-semibold text-white ${tamilClass}`}>{activity}</h2>
            <p className={`mt-4 leading-7 text-gray-300 ${tamilClass}`}>{t.activityDesc}</p>
          </article>
        ))}
      </section>
    </PageShell>
  );
}
