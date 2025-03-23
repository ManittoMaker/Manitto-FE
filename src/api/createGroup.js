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
    } else {
      throw {
        code: data.code || response.status,
        message: data.message || "알 수 없는 오류가 발생했습니다."
      };
    }
  } catch (error) {
    console.error("❌ 그룹 생성 중 오류 발생:", error.message || error);
    throw error;
  }
};
