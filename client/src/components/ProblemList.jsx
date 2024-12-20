import React, { useState, useEffect } from "react";

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

        // Fetch the files inside each problem folder
        const problemDetails = await fetch(
          `https://api.github.com/repos/maheshkrishnam/Coding_Platform/contents/problems/${folderName}`
        );
        const problemFiles = await problemDetails.json();

        // Get the problem description (problem.md)
        const descriptionFile = problemFiles.find(file => file.name === "problem.md");
        const descriptionResponse = await fetch(descriptionFile.download_url);
        const description = await descriptionResponse.text();

        // Get input.txt and output.txt
        const inputFile = problemFiles.find(file => file.name === "input.txt");
        const inputResponse = await fetch(inputFile.download_url);
        const input = await inputResponse.text();

        const outputFile = problemFiles.find(file => file.name === "output.txt");
        const outputResponse = await fetch(outputFile.download_url);
        const output = await outputResponse.text();

        // Store the problem data
        problemData.push({
          title: folderName,
          description,
          input,
          output,
          slug: folderName,
        });
      }

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
    return <div>Loading problems...</div>;
  }

  return (
    <section className="problem-list p-6 bg-gray-800 text-white">
      <h2 className="text-3xl mb-4 font-semibold">Problems</h2>
      <ul className="space-y-4">
        {problems.map((problem, index) => (
          <li key={index} className="hover:bg-gray-700 p-4 rounded-md">
            <a
              href={`/problems/${problem.slug}`}
              className="text-lg font-medium hover:text-orange-500 transition-colors"
            >
              {problem.title}
            </a>
            <p className="mt-2 text-sm text-gray-400">{problem.description.slice(0, 100)}...</p>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default ProblemList;
