import { BrowserRouter, Routes, Route } from "react-router-dom";
import Share from "./pages/Share";
import AboutUs from "./pages/aboutus";
import Home from "./pages/home";
import Header from "./components/Header";
import VideoCallForum from "./components/VideoCallForm";
import MyRequestedTours from "./pages/MyRequestedTours";
import RequestTour from "./pages/RequestTour";
import RequestedTours from "./pages/RequestedTours";

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
        <Route path="/request-tour" element={<RequestTour />} />
        <Route path="/my-requested-tours" element={<MyRequestedTours />} />
        <Route path="/requested-tours" element={<RequestedTours />} />
      </Routes>
    </BrowserRouter>
  );
}
