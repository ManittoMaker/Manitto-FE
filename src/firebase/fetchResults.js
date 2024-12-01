import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "./firebase";

const fetchResultsFromFirestore = async (leaderName, groupName, password) => {
  try {
    const groupsRef = collection(db, "groups");
    const groupQuery = query(
      groupsRef,
      where("leaderName", "==", leaderName),
      where("groupName", "==", groupName),
      where("password", "==", password)
    );
    const groupSnapshot = await getDocs(groupQuery);

    if (groupSnapshot.empty) {
      console.log("No matching group found");
      return [];
    }

    const matchesResults = [];
    for (const groupDoc of groupSnapshot.docs) {
      const matchesRef = collection(db, "matches");
      const matchesQuery = query(
        matchesRef,
        where("groupId", "==", groupDoc.id)
      );
      const matchesSnapshot = await getDocs(matchesQuery);

      matchesSnapshot.forEach((matchDoc) => {
        matchesResults.push({
          groupId: groupDoc.id,
          ...matchDoc.data(),
        });
      });
    }

    return matchesResults;
  } catch (error) {
    console.error("Firestore에서 결과 조회 실패:", error);
    throw new Error("결과를 불러오는 데 실패했습니다.");
  }
};

export default fetchResultsFromFirestore;
