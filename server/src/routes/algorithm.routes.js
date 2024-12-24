import express from 'express';
import { getCategories } from "../controllers/category.controller.js";
import { getAllAlgorithms, getAlgorithmsByCategory, getAlgorithmDetails } from "../controllers/algorithm.controller.js";

const router = express.Router();

// API: Fetch categories
router.get("/categories", getCategories);

// API: Fetch all algorithms (all categories)
router.get("/all-algorithms", getAllAlgorithms);

// API: Fetch algorithms in a category
router.get("/:category", getAlgorithmsByCategory);

// API: Fetch algorithm details
router.get("/:category/:algorithm", getAlgorithmDetails);

export default router;
