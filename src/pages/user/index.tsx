import BadgeList from "../../components/badgeList";
import BrandLogo from "../../components/brandLogo";
import SiteSearch from "../../components/siteSearch";
import UserProfile from "../../components/userProfile";

const User = () => {
  let gender = "female";
  return (
    <>
      <div className="navbar">
        <BrandLogo></BrandLogo>
        <SiteSearch></SiteSearch>
        <UserProfile></UserProfile>
      </div>
      <header className="hero">
        <div className="profile-picture">
          <div className="ppicture">
            <img src="" alt="" />
          </div>
          <div className={"genderBox color-" + gender}></div>
        </div>
        <section className="hero-content">
          <h1>TastyExplorer</h1>
          <BadgeList />
          <p>
            Culinary wanderer on a global flavor quest! 🌍 Vegetarian, dessert
            enthusiast, and recipe creator. Let's cook, share, and savor
            together! 🍲✨ #FoodieAdventures
          </p>
        </section>
      </header>
      <hr className="headerDivider" />
      <nav></nav>
      <aside></aside>
      <main></main>
      <footer></footer>
    </>
  );
};

export default User;
