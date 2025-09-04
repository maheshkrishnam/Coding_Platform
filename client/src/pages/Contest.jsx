import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FiClock } from "react-icons/fi";

const Contest = () => {
  const [ongoingContests, setOngoingContests] = useState([]);
  const [pastContests, setPastContests] = useState([]);

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/contests`);
        setOngoingContests(response.data.ongoing || []);
        setPastContests(response.data.past || []);
      } catch (error) {
        console.error("Error fetching contests:", error);
      }
    };

    fetchContests();
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <h2 className="text-3xl font-semibold mb-4">Contests</h2>

      {/* Ongoing Contests */}
      {ongoingContests.length > 0 ? (
        <>
          <h3 className="text-2xl font-semibold mb-4 text-green-400">Ongoing Contests</h3>
          <div className="space-y-4">
            {ongoingContests.map((contest) => (
              <div key={contest.id} className="bg-slate-800 p-4 rounded-md shadow-lg">
                <h3 className="text-xl font-bold">{contest.name}</h3>
                <p className="text-gray-400">{contest.description}</p>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-yellow-400 flex items-center">
                    <FiClock className="mr-2" />
                    {contest.timeLeft || "Time Left: N/A"}
                  </span>
                  <Link
                    to={`/contest/${contest.id}`}
                    className="bg-blue-600 px-4 py-2 rounded-md hover:bg-blue-700 transition"
                  >
                    Join Contest
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p className="text-gray-500">No ongoing contests available.</p>
      )}

      {/* Past Contests */}
      {pastContests.length > 0 && (
        <>
          <h3 className="text-2xl font-semibold mt-12 mb-4 text-red-400">Past Contests</h3>
          <div className="space-y-4">
            {pastContests.map((contest) => (
              <div key={contest.id} className="bg-slate-800 p-4 rounded-md shadow-lg">
                <h3 className="text-xl font-bold">{contest.name}</h3>
                <p className="text-gray-400">{contest.description}</p>
                <div className="mt-4 text-gray-500">Ended on: {contest.endDate || "N/A"}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Contest;
