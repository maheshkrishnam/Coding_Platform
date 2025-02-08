import { submitToJudge0 } from "../services/judge0.service.js";

const languageMap = {
  cpp: 52,
  python: 71,
  java: 62,
  c: 50,
};

export const executeCode = async (req, res) => {
  const { code, language, input } = req.body;

  try {
    const response = await submitToJudge0({
      sourceCode: code,
      languageId: languageMap[language],
      stdin: input,
    });

    res.status(200).json({
      output: response.stdout || "No output",
      error: response.stderr || null,
      status: response.status?.description || "Unknown status",
    });
  } catch (error) {
    console.error("Error executing code:", error);
    res.status(500).json({ error: "Failed to execute code." });
  }
};

export const submitCode = async (req, res) => {
  const { code, language, input, expectedOutput } = req.body;

  try {
    const response = await submitToJudge0({
      sourceCode: code,
      languageId: languageMap[language],
      stdin: input,
      expectedOutput,
    });

    console.log(response);

    const isCorrect = response.stdout?.trim() === expectedOutput.trim();

    res.status(200).json({
      result: isCorrect ? "Accepted" : "Wrong Answer",
      output: response.stdout || "No output",
      error: response.stderr || null,
      status: response.status?.description || "Unknown status",
    });
  } catch (error) {
    console.error("Error submitting code:", error);
    res.status(500).json({ error: "Failed to submit code." });
  }
};
