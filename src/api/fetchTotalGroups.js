import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchTotalGroups = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/groups/all`);
    return response.data;
  } catch (error) {
    console.error("API 호출 중 오류 발생:", error);
    throw error;
  }
};
