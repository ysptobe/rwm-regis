import React, { useState, useEffect } from "react";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";

const initialForm = {
  passport_id: "",
  nationality: "ไทย",
  prename: "นาย",
  sex: "ชาย",
  applicant_type: "ทั่วไป",
  thai_name: "",
  thai_surname: "",
  eng_name: "",
  eng_surname: "",
  birth_year: "",
  singlet_size: "M",
  telephone: "",
  emergency_contact_phone: "",
  email: "",
  guardian_name: "",
  guardian_relationship: "",
  guardian_phone: ""
};

export default function ApplicantPage() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  // คำนวณอายุ
  const age = form.birth_year
    ? new Date().getFullYear() + 543 - parseInt(form.birth_year, 10)
    : "";

  useEffect(() => {
    // โหลดข้อมูลเดิมถ้ามี (เช่นจาก session หรือ supabase)
    const fetchData = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // ดึงข้อมูลจาก applicants ด้วย email หรือ passport_id
        let { data } = await supabase.from("applicants").select("*").eq("email", user.email).single();
        if (!data && user.user_metadata?.passport_id) {
          const { data: data2 } = await supabase.from("applicants").select("*").eq("passport_id", user.user_metadata.passport_id).single();
          data = data2;
        }
        if (data) setForm({ ...initialForm, ...data });
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    // ดึง user id จาก auth
    const { data: { user } } = await supabase.auth.getUser();
    
    // เตรียมข้อมูลพร้อม user_id
    const dataToSave = {
      user_id: user?.id,
      passport_id: form.passport_id,
      nationality: form.nationality,
      prename: form.prename,
      sex: form.sex,
      applicant_type: form.applicant_type,
      thai_name: form.thai_name,
      thai_surname: form.thai_surname,
      eng_name: form.eng_name,
      eng_surname: form.eng_surname,
      birth_year: form.birth_year,
      singlet_size: form.singlet_size,
      telephone: form.telephone,
      emergency_contact_phone: form.emergency_contact_phone,
      email: form.email,
      guardian_name: form.guardian_name || null,
      guardian_relationship: form.guardian_relationship || null,
      guardian_phone: form.guardian_phone || null
    };

    // upsert with user_id
    const { error } = await supabase
      .from("applicants")
      .upsert(dataToSave, { 
        onConflict: 'passport_id'
      });

    if (error) {
      setMsg("เกิดข้อผิดพลาด: " + error.message);
    } else {
      setMsg("บันทึกข้อมูลสำเร็จ");
      // ไม่ต้อง navigate ไปที่อื่น อยู่หน้าเดิม
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-xl mt-8">
      <h1 className="text-2xl font-bold mb-6 text-red-700">ข้อมูลผู้สมัคร</h1>
      {msg && <div className="mb-4 p-3 rounded bg-red-100 text-red-700">{msg}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label>บัตรประชาชนเลขที่</label>
            <input name="passport_id" value={form.passport_id} onChange={handleChange} maxLength={13} required className="input" />
          </div>
          <div>
            <label>สัญชาติ</label>
            <input name="nationality" value={form.nationality} onChange={handleChange} required className="input" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label>คำนำหน้า</label>
            <select name="prename" value={form.prename} onChange={handleChange} className="input">
              <option>นาย</option><option>นาง</option><option>นางสาว</option><option>เด็กชาย</option><option>เด็กหญิง</option>
            </select>
          </div>
          <div>
            <label>เพศ</label>
            <select name="sex" value={form.sex} onChange={handleChange} className="input">
              <option>ชาย</option><option>หญิง</option>
            </select>
          </div>
          <div>
            <label>ประเภทผู้สมัคร</label>
            <select name="applicant_type" value={form.applicant_type} onChange={handleChange} className="input">
              <option>ทั่วไป</option><option>นักเรียน</option><option>VIP</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label>ชื่อ (ไทย)</label>
            <input name="thai_name" value={form.thai_name} onChange={handleChange} required className="input" />
          </div>
          <div>
            <label>นามสกุล (ไทย)</label>
            <input name="thai_surname" value={form.thai_surname} onChange={handleChange} required className="input" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label>ชื่อ (Eng)</label>
            <input name="eng_name" value={form.eng_name} onChange={handleChange} className="input" />
          </div>
          <div>
            <label>นามสกุล (Eng)</label>
            <input name="eng_surname" value={form.eng_surname} onChange={handleChange} className="input" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label>ปีเกิด (พ.ศ.)</label>
            <input name="birth_year" value={form.birth_year} onChange={handleChange} type="number" required className="input" />
          </div>
          <div>
            <label>อายุ</label>
            <input value={age} disabled className="input bg-gray-100" />
          </div>
        </div>
        <div>
          <label>ขนาดเสื้อ</label>
          <select name="singlet_size" value={form.singlet_size} onChange={handleChange} className="input">
            <option>XS</option><option>S</option><option>M</option><option>L</option><option>XL</option><option>2XL</option><option>3XL</option>
          </select>
        </div>
        <div>
          <label>เบอร์โทร</label>
          <input name="telephone" value={form.telephone} onChange={handleChange} required className="input" />
        </div>
        <div>
          <label>อีเมล</label>
          <input name="email" value={form.email} onChange={handleChange} required className="input" />
        </div>
        <div>
          <label>เบอร์โทรติดต่อฉุกเฉิน</label>
          <input name="emergency_contact_phone" value={form.emergency_contact_phone} onChange={handleChange} required className="input" />
        </div>
        {age < 15 && (
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h2 className="font-bold mb-2 text-yellow-700">* ผู้สมัครอายุต่ำกว่า 15 ปี กรุณากรอกข้อมูลผู้ปกครอง</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label>ชื่อผู้ปกครอง</label>
                <input name="guardian_name" value={form.guardian_name} onChange={handleChange} className="input" />
              </div>
              <div>
                <label>ความสัมพันธ์</label>
                <input name="guardian_relationship" value={form.guardian_relationship} onChange={handleChange} className="input" />
              </div>
              <div>
                <label>เบอร์โทรผู้ปกครอง</label>
                <input name="guardian_phone" value={form.guardian_phone} onChange={handleChange} className="input" />
              </div>
            </div>
          </div>
        )}
        <button type="submit" disabled={loading} className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold text-lg disabled:bg-red-300">
          {loading ? "กำลังบันทึก..." : "บันทึกและดำเนินการต่อ"}
        </button>
      </form>
      <style>{`
        label { display:block; font-weight:500; margin-bottom:4px; color:#4A5568; }
        .input { width:100%; padding:10px; border:1px solid #CBD5E0; border-radius:8px; }
        .input:focus { border-color:#EF4444; outline:none; box-shadow:0 0 0 2px rgba(239,68,68,0.2);}
      `}</style>
    </div>
  );
}