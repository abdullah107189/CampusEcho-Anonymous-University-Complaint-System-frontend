 

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './lib/store/store';
import { ThemeProvider } from 'next-themes';
import { Toaster } from './components/ui/sonner';

import PublicLayout from './pages/public/PublicLayout';
import Home from './pages/public/Home';
import SubmitComplaint from './pages/public/SubmitComplaint';
import TrackComplaint from './pages/public/TrackComplaint';
import Login from './pages/public/Login';

import DashboardLayout from './pages/dashboard/DashboardLayout';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import ComplaintsList from './pages/dashboard/ComplaintsList';
import ComplaintDetails from './pages/dashboard/ComplaintDetails';
import StaffManagement from './pages/dashboard/StaffManagement';

export default function App() {
  return (
    <Provider store={store}>
       
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <BrowserRouter>
          <Routes>
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/submit" element={<SubmitComplaint />} />
              <Route path="/track" element={<TrackComplaint />} />
              <Route path="/track/:trackingId" element={<TrackComplaint />} />
              <Route path="/login" element={<Login />} />
            </Route>
            
            <Route path="/admin" element={<DashboardLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="complaints" element={<ComplaintsList />} />
              <Route path="complaints/:id" element={<ComplaintDetails />} />
              <Route path="staff" element={<StaffManagement />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
        <Toaster />
      </ThemeProvider>
    </Provider>
  );
}
