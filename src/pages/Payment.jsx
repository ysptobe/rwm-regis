import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { supabase } from '../supabase';
import { UploadCloud, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export default function PaymentPage() {
  const { applicant } = useOutletContext();
  const [registration, setRegistration] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [transferDate, setTransferDate] = useState('');
  const [transferTime, setTransferTime] = useState('');
  const [message, setMessage] = useState({ text: '', type: 'info' });

  useEffect(() => {
    if (!applicant) return;
    const fetchRegistration = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('registrations').select('*').eq('applicant_id', applicant.id).single();
      
      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        setMessage({ text: `เกิดข้อผิดพลาด: ${error.message}`, type: 'error' });
      } else if (data) {
        setRegistration(data);
        if (data.transfer_datetime) {
          // Format for datetime-local input
          const localDate = new Date(new Date(data.transfer_datetime).getTime() - (new Date().getTimezoneOffset() * 60000));
          setTransferDate(localDate.toISOString().slice(0, 10));
          setTransferTime(localDate.toISOString().slice(11, 16));
        }
      } else {
        setMessage({ text: 'ไม่พบข้อมูลการสมัคร กรุณาไปที่หน้า "สมัครวิ่ง" ก่อน', type: 'error' });
      }
      setLoading(false);
    };
    fetchRegistration();
  }, [applicant]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return setMessage({ text: 'กรุณาเลือกไฟล์สลิป', type: 'error' });
    if (!transferDate || !transferTime) return setMessage({ text: 'กรุณาระบุวันและเวลาที่โอน', type: 'error' });
    
    setUploading(true);
    setMessage({ text: 'กำลังอัปโหลดสลิป...', type: 'info' });

    const fileExt = file.name.split('.').pop();
    const fileName = `${applicant.id}-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`; // Supabase Storage v2 doesn't need folder in path here

    // 1. Upload file to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('payment_slips')
      .upload(filePath, file);
    if (uploadError) {
      setMessage({ text: `Upload Error: ${uploadError.message}`, type: 'error' });
      setUploading(false);
      return;
    }

    // 2. Get public URL of the uploaded file
    const { data: urlData } = supabase.storage
      .from('payment_slips')
      .getPublicUrl(filePath);
    // urlData.publicUrl คือ URL สำหรับแสดงผล
    
    // 3. Update registration table with URL and status
    const { error: updateError } = await supabase
      .from('registrations')
      .update({ 
          slip_url: urlData.publicUrl, 
          payment_status: 'verifying',
          transfer_datetime: new Date(`${transferDate} ${transferTime}`).toISOString(),
          updated_at: new Date().toISOString()
      })
      .eq('id', registration.id)
      .select()
      .single();

    if (updateError) {
      setMessage({ text: `Update Error: ${updateError.message}`, type: 'error' });
    } else {
      setMessage({ text: 'อัปโหลดสำเร็จ! เจ้าหน้าที่จะตรวจสอบและยืนยันการชำระเงินเร็วๆ นี้', type: 'success' });
      setRegistration(prev => ({ ...prev, payment_status: 'verifying', slip_url: urlData.publicUrl }));
    }
    setUploading(false);
  };

  const StatusDisplay = ({ status }) => {
    if (status === 'paid') {
      return <div className="flex items-center gap-2 text-center p-4 bg-green-100 rounded-lg text-green-800 font-semibold"><CheckCircle size={20} /> การชำระเงินของคุณได้รับการยืนยันแล้ว</div>;
    }
    if (status === 'verifying') {
      return <div className="flex items-center gap-2 text-center p-4 bg-yellow-100 rounded-lg text-yellow-800 font-semibold"><Clock size={20} /> สลิปของคุณอยู่ระหว่างการตรวจสอบ</div>;
    }
    if (status === 'failed') {
        return <div className="flex items-center gap-2 text-center p-4 bg-red-100 rounded-lg text-red-800 font-semibold"><AlertCircle size={20} /> การชำระเงินไม่สำเร็จ กรุณาอัปโหลดสลิปอีกครั้ง</div>;
    }
    return null;
  };

  if (loading) return <div className="bg-white p-8 rounded-xl shadow-md">กำลังโหลดข้อมูลการชำระเงิน...</div>;

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl">
      <h1 className="text-3xl font-bold mb-6">การชำระเงิน</h1>
      {message.text && <div className={`p-4 mb-6 rounded-lg text-center ${message.type === 'error' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>{message.text}</div>}
      
      {!registration ? ( <p>ไม่พบข้อมูลการสมัครในระบบ</p> ) : (
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">สรุปข้อมูลการสมัคร</h2>
            <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
              <p><strong>ผู้สมัคร:</strong> {applicant.thai_name} {applicant.thai_surname}</p>
              <p><strong>แพ็กเกจ:</strong> {registration.package_category}</p>
              <p><strong>ยอดชำระทั้งหมด:</strong> <span className="font-bold text-red-600 text-2xl">{registration.total_cost?.toLocaleString()} บาท</span></p>
              <p><strong>สถานะปัจจุบัน:</strong> <span className={`font-semibold px-2 py-1 rounded-full text-sm ${
                  registration.payment_status === 'paid' ? 'bg-green-200 text-green-900' :
                  registration.payment_status === 'verifying' ? 'bg-yellow-200 text-yellow-900' :
                  'bg-gray-200 text-gray-900'
              }`}>{registration.payment_status}</span></p>
            </div>
            <h2 className="text-xl font-semibold mt-8 mb-4 border-b pb-2">ข้อมูลการโอนเงิน</h2>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg text-blue-900">
              <ul className="space-y-2">
                <li><strong>ธนาคาร:</strong> กรุงไทย สาขาเทสโก้โลตัสยโสธร</li>
                <li><strong>เลขที่บัญชี:</strong> 865-0-69605-8</li>
                <li><strong>ชื่อบัญชี:</strong> YSP. RUN WITH ME 3nd</li>
              </ul>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">แจ้งการชำระเงิน</h2>
            <StatusDisplay status={registration.payment_status} />

            {(registration.payment_status === 'pending' || registration.payment_status === 'failed') && (
              <div className="space-y-4 mt-4">
                <div>
                  <label className="block font-medium mb-1">วัน-เวลาที่โอน</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input type="date" value={transferDate} onChange={e => setTransferDate(e.target.value)} className="input" />
                    <input type="time" value={transferTime} onChange={e => setTransferTime(e.target.value)} className="input" />
                  </div>
                </div>
                <div>
                  <label className="block font-medium mb-1">หลักฐานการโอน (สลิป)</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label htmlFor="slipUpload" className="relative cursor-pointer bg-white rounded-md font-medium text-red-600 hover:text-red-500 focus-within:outline-none">
                          <span>เลือกไฟล์</span>
                          <input id="slipUpload" name="slipUpload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*,.pdf" />
                        </label>
                        <p className="pl-1">หรือลากมาวาง</p>
                      </div>
                      <p className="text-xs text-gray-500">{file ? file.name : 'PNG, JPG, PDF ขนาดไม่เกิน 10MB'}</p>
                    </div>
                  </div>
                </div>
                <button onClick={handleUpload} disabled={uploading || !file || !transferDate || !transferTime} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold text-lg disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors">
                  {uploading ? 'กำลังอัปโหลด...' : 'ยืนยันการชำระเงิน'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

<style>{`
  .input { width:100%; padding:10px; border:1px solid #CBD5E0; border-radius:8px; }
  .input:focus { border-color:#EF4444; outline:none; box-shadow:0 0 0 2px rgba(239,68,68,0.2);}
`}</style>