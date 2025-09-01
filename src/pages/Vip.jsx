import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { supabase } from '../supabase';
import { Crown, CheckCircle } from 'lucide-react';

export default function VipPage() {
  const { applicant } = useOutletContext();
  const [isVip, setIsVip] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!applicant) return;

    const checkVipStatus = async () => {
      const { data, error } = await supabase
        .from('registrations')
        .select('package')
        .eq('applicant_id', applicant.id)
        .single();
      
      if (data && data.package === 'C') {
        setIsVip(true);
      }
      setLoading(false);
    };

    checkVipStatus();
  }, [applicant]);

  if (loading) {
    return <div className="bg-white p-8 rounded-xl shadow-md">กำลังตรวจสอบสถานะ VIP...</div>;
  }

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl">
      <div className="flex items-center gap-4 mb-6">
        <Crown className="w-10 h-10 text-yellow-500" />
        <h1 className="text-3xl font-bold text-gray-800">สิทธิพิเศษสำหรับ VIP</h1>
      </div>

      {!isVip ? (
        <div className="text-center bg-gray-100 p-8 rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-700">คุณยังไม่ได้เป็นสมาชิก VIP</h2>
          <p className="text-gray-600 mt-2">อัปเกรดเป็น Package C - VIP เพื่อรับสิทธิพิเศษมากมาย!</p>
        </div>
      ) : (
        <div>
          <p className="text-lg text-gray-700 mb-6">
            ขอขอบคุณ <span className="font-bold">{applicant.thai_name}</span> ที่เข้าร่วมเป็นส่วนหนึ่งของนักวิ่ง VIP ของเรา นี่คือสิทธิพิเศษสำหรับคุณ:
          </p>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
              <span><strong>เสื้อวิ่งคอปก (Polo) ดีไซน์พิเศษ:</strong> สำหรับนักวิ่ง VIP เท่านั้น</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
              <span><strong>ช่องจอดรถพิเศษ:</strong> ใกล้บริเวณจุดปล่อยตัว สะดวกสบายยิ่งขึ้น</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
              <span><strong>โซนพักผ่อนและอาหารว่าง:</strong> พื้นที่รับรองส่วนตัวพร้อมอาหารและเครื่องดื่มหลังเข้าเส้นชัย</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
              <span><strong>Fast Track รับ Race Kit:</strong> ช่องทางพิเศษสำหรับรับอุปกรณ์การแข่งขัน ไม่ต้องรอคิวนาน</span>
            </li>
          </ul>
          <p className="mt-8 text-sm text-gray-500">
            *หมายเหตุ: รายละเอียดเพิ่มเติมเกี่ยวกับสิทธิพิเศษจะถูกส่งไปยังอีเมลของคุณเร็วๆ นี้
          </p>
        </div>
      )}
    </div>
  );
}