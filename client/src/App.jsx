import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ProblemPage from "./pages/ProblemPage";
import CoursePage from "./pages/CoursePage";
import About from "./pages/About";
import AlgorithmList from "./pages/AlgorithmList";
import Contest from "./pages/Contest";
import AlgorithmPage from "./pages/AlgorithmPage";
import TryNow from "./components/TryNow";
import ProblemSolvingPage from "./pages/ProblemSolvingPage";
import DailyProblemPage from "./pages/DailyProblem";

const Layout = ({ isLoggedIn, handleLogin }) => {
  const location = useLocation(); // useLocation hook is used here

  const shouldRenderLayout = !(
    location.pathname === '/' ||
    location.pathname === '/register' ||
    location.pathname.startsWith('/problem/') ||
    location.pathname.startsWith('/daily-problem/') ||
    location.pathname.startsWith('/try-now')
  );

  return (
    <>
      {shouldRenderLayout && <Navbar isLoggedIn={isLoggedIn} onLogin={handleLogin} />}
      
      <main>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/problems" element={<ProblemPage />} />
          <Route path="/contest" element={<Contest />} />
          <Route path="/courses" element={<CoursePage />} />
          <Route path="/algorithms" element={<AlgorithmList />} />
          <Route path="/about" element={<About />} />
          <Route path="/algorithms/:category/:algorithm" element={<AlgorithmPage />} />
          <Route path="/try-now" element={<TryNow />} />
          <Route path="/problem/:slug" element={<ProblemSolvingPage />} />
          <Route path="/daily-problem/:date" element={<DailyProblemPage />} />
        </Routes>
      </main>

      {shouldRenderLayout && <Footer />}
    </>
  );
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <Router>
      <Layout isLoggedIn={isLoggedIn} handleLogin={handleLogin} />
    </Router>
  );
};

export default App;
