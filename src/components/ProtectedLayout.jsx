import { useEffect, useState } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabase';
import { LogOut, Activity, CreditCard, Crown } from 'lucide-react';

export default function ProtectedLayout() {
  const [user, setUser] = useState(null);
  const [applicant, setApplicant] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAndData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login', { replace: true });
        return;
      }
      setUser(session.user);

      // ดึง profile
      const { data: profileData } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
      setProfile(profileData);

      // ตรวจสอบข้อมูลพื้นฐานใน applicants
      let applicantData = null;
      // 1. กรณี login ด้วย Google: ใช้ email
      if (session.user.email) {
        const { data } = await supabase.from('applicants').select('*').eq('email', session.user.email).single();
        applicantData = data;
      }
      // 2. กรณี login ด้วยเลขบัตร: ใช้ passport_id ที่เก็บไว้ใน localStorage
      if (!applicantData) {
        const passportId = localStorage.getItem("passport_id");
        if (passportId) {
          const { data } = await supabase.from('applicants').select('*').eq('passport_id', passportId).single();
          applicantData = data;
        }
      }
      if (!applicantData) {
        // ถ้าไม่มีข้อมูล ให้ไปหน้ากรอกข้อมูลพื้นฐาน
        navigate(`/data/applicant/new`);
        return;
      }
      setApplicant(applicantData);
      setLoading(false);
    };

    fetchUserAndData();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen text-xl">กำลังโหลดข้อมูล...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/apply" className="text-xl font-bold text-red-600">YSP RUN DASHBOARD</Link>
          <div className="flex items-center gap-4">
            <span className="text-gray-700 hidden sm:block">สวัสดี, {profile?.eng_name || profile?.thai_name}</span>
            <button onClick={handleLogout} className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2">
              <LogOut size={16} /> ออกจากระบบ
            </button>
          </div>
        </div>
      </header>
      <div className="container mx-auto flex flex-col md:flex-row gap-8 p-4">
        <aside className="md:w-64 flex-shrink-0">
            <div className="bg-white p-4 rounded-xl shadow-md">
                <h3 className="font-bold text-lg mb-4">เมนู</h3>
                <nav className="flex flex-col space-y-2">
                  <Link to="/apply" className="flex items-center gap-3 p-2 rounded-md hover:bg-red-50 text-gray-700 font-medium"><Activity size={20}/> สมัครวิ่ง</Link>
                  <Link to="/payment" className="flex items-center gap-3 p-2 rounded-md hover:bg-red-50 text-gray-700 font-medium"><CreditCard size={20}/> ชำระเงิน</Link>
                  <Link to="/vip" className="flex items-center gap-3 p-2 rounded-md hover:bg-red-50 text-gray-700 font-medium"><Crown size={20}/> สิทธิพิเศษ VIP</Link>
                  <Link to="/profile" className="flex items-center gap-3 p-2 rounded-md hover:bg-blue-50 text-blue-700 font-medium">
                    ตรวจสอบข้อมูลส่วนตัว
                  </Link>
                </nav>
            </div>
        </aside>
        <main className="flex-grow">
          <Outlet context={{ applicant, user, profile }} />
        </main>
      </div>
    </div>
  );
}