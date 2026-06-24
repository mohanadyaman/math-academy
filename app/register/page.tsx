'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { auth, db, googleProvider } from '@/lib/firebase'; // ضفنا الـ db هنا
import { signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'; // دوال قاعدة البيانات

export default function Register() {
  const [role, setRole] = useState('student');
  const router = useRouter();

  // دالة تسجيل الدخول بجوجل وربطها بقاعدة البيانات
  const handleGoogleSignIn = async () => {
    try {
      // 1. تسجيل الدخول عن طريق جوجل
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // 2. فحص هل المستخدم ده مسجل قبل كده ولا جديد؟
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      // 3. لو جديد، هننشئ ليه ملف في قاعدة البيانات
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          role: role, // هيحفظه كطالب أو معلم بناءً على الزرار اللي دايس عليه
          createdAt: serverTimestamp(),
          enrolledCourses: [], // مصفوفة فاضية للكورسات اللي هيشترك فيها
          grades: {} // مكان فاضي لدرجاته
        });
        console.log("تم إنشاء حساب جديد وحفظ البيانات بنجاح!");
      } else {
        console.log("تسجيل دخول ناجح لحساب موجود مسبقاً.");
      }
      
      // 4. توجيه المستخدم للوحة التحكم
      router.push('/dashboard');
    } catch (error) {
      console.error("حدث خطأ أثناء تسجيل الدخول:", error);
      alert("حدث خطأ أثناء الدخول، تأكد من اتصالك بالإنترنت.");
    }
  };

  return (
    <main dir="rtl" className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 w-full max-w-lg my-8">
        
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-red-600 mb-2">إنشاء حساب جديد</h1>
          <p className="text-gray-500">انضم إلينا وابدأ رحلة التميز 🚀</p>
        </div>

        {/* تبويبات اختيار نوع الحساب */}
        <div className="flex bg-gray-100 p-1 rounded-lg mb-6">
          <button 
            onClick={() => setRole('student')}
            className={`flex-1 py-2 text-sm font-bold rounded-md transition duration-300 ${role === 'student' ? 'bg-white text-red-600 shadow' : 'text-gray-500 hover:text-gray-700'}`}
          >
            طالب
          </button>
          <button 
            onClick={() => setRole('teacher')}
            className={`flex-1 py-2 text-sm font-bold rounded-md transition duration-300 ${role === 'teacher' ? 'bg-white text-red-600 shadow' : 'text-gray-500 hover:text-gray-700'}`}
          >
            معلم
          </button>
        </div>

        {/* زر التسجيل باستخدام جوجل */}
        <button 
          onClick={handleGoogleSignIn}
          type="button" 
          className="w-full mb-6 flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 font-bold py-3 rounded-lg hover:bg-gray-50 transition duration-300 shadow-sm"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google Logo" className="w-5 h-5" />
          التسجيل باستخدام حساب Google
        </button>

        <div className="flex items-center mb-6">
          <div className="flex-1 border-t border-gray-200"></div>
          <span className="px-4 text-gray-400 text-sm">أو باستخدام البريد الإلكتروني</span>
          <div className="flex-1 border-t border-gray-200"></div>
        </div>

        <form className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1 text-sm">البريد الإلكتروني</label>
            <input type="email" placeholder="name@example.com" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 outline-none text-left" dir="ltr" />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1 text-sm">كلمة المرور</label>
            <input type="password" placeholder="••••••••" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 outline-none text-left" dir="ltr" />
          </div>

          <button type="button" className="w-full bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700 transition duration-300 shadow-md mt-6">
            إنشاء حساب {role === 'student' ? 'طالب' : 'معلم'}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6 text-sm">
          لديك حساب بالفعل؟ <Link href="/login" className="text-red-600 font-bold hover:underline">تسجيل الدخول</Link>
        </p>

      </div>
    </main>
  );
}