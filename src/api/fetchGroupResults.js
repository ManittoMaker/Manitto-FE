import apiClient from "./apiClient";

// 리더용 그룹 결과 조회
// 조회 실패(4xx)는 예외로 던지지 않고 { success: false, code, message }로 반환해
// 호출부(CheckResultsPage)가 code별 안내 문구를 고를 수 있게 한다.
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

    // 서버는 실패 원인을 4xx 상태 + 본문의 code(음수)로 알려준다. (예: 406 + -400)
    // axios는 4xx도 예외로 던지므로, 여기서 본문을 꺼내 돌려줘야 code 분기가 동작한다.
    const status = error.response?.status;
    const data = error.response?.data;
    if (status >= 400 && status < 500 && typeof data?.code === "number") {
      return { success: false, code: data.code, message: data.message };
    }

    // 5xx·타임아웃·네트워크 단절은 호출부 catch에서 공통 오류 문구로 처리
    throw error;
  }
};
