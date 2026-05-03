import React from "react";
import Login from "./pages/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AdminContext } from "./context/AdminContext";
import { DoctorContext } from "./context/DoctorContext";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { Routes, Route } from "react-router-dom";

// ── Admin Pages ──
import Dashboard from "./pages/Admin/Dashboard";
import AllAppointment from "./pages/Admin/AllAppointment";
import AddDoctor from "./pages/Admin/AddDoctor";
import DoctorList from "./pages/Admin/DoctorList";

// ── Doctor Pages ──
import DoctorDashboard from "./pages/Doctor/DoctorDashboard";
import DoctorAppointment from "./pages/Doctor/DoctorAppointment";
import DoctorProfile from "./pages/Doctor/DoctorProfile";

// ── Public Pages ──
import DoctorForgotPassword from "./pages/DoctorForgotPassword";
import DoctorResetPassword from "./pages/DoctorResetPassword";

const App = () => {
  const { aToken } = React.useContext(AdminContext);
  const { dToken } = React.useContext(DoctorContext);

  return (
    <>
      <ToastContainer />
      <Routes>
        {/* ── Public routes (accessible without login) ── */}
        <Route path="/forgot-password" element={<DoctorForgotPassword />} />
        <Route path="/reset-password" element={<DoctorResetPassword />} />

        {/* ── All other routes: auth-gated ── */}
        <Route
          path="*"
          element={
            aToken ? (
              // ── Admin Panel ──
              <div className="bg-[#F5F5FD]">
                <Navbar />
                <div className="flex items-start">
                  <Sidebar />
                  <div className="flex-1 p-5">
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/admin-dashboard" element={<Dashboard />} />
                      <Route path="/all-appointments" element={<AllAppointment />} />
                      <Route path="/add-doctors" element={<AddDoctor />} />
                      <Route path="/doctor-list" element={<DoctorList />} />
                    </Routes>
                  </div>
                </div>
              </div>
            ) : dToken ? (
              // ── Doctor Panel ──
              <div className="bg-[#F5F5FD]">
                <Navbar />
                <div className="flex items-start">
                  <Sidebar />
                  <div className="flex-1 p-5">
                    <Routes>
                      <Route path="/" element={<DoctorDashboard />} />
                      <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
                      <Route path="/doctor-appointments" element={<DoctorAppointment />} />
                      <Route path="/doctor-profile" element={<DoctorProfile />} />
                    </Routes>
                  </div>
                </div>
              </div>
            ) : (
              // ── Login ──
              <Login />
            )
          }
        />
      </Routes>
    </>
  );
};

export default App;