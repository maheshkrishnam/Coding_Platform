import {fetchAllContests, fetchContestById } from "../services/contest.service.js";

// Fetch all contests (ongoing, future, or past)
export const getAllContests = async (req, res) => {
  try {
    const contests = await fetchAllContests();
    console.log("Fetched contests:", JSON.stringify(contests, null, 2)); // Debugging
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
    console.log(`Fetching details for contest ID: ${contestId}`, contest);
    res.status(200).json(contest);
  } catch (error) {
    console.error("Error fetching contest details:", error.message);
    res.status(500).json({ error: "Failed to fetch contest details." });
  }
};
