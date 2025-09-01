import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Layouts
import PublicLayout from './components/PublicLayout';
import ProtectedLayout from './components/ProtectedLayout';
// import AdminLayout from './components/AdminLayout'; // หากต้องการใช้ส่วน Admin

// Pages
import HomePage from './pages/Home';
import InfoPage from './pages/Info';
import LoginPage from './pages/Login';
import ApplicantPage from './pages/Applicant';
import ApplyRunPage from './pages/ApplyRun';
import PaymentPage from './pages/Payment';
import VipPage from './pages/Vip';
import NotFoundPage from './pages/NotFound';
import StaffLoginPage from './pages/StaffLogin';
import LoginGoogleCallback from './pages/LoginGoogleCallback';

// Admin Pages
import AdminDashboardPage from './pages/AdminDashboard';
// import BibManagerPage from './pages/admin/BibManager';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/info" element={<InfoPage />} />
        </Route>

        {/* Standalone Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/data/applicant/:passportId" element={<ApplicantPage />} />
        <Route path="/staff-login" element={<StaffLoginPage />} />
        <Route path="/login-google-callback" element={<LoginGoogleCallback />} />

        {/* Protected Routes for Standard Users */}
        <Route element={<ProtectedLayout />}>
          <Route path="/apply" element={<ApplyRunPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/vip" element={<VipPage />} />
          <Route path="/profile" element={<ApplicantPage />} /> {/* เพิ่มบรรทัดนี้ */}
        </Route>

        {/* Protected Routes for Admin/Officer (หากเปิดใช้งาน) */}
        <Route element={<ProtectedLayout />}>
          <Route path="/admin" element={<AdminDashboardPage />} />
        </Route>

        {/* Not Found Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}