import ContactForm from '../../components/ContactForm';
import PageShell from '../../components/PageShell';
import { useLanguage } from '../../context/LanguageContext';

const social = [
  { name: 'Facebook', icon: 'f' },
  { name: 'Instagram', icon: '◎' },
  { name: 'YouTube', icon: '▶' },
  { name: 'Telegram', icon: '✈' },
];

export default function ContactPage() {
  const { t, language } = useLanguage();
  const tamilClass = language === 'ta' ? 'tamil-text' : '';

  return (
    <PageShell>
      <section className="mb-12 text-center">
        <p className={`section-title ${tamilClass}`}>{t.contact}</p>
        <div className="section-divider" />
        <h1 className={`mt-6 text-4xl font-semibold text-white sm:text-5xl ${tamilClass}`}>{t.contactPageTitle}</h1>
        <p className={`mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted ${tamilClass}`}>{t.contactViaForm}</p>
      </section>

      <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr]">
        <div className="card space-y-8 p-10">
          <div>
            <p className={`text-xs uppercase tracking-[0.24em] text-accent ${tamilClass}`}>{t.officeAddress}</p>
            <p className="mt-3 text-lg font-semibold text-white">{t.officeName}</p>
            <p className="mt-3 leading-7 text-muted">{t.officeLocation}</p>
          </div>

          <div>
            <p className={`text-xs uppercase tracking-[0.24em] text-muted ${tamilClass}`}>{t.phone}</p>
            <p className="mt-2 text-lg font-medium text-accent">+91 98765 43210</p>
          </div>

          <div>
            <p className={`text-xs font-semibold uppercase tracking-[0.24em] text-white ${tamilClass}`}>{t.followUs}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {social.map((item) => (
                <a
                  key={item.name}
                  href="#"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-primary/40 bg-black text-accent transition hover:border-accent hover:shadow-logo"
                  aria-label={item.name}
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-card border border-primary/30">
            <iframe
              className="h-64 w-full grayscale invert"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3910.123456789012!2d78.1198!3d9.9252!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b00c5c8c8c8c8c9%3A0x0!2sMadurai!5e0!3m2!1sen!2sin!4v0000000000000"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Office Map"
            />
          </div>
        </div>

        <ContactForm />
      </div>
    </PageShell>
  );
}
