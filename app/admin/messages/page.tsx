'use client';

import { useEffect, useState } from 'react';
import { collection, deleteDoc, doc, getDocs, orderBy, query, updateDoc } from 'firebase/firestore';
import AdminSidebar from '@/components/AdminSidebar';
import { db } from '@/lib/firebase';

type Message = {
  id: string;
  name?: string;
  email?: string | null;
  subject?: string;
  message?: string;
  status?: 'read' | 'unread';
};

export default function AdminMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadMessages() {
      try {
        const snapshot = await getDocs(query(collection(db, 'messages'), orderBy('createdAt', 'desc')));
        setMessages(snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as Message));
      } catch (loadError) {
        console.error('تعذر جلب الرسائل:', loadError);
        setError('تعذر تحميل الرسائل. حاول مرة أخرى.');
      } finally {
        setLoading(false);
      }
    }

    loadMessages();
  }, []);

  async function markAsRead(id: string) {
    try {
      await updateDoc(doc(db, 'messages', id), { status: 'read' });
      setMessages((current) => current.map((message) => message.id === id ? { ...message, status: 'read' } : message));
    } catch (updateError) {
      console.error('تعذر تحديث الرسالة:', updateError);
      setError('تعذر تحديث حالة الرسالة.');
    }
  }

  async function removeMessage(id: string) {
    if (!window.confirm('هل تريد حذف هذه الرسالة نهائيًا؟')) return;

    try {
      await deleteDoc(doc(db, 'messages', id));
      setMessages((current) => current.filter((message) => message.id !== id));
    } catch (deleteError) {
      console.error('تعذر حذف الرسالة:', deleteError);
      setError('تعذر حذف الرسالة.');
    }
  }

  return (
    <div className="flex min-h-screen bg-slate-50" dir="rtl">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto p-6 md:p-10">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-black text-slate-800">صندوق الوارد 📩</h1>
            <p className="mt-2 text-slate-500">استفسارات الطلاب والزوار من صفحة التواصل.</p>
          </div>
          <div className="rounded-xl border border-slate-100 bg-white px-4 py-2 font-bold text-slate-700 shadow-sm">
            إجمالي الرسائل: <span className="text-red-600">{messages.length}</span>
          </div>
        </div>

        {error && <div role="alert" className="mb-6 rounded-xl border border-red-100 bg-red-50 p-4 text-red-700">{error}</div>}

        {loading ? (
          <div className="rounded-3xl border border-slate-100 bg-white p-12 text-center font-bold text-slate-500 shadow-sm">جاري تحميل الرسائل... ⏳</div>
        ) : messages.length === 0 ? (
          <div className="rounded-3xl border border-slate-100 bg-white p-12 text-center shadow-sm">
            <div className="mb-4 text-6xl">📭</div>
            <h2 className="text-2xl font-bold text-slate-800">صندوق الوارد فارغ</h2>
          </div>
        ) : (
          <div className="grid gap-5">
            {messages.map((message) => (
              <article key={message.id} className={'rounded-2xl border-r-4 bg-white p-6 shadow-sm ' + (message.status === 'unread' ? 'border-r-red-500' : 'border-r-slate-300')}>
                <div className="flex flex-col gap-4 md:flex-row md:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-3">
                      <h2 className="text-xl font-bold text-slate-800">{message.subject || 'بدون عنوان'}</h2>
                      {message.status === 'unread' && <span className="rounded-md bg-red-100 px-2 py-1 text-xs font-bold text-red-600">جديدة</span>}
                    </div>
                    <p className="mb-4 text-sm text-slate-500">👤 {message.name || 'زائر'} {message.email ? '— ✉️ ' + message.email : ''}</p>
                    <p className="whitespace-pre-wrap rounded-xl border border-slate-100 bg-slate-50 p-4 leading-7 text-slate-700">{message.message || 'لا يوجد محتوى للرسالة.'}</p>
                  </div>
                  <div className="flex gap-2 md:w-36 md:flex-col">
                    {message.status === 'unread' && <button type="button" onClick={() => markAsRead(message.id)} className="flex-1 rounded-lg bg-slate-100 px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-200">تحديد كمقروءة</button>}
                    <button type="button" onClick={() => removeMessage(message.id)} className="flex-1 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm font-bold text-red-600 transition hover:bg-red-100">حذف</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
