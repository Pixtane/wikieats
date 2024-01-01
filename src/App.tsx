import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/landing/index";
import Auth from "./pages/auth/index";
import User from "./pages/user/index";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/user/*" element={<User />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
