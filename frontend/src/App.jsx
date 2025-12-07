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
import UnderConstruction from "./pages/UnderConstruction";        
import NotFound from "./pages/404";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUser";
import AdminDeposit from "./pages/admin/AdminDeposit";
import AdminWithdraw from "./pages/admin/AdminWithdraw";
import AdminSpecificUser from "./pages/admin/AdminSpecificUser";
import AdminContact from "./pages/admin/AdminContact";


// ✅ Main App (BrowserRouter yaha hai)
function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<UnderConstruction />} />
    </Routes>
    </BrowserRouter>
  );
}

export default App;
  