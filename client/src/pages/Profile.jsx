import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaGithub, FaLinkedin, FaUserCircle } from "react-icons/fa";
import { FiEdit, FiLogOut } from "react-icons/fi";
import axios from "axios";

const Profile = () => {
  const navigate = useNavigate();
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [solvedCount, setSolvedCount] = useState(0); // State for solved problems count

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/users/profile/${username}`);
        setUser(response.data.user);

        // Get solved problems count from localStorage
        const solvedProblems = JSON.parse(localStorage.getItem("solvedProblems") || "{}");
        setSolvedCount(Object.keys(solvedProblems).length);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          navigate("/404");
        } else {
          console.error("Error fetching user profile:", error);
          navigate("/");
        }
      }
    };

    fetchUserProfile();
  }, [username, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("solvedProblems"); // Clear solved problems on logout
    navigate("/");
  };

  if (!user) return null;

  return (
    <div className="bg-gray-900 text-white flex justify-center items-center p-6">
      <div className="bg-gray-800 max-w-3xl w-full p-6 rounded-lg shadow-lg">
        {/* Profile Header */}
        <div className="flex items-center space-x-6">
          {user.avatar ? (
            <img src={user.avatar} alt="Avatar" className="w-20 h-20 rounded-full" />
          ) : (
            <FaUserCircle className="w-20 h-20 text-gray-400" />
          )}
          <div>
            <h2 className="text-3xl font-bold">{user.fullname}</h2>
            <p className="text-gray-400">@{user.username}</p>
          </div>
        </div>

        {/* Profile Details */}
        <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
          {user.email && (
            <div>
              <p className="text-gray-400">Email</p>
              <p className="font-semibold">{user.email}</p>
            </div>
          )}
          {user.college && (
            <div>
              <p className="text-gray-400">College</p>
              <p className="font-semibold">{user.college}</p>
            </div>
          )}
          {user.year && (
            <div>
              <p className="text-gray-400">Year</p>
              <p className="font-semibold">{user.year}</p>
            </div>
          )}
          {user.rank && (
            <div>
              <p className="text-gray-400">Rank</p>
              <p className="font-semibold">#{user.rank}</p>
            </div>
          )}
        </div>

        {/* DSA Stats */}
        <div className="mt-6 bg-gray-700 p-4 rounded-lg grid grid-cols-3 text-center text-sm">
          <div>
            <p className="text-gray-400">Problems Solved</p>
            <p className="text-xl font-semibold">{solvedCount}</p>
          </div>
          <div>
            <p className="text-gray-400">Streak</p>
            <p className="text-xl font-semibold">{user.streak || 0}🔥</p>
          </div>
          <div>
            <p className="text-gray-400">Rating</p>
            <p className="text-xl font-semibold">{user.rating || "N/A"}</p>
          </div>
        </div>

        {/* Social Links */}
        <div className="mt-6 flex space-x-4">
          {user.github && (
            <a href={user.github} target="_blank" rel="noopener noreferrer" aria-label="Visit GitHub Profile">
              <FaGithub className="w-8 h-8 text-gray-300 hover:text-gray-100 transition duration-200" />
            </a>
          )}
          {user.linkedIn && (
            <a href={user.linkedIn} target="_blank" rel="noopener noreferrer" aria-label="Visit LinkedIn Profile">
              <FaLinkedin className="w-8 h-8 text-blue-500 hover:text-blue-300 transition duration-200" />
            </a>
          )}
        </div>

        {/* Logout Button */}
        {username === user.username && (
          <button
            onClick={handleLogout}
            className="mt-6 w-full flex items-center justify-center bg-red-600 hover:bg-red-700 p-2 rounded text-white font-semibold transition duration-200"
          >
            <FiLogOut size={20} className="mr-2" />
            Logout
          </button>
        )}
      </div>
    </div>
  );
};

export default Profile;