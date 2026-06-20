import { useEffect, useState } from 'react';
import PageShell from '../../components/PageShell';
import { useLanguage } from '../../context/LanguageContext';

type EventItem = {
  _id: string;
  titleEn: string;
  titleTa: string;
  descriptionEn: string;
  descriptionTa: string;
  date: string;
  image?: string;
  type: 'upcoming' | 'past';
};

export default function EventsPage() {
  const { t, language } = useLanguage();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const tamilClass = language === 'ta' ? 'tamil-text' : '';

  useEffect(() => {
    fetch('/api/events')
      .then((res) => res.json())
      .then((data) => {
        setEvents(data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load events, using local fallback translation data', err);
        setLoading(false);
      });
  }, []);

  const upcoming = events.filter((e) => e.type === 'upcoming');
  const past = events.filter((e) => e.type === 'past');

  return (
    <PageShell>
      <section className="mb-16 text-center">
        <p className={`section-title ${tamilClass}`}>{t.events}</p>
        <h1 className={`mt-5 text-4xl font-semibold text-white sm:text-5xl ${tamilClass}`}>{t.eventsPageTitle}</h1>
        <p className={`mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-300 ${tamilClass}`}>{t.eventsPageDesc}</p>
      </section>

      {loading ? (
        <div className="text-center py-12">
          <div className="w-10 h-10 border-4 border-[#8B0000] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-300 text-sm">{language === 'ta' ? 'ஏற்றப்படுகிறது...' : 'Loading events...'}</p>
        </div>
      ) : (
        <section className="mb-16 space-y-8">
          <div className="card p-10">
            <h2 className={`text-2xl font-semibold text-white ${tamilClass}`}>{t.upcomingEvents}</h2>
            <div className="mt-8 space-y-6">
              {upcoming.length === 0 ? (
                <p className="text-sm text-gray-400">{language === 'ta' ? 'நிகழ்வுகள் ஏதுமில்லை.' : 'No upcoming events found.'}</p>
              ) : (
                upcoming.map((event) => (
                  <div key={event._id} className="rounded-3xl border border-primary/10 bg-black p-6 flex flex-col md:flex-row gap-6 items-start">
                    {event.image && (
                      <img src={event.image} alt="Event" className="w-full md:w-48 h-32 object-cover rounded-2xl shrink-0" />
                    )}
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-primary">
                        {new Date(event.date).toLocaleDateString(language === 'ta' ? 'ta-IN' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                      <h3 className={`mt-3 text-2xl font-semibold text-white ${tamilClass}`}>
                        {language === 'ta' ? event.titleTa : event.titleEn}
                      </h3>
                      <p className={`mt-3 leading-7 text-gray-300 ${tamilClass}`}>
                        {language === 'ta' ? event.descriptionTa : event.descriptionEn}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="card p-10">
            <h2 className={`text-2xl font-semibold text-white ${tamilClass}`}>{t.pastEvents}</h2>
            <div className="mt-8 space-y-6">
              {past.length === 0 ? (
                <p className="text-sm text-gray-400">{language === 'ta' ? 'கடந்த கால நிகழ்வுகள் ஏதுமில்லை.' : 'No past events found.'}</p>
              ) : (
                past.map((event) => (
                  <div key={event._id} className="rounded-3xl border border-primary/10 bg-black p-6 flex flex-col md:flex-row gap-6 items-start">
                    {event.image && (
                      <img src={event.image} alt="Event" className="w-full md:w-48 h-32 object-cover rounded-2xl shrink-0" />
                    )}
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-primary">
                        {new Date(event.date).toLocaleDateString(language === 'ta' ? 'ta-IN' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                      <h3 className={`mt-3 text-2xl font-semibold text-white ${tamilClass}`}>
                        {language === 'ta' ? event.titleTa : event.titleEn}
                      </h3>
                      <p className={`mt-3 leading-7 text-gray-300 ${tamilClass}`}>
                        {language === 'ta' ? event.descriptionTa : event.descriptionEn}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      )}
    </PageShell>
  );
}
