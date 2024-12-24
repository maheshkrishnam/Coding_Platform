import axios from 'axios';
import dotenv from 'dotenv';
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

dotenv.config();

const BASE_URL = 'https://api.github.com/repos/maheshkrishnam/Coding_Platform/contents/algorithms';
const GITHUB_TOKEN = process.env.GITHUB_ACCESS_TOKEN;

const getAllAlgorithms = asyncHandler(async (req, res) => {
  try {
    const categoriesResponse = await axios.get(BASE_URL, {
      headers: { Authorization: `Bearer ${GITHUB_TOKEN}` }
    });

    const algorithmsData = [];

    for (const category of categoriesResponse.data) {
      const categoryName = category.name;

      const categoryResponse = await axios.get(`${BASE_URL}/${categoryName}`, {
        headers: { Authorization: `Bearer ${GITHUB_TOKEN}` }
      });

      const algorithmsWithMetadata = [];
      for (const algorithm of categoryResponse.data) {
        const metadataResponse = await axios.get(
          `${BASE_URL}/${categoryName}/${algorithm.name}/metadata.json`,
          { headers: { Authorization: `Bearer ${GITHUB_TOKEN}` } }
        );

        const { content, encoding } = metadataResponse.data;
        const metadata = encoding === 'base64' ? JSON.parse(atob(content)) : JSON.parse(content);

        algorithmsWithMetadata.push({
          name: algorithm.name,
          metadata,
        });
      }

      algorithmsData.push({
        category: categoryName,
        algorithms: algorithmsWithMetadata,
      });
    }

    res.json(algorithmsData);

  } catch (error) {
    console.error("Error fetching algorithm data:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch algorithm data" });
  }
});

// Controller to get algorithms in a specific category
const getAlgorithmsByCategory = asyncHandler(async (req, res) => {
  const { category } = req.params;
  
  try {
    const categoryResponse = await axios.get(`${BASE_URL}/${category}`, {
      headers: { Authorization: `Bearer ${GITHUB_TOKEN}` }
    });

    const algorithms = categoryResponse.data.map(algorithm => ({
      name: algorithm.name,
    }));

    res.json(algorithms);
  } catch (error) {
    console.error(`Error fetching algorithms for category ${category}:`, error);
    res.status(500).json({ error: `Failed to fetch algorithms for category ${category}` });
  }
});

// Controller to get details for a specific algorithm
const getAlgorithmDetails = asyncHandler(async (req, res) => {
  const { category, algorithm } = req.params;
  
  try {
    const metadataResponse = await axios.get(
      `${BASE_URL}/${category}/${algorithm}/metadata.json`,
      { headers: { Authorization: `Bearer ${GITHUB_TOKEN}` } }
    );
    
    const descriptionResponse = await axios.get(
      `${BASE_URL}/${category}/${algorithm}/algorithm.md`,
      { headers: { Authorization: `Bearer ${GITHUB_TOKEN}` } }
    );

    const cppCodeResponse = await axios.get(
      `${BASE_URL}/${category}/${algorithm}/code.cpp`,
      { headers: { Authorization: `Bearer ${GITHUB_TOKEN}` } }
    );

    const pyCodeResponse = await axios.get(
      `${BASE_URL}/${category}/${algorithm}/code.py`,
      { headers: { Authorization: `Bearer ${GITHUB_TOKEN}` } }
    );

    const metadata = JSON.parse(atob(metadataResponse.data.content));
    const description = atob(descriptionResponse.data.content);
    const cppCode = atob(cppCodeResponse.data.content);
    const pyCode = atob(pyCodeResponse.data.content);

    res.json({
      metadata,
      description,
      codeCpp: cppCode,
      codePy: pyCode,
    });
  } catch (error) {
    console.error(`Error fetching details for algorithm ${algorithm}:`, error);
    res.status(500).json({ error: "Failed to fetch algorithm details" });
  }
});

export { getAllAlgorithms, getAlgorithmsByCategory, getAlgorithmDetails };
