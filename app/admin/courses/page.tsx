'use client';
import { useEffect, useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

export default function AdminCourses() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // دالة لجلب الكورسات من قاعدة البيانات
  const fetchCourses = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'courses'));
      const coursesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCourses(coursesData);
    } catch (error) {
      console.error("حدث خطأ أثناء جلب الدورات:", error);
    } finally {
      setLoading(false);
    }
  };

  // تشغيل دالة الجلب أول ما الصفحة تفتح
  useEffect(() => {
    fetchCourses();
  }, []);

  // دالة لحذف الكورس
  const handleDelete = async (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذه الدورة؟ لا يمكن التراجع عن هذا الإجراء.')) {
      try {
        await deleteDoc(doc(db, 'courses', id));
        // تحديث الجدول بعد الحذف
        setCourses(courses.filter(course => course.id !== id));
      } catch (error) {
        console.error("حدث خطأ أثناء الحذف:", error);
        alert("حدث خطأ أثناء الحذف.");
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-slate-800">إدارة الدورات 📚</h1>
          <Link 
            href="/admin/courses/new" 
            className="bg-red-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-700 transition shadow-sm inline-block"
          >
            + إضافة دورة جديدة
          </Link>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-right">
            <thead className="bg-slate-50 border-b border-gray-200">
              <tr>
                <th className="p-4 font-bold text-gray-600 text-sm">اسم الدورة</th>
                <th className="p-4 font-bold text-gray-600 text-sm hidden md:table-cell">المرحلة</th>
                <th className="p-4 font-bold text-gray-600 text-sm">السعر</th>
                <th className="p-4 font-bold text-gray-600 text-sm">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500 font-bold">
                    جاري تحميل الدورات... ⏳
                  </td>
                </tr>
              ) : courses.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500 font-bold">
                    لا توجد دورات حالياً. أضف دورتك الأولى!
                  </td>
                </tr>
              ) : (
                courses.map((course) => (
                  <tr key={course.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                    <td className="p-4 font-medium text-slate-800 text-sm">{course.title}</td>
                    <td className="p-4 text-gray-500 text-sm hidden md:table-cell">
                      {course.level === 'IGCSE' ? 'النظام البريطاني' : course.level === 'HighSchool' ? 'المرحلة الثانوية' : 'المرحلة الإعدادية'}
                    </td>
                    <td className="p-4 font-bold text-slate-800 text-sm">{course.price} ج.م</td>
                    <td className="p-4">
                      <button className="text-blue-600 text-sm font-bold ml-4 hover:underline">تعديل</button>
                      <button 
                        onClick={() => handleDelete(course.id)}
                        className="text-red-600 text-sm font-bold hover:underline"
                      >
                        حذف
                      </button>
                    </td>
                  </tr>
                ))
              )}

            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}