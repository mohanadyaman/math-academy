export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-right">
        <div>
          <h3 className="text-xl font-bold mb-4 text-red-500">منصة مهند التعليمية</h3>
          <p className="text-gray-400 text-sm">الوجهة الأولى لاحتراف الرياضيات والعلوم بأحدث الوسائل التعليمية.</p>
        </div>
        <div>
          <h3 className="text-lg font-bold mb-4">روابط سريعة</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li>سياسة الخصوصية</li>
            <li>شروط الاستخدام</li>
            <li>اتصل بنا</li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-bold mb-4">تواصل معنا</h3>
          <p className="text-gray-400 text-sm">القاهرة، مصر</p>
          <p className="text-gray-400 text-sm mt-2">WhatsApp: 01xxxxxxxxx</p>
        </div>
      </div>
      <div className="text-center mt-12 pt-8 border-t border-slate-800 text-gray-500 text-sm">
        جميع الحقوق محفوظة © 2026 لمهند.
      </div>
    </footer>
  );
}