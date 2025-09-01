import React, { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { useOutletContext } from "react-router-dom";

export default function AdminDashboardPage() {
  const { user, profile } = useOutletContext();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // ตรวจสอบสิทธิ์
  const isAdmin = profile?.role === "admin";
  const isOfficer = profile?.role === "officer";

  useEffect(() => {
    if (!isAdmin && !isOfficer) return;
    const fetchData = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("registrations")
        .select(`
          *,
          applicants (
            thai_name,
            thai_surname,
            passport_id,
            telephone
          )
        `);
      if (error) setMessage(error.message);
      else setRegistrations(data);
      setLoading(false);
    };
    fetchData();
  }, [isAdmin, isOfficer]);

  // อนุมัติ BIB (officer หรือ admin)
  const handleApproveBIB = async (regId, bibNumber) => {
    if (!isAdmin && !isOfficer) return;
    setMessage("");
    const { error } = await supabase
      .from("registrations")
      .update({ bib_number: bibNumber, payment_status: "paid" })
      .eq("id", regId);
    if (error) setMessage(error.message);
    else setMessage("อัปเดตหมายเลข BIB สำเร็จ");
  };

  // ลบข้อมูล (admin เท่านั้น)
  const handleDelete = async (regId) => {
    if (!isAdmin) return;
    setMessage("");
    const { error } = await supabase.from("registrations").delete().eq("id", regId);
    if (error) setMessage(error.message);
    else setRegistrations(registrations.filter((r) => r.id !== regId));
  };

  if (!isAdmin && !isOfficer) {
    return <div className="p-8 text-center text-red-600">คุณไม่มีสิทธิ์เข้าถึงหน้านี้</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Admin/Officer Dashboard</h1>
      {message && <div className="mb-4 p-3 bg-blue-100 text-blue-800 rounded">{message}</div>}
      {loading ? (
        <div>กำลังโหลดข้อมูล...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">ชื่อ</th>
                <th className="p-2 border">นามสกุล</th>
                <th className="p-2 border">เลขบัตร</th>
                <th className="p-2 border">เบอร์โทร</th>
                <th className="p-2 border">แพ็กเกจ</th>
                <th className="p-2 border">สถานะชำระเงิน</th>
                <th className="p-2 border">BIB</th>
                <th className="p-2 border">Slip</th>
                <th className="p-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((reg) => (
                <tr key={reg.id}>
                  <td className="border p-2">{reg.applicants?.thai_name}</td>
                  <td className="border p-2">{reg.applicants?.thai_surname}</td>
                  <td className="border p-2">{reg.applicants?.passport_id}</td>
                  <td className="border p-2">{reg.applicants?.telephone}</td>
                  <td className="border p-2">{reg.package_category}</td>
                  <td className="border p-2">{reg.payment_status}</td>
                  <td className="border p-2">
                    {(isAdmin || isOfficer) ? (
                      <BIBInput
                        value={reg.bib_number || ""}
                        onSave={(bib) => handleApproveBIB(reg.id, bib)}
                        disabled={reg.payment_status === "paid"}
                      />
                    ) : (
                      reg.bib_number || "-"
                    )}
                  </td>
                  <td className="border p-2">
                    {reg.slip_url ? (
                      <a href={reg.slip_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">ดูสลิป</a>
                    ) : "-"}
                  </td>
                  <td className="border p-2">
                    {isAdmin && (
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded"
                        onClick={() => handleDelete(reg.id)}
                      >
                        ลบ
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ฟอร์มสำหรับกรอก BIB
function BIBInput({ value, onSave, disabled }) {
  const [bib, setBib] = useState(value);
  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        if (bib) onSave(bib);
      }}
      className="flex gap-2"
    >
      <input
        type="text"
        value={bib}
        onChange={e => setBib(e.target.value)}
        className="border p-1 rounded w-20"
        disabled={disabled}
      />
      <button
        type="submit"
        className="bg-green-600 text-white px-2 rounded"
        disabled={disabled}
      >
        อนุมัติ
      </button>
    </form>
  );
}