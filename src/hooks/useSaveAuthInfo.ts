export const useSaveAuthInfo = () => {

    const saveAuth = (results: any) => {
        console.log("results124", results);
        localStorage.setItem('auth', JSON.stringify(results));
    }
    return { saveAuth }
}