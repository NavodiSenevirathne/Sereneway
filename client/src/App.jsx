import {BrowserRouter , Routes, Route} from 'react-router-dom';
import Share from './pages/Share';
import AboutUs from './pages/aboutus';
import Home from './pages/home';
import Header from './components/Header';
import VideoCallForum from './components/VideoCallForm';

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
