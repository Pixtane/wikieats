import { useParams } from "react-router-dom";
import Navbar from "../../../components/navbar";
import FileDropper from "../../../components/FileDropper";
import ClickToCopy from "../../../components/clickToCopy";
import EditableField from "../../../components/editableField";
import { useEffect, useRef, useState } from "react";
import { getUserData } from "../hooks/getUserData";

import { toMultiline } from "../../../hooks/useFirebaseMultiline";

import * as _ from "lodash";
import useFirestoreWriter from "../../../hooks/useFirestoreWriter";
import { Timestamp } from "firebase/firestore";
import axios from "axios";

function pruneEmpty(obj: any) {
  return (function prune(current) {
    _.forOwn(current, function (value: any, key: string | number) {
      if (
        _.isUndefined(value) ||
        _.isNull(value) ||
        _.isNaN(value) ||
        (_.isString(value) && _.isEmpty(value)) ||
        (_.isObject(value) && _.isEmpty(prune(value)))
      ) {
        delete current[key];
      }
    });
    // remove any leftover undefined values from the delete
    // operation on an array
    if (_.isArray(current)) _.pull(current, undefined);

    return current;
  })(_.cloneDeep(obj)); // Do not modify the original object, create a clone instead
}

const Settings = () => {
  //#region auth checks
  const auth = localStorage.getItem("auth");
  if (!auth) {
    return <div>Access denied: Unauthorized</div>;
  }
  const UUID = JSON.parse(auth).user.uid;
  const { UID } = useParams();

  if (!UID) {
    return (
      <div className="items-center justify-center h-screen flex flex-col">
        <p className="font-bold text-xl">
          Error 404. UID is not defined in url.
        </p>
        Your UID: {UUID}
      </div>
    );
  }

  if (UID !== UUID) {
    return (
      <div className="items-center justify-center h-screen flex flex-col">
        <p className="font-bold text-xl">Access denied: Unauthorized</p>
        Your UID: {UUID}
      </div>
    );
  }
  //#endregion

  //#region get user data

  const updateUserField = (fieldName: string, data: any, path?: string[]) => {
    console.log("trying to update", fieldName, data, path);
    setUserState((prevUserState) => {
      if (!path || path.length === 0) {
        // If no path is provided or it's empty, update the top-level field
        console.log("No path provided, updating top-level field", {
          ...prevUserState,
          [fieldName]: data,
        });
        return {
          ...prevUserState,
          [fieldName]: data,
        };
      }

      // For nested fields, traverse the path and update the last field
      let newState = { ...prevUserState };
      let currentLevel: any = newState;

      for (let i = 0; i < path.length - 1; i++) {
        if (!currentLevel[path[i]]) {
          currentLevel[path[i]] = {};
        }
        currentLevel = currentLevel[path[i]];
      }
      console.log("Path provided. ", currentLevel, path, data, newState);

      currentLevel[path[path.length - 1]] = data;

      return newState;
    });
  };

  let { userData, loading } = getUserData(
    UUID,
    new Map([
      ["public", ["public", "extended"]],
      ["private", ["private", "user"]],
    ])
  );

  const handleSaveChanges = () => {
    setIsSaving((prev) => {
      return {
        ...prev,
        is: true,
        error:
          "After saving, please wait a few minutes before refreshing the page, so the data can load.",
      };
    });
    console.log("isSaving: ", isSaving);
    console.log("Saving changes");
    console.log("New data: ", userState);
    let savingData = pruneEmpty(userState);
    if (
      savingData.private &&
      savingData.private.preferences &&
      typeof savingData.private.preferences === "string"
    ) {
      savingData.private.preferences =
        savingData.private.preferences.split(",");
    }
    if (
      savingData.public &&
      savingData.public.diet &&
      typeof savingData.private.preferences === "string"
    ) {
      savingData.public.diet = savingData.public.diet.split(",");
    }
    if (savingData.public.birth) {
      // Split the date string into year, month, and day components
      const [year, month, day] = savingData.public.birth.split("-");

      // Create a new Date object using the components
      const dateObject = new Date(year, month - 1, day);

      // Convert the Date object to a Firestore Timestamp
      const firestoreTimestamp = Timestamp.fromDate(dateObject);
      savingData.public.birth = firestoreTimestamp;

      setIsSaving((prev) => {
        return { ...prev, is: true };
      });
    }

    let privateUserData = savingData.private;
    let extendedData = savingData.public;
    let baseData: any = {
      username: savingData.username ? savingData.username : savingData.name,
      description: savingData.description,
      logo: savingData.logo,
    };
    console.log("Clean new data: ", privateUserData, extendedData, baseData);

    type FirestoreData = Array<Map<Array<string>, any>>;
    const dataToWrite: FirestoreData = [
      new Map([[["users", UID, "private", "user"], privateUserData]]),
      new Map([[["users", UID, "public", "extended"], extendedData]]),
      new Map([[["users", UID], baseData]]),
    ];

    useFirestoreWriter(dataToWrite);

    userData = userState;

    setIsSaving((prev) => {
      return {
        ...prev,
        is: false,
      };
    });
  };

  const [userState, setUserState] = useState({
    username: "",
    name: "",
    description: "",
    logo: "",
    thumbnail: "",
    private: {
      email: "",
      name: "",
      preferences: [""],
    },
    public: {
      birth: "",
      gender: "",
      diet: [""],
    },
  }); // Initialize userData state

  // Update userData state with the initial data from the API
  useEffect(() => {
    if (JSON.stringify(userState) !== JSON.stringify(userData)) {
      if (userData.public && userData.public.birth) {
        const date = new Date(userData.public.birth.seconds * 1000);

        // Extract date components
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        // Format the date as YYYY-MM-DD
        const formattedDate = `${year}-${month}-${day}`;
        userData.public.birth = formattedDate;
      }

      setUserState(userData);
    }
  }, [userData]);

  //console.log(userData, loading, userState);

  //#endregion

  const handleImageUpload = async (file: File) => {
    try {
      const apiKey = import.meta.env.VITE_IMGBB_API_KEY;

      const formData = new FormData();
      formData.append("image", file);

      const response = await axios.post(
        "https://api.imgbb.com/1/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          params: {
            key: apiKey,
          },
        }
      );

      console.log(response.data.data);
      updateUserField("logo", response.data.data.url);
      updateUserField("thumbnail", response.data.data.thumb.url);
      // Handle the response as needed (e.g., store the URL in your state)
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const [imageDropper, setImageDropper] = useState(false);
  const [avatar, setAvatar] = useState("");
  const [isSaving, setIsSaving] = useState<{
    is: boolean;
    error: string | null;
    isWriting: boolean;
  }>({ is: false, error: "", isWriting: false });

  const useFileDrop = () => {
    setImageDropper(true);
  };

  return (
    <div className="bg-white flex flex-col items-center">
      <Navbar></Navbar>
      <div role="spacer" className="h-12"></div>
      <main className=" w-[58rem] flex flex-col">
        <div className="w-full mt-4 mb-1 text-xl flex justify-center font-bold">
          Settings
        </div>
        <div className="w-full flex justify-center">
          <ClickToCopy copyText={UID} innerText={"UID: " + UID} />
        </div>
        <div>
          <div className="flex gap-8">
            <div className="avatar w-32 h-32 max-w-32 min-h-32 group">
              <img
                className="rounded-2xl object-cover cursor-pointer min-h-full min-w-full outline outline-2 outline-gray-200"
                src={avatar ? avatar : userState?.logo}
                alt=""
                onClick={useFileDrop}
              />

              {imageDropper && (
                <FileDropper
                  title="Image"
                  URLwriter={(data) => {
                    updateUserField("logo", data);
                    setAvatar(data);
                  }}
                  closeFileDropper={() => {
                    setImageDropper(false);
                  }}
                  onFileUpload={(file) => {
                    console.log(file);
                    setAvatar(URL.createObjectURL(file));
                    handleImageUpload(file);
                  }}
                />
              )}
            </div>
            <div className="flex flex-col justify-end w-[30rem]">
              <label className="text-gray-500">Username</label>
              <div className="font-bold text-2xl mb-2">
                <EditableField
                  placeholder={
                    userState?.name ? userState?.name : userState?.username
                  }
                  inputType="text"
                  onSave={(data) => {
                    updateUserField("username", data);
                  }}
                  onCancel={() => {}}
                  multiline={false}
                />
              </div>
              <label className="text-gray-500">Description</label>
              <div className="font-medium text-lg">
                <EditableField
                  placeholder={toMultiline(userState?.description)}
                  inputType="text"
                  onSave={(data) => {
                    updateUserField("description", data);
                  }}
                  onCancel={() => {}}
                  multiline={true}
                />
              </div>
            </div>
          </div>
          <div>
            <label className="text-gray-500">Email</label>
            <div className="font-medium text-xl mb-2">
              <EditableField
                placeholder={userState?.private ? userState?.private.email : ""}
                inputType="email"
                onSave={(data) => {
                  updateUserField("email", data, ["private", "email"]);
                }}
                onCancel={() => {}}
                multiline={false}
              />
            </div>
          </div>
          <div>
            <label className="text-gray-500">Name</label>
            <div className="font-medium text-xl mb-2">
              <EditableField
                placeholder={userState?.private ? userState?.private.name : ""}
                inputType="text"
                onSave={(data) => {
                  updateUserField("name", data, ["private", "name"]);
                }}
                onCancel={() => {}}
                multiline={false}
              />
            </div>
          </div>
          <div>
            <label className="text-gray-500">Birthday</label>
            <div className="font-medium text-xl mb-2">
              <EditableField
                placeholder={userState?.public ? userState?.public.birth : ""}
                inputType="date"
                onSave={(data) => {
                  updateUserField("birth", data, ["public", "birth"]);
                }}
                onCancel={() => {}}
                multiline={false}
              />
            </div>
          </div>
          <div>
            <label className="text-gray-500">Gender</label>
            <div className="font-medium text-xl mb-2">
              <EditableField
                placeholder={userState?.public ? userState?.public.gender : ""}
                inputType="select"
                optionsList={["Male", "Female", "Unspecified"]}
                onSave={(data) => {
                  updateUserField("gender", data, ["public", "gender"]);
                }}
                onCancel={() => {}}
                multiline={false}
              />
            </div>
          </div>
          <div>
            <label className="text-gray-500">Diet</label>
            <div className="font-medium text-xl mb-2">
              <EditableField
                placeholder={
                  userState?.public
                    ? userState?.public.diet
                      ? userState?.public.diet.length > 0
                        ? userState?.public.diet.toString()
                        : ""
                      : ""
                    : ""
                }
                inputType="select"
                selectMultiple={true}
                optionsList={[
                  "None",
                  "Vegeterian",
                  "Vegan",
                  "Soy-free",
                  "Gluten-free",
                ]}
                onSave={(data) => {
                  updateUserField("diet", data, ["public", "diet"]);
                }}
                onCancel={() => {}}
                multiline={false}
              />
            </div>
          </div>
          <div>
            <label className="text-gray-500">Preferences</label>
            <div className="font-medium text-xl mb-2">
              <EditableField
                placeholder={
                  userState?.private
                    ? userState?.private.preferences
                      ? userState?.private.preferences.length > 0
                        ? userState?.private.preferences.toString()
                        : ""
                      : ""
                    : ""
                }
                inputType="select"
                selectMultiple={true}
                optionsList={[
                  "Nothing",
                  "Italian",
                  "Mexican",
                  "African",
                  "European",
                  "Ukrainian",
                ]}
                onSave={(data) => {
                  updateUserField("preferences", data, [
                    "private",
                    "preferences",
                  ]);
                }}
                onCancel={() => {}}
                multiline={false}
              />
            </div>
          </div>
          <div className="">
            <button
              className={`w-full rounded-lg font-bold text-lg transition-colors ${
                userData === userState
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-green-400 hover:bg-green-500 active:bg-green-300"
              } flex justify-center p-3`}
              disabled={userData === userState}
              onClick={handleSaveChanges}
            >
              Save changes
            </button>
          </div>
          <div
            className={`saving fixed left-1/2 transform -translate-x-1/2 bottom-10 cursor-auto font-normal bg-gray-200 border transition-transform origin-bottom border-gray-400 rounded-xl w-96 p-4 flex flex-col justify-center items-center ${
              isSaving.error !== "" ? "scale-100" : " scale-0"
            } `}
          >
            <div className="">
              <button
                className="cursor-pointer absolute top-3 left-5    font-black text-gray-700 hover:text-red-600 transition-colors"
                onClick={() =>
                  setIsSaving((prev) => {
                    console.log(prev, { ...prev, error: "" });
                    return { ...prev, error: "" };
                  })
                }
              >
                ✕
              </button>
              <span className="font-bold">Attention!</span>
            </div>
            <span className="text-center">{isSaving.error}</span>
          </div>
        </div>
        <div className="extra">
          <div
            className={`saving fixed bottom-10 right-10 bg-gray-200 border transition-transform origin-bottom-right border-gray-400 rounded-xl w-48 p-4 flex gap-3 font-bold ${
              isSaving.is ? "scale-100" : " scale-0"
            } `}
          >
            <button
              onClick={() =>
                setIsSaving((prev) => {
                  console.log(prev, { ...prev, is: false });
                  return { ...prev, is: false };
                })
              }
              className="font-black text-gray-700 hover:text-red-600 transition-colors"
            >
              ✕
            </button>
            Saving...
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
