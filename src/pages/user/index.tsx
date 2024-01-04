import { useParams } from "react-router-dom";

import { getUserData } from "./hooks/getData";
import Navbar from "../../components/navbar";
import UserNavbar from "../../pages/user/components/UserNavbar";

const User = () => {
  const { UID } = useParams();
  if (!UID) {
    return <p>Error 404. To get user page enter /user/UID in URL</p>;
  }
  let { userData, genderColor, loading } = getUserData(UID);
  let { username, description, logo } = userData;

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <Navbar />

      <div className="flex bg-white">
        <div className="w-full"></div>
        <div className=" w-[225rem] h-screen ">
          <div className="h-14"></div>
          <header className="hero flex flex-row justify-start">
            <div role="spacer" className="w-12"></div>
            <div className="profile-picture w-[12.5rem] flex flex-col justify-center items-center mb-8">
              <div className="ppicture w-[12.5rem] h-[12.5rem] rounded-full overflow-hidden relative mb-3">
                <img
                  className="top-0 bottom-0 left-0 right-0 object-cover  m-auto"
                  src={logo}
                  alt={`${username}'s profile`}
                />
              </div>
              <div
                className={`genderBox ${genderColor} w-[3.1rem] h-[10px] rounded-full`}
              ></div>
            </div>
            <div role="spacer" className="w-[1.25rem]"></div>
            <section className="w-[32rem] flex flex-col">
              <div className="h-full"></div>
              <section className="hero-content flex flex-row gap-3 items-center">
                <h1 className="font-bold text-[2rem] leading-[2.75rem]">
                  {username}
                </h1>
                <div className="badges h-[1.625rem] flex flex-row">
                  {userData.generated &&
                    userData.generated.badges &&
                    userData.generated.badges.map(
                      (badge: any, index: number) => (
                        <span
                          key={index}
                          className="w-[1.625rem] h-[1.625rem] group"
                        >
                          <img
                            className="w-full h-full unselectable"
                            src={badge.logo}
                            alt={badge.title}
                          />
                          <span className="badgeTooltip group-hover:scale-100">
                            <h1>
                              {badge.title.charAt(0).toUpperCase() +
                                badge.title.slice(1)}
                            </h1>
                            <p>{badge.description}</p>
                          </span>
                        </span>

                        // You can customize the badge rendering as needed
                      )
                    )}
                </div>
              </section>
              <section className="mt-2 text-[#7C7C7C] font-medium text-[0.95rem] leading-5">
                {description}
              </section>
              <div className="h-[4.7rem] mb-[1.5rem] mt-[0.5rem] flex items-center">
                {userData.extended &&
                  userData.extended.diet &&
                  userData.extended.diet.map(
                    (preferenceIdentity: any, index: number) => (
                      <span
                        key={index}
                        className="h-[1.625rem] cursor-context-menu rounded-md p-[0.2rem] px-2 mr-1 text-[#7C7C7C] hover:bg-[#E2E2E2] transition-colors font-medium text-sm bg-[#F2F2F2]"
                      >
                        {preferenceIdentity.charAt(0).toUpperCase() +
                          preferenceIdentity.slice(1)}
                      </span>

                      // You can customize the badge rendering as needed
                    )
                  )}
              </div>
            </section>
          </header>
          <hr className="headerDivider bg-[#D9D9D9] h-[1px] border-none" />
          <nav>
            <UserNavbar></UserNavbar>
          </nav>
          <aside></aside>
          <main></main>
          <footer></footer>
        </div>
        <div className="w-full"></div>
      </div>
    </>
  );
};

export default User;
