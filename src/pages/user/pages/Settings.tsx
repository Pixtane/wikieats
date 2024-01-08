import { useParams } from "react-router-dom";
import Navbar from "../../../components/navbar";
import FileDropper from "../../../components/FileDropper";
import ClickToCopy from "../../../components/clickToCopy";
import EditableField from "../../../components/editableField";
import { useEffect, useRef, useState } from "react";
import { getUserData } from "../hooks/getUserData";

import { toMultiline } from "../../../hooks/useFirebaseMultiline";

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
        console.log("No path provided, updating top-level field");
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

  const { userData, loading } = getUserData(
    UUID,
    new Map([
      ["extended", ["public", "extended"]],
      ["private", ["private", "user"]],
    ])
  );

  const [userState, setUserState] = useState({
    username: "",
    name: "",
    description: "",
    logo: "",
    private: {
      email: "",
      name: "",
    },
    public: {
      birth: "",
      gender: "",
      diet: [""],
    },
  }); // Initialize userData state

  // Update userData state with the initial data from the API
  useEffect(() => {
    if (userState != userData) {
      setUserState(userData);
    }
  }, [userData]);

  //console.log(userData, loading, userState);

  //#endregion

  const [imageDropper, setImageDropper] = useState(false);
  const [avatar, setAvatar] = useState("");

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
                  closeFileDropper={() => {
                    setImageDropper(false);
                  }}
                  onFileUpload={(file) => {
                    console.log(file);
                    setAvatar(URL.createObjectURL(file));
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
                    updateUserField("name", data);
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
                optionsList={["Vegeterian", "Vegan", "Soy-free", "Gluten-free"]}
                onSave={(data) => {
                  updateUserField("diet", data, ["public", "diet"]);
                }}
                onCancel={() => {}}
                multiline={false}
              />
            </div>
          </div>
          <div>
            <label className="text-gray-500">Location</label>
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
        </div>
      </main>

      <div className="extra"></div>
    </div>
  );
};

export default Settings;
