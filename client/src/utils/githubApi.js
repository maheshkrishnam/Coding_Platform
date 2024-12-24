import axios from "axios";

const BASE_URL = "http://localhost:5000/algorithms";

export const fetchCategories = async () => {
  const response = await axios.get(`${BASE_URL}/categories`);
  return response.data;
};

export const fetchAlgorithmsInCategory = async (category) => {
  const response = await axios.get(`${BASE_URL}/${category}`);
  return response.data;
};

export const fetchAlgorithmDetails = async (category, algorithm) => {
  const response = await axios.get(`${BASE_URL}/${category}/${algorithm}`);
  return response.data;
};
