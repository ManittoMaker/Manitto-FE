import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";

const addUser = async (name) => {
  try {
    const usersRef = collection(db, "users");
    await addDoc(usersRef, {
      name,
      createdAt: new Date(),
    });
    console.log("User added successfully!");
  } catch (error) {
    console.error("Error adding user:", error);
  }
};

export default addUser;
