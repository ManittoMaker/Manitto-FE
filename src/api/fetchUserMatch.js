import apiClient from "./apiClient";

// 개인 결과 조회 실패 코드별 안내 문구 (ManittoMaker/Manitto-FE#1, Manitto-BE#55)
const ERROR_MESSAGES = {
  [-306]:
    "이 그룹에 해당 이름으로 등록된 참여자가 없습니다. 리더가 등록한 이름과 같은지 확인해 주세요.",
  [-307]: "비밀번호가 다릅니다. 리더에게 받은 내 비밀번호를 입력해 주세요.",
};

// 서버가 원인을 구분해 주지 않을 때의 문구
// BE#55 배포 전에는 이름·비밀번호 중 무엇이 틀려도 -301(406)로 응답한다.
// TODO: BE#55 배포 후에는 -301이 "이 링크의 그룹에 매칭 결과가 없음"만 뜻하므로 전용 문구로 분리
const MISMATCH_MESSAGE = "이름 또는 비밀번호를 다시 확인해주세요.";

export const fetchUserMatch = async (groupId, name, password) => {
  try {
    const response = await apiClient.get(
      `/api/matches/${groupId}/result/user/${encodeURIComponent(name)}`,
      {
        params: { password },
      }
    );

    return response.data;
  } catch (error) {
    console.error("API 호출 중 오류 발생:", error);

    const status = error.response?.status;
    const code = error.response?.data?.code;

    if (ERROR_MESSAGES[code]) {
      return { success: false, code, message: ERROR_MESSAGES[code] };
    }

    // 406(조회 실패)·401(비밀번호 불일치)인데 위에 없는 코드면 입력값 확인을 안내
    if (status === 406 || status === 401) {
      return { success: false, code, message: MISMATCH_MESSAGE };
    }

    return {
      success: false,
      message: "알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
    };
  }
};
