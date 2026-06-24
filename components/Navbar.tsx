'use client';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function Navbar() {
  const { user, userData } = useAuth();

  // دالة تسجيل الخروج
  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = '/'; // إعادة توجيه للصفحة الرئيسية بعد الخروج
    } catch (error) {
      console.error("خطأ أثناء تسجيل الخروج:", error);
    }
  };

  return (
    <nav dir="rtl" className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* الشعار (Logo) بعد التعديل */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-slate-800 tracking-wide">
              منصة مهند <span className="text-red-600">.</span>
            </Link>
          </div>

          {/* روابط التصفح الأساسية */}
          <div className="hidden md:flex space-x-8 space-x-reverse">
            <Link href="/" className="text-gray-600 hover:text-slate-900 font-medium transition">الرئيسية</Link>
            <Link href="/courses" className="text-gray-600 hover:text-slate-900 font-medium transition">الدورات</Link>
            <Link href="/contact" className="text-gray-600 hover:text-slate-900 font-medium transition">اتصل بنا</Link>
          </div>

          {/* الأزرار الديناميكية بناءً على حالة تسجيل الدخول */}
          <div className="flex items-center gap-4">
            {user ? (
              // لو المستخدم مسجل دخول بالفعل
              <div className="flex items-center gap-4">
                <Link 
                  href={userData?.role === 'teacher' ? '/admin' : '/dashboard'} 
                  className="bg-gray-100 text-slate-800 px-4 py-2 rounded-lg font-bold hover:bg-gray-200 transition text-sm"
                >
                  {userData?.role === 'teacher' ? 'لوحة الإدارة ⚙️' : 'لوحة التحكم 📊'}
                </Link>
                <button 
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-700 font-medium text-sm transition"
                >
                  تسجيل الخروج
                </button>
              </div>
            ) : (
              // لو زائر جديد مش مسجل دخول
              <div className="flex items-center gap-2">
                <Link href="/login" className="text-gray-600 hover:text-slate-900 font-medium px-3 py-2 text-sm transition">
                  تسجيل الدخول
                </Link>
                <Link href="/register" className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-700 transition text-sm shadow-sm">
                  ابدأ الآن مجاناً
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}