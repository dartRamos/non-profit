import { db } from "./config";
import { collection, getDocs } from "firebase/firestore";

const petitionSignupsRef = collection(db, "petition_signups");

export const signPetition = async (data: {
  firstName: string;
  lastName: string;
  email: string;
  postalCode?: string;
  actionId?: string;
}) => {
  const res = await fetch(
    "https://non-profit-ta9x.onrender.com/signup-action",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  const json = await res.json();

  if (!json.success) {
    throw new Error(json.error || "Petition signup failed");
  }

  return json;
};

export const getPetitionSignups = async () => {
  const snapshot = await getDocs(petitionSignupsRef);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};