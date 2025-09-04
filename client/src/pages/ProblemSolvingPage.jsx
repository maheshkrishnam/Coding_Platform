import React, { useEffect, useState } from "react";
import AceEditor from "react-ace";
import { useParams } from "react-router-dom";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { FiCheckCircle, FiXCircle, FiLoader, FiMaximize2, FiMinimize2, FiClock } from "react-icons/fi";
import Confetti from "react-confetti";
import { BounceLoader } from "react-spinners";
import { Tab } from "@headlessui/react";

import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-monokai";

const BACKEND_API_BASE = `${import.meta.env.VITE_BACKEND_URL}/problem`;
const EXECUTE_API = `${import.meta.env.VITE_BACKEND_URL}/execute/run`;
const SUBMIT_API = `${import.meta.env.VITE_BACKEND_URL}/execute/submit`;

const ProblemSolvingPage = () => {
  const { slug } = useParams();
  const [problem, setProblem] = useState("");
  const [input, setInput] = useState("");
  const [expectedOutput, setExpectedOutput] = useState("");
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("cpp");
  const [status, setStatus] = useState({ message: "Idle", type: "idle" });
  const [celebrate, setCelebrate] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [output, setOutput] = useState("");
  const [isSolved, setIsSolved] = useState(false); // Track if problem is solved

  useEffect(() => {
    const fetchProblemDetails = async () => {
      try {
        const response = await axios.get(`${BACKEND_API_BASE}/${encodeURIComponent(slug)}`);
        const { problem, input, output } = response.data;
        setProblem(problem);
        setInput(input);
        setExpectedOutput(output);

        // Check if the problem was previously solved and load the solution
        const solvedProblems = JSON.parse(localStorage.getItem("solvedProblems") || "{}");
        if (solvedProblems[slug]) {
          setIsSolved(true);
          setCode(solvedProblems[slug].code);
          setLanguage(solvedProblems[slug].language);
          setStatus({ message: "Previously Solved", type: "success" });
        }
      } catch (error) {
        console.error("Error fetching problem details:", error);
      }
    };

    fetchProblemDetails();
  }, [slug]);

  useEffect(() => {
    let interval;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer((prevTime) => prevTime + 1);
      }, 1000);
    } else if (!isTimerRunning && timer !== 0) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isTimerRunning, timer]);

  const handleCodeChange = (newCode) => setCode(newCode);

  const handleLanguageChange = (event) => setLanguage(event.target.value);

  const handleRunCode = async () => {
    setIsProcessing(true);
    setStatus({ message: "Running...", type: "loading" });

    try {
      const response = await axios.post(EXECUTE_API, {
        language,
        code,
        input,
      });

      const result = response.data.output?.trim() || "No output returned.";
      setOutput(result);

      if (result === expectedOutput.trim()) {
        setStatus({ message: "Correct Output", type: "success" });
      } else {
        setStatus({ message: "Incorrect Output", type: "error" });
      }
    } catch (err) {
      setStatus({ message: "Error", type: "error" });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmitCode = async () => {
    setIsProcessing(true);
    setStatus({ message: "Submitting...", type: "loading" });

    try {
      const response = await axios.post(SUBMIT_API, {
        language,
        code,
        input,
        expectedOutput,
      });

      const result = response.data.result || "No result returned.";
      if (result === "Accepted") {
        setCelebrate(true);
        setStatus({ message: "Accepted", type: "success" });
        setIsSolved(true);

        // Store the solution in localStorage
        const solvedProblems = JSON.parse(localStorage.getItem("solvedProblems") || "{}");
        solvedProblems[slug] = { code, language, timestamp: Date.now() };
        localStorage.setItem("solvedProblems", JSON.stringify(solvedProblems));

        setTimeout(() => setCelebrate(false), 3000);
      } else {
        setStatus({ message: "Wrong Answer", type: "error" });
      }
    } catch (err) {
      setStatus({ message: "Error", type: "error" });
    } finally {
      setIsProcessing(false);
    }
  };

  const renderStatusIcon = () => {
    switch (status.type) {
      case "success":
        return <FiCheckCircle className="text-green-500 text-2xl" />;
      case "error":
        return <FiXCircle className="text-red-500 text-2xl" />;
      case "loading":
        return <FiLoader className="text-yellow-500 text-2xl animate-spin" />;
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen bg-slate-900 text-white flex flex-col ${isFullScreen ? 'overflow-hidden' : ''}`}>
      {celebrate && <Confetti width={window.innerWidth} height={400} />}

      <header className="bg-slate-800 p-4 flex items-center justify-between sticky shadow-md top-0 z-10">
        <div className="flex items-center gap-3">
          {isSolved && <FiCheckCircle className="text-green-500 text-2xl" />}
          {renderStatusIcon()}
          <span className="text-xl font-semibold">{status.message}</span>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={language}
            onChange={handleLanguageChange}
            className="bg-slate-700 text-white p-2 rounded-md"
          >
            <option value="cpp">C++</option>
            <option value="python">Python</option>
          </select>
          <button
            onClick={handleRunCode}
            className="bg-green-600 px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Run
          </button>
          <button
            onClick={handleSubmitCode}
            className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Submit
          </button>
        </div>
      </header>

      <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        <div className="bg-slate-800 p-6 rounded-md shadow-md overflow-auto h-full">
          <h2 className="text-xl font-bold mb-2">Problem Description</h2>
          <ReactMarkdown children={problem} remarkPlugins={[remarkGfm]} className="prose prose-invert max-w-none" />

          <h3 className="text-lg font-semibold mt-4">Input</h3>
          <pre className="bg-slate-700 p-2 rounded-md">{input || "N/A"}</pre>

          <h3 className="text-lg font-semibold mt-4">Expected Output</h3>
          <pre className="bg-slate-700 p-2 rounded-md">{expectedOutput || "N/A"}</pre>
        </div>

        <div className="bg-slate-800 p-6 rounded-md shadow-md relative h-96 md:h-full">
          <AceEditor
            mode={language === "cpp" ? "c_cpp" : "python"}
            theme="monokai"
            value={code}
            onChange={handleCodeChange}
            fontSize={16}
            width="100%"
            height="50%"
          />

          <h3 className="text-lg font-semibold mt-4">Output</h3>
          <pre className="bg-slate-700 p-2 rounded-md">{output || "No output yet"}</pre>

          {isProcessing && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <BounceLoader color="#36d7b7" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProblemSolvingPage;