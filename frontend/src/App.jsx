import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Header from './components/Header';
import Footer from './components/Footer';
import About from './pages/About';
import EarningPlan from './pages/EarningPlan';
import Affiliate from './pages/Affiliate';
import Contact from './pages/Contact';
import Signup from './pages/Signup';
import Login from './pages/Login';
import PassReset from './pages/PassReset';
import UpdatePassword from './pages/UpdatePassword';
import Otp from './pages/Otp';
import UserDashboard from './pages/Dashboard/UserDashboard';
import EarningHistory from './pages/Dashboard/EarningHistory';
import ReferalUsers from './pages/Dashboard/ReferalUsers';
import Deposit from './pages/Dashboard/Deposit';
import AcSetting from './pages/Dashboard/AcSetting';
import NotFound from './pages/404';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/earning-plan" element={<EarningPlan />} />
        <Route path="/affiliate" element={<Affiliate />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/sign-up" element={<Signup />} />   {/* ✅ fixed */}
        <Route path="/sign-up?ref" element={<Signup />} />
        <Route path="/pass-reset" element={<PassReset />} />
        <Route path="/pass-update/:id" element={<UpdatePassword />} />
        <Route path="/login" element={<Login />} /> 
        <Route path="/otp/:id/:type" element={<Otp />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/earning-history" element={<EarningHistory />} />
        <Route path="/referal-users" element={<ReferalUsers />} />
        <Route path="/deposit" element={<Deposit />} />
        <Route path="/account-settings" element={<AcSetting />} />
        <Route path="*" element={<NotFound />} />  {/* ✅ fixed */}
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
