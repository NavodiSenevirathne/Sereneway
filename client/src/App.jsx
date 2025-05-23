import {BrowserRouter , Routes, Route} from 'react-router-dom';
import Share from './pages/User/Share';
import AboutUs from './pages/User/AboutUs';
import Home from './pages/User/Home';
import Header from './components/Header';
import VideoCallForum from './pages/User/VideoCallForm';
import ShareAdmin from './pages/Admin/ShareAdmin';
import VideoCallFormAdmin from './pages/Admin/VideoCallFormAdmin';

export default function App() {
  return (  //  You need to return JSX
    <BrowserRouter>
    <Header/>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/share" element={<Share />} />
      <Route path="/aboutus" element={<AboutUs />} />
      <Route path="/VideoCallForm" element={<VideoCallForum />} />
      <Route path="/admin/feedback" element={<ShareAdmin />} />
      <Route path="/admin/video-calls" element={<VideoCallFormAdmin />} />
    </Routes>
    
    </BrowserRouter>
  );
}
