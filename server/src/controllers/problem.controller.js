import { fetchFromGitHub } from "../utils/github.js";

const GITHUB_API_BASE = "https://api.github.com/repos/maheshkrishnam/Coding_Platform/contents/problems";

export const getProblemData = async (req, res) => {
  const { slug } = req.params;

  try {
    const problemUrl = `${GITHUB_API_BASE}/${encodeURIComponent(slug)}/problem.md`;
    const inputUrl = `${GITHUB_API_BASE}/${encodeURIComponent(slug)}/input.txt`;
    const outputUrl = `${GITHUB_API_BASE}/${encodeURIComponent(slug)}/output.txt`;

    const [problemMd, inputTxt, outputTxt] = await Promise.all([
      fetchFromGitHub(problemUrl),
      fetchFromGitHub(inputUrl),
      fetchFromGitHub(outputUrl),
    ]);

    res.status(200).json({
      problem: Buffer.from(problemMd.content, "base64").toString("utf8"),
      input: Buffer.from(inputTxt.content, "base64").toString("utf8").trim(),
      output: Buffer.from(outputTxt.content, "base64").toString("utf8").trim(),
    });
  } catch (error) {
    console.error("Error fetching problem data:", error.message);
    res.status(500).json({ error: "Failed to fetch problem data." });
  }
};

export const getProblems = async (req, res) => {
  try {
    const response = await fetchFromGitHub(GITHUB_API_BASE);

    const problemFolders = response.filter((item) => item.type === "dir");

    const problemData = problemFolders.map((folder) => ({
      title: folder.name,
      slug: folder.name,
    }));

    problemData.sort((a, b) => {
      const numA = parseInt(a.title.split(".")[0]);
      const numB = parseInt(b.title.split(".")[0]);
      return numA - numB;
    });

    res.status(200).json(problemData);
  } catch (error) {
    console.error("Error fetching problems:", error.message);
    res.status(500).json({ error: "Failed to fetch problems." });
  }
};
