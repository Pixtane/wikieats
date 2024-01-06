import { useEffect, useMemo, useState } from "react";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../config/firebase-config";

export const useGetUserData = (
  UID: string,
  rawadditionalData: Map<string, string[]>
) => {
  const [userData, setUserData]: any = useState({});
  const [loading, setLoading] = useState(true);

  const additionalData = useMemo(() => rawadditionalData, [rawadditionalData]);

  useEffect(() => {
    console.log("USEFFECT: additionalData: ", additionalData, ", UID: ", UID);
    const fetchUserData = async () => {
      try {
        const userRef = doc(db, "users", UID);
        const userDoc = await getDoc(userRef);

        let userDataResult = { ...userDoc.data() };

        if (!userDoc.exists()) {
          console.log("User not found");
          window.location.href = window.location.href + "/NoUserFound";
        }

        if (additionalData && additionalData.size > 0) {
          const additionalDataPromises = await Promise.all(
            Array.from(additionalData.entries()).map(async ([key, data]) => {
              const additionalDataRef = doc(db, "users", UID, ...data);
              const additionalDataDoc = await getDoc(additionalDataRef);
              if (additionalDataDoc.exists()) {
                userDataResult = {
                  ...userDataResult,
                  [key]: additionalDataDoc.data(),
                };
                //console.log("additionalDataDoc.data()",additionalDataDoc.data(),", key: ",key,"userDataResult: ",userDataResult);
              }
              //return { [data[data.length - 1]]: additionalDataDoc.data() };
              // return { [key]: additionalDataDoc.data() };
            })
          );

          //return Promise.all(additionalDataPromises);
          console.log("All files found: ", userDataResult);
          setUserData(userDataResult);
        } else {
          console.log("Additional data not requested: ", userDataResult);
          setUserData(userDataResult);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []); //[UID, additionalData]);

  return { userData, loading };
};
