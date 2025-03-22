import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchGroupResults = async (leaderName, groupName, password) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/matches/results`,
      {
        params: {
          leaderName,
          groupName,
          password,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("API 호출 중 오류 발생:", error);
    throw error;
  }
};
