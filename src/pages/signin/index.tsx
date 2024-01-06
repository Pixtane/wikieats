import { FormEvent, useState } from "react";
import { auth, provider } from "../../config/firebase-config";
import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";

import { useSaveAuthInfo } from "../../hooks/useSaveAuthInfo";
import useScreenSize from "../../hooks/useScreenSize";

import Alert from "../../components/alert";

import Logo from "../../assets/images/Logo.svg";
import GoogleLogo from "../../assets/images/google.svg";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { saveAuth } = useSaveAuthInfo();
  const [error, setError]: any = useState(null);

  const gotoAccountPage = (UID: string) => {
    window.location.href = `/user/${UID}`;
  };

  function firebaseErrorHandler(error: any) {
    if (error.message === "Firebase: Error (auth/invalid-email).") {
      setError("Please enter a valid email.");
    } else if (
      error.message === "Firebase: Error (auth/email-already-in-use)."
    ) {
      setError("Email already in use. Please sign in.");
    } else {
      setError("Something went wrong! " + error.message);
    }
    console.log(error, error.message);
  }

  const signInWithGoogle = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const results = await signInWithPopup(auth, provider);
      saveAuth(results);

      gotoAccountPage(results.user.uid);
    } catch (error: any) {
      firebaseErrorHandler(error);
    }
  };

  const signInWithEmail = async () => {
    if (!email || !password) {
      setError("Please fill in all the required fields.");
      return;
    }
    try {
      const results = await signInWithEmailAndPassword(auth, email, password);
      saveAuth(results);

      gotoAccountPage(results.user.uid);
    } catch (error: any) {
      firebaseErrorHandler(error);
    }
  };

  let screenSize = useScreenSize();
  let bgColors = [
    "bg-slate-200",
    "bg-rose-200",
    "bg-orange-100",
    "bg-green-100",
    "bg-amber-100",
    "bg-lime-100",
  ];
  const [randomColor, setRandomColor] = useState(
    bgColors[Math.floor(Math.random() * bgColors.length)]
  );
  return (
    <div
      className={`auth-page flex justify-center items-center ${randomColor} h-screen font-sans`}
    >
      {["xl", "2xl"].includes(screenSize) && (
        <>
          <div className="m-5">
            <img src={Logo} loading="lazy" />
          </div>
          <div className="w-80"></div>
        </>
      )}
      <div>
        <form className="flex flex-col gap-6 p-16 sm:rounded-md w-screen h-screen sm:min-w-[32rem] sm:w-auto sm:h-auto bg-white text-gray-800 shadow-lg">
          {!["xl", "2xl"].includes(screenSize) && (
            <div className="my-[-0.5rem]">
              <img className="w-28 unselectable" src={Logo} loading="lazy" />
            </div>
          )}
          <div className="text-3xl font-bold">Sign in your account</div>

          <button
            onClick={signInWithGoogle}
            className="rounded-full border-gray-200 border-2 w-[3rem] h-[3rem] self-center hover:bg-gray-600 transition-colors"
          >
            <img
              src={GoogleLogo}
              className="google-logo w-full h-full active:grayscale unselectable"
              loading="lazy"
            />
          </button>

          <div className="flex items-center">
            <hr className="flex-1" />
            <p className="mx-4 text-slate-700">Or</p>
            <hr className="flex-1" />
          </div>
          <div>
            <p className="font-bold">Sign in with email</p>
            <p>
              No account?{" "}
              <a className="text-blue-500 font-medium" href="/auth">
                Sign up
              </a>
            </p>
          </div>

          <div className="flex flex-col  min-w-full">
            <label className="text-slate-500 text-sm" htmlFor="emailBox">
              Email adress*
            </label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              className="transition-colors border-b hover:border-b-blue-300 focus:outline-none focus:border-b-blue-500 focus:border-b-2"
              type="email"
              id="emailBox"
              autoComplete="email"
            />
          </div>
          <div className="flex flex-col  min-w-full">
            <label className="text-slate-500 text-sm" htmlFor="passwordBox">
              Password*
            </label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              className="transition-colors border-b hover:border-b-blue-300 focus:outline-none focus:border-b-blue-500 focus:border-b-2"
              type="password"
              id="passwordBox"
              autoComplete="new-password"
            />
          </div>
          <button
            onClick={signInWithEmail}
            type="button"
            className="bg-blue-500 select-none shadow self-end px-4 text-white font-bold p-2 rounded-full hover:bg-opacity-90 active:bg-blue-600 transition-colors"
          >
            Continue
          </button>
        </form>
      </div>
      {error && (
        <Alert title="Error!" message={error} onClose={() => setError(null)} />
      )}
    </div>
  );
};

export default SignIn;
