import React from "react";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
      <h1 className="text-9xl font-bold text-red-500">404</h1>
      <h2 className="text-3xl font-semibold mt-4 mb-2">ไม่พบหน้าที่คุณค้นหา</h2>
      <p className="text-gray-600 mb-8">
        ขออภัย หน้าที่คุณพยายามเข้าถึงไม่มีอยู่หรือถูกย้ายไปแล้ว
      </p>
      <Link
        to="/"
        className="bg-red-600 text-white px-6 py-3 rounded-md shadow-md hover:bg-red-500 transition-all duration-300"
      >
        กลับไปยังหน้าแรก
      </Link>
    </div>
  );
}