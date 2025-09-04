import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";

const AlgorithmsList = () => {
  const [algorithms, setAlgorithms] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/algorithms/all-algorithms`);
        const algorithmsByCategory = {};

        response.data.forEach((category) => {
          algorithmsByCategory[category.category] = category.algorithms.map((algorithm) => ({
            name: algorithm.name,
            tags: algorithm.metadata.tags || [],
            difficulty: algorithm.metadata.difficulty || "Unknown",
          }));
        });

        setAlgorithms(algorithmsByCategory);
      } catch (err) {
        setError(`Error fetching algorithms: ${err.response ? err.response.data : err.message}`);
        console.error("Error fetching algorithms:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="w-full bg-slate-900">
        <div className="bg-slate-900 px-4 py-6 max-w-screen-xl mx-auto">
          <Loader />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 mt-10">
        {error}
      </div>
    );
  }

  if (Object.keys(algorithms).length === 0) {
    return <div className="text-center text-xl">No algorithms available.</div>;
  }

  return (
    <div className="bg-slate-900 text-white min-h-screen py-6">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="space-y-12 bg-slate-700 p-4 rounded-lg mb-6">
          <h1 className="text-3xl font-semibold text-center mb-8 text-slate-50">
            Algorithms List
          </h1>

          {Object.keys(algorithms).map((category) => (
            <div key={category} className="mb-12">
              <h2 className="text-2xl font-semibold text-slate-400 mb-4">
                {category.replace("-", " ").toUpperCase()}
              </h2>
              <ul className="space-y-4">
                {algorithms[category].map((algo) => (
                  <Link
                    key={`${category}-${algo.name}`}  // Unique key to prevent duplicates
                    to={`/algorithms/${category}/${algo.name}`}
                    className="block p-4 rounded-md shadow-md bg-slate-900 hover:bg-slate-800 transition duration-200"
                  >
                    <div>
                      <h3 className="text-lg font-medium text-slate-200 hover:text-slate-100">
                        {algo.name.replace("-", " ")}
                      </h3>
                      {algo.tags.length > 0 && (
                        <div className="mt-2 text-sm text-slate-400">
                          Tags:{" "}
                          {algo.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-slate-600 text-slate-200 rounded-full text-xs mr-2"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="mt-2 text-sm text-slate-400">
                        Difficulty:{" "}
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            algo.difficulty === "Easy"
                              ? "bg-green-500 text-slate-900"
                              : algo.difficulty === "Medium"
                              ? "bg-yellow-500 text-slate-900"
                              : "bg-red-500 text-slate-900"
                          }`}
                        >
                          {algo.difficulty}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AlgorithmsList;
