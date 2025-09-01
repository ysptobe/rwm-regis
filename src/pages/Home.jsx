import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, LogIn, Info } from "lucide-react";

export default function Home() {
  return (
    <>
      <div className="relative bg-red-600 text-white text-center py-20 md:py-32">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">YSP RUN WITH ME 2025</h1>
          <p className="text-xl md:text-2xl mb-8">ร่วมวิ่งเพื่อสุขภาพและการกุศล</p>
          <Link to="/login" className="bg-white text-red-600 font-bold py-3 px-8 rounded-full text-lg hover:bg-red-100 transition-transform transform hover:scale-105">
            สมัครเข้าร่วมเลย!
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800">ทำไมต้องร่วมงานกับเรา?</h2>
            <p className="text-gray-600 mt-2">สัมผัสประสบการณ์การวิ่งที่ไม่เหมือนใคร</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h3 className="font-bold text-xl mb-2">เส้นทางวิ่งที่สวยงาม</h3>
            <p>วิ่งผ่านธรรมชาติและจุดชมวิวที่น่าตื่นตาตื่นใจของยโสธร</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h3 className="font-bold text-xl mb-2">เพื่อสุขภาพและการกุศล</h3>
            <p>รายได้ส่วนหนึ่งหลังหักค่าใช้จ่ายมอบให้องค์กรการกุศลในพื้นที่</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h3 className="font-bold text-xl mb-2">ของที่ระลึกสุดพิเศษ</h3>
            <p>รับเสื้อและเหรียญรางวัลดีไซน์สวยงามเป็นที่ระลึก</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-3xl font-bold mb-8">YSP RUN WITH ME</h1>
        <Link to="/login" className="mb-4 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold">เข้าสู่ระบบผู้สมัคร</Link>
        <Link to="/staff-login" className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold">เข้าสู่ระบบเจ้าหน้าที่</Link>
      </div>
    </>
  );
}