'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';

export default function Contact() {
  const { user } = useAuth();
  const router = useRouter();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedSubject = subject.trim();
    const trimmedMessage = message.trim();

    if (!trimmedSubject || !trimmedMessage) {
      setError('يرجى كتابة عنوان الرسالة وتفاصيلها.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      await addDoc(collection(db, 'messages'), {
        studentId: user?.uid ?? null,
        name: user?.displayName ?? 'زائر',
        email: user?.email ?? null,
        subject: trimmedSubject,
        message: trimmedMessage,
        status: 'unread',
        createdAt: serverTimestamp(),
      });

      setSubject('');
      setMessage('');
      setSuccess(true);
    } catch (submitError) {
      console.error('تعذر إرسال الرسالة:', submitError);
      setError('تعذر إرسال الرسالة الآن. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12" dir="rtl">
      <div className="mx-auto w-full max-w-xl overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-xl">
        <div className="relative overflow-hidden bg-slate-900 p-8 text-center">
          <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-red-600 opacity-40 blur-[60px]" />
          <h1 className="relative text-2xl font-black text-white">تواصل مع المعلم 📞</h1>
          <p className="relative mt-2 text-sm text-slate-300">
            اترك استفسارك وسنتواصل معك في أقرب وقت.
          </p>
        </div>

        <div className="p-6 sm:p-8">
          {success ? (
            <div className="py-8 text-center">
              <div className="mb-4 text-6xl">✅</div>
              <h2 className="text-xl font-bold text-slate-800">تم إرسال رسالتك بنجاح</h2>
              <p className="mt-2 text-slate-500">شكرًا لتواصلك معنا. سنرد عليك في أقرب وقت.</p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <button
                  type="button"
                  onClick={() => setSuccess(false)}
                  className="rounded-xl bg-slate-100 px-5 py-3 font-bold text-slate-800 transition hover:bg-slate-200"
                >
                  إرسال رسالة أخرى
                </button>
                <button
                  type="button"
                  onClick={() => router.push(user ? '/dashboard' : '/')}
                  className="rounded-xl bg-red-600 px-5 py-3 font-bold text-white transition hover:bg-red-700"
                >
                  العودة
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {!user && (
                <div className="rounded-xl border border-amber-100 bg-amber-50 p-4 text-sm font-medium text-amber-800">
                  يمكنك إرسال الرسالة كزائر، لكن <Link href="/login" className="font-bold underline">تسجيل الدخول</Link> يسهل علينا الرد عليك.
                </div>
              )}

              {error && (
                <div role="alert" className="rounded-xl border border-red-100 bg-red-50 p-3 text-sm font-medium text-red-700">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="subject" className="mb-2 block text-sm font-bold text-slate-700">عنوان الرسالة</label>
                <input
                  id="subject"
                  value={subject}
                  onChange={(event) => setSubject(event.target.value)}
                  maxLength={120}
                  placeholder="مثال: مشكلة في تفعيل الكورس"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-100"
                />
              </div>

              <div>
                <label htmlFor="message" className="mb-2 block text-sm font-bold text-slate-700">تفاصيل الرسالة</label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  maxLength={2000}
                  rows={6}
                  placeholder="اكتب استفسارك بالتفصيل هنا..."
                  className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-100"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-red-600 py-4 text-lg font-bold text-white shadow-lg shadow-red-600/20 transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'جاري الإرسال...' : 'إرسال الرسالة 🚀'}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
