import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// صفحات مؤقتة (Placeholders)
const Home = () => <div className="p-4"><h1>مرحباً بك في تطبيق المحركات</h1><p>اختر أداة للبدء</p></div>;
const Calculator = () => <div className="p-4"><h1>حاسبة المحرك</h1></div>;
const Troubleshoot = () => <div className="p-4"><h1>استكشاف الأعطال</h1></div>;

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* الهيدر */}
        <header className="bg-primary text-white p-4 shadow-md">
          <h1 className="text-xl font-bold text-center">Induction Motor Pro</h1>
        </header>

        {/* المحتوى المتغير */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/calc" element={<Calculator />} />
            <Route path="/fix" element={<Troubleshoot />} />
          </Routes>
        </main>

        {/* شريط التنقل السفلي (للجوال) */}
        <nav className="bg-white border-t border-gray-200 flex justify-around p-3 pb-5 shadow-inner">
          <Link to="/" className="flex flex-col items-center text-gray-600 hover:text-primary">
            <span>🏠</span>
            <span className="text-xs">الرئيسية</span>
          </Link>
          <Link to="/calc" className="flex flex-col items-center text-gray-600 hover:text-primary">
            <span>🧮</span>
            <span className="text-xs">الحسابات</span>
          </Link>
          <Link to="/fix" className="flex flex-col items-center text-gray-600 hover:text-primary">
            <span>🔧</span>
            <span className="text-xs">الصيانة</span>
          </Link>
        </nav>
      </div>
    </Router>
  );
}

export default App;
