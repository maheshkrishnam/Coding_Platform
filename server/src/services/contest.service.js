import { fetchFromGitHub } from "../utils/github.js";
import { fetchProblemData } from "./problem.service.js";

const GITHUB_CONTESTS_URL = "https://api.github.com/repos/maheshkrishnam/Coding_Platform/contents/contests/contests.json";

// Fetch all contests with metadata
export const fetchAllContests = async () => {
  try {
    const contestsData = await fetchFromGitHub(GITHUB_CONTESTS_URL);
    const contests = JSON.parse(Buffer.from(contestsData.content, "base64").toString("utf8"));

    const now = new Date();

    const ongoing = [];
    const past = [];

    contests.forEach((contest) => {
      const startTime = new Date(contest.start_time);
      const endTime = new Date(contest.end_time);

      if (now >= startTime && now <= endTime) {
        ongoing.push(contest);
      } else if (now > endTime) {
        past.push(contest);
      }
    });

    return { ongoing, past }; // ✅ Correct return structure
  } catch (error) {
    console.error("Failed to fetch contests from GitHub:", error.message);
    throw new Error("Failed to fetch contests from GitHub");
  }
};

// Fetch specific contest by ID and its problems
export const fetchContestById = async (contestId) => {
  const contestUrl = `https://api.github.com/repos/maheshkrishnam/Coding_Platform/contents/contests/${encodeURIComponent(contestId)}/problems`;

  try {
    const contestsData = await fetchFromGitHub(GITHUB_CONTESTS_URL);
    const contests = JSON.parse(Buffer.from(contestsData.content, "base64").toString("utf8"));

    const contest = contests.find((c) => String(c.id) === String(contestId));

    if (!contest) {
      throw new Error("Contest not found");
    }

    // Fetch all problems in the contest
    const problemList = await fetchFromGitHub(contestUrl);

    const problems = await Promise.all(
      problemList.map((problem) => fetchProblemData(problem.name))
    );

    return { ...contest, problems };
  } catch (error) {
    console.error("Failed to fetch contest details:", error.message);
    throw new Error("Failed to fetch contest details");
  }
};
