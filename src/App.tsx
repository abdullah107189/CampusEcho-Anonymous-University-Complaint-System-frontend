import { Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { Toaster } from "./components/ui/sonner";

import PublicLayout from "./pages/public/PublicLayout";
import Home from "./pages/public/Home";
import SubmitComplaint from "./pages/public/SubmitComplaint";
import TrackComplaint from "./pages/public/TrackComplaint";

import DashboardLayout from "./pages/dashboard/DashboardLayout";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import ComplaintsList from "./pages/dashboard/ComplaintsList";
import ComplaintDetails from "./pages/dashboard/ComplaintDetails";
import StaffManagement from "./pages/dashboard/StaffManagement"; 
import Register from "./pages/public/Register";
import VerifyOtp from "./pages/public/VerifyOTP";
import ResendOtp from "./pages/public/ResendOtp";
import Login from "./pages/public/Login";

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/submit" element={<SubmitComplaint />} />
          <Route path="/track" element={<TrackComplaint />} />
          <Route path="/track/:trackingId" element={<TrackComplaint />} />

          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/resend-otp" element={<ResendOtp />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<DashboardLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="complaints" element={<ComplaintsList />} />
          <Route path="complaints/:id" element={<ComplaintDetails />} />
          <Route path="staff" element={<StaffManagement />} />
        </Route>

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
    </ThemeProvider>
  );
}
