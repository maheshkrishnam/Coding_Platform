import React, { useState, useEffect } from "react";
import MonacoEditor from "@monaco-editor/react";
import { useParams } from "react-router-dom";
import { fetchCodeSample } from "../utils/githubApi";
import axios from "axios";

const ExperimentPage = () => {
  const { category, algorithm } = useParams();
  const [code, setCode] = useState(""); // Stores the code
  const [output, setOutput] = useState(""); // Stores the output
  const [language, setLanguage] = useState("cpp"); // Default language is C++
  const [loading, setLoading] = useState(false); // Loading state for code execution
  const [error, setError] = useState(""); // Stores any errors

  // Fetch the code sample when the component mounts or when category, algorithm, or language changes
  useEffect(() => {
    const fetchCode = async () => {
      try {
        setLoading(true);
        setError(""); // Clear previous errors
        const codeData = await fetchCodeSample(category, algorithm, language);
        setCode(codeData); // Set the code for the selected algorithm
      } catch (err) {
        setError("Error fetching code sample");
        console.error("Error fetching code:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCode();
  }, [category, algorithm, language]);

  // Handle running the code (posting to the API)
  const handleRunCode = async () => {
    setLoading(true); // Set loading to true when starting code execution
    setError(""); // Clear previous errors
    try {
      // Use the correct language ID (54 for C++, 63 for Python, etc.)
      const languageId = language === "cpp" ? 54 : language === "py" ? 63 : 62; // Example for Java: 62
      const response = await axios.post("https://judge0-ce.p.rapidapi.com/submissions", 
        {
          source_code: code,
          language_id: languageId,
        }, 
        {
          headers: {
            "Content-Type": "application/json",
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
            "X-RapidAPI-Key": "YOUR_API_KEY", // Replace with your actual API key
          }
        }
      );
      setOutput(response.data.result); // Set the output from the response
    } catch (err) {
      setError("Error running code.");
      console.error("Error running code:", err);
    } finally {
      setLoading(false); // Set loading to false once done
    }
  };

  return (
    <div className="experiment-page">
      <h1>Experiment with {algorithm.replace("-", " ")}</h1>
      <div>
        <label>Choose Language: </label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="cpp">C++</option>
          <option value="py">Python</option>
          <option value="java">Java</option>
        </select>
      </div>

      {/* Monaco Editor for code editing */}
      <MonacoEditor
        height="500px"
        language={language}
        theme="vs-dark"
        value={code}
        onChange={(value) => setCode(value)}
        options={{
          selectOnLineNumbers: true, // Allow line numbers to be clickable
          automaticLayout: true, // Auto layout adjustments
        }}
      />
      
      {/* Button to run code */}
      <button onClick={handleRunCode} disabled={loading}>
        {loading ? "Running..." : "Run Code"}
      </button>
      
      {/* Display output */}
      <h3>Output:</h3>
      <pre>{output || error || "Output will appear here."}</pre>
    </div>
  );
};

export default ExperimentPage;
