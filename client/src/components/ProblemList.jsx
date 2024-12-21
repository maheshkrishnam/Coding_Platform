import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Use Link for routing
import Loader from "../components/Loader";

// GitHub API URL for fetching repository content
const GITHUB_REPO_URL = "https://api.github.com/repos/maheshkrishnam/Coding_Platform/contents/problems";

const ProblemList = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch problems data
  const fetchProblems = async () => {
    try {
      const response = await fetch(GITHUB_REPO_URL);
      const data = await response.json();

      // Filter to get only folders (problems are represented as folders)
      const problemFolders = data.filter(item => item.type === "dir");

      const problemData = [];

      // Fetch details for each problem folder
      for (let folder of problemFolders) {
        const folderName = folder.name;

        // Store only the problem title and its slug
        problemData.push({
          title: folderName,
          slug: folderName,
        });
      }

      // Sort problems numerically based on the problem number
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
    <section className="problem-list p-6 bg-gray-800 text-white">
      <h2 className="text-xl mb-4 font-semibold">Problems</h2>
      <div className="space-y-4">
        {problems.map((problem, index) => (
          <div
            key={index}
            className="problem-card px-6 py-2 rounded-lg bg-gray-900 hover:bg-gray-600 transition-all"
          >
            <Link
              to={`/problem/${problem.slug}`}
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
