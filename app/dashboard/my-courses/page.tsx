import Sidebar from '@/components/Sidebar';

export default function MyCourses() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">دوراتي 📚</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* الكورس الأول */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition">
            <div>
              <span className="bg-red-50 text-red-600 text-xs font-bold px-3 py-1 rounded-full mb-4 inline-block">IGCSE</span>
              <h3 className="text-lg font-bold text-slate-800 mb-2">الرياضيات البحتة - النظام البريطاني</h3>
              <p className="text-gray-500 text-sm mb-4">التقدم: 65%</p>
              
              <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
                <div className="bg-red-600 h-2 rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>
            <button className="w-full bg-red-50 text-red-600 font-bold py-2 rounded-lg hover:bg-red-600 hover:text-white transition shadow-sm">
              متابعة التعلم
            </button>
          </div>

          {/* الكورس الثاني */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition">
            <div>
              <span className="bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1 rounded-full mb-4 inline-block">المرحلة الثانوية</span>
              <h3 className="text-lg font-bold text-slate-800 mb-2">حساب التفاضل والتكامل المتقدم</h3>
              <p className="text-gray-500 text-sm mb-4">التقدم: 10%</p>
              
              <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '10%' }}></div>
              </div>
            </div>
            <button className="w-full bg-blue-50 text-blue-600 font-bold py-2 rounded-lg hover:bg-blue-600 hover:text-white transition shadow-sm">
              متابعة التعلم
            </button>
          </div>
        </div>

      </main>
    </div>
  );
}