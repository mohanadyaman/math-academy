'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Contact() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !message) {
      alert('يرجى تعبئة جميع الحقول!');
      return;
    }

    try {
      setLoading(true);
      // إرسال الرسالة لقاعدة البيانات في مجموعة messages
      await addDoc(collection(db, 'messages'), {
        studentId: user?.uid || 'غير مسجل',
        name: user?.displayName || 'زائر',
        email: user?.email || 'غير متوفر',
        subject,
        message,
        status: 'unread', // رسالة غير مقروءة
        createdAt: serverTimestamp()
      });

      setSuccess(true);
      setSubject('');
      setMessage('');
      
      // إخفاء رسالة النجاح بعد 5 ثواني
      setTimeout(() => setSuccess(false), 5000);
      
    } catch (error) {
      console.error("خطأ أثناء إرسال الرسالة:", error);
      alert("حدث خطأ، يرجى المحاولة لاحقاً.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col" dir="rtl">
      
      {/* رأس الصفحة */}
      <nav className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-black">أكاديمية <span className="text-red-500">مهند</span></Link>
        <button onClick={() => router.back()} className="text-gray-400 hover:text-white font-bold transition text-sm">
          ← عودة
        </button>
      </nav>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="bg-white max-w-xl w-full rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          
          <div className="bg-slate-900 p-8 text-center relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-red-600 rounded-full blur-[60px] opacity-50"></div>
             <h1 className="text-2xl font-black text-white relative z-10">تواصل مع المعلم 📞</h1>
             <p className="text-gray-400 mt-2 text-sm relative z-10">هل لديك استفسار أو تواجه مشكلة؟ نحن هنا لمساعدتك.</p>
          </div>

          <div className="p-8">
            {success ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">✅</div>
                <h2 className="text-xl font-bold text-slate-800 mb-2">تم الإرسال بنجاح!</h2>
                <p className="text-gray-500">وصلت رسالتك للمعلم، وسيتم الرد عليك في أقرب وقت.</p>
                <button 
                  onClick={() => router.push('/dashboard')}
                  className="mt-6 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-6 py-3 rounded-xl transition"
                >
                  العودة للوحة التحكم
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* لو الطالب مش مسجل دخول، هنلفت انتباهه */}
                {!user && (
                  <div className="bg-amber-50 text-amber-700 p-4 rounded-xl text-sm font-bold border border-amber-100 mb-4">
                    ⚠️ أنت تراسلنا كزائر. يفضل <Link href="/login" className="underline">تسجيل الدخول</Link> لسهولة التواصل.
                  </div>
                )}

                <div>
                  <label className="block text-slate-700 font-bold mb-2 text-sm">عنوان الرسالة</label>
                  <input 
                    type="text" 
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="مثال: مشكلة في تفعيل الكورس" 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500 outline-none transition bg-slate-50 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-2 text-sm">تفاصيل الرسالة</label>
                  <textarea 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="اكتب استفسارك بالتفصيل هنا..." 
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500 outline-none transition bg-slate-50 focus:bg-white resize-none"
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl transition shadow-lg shadow-red-600/20 disabled:opacity-50 text-lg"
                >
                  {loading ? 'جاري الإرسال...' : 'إرسال الرسالة 🚀'}
                </button>
              </form>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}