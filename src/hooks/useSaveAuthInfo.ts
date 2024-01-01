export const useSaveAuthInfo = () => {

    const saveAuth = (results: any) => {
        const authInfo = {
            userID: results.user.uid,
            email: results.user.email,
            name: results.user.displayName,
            photoURL: results.user.photoURL,
            isAuth: true,
        };
        localStorage.setItem('auth', JSON.stringify(authInfo));
    }
    return { saveAuth }
}