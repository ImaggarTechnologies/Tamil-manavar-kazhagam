import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const initial = { name: '', mobile: '', college: '', message: '' };

export default function ContactForm() {
  const { t, language } = useLanguage();
  const [form, setForm] = useState(initial);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const tamilClass = language === 'ta' ? 'tamil-text' : '';

  const update = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (!form.name || !form.mobile || !form.college || !form.message) {
      setError(t.contactError);
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!response.ok) throw new Error('Failed to send.');
      setSuccess(true);
      setForm(initial);
    } catch {
      setError(t.contactFailed);
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="card p-12 text-center">
        <div className="mx-auto inline-flex h-20 w-20 items-center justify-center rounded-full border border-accent/50 bg-primary/20 text-4xl text-accent">✓</div>
        <h2 className={`mt-8 text-3xl font-semibold text-white ${tamilClass}`}>{t.thankYou}</h2>
        <p className={`mt-4 leading-8 text-muted ${tamilClass}`}>{t.messageSentDesc}</p>
        <button type="button" onClick={() => setSuccess(false)} className="btn-primary mt-8">
          {t.sendAnother}
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-6 p-10">
      <p className={`text-sm text-muted ${tamilClass}`}>{t.contactViaForm}</p>
      <label className={`block space-y-2 text-sm text-muted ${tamilClass}`}>
        {t.name}
        <input value={form.name} onChange={(e) => update('name', e.target.value)} required className="input-field" />
      </label>
      <label className={`block space-y-2 text-sm text-muted ${tamilClass}`}>
        {t.mobileNumber}
        <input value={form.mobile} onChange={(e) => update('mobile', e.target.value)} required className="input-field" />
      </label>
      <label className={`block space-y-2 text-sm text-muted ${tamilClass}`}>
        {t.collegeName}
        <input value={form.college} onChange={(e) => update('college', e.target.value)} required className="input-field" />
      </label>
      <label className={`block space-y-2 text-sm text-muted ${tamilClass}`}>
        {t.message}
        <textarea value={form.message} onChange={(e) => update('message', e.target.value)} rows={5} required className="input-field" />
      </label>
      {error ? <p className="error-box">{error}</p> : null}
      <button type="submit" disabled={submitting} className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60">
        {submitting ? t.sending : t.sendMessage}
      </button>
    </form>
  );
}
