import { fetchFromGitHub } from "../utils/github.js";

export const fetchProblemData = async (slug) => {
  const baseUrl = `https://api.github.com/repos/maheshkrishnam/Coding_Platform/contents/problems/${encodeURIComponent(
    slug
  )}`;

  try {
    const [problemMd, inputTxt, outputTxt, metadata] = await Promise.all([
      fetchFromGitHub(`${baseUrl}/problem.md`),
      fetchFromGitHub(`${baseUrl}/input.txt`),
      fetchFromGitHub(`${baseUrl}/output.txt`),
      fetchFromGitHub(`${baseUrl}/metadata.json`),
    ]);

    return {
      problem: Buffer.from(problemMd.content, "base64").toString("utf8"),
      input: Buffer.from(inputTxt.content, "base64").toString("utf8").trim(),
      output: Buffer.from(outputTxt.content, "base64").toString("utf8").trim(),
      metadata: JSON.parse(Buffer.from(metadata.content, "base64").toString("utf8")),
    };
  } catch (error) {
    throw new Error("Failed to fetch problem data from GitHub");
  }
};
