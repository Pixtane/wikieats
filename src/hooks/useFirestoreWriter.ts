// Import necessary packages
import { useEffect, useState } from "react";
import { writeBatch, doc, collection } from "firebase/firestore";
import { db } from "../config/firebase-config";

// Define types for the arguments
type FirestoreData = Array<Map<Array<string>, any>>;

/**
 * Custom React hook for writing data to Firestore in batches.
 * @param data - An array of maps representing data to be written to Firestore.
 * @returns Object containing state variables isWriting and error.
 */
const useFirestoreWriter = (data: FirestoreData) => {
  //const [isWriting, setIsWriting] = useState(false);
  //const [error, setError] = useState<string | null>(null);

  console.log(data);

  //useEffect(() => {
  const writeToFirestore = async () => {
    //setIsWriting(true);
    //setError(null);

    try {
      const batch = writeBatch(db);

      // Iterate over each document in the array
      data.forEach((document) => {
        // Iterate over each key-value pair in the map
        document.forEach((value, path) => {
          console.log(data, document, value, path);
          const collectionRef = collection(db, path[0]);
          const documentRef = doc(collectionRef, ...path.slice(1));
          console.log(
            batch,
            data,
            document,
            value,
            path,
            collectionRef,
            documentRef
          );
          batch.set(documentRef, value, { merge: true });
        });
      });
      const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
      await sleep(5000);

      // Commit the batch write
      await batch.commit();

      //setIsWriting(false);
    } catch (err) {
      console.error("Error writing to Firestore:", err);
      //setError("Error writing to Firestore");
      //setIsWriting(false);
    }
  };

  // Check if there is data to write
  if (data.length > 0) {
    writeToFirestore();
  }
  //}, [data]);

  //return { isWriting, error };
};

export default useFirestoreWriter;
