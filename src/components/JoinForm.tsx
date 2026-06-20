import { useState } from 'react';
import { motion } from 'framer-motion';
import { tamilNaduDistricts } from '../constants/districts';
import { useLanguage } from '../context/LanguageContext';
import { interestOptions } from '../constants/translations';

const initialValues = {
  fullName: '',
  mobileNumber: '',
  whatsappNumber: '',
  email: '',
  gender: '',
  dob: '',
  collegeName: '',
  university: '',
  department: '',
  year: '',
  district: '',
  city: '',
  reason: '',
  interests: [] as string[],
  terms: false,
};

export default function JoinForm() {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState(initialValues);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const tamilClass = language === 'ta' ? 'tamil-text' : '';

  const updateField = (key: string, value: string | boolean | string[]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const toggleInterest = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((item) => item !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (
      !formData.fullName ||
      !formData.mobileNumber ||
      !formData.email ||
      !formData.gender ||
      !formData.dob ||
      !formData.collegeName ||
      !formData.department ||
      !formData.year ||
      !formData.district ||
      !formData.reason ||
      !formData.terms
    ) {
      setError(t.formError);
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Submission failed.');
      }

      setSuccess(true);
      setFormData(initialValues);
    } catch {
      setError(t.submitFailed);
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card p-12 text-center"
      >
        <div className="mx-auto inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-4xl text-primary">✓</div>
        <h2 className={`mt-8 text-3xl font-semibold text-white ${tamilClass}`}>{t.thankYou}</h2>
        <p className={`mt-4 leading-8 text-gray-300 ${tamilClass}`}>{t.registrationSuccess}</p>
        <button type="button" onClick={() => setSuccess(false)} className="btn-primary mt-8">
          {t.submitAnother}
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-8 p-10">
      <div className="space-y-4 rounded-[28px] bg-black p-8">
        <h2 className={`text-2xl font-semibold text-white ${tamilClass}`}>{t.personalDetails}</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <label className={`space-y-2 text-sm text-gray-300 ${tamilClass}`}>
            {t.fullName} *
            <input value={formData.fullName} onChange={(e) => updateField('fullName', e.target.value)} required className="input-field" />
          </label>
          <label className={`space-y-2 text-sm text-gray-300 ${tamilClass}`}>
            {t.mobileNumber} *
            <input value={formData.mobileNumber} onChange={(e) => updateField('mobileNumber', e.target.value)} required className="input-field" />
          </label>
          <label className={`space-y-2 text-sm text-gray-300 ${tamilClass}`}>
            {t.whatsappNumber}
            <input value={formData.whatsappNumber} onChange={(e) => updateField('whatsappNumber', e.target.value)} className="input-field" />
          </label>
          <label className={`space-y-2 text-sm text-gray-300 ${tamilClass}`}>
            {t.email} *
            <input type="email" value={formData.email} onChange={(e) => updateField('email', e.target.value)} required className="input-field" />
          </label>
          <label className={`space-y-2 text-sm text-gray-300 ${tamilClass}`}>
            {t.gender} *
            <select value={formData.gender} onChange={(e) => updateField('gender', e.target.value)} required className="input-field">
              <option value="">{t.selectOption}</option>
              <option value="Female">{t.female}</option>
              <option value="Male">{t.male}</option>
              <option value="Other">{t.other}</option>
            </select>
          </label>
          <label className={`space-y-2 text-sm text-gray-300 ${tamilClass}`}>
            {t.dateOfBirth} *
            <input type="date" value={formData.dob} onChange={(e) => updateField('dob', e.target.value)} required className="input-field" />
          </label>
        </div>
      </div>

      <div className="space-y-4 rounded-[28px] bg-black p-8">
        <h2 className={`text-2xl font-semibold text-white ${tamilClass}`}>{t.academicDetails}</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <label className={`space-y-2 text-sm text-gray-300 ${tamilClass}`}>
            {t.collegeName} *
            <input value={formData.collegeName} onChange={(e) => updateField('collegeName', e.target.value)} required className="input-field" />
          </label>
          <label className={`space-y-2 text-sm text-gray-300 ${tamilClass}`}>
            {t.university}
            <input value={formData.university} onChange={(e) => updateField('university', e.target.value)} className="input-field" />
          </label>
          <label className={`space-y-2 text-sm text-gray-300 ${tamilClass}`}>
            {t.department} *
            <input value={formData.department} onChange={(e) => updateField('department', e.target.value)} required className="input-field" />
          </label>
          <label className={`space-y-2 text-sm text-gray-300 ${tamilClass}`}>
            {t.year} *
            <select value={formData.year} onChange={(e) => updateField('year', e.target.value)} required className="input-field">
              <option value="">{t.selectOption}</option>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
              <option value="PG">PG</option>
            </select>
          </label>
          <label className={`space-y-2 text-sm text-gray-300 ${tamilClass}`}>
            {t.district} *
            <select value={formData.district} onChange={(e) => updateField('district', e.target.value)} required className="input-field">
              <option value="">{t.selectOption}</option>
              {tamilNaduDistricts.map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>
          </label>
          <label className={`space-y-2 text-sm text-gray-300 ${tamilClass}`}>
            {t.city}
            <input value={formData.city} onChange={(e) => updateField('city', e.target.value)} className="input-field" />
          </label>
        </div>
      </div>

      <div className="space-y-4 rounded-[28px] bg-black p-8">
        <h2 className={`text-2xl font-semibold text-white ${tamilClass}`}>{t.additional}</h2>
        <label className={`space-y-2 text-sm text-gray-300 ${tamilClass}`}>
          {t.whyJoinReason} *
          <textarea value={formData.reason} onChange={(e) => updateField('reason', e.target.value)} rows={4} required className="input-field" />
        </label>
        <div>
          <p className={`text-sm font-semibold text-white ${tamilClass}`}>{t.areasOfInterest}</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {interestOptions.map((option) => (
              <label key={option} className="inline-flex cursor-pointer items-center gap-3 rounded-2xl border border-primary/20 bg-black px-4 py-3 transition hover:border-primary/50">
                <input type="checkbox" checked={formData.interests.includes(option)} onChange={() => toggleInterest(option)} className="h-4 w-4 rounded border-primary/20 text-primary focus:ring-primary" />
                <span className="text-sm text-gray-300">{option}</span>
              </label>
            ))}
          </div>
        </div>
        <label className={`inline-flex items-center gap-3 text-sm text-gray-300 ${tamilClass}`}>
          <input type="checkbox" checked={formData.terms} onChange={(e) => updateField('terms', e.target.checked)} className="h-4 w-4 rounded border-primary/20 text-primary focus:ring-primary" />
          {t.agreeTerms}
        </label>
      </div>

      {error ? <p className="error-box">{error}</p> : null}

      <button type="submit" disabled={submitting} className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60">
        {submitting ? t.submitting : t.submitRegistration}
      </button>
    </form>
  );
}
