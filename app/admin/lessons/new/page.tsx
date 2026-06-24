'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';

export default function AddLesson() {
  const router = useRouter();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingCourses, setFetchingCourses] = useState(true);

  const [courseId, setCourseId] = useState('');
  const [title, setTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [duration, setDuration] = useState('');
  const [pdfUrl, setPdfUrl] = useState(''); // متغير جديد لرابط الشيت

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'courses'));
        const coursesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          title: doc.data().title
        }));
        setCourses(coursesData);
        if (coursesData.length > 0) setCourseId(coursesData[0].id); 
      } catch (error) {
        console.error("خطأ في جلب الكورسات:", error);
      } finally {
        setFetchingCourses(false);
      }
    };
    fetchCourses();
  }, []);

  const handleAddLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseId || !title || !videoUrl || !duration) {
      alert("يرجى تعبئة جميع الحقول الأساسية!");
      return;
    }

    try {
      setLoading(true);
      
      await addDoc(collection(db, 'lessons'), {
        courseId,
        title,
        videoUrl,
        duration,
        pdfUrl: pdfUrl || null, // لو مفيش شيت هيتحفظ كـ null
        createdAt: serverTimestamp()
      });

      alert("تمت إضافة الدرس بنجاح! 🎉");
      // تصفير الحقول بعد الإضافة
      setTitle('');
      setVideoUrl('');
      setDuration('');
      setPdfUrl('');
    } catch (error) {
      console.error("خطأ أثناء إضافة الدرس:", error);
      alert("حدث خطأ، يرجى المحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-slate-800">إضافة درس فيديو جديد 🎥</h1>
            <button 
              onClick={() => router.push('/admin/courses')}
              className="text-gray-500 hover:text-slate-800 font-bold transition"
            >
              العودة للدورات
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            {fetchingCourses ? (
              <p className="text-center p-4 text-gray-500">جاري تحميل الكورسات المتاحة... ⏳</p>
            ) : courses.length === 0 ? (
              <p className="text-center p-4 text-red-500 font-bold">يجب إضافة دورة أولاً قبل إضافة الدروس!</p>
            ) : (
              <form onSubmit={handleAddLesson} className="space-y-6">
                
                <div>
                  <label className="block text-gray-700 font-bold mb-2">اختر الدورة / الكورس</label>
                  <select 
                    value={courseId}
                    onChange={(e) => setCourseId(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 outline-none bg-white"
                  >
                    {courses.map(course => (
                      <option key={course.id} value={course.id}>{course.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-2">عنوان الدرس</label>
                  <input 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="مثال: 01. حل تمارين شيت التفاضل" 
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-bold mb-2">رابط فيديو الدرس (MP4)</label>
                    <input 
                      type="text" 
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder="https://example.com/video.mp4" 
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 outline-none text-left"
                      dir="ltr"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-bold mb-2">مدة الفيديو</label>
                    <input 
                      type="text" 
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      placeholder="مثال: 30 دقيقة" 
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 outline-none"
                    />
                  </div>
                </div>

                {/* خانة المرفقات الجديدة */}
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <label className="block text-gray-700 font-bold mb-2">رابط شيت الواجب (PDF) - اختياري</label>
                  <input 
                    type="text" 
                    value={pdfUrl}
                    onChange={(e) => setPdfUrl(e.target.value)}
                    placeholder="https://example.com/sheet.pdf" 
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 outline-none text-left"
                    dir="ltr"
                  />
                  <p className="text-xs text-gray-500 mt-2">يمكنك وضع رابط لملف PDF من Google Drive لتنزيله من قبل الطلاب.</p>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-slate-800 text-white font-bold py-4 rounded-lg hover:bg-slate-900 transition shadow-md disabled:opacity-50 text-lg"
                >
                  {loading ? 'جاري الحفظ...' : 'رفع ونشر الدرس 🚀'}
                </button>

              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}