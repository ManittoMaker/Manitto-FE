import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchTotalGroups = async () => {
  try {
    // 서버가 응답하지 않으면 5초 후 실패 처리 (점검 중 화면 표시를 위해)
    // timeout과 AbortSignal 이중 적용으로 어떤 단계에서 멈춰도 반드시 중단되도록 보장
    // AbortSignal.timeout은 구형 브라우저(Safari 16 미만 등)에 없으므로 가드 필수
    const response = await axios.get(`${API_BASE_URL}/api/groups/all`, {
      timeout: 5000,
      signal:
        typeof AbortSignal.timeout === "function"
          ? AbortSignal.timeout(5000)
          : undefined,
    });
    return response.data;
  } catch (error) {
    console.error("API 호출 중 오류 발생:", error);
    throw error;
  }
};
