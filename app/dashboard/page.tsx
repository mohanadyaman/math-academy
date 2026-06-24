'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import Sidebar from '@/components/Sidebar';
import Link from 'next/link';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const [myCourses, setMyCourses] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push('/register');
    
    // جلب الاشتراكات النشطة للطالب ده فقط
    const fetchMyCourses = async () => {
      if (user) {
        const q = query(
          collection(db, 'subscriptions'),
          where('studentId', '==', user.uid),
          where('status', '==', 'active')
        );
        const querySnapshot = await getDocs(q);
        const coursesData = querySnapshot.docs.map(doc => doc.data());
        setMyCourses(coursesData);
        setDataLoading(false);
      }
    };
    fetchMyCourses();
  }, [user, loading, router]);

  if (loading || dataLoading) return <div className="p-8 font-bold text-slate-600">جاري تحميل بياناتك... ⏳</div>;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-8">مرحباً {user?.displayName?.split(' ')[0]} 👋</h1>

        <h2 className="text-xl font-bold text-slate-800 mb-6">دوراتي المفعلة 🎓</h2>
        
        {myCourses.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center">
            <p className="text-gray-500 font-bold">لا توجد دورات مفعلة حالياً.</p>
            <p className="text-sm text-gray-400 mt-2">اشترك في دورة جديدة لتظهر هنا!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myCourses.map((course, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
                <h3 className="text-lg font-bold text-slate-800 mb-2">{course.courseTitle}</h3>
                <p className="text-sm text-green-600 font-bold mb-4">حالة الاشتراك: نشط ✅</p>
                {/* تم استبدال الزرار بـ Link لتوجيه الطالب لصفحة عرض الدورة */}
                <Link 
                  href={`/dashboard/courses/${course.courseId}`} 
                  className="block text-center w-full bg-slate-800 text-white font-bold py-2 rounded-lg hover:bg-red-600 transition"
                >
                  دخول الكورس
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}