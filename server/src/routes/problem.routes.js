import express from "express";
import { getProblemData, getProblems } from "../controllers/problem.controller.js";

const router = express.Router();

router.get("/", getProblems);
router.get("/:slug", getProblemData);

export default router;
