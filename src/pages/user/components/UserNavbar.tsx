import { Link, useLocation } from "react-router-dom";

interface LinkItem {
  path: string;
  active: boolean;
}

const UserNavbar = () => {
  const location = useLocation();
  const badpath = location.pathname;
  console.log(badpath);

  const links: Record<string, LinkItem> = {
    overview: { path: "/overview", active: false },
    friends: { path: "/friends", active: false },
    saved: { path: "/saved", active: false },
    achievements: { path: "/achievements", active: false },
    settings: { path: "/settings", active: false },
  };

  //delete all links from path
  // Extract keys from the links object
  const keysToRemove = Object.keys(links);

  // Create a regular expression pattern to match the keys in the path
  const pattern = new RegExp(`/(?:${keysToRemove.join("|")})(?:/|$)`, "g");

  // Remove the matched keys from the path
  const path = badpath.replace(/\/$/, "").replace(pattern, "");

  console.log(path);

  const getActiveLink = () => {
    for (const key of Object.keys(links)) {
      const dynamicUrl = links[key].path;
      if (path.includes(dynamicUrl)) {
        links[key].active = true;
        return key;
      }
    }
    // If no match found, set "overview" as active by default
    links.overview.active = true;
    return "overview";
  };

  const activeLink = getActiveLink();
  console.log(activeLink);

  return (
    <div className="w-full flex items-center px-[0.25rem]">
      {Object.entries(links).map(([key, link]) => (
        <Link
          key={key}
          to={`${path}${link.path}`}
          className={`px-[0.625rem] h-10  font-[1.1rem] flex mt-1 transition-colors  duration-300  items-center ${
            link.active
              ? "activeNavBarItem"
              : "text-[#7C7C7C] hover:text-[#5C5C5C] hover:bg-gray-100 font-medium rounded-lg focus:bg-gray-200"
          }`}
        >
          {key.charAt(0).toUpperCase() + key.slice(1)}
        </Link>
      ))}
    </div>
  );
};

export default UserNavbar;
