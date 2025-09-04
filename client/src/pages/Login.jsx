import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Login = ({ setUser }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include", // Ensures cookies are sent
      });

      if (response.ok) {
        const userData = await response.json();
        localStorage.setItem("user", JSON.stringify(userData)); // Store user data
        setUser(userData);
        navigate("/problems");
      } else {
        console.error("Login failed");
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <form
        onSubmit={handleSubmit}
        className="bg-slate-800 p-6 rounded-lg shadow-md w-96"
      >
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Login</h2>
        <input
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 mb-4 rounded bg-slate-700 text-white focus:outline-none"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-2 mb-4 rounded bg-slate-700 text-white focus:outline-none"
          required
        />
        <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 p-2 rounded text-white font-semibold">
          Login
        </button>
        
        <div className="mt-4 text-center">
          <p className="text-white">
            Don't have an account?{" "}
            <Link to="/register" className="text-orange-500 hover:text-orange-600">
              Register yourself
            </Link>
          </p>
          <p className="text-white mt-2">
            <Link to="/problems" className="text-orange-500 hover:text-orange-600">
              Continue without login
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
