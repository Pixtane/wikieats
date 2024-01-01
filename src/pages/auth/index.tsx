import { FormEvent, useState } from "react";
import { auth, provider } from "../../config/firebase-config";
import { signInWithPopup, createUserWithEmailAndPassword } from "firebase/auth";
import { useSaveAuthInfo } from "../../hooks/useSaveAuthInfo";
import { useAddUser } from "../../hooks/useAddUser";
import useResize from "../../hooks/useResize";
import GoogleLogo from "../../assets/images/google-logo.png";
import "../../styles/styles.css";

const Auth = () => {
  const { width, height } = useResize(50, "height", 205, 261);
  console.log(width, height);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { saveAuth } = useSaveAuthInfo();
  const { addUser } = useAddUser();

  const signInWithGoogle = async (e: FormEvent) => {
    e.preventDefault();
    const results = await signInWithPopup(auth, provider);
    saveAuth(results);
    addUser(
      results.user.uid,
      results.user.email ? results.user.email : "",
      results.user.displayName ? results.user.displayName : "Unnamed User",
      results.user.photoURL
        ? results.user.photoURL
        : "https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-541.jpg"
    );
  };

  const signInWithEmail = async () => {
    const results = await createUserWithEmailAndPassword(auth, email, password);
    saveAuth(results);
    addUser(
      results.user.uid,
      email,
      "Unnamed User",
      "https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-541.jpg"
    );
  };

  return (
    <div className="login-page" style={{ transform: `scale(${height})` }}>
      <form>
        <p>Sign in with Email</p>
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="login-with-email-btn"
          type="button"
          onClick={signInWithEmail}
        >
          Sign in
        </button>
      </form>
      <form className="google-login">
        <p>OR</p>
        <button
          className="login-with-google-btn"
          type="button"
          onClick={signInWithGoogle}
        >
          <img src={GoogleLogo} className="google-logo" loading="lazy" />
          <span>Continue with Google</span>
        </button>
      </form>
    </div>
  );
};

export default Auth;
