import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { BounceLoader } from "react-spinners";
import ReactMarkdown from "react-markdown";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-monokai";

const BACKEND_API_BASE = "http://localhost:5000";

const ContestPage = () => {
  const { contestId } = useParams();
  const navigate = useNavigate();
  const [contest, setContest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userCode, setUserCode] = useState("");
  const [userLanguage, setUserLanguage] = useState("cpp");
  const [status, setStatus] = useState("Idle");
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);

  useEffect(() => {
    const fetchContestData = async () => {
      try {
        const response = await axios.get(`${BACKEND_API_BASE}/contest/${contestId}`);
        const contestData = response.data;
        setContest(contestData);
        setTimeLeft(contestData.duration); // In seconds

        // Get all problems for the contest
        const problems = contestData.problems;
        let shuffledQuestions = JSON.parse(localStorage.getItem("shuffledQuestions"));

        if (!shuffledQuestions) {
          // If no shuffled questions in localStorage, shuffle them
          shuffledQuestions = shuffleArray(problems);
          localStorage.setItem("shuffledQuestions", JSON.stringify(shuffledQuestions));
        }

        // Pick the first 4 questions for the contest
        setQuestions(shuffledQuestions.slice(0, 4));

      } catch (error) {
        console.error("Error fetching contest data:", error);
      }
    };

    fetchContestData();
  }, [contestId]);

  useEffect(() => {
    let interval;
    if (timerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft <= 0) {
      setTimerRunning(false);
      setStatus("Time's up");
      navigate("/contests"); // Automatically exit after time is up
    }

    return () => clearInterval(interval);
  }, [timeLeft, timerRunning, navigate]);

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const handleCodeChange = (newCode) => setUserCode(newCode);

  const handleLanguageChange = (event) => setUserLanguage(event.target.value);

  const handleRunCode = async () => {
    setStatus("Running...");
    try {
      const response = await axios.post(`${BACKEND_API_BASE}/execute/run`, {
        language: userLanguage,
        code: userCode,
        input: questions[currentQuestionIndex].input,
      });

      const result = response.data.output?.trim() || "No output returned.";
      if (result === questions[currentQuestionIndex].expectedOutput) {
        setStatus("Correct");
      } else {
        setStatus("Incorrect");
      }
    } catch (err) {
      setStatus("Error");
    }
  };

  const handleSubmitCode = async () => {
    setStatus("Submitting...");
    try {
      const response = await axios.post(`${BACKEND_API_BASE}/execute/submit`, {
        language: userLanguage,
        code: userCode,
        input: questions[currentQuestionIndex].input,
        expectedOutput: questions[currentQuestionIndex].expectedOutput,
      });

      const result = response.data.result || "No result returned.";
      if (result === "Accepted") {
        setStatus("Accepted");
      } else {
        setStatus("Incorrect");
      }
    } catch (err) {
      setStatus("Error");
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
    }
  };

  if (!contest) {
    return <BounceLoader color="#36d7b7" />;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <h2 className="text-3xl font-semibold mb-4">{contest.name}</h2>
      <div className="mb-6">{contest.description}</div>

      <div className="flex justify-between items-center mb-6">
        <span>{Math.floor(timeLeft / 60)}:{timeLeft % 60}</span>
        <div className="flex gap-4">
          <select
            value={userLanguage}
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
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800 p-6 rounded-md shadow-md">
          <ReactMarkdown className="prose">{questions[currentQuestionIndex]?.description}</ReactMarkdown>
        </div>

        <div className="bg-slate-800 p-6 rounded-md shadow-md">
          <AceEditor
            mode={userLanguage === "cpp" ? "c_cpp" : "python"}
            theme="monokai"
            value={userCode}
            onChange={handleCodeChange}
            name="code-editor"
            editorProps={{ $blockScrolling: true }}
            className="h-96"
            setOptions={{
              useWorker: false,
              showLineNumbers: true,
            }}
          />
        </div>
      </div>

      <div className="flex justify-between items-center mt-6">
        <button
          onClick={handlePrevQuestion}
          className="bg-yellow-600 px-4 py-2 rounded-md hover:bg-yellow-700 transition"
        >
          Previous Question
        </button>
        <button
          onClick={handleNextQuestion}
          className="bg-yellow-600 px-4 py-2 rounded-md hover:bg-yellow-700 transition"
        >
          Next Question
        </button>
      </div>
    </div>
  );
};

export default ContestPage;
