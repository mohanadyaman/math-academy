'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { auth, db, googleProvider } from '@/lib/firebase';
import { signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export default function Login() {
  const [role, setRole] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // دالة لجلب بيانات المستخدم وتوجيهه للصفحة الصحيحة
  const routeUser = async (uid: string) => {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists() && userSnap.data().role === 'teacher') {
      router.push('/admin');
    } else {
      router.push('/dashboard');
    }
  };

  // 1. دالة الدخول باستخدام جوجل
  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      await routeUser(result.user.uid);
    } catch (error) {
      console.error("خطأ في الدخول بجوجل:", error);
      alert("حدث خطأ أثناء تسجيل الدخول.");
      setLoading(false);
    }
  };

  // 2. دالة الدخول باستخدام الإيميل والباسورد
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      alert("يرجى إدخال البريد الإلكتروني وكلمة المرور");
      return;
    }
    try {
      setLoading(true);
      const result = await signInWithEmailAndPassword(auth, email, password);
      await routeUser(result.user.uid);
    } catch (error) {
      console.error("خطأ في الدخول بالإيميل:", error);
      alert("البريد الإلكتروني أو كلمة المرور غير صحيحة.");
      setLoading(false);
    }
  };

  return (
    <main dir="rtl" className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 w-full max-w-md">
        
        {/* الترحيب */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-red-600 mb-2">تسجيل الدخول</h1>
          <p className="text-gray-500">أهلاً بك مجدداً في منصة مهند 🚀</p>
        </div>

        {/* زر الدخول بجوجل (الأسرع والأفضل) */}
        <button 
          onClick={handleGoogleLogin}
          disabled={loading}
          type="button" 
          className="w-full mb-6 flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 font-bold py-3 rounded-lg hover:bg-gray-50 transition duration-300 shadow-sm disabled:opacity-50"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google Logo" className="w-5 h-5" />
          {loading ? 'جاري الدخول...' : 'الدخول باستخدام Google'}
        </button>

        <div className="flex items-center mb-6">
          <div className="flex-1 border-t border-gray-200"></div>
          <span className="px-4 text-gray-400 text-xs">أو باستخدام البريد الإلكتروني</span>
          <div className="flex-1 border-t border-gray-200"></div>
        </div>

        {/* تبويبات اختيار نوع الحساب */}
        <div className="flex bg-gray-100 p-1 rounded-lg mb-8">
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
          <button 
            onClick={() => setRole('parent')}
            className={`flex-1 py-2 text-sm font-bold rounded-md transition duration-300 ${role === 'parent' ? 'bg-white text-red-600 shadow' : 'text-gray-500 hover:text-gray-700'}`}
          >
            ولي أمر
          </button>
        </div>

        {/* نموذج الدخول بالإيميل والباسورد */}
        <form onSubmit={handleEmailLogin} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-medium mb-2 text-sm">البريد الإلكتروني</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com" 
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition text-left"
              dir="ltr"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2 text-sm">كلمة المرور</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" 
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition text-left"
              dir="ltr"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500 accent-red-600" />
              <span className="text-sm text-gray-600">تذكرني</span>
            </label>
            <Link href="#" className="text-sm text-red-600 hover:underline font-medium">
              نسيت كلمة المرور؟
            </Link>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700 transition duration-300 shadow-md mt-4 disabled:opacity-50"
          >
            {loading ? 'جاري التحميل...' : `دخول كـ ${role === 'student' ? 'طالب' : role === 'teacher' ? 'معلم' : 'ولي أمر'}`}
          </button>
        </form>

        {/* رابط حساب جديد */}
        <p className="text-center text-gray-600 mt-8 text-sm">
          ليس لديك حساب؟{' '}
          <Link href="/register" className="text-red-600 font-bold hover:underline">
            إنشاء حساب جديد
          </Link>
        </p>

      </div>
    </main>
  );
}