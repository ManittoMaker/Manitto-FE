import useGroupStore from "../store/groupStore";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const createGroup = async (groupName, leaderName) => {
  const { setGroupInfo } = useGroupStore.getState();

  try {
    const response = await fetch(`${BASE_URL}/api/groups`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ groupName, leaderName }),
    });

    const data = await response.json();

    if (response.status === 200 && data.success) {
      const { groupId, groupName, leaderName, password } = data.result;

      setGroupInfo({
        groupId,
        groupName,
        leaderName,
        groupPassword: password,
      });
      return groupId;
    } else if (response.status === 406) {
      throw new Error("그룹이 존재하지 않습니다.");
    } else if (response.status === 422) {
      throw new Error(`입력 값 오류: ${data.message}`);
    } else {
      throw new Error(`API 오류: ${data.message}`);
    }
  } catch (error) {
    console.error("❌ 그룹 생성 중 오류 발생:", error.message);
    throw error;
  }
};
