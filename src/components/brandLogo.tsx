import React from "react";
import Logo from "../assets/images/Logo.svg";

const brandLogo = () => {
  return (
    <img
      src={Logo}
      className="unselectable hover:opacity-95 active:opacity-90 h-full"
      onClick={() => (window.location.href = "/")}
      loading="lazy"
    />
  );
};

export default brandLogo;
