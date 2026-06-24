'use client';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import Link from 'next/link';

export default function PublicCourses() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'courses'));
        const coursesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data() as any
        }));
        setCourses(coursesData);
      } catch (error) {
        console.error("خطأ في جلب الكورسات:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 font-sans" dir="rtl">
      
      {/* رأس الصفحة (Header) */}
      <header className="bg-slate-900 text-white py-16 px-4 text-center border-b border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-black mb-4">الكورسات المتاحة 📚</h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            تصفح مجموعة الدورات التعليمية المتوفرة واشترك الآن لتبدأ رحلة التفوق في الرياضيات.
          </p>
          <div className="mt-8">
            <Link href="/" className="bg-slate-800 text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-slate-700 transition border border-slate-700">
              ← العودة للصفحة الرئيسية
            </Link>
          </div>
        </div>
      </header>

      {/* شبكة عرض الكورسات */}
      <main className="max-w-6xl mx-auto p-6 md:p-12">
        {loading ? (
          <div className="text-center text-slate-600 font-bold py-20 text-xl">جاري تحميل الكورسات... ⏳</div>
        ) : courses.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-200 shadow-sm">
            <span className="text-6xl mb-4 block">📭</span>
            <h2 className="text-2xl font-bold text-slate-800">لا توجد كورسات متاحة حالياً</h2>
            <p className="text-gray-500 mt-2">يرجى العودة لاحقاً عندما يقوم المعلم بإضافة دورات جديدة.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map(course => (
              <div key={course.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
                
                {/* غلاف الكورس الوهمي */}
                <div className="h-48 bg-slate-800 flex items-center justify-center text-6xl relative overflow-hidden">
                   <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-900 opacity-80"></div>
                   <span className="relative z-10 drop-shadow-md">📐</span>
                </div>
                
                {/* تفاصيل الكورس */}
                <div className="p-6 flex-1 flex flex-col relative">
                  {/* شريط السعر أو المستوى */}
                  <div className="absolute -top-5 right-6 bg-red-600 text-white text-xs font-black px-4 py-2 rounded-xl shadow-lg border-2 border-white">
                    كورس أساسي
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-800 mb-3 mt-2">{course.title}</h3>
                  <p className="text-gray-500 text-sm mb-6 line-clamp-3 flex-1 leading-relaxed">
                    {course.description || 'دورة شاملة في الرياضيات تغطي كافة أجزاء المنهج بأسلوب مبسط ومناسب لجميع المستويات. اشترك الآن لتحقيق أفضل النتائج!'}
                  </p>
                  
                  <Link 
                    href={`/courses/${course.id}`}
                    className="block text-center w-full bg-slate-900 text-white font-bold py-3 md:py-4 rounded-xl hover:bg-red-600 transition shadow-md"
                  >
                    التفاصيل والاشتراك 🚀
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}