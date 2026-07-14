import apiClient from "./apiClient";

export const submitNames = async (groupId, names) => {
  try {
    const { data } = await apiClient.post(`/api/matches/${groupId}`, { names });

    if (!data.success) {
      // InputNamePage의 switch(error.code) 분기와 맞물리는 에러 형태 유지
      throw {
        code: data.code,
        message: data.message || "알 수 없는 오류",
      };
    }

    return data;
  } catch (error) {
    console.error("❌ 매칭 요청 중 오류 발생:", error);

    // axios 4xx/5xx 응답도 { code, message } 형태로 변환해 던짐
    if (error.response) {
      const data = error.response.data || {};
      throw {
        code: data.code || error.response.status,
        message: data.message || "알 수 없는 오류",
      };
    }
    // 타임아웃/네트워크 단절도 동일한 형태로 변환 (호출부 switch와 호환)
    if (error.code === "ECONNABORTED" || error.code === "ERR_CANCELED") {
      throw {
        code: -100,
        message: "서버가 응답하지 않습니다. 잠시 후 다시 시도해주세요.",
      };
    }
    throw error;
  }
};
