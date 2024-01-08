import { useParams } from "react-router-dom";

import { getUserData } from "./hooks/getUserData";
import Navbar from "../../components/navbar";
import UserNavbar from "./components/UserNavbar";

import Star from "../../assets/images/star.svg";
import Dollar from "../../assets/images/dollar.svg";
import Calories from "../../assets/images/fire.svg";
import Time from "../../assets/images/time.svg";
import { toMultiline } from "../../hooks/useFirebaseMultiline";

const RecipeStat: any = (compare: any, value: any, icon: any) => {
  return (
    compare && (
      <div className="rating flex gap-1">
        <p className="font-bold">{value}</p>
        <img src={icon} className="unselectable" />
      </div>
    )
  );
};

const OReference = (obj: any) => {
  return obj.reference._key.path.segments;
};

const navigate = (path: string) => {
  console.log(path);
  window.location.href = window.location.origin + path;
};

const User = () => {
  const { UID } = useParams();
  if (!UID) {
    return <p>Error 404. To get user page enter /user/UID in URL</p>;
  }

  const { userData, genderColor, loading } = getUserData(
    UID,
    new Map<string, string[]>([
      ["extended", ["public", "extended"]],
      ["generated", ["public", "generated"]],
    ])
  );

  let { username, name, description, logo } = userData;
  //console.log("index got this: ", userData, genderColor, loading);
  username = name ? name : username; // Uses both username and name under username variable
  let UExtended = userData.extended;

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
                  className="top-0 bottom-0 left-0 right-0 object-cover min-h-full min-w-full m-auto"
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
                {toMultiline(description)}
              </section>
              <div className="h-[4.7rem] mb-[1.5rem] mt-[0.5rem] flex items-center">
                {UExtended &&
                  UExtended.diet &&
                  UExtended.diet.map(
                    (preferenceIdentity: any, index: number) => (
                      <span key={index} className="tag">
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
          <div className="flex justify-between">
            <main className="w-[65%]">
              <h1 className="font-medium mt-3 mb-1 ml-2 text-[#505050]">
                {UExtended
                  ? UExtended.recipies
                    ? "My Recipies"
                    : "No Recipies"
                  : "No Recipies"}
              </h1>
              {UExtended &&
                UExtended.recipies &&
                UExtended.recipies.map((recipe: any, index: number) => (
                  <div
                    className="recipe bg-[#FCFCFC] border border-[#D9D9D9] rounded-2xl mb-4 ml-2"
                    key={index}
                  >
                    <div className="flex flex-row">
                      <div className="p-4">
                        <h1
                          onClick={() =>
                            navigate(
                              `/${
                                OReference(recipe)[
                                  OReference(recipe).length - 2
                                ]
                              }/${
                                OReference(recipe)[
                                  OReference(recipe).length - 1
                                ]
                              }`
                            )
                          }
                          className="text-[#505050] text-2xl mb-1 font-medium hover:text-black hover:underline cursor-pointer"
                        >
                          {recipe.title}
                        </h1>
                        <p className="text-sm text-[#7C7C7C] mb-3">
                          {recipe.description}…
                        </p>

                        {recipe.tags.map((tag: any, index: number) => (
                          <span className="tag ">{tag}</span>
                        ))}
                      </div>
                      <aside className="flex flex-col items-end mt-4 m-2 p-1 px-2 pr-6 text-sm w-10">
                        {RecipeStat(recipe.rating, recipe.rating, Star)}
                        {RecipeStat(
                          recipe.price,
                          recipe.price.toFixed(2),
                          Dollar
                        )}
                        {RecipeStat(recipe.calories, recipe.calories, Calories)}
                        {RecipeStat(recipe.cookTime, recipe.cookTime, Time)}
                      </aside>
                    </div>
                    {recipe.image && (
                      <img
                        className="w-full h-52 object-cover rounded-b-2xl"
                        src={recipe.image}
                        alt={recipe.title}
                      />
                    )}
                  </div>

                  // You can customize the badge rendering as needed
                ))}
            </main>
            <aside className="w-[33.5%] mt-4">
              {UExtended && (
                <>
                  {UExtended.achievements && (
                    <div>
                      <h1 className="font-medium text-[#505050] ml-1">
                        Achievements
                      </h1>
                      <div className="flex flex-row justify-center bg-[#FCFCFC] border border-[#D9D9D9] rounded-xl h-32 px-4">
                        {UExtended.achievements.map(
                          (achievement: any, index: number) => (
                            <div
                              onClick={() =>
                                navigate(
                                  `/${
                                    OReference(achievement)[
                                      OReference(achievement).length - 2
                                    ]
                                  }/${
                                    OReference(achievement)[
                                      OReference(achievement).length - 1
                                    ]
                                  }`
                                )
                              }
                              key={index}
                              className="flex group mt-5 flex-col text-center items-center w-1/3 cursor-pointer hover:text-black hover:underline"
                            >
                              <img
                                className="w-[4rem] h-[4rem]"
                                src={achievement.image}
                                alt={achievement.title}
                              />
                              <h2 className="font-medium text-[#505050] text-sm">
                                {achievement.title}
                              </h2>
                              <span className="achievementTooltip group-hover:scale-100">
                                <h1>
                                  {achievement.title.charAt(0).toUpperCase() +
                                    achievement.title.slice(1)}
                                </h1>
                                <p>{achievement.description}</p>
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
                  {UExtended.friends && (
                    <div>
                      <h1 className="font-medium text-[#505050] ml-1">
                        Friends
                      </h1>
                      <div className="flex flex-row justify-center bg-[#FCFCFC] border border-[#D9D9D9] rounded-xl h-36 px-4">
                        {UExtended.friends.map((friend: any, index: number) => (
                          <div
                            onClick={() =>
                              navigate(
                                `/${
                                  OReference(friend)[
                                    OReference(friend).length - 2
                                  ]
                                }/${
                                  OReference(friend)[
                                    OReference(friend).length - 1
                                  ]
                                }`
                              )
                            }
                            key={index}
                            className="flex mt-5 flex-col text-center items-center w-1/3 cursor-pointer hover:text-black hover:underline"
                          >
                            <img
                              className="w-[4rem] h-[4rem] rounded-full object-cover border"
                              src={friend.image}
                              alt={friend.username}
                            />
                            <h2 className="font-medium text-[#505050] text-sm">
                              {friend.username}
                            </h2>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </aside>
          </div>
          <footer className="h-[10rem]"></footer>
        </div>
        <div className="w-full"></div>
      </div>
    </>
  );
};

export default User;
