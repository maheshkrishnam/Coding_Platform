import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    fullname: "",
    email: "",
    password: "",
    linkedIn: "",
    github: "",
    college: "",
    year: "",
    branch: "",
  });

  const [showDetails, setShowDetails] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <form
        onSubmit={handleSubmit}
        className="bg-slate-800 p-6 rounded-lg shadow-md w-96"
      >
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Register
        </h2>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          className="w-full p-2 mb-4 rounded bg-slate-700 text-white focus:outline-none"
          required
        />
        <input
          type="text"
          name="fullname"
          placeholder="Full Name"
          value={formData.fullname}
          onChange={handleChange}
          className="w-full p-2 mb-4 rounded bg-slate-700 text-white focus:outline-none"
          required
        />
        <input
          type="email"
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
        <div className="text-right text-sm mb-4">
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="text-orange-500 hover:text-orange-600"
          >
            {showDetails ? "Hide Optional Details" : "Add Optional Details"}
          </button>
        </div>
        {showDetails && (
          <div>
            <input
              type="text"
              name="linkedIn"
              placeholder="LinkedIn Profile (Optional)"
              value={formData.linkedIn}
              onChange={handleChange}
              className="w-full p-2 mb-4 rounded bg-slate-700 text-white focus:outline-none"
            />
            <input
              type="text"
              name="github"
              placeholder="GitHub Profile (Optional)"
              value={formData.github}
              onChange={handleChange}
              className="w-full p-2 mb-4 rounded bg-slate-700 text-white focus:outline-none"
            />
            <input
              type="text"
              name="college"
              placeholder="College Name (Optional)"
              value={formData.college}
              onChange={handleChange}
              className="w-full p-2 mb-4 rounded bg-slate-700 text-white focus:outline-none"
            />
            <input
              type="text"
              name="year"
              placeholder="Year of Study (Optional)"
              value={formData.year}
              onChange={handleChange}
              className="w-full p-2 mb-4 rounded bg-slate-700 text-white focus:outline-none"
            />
            <input
              type="text"
              name="branch"
              placeholder="Branch (Optional)"
              value={formData.branch}
              onChange={handleChange}
              className="w-full p-2 mb-4 rounded bg-slate-700 text-white focus:outline-none"
            />
          </div>
        )}
        <button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600 p-2 rounded text-white font-semibold"
        >
          Register
        </button>

        
        <div className="mt-4 text-center">
          <p className="text-white">
            Already have an account?{" "}
            <Link to="/" className="text-orange-500 hover:text-orange-600">
              Login
            </Link>
          </p>
          <p className="text-white mt-2">
            <Link to="/problems" className="text-orange-500 hover:text-orange-600">
              Continue without register
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Register;
