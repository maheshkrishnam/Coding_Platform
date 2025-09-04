import React, { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import defaultAvatar from "../assets/user_profile_pic.jpeg";

const Navbar = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  // Effect to load user from localStorage on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser).data.user); // Update the state if a user exists in localStorage
    }
  }, []); // This effect runs only once when the component mounts

  // Function to toggle dropdown visibility
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  // Function to toggle mobile menu visibility
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Login action (navigate to login page)
  const login = () => navigate("/");

  // Logout action (clear localStorage and reset user state)
  const logout = () => {
    localStorage.removeItem("user"); // Remove user data from localStorage
    setUser(null); // Reset user state
    navigate("/"); // Navigate to home or login page
  };

  // Handle successful login
  const handleLoginSuccess = (userData) => {
    // Store user data in localStorage
    localStorage.setItem("user", JSON.stringify({ data: { user: userData } }));
    setUser(userData); // Update user state
    navigate(`/profile/${userData.username}`); // Navigate to the user profile
  };

  // Conditional rendering of Navbar based on user state
  return (
    <nav className="bg-slate-950 text-white shadow-sm">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center p-4">
        {/* Hamburger Menu for Mobile */}
        <button className="lg:hidden text-white" onClick={toggleMenu}>
          <FaBars className="w-6 h-6" />
        </button>

        {/* Logo Section */}
        <div className="text-2xl font-semibold">
          <NavLink to="/problems" className="text-white hover:text-orange-500">
            CP
          </NavLink>
        </div>

        {/* Desktop Navigation Links */}
        <ul className="hidden lg:flex space-x-6">
          {["problems", "contest", "algorithms", "courses", "try-now"].map((item) => (
            <li key={item}>
              <NavLink
                to={`/${item}`}
                className={({ isActive }) =>
                  isActive
                    ? "text-orange-500 transform scale-105 underline decoration-white underline-offset-4 transition-all duration-300"
                    : "hover:text-orange-500 transition-colors duration-300"
                }
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* User Profile or Login Button */}
        <div className="flex items-center space-x-4">
          {user ? (
            <div className="relative z-50">
              <img
                src={user?.avatar || defaultAvatar}
                alt="User"
                className="w-8 h-8 rounded-full cursor-pointer hover:ring-2 ring-orange-500"
                onClick={toggleDropdown}
              />
              {isDropdownOpen && (
                <div className="absolute right-0 bg-slate-800 text-white rounded-md mt-2 p-4 min-w-[200px] max-w-[300px]">
                  <div className="flex items-center space-x-2 mb-4">
                    <img
                      src={user?.avatar || defaultAvatar}
                      alt="User"
                      className="w-10 h-10 rounded-full flex-shrink-0"
                    />
                    <div className="flex-grow">
                      <p className="font-semibold">{user?.username || 'Username'}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(`/profile/${user?.username}`)}
                    className="w-full py-2 px-4 text-left hover:bg-slate-700 rounded-md"
                  >
                    View Profile
                  </button>
                  {/* Edit Profile Button */}
                  {user && (
                    <button
                      onClick={() => navigate("/update-profile")}
                      className="w-full py-2 px-4 text-left hover:bg-slate-700 rounded-md mt-2"
                    >
                      Edit Profile
                    </button>
                  )}
                  <button
                    onClick={logout}
                    className="w-full py-2 px-4 text-left hover:bg-red-700 rounded-md mt-2"
                  >
                    Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              className="hidden lg:block bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition duration-200"
              onClick={login}
            >
              Sign In / Sign Up
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-slate-1000 p-4">
          <ul className="space-y-4 text-center">
            {["problems", "contest", "algorithms", "courses", "try-now"].map((item) => (
              <li key={item}>
                <NavLink
                  to={`/${item}`}
                  className={({ isActive }) =>
                    isActive
                      ? "text-orange-500 transform scale-105 underline decoration-white underline-offset-4 transition-all duration-300"
                      : "text-white hover:text-orange-500"
                  }
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </NavLink>
              </li>
            ))}
            {!user && (
              <li>
                <button
                  className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition duration-200"
                  onClick={login}
                >
                  Sign In / Sign Up
                </button>
              </li>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
