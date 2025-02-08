import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProblemPage from "./pages/ProblemPage";
import Profile from "./pages/Profile"; // Profile Page
import CoursePage from "./pages/CoursePage";
import About from "./pages/About";
import AlgorithmList from "./pages/AlgorithmList";
import AlgorithmPage from "./pages/AlgorithmPage";
import TryNow from "./components/TryNow";
import ProblemSolvingPage from "./pages/ProblemSolvingPage";
import DailyProblemPage from "./pages/DailyProblem";
import ContestPage from "./pages/ContestPage";
import Contest from "./pages/Contest";
import UpdateProfile from "./pages/UpdateProfile";
import NotFoundPage from "./pages/NotFoundPage";

const App = () => {
  const [user, setUser] = useState(null);

  // Load user from localStorage when app starts
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser)); // Parse only if valid
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
      localStorage.removeItem("user"); // Clear invalid data
    }
  }, []);

  // Logout function to remove user data
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <Router>
      <Navbar user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/problems" element={<ProblemPage />} />
        <Route path="/profile/:username" element={<Profile />} />
        <Route path="/profile/me" element={user ? <Profile /> : <Login />} />
        <Route path="/courses" element={<CoursePage />} />
        <Route path="/about" element={<About />} />
        <Route path="/algorithms" element={<AlgorithmList />} />
        <Route path="/algorithms/:category/:algorithm" element={<AlgorithmPage />} />
        <Route path="/try-now" element={<TryNow />} />
        <Route path="/problem/:slug" element={<ProblemSolvingPage />} />
        <Route path="/daily-problem/:date" element={<DailyProblemPage />} />
        <Route path="/contest" element={<Contest />} />
        <Route path="/contest/:contestId" element={<ContestPage />} />
        <Route path="/update-profile" element={<UpdateProfile />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
