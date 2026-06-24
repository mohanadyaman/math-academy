'use client';
import { useEffect, useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';

export default function AdminStudents() {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // جلب كل الاشتراكات من قاعدة البيانات
  const fetchSubscriptions = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'subscriptions'));
      // استخدام (doc.data() as any) لحل مشكلة النوع في TypeScript
      const subsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as any)
      }));
      
      // ترتيب البيانات بحيث تظهر الطلبات الجديدة (قيد الانتظار) في الأول
      subsData.sort((a, b) => a.status === 'pending' ? -1 : 1);
      setSubscriptions(subsData);
    } catch (error) {
      console.error("حدث خطأ أثناء جلب الاشتراكات:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  // دالة تفعيل اشتراك الطالب
  const handleApprove = async (id: string) => {
    try {
      const subRef = doc(db, 'subscriptions', id);
      await updateDoc(subRef, {
        status: 'active' // تغيير الحالة لنشط
      });
      
      // تحديث الجدول فوراً بدون الحاجة لعمل ريفريش للصفحة
      setSubscriptions(subscriptions.map(sub => 
        sub.id === id ? { ...sub, status: 'active' } : sub
      ));
      
      alert("تم تفعيل اشتراك الطالب بنجاح! ✅");
    } catch (error) {
      console.error("خطأ أثناء التفعيل:", error);
      alert("حدث خطأ أثناء تفعيل الاشتراك.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      
      <main className="flex-1 p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold text-slate-800">الطلاب والاشتراكات 👨‍🎓</h1>
          
          <div className="w-full md:w-1/3">
            <input 
              type="text" 
              placeholder="ابحث عن طالب..." 
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-right">
            <thead className="bg-slate-50 border-b border-gray-200">
              <tr>
                <th className="p-4 font-bold text-gray-600 text-sm">اسم الطالب</th>
                <th className="p-4 font-bold text-gray-600 text-sm hidden lg:table-cell">البريد الإلكتروني</th>
                <th className="p-4 font-bold text-gray-600 text-sm">الدورة المطلوبة</th>
                <th className="p-4 font-bold text-gray-600 text-sm">الحالة</th>
                <th className="p-4 font-bold text-gray-600 text-sm">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500 font-bold">
                    جاري تحميل بيانات الطلاب... ⏳
                  </td>
                </tr>
              ) : subscriptions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500 font-bold">
                    لا توجد طلبات اشتراك حتى الآن.
                  </td>
                </tr>
              ) : (
                subscriptions.map((sub) => (
                  <tr key={sub.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                    <td className="p-4 font-medium text-slate-800 text-sm">{sub.studentName}</td>
                    <td className="p-4 text-gray-500 text-sm hidden lg:table-cell" dir="ltr">{sub.studentEmail}</td>
                    <td className="p-4 text-sm text-gray-700">{sub.courseTitle}</td>
                    <td className="p-4">
                      {sub.status === 'active' ? (
                        <span className="text-green-700 bg-green-100 px-3 py-1 rounded-full text-xs font-bold">نشط</span>
                      ) : (
                        <span className="text-amber-700 bg-amber-100 px-3 py-1 rounded-full text-xs font-bold">قيد الانتظار</span>
                      )}
                    </td>
                    <td className="p-4">
                      {sub.status === 'pending' && (
                        <button 
                          onClick={() => handleApprove(sub.id)}
                          className="text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-sm font-bold transition shadow-sm"
                        >
                          تفعيل الاشتراك
                        </button>
                      )}
                      {sub.status === 'active' && (
                        <button className="text-red-600 text-sm font-bold hover:underline bg-red-50 px-4 py-2 rounded-lg transition hover:bg-red-100">
                          إيقاف
                        </button>
                      )}
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