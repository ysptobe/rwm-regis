import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Home, Info, Search, LogIn } from 'lucide-react';

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md sticky top-0 z-50">
        <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-red-600">
            YSP RUN
          </Link>
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="flex items-center text-gray-600 hover:text-red-500 transition-colors"><Home size={18} className="mr-1" />หน้าแรก</Link>
            <Link to="/info" className="flex items-center text-gray-600 hover:text-red-500 transition-colors"><Info size={18} className="mr-1" />ข้อมูลกิจกรรม</Link>
          </div>
          <Link to="/login" className="flex items-center bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-semibold">
            <LogIn size={18} className="mr-2" />เข้าสู่ระบบ
          </Link>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="bg-white mt-12 py-6 text-center text-gray-500 border-t">
        <p>&copy; {new Date().getFullYear()} YSP RUN WITH ME. All rights reserved.</p>
      </footer>
    </div>
  );
}