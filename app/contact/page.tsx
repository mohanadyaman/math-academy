'use client';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import AdminSidebar from '@/components/AdminSidebar';

export default function AdminMessages() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // جلب الرسائل من قاعدة البيانات
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMessages(data);
      } catch (error) {
        console.error("خطأ في جلب الرسائل:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, []);

  // تحويل حالة الرسالة إلى "مقروءة"
  const markAsRead = async (id: string) => {
    try {
      await updateDoc(doc(db, 'messages', id), { status: 'read' });
      setMessages(messages.map(msg => msg.id === id ? { ...msg, status: 'read' } : msg));
    } catch (error) {
      console.error("خطأ في تحديث الحالة:", error);
    }
  };

  // حذف الرسالة
  const deleteMessage = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الرسالة نهائياً؟')) return;
    try {
      await deleteDoc(doc(db, 'messages', id));
      setMessages(messages.filter(msg => msg.id !== id));
    } catch (error) {
      console.error("خطأ في حذف الرسالة:", error);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-slate-500">جاري تحميل الرسائل... ⏳</div>;

  return (
    <div className="flex min-h-screen bg-slate-50" dir="rtl">
      <AdminSidebar />
      
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-800 mb-2">صندوق الوارد 📩</h1>
            <p className="text-gray-500">استفسارات ورسائل الطلاب والزوار من صفحة التواصل.</p>
          </div>
          <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 font-bold text-slate-700">
            إجمالي الرسائل: <span className="text-red-600">{messages.length}</span>
          </div>
        </div>

        {messages.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-gray-100 text-center shadow-sm">
            <div className="text-6xl mb-4">📭</div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">صندوق الوارد فارغ</h2>
            <p className="text-gray-500">لا توجد رسائل جديدة في الوقت الحالي.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`bg-white rounded-2xl p-6 shadow-sm border-l-4 transition-all duration-300 ${
                  msg.status === 'unread' ? 'border-l-red-500 shadow-md' : 'border-l-gray-300 opacity-80'
                }`}
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-xl text-slate-800">{msg.subject}</h3>
                      {msg.status === 'unread' && (
                        <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-md">جديدة</span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500 mb-4 flex gap-4">
                      <span>👤 {msg.name}</span>
                      <span>✉️ {msg.email}</span>
                    </div>
                    <p className="text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100 leading-relaxed">
                      {msg.message}
                    </p>
                  </div>
                  
                  <div className="flex md:flex-col gap-2 min-w-[120px]">
                    {msg.status === 'unread' && (
                      <button 
                        onClick={() => markAsRead(msg.id)}
                        className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 px-4 rounded-lg transition text-sm flex items-center justify-center gap-2"
                      >
                        <span>👁️</span> تحديد كمقروءة
                      </button>
                    )}
                    <button 
                      onClick={() => deleteMessage(msg.id)}
                      className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 font-bold py-2 px-4 rounded-lg transition text-sm flex items-center justify-center gap-2 border border-red-100"
                    >
                      <span>🗑️</span> حذف
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}