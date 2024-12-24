import axios from "axios";

const JUDGE0_API_URL = "https://judge0-ce.p.rapidapi.com/submissions";
const JUDGE0_API_HOST = "judge0-ce.p.rapidapi.com";
const JUDGE0_API_KEY = process.env.JUDGE0_API_KEY;

export const submitToJudge0 = async ({ sourceCode, languageId, stdin, expectedOutput }) => {
  try {
    const response = await axios.post(
      `${JUDGE0_API_URL}?base64_encoded=false&wait=true`,
      {
        source_code: sourceCode,
        language_id: languageId,
        stdin,
        expected_output: expectedOutput,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-RapidAPI-Host": JUDGE0_API_HOST,
          "X-RapidAPI-Key": JUDGE0_API_KEY,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Judge0 API Error:", error.response ? error.response.data : error.message);
    throw new Error("Failed to submit to Judge0");
  }
};
