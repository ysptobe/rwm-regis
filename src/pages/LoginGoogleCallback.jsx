import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";

export default function LoginGoogleCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkApplicant = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login");
        return;
      }
      // ตรวจสอบว่ามีข้อมูลใน applicants หรือยัง (โดยใช้ email)
      const { data: applicant, error } = await supabase
        .from("applicants")
        .select("*")
        .eq("email", user.email)
        .single();

      // บันทึกการเข้าสู่ระบบ (optional: log หรือ analytics)
      // await supabase.from("login_logs").insert({ user_id: user.id, login_at: new Date().toISOString() });

      if (applicant) {
        // ถ้ามีข้อมูลแล้ว ไปหน้า apply
        navigate("/apply");
      } else {
        // ถ้ายังไม่มี ไปหน้ากรอกข้อมูลพื้นฐาน
        navigate(`/data/applicant/new`);
      }
    };
    checkApplicant();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-xl">กำลังตรวจสอบข้อมูล...</div>
    </div>
  );
}