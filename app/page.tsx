import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-red-500 selection:text-white" dir="rtl">
      
      {/* الشريط العلوي للزوار (Navbar) */}
      <nav className="bg-slate-900 text-white px-6 md:px-12 py-5 flex justify-between items-center fixed w-full top-0 z-50 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📐</span>
          <div className="text-xl font-black tracking-tight">
            أكاديمية <span className="text-red-500">مهند</span>
          </div>
        </div>
        <div className="flex gap-3 md:gap-4">
          <Link href="/login" className="text-gray-300 hover:text-white font-bold px-2 md:px-4 py-2 text-sm md:text-base transition">
            دخول الطلاب
          </Link>
          <Link href="/register" className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 md:px-6 py-2 rounded-lg text-sm md:text-base transition shadow-lg shadow-red-600/20">
            حساب جديد
          </Link>
        </div>
      </nav>

      {/* القسم الرئيسي (Hero Section) */}
      <section className="bg-slate-900 text-white pt-32 pb-40 px-4 text-center relative overflow-hidden">
        {/* تأثيرات إضاءة في الخلفية */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl opacity-20 pointer-events-none">
          <div className="absolute top-20 right-20 w-72 h-72 bg-red-600 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-20 left-20 w-72 h-72 bg-blue-600 rounded-full blur-[100px]"></div>
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          <span className="text-red-400 font-bold bg-red-400/10 border border-red-400/20 px-5 py-2 rounded-full text-sm mb-8 inline-block shadow-sm">
            المنصة التفاعلية الأولى لطلاب IGCSE & GCSE 🎓
          </span>
          <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight tracking-tight">
            الرياضيات بقت <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">
              أسهل وأمتع بكثير!
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            انضم الآن وتمتع بشروحات مبسطة، تدريبات مكثفة، ومتابعة دورية تضمن لك التفوق في أصعب المناهج الرياضية بخطوات مدروسة وتطبيقات عملية.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/courses" className="bg-red-600 hover:bg-red-700 text-white font-bold text-lg px-8 py-4 rounded-xl transition shadow-lg shadow-red-600/30 flex items-center justify-center gap-2">
              <span>تصفح الكورسات</span>
              <span>←</span>
            </Link>
            <Link href="/register" className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-lg px-8 py-4 rounded-xl transition flex items-center justify-center">
              ابدأ رحلتك مجاناً
            </Link>
          </div>
        </div>
      </section>

      {/* قسم المميزات (Features) */}
      <section className="py-10 px-4 max-w-6xl mx-auto -mt-20 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 text-center hover:-translate-y-2 transition-transform duration-300">
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl mx-auto flex items-center justify-center text-3xl mb-6 shadow-inner">
              🎥
            </div>
            <h3 className="text-xl font-black text-slate-800 mb-3">شروحات مسجلة عالية الجودة</h3>
            <p className="text-gray-500 leading-relaxed">
              فيديوهات تفصيلية لكل أجزاء المنهج مع أمثلة عملية، يمكنك الرجوع إليها في أي وقت ومن أي جهاز.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 text-center hover:-translate-y-2 transition-transform duration-300">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl mx-auto flex items-center justify-center text-3xl mb-6 shadow-inner">
              📝
            </div>
            <h3 className="text-xl font-black text-slate-800 mb-3">شيتات وواجبات دورية</h3>
            <p className="text-gray-500 leading-relaxed">
              تطبيق عملي بعد كل حصة مع نظام تسليم إلكتروني وتصحيح دقيق لضمان استيعابك للمعلومة.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 text-center hover:-translate-y-2 transition-transform duration-300">
            <div className="w-16 h-16 bg-green-50 text-green-600 rounded-2xl mx-auto flex items-center justify-center text-3xl mb-6 shadow-inner">
              👨‍🏫
            </div>
            <h3 className="text-xl font-black text-slate-800 mb-3">متابعة مستمرة وتقييم</h3>
            <p className="text-gray-500 leading-relaxed">
              تواصل مباشر ومستمر لمعرفة نقاط الضعف ومعالجتها، مع سجل نتائج متكامل لمتابعة تطورك.
            </p>
          </div>

        </div>
      </section>

      {/* قسم ختامي بسيط */}
      <section className="py-24 text-center px-4">
        <h2 className="text-3xl font-black text-slate-800 mb-6">مستعد لتحقيق العلامة الكاملة؟</h2>
        <p className="text-gray-500 mb-8 max-w-xl mx-auto">لا تضيع الوقت، سجل الآن في المنصة وابدأ بمشاهدة الدروس وحل الواجبات.</p>
        <Link href="/register" className="inline-block bg-slate-900 hover:bg-slate-800 text-white font-bold px-10 py-4 rounded-xl transition shadow-lg">
          إنشاء حساب طالب جديد
        </Link>
      </section>
      
      {/* الفوتر (Footer) */}
      <footer className="bg-slate-950 text-slate-500 py-8 text-center text-sm">
        <p>جميع الحقوق محفوظة © {new Date().getFullYear()} - المنصة التعليمية</p>
      </footer>

    </div>
  );
}