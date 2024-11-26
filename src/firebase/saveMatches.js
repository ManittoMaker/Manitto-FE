import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";

const saveMatchesToFirestore = async (matches, groupId) => {
  try {
    await addDoc(collection(db, "matches"), {
      groupId,
      matches,
      createdAt: new Date(),
    });
    console.log("매칭 결과가 성공적으로 저장되었습니다.");
  } catch (error) {
    console.error("Firestore에 매칭 결과 저장 중 오류 발생:", error);
  }
};

export default saveMatchesToFirestore;
