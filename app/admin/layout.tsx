'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// إيميل الإدارة الوحيد المسموح له بالدخول
const ADMIN_EMAILS = ['mohanadyaman544@gmail.com']; 

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // لو مش مسجل دخول أساساً، اطرده لصفحة تسجيل الدخول
        router.push('/login');
      } else if (user.email && !ADMIN_EMAILS.includes(user.email)) {
        // لو مسجل دخول بس إيميله مش بتاع الإدارة، اطرده لصفحة الطالب
        router.push('/dashboard');
      }
    }
  }, [user, loading, router]);

  // شاشة تحميل سريعة لحد ما نتأكد من هويته
  if (loading || !user || (user.email && !ADMIN_EMAILS.includes(user.email))) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50" dir="rtl">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600 mb-4"></div>
        <p className="text-slate-600 font-bold text-lg">جاري التحقق من الصلاحيات...</p>
      </div>
    );
  }

  // لو الإيميل مطابق للإدارة، دخله يشوف الصفحة عادي
  return <>{children}</>;
}