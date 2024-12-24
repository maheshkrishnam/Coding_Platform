import express from "express";
import { executeCode, submitCode } from "../controllers/execution.controller.js";

const router = express.Router();

router.post("/run", executeCode);
router.post("/submit", submitCode);

export default router;
