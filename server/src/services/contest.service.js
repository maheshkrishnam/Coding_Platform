import { fetchFromGitHub } from "../utils/github.js";
import { fetchProblemData } from "./problem.service.js";

export const fetchContestProblems = async (contestId) => {
  const baseUrl = `https://api.github.com/repos/maheshkrishnam/Coding_Platform/contents/contests/${encodeURIComponent(
    contestId
  )}/problems`;

  try {
    // Fetch all problem directories in the contest
    const problemList = await fetchFromGitHub(baseUrl);

    if (!Array.isArray(problemList)) {
      throw new Error("Invalid contest structure in GitHub repository");
    }

    // Fetch details for each problem
    const problems = await Promise.all(
      problemList.map((problem) => fetchProblemData(problem.name))
    );

    return problems;
  } catch (error) {
    throw new Error("Failed to fetch contest problems");
  }
};

const GITHUB_CONTESTS_URL = "https://api.github.com/repos/maheshkrishnam/Coding_Platform/contents/contests/contests.json";

// Fetch all contests with metadata
export const fetchAllContests = async () => {
  try {
    const contestsData = await fetchFromGitHub(GITHUB_CONTESTS_URL);
    const contests = JSON.parse(Buffer.from(contestsData.content, "base64").toString("utf8"));

    const now = new Date();

    // Classify contests into past, ongoing, and upcoming
    const classifiedContests = contests.map((contest) => {
      const startTime = new Date(contest.start_time);
      const endTime = new Date(contest.end_time);

      if (now < startTime) {
        contest.status = "upcoming";
      } else if (now >= startTime && now <= endTime) {
        contest.status = "ongoing";
      } else {
        contest.status = "completed";
      }
      return contest;
    });

    return classifiedContests;
  } catch (error) {
    throw new Error("Failed to fetch contests from GitHub");
  }
};

// Fetch specific contest by ID and its problems
export const fetchContestById = async (contestId) => {
  const contestUrl = `https://api.github.com/repos/maheshkrishnam/Coding_Platform/contents/contests/${encodeURIComponent(contestId)}/problems`;

  try {
    const contestsData = await fetchFromGitHub(GITHUB_CONTESTS_URL);
    const contests = JSON.parse(Buffer.from(contestsData.content, "base64").toString("utf8"));
    const contest = contests.find((c) => c.id === contestId);

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
    throw new Error("Failed to fetch contest details");
  }
};
