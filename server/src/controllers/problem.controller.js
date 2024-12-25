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


// Controller to fetch all contest problems
export const getContestProblems = async (req, res) => {
  const { contestId } = req.params;
  const contestBaseUrl = `https://api.github.com/repos/maheshkrishnam/Coding_Platform/contents/contests/${encodeURIComponent(contestId)}/problems`;

  try {
    // Fetch the problem list for the contest
    const problemList = await fetchFromGitHub(contestBaseUrl);

    // Ensure the response contains problem directories
    if (!Array.isArray(problemList)) {
      throw new Error("Invalid contest data structure");
    }

    // Fetch and decode each problem's metadata and details in parallel
    const problems = await Promise.all(
      problemList.map(async (problem) => {
        const problemSlug = problem.name;

        // Reuse the getProblemData logic for individual problem fetching
        const problemData = await getProblemDataFromGitHub(problemSlug, contestId);

        return { slug: problemSlug, ...problemData };
      })
    );

    // Send the formatted contest problems
    res.status(200).json(problems);
  } catch (error) {
    console.error("Error fetching contest problems:", error.message);
    res.status(500).json({ error: "Failed to fetch contest problems." });
  }
};

// Helper function for individual problem fetching within contests
const getProblemDataFromGitHub = async (slug, contestId) => {
  const baseUrl = `https://api.github.com/repos/maheshkrishnam/Coding_Platform/contents/contests/${encodeURIComponent(
    contestId
  )}/problems/${encodeURIComponent(slug)}`;

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
    throw new Error(`Failed to fetch problem data for slug: ${slug}`);
  }
};