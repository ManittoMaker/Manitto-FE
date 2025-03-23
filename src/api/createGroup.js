import useGroupStore from "../store/groupStore";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const createGroup = async (groupName, leaderName) => {
  try {
    const response = await fetch("https://jghs01.mooo.com:24101/api/groups", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        leaderName: leaderName,
        groupName: groupName,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.json();

      throw {
        code: response.status,
        message: errorBody?.message || "알 수 없는 오류입니다.",
      };
    }

    const data = await response.json();
    return data.result.groupId;
  } catch (err) {
    if (!err.code) {
      throw {
        code: 500,
        message: "서버에 연결할 수 없습니다.",
      };
    }
    throw err;
  }
};
