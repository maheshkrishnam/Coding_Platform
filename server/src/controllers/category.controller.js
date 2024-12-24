import { fetchFromGitHub } from "../utils/github.js";

const GITHUB_API_BASE = "https://api.github.com/repos/maheshkrishnam/Coding_Platform/contents/algorithms";

export const getCategories = async (req, res) => {
  try {
    const data = await fetchFromGitHub(GITHUB_API_BASE);
    res.json(data.map((item) => item.name)); // Return category names
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};
