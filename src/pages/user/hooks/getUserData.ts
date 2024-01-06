import { useGetUserData } from "../../../hooks/useGetUserData";
type TGenders = "female" | "male" | "undefined";
export function getUserData(
  UID: string,
  additionalData: Map<string, string[]>
) {
  const { userData, loading } = useGetUserData(UID, additionalData);
  const extended = userData?.extended;

  //console.log(userData, ["public/extended", "public/generated"]);

  if (!userData || Object.keys(userData).length === 0) {
    return {
      userData: {},
      genderColor: "bg-gray-400",
      loading,
    };
  }
  const genders = {
    female: "bg-[#F28CD9]",
    male: "bg-blue-500",
    undefined: "bg-gray-400",
  };
  let genderColor: string = genders["undefined"];
  if (extended) {
    if (extended && extended.gender) {
      genderColor = (extended.gender as TGenders)
        ? genders[extended.gender as TGenders]
        : genders["undefined"];
      //console.log(extended.gender);
    }
  }
  return {
    userData,
    genderColor,
    loading,
  };
}
