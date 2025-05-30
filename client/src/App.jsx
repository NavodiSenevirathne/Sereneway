import { BrowserRouter, Routes, Route } from "react-router-dom";
import Share from "./pages/User/Share";
import AboutUs from "./pages/User/AboutUs";
import Home from "./pages/User/Home";
import Register from './pages/User/Register';
import Login from './pages/User/Login';

import Header from "./components/Header";
import VideoCallForum from "./components/VideoCallForm";
import MyRequestedTours from "./pages/MyRequestedTours";
import RequestTour from "./pages/RequestTour";
import RequestedTours from "./pages/RequestedTours";
import ShareAdmin from './pages/Admin/ShareAdmin';
import VideoCallFormAdmin from './pages/Admin/VideoCallFormAdmin';
import Footer from './components/Footer';
import Profile from './pages/User/Profile';
import Dashboard from './pages/Admin/Dashboard';
import AdminDashboard from './pages/Admin/AdminUserManagement';
import BookingManagement from './pages/Admin/BookingManagement';
import CustomerDashboard from './pages/Admin/CustomerDashboard';
import "./index.css";
import PaymentForm from "./pages/PaymentForm";
import ManagePayments from "./pages/ManagePayments";
import UpdatePayment from "./pages/UpdatePayment";
import Navbar from "./components/Navbar";
import TourPackageDetails from "./pages/User/TourDetails";


export default function App() {
  return (
    //  You need to return JSX
    <BrowserRouter>
    <Header/>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/share" element={<Share />} />
      <Route path="/aboutus" element={<AboutUs />} />
      <Route path="/VideoCallForm" element={<VideoCallForum />} />
      <Route path="/payment" element={<PaymentForm />} />
      <Route path="/manage-payments" element={<ManagePayments />} />
      <Route path="/updatePayment/:id" element={<UpdatePayment />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={< CustomerDashboard/>} />

      <Route path="/register" element={<Register />} />
      <Route path="/user/tours/:id" element={<TourPackageDetails />} />

    </Routes>
    
    </BrowserRouter>
  );
}

//  You need to export the component  
