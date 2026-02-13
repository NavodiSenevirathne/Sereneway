import "./index.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import VideoCallForum from "./components/VideoCallForm";
import CustomerDashboard from "./pages/Admin/CustomerDashboard";
import RequestedTours from "./pages/Admin/RequestedTours";
import CustomizedPackages from "./pages/CustomizedPackages";
import ManagePayments from "./pages/ManagePayments";
import PaymentForm from "./pages/PaymentForm";
import UpdatePayment from "./pages/UpdatePayment";
import AboutUs from "./pages/User/AboutUs";
import Home from "./pages/User/Home";
import Login from "./pages/User/Login";
import MyRequestedTours from "./pages/User/MyRequestedTours";
import Register from "./pages/User/Register";
import RequestTour from "./pages/User/RequestTour";
import Share from "./pages/User/Share";
import TourPackageDetails from "./pages/User/TourDetails";

export default function App() {
  return (
    //  You need to return JSX
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/share" element={<Share />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/VideoCallForm" element={<VideoCallForum />} />
        <Route path="/payment" element={<PaymentForm />} />
        <Route path="/manage-payments" element={<ManagePayments />} />
        <Route path="/updatePayment/:id" element={<UpdatePayment />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<CustomerDashboard />} />

        <Route path="/register" element={<Register />} />
        <Route path="/user/tours/:id" element={<TourPackageDetails />} />

        {/* customize tour request */}
        <Route path="/customized-packages" element={<CustomizedPackages />} />
        <Route path="/request-tour" element={<RequestTour />} />
        <Route path="/my-requested-tours" element={<MyRequestedTours />} />
        <Route path="/requested-tours" element={<RequestedTours />} />
      </Routes>
    </BrowserRouter>
  );
}

//  You need to export the component
