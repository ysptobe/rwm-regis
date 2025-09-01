import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";

const ADMIN_CODE = "ADMIN1234";
const OFFICER_CODE = "OFFICER5678";

export default function StaffLoginPage() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    let role = "";
    if (code === ADMIN_CODE) role = "admin";
    else if (code === OFFICER_CODE) role = "officer";
    else {
      setError("รหัสไม่ถูกต้อง");
      return;
    }

    // ตรวจสอบว่าผู้ใช้ล็อกอินอยู่หรือไม่
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError("กรุณาเข้าสู่ระบบด้วย Google ก่อน");
      return;
    }

    // อัปเดต role ใน profiles
    await supabase.from("profiles").upsert({
      id: user.id,
      role,
      updated_at: new Date().toISOString()
    });

    navigate("/"); // กลับหน้าแรกหรือไปหน้า admin
  };

  return (
    <div className="max-w-md mx-auto mt-16 bg-white p-8 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-6">เข้าสู่ระบบเจ้าหน้าที่</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password"
          className="w-full border p-3 rounded"
          placeholder="กรอกรหัสเจ้าหน้าที่หรือแอดมิน"
          value={code}
          onChange={e => setCode(e.target.value)}
        />
        {error && <div className="text-red-600">{error}</div>}
        <button className="w-full bg-blue-600 text-white py-3 rounded font-semibold">ยืนยัน</button>
      </form>
      <div className="mt-4 text-gray-500 text-sm">* ต้องเข้าสู่ระบบ Google ก่อน</div>
    </div>
  );
}