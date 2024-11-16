import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

const fetchMatchesFromFirestore = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "matches"));
    const results = [];
    querySnapshot.forEach((doc) => {
      results.push({ id: doc.id, ...doc.data() });
    });
    return results;
  } catch (error) {
    console.error("Error fetching documents: ", error);
    return [];
  }
};

export default fetchMatchesFromFirestore;
