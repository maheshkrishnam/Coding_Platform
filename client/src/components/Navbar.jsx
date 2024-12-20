import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";

const Navbar = ({ isLoggedIn, user, onLogin, onLogout }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to handle hamburger menu toggle
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const login = () => {
    navigate("/");
  };

  const logout = () => {
    onLogout();
    navigate("/");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen); // Toggle hamburger menu visibility on mobile
  };

  return (
    <nav className="bg-slate-900 text-white shadow-sm">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center p-4">
        {/* Hamburger Menu for Mobile (Moved to the left) */}
        <button
          className="lg:hidden text-white"
          onClick={toggleMenu} // Toggle the menu visibility on mobile
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Logo Section for Large Screens */}
        <div className="hidden lg:block text-2xl font-semibold">
          <NavLink to="/problems" className="text-white hover:text-orange-500">
            CPPlatform
          </NavLink>
        </div>

        {/* Desktop Navigation Links */}
        <ul className="hidden lg:flex space-x-6">
          <li>
            <NavLink
              to="/problems"
              className={({ isActive }) =>
                isActive
                  ? "text-orange-500 transform scale-105 underline decoration-white underline-offset-4 transition-all duration-300"
                  : "hover:text-orange-500 transition-colors duration-300"
              }
            >
              Problems
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/contest"
              className={({ isActive }) =>
                isActive
                  ? "text-orange-500 transform scale-105 underline decoration-white underline-offset-4 transition-all duration-300"
                  : "hover:text-orange-500 transition-colors duration-300"
              }
            >
              Contest
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/algorithms"
              className={({ isActive }) =>
                isActive
                  ? "text-orange-500 transform scale-105 underline decoration-white underline-offset-4 transition-all duration-300"
                  : "hover:text-orange-500 transition-colors duration-300"
              }
            >
              Algorithms
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/courses"
              className={({ isActive }) =>
                isActive
                  ? "text-orange-500 transform scale-105 underline decoration-white underline-offset-4 transition-all duration-300"
                  : "hover:text-orange-500 transition-colors duration-300"
              }
            >
              Courses
            </NavLink>
          </li>
        </ul>

        {/* User and Sign In/Sign Up Section */}
        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <div className="relative">
              <img
                src={user?.avatar || "/user-avatar.png"}
                alt="User"
                className="w-8 h-8 rounded-full cursor-pointer hover:ring-2 ring-orange-500"
                onClick={toggleDropdown}
              />
              {isDropdownOpen && (
                <div className="absolute right-0 bg-slate-800 text-white rounded-md mt-2 w-48 p-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <img
                      src={user?.avatar || "/user-avatar.png"}
                      alt="User"
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="font-semibold">{user?.name || "Username"}</p>
                      <p className="text-sm text-slate-400">{user?.email || "user@example.com"}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(`/profile/${user?.id}`)}
                    className="w-full py-2 px-4 text-left hover:bg-slate-700 rounded-md"
                  >
                    View Profile
                  </button>

                  <button
                    onClick={() => navigate(`/points`)}
                    className="w-full py-2 px-4 text-left hover:bg-slate-700 rounded-md"
                  >
                    View Points
                  </button>

                  <button
                    onClick={() => navigate(`/problems`)}
                    className="w-full py-2 px-4 text-left hover:bg-slate-700 rounded-md"
                  >
                    View Problems
                  </button>

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
            <div className="hidden lg:flex items-center space-x-4">
              <button
                className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition duration-200"
                onClick={login}
              >
                Sign In / Sign Up
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden ${isMenuOpen ? "block" : "hidden"} bg-slate-800 p-4`}>
        <div className="text-2xl font-semibold text-white text-center mb-4">
          {/* CPPlatform Logo Inside Hamburger Menu */}
          <NavLink to="/problems">CPPlatform</NavLink>
        </div>

        <ul className="space-y-4">
          <li>
            <NavLink
              to="/problems"
              className={({ isActive }) =>
                isActive
                  ? "text-orange-500 transform scale-105 underline decoration-white underline-offset-4 transition-all duration-300"
                  : "text-white hover:text-orange-500"
              }
            >
              Problems
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/contest"
              className={({ isActive }) =>
                isActive
                  ? "text-orange-500 transform scale-105 underline decoration-white underline-offset-4 transition-all duration-300"
                  : "text-white hover:text-orange-500"
              }
            >
              Contest
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/algorithms"
              className={({ isActive }) =>
                isActive
                  ? "text-orange-500 transform scale-105 underline decoration-white underline-offset-4 transition-all duration-300"
                  : "text-white hover:text-orange-500"
              }
            >
              Algorithms
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/courses"
              className={({ isActive }) =>
                isActive
                  ? "text-orange-500 transform scale-105 underline decoration-white underline-offset-4 transition-all duration-300"
                  : "text-white hover:text-orange-500"
              }
            >
              Courses
            </NavLink>
          </li>
          {!isLoggedIn && (
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
    </nav>
  );
};

export default Navbar;
