const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const submitNames = async (groupId, names) => {
  try {
    const response = await fetch(`${BASE_URL}/api/matches/${groupId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ names }),
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      throw {
        code: data.code || response.status,
        message: data.message || "알 수 없는 오류",
      };
    }

    return data; 
  } catch (error) {
    console.error("❌ 매칭 요청 중 오류 발생:", error);
    throw error;
  }
};
