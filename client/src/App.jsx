import { BrowserRouter, Routes, Route } from 'react-router-dom';
//import { CartProvider } from './context/CartContext'; // Import CartProvider
import Home from './pages/Home';
import AdminLayout from './components/AdminLayout';
import UserLayout from './components/UserLayout';
import CreatePackage from './pages/Admin/CreatePackage';
import PackageList from './pages/Admin/PackageList';
import EditPackage from './pages/Admin/EditPackage';
import CusSidePackageList from './pages/User/CusSidePackageList';
import TourDetails from './pages/User/TourDetails';
import Booking from './pages/User/Booking';
import PackageDetailsAdmin from './pages/Admin/PackageDetailsAdmin';
import AdminBookingList from './pages/Admin/AdminBookingList';
import AdminBookingDetails from './pages/Admin/AdminBookingDetails';
import UserBookings from './pages/User/UserBookings';
import TourPerformanceReport from './pages/Admin/TourPerformanceReport';
import AdminDashboard from './pages/Admin/AdminDashBoard';
import VideoCallForm from './components/VideoCallForm';


export default function App() {
  return (
    <BrowserRouter>
      
        <Routes>
          {/* Home page with default header */}
          <Route path="/" element={<Home />} />
          <Route path="/VideoCallForm" element={<VideoCallForm />} />
          
          
          {/* Admin routes with AdminLayout */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="create-package" element={<CreatePackage />} />
            <Route path="tour_packages" element={<PackageList />} />
            <Route path="tour_packages/:id" element={<PackageDetailsAdmin />} />
            <Route path="edit-package/:id" element={<EditPackage />} />
            <Route path="bookings" element={<AdminBookingList />} />
            <Route path="bookings/:id" element={<AdminBookingDetails />} />
            <Route path="reports/tour-performance" element={<TourPerformanceReport />} />
          </Route>
          
          {/* User routes with UserLayout */}
          <Route path="/user" element={<UserLayout />}>
            <Route path="tours" element={<CusSidePackageList />} />
            <Route path="tours/:id" element={<TourDetails />} />
            <Route path="tours/:id/booking" element={<Booking />} />
            {/* Remove the booking-success route */}
            <Route path="my-bookings" element={<UserBookings />} />
          </Route>
        </Routes>
      
    </BrowserRouter>
  );
}
