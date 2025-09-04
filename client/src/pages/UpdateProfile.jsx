import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UpdateProfile = () => {
  const navigate = useNavigate();

  // State to store user data
  const [user, setUser] = useState({
    fullname: "",
    username: "",
    email: "", // Email remains unchanged
    college: "",
    year: "",
    rank: "",
    github: "",
    linkedIn: "",
    password: "",
  });

  const [isModified, setIsModified] = useState(false);

  // Fetch user data from localStorage on component mount
  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser && storedUser.data && storedUser.data.user) {
        setUser({
          fullname: storedUser.data.user.fullname || "",
          username: storedUser.data.user.username || "",
          email: storedUser.data.user.email || "",
          college: storedUser.data.user.college || "",
          year: storedUser.data.user.year || "",
          rank: storedUser.data.user.rank || "",
          github: storedUser.data.user.github || "",
          linkedIn: storedUser.data.user.linkedIn || "",
          password: "",
        });
      } else {
        navigate("/"); // Redirect if no user is found
      }
    } catch (error) {
      navigate("/"); // Handle error and redirect if something goes wrong
    }
  }, [navigate]);

  // Handle input changes and detect modifications
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
    setIsModified(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Retrieve user data from localStorage
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const accessToken = storedUser.data.accessToken;

    if (!storedUser || !accessToken) {
      return; // Exit if there's no valid token
    }

    const updatedUserData = {
      fullname: user.fullname,
      username: user.username,
      college: user.college,
      year: user.year,
      github: user.github,
      linkedIn: user.linkedIn,
      password: user.password ? user.password : null, // Optional password field
    };

    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json", // Use JSON content type
      },
    };

    try {
      // Send the PUT request with the updated user data as JSON
      const { data } = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/users/update-profile`,
        updatedUserData,
        config
      );

      // Update localStorage with new data (excluding email and rank)
      const updatedUser = { 
        ...storedUser,
        data: { ...storedUser.data, user: { ...storedUser.data.user, ...data.user } }
      };
      delete updatedUser.data.user.email;  // Ensure email is not updated
      delete updatedUser.data.user.rank;   // Ensure rank is not updated
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // Redirect to the updated profile page
      navigate(`/profile/${user.username}`);
    } catch (error) {
      // Handle error (you can add user-friendly error messages here)
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex justify-center items-center p-6">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-3xl w-full">
        <h2 className="text-3xl font-semibold mb-6 text-center text-white">Update Profile</h2>

        {/* Update Profile Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300">Full Name</label>
            <input
              type="text"
              name="fullname"
              value={user.fullname}
              onChange={handleChange}
              className="w-full p-3 mt-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
            />
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-300">Username</label>
            <input
              type="text"
              name="username"
              value={user.username}
              onChange={handleChange}
              className="w-full p-3 mt-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
            />
          </div>

          {/* College */}
          <div>
            <label className="block text-sm font-medium text-gray-300">College</label>
            <input
              type="text"
              name="college"
              value={user.college}
              onChange={handleChange}
              className="w-full p-3 mt-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
            />
          </div>

          {/* Year */}
          <div>
            <label className="block text-sm font-medium text-gray-300">Year</label>
            <input
              type="text"
              name="year"
              value={user.year}
              onChange={handleChange}
              className="w-full p-3 mt-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
            />
          </div>

          {/* GitHub */}
          <div>
            <label className="block text-sm font-medium text-gray-300">GitHub</label>
            <input
              type="text"
              name="github"
              value={user.github}
              onChange={handleChange}
              className="w-full p-3 mt-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
            />
          </div>

          {/* LinkedIn */}
          <div>
            <label className="block text-sm font-medium text-gray-300">LinkedIn</label>
            <input
              type="text"
              name="linkedIn"
              value={user.linkedIn}
              onChange={handleChange}
              className="w-full p-3 mt-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-300">New Password</label>
            <input
              type="password"
              name="password"
              placeholder="Leave blank to keep current password"
              onChange={handleChange}
              className="w-full p-3 mt-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
            />
          </div>

          {/* Action Buttons */}
          <div className="col-span-1 md:col-span-2 flex justify-between items-center mt-6">
            <button
              type="button"
              onClick={() => navigate(`/profile/${user.username}`)}
              className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition duration-200"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!isModified}
              className={`py-2 px-6 rounded-lg font-semibold transition duration-200 ${
                isModified
                  ? "bg-orange-500 hover:bg-orange-600 text-white"
                  : "bg-gray-400 text-gray-300 cursor-not-allowed"
              }`}
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;
