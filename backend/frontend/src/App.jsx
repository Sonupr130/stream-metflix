import { Route, Routes } from "react-router-dom";
import Home from "./components/Home.jsx";
import UploadMovie from "./pages/UploadMovie.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import VideoPlayer from "./components/VideoPlayer.jsx";
import MegaFileViewer from "./components/MegaFileViewer.jsx";
import Test from "./pages/Test.jsx";
import AdminLogin from "./components/AdminLogin.jsx";
import NotFound from "./pages/NotFound.jsx";
import Player from "./components/Player.jsx";


const App = () => {
  return (
    <div className="">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<UploadMovie />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/vi" element={<VideoPlayer />} />
        <Route path="/file" element={<MegaFileViewer />} />
        <Route path="/test" element={<Test />} />
        <Route path="/login" element={<AdminLogin />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/player" element={<Player />} />
      </Routes>
    </div>
  );
};

export default App;
