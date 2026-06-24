'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import Sidebar from '@/components/Sidebar';

export default function StudentResults() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [gradedAssignments, setGradedAssignments] = useState<any[]>([]);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    const fetchResults = async () => {
      if (user) {
        try {
          // جلب الواجبات اللي تم تصحيحها (status == 'graded') الخاصة بالطالب ده فقط
          const q = query(
            collection(db, 'assignments'),
            where('studentId', '==', user.uid),
            where('status', '==', 'graded')
          );
          const querySnapshot = await getDocs(q);
          const data = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          
          setGradedAssignments(data);
        } catch (error) {
          console.error("خطأ في جلب النتائج:", error);
        } finally {
          setPageLoading(false);
        }
      }
    };

    fetchResults();
  }, [user, loading, router]);

  if (loading || pageLoading) return <div className="p-8 text-center font-bold text-slate-600">جاري تجميع درجاتك... ⏳</div>;

  return (
    <div className="flex min-h-screen bg-gray-50" dir="rtl">
      <Sidebar />
      
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">سجل النتائج والدرجات 🏆</h1>
        <p className="text-gray-500 mb-8">تابع مستواك ودرجاتك في كل الواجبات والشيتات التي تم تصحيحها بواسطة المعلم.</p>

        {gradedAssignments.length === 0 ? (
           <div className="bg-white p-12 rounded-2xl border border-gray-200 text-center shadow-sm">
             <div className="text-6xl mb-4">📭</div>
             <h2 className="text-xl font-bold text-slate-800 mb-2">لا توجد نتائج حتى الآن</h2>
             <p className="text-gray-500">قم بتسليم واجباتك وانتظر حتى يقوم المعلم بتصحيحها لتظهر درجاتك هنا.</p>
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {gradedAssignments.map((assignment, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition relative overflow-hidden group">
                
                {/* شريط زينة علوي */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-emerald-600"></div>
                
                <div className="flex justify-between items-start mb-4 mt-2">
                  <div>
                    <h3 className="font-bold text-lg text-slate-800">{assignment.assignmentTitle}</h3>
                    <p className="text-xs text-gray-500 mt-1">{assignment.courseTitle}</p>
                  </div>
                  <div className="bg-green-50 text-green-600 p-3 rounded-xl flex items-center justify-center font-black text-xl shadow-inner border border-green-100 min-w-[60px]">
                    {assignment.grade}
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t border-gray-50 flex justify-between items-center text-sm">
                  <span className="text-gray-400 font-medium">حالة التقييم:</span>
                  <span className="text-green-600 font-bold flex items-center gap-1">
                    <span>تم الرصد</span>
                    <span>✅</span>
                  </span>
                </div>

              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}