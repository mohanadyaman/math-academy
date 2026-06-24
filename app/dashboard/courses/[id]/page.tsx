'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import Link from 'next/link';

export default function CourseViewer() {
  const { id } = useParams();
  const { user, loading } = useAuth();
  const router = useRouter();
  
  const [courseTitle, setCourseTitle] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  
  const [lessons, setLessons] = useState<any[]>([]);
  // تم التغيير من activeVideo إلى activeLesson لحفظ بيانات الدرس بالكامل
  const [activeLesson, setActiveLesson] = useState<any>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    const fetchCourseData = async () => {
      if (user && id) {
        try {
          const subQuery = query(
            collection(db, 'subscriptions'),
            where('studentId', '==', user.uid),
            where('courseId', '==', id),
            where('status', '==', 'active')
          );
          const subSnap = await getDocs(subQuery);
          
          if (!subSnap.empty) {
            setIsAuthorized(true);
            setCourseTitle(subSnap.docs[0].data().courseTitle);

            const lessonsQuery = query(
              collection(db, 'lessons'),
              where('courseId', '==', id)
            );
            const lessonsSnap = await getDocs(lessonsQuery);
            
            // ترتيب الدروس بناءً على وقت الإنشاء عشان تظهر بالترتيب الصحيح
            const lessonsData = lessonsSnap.docs.map(doc => ({
              id: doc.id,
              ...(doc.data() as any)
            })).sort((a, b) => a.createdAt - b.createdAt);

            setLessons(lessonsData);

            if (lessonsData.length > 0) {
              setActiveLesson(lessonsData[0]);
            }

          } else {
            alert('عذراً، أنت غير مشترك في هذه الدورة أو لم يتم تفعيل حسابك بعد.');
            router.push('/dashboard');
          }
        } catch (error) {
          console.error("خطأ أثناء جلب البيانات:", error);
        } finally {
          setPageLoading(false);
        }
      }
    };

    fetchCourseData();
  }, [user, loading, id, router]);

  if (loading || pageLoading) return <div className="p-8 text-center font-bold text-slate-600">جاري فتح الكورس... ⏳</div>;
  if (!isAuthorized) return null;

  return (
    <main dir="rtl" className="min-h-screen bg-slate-900 text-white flex flex-col">
      
      <header className="bg-slate-800 border-b border-slate-700 px-6 py-4 flex justify-between items-center">
        <div>
          <span className="text-xs text-red-400 font-bold">المنصة التعليمية 🚀</span>
          <h1 className="text-xl font-bold text-gray-100">{courseTitle}</h1>
        </div>
        <Link href="/dashboard" className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg text-sm font-bold transition">
          الخروج للوحة التحكم →
        </Link>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row">
        
        {/* اليمين: مشغل الفيديو والمرفقات */}
        <div className="flex-1 p-4 lg:p-6 flex flex-col justify-start bg-black overflow-y-auto">
          {activeLesson ? (
            <>
              <div className="w-full max-w-4xl mx-auto aspect-video bg-slate-950 rounded-xl overflow-hidden border border-slate-800 shadow-2xl">
                <video 
                  key={activeLesson.videoUrl} // تحديث مشغل الفيديو عند تغيير الدرس
                  src={activeLesson.videoUrl} 
                  controls 
                  controlsList="nodownload" 
                  className="w-full h-full"
                ></video>
              </div>
              
              <div className="w-full max-w-4xl mx-auto mt-6 px-2 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-100">{activeLesson.title}</h2>
                  <p className="text-sm text-gray-400 mt-1">تأكد من مشاهدة المحاضرة بتركيز وتدوين الملاحظات.</p>
                </div>

                {/* زر تحميل الشيت (يظهر فقط لو المعلم رفع رابط) */}
                {activeLesson.pdfUrl && (
                  <a 
                    href={activeLesson.pdfUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold transition shadow-lg whitespace-nowrap"
                  >
                    <span>📄</span>
                    تحميل شيت الواجب
                  </a>
                )}
              </div>
            </>
          ) : (
             <div className="w-full max-w-4xl mx-auto aspect-video bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-center flex-col gap-4 mt-10">
                <span className="text-4xl">📭</span>
                <p className="text-slate-400 font-bold">لا توجد دروس مرفوعة في هذه الدورة حتى الآن.</p>
             </div>
          )}
        </div>

        {/* اليسار: الفهرس الديناميكي */}
        <div className="w-full lg:w-80 bg-slate-800 border-t lg:border-t-0 lg:border-l border-slate-700 p-4 overflow-y-auto">
          <h3 className="font-bold text-gray-300 mb-4 pb-2 border-b border-slate-700 text-sm">محتويات الدورة 📋</h3>
          <div className="space-y-2">
            {lessons.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">جاري تجهيز الدروس...</p>
            ) : (
              lessons.map((lesson) => (
                <button
                  key={lesson.id}
                  onClick={() => setActiveLesson(lesson)}
                  className={`w-full text-right p-3 rounded-xl border transition text-sm flex flex-col gap-2 ${
                    activeLesson?.id === lesson.id 
                      ? 'bg-red-600 border-red-500 text-white shadow-md' 
                      : 'bg-slate-800/50 border-slate-700 text-gray-300 hover:bg-slate-700'
                  }`}
                >
                  <span className="font-bold">{lesson.title}</span>
                  <div className="flex justify-between items-center w-full">
                    <span className={`text-xs ${activeLesson?.id === lesson.id ? 'text-red-100' : 'text-gray-500'}`}>
                      ⏱️ {lesson.duration}
                    </span>
                    {lesson.pdfUrl && <span className="text-xs bg-slate-900/50 px-2 py-1 rounded">📄 مرفق</span>}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

      </div>
    </main>
  );
}