import axios from "axios";

// 서버가 응답하지 않으면 5초 후 실패 처리 (무한 로딩 방지)
const REQUEST_TIMEOUT_MS = 5000;

// 모든 API 모듈이 공유하는 axios 인스턴스
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: REQUEST_TIMEOUT_MS,
});

// timeout과 AbortSignal 이중 적용으로 어떤 단계에서 멈춰도 반드시 중단되도록 보장
// AbortSignal.timeout은 구형 브라우저(Safari 16 미만 등)에 없으므로 가드 필수
apiClient.interceptors.request.use((config) => {
  if (!config.signal && typeof AbortSignal.timeout === "function") {
    config.signal = AbortSignal.timeout(REQUEST_TIMEOUT_MS);
  }
  return config;
});

export default apiClient;
