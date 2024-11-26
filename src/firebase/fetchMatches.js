import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "./firebase";

const fetchMatchesFromFirestore = async (groupId) => {
  try {
    const matchesRef = collection(db, "matches");
    const q = query(matchesRef, where("groupId", "==", groupId));
    const querySnapshot = await getDocs(q);

    const results = [];
    querySnapshot.forEach((doc) => {
      results.push({ id: doc.id, ...doc.data() });
    });

    return results;
  } catch (error) {
    console.error("Firestore에서 매칭 데이터 가져오기 중 오류 발생:", error);
    return [];
  }
};

export default fetchMatchesFromFirestore;
