import React from "react";
import { useParams } from "react-router-dom";

const userProfile = () => {
  const { UID } = useParams();
  return (
    <img
      className="h-[80%] mr-2 rounded-full"
      src="https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-541.jpg"
      alt=""
      loading="lazy"
      onClick={() => (window.location.href = `/user/${UID}`)}
    />
  );
};

export default userProfile;
