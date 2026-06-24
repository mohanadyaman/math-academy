'use client';
import { useEffect, useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import Link from 'next/link';

export default function AdminDashboardHome() {
  const [stats, setStats] = useState({
    totalCourses: 0,
    activeStudents: 0,
    pendingRequests: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // 1. حساب عدد الكورسات
        const coursesSnap = await getDocs(collection(db, 'courses'));
        
        // 2. حساب عدد الطلاب النشطين
        const activeSubQuery = query(collection(db, 'subscriptions'), where('status', '==', 'active'));
        const activeSubSnap = await getDocs(activeSubQuery);
        
        // 3. حساب عدد الطلبات قيد الانتظار
        const pendingSubQuery = query(collection(db, 'subscriptions'), where('status', '==', 'pending'));
        const pendingSubSnap = await getDocs(pendingSubQuery);

        setStats({
          totalCourses: coursesSnap.size,
          activeStudents: activeSubSnap.size,
          pendingRequests: pendingSubSnap.size,
        });
      } catch (error) {
        console.error("خطأ في جلب الإحصائيات:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">نظرة عامة 📊</h1>
        <p className="text-gray-500 mb-8">مرحباً بك في لوحة تحكم الإدارة. إليك ملخص لأداء منصتك اليوم.</p>

        {loading ? (
          <div className="text-center p-8 text-gray-500 font-bold">جاري تحميل الإحصائيات... ⏳</div>
        ) : (
          <>
            {/* كروت الإحصائيات */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex items-center gap-4">
                <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center text-2xl font-bold">
                  📚
                </div>
                <div>
                  <p className="text-gray-500 text-sm font-bold">إجمالي الدورات</p>
                  <p className="text-2xl font-black text-slate-800">{stats.totalCourses}</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex items-center gap-4">
                <div className="w-14 h-14 bg-green-100 text-green-600 rounded-xl flex items-center justify-center text-2xl font-bold">
                  👨‍🎓
                </div>
                <div>
                  <p className="text-gray-500 text-sm font-bold">الطلاب النشطين</p>
                  <p className="text-2xl font-black text-slate-800">{stats.activeStudents}</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex items-center gap-4">
                <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center text-2xl font-bold">
                  ⏳
                </div>
                <div>
                  <p className="text-gray-500 text-sm font-bold">طلبات بانتظار الموافقة</p>
                  <p className="text-2xl font-black text-slate-800">{stats.pendingRequests}</p>
                </div>
              </div>

            </div>

            {/* روابط سريعة */}
            <h2 className="text-xl font-bold text-slate-800 mb-4">إجراءات سريعة ⚡</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/admin/lessons/new" className="bg-slate-800 text-white p-6 rounded-2xl shadow-sm hover:bg-slate-900 transition flex items-center justify-between group">
                <div>
                  <h3 className="font-bold text-lg mb-1">رفع درس جديد</h3>
                  <p className="text-slate-400 text-sm">أضف فيديو جديد لإحدى دوراتك</p>
                </div>
                <span className="text-2xl group-hover:-translate-x-2 transition transform">←</span>
              </Link>
              
              <Link href="/admin/students" className="bg-red-600 text-white p-6 rounded-2xl shadow-sm hover:bg-red-700 transition flex items-center justify-between group">
                <div>
                  <h3 className="font-bold text-lg mb-1">مراجعة طلبات الاشتراك</h3>
                  <p className="text-red-200 text-sm">قم بتفعيل حسابات الطلاب الجدد</p>
                </div>
                <span className="text-2xl group-hover:-translate-x-2 transition transform">←</span>
              </Link>
            </div>
          </>
        )}
      </main>
    </div>
  );
}