import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";

export default function LoginPage() {
  const [passportId, setPassportId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 1. ล็อกอินด้วยเลขบัตรประชาชน
  const handlePassportSubmit = async () => {
    if (!passportId || passportId.length !== 13 || !/^\d+$/.test(passportId)) {
      setError("กรุณากรอกเลขบัตรประชาชน 13 หลักให้ถูกต้อง");
      return;
    }
    
    setLoading(true);
    setError("");

    try {
      // ตรวจสอบจากตาราง public_applicants
      const { data: existingUser, error: queryError } = await supabase
        .from("public_applicants")
        .select("id, passport_id")
        .eq("passport_id", passportId)
        .single();

      if (queryError && queryError.code !== "PGRST116") {
        setError("เกิดข้อผิดพลาดในการตรวจสอบข้อมูล");
        setLoading(false);
        return;
      }

      if (existingUser) {
        // พบข้อมูล - ทำการ sign in ด้วย magic link
        const { error: signInError } = await supabase.auth.signInWithOtp({
          email: `${passportId}@ysprun.local`,
          options: {
            emailRedirectTo: window.location.origin + "/apply"
          }
        });

        if (signInError) {
          setError("เข้าสู่ระบบไม่สำเร็จ: " + signInError.message);
          return;
        }

        // เก็บ passport_id ไว้ใช้ต่อ
        localStorage.setItem("passport_id", passportId);
        setError("กรุณาตรวจสอบอีเมลของท่านเพื่อเข้าสู่ระบบ");
      } else {
        // ยังไม่มีข้อมูลในระบบ
        setError("ยังไม่มีข้อมูลในระบบ กรุณาลงทะเบียนก่อน");
        setTimeout(() => {
          navigate(`/data/applicant/${passportId}`);
        }, 1500);
      }
    } catch (error) {
      setError("เกิดข้อผิดพลาดในการตรวจสอบข้อมูล");
    } finally {
      setLoading(false);
    }
  };

  // 2. ล็อกอินด้วย Google
  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin + "/login-google-callback"
      }
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="p-8 bg-white shadow-2xl rounded-2xl text-center w-full max-w-md">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">เข้าสู่ระบบ / ลงทะเบียน</h1>
        <p className="text-gray-600 mb-8">
          กรอกเลขบัตรประชาชนเพื่อลงทะเบียน หรือเข้าสู่ระบบด้วย Google หากเคยลงทะเบียนแล้ว
        </p>

        {error && <p className="text-red-600 mb-4 bg-red-100 p-3 rounded-lg">{error}</p>}

        <div className="space-y-4">
          <input
            type="tel"
            maxLength="13"
            placeholder="เลขบัตรประชาชน 13 หลัก"
            value={passportId}
            onChange={(e) => setPassportId(e.target.value.replace(/\D/g, ''))}
            className="border-2 p-3 w-full rounded-lg text-center text-lg tracking-widest focus:ring-2 focus:ring-red-500 focus:outline-none transition"
            disabled={loading}
          />
          <button
            onClick={handlePassportSubmit}
            disabled={loading || !passportId}
            className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg transition-colors font-semibold text-lg disabled:bg-red-300 disabled:cursor-not-allowed"
          >
            {loading ? "กำลังโหลด..." : "ดำเนินการต่อด้วยเลขบัตร"}
          </button>
        </div>

        <div className="my-6 flex items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="px-4 text-gray-400">หรือ</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full bg-white border-2 border-gray-300 hover:bg-gray-100 text-gray-700 px-4 py-3 rounded-lg transition-colors font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <svg className="w-6 h-6" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.53-4.18 7.13-10.01 7.13-16.65z"></path><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path><path fill="none" d="M0 0h48v48H0z"></path></svg>
          เข้าสู่ระบบด้วย Google
        </button>
      </div>
    </div>
  );
}