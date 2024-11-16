import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";

const saveMatchesToFirestore = async (matches) => {
  try {
    const docRef = await addDoc(collection(db, "matches"), {
      matches,
      createdAt: new Date(),
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (error) {
    console.error("Error adding document: ", error);
  }
};

export default saveMatchesToFirestore;
