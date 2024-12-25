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

const BACKEND_API_BASE = "http://localhost:5000/problem";

const ProblemSolvingPage = () => {
  const { slug } = useParams();
  const [problem, setProblem] = useState("");
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("cpp");
  const [status, setStatus] = useState({ message: "Idle", type: "idle" });
  const [celebrate, setCelebrate] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    const fetchProblemDetails = async () => {
      try {
        const response = await axios.get(`${BACKEND_API_BASE}/${encodeURIComponent(slug)}`);
        const { problem } = response.data;
        setProblem(problem);
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
      const response = await axios.post("http://localhost:5000/execute/run", {
        language,
        code,
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
      const response = await axios.post("http://localhost:5000/execute/submit", {
        language,
        code,
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
      // Request full-screen mode for the whole document
      document.documentElement.requestFullscreen().catch((err) => {
        console.error("Error attempting to enable full-screen mode:", err);
      });
    } else {
      // Exit full-screen mode
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

  // Event listener for fullscreen change
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
          {/* Timer Icon (Single Click to Start/Stop, Double Click to Reset) */}
          <div
            className="cursor-pointer text-xl p-2 flex flex-row"
            onClick={toggleTimer}
            onDoubleClick={resetTimer}
          >
            <FiClock className={`${isTimerRunning ? 'text-red-600' : 'text-white'}`} />
            <span className="ml-2">{timer}s</span>
          </div>
          {/* Full Screen Button */}
          <button onClick={toggleFullScreen} className="text-white">
            {isFullScreen ? <FiMinimize2 /> : <FiMaximize2 />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        {/* Left Panel: Problem */}
        <div className="bg-slate-800 p-6 rounded-md shadow-md overflow-auto h-full">
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

        {/* Right Panel: Editor */}
        <div className={`bg-slate-800 p-6 rounded-md shadow-md relative h-96 md:h-full col-span-2}`}>
          <AceEditor
            mode={language === "cpp" ? "c_cpp" : "python"}
            theme="monokai"
            value={code}
            onChange={handleCodeChange}
            name="code-editor"
            fontSize={16}
            width="100%"
            height="100%"
          />
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
