import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";

const addMatch = async (giver, receiver, password) => {
  try {
    const matchesRef = collection(db, "matches");
    await addDoc(matchesRef, {
      giver,
      receiver,
      password,
      createdAt: new Date(),
    });
    console.log("Match added successfully!");
  } catch (error) {
    console.error("Error adding match:", error);
  }
};

export default addMatch;
