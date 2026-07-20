'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { useAuth } from '@/context/AuthContext';
import { auth } from '@/lib/firebase';

const navItems = [
  { name: 'لوحة التحكم', href: '/admin', icon: '📊' },
  { name: 'إدارة الدورات', href: '/admin/courses', icon: '📚' },
  { name: 'إضافة درس جديد', href: '/admin/lessons/new', icon: '🎥' },
  { name: 'الطلاب والاشتراكات', href: '/admin/students', icon: '👨‍🎓' },
  { name: 'تصحيح الواجبات', href: '/admin/assignments', icon: '📝' },
  { name: 'رسائل التواصل', href: '/admin/messages', icon: '📩' },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();

  async function handleLogout() {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error('خطأ أثناء تسجيل الخروج:', error);
    }
  }

  return (
    <aside className="hidden min-h-screen w-64 flex-col bg-slate-900 p-4 text-white md:flex">
      <div className="mb-8 mt-4 border-b border-slate-700 pb-6 text-center">
        <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-red-600 text-2xl shadow-lg">👨‍🏫</div>
        <h2 className="text-lg font-bold">{user?.displayName || 'مهند'}</h2>
        <span className="rounded-full bg-red-400/10 px-3 py-1 text-xs text-red-400">لوحة الإدارة</span>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={'flex items-center gap-3 rounded-lg px-4 py-3 transition-all duration-200 ' + (pathname === item.href ? 'bg-red-600 font-bold text-white shadow-md' : 'text-gray-400 hover:bg-slate-800 hover:text-white')}
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>

      <button type="button" onClick={handleLogout} className="mt-auto flex w-full items-center gap-3 rounded-lg px-4 py-3 text-gray-400 transition-all duration-200 hover:bg-red-600 hover:text-white">
        <span className="text-xl">🚪</span>
        <span className="font-bold">تسجيل الخروج</span>
      </button>
    </aside>
  );
}
