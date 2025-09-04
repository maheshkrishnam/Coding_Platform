import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { BounceLoader } from "react-spinners";
import ReactMarkdown from "react-markdown";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-monokai";

const BACKEND_API_BASE = `${import.meta.env.VITE_BACKEND_URL}`;

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
        setTimeLeft(contestData.duration); 

        setQuestions(contestData.problems || []);
      } catch (error) {
        console.error("Error fetching contest data:", error);
      }
    };

    fetchContestData();
  }, [contestId]);

  useEffect(() => {
    if (timerRunning && timeLeft > 0) {
      const interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (timeLeft <= 0) {
      setTimerRunning(false);
      setStatus("Time's up");
      navigate("/contest");
    }
  }, [timeLeft, timerRunning, navigate]);

  const handleCodeChange = (newCode) => setUserCode(newCode);

  const handleLanguageChange = (event) => setUserLanguage(event.target.value);

  const handleRunCode = async () => {
    setStatus("Running...");
    try {
      const response = await axios.post(`${BACKEND_API_BASE}/execute/run`, {
        language: userLanguage,
        code: userCode,
        input: questions[currentQuestionIndex]?.input,
      });

      setStatus(response.data.output.trim() === questions[currentQuestionIndex]?.expectedOutput ? "Correct" : "Incorrect");
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
        input: questions[currentQuestionIndex]?.input,
        expectedOutput: questions[currentQuestionIndex]?.expectedOutput,
      });

      setStatus(response.data.result === "Accepted" ? "Accepted" : "Incorrect");
    } catch (err) {
      setStatus("Error");
    }
  };

  if (!contest) {
    return <BounceLoader color="#36d7b7" />;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <h2 className="text-3xl font-semibold mb-4">{contest.name}</h2>
      <p className="mb-6">{contest.description}</p>

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
            className="h-96"
            setOptions={{ showLineNumbers: true }}
          />
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <button onClick={handleRunCode} className="bg-green-600 px-4 py-2 rounded-lg">Run Code</button>
        <button onClick={handleSubmitCode} className="bg-blue-600 px-4 py-2 rounded-lg">Submit Code</button>
      </div>
    </div>
  );
};

export default ContestPage;
