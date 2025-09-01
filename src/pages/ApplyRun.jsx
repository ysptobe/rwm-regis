import React, { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';

const packages = {
  'A': { name: 'Package A - ทั่วไป 5 กม.', price: 350 },
  'B': { name: 'Package B - ทั่วไป 10 กม.', price: 500 },
  'C': { name: 'Package C - VIP', price: 1000 },
  'Student': { name: 'Package Student (5 กม.)', price: 200 },
};
const deliveryOptions = {
  pickup: { name: 'รับในวัน PICK UP', cost: 0 },
  shipping: { name: 'จัดส่งทางไปรษณีย์', cost: 50 },
};

export default function ApplyRunPage() {
  const { applicant } = useOutletContext();
  const navigate = useNavigate();
  
  const [selectedPackage, setSelectedPackage] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('pickup');
  const [totalCost, setTotalCost] = useState(0);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: 'info' });
  const [existingReg, setExistingReg] = useState(null);

  useEffect(() => {
    if (!applicant) return;
    const checkExistingRegistration = async () => {
        const { data } = await supabase.from('registrations').select('*').eq('applicant_id', applicant.id).single();
        if (data) {
            setExistingReg(data);
            setSelectedPackage(data.package_category);
            setDeliveryMethod(data.delivery_method);
            setMessage({text: 'คุณได้สมัครเข้าร่วมกิจกรรมแล้ว สามารถแก้ไขข้อมูลได้', type: 'info'});
        }
    };
    checkExistingRegistration();
  }, [applicant]);

  useEffect(() => {
    const packagePrice = selectedPackage ? packages[selectedPackage].price : 0;
    const deliveryCost = deliveryOptions[deliveryMethod].cost;
    setTotalCost(packagePrice + deliveryCost);
  }, [selectedPackage, deliveryMethod]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPackage) {
      setMessage({ text: 'กรุณาเลือกแพ็กเกจ', type: 'error' });
      return;
    }
    setSaving(true);
    setMessage({ text: 'กำลังบันทึกข้อมูล...', type: 'info' });

    const registrationData = {
      applicant_id: applicant.id,
      package_category: selectedPackage,
      delivery_method: deliveryMethod,
      total_cost: totalCost,
      payment_status: existingReg?.payment_status || 'pending',
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('registrations').upsert(registrationData, { onConflict: 'applicant_id' });

    if (error) {
      setMessage({ text: `เกิดข้อผิดพลาด: ${error.message}`, type: 'error' });
      setSaving(false);
    } else {
      setMessage({ text: 'บันทึกข้อมูลสำเร็จ! กรุณาไปที่หน้าชำระเงิน', type: 'success' });
      setTimeout(() => navigate('/payment'), 2000);
    }
  };

  if (!applicant) return <div className="bg-white p-8 rounded-xl shadow-md">กำลังรอข้อมูลผู้สมัคร...</div>;

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">สมัครเข้าร่วมกิจกรรม</h1>
      {message.text && <div className={`p-4 mb-6 rounded-lg text-center bg-${message.type === 'error' ? 'red' : 'blue'}-100 text-${message.type === 'error' ? 'red' : 'blue'}-800`}>{message.text}</div>}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Package Selection */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-700">1. เลือกแพ็กเกจ</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(packages).map(([key, pkg]) => (
              <label key={key} className={`flex items-center p-4 border-2 rounded-lg cursor-pointer ${selectedPackage === key ? 'border-red-500 bg-red-50' : 'border-gray-200'}`}>
                <input type="radio" name="package" value={key} checked={selectedPackage === key} onChange={(e) => setSelectedPackage(e.target.value)} className="h-5 w-5 text-red-600" />
                <div className="ml-4 flex-grow font-bold">{pkg.name}</div>
                <div className="text-lg font-semibold">{pkg.price}฿</div>
              </label>
            ))}
          </div>
        </div>
        {/* Delivery Method */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-700">2. วิธีการรับของ</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {Object.entries(deliveryOptions).map(([key, option]) => (
              <label key={key} className={`flex items-center p-4 border-2 rounded-lg cursor-pointer ${deliveryMethod === key ? 'border-red-500 bg-red-50' : 'border-gray-200'}`}>
                <input type="radio" name="delivery" value={key} checked={deliveryMethod === key} onChange={(e) => setDeliveryMethod(e.target.value)} className="h-5 w-5 text-red-600" />
                <div className="ml-4 flex-grow font-bold">{option.name}</div>
                <div className="font-semibold">{option.cost > 0 ? `+${option.cost}฿` : 'ฟรี'}</div>
              </label>
            ))}
          </div>
        </div>
        {/* Summary and Submit */}
        <div className="border-t-2 pt-6 space-y-6">
            <div className="flex justify-between items-center text-2xl font-bold">
                <span>ยอดชำระทั้งหมด:</span>
                <span className="text-red-600">{totalCost.toLocaleString()} บาท</span>
            </div>
            <button type="submit" disabled={saving || !selectedPackage} className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold text-lg disabled:bg-red-300">
              {saving ? 'กำลังดำเนินการ...' : 'ยืนยันการสมัคร'}
            </button>
        </div>
      </form>
    </div>
  );
}