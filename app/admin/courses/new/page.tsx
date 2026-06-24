'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function AddCourse() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // متغيرات لحفظ بيانات الكورس
  const [title, setTitle] = useState('');
  const [level, setLevel] = useState('IGCSE');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  // دالة رفع الكورس لقاعدة البيانات
  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price || !description) {
      alert("يرجى تعبئة جميع الحقول الأساسية!");
      return;
    }

    try {
      setLoading(true);
      // الإشارة إلى مجموعة "الكورسات" في قاعدة البيانات
      const coursesRef = collection(db, 'courses');
      
      // إضافة ملف (Document) جديد فيه بيانات الكورس
      await addDoc(coursesRef, {
        title,
        level,
        price: Number(price),
        description,
        imageUrl: imageUrl || 'https://via.placeholder.com/600x400?text=Course+Image', // صورة افتراضية لو مفيش
        createdAt: serverTimestamp(),
        studentsCount: 0, // كورس جديد مفيهوش طلاب لسه
      });

      alert("تمت إضافة الدورة بنجاح! 🎉");
      router.push('/admin/courses'); // نرجعه لصفحة إدارة الدورات
      
    } catch (error) {
      console.error("حدث خطأ أثناء إضافة الدورة:", error);
      alert("حدث خطأ، يرجى المحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-slate-800">إضافة دورة جديدة ➕</h1>
            <button 
              onClick={() => router.push('/admin/courses')}
              className="text-gray-500 hover:text-slate-800 font-bold transition"
            >
              العودة للخلف
            </button>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <form onSubmit={handleAddCourse} className="space-y-6">
              
              {/* اسم الدورة */}
              <div>
                <label className="block text-gray-700 font-bold mb-2">اسم الدورة</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="مثال: الرياضيات البحتة (IGCSE)" 
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* المرحلة الدراسية */}
                <div>
                  <label className="block text-gray-700 font-bold mb-2">المرحلة / النظام</label>
                  <select 
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 outline-none bg-white"
                  >
                    <option value="IGCSE">النظام البريطاني (IGCSE)</option>
                    <option value="HighSchool">المرحلة الثانوية (عام)</option>
                    <option value="MiddleSchool">المرحلة الإعدادية</option>
                  </select>
                </div>

                {/* السعر */}
                <div>
                  <label className="block text-gray-700 font-bold mb-2">السعر (ج.م شهرياً)</label>
                  <input 
                    type="number" 
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="مثال: 450" 
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 outline-none"
                  />
                </div>
              </div>

              {/* رابط الصورة */}
              <div>
                <label className="block text-gray-700 font-bold mb-2">رابط صورة الدورة (اختياري)</label>
                <input 
                  type="text" 
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg" 
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 outline-none text-left"
                  dir="ltr"
                />
              </div>

              {/* الوصف */}
              <div>
                <label className="block text-gray-700 font-bold mb-2">وصف الدورة</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  placeholder="اكتب وصفاً تفصيلياً لما سيتعلمه الطالب في هذه الدورة..." 
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 outline-none resize-none"
                ></textarea>
              </div>

              {/* زر الحفظ */}
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-red-600 text-white font-bold py-4 rounded-lg hover:bg-red-700 transition shadow-md disabled:opacity-50 text-lg"
              >
                {loading ? 'جاري رفع الدورة...' : 'حفظ الدورة ونشرها'}
              </button>

            </form>
          </div>
        </div>
      </main>
    </div>
  );
}