'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { doc, getDoc, collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import Link from 'next/link';

export default function CourseDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const router = useRouter();

  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [subStatus, setSubStatus] = useState<string | null>(null); // 'pending' | 'active' | null

  useEffect(() => {
    const fetchCourseAndStatus = async () => {
      try {
        // 1. جلب تفاصيل الكورس
        if (typeof id === 'string') {
          const courseRef = doc(db, 'courses', id);
          const courseSnap = await getDoc(courseRef);
          
          if (courseSnap.exists()) {
            setCourse({ id: courseSnap.id, ...courseSnap.data() });
          } else {
            router.push('/courses'); // لو الكورس مش موجود ارجعه للكتالوج
            return;
          }
        }

        // 2. فحص حالة اشتراك الطالب لو كان مسجل دخول
        if (user && id) {
          const q = query(
            collection(db, 'subscriptions'),
            where('studentId', '==', user.uid),
            where('courseId', '==', id)
          );
          const subSnap = await getDocs(q);
          if (!subSnap.empty) {
            setSubStatus(subSnap.docs[0].data().status);
          }
        }
      } catch (error) {
        console.error("خطأ في جلب البيانات:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseAndStatus();
  }, [id, user, router]);

  // دالة طلب الاشتراك في الكورس
  const handleSubscribe = async () => {
    // لو الطالب مش مسجل دخول، نوجهه لصفحة الدخول الأول
    if (!user) {
      alert("يجب تسجيل الدخول أولاً لطلب الاشتراك في الكورس.");
      router.push('/login');
      return;
    }

    try {
      setSubmitting(true);
      
      // إرسال طلب اشتراك جديد للوحة الإدارة
      await addDoc(collection(db, 'subscriptions'), {
        studentId: user.uid,
        studentName: user.displayName || 'طالب',
        studentEmail: user.email,
        courseId: course.id,
        courseTitle: course.title,
        status: 'pending', // الطلب بينزل قيد الانتظار لحد ما المعلم يوافق
        createdAt: serverTimestamp()
      });

      setSubStatus('pending');
      alert("تم إرسال طلب الاشتراك بنجاح! ✅ في انتظار موافقة المعلم.");
      
    } catch (error) {
      console.error("خطأ أثناء إرسال الطلب:", error);
      alert("حدث خطأ، يرجى المحاولة مرة أخرى.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-500 font-bold text-xl">جاري تحميل تفاصيل الدورة... ⏳</div>;
  if (!course) return null;

  return (
    <div className="min-h-screen bg-slate-50 font-sans" dir="rtl">
      
      {/* نافذة التنقل البسيطة */}
      <nav className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-black">أكاديمية <span className="text-red-500">مهند</span></Link>
        <Link href="/courses" className="text-gray-400 hover:text-white font-bold transition text-sm">
          ← العودة للكورسات
        </Link>
      </nav>

      {/* تفاصيل الكورس */}
      <main className="max-w-5xl mx-auto p-6 md:p-12">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row">
          
          {/* الجانب الأيمن: معلومات الكورس */}
          <div className="flex-1 p-8 md:p-12">
            <span className="text-xs font-bold bg-red-100 text-red-600 px-3 py-1 rounded-full mb-4 inline-block">
              دورة رياضيات مكثفة
            </span>
            <h1 className="text-3xl md:text-4xl font-black text-slate-800 mb-6 leading-tight">
              {course.title}
            </h1>
            
            <div className="space-y-6 text-gray-600 leading-relaxed">
              <div>
                <h3 className="font-bold text-slate-800 mb-2">وصف الدورة:</h3>
                <p>{course.description || 'هذه الدورة مصممة خصيصاً لتبسيط مفاهيم الرياضيات المعقدة، مع توفير تدريبات عملية وشيتات تقييم مستمرة لضمان تفوقك.'}</p>
              </div>
              
              <div className="flex flex-col gap-3 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">👨‍🏫</span>
                  <div>
                    <p className="text-sm text-gray-500 font-bold">المعلم</p>
                    <p className="font-bold text-slate-800">م. مهند</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-2 border-t border-slate-200 pt-3">
                  <span className="text-2xl">📱</span>
                  <div>
                    <p className="text-sm text-gray-500 font-bold">طريقة العرض</p>
                    <p className="font-bold text-slate-800">فيديوهات مسجلة + شيتات PDF</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* الجانب الأيسر: صندوق الاشتراك */}
          <div className="w-full md:w-96 bg-slate-900 text-white p-8 md:p-12 flex flex-col justify-center items-center text-center border-t md:border-t-0 md:border-r border-slate-800">
            <div className="text-7xl mb-6 drop-shadow-xl">🚀</div>
            <h2 className="text-2xl font-black mb-2">جاهز للتفوق؟</h2>
            <p className="text-gray-400 text-sm mb-8">انضم الآن واحصل على وصول كامل للمحاضرات والمرفقات.</p>

            {/* أزرار الحالات المختلفة */}
            {!subStatus ? (
              <button 
                onClick={handleSubscribe}
                disabled={submitting}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl transition shadow-lg shadow-red-600/30 disabled:opacity-50 text-lg"
              >
                {submitting ? 'جاري الإرسال...' : 'طلب الاشتراك في الدورة'}
              </button>
            ) : subStatus === 'pending' ? (
              <div className="w-full bg-amber-500/10 border border-amber-500/30 text-amber-500 font-bold py-4 rounded-xl text-center">
                ⏳ طلبك قيد المراجعة
                <p className="text-xs text-amber-500/70 mt-1 font-normal">يرجى الانتظار حتى يتم تفعيل حسابك</p>
              </div>
            ) : (
              <Link 
                href={`/dashboard/courses/${course.id}`}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl transition text-center block shadow-lg shadow-green-600/30 text-lg"
              >
                الدخول للدورة ✅
              </Link>
            )}

          </div>

        </div>
      </main>
    </div>
  );
}