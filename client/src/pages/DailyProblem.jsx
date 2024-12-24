import React, { useEffect, useState } from "react";
import AceEditor from "react-ace";
import { useParams } from "react-router-dom";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { nord } from "react-syntax-highlighter/dist/esm/styles/prism";

import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-monokai";

const BACKEND_API_BASE = "http://localhost:5000/problem";

const problems = [
  "1.Two Sum", 
  "2.Pallindrome Number", 
  "3.Roman To Integer", 
  "4.Longest Common Prefix", 
  "5.Valid Parentheses", 
  "6.Merge Two Sorted Lists", 
  "7.Remove Duplicates from Sorted Array", 
  "8.Remove Element", 
  "9.Find the Index of the First Occurrence in a String",
  "10.Search Insert Position", 
];

// Helper function to sum digits of a number
const sumDigits = (number) => {
  let sum = 0;
  while (number > 0) {
    sum += number % 10;
    number = Math.floor(number / 10);
  }
  return sum;
};

// Calculate the problem index based on the date (d+d + m+m + y+y+y+y)
const getProblemIndex = (date, problemCount) => {
  const [day, month, year] = date.split("-");
  if (year && year.length === 4) {
    const daySum = sumDigits(parseInt(day)) * 2; // Sum day digits and multiply by 2
    const monthSum = sumDigits(parseInt(month)) * 2; // Sum month digits and multiply by 2
    const yearSum = sumDigits(parseInt(year.slice(0, 2))) + sumDigits(parseInt(year.slice(2))); // Sum the year digits

    let totalSum = daySum + monthSum + yearSum;

    // Reduce sum if it's larger than the number of problems
    while (totalSum >= problemCount) {
      totalSum = sumDigits(totalSum);
    }

    return totalSum % problemCount; // Ensure index is within range of problem list
  } else {
    console.error("Invalid year format for date:", date);
    return 0; // Default to the first problem if year format is incorrect
  }
};

const DailyProblemPage = () => {
  let slug = "";
  const { date } = useParams();
  const [problem, setProblem] = useState("");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("cpp");
  const [executionOutput, setExecutionOutput] = useState("");

  // Fetch problem details from backend API
  useEffect(() => {
    const fetchProblemDetails = async () => {
      try {
        const [day, month, year] = date.split('-');
        slug = problems[day % 10];
        const response = await axios.get(`${BACKEND_API_BASE}/${encodeURIComponent(slug)}`);
        const { problem, input, output } = response.data;

        setProblem(problem);
        setInput(input);
        setOutput(output);
      } catch (error) {
        console.error("Error fetching problem details:", error);
      }
    };

    fetchProblemDetails();
  }, [slug]);

  const handleCodeChange = (newCode) => setCode(newCode);

  const handleLanguageChange = (event) => setLanguage(event.target.value);

  const handleRunCode = async () => {
    try {
      const response = await axios.post("http://localhost:5000/execute", {
        language,
        code,
        input,
      });
      setExecutionOutput(response.data.output || "No output returned.");
    } catch (err) {
      console.error("Error running code:", err);
      setExecutionOutput("Error occurred while running the code.");
    }
  };

  const handleSubmitCode = async () => {
    try {
      const response = await axios.post("http://localhost:5000/submit", {
        language,
        code,
        input,
        expectedOutput: output,
      });
      setExecutionOutput(response.data.result || "No result returned.");
    } catch (err) {
      console.error("Error submitting code:", err);
      setExecutionOutput("Error occurred while submitting the code.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-screen-xl mx-auto bg-slate-800 px-4 py-6 rounded-xl shadow-lg">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-4">Problem</h2>
            <div className="bg-slate-700 p-4 rounded-xl text-sm">
              <ReactMarkdown
                children={problem}
                remarkPlugins={[remarkGfm]}
                className="prose prose-invert max-w-none"
                components={{
                  code: ({ inline, className, children, ...props }) => {
                    const match = /language-(\w+)/.exec(className || "");
                    return !inline && match ? (
                      <SyntaxHighlighter style={nord} language={match[1]} {...props}>
                        {String(children).replace(/\n$/, "")}
                      </SyntaxHighlighter>
                    ) : (
                      <code
                        className="bg-slate-700 text-slate-300 px-1 py-0.5 rounded-xl"
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  },
                }}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-2">Input</h3>
              <pre className="bg-slate-700 p-4 rounded-xl text-sm whitespace-pre-wrap h-60 overflow-auto">
                {input}
              </pre>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-2">Expected Output</h3>
              <pre className="bg-slate-700 p-4 rounded-xl text-sm whitespace-pre-wrap h-60 overflow-auto">
                {output}
              </pre>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col gap-4 mb-4">
            <div className="flex justify-start items-center gap-4">
              <button
                onClick={handleRunCode}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl transition"
              >
                Run Code
              </button>
              <button
                onClick={handleSubmitCode}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition"
              >
                Submit Code
              </button>
            </div>
            <div className="flex justify-start items-center gap-4">
              <label className="font-semibold">Language:</label>
              <select
                value={language}
                onChange={handleLanguageChange}
                className="bg-slate-600 text-white p-2 rounded-xl"
              >
                <option value="cpp">C++</option>
                <option value="python">Python</option>
              </select>
            </div>
          </div>

          <div>
            <AceEditor
              mode={language === "cpp" ? "c_cpp" : "python"}
              theme="monokai"
              value={code}
              onChange={handleCodeChange}
              name="code-editor"
              editorProps={{ $blockScrolling: true }}
              fontSize={16}
              width="100%"
              height="400px"
            />
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Execution Output</h3>
            <pre className="bg-slate-700 p-4 rounded-xl text-sm whitespace-pre-wrap h-60 overflow-auto">
              {executionOutput}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyProblemPage;
