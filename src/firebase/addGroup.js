import { query, addDoc, collection, where, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import { getRandomColorAnimal } from "../utils/password";

export const checkGroupDuplicate = async (groupName, leaderName) => {
  const groupRef = collection(db, "groups");
  const q = query(
    groupRef,
    where("groupName", "==", groupName),
    where("leaderName", "==", leaderName)
  );
  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
};

export const addGroupToFirestore = async (leaderName, groupName) => {
  const password = getRandomColorAnimal();
  try {
    const docRef = await addDoc(collection(db, "groups"), {
      leaderName,
      groupName,
      password,
      createdAt: new Date(),
    });

    return docRef.id;
  } catch (error) {
    console.error("Firestore에 그룹 추가 중 오류 발생:", error);
    throw new Error("그룹 생성 실패");
  }
};
