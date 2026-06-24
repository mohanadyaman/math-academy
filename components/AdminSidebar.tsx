'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  
  const { user } = useAuth(); 

  // دالة تسجيل الخروج المباشرة من فايربيس
  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login'); 
    } catch (error) {
      console.error("خطأ أثناء تسجيل الخروج:", error);
    }
  };

  // قائمة الروابط الخاصة بلوحة الإدارة
  const navItems = [
    { name: 'لوحة التحكم', href: '/admin', icon: '📊' },
    { name: 'إدارة الدورات', href: '/admin/courses', icon: '📚' },
    { name: 'إضافة درس جديد', href: '/admin/lessons/new', icon: '🎥' },
    { name: 'الطلاب والاشتراكات', href: '/admin/students', icon: '👨‍🎓' },
    { name: 'تصحيح الواجبات', href: '/admin/assignments', icon: '📝' }, // الرابط الجديد
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen p-4 flex flex-col hidden md:flex">
      
      {/* بيانات المعلم */}
      <div className="mb-8 text-center mt-4 border-b border-slate-700 pb-6">
        <div className="w-16 h-16 bg-red-600 rounded-full mx-auto flex items-center justify-center text-2xl font-bold mb-3 shadow-lg">
          👨‍🏫
        </div>
        <h2 className="font-bold text-lg">{user?.displayName || 'مهند'}</h2>
        <span className="text-xs text-red-400 bg-red-400/10 px-3 py-1 rounded-full">لوحة الإدارة</span>
      </div>

      {/* الروابط */}
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <Link 
            key={item.name} 
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              pathname === item.href 
                ? 'bg-red-600 text-white shadow-md font-bold' 
                : 'text-gray-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>

      {/* زر تسجيل الخروج */}
      <button 
        onClick={handleLogout}
        className="mt-auto flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-red-600 hover:text-white rounded-lg transition-all duration-200 w-full"
      >
        <span className="text-xl">🚪</span>
        <span className="font-bold">تسجيل الخروج</span>
      </button>
      
    </aside>
  );
}