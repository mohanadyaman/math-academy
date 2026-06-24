'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import Sidebar from '@/components/Sidebar';

export default function StudentAssignments() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [myCourses, setMyCourses] = useState<any[]>([]);
  const [myAssignments, setMyAssignments] = useState<any[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // حقول نموذج التسليم
  const [courseId, setCourseId] = useState('');
  const [assignmentTitle, setAssignmentTitle] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      if (user) {
        try {
          // 1. جلب الكورسات النشطة عشان الطالب يختار منها
          const coursesQ = query(
            collection(db, 'subscriptions'),
            where('studentId', '==', user.uid),
            where('status', '==', 'active')
          );
          const coursesSnap = await getDocs(coursesQ);
          const coursesData = coursesSnap.docs.map(doc => ({
            id: doc.data().courseId,
            title: doc.data().courseTitle
          }));
          setMyCourses(coursesData);
          if (coursesData.length > 0) setCourseId(coursesData[0].id);

          // 2. جلب الواجبات اللي الطالب سلمها قبل كده
          const assignmentsQ = query(
            collection(db, 'assignments'),
            where('studentId', '==', user.uid)
          );
          const assignmentsSnap = await getDocs(assignmentsQ);
          const assignmentsData = assignmentsSnap.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setMyAssignments(assignmentsData);

        } catch (error) {
          console.error("خطأ في جلب البيانات:", error);
        } finally {
          setPageLoading(false);
        }
      }
    };

    fetchData();
  }, [user, loading, router]);

  // دالة تسليم الواجب
  const handleSubmitAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseId || !assignmentTitle || !fileUrl) {
      alert("يرجى تعبئة الحقول الأساسية (الدورة، عنوان الواجب، ورابط الحل)!");
      return;
    }

    try {
      setSubmitting(true);
      
      const selectedCourse = myCourses.find(c => c.id === courseId);

      const newAssignment = {
        studentId: user?.uid,
        studentName: user?.displayName || 'طالب',
        courseId,
        courseTitle: selectedCourse?.title || '',
        assignmentTitle,
        fileUrl,
        notes,
        status: 'pending', // قيد المراجعة
        grade: null, // الدرجة لسه متسجلتش
        submittedAt: serverTimestamp()
      };

      await addDoc(collection(db, 'assignments'), newAssignment);

      alert("تم تسليم الواجب بنجاح! سيقوم المعلم بمراجعته قريباً. 🎯");
      
      // تحديث الجدول فوراً بالواجب الجديد
      setMyAssignments([{ ...newAssignment, submittedAt: new Date() }, ...myAssignments]);
      
      // تصفير الحقول
      setAssignmentTitle('');
      setFileUrl('');
      setNotes('');
      
    } catch (error) {
      console.error("خطأ أثناء تسليم الواجب:", error);
      alert("حدث خطأ، يرجى المحاولة مرة أخرى.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || pageLoading) return <div className="p-8 text-center font-bold text-slate-600">جاري تحميل البيانات... ⏳</div>;

  return (
    <div className="flex min-h-screen bg-gray-50" dir="rtl">
      <Sidebar />
      
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold text-slate-800 mb-8">تسليم الواجبات 📝</h1>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* نموذج تسليم واجب جديد */}
          <div className="xl:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-200 h-fit">
            <h2 className="text-xl font-bold text-slate-800 mb-6 pb-2 border-b border-gray-100">تسليم واجب جديد</h2>
            
            {myCourses.length === 0 ? (
              <p className="text-red-500 font-bold text-sm">يجب أن تكون مشتركاً في دورة واحدة على الأقل لتتمكن من تسليم الواجبات.</p>
            ) : (
              <form onSubmit={handleSubmitAssignment} className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-bold mb-2 text-sm">اختر الدورة</label>
                  <select 
                    value={courseId}
                    onChange={(e) => setCourseId(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 outline-none bg-white text-sm"
                  >
                    {myCourses.map(course => (
                      <option key={course.id} value={course.id}>{course.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-2 text-sm">عنوان الواجب (مثال: شيت 1)</label>
                  <input 
                    type="text" 
                    value={assignmentTitle}
                    onChange={(e) => setAssignmentTitle(e.target.value)}
                    placeholder="اكتب اسم الشيت أو الواجب" 
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-2 text-sm">رابط الحل (Google Drive)</label>
                  <input 
                    type="text" 
                    value={fileUrl}
                    onChange={(e) => setFileUrl(e.target.value)}
                    placeholder="ضع رابط مجلد صور الحل هنا" 
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 outline-none text-left text-sm"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-2 text-sm">ملاحظات للمعلم (اختياري)</label>
                  <textarea 
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="هل واجهت صعوبة في سؤال معين؟" 
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 outline-none text-sm resize-none"
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={submitting}
                  className="w-full bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700 transition shadow-md disabled:opacity-50"
                >
                  {submitting ? 'جاري الإرسال...' : 'إرسال الواجب'}
                </button>
              </form>
            )}
          </div>

          {/* جدول الواجبات السابقة */}
          <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden h-fit">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-slate-800">سجل الواجبات المرسلة 📋</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead className="bg-slate-50 border-b border-gray-200">
                  <tr>
                    <th className="p-4 font-bold text-gray-600 text-sm">الدورة</th>
                    <th className="p-4 font-bold text-gray-600 text-sm">الواجب</th>
                    <th className="p-4 font-bold text-gray-600 text-sm">الحالة</th>
                    <th className="p-4 font-bold text-gray-600 text-sm">الدرجة</th>
                  </tr>
                </thead>
                <tbody>
                  {myAssignments.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-gray-500 font-bold">
                        لم تقم بتسليم أي واجبات حتى الآن.
                      </td>
                    </tr>
                  ) : (
                    myAssignments.map((assignment, idx) => (
                      <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50 transition">
                        <td className="p-4 text-sm font-medium text-slate-800">{assignment.courseTitle}</td>
                        <td className="p-4 text-sm text-gray-600">{assignment.assignmentTitle}</td>
                        <td className="p-4">
                          {assignment.status === 'graded' ? (
                            <span className="text-green-700 bg-green-100 px-3 py-1 rounded-full text-xs font-bold">تم التصحيح</span>
                          ) : (
                            <span className="text-amber-700 bg-amber-100 px-3 py-1 rounded-full text-xs font-bold">قيد المراجعة</span>
                          )}
                        </td>
                        <td className="p-4 font-black text-slate-800">
                          {assignment.grade ? `${assignment.grade}` : '-'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}