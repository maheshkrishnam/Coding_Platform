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
  const { date } = useParams();
  const [problem, setProblem] = useState("");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("cpp");
  const [executionOutput, setExecutionOutput] = useState("");
  const [status, setStatus] = useState({ message: "Idle", type: "idle" });
  const [celebrate, setCelebrate] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const slug = problems[getProblemIndex(date, problems.length)];

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
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/execute/run`, {
        language,
        code,
        input,
      });

      const result = response.data.output?.trim() || "No output returned.";
      if (result === "Expected Output") {
        setStatus({ message: "Success", type: "success" });
      } else {
        setStatus({ message: "Incorrect", type: "error" });
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
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/execute/submit`, {
        language,
        code,
        input,
        expectedOutput: output,
      });

      const result = response.data.result || "No result returned.";
      if (result === "Accepted") {
        setCelebrate(true);
        setStatus({ message: "Accepted", type: "success" });
        setTimeout(() => setCelebrate(false), 3000); // Stop celebration after 3 seconds
      } else {
        setStatus({ message: "Incorrect", type: "error" });
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

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error("Error attempting to enable full-screen mode:", err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const toggleTimer = (e) => {
    if (e.detail === 1) {
      setIsTimerRunning((prev) => !prev);
    } else if (e.detail === 2) {
      resetTimer();
    }
  };

  const resetTimer = () => {
    setTimer(0);
    setIsTimerRunning(false);
  };

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullScreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
    };
  }, []);

  return (
    <div className={`min-h-screen bg-slate-900 text-white flex flex-col ${isFullScreen ? 'overflow-hidden' : ''}`}>
      {celebrate && <Confetti width={window.innerWidth} height={400} />}
      
      {/* Status Bar */}
      <header className="bg-slate-800 p-4 flex items-center justify-between sticky shadow-md top-0 z-50">
        <div className="flex items-center gap-3">
          {renderStatusIcon()}
          <span className="text-xl font-semibold">{status.message}</span>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={language}
            onChange={handleLanguageChange}
            className="bg-slate-600 text-white p-2 rounded-md"
          >
            <option value="cpp">C++</option>
            <option value="python">Python</option>
          </select>
          <button
            onClick={handleRunCode}
            className="bg-green-600 px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Run Code
          </button>
          <button
            onClick={handleSubmitCode}
            className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Submit Code
          </button>
          <div
            className="cursor-pointer text-xl p-2 flex flex-row"
            onClick={toggleTimer}
            onDoubleClick={resetTimer}
          >
            <FiClock className={`${isTimerRunning ? 'text-red-600' : 'text-white'}`} />
            <span className="ml-2">{timer}s</span>
          </div>
          <button onClick={toggleFullScreen} className="text-white">
            {isFullScreen ? <FiMinimize2 /> : <FiMaximize2 />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        {/* Left Panel: Problem */}
        <div className="bg-slate-800 p-6 rounded-md shadow-md overflow-auto">
          <Tab.Group>
            <Tab.List className="flex space-x-4 border-b pb-2">
              <Tab
                className={({ selected }) =>
                  selected
                    ? "text-blue-400 border-b-2 border-blue-400 pb-1 font-semibold"
                    : "text-slate-400 pb-1"
                }
              >
                Problem
              </Tab>
              <Tab
                className={({ selected }) =>
                  selected
                    ? "text-blue-400 border-b-2 border-blue-400 pb-1 font-semibold"
                    : "text-slate-400 pb-1"
                }
              >
                Tutorial
              </Tab>
            </Tab.List>
            <Tab.Panels>
              <Tab.Panel className="h-full overflow-auto">
                <ReactMarkdown
                  children={problem}
                  remarkPlugins={[remarkGfm]}
                  className="prose prose-invert max-w-none mt-4"
                />
              </Tab.Panel>
              <Tab.Panel className="h-full overflow-auto">
                <h3 className="text-xl font-semibold text-blue-400 mt-4">Tutorial</h3>
                <p className="mt-4">
                  This is a tutorial on how to use the platform. Write your code in the editor and use the timer to track your progress.
                </p>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>

        {/* Right Panel: Code Editor */}
        <div className="bg-slate-800 p-6 rounded-md shadow-md h-full">
          <AceEditor
            mode={language === "cpp" ? "c_cpp" : "python"}
            theme="monokai"
            value={code}
            onChange={handleCodeChange}
            name="code-editor"
            fontSize={16}
            height="100%"
            width="100%"
          />
        </div>
      </div>
    </div>
  );
};

export default DailyProblemPage;
