import {BrowserRouter , Routes, Route} from 'react-router-dom';
import Share from './pages/Share';
import AboutUs from './pages/aboutus';
import Home from './pages/home';
import Header from './components/Header';
import VideoCallForum from './components/VideoCallForm';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import PaymentForm from "./pages/PaymentForm";
import ManagePayments from "./pages/ManagePayments";
import UpdatePayment from "./pages/UpdatePayment";
import Navbar from "./components/Navbar";


export default function App() {
  return (  //  You need to return JSX
    <BrowserRouter>
    <Header/>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/share" element={<Share />} />
      <Route path="/aboutus" element={<AboutUs />} />
      <Route path="/VideoCallForm" element={<VideoCallForum />} />
    </Routes>
    
    </BrowserRouter>
  );
}

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />

        <Routes>
          <Route path="/" element={<PaymentForm />} />
          <Route path="/manage-payments" element={<ManagePayments />} />
          <Route path="/updatePayment/:id" element={<UpdatePayment />} />
        </Routes>
        {/* <Footer /> */}
      </BrowserRouter>
    </div>
  );
}
