import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";

const API_BASE_URL = "http://localhost:5000/problem"; // URL to your backend API

const ProblemList = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProblems = async () => {
    try {
      const response = await fetch(API_BASE_URL);  // Call your backend API instead of GitHub
      const data = await response.json();

      const problemData = data.map((problem) => ({
        title: problem.title,
        slug: problem.slug,
      }));

      problemData.sort((a, b) => {
        const numA = parseInt(a.title.split(".")[0]);
        const numB = parseInt(b.title.split(".")[0]);
        return numA - numB;
      });

      setProblems(problemData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching problems:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  if (loading) {
    return <div><Loader /></div>;
  }

  return (
    <section className="problem-list p-6 bg-slate-900 text-white rounded-lg">
      <h2 className="text-2xl mb-4 font-semibold">Problems</h2>
      <div className="space-y-4">
        {problems.map((problem, index) => (
          <div
            key={index}
            className="problem-card px-6 py-4 rounded-lg bg-slate-700 font-medium hover:bg-slate-600 transition-all"
          >
            <Link
              to={`/problem/${problem.slug}`} target="_blank"
              className="block text-base font-normal hover:text-orange-500 transition-colors"
            >
              {problem.title}
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProblemList;
