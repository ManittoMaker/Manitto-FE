import apiClient from "./apiClient";

export const fetchTotalGroups = async () => {
  try {
    const response = await apiClient.get("/api/groups/all");
    return response.data;
  } catch (error) {
    console.error("API 호출 중 오류 발생:", error);
    throw error;
  }
};
