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
        const response = await axios.get("http://localhost:5000/contests");
        setOngoingContests(response.data.ongoing);
        setPastContests(response.data.past);
      } catch (error) {
        console.error("Error fetching contests:", error);
      }
    };

    fetchContests();
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <h2 className="text-3xl font-semibold mb-4">Ongoing Contests</h2>
      <div className="space-y-4">
        {ongoingContests.map((contest) => (
          <div key={contest.id} className="bg-slate-800 p-4 rounded-md">
            <h3 className="text-2xl">{contest.name}</h3>
            <p className="text-gray-400">{contest.description}</p>
            <div className="flex justify-between items-center mt-4">
              <span>
                <FiClock className="inline mr-2 text-yellow-400" />
                {contest.timeLeft} left
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

      <h2 className="text-3xl font-semibold mt-12 mb-4">Past Contests</h2>
      <div className="space-y-4">
        {pastContests.map((contest) => (
          <div key={contest.id} className="bg-slate-800 p-4 rounded-md">
            <h3 className="text-2xl">{contest.name}</h3>
            <p className="text-gray-400">{contest.description}</p>
            <div className="mt-4 text-gray-500">Completed on: {contest.endDate}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Contest;
