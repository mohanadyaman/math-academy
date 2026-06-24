'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

// تحديد شكل البيانات اللي هنحفظها
type AuthContextType = {
  user: User | null;
  userData: any;
  loading: boolean;
};

// إنشاء الـ Context
const AuthContext = createContext<AuthContextType>({ user: null, userData: null, loading: true });

// إنشاء المزود (Provider) اللي هيغلف الموقع
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // مراقبة حالة تسجيل الدخول من فايربيس
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        // لو المستخدم مسجل، هنجيب بياناته (زي نوع الحساب) من قاعدة البيانات
        const docRef = doc(db, 'users', currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, userData, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// دالة جاهزة عشان نستخدمها في أي صفحة
export const useAuth = () => useContext(AuthContext);