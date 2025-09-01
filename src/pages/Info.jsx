import React from "react";

const packages = [
  { name: 'Package A - ทั่วไป 5 กม.', price: '350 บาท', receives: 'เสื้อและเหรียญ' },
  { name: 'Package B - ทั่วไป 10 กม.', price: '500 บาท', receives: 'เสื้อและเหรียญ' },
  { name: 'Package C - VIP', price: '1,000 บาท', receives: 'เสื้อคอปกและเหรียญ' },
  { name: 'Package Student (5 กม.)', price: '200 บาท', receives: '(เฉพาะนักเรียน)' },
];

export default function InfoPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-xl">
        <h1 className="text-4xl font-bold text-center mb-8 text-red-600">ข้อมูลกิจกรรม YSP RUN WITH ME</h1>
        
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 border-l-4 border-red-500 pl-4">แพ็กเกจและค่าสมัคร</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="border-b-2 p-4 bg-gray-100 font-bold">ประเภท</th>
                  <th className="border-b-2 p-4 bg-gray-100 font-bold">ค่าสมัคร</th>
                  <th className="border-b-2 p-4 bg-gray-100 font-bold">สิ่งที่จะได้รับ</th>
                </tr>
              </thead>
              <tbody>
                {packages.map((pkg, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="border-b p-4">{pkg.name}</td>
                    <td className="border-b p-4">{pkg.price}</td>
                    <td className="border-b p-4">{pkg.receives}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 border-l-4 border-red-500 pl-4">การชำระเงิน</h2>
          <div className="bg-gray-100 p-6 rounded-lg">
            <p className="mb-2 font-semibold">โอนเงินผ่านบัญชีธนาคาร:</p>
            <ul className="list-disc list-inside space-y-2 bg-white p-4 rounded-md">
              <li><span className="font-semibold">ธนาคาร:</span> กรุงไทย สาขาเทสโก้โลตัสยโสธร</li>
              <li><span className="font-semibold">เลขที่บัญชี:</span> 865-0-69605-8</li>
              <li><span className="font-semibold">ชื่อบัญชี:</span> YSP. RUN WITH ME 3nd</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 border-l-4 border-red-500 pl-4">การรับเสื้อและเหรียญ</h2>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-bold">1. รับในวัน PICK UP</h3>
              <p className="text-gray-600">ไม่มีค่าใช้จ่ายเพิ่มเติม สามารถรับได้ตามวันและเวลาที่ประกาศ</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-bold">2. จัดส่งทางไปรษณีย์ (+50 บาท)</h3>
              <ul className="list-disc list-inside text-gray-600 mt-2 ml-4">
                <li>มีค่าจัดส่งเพิ่ม 50 บาทต่อ 1 ท่าน</li>
                <li>จัดส่งแบบลงทะเบียนทางไปรษณีย์ไทย</li>
                <li>จัดส่งเหรียญและเสื้อตามแพ็กเกจที่เลือก</li>
                <li>ระยะเวลาจัดส่งภายใน 1-2 เดือนหลังจากวันจัดงานวิ่ง</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}