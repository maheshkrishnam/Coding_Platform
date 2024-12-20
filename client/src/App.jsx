import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ProblemPage from "./pages/ProblemPage";
import Courses from "./pages/Courses";
import About from "./pages/About";
import Algorithms from "./pages/Algorithms";
import Contest from "./pages/Contest";

const Layout = ({ isLoggedIn, handleLogin }) => {
  const location = useLocation(); // useLocation hook is used here

  const shouldRenderLayout = location.pathname !== '/' && location.pathname !== '/register';

  return (
    <>
      {shouldRenderLayout && <Navbar isLoggedIn={isLoggedIn} onLogin={handleLogin} />}
      
      <main>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/problems" element={<ProblemPage />} />
          <Route path="/contest" element={<Contest />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/algorithms" element={<Algorithms />} />
          <Route path="/about" element={<About />} />
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
