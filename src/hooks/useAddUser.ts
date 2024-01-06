import { setDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase-config';
export const useAddUser = () => {
    const addUser = async (UID: string, email: string, name: string, photoURL: string) => { //email to private (by default)
        let userDocumentRef = doc(db, "users", UID);
        let userPrivateDocumentRef = doc(db, "users", UID, "private", "user");

        try {
            // Write user document
            await setDoc(userDocumentRef, {
              name: name,
              logo: photoURL
            });
      
            // Write private user document
            await setDoc(userPrivateDocumentRef, {
              email: email
            });
      
            // Return a promise that resolves when both documents are successfully written
            return Promise.resolve();
          } catch (error) {
            // Handle errors
            return Promise.reject(error);
          }
    }
    return {addUser};
}