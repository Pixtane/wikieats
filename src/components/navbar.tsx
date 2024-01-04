import BrandLogo from "./brandLogo";
import SiteSearch from "./siteSearch";
import UserProfile from "./userProfile";

const Navbar = () => {
  return (
    <div className="navbar flex items-center justify-between w-screen h-12 fixed bg-[#FCFCFC] border-b z-40">
      <div className="h-[65%] ml-2 cursor-pointer">
        <BrandLogo />
      </div>
      <div className="cursor-text flex justify-center">
        <SiteSearch />
      </div>
      <div className="h-full cursor-pointer flex items-center">
        <UserProfile />
      </div>
    </div>
  );
};

export default Navbar;
