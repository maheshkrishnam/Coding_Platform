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

const ProblemSolvingPage = () => {
  const { slug } = useParams();
  const [problem, setProblem] = useState("");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("cpp");
  const [executionOutput, setExecutionOutput] = useState("");
  const [validationMessage, setValidationMessage] = useState("");

  // Fetch problem details from backend API
  useEffect(() => {
    const fetchProblemDetails = async () => {
      try {
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
      const response = await axios.post("http://localhost:5000/execute/run", {
        language,
        code,
        input,
      });

      const actualOutput = response.data.output?.trim() || "No output returned.";
      setExecutionOutput(actualOutput);

      // Check if the output matches the expected output
      if (actualOutput === output) {
        setValidationMessage("Output matches the expected output! ✅");
      } else {
        setValidationMessage("Output does not match the expected output. ❌");
      }
    } catch (err) {
      console.error("Error running code:", err);
      setExecutionOutput("Error occurred while running the code.");
      setValidationMessage("");
    }
  };

  const handleSubmitCode = async () => {
    try {
      const response = await axios.post("http://localhost:5000/execute/submit", {
        language,
        code,
        input,
        expectedOutput: output,
      });

      const result = response.data.result || "No result returned.";
      setExecutionOutput(result);

      if (result === "Accepted") {
        setValidationMessage("Code successfully submitted and validated! ✅");
      } else {
        setValidationMessage("Code submission failed. ❌");
      }
    } catch (err) {
      console.error("Error submitting code:", err);
      setExecutionOutput("Error occurred while submitting the code.");
      setValidationMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto bg-slate-700 px-4 py-6 rounded-xl shadow-lg">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-4">Problem</h2>
            <div className="bg-slate-900 p-4 rounded-md text-sm">
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
                        className="bg-slate-700 text-slate-300 px-1 py-0.5 rounded"
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
              <pre className="bg-slate-600 p-4 rounded-md text-sm whitespace-pre-wrap h-60 overflow-auto">
                {input}
              </pre>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-2">Expected Output</h3>
              <pre className="bg-slate-600 p-4 rounded-md text-sm whitespace-pre-wrap h-60 overflow-auto">
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
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
              >
                Run Code
              </button>
              <button
                onClick={handleSubmitCode}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
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
            <pre className="bg-slate-600 p-4 rounded-md text-sm whitespace-pre-wrap h-60 overflow-auto">
              {executionOutput}
            </pre>
            {validationMessage && (
              <div className={`mt-4 text-lg font-semibold ${validationMessage.includes("✅") ? "text-green-500" : "text-red-500"}`}>
                {validationMessage}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemSolvingPage;
