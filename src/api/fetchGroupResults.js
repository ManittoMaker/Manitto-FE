import apiClient from "./apiClient";

export const fetchGroupResults = async (leaderName, groupName, password) => {
  try {
    const response = await apiClient.get("/api/matches/results", {
      params: {
        leaderName,
        groupName,
        password,
      },
    });

    return response.data;
  } catch (error) {
    console.error("API 호출 중 오류 발생:", error);
    throw error;
  }
};
