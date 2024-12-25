import { fetchContestProblems } from "../services/contest.service.js";
import { fetchAllContests, fetchContestById } from "../services/contest.service.js";

// Controller to handle fetching all contest problems
export const getContestProblems = async (req, res) => {
  const { contestId } = req.params;

  try {
    const problems = await fetchContestProblems(contestId);
    res.status(200).json(problems);
  } catch (error) {
    console.error("Error in contest controller:", error.message);
    res.status(500).json({ error: "Failed to fetch contest problems." });
  }
};

// Fetch all contests (ongoing, future, or past)
export const getAllContests = async (req, res) => {
  try {
    const contests = await fetchAllContests();
    res.status(200).json(contests);
  } catch (error) {
    console.error("Error fetching contests:", error.message);
    res.status(500).json({ error: "Failed to fetch contests." });
  }
};

// Fetch specific contest details along with problems
export const getContestDetails = async (req, res) => {
  const { contestId } = req.params;

  try {
    const contest = await fetchContestById(contestId);
    res.status(200).json(contest);
  } catch (error) {
    console.error("Error fetching contest details:", error.message);
    res.status(500).json({ error: "Failed to fetch contest details." });
  }
};
