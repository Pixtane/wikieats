import React from "react";
import SearchIcon from "../assets/images/Search.svg";

const siteSearch = () => {
  return (
    <div className="flex items-center">
      <img src={SearchIcon} className="absolute transform px-3 z-30" />
      <input
        type="text"
        placeholder="Search for a recipe"
        className="w-[20rem] lg:w-[40rem] placeholder:italic items-center text-xl placeholder:text-base bg-white p-1 px-3 pl-9 rounded-full border border-gray-300 transition-colors hover:border-gray-400 focus:border-gray-500 outline-none"
      />
    </div>
  );
};

export default siteSearch;
