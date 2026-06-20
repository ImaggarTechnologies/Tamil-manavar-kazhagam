import JoinForm from '../../components/JoinForm';
import PageShell from '../../components/PageShell';
import { useLanguage } from '../../context/LanguageContext';

export default function JoinPage() {
  const { t, language } = useLanguage();
  const tamilClass = language === 'ta' ? 'tamil-text' : '';

  return (
    <PageShell>
      <section className="mb-14 text-center">
        <p className={`section-title ${tamilClass}`}>{t.joinNow}</p>
        <h1 className={`mt-5 text-4xl font-semibold text-white sm:text-5xl ${tamilClass}`}>{t.joinPageTitle}</h1>
        <p className={`mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-300 ${tamilClass}`}>{t.joinPageDesc}</p>
      </section>

      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <JoinForm />
        <aside className="card p-10">
          <div className="space-y-6">
            <div className="rounded-3xl bg-primary/10 p-6">
              <p className={`text-xs uppercase tracking-[0.2em] text-primary ${tamilClass}`}>{t.quickInfo}</p>
              <h2 className={`mt-3 text-2xl font-semibold text-white ${tamilClass}`}>{t.whyRegister}</h2>
              <p className={`mt-3 text-gray-300 ${tamilClass}`}>{t.whyRegisterDesc}</p>
            </div>
            <div className="rounded-3xl border border-primary/10 bg-black p-6">
              <p className={`text-xs uppercase tracking-[0.2em] text-primary ${tamilClass}`}>{t.fieldsIncluded}</p>
              <ul className={`mt-4 space-y-3 text-gray-300 ${tamilClass}`}>
                <li>{t.fieldPersonal}</li>
                <li>{t.fieldAcademic}</li>
                <li>{t.fieldInterests}</li>
                <li>{t.fieldTerms}</li>
              </ul>
            </div>
            <div className="rounded-3xl bg-secondary/15 p-6">
              <p className={`text-xs uppercase tracking-[0.2em] text-primary ${tamilClass}`}>{t.secureStorage}</p>
              <p className={`mt-3 text-gray-300 ${tamilClass}`}>{t.secureStorageDesc}</p>
            </div>
          </div>
        </aside>
      </div>
    </PageShell>
  );
}
