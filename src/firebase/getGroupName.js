import { db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";

const getGroupDetailsFromFirestore = async (groupId) => {
  const docRef = doc(db, "groups", groupId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    return {
      groupName: data.groupName,
      leaderName: data.leaderName,
      password: data.password,
    };
  } else {
    return { groupName: "", leaderName: "", password: "" };
  }
};

export default getGroupDetailsFromFirestore;
