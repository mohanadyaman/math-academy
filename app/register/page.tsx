'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signInWithPopup } from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '@/lib/firebase';

export default function Register() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleGoogleSignIn() {
    try {
      setLoading(true);
      setError('');

      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const userRef = doc(db, 'users', user.uid);
      const userSnapshot = await getDoc(userRef);

      if (!userSnapshot.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          role: 'student',
          createdAt: serverTimestamp(),
          enrolledCourses: [],
          grades: {},
        });
      }

      router.push('/dashboard');
    } catch (signInError) {
      console.error('حدث خطأ أثناء إنشاء الحساب:', signInError);
      setError('تعذر إنشاء الحساب الآن. تأكد من اتصالك ثم حاول مرة أخرى.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main dir="rtl" className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="my-8 w-full max-w-lg rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
        <div className="mb-6 text-center">
          <h1 className="mb-2 text-3xl font-bold text-red-600">إنشاء حساب طالب جديد</h1>
          <p className="text-gray-500">انضم إلينا وابدأ رحلة التميز 🚀</p>
        </div>

        <div className="mb-6 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-blue-800">
          التسجيل العام مخصص للطلاب. تُنشأ حسابات الإدارة من خلال مالك المنصة فقط.
        </div>

        {error && <div role="alert" className="mb-6 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">{error}</div>}

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white py-3 font-bold text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="" className="h-5 w-5" />
          {loading ? 'جاري إنشاء الحساب...' : 'التسجيل باستخدام حساب Google'}
        </button>

        <p className="mt-6 text-center text-sm text-gray-600">
          لديك حساب بالفعل؟ <Link href="/login" className="font-bold text-red-600 hover:underline">تسجيل الدخول</Link>
        </p>
      </div>
    </main>
  );
}
