'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useLocale } from 'next-intl';

export default function ContactSectionInstitutional() {
  const t = useTranslations('landing.contact');
  const locale = useLocale();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    need: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    const [firstName, ...rest] = formData.name.trim().split(' ');
    const lastName = rest.join(' ').trim() || firstName;

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: firstName || 'Client',
          lastName: lastName || 'Client',
          email: formData.email,
          activity: formData.company,
          domain: formData.need,
          message: formData.message,
          source: 'landing-contact',
          locale,
          consent: true,
          website: '',
        }),
      });

      if (!res.ok) throw new Error('submit failed');

      setStatus('success');
      setFormData({ name: '', email: '', company: '', need: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {t('title')}
            </h2>
            <p className="text-xl text-gray-600">
              {t('subtitle')}
            </p>
          </div>

          <motion.form
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            onSubmit={handleSubmit}
            className="bg-white rounded-xl p-8 shadow-lg"
          >
            <div className="space-y-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  {t('form.name')}
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  {t('form.email')}
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  {t('form.company')}
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  {t('form.need')}
                </label>
                <select
                  required
                  value={formData.need}
                  onChange={(e) => setFormData({ ...formData, need: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Sélectionnez un besoin</option>
                  {t.raw('needs').map((need: string, index: number) => (
                    <option key={index} value={need}>
                      {need}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  {t('form.message')}
                </label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="flex-1 bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  {status === 'loading' ? '...' : t('form.submit')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    window.location.href = `/${locale}/#contact`;
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 px-8 py-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  {t('form.schedule')}
                </button>
              </div>
              {status === 'success' && (
                <p className="text-sm text-green-700">
                  {locale === 'fr'
                    ? 'Votre demande a bien été envoyée.'
                    : 'Your request has been sent successfully.'}
                </p>
              )}
              {status === 'error' && (
                <p className="text-sm text-red-600">
                  {locale === 'fr'
                    ? 'Une erreur est survenue. Merci de réessayer.'
                    : 'An error occurred. Please try again.'}
                </p>
              )}
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  );
}

