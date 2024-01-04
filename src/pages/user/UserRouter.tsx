import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useParams,
} from "react-router-dom";
import User from ".";
import Friends from "./pages/Friends";
import Saved from "./pages/Saved";
import Achievements from "./pages/Achievements";
import Settings from "./pages/Settings";
import NotFound from "../NotFound/index";

const UserRouter = () => {
  return (
    <Routes>
      <Route path={``} element={<User />} />
      <Route path={`overview`} element={<User />} />
      <Route path={`friends`} element={<Friends />} />
      <Route path={`saved`} element={<Saved />} />
      <Route path={`achievements`} element={<Achievements />} />
      <Route path={`settings`} element={<Settings />} />
      <Route
        path="*"
        element={<NotFound linkPath={`/user/${useParams().UID}/`} />}
      />
    </Routes>
  );
};

export default UserRouter;
