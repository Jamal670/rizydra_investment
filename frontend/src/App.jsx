import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import UnderConstruction from "./pages/UnderConstruction";
import NotFound from "./pages/404";


// ✅ Main App (BrowserRouter yaha hai)
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UnderConstruction />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}   

export default App;