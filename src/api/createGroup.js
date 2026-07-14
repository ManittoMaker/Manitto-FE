import apiClient from "./apiClient";
import useGroupStore from "../store/groupStore";

export const createGroup = async (groupName, leaderName) => {
  const { setGroupInfo } = useGroupStore.getState();

  try {
    const { data } = await apiClient.post("/api/groups", {
      groupName,
      leaderName,
    });

    if (data.success && data.result) {
      const { groupId, groupName, leaderName, password } = data.result;

      setGroupInfo({
        groupId,
        groupName,
        leaderName,
        groupPassword: password,
      });
      return groupId;
    }
    throw new Error(`API 오류: ${data.message}`);
  } catch (error) {
    console.error("❌ 그룹 생성 중 오류 발생:", error.message);

    // axios는 4xx/5xx 응답도 여기로 들어오므로 상태코드별 메시지로 변환
    const status = error.response?.status;
    const serverMessage = error.response?.data?.message;

    if (status === 406) throw new Error("그룹이 존재하지 않습니다.");
    if (status === 422) throw new Error(`입력 값 오류: ${serverMessage}`);
    if (error.code === "ECONNABORTED" || error.code === "ERR_CANCELED") {
      throw new Error("서버가 응답하지 않습니다. 잠시 후 다시 시도해주세요.");
    }
    // 기타 HTTP 에러도 사용자에게 영어 원문 대신 한국어 메시지로 노출
    if (error.response) {
      throw new Error(`API 오류: ${serverMessage || "잠시 후 다시 시도해주세요."}`);
    }
    throw error;
  }
};
