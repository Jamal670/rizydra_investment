import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Header from "./components/Header";
import Footer from "./components/Footer";
import About from "./pages/About";
import EarningPlan from "./pages/EarningPlan";
import Affiliate from "./pages/Affiliate";
import Contact from "./pages/Contact";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import PassReset from "./pages/PassReset";
import UpdatePassword from "./pages/UpdatePassword";
import Otp from "./pages/Otp";
import UserDashboard from "./pages/Dashboard/UserDashboard";
import EarningHistory from "./pages/Dashboard/EarningHistory";
import ReferalUsers from "./pages/Dashboard/ReferalUsers";
import Deposit from "./pages/Dashboard/Deposit";
import AcSetting from "./pages/Dashboard/AcSetting";
import NotFound from "./pages/404";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUser";
import AdminDeposit from "./pages/admin/AdminDeposit";
import AdminWithdraw from "./pages/admin/AdminWithdraw";
import AdminSpecificUser from "./pages/admin/AdminSpecificUser";
import AdminContact from "./pages/admin/AdminContact";

// ✅ PublicRoute component
const PublicRoute = ({ children }) => {
  const authenticated = localStorage.getItem("authenticated") === "true";
  if (authenticated) {
    const isAdmin = localStorage.getItem("isAdmin") === "true";
    return <Navigate to={isAdmin ? "/admin-dashboard" : "/user-dashboard"} replace />;
  }
  return children;
};

// ✅ ProtectedRoute component
const ProtectedRoute = ({ children, adminOnly, userOnly }) => {
  const authenticated = localStorage.getItem("authenticated") === "true";
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }
  if (adminOnly && !isAdmin) {
    return <Navigate to="/user-dashboard" replace />;
  }
  if (userOnly && isAdmin) {
    return <Navigate to="/admin-dashboard" replace />;
  }
  return children;
};

// ✅ AppLayout (BrowserRouter ke andar)
function AppLayout() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <Header />}
      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/earning-plan" element={<EarningPlan />} />
        <Route path="/affiliate" element={<Affiliate />} />
        <Route path="/contact" element={<Contact />} />

        {/* Public but only for NON-logged in users */}
        <Route path="/sign-up" element={<PublicRoute><Signup /></PublicRoute>} />
        <Route path="/sign-up?ref" element={<PublicRoute><Signup /></PublicRoute>} />
        <Route path="/pass-reset" element={<PublicRoute><PassReset /></PublicRoute>} />
        <Route path="/pass-update/:id" element={<PublicRoute><UpdatePassword /></PublicRoute>} />
        <Route path="/otp/:id/:type" element={<PublicRoute><Otp /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />

        {/* User Protected Routes */}
        <Route path="/user-dashboard" element={<ProtectedRoute userOnly><UserDashboard /></ProtectedRoute>} />
        <Route path="/earning-history" element={<ProtectedRoute userOnly><EarningHistory /></ProtectedRoute>} />
        <Route path="/referal-users" element={<ProtectedRoute userOnly><ReferalUsers /></ProtectedRoute>} />
        <Route path="/deposit" element={<ProtectedRoute userOnly><Deposit /></ProtectedRoute>} />
        <Route path="/account-settings" element={<ProtectedRoute userOnly><AcSetting /></ProtectedRoute>} />

        {/* Admin Protected Routes */}
        <Route path="/admin-dashboard" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin-users" element={<ProtectedRoute adminOnly><AdminUsers /></ProtectedRoute>} />
        <Route path="/admin-deposit" element={<ProtectedRoute adminOnly><AdminDeposit /></ProtectedRoute>} />
        <Route path="/admin-withdraw" element={<ProtectedRoute adminOnly><AdminWithdraw /></ProtectedRoute>} />
        <Route path="/admin-specific-user/:id" element={<ProtectedRoute adminOnly><AdminSpecificUser /></ProtectedRoute>} />
        <Route path="/admin-contact" element={<ProtectedRoute adminOnly><AdminContact /></ProtectedRoute>} />
        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!isAdminRoute && <Footer />}
    </>
  );
}

// ✅ Main App (BrowserRouter yaha hai)
function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;
  