import express from "express";
import { getAllContests, getContestDetails } from "../controllers/contest.controller.js";

const router = express.Router();

// Fetch all contests (past, ongoing, future)
router.get("/", getAllContests);

// Fetch a specific contest with problems
router.get("/:contestId", getContestDetails);

export default router;
