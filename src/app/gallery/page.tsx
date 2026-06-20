import { useState, useEffect } from 'react';
import PageShell from '../../components/PageShell';
import { useLanguage } from '../../context/LanguageContext';

function getYouTubeId(url: string) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

type GalleryItem = {
  _id: string;
  titleEn: string;
  titleTa: string;
  mediaUrl: string;
  mediaType: 'photo' | 'video';
  albumNameEn?: string;
  albumNameTa?: string;
};

export default function GalleryPage() {
  const { t, language } = useLanguage();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [activeMedia, setActiveMedia] = useState<GalleryItem | null>(null);
  const [loading, setLoading] = useState(true);
  const tamilClass = language === 'ta' ? 'tamil-text' : '';

  useEffect(() => {
    fetch('/api/gallery')
      .then((res) => res.json())
      .then((data) => {
        setItems(data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load gallery items, using local fallbacks', err);
        setLoading(false);
      });
  }, []);

  const categories = [
    { title: t.photos, desc: t.photosDesc },
    { title: t.videos, desc: t.videosDesc },
    { title: t.albums, desc: t.albumsDesc },
  ];

  // Helper colors for dynamic borders
  const colors = [
    'from-primary/30 to-secondary/30',
    'from-secondary/30 to-accent/30',
    'from-accent/30 to-primary/30'
  ];

  return (
    <PageShell>
      <section className="mb-16 text-center">
        <p className={`section-title ${tamilClass}`}>{t.gallery}</p>
        <h1 className={`mt-5 text-4xl font-semibold text-white sm:text-5xl ${tamilClass}`}>{t.galleryPageTitle}</h1>
        <p className={`mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-300 ${tamilClass}`}>{t.galleryPageDesc}</p>
      </section>

      <section className="mb-12 grid gap-6 md:grid-cols-3">
        {categories.map((item) => (
          <article key={item.title} className="card p-8 transition hover:-translate-y-1">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-3xl bg-primary/10 text-2xl text-primary">▣</div>
            <h2 className={`text-2xl font-semibold text-white ${tamilClass}`}>{item.title}</h2>
            <p className={`mt-4 leading-7 text-gray-300 ${tamilClass}`}>{item.desc}</p>
          </article>
        ))}
      </section>

      {loading ? (
        <div className="text-center py-12">
          <div className="w-10 h-10 border-4 border-[#8B0000] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-300 text-sm">{language === 'ta' ? 'ஏற்றப்படுகிறது...' : 'Loading gallery...'}</p>
        </div>
      ) : (
        <section className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {items.map((item, idx) => {
            const borderGradient = colors[idx % colors.length];
            return (
              <div
                key={item._id}
                onClick={() => setActiveMedia(item)}
                className={`mb-4 break-inside-avoid overflow-hidden rounded-[28px] bg-gradient-to-br ${borderGradient} p-1 group cursor-pointer`}
              >
                <div 
                  className="relative rounded-[26px] overflow-hidden bg-primary/10 backdrop-blur" 
                  style={{ height: idx % 2 === 0 ? '14rem' : '18rem' }}
                >
                  {item.mediaType === 'video' ? (
                    getYouTubeId(item.mediaUrl) ? (
                      <div className="relative w-full h-full">
                        <img
                          src={`https://img.youtube.com/vi/${getYouTubeId(item.mediaUrl)}/mqdefault.jpg`}
                          alt={language === 'ta' ? item.titleTa : item.titleEn}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/45 transition-colors">
                          <div className="w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center shadow-lg text-lg">
                            ▶
                          </div>
                        </div>
                      </div>
                    ) : (
                      <video src={item.mediaUrl} className="w-full h-full object-cover" preload="metadata" />
                    )
                  ) : item.mediaUrl ? (
                    <img
                      src={item.mediaUrl}
                      alt={language === 'ta' ? item.titleTa : item.titleEn}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-primary/10" />
                  )}
                  {item.mediaUrl && (
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                      <span className="text-[10px] uppercase font-extrabold text-accent tracking-wider block mb-1">
                        {item.mediaType === 'video' ? (language === 'ta' ? 'வீடியோ' : 'Video') : (language === 'ta' ? 'புகைப்படம்' : 'Photo')}
                      </span>
                      <h3 className="text-sm font-bold text-white">
                        {language === 'ta' ? item.titleTa : item.titleEn}
                      </h3>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </section>
      )}

      {/* Lightbox Modal overlay */}
      {activeMedia && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <button
            onClick={() => setActiveMedia(null)}
            className="absolute top-6 right-6 text-white hover:text-accent p-2 focus:outline-none z-10 text-2xl"
          >
            ✕
          </button>

          <div className="max-w-4xl w-full flex flex-col items-center">
            {/* Media viewer */}
            <div className="relative max-h-[75vh] w-full flex items-center justify-center bg-black/20 rounded-3xl overflow-hidden mb-4">
              {activeMedia.mediaType === 'video' ? (
                getYouTubeId(activeMedia.mediaUrl) ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${getYouTubeId(activeMedia.mediaUrl)}?autoplay=1`}
                    className="w-full aspect-video max-h-[70vh] rounded-2xl border-none"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={language === 'ta' ? activeMedia.titleTa : activeMedia.titleEn}
                  />
                ) : (
                  <video
                    src={activeMedia.mediaUrl}
                    controls
                    autoPlay
                    className="max-h-[75vh] max-w-full rounded-2xl"
                  />
                )
              ) : (
                <img
                  src={activeMedia.mediaUrl}
                  alt={language === 'ta' ? activeMedia.titleTa : activeMedia.titleEn}
                  className="max-h-[75vh] max-w-full object-contain rounded-2xl"
                />
              )}
            </div>

            {/* Media Details */}
            <div className="text-center text-white px-4">
              <span className="text-xs font-bold text-accent uppercase tracking-wider">
                {activeMedia.mediaType === 'video' ? (language === 'ta' ? 'வீடியோ' : 'Video') : (language === 'ta' ? 'புகைப்படம்' : 'Photo')}
              </span>
              <h3 className="text-lg font-bold mt-1 text-gray-100">
                {language === 'ta' ? activeMedia.titleTa : activeMedia.titleEn}
              </h3>
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
}
