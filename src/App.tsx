import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/landing/index";
import Auth from "./pages/auth/index";
import UserRouter from "./pages/user/UserRouter";
import NotFound from "./pages/NotFound";
import SignIn from "./pages/signin/index";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/user/:UID/*" element={<UserRouter />} />
          <Route path="*" element={<NotFound linkPath={`/`} />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
