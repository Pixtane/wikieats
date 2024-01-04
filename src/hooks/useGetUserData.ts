import { useEffect, useState } from "react";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../config/firebase-config";

export const useGetUserData = (UID: string, options: { extended?: boolean, generated?: boolean } = { extended: false, generated: false }) => {
  const [userData, setUserData]: any = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userRef = doc(db, "users", UID);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          let userDataResult = { ...userDoc.data() };

          if (options.extended) {
            const extendedRef = doc(db, "users", UID, "public", "extended");
            const extendedDoc = await getDoc(extendedRef);

            if (extendedDoc.exists()) {
              userDataResult = { ...userDataResult, extended: extendedDoc.data() };
              console.log("Extended user data:", extendedDoc.data());
            } else {
              console.log("Extended user data not found");
            }
          }

          if (options.generated) {
            const generatedRef = doc(db, "users", UID, "public", "generated");
            const generatedDoc = await getDoc(generatedRef);

            if (generatedDoc.exists()) {
              userDataResult = { ...userDataResult, generated: generatedDoc.data() };
              console.log("Generated user data:", generatedDoc.data());
            } else {
              console.log("Generated user data not found");
            }
          }

          setUserData(userDataResult);
          console.log("User data:", userDataResult);
        } else {
          console.log("User not found");
          window.location.href = "/NoUserFound";
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [UID, options.extended, options.generated]);

  return { userData, loading };
};
