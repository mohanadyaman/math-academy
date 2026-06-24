'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();

  // دالة تسجيل الخروج للطالب
  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error("خطأ أثناء تسجيل الخروج:", error);
    }
  };

  // روابط لوحة تحكم الطالب
  const navItems = [
    { name: 'دوراتي', href: '/dashboard', icon: '🎓' },
    { name: 'تصفح الكورسات', href: '/courses', icon: '🔍' },
    { name: 'تسليم الواجبات', href: '/dashboard/assignments', icon: '📝' },
    { name: 'نتائجي', href: '/dashboard/results', icon: '🏆' },
  ];

  return (
    <aside className="w-64 bg-white border-l border-gray-200 min-h-screen p-4 flex flex-col hidden md:flex">
      
      {/* بيانات الطالب */}
      <div className="mb-8 text-center mt-4 border-b border-gray-100 pb-6">
        <div className="w-16 h-16 bg-slate-100 text-slate-600 rounded-full mx-auto flex items-center justify-center text-2xl font-bold mb-3 shadow-inner">
          👤
        </div>
        <h2 className="font-bold text-slate-800 text-lg">
          {user?.displayName || 'طالب جديد'}
        </h2>
        <span className="text-xs text-green-600 bg-green-50 px-3 py-1 rounded-full font-bold border border-green-100">
          حساب طالب
        </span>
      </div>

      {/* الروابط */}
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <Link 
            key={item.name} 
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              pathname === item.href 
                ? 'bg-red-50 text-red-600 font-bold border border-red-100' 
                : 'text-gray-500 hover:bg-gray-50 hover:text-slate-800'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>

      {/* زر المساعدة وتسجيل الخروج */}
      <div className="mt-auto space-y-2">
        <Link 
          href="/contact"
          className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-slate-800 rounded-xl transition-all duration-200"
        >
          <span className="text-xl">📞</span>
          <span className="font-bold">تواصل مع المعلم</span>
        </Link>
        
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 w-full"
        >
          <span className="text-xl">🚪</span>
          <span className="font-bold">تسجيل الخروج</span>
        </button>
      </div>
      
    </aside>
  );
}