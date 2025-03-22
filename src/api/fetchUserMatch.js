import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchUserMatch = async (groupId, name, password) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/matches/${groupId}/result/user/${encodeURIComponent(name)}`,
      {
        params: { password },
      }
    );

    return response.data;
  } catch (error) {
    console.error("API 호출 중 오류 발생:", error);

    if (error.response && error.response.status === 406) {
      return {
        success: false,
        message: "이름 또는 비밀번호를 다시 확인해주세요.",
      };
    }

    return {
      success: false,
      message: "알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
    };
  }
};
