import axios from "axios";

const GITHUB_TOKEN = process.env.GITHUB_ACCESS_TOKEN;

export const fetchFromGitHub = async (url) => {
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("GitHub API Error:", error.response ? error.response.data : error.message);
    throw new Error("Failed to fetch data from GitHub");
  }
};
