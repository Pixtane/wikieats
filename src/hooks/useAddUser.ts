import { setDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase-config';
export const useAddUser = () => {
    const addUser = async (UID: string, email: string, name: string, photoURL: string) => { //email to private (by default)
        let userDocumentRef = doc(db, "users", UID);
        await setDoc(userDocumentRef, {
            name: name,
            logo: photoURL
        });

        let userPrivateDocumentRef = doc(db, "users", UID, "private", "user");
        await setDoc(userPrivateDocumentRef, {
            email: email
        })
    }
    return {addUser};
}