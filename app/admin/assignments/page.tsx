'use client';
import { useEffect, useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';

export default function AdminAssignments() {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // جلب كل الواجبات من قاعدة البيانات
  const fetchAssignments = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'assignments'));
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as any)
      }));
      
      // ترتيب الواجبات: اللي لسه متصححش يظهر فوق في الأول
      data.sort((a, b) => a.status === 'pending' ? -1 : 1);
      setAssignments(data);
    } catch (error) {
      console.error("خطأ في جلب الواجبات:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  // دالة إضافة الدرجة
  const handleGradeSubmit = async (id: string) => {
    // استخدمنا window.prompt كطريقة سريعة وسهلة لإدخال الدرجة بدون تعقيد
    const gradeInput = window.prompt("أدخل الدرجة (مثال: 10/10 أو ممتاز):");
    
    // لو المعلم داس إلغاء أو مكتبش حاجة، نوقف العملية
    if (!gradeInput) return;

    try {
      const ref = doc(db, 'assignments', id);
      await updateDoc(ref, {
        status: 'graded',
        grade: gradeInput
      });
      
      // تحديث الجدول فوراً بدون ريفريش
      setAssignments(assignments.map(a => 
        a.id === id ? { ...a, status: 'graded', grade: gradeInput } : a
      ));
      
      alert("تم رصد الدرجة بنجاح! ✅ الطالب هيقدر يشوفها دلوقتي.");
    } catch (error) {
      console.error("خطأ أثناء رصد الدرجة:", error);
      alert("حدث خطأ أثناء حفظ الدرجة.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">تصحيح الواجبات 📝</h1>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead className="bg-slate-50 border-b border-gray-200">
                <tr>
                  <th className="p-4 font-bold text-gray-600 text-sm">اسم الطالب</th>
                  <th className="p-4 font-bold text-gray-600 text-sm">الدورة والواجب</th>
                  <th className="p-4 font-bold text-gray-600 text-sm">رابط الحل</th>
                  <th className="p-4 font-bold text-gray-600 text-sm">ملاحظات الطالب</th>
                  <th className="p-4 font-bold text-gray-600 text-sm">الإجراء / الدرجة</th>
                </tr>
              </thead>
              <tbody>
                
                {loading ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500 font-bold">
                      جاري تحميل الواجبات... ⏳
                    </td>
                  </tr>
                ) : assignments.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500 font-bold">
                      لا توجد واجبات مسلّمة حتى الآن.
                    </td>
                  </tr>
                ) : (
                  assignments.map((assignment) => (
                    <tr key={assignment.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                      <td className="p-4 font-bold text-slate-800 text-sm">{assignment.studentName}</td>
                      <td className="p-4 text-sm">
                        <div className="font-bold text-slate-700">{assignment.assignmentTitle}</div>
                        <div className="text-xs text-gray-500 mt-1">{assignment.courseTitle}</div>
                      </td>
                      <td className="p-4">
                        <a 
                          href={assignment.fileUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm font-bold underline"
                        >
                          عرض الحل 🔗
                        </a>
                      </td>
                      <td className="p-4 text-sm text-gray-600 max-w-xs truncate">
                        {assignment.notes || '-'}
                      </td>
                      <td className="p-4">
                        {assignment.status === 'pending' ? (
                          <button 
                            onClick={() => handleGradeSubmit(assignment.id)}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-700 transition shadow-sm"
                          >
                            رصد الدرجة
                          </button>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-green-700 bg-green-100 px-3 py-1 rounded-lg text-sm font-bold">
                              {assignment.grade}
                            </span>
                            <button 
                              onClick={() => handleGradeSubmit(assignment.id)}
                              className="text-xs text-gray-400 hover:text-slate-800 underline"
                            >
                              تعديل
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}

              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}