import { useParams } from "react-router-dom";
import Navbar from "../../../components/navbar";
import FileDropper from "../../../components/FileDropper";
import ClickToCopy from "../../../components/clickToCopy";
import EditableField from "../../../components/editableField";
import { useRef, useState } from "react";
import { getUserData } from "../hooks/getUserData";

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

  const { userData, loading } = getUserData(
    UUID,
    new Map([
      ["extended", ["public", "extended"]],
      ["private", ["private", "user"]],
    ])
  );

  console.log(userData, loading);

  //#endregion

  const [imageDropper, setImageDropper] = useState(false);
  const [avatar, setAvatar] = useState("");

  const useFileDrop = () => {
    setImageDropper(true);
  };
  console.log("description", userData?.description);

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
        <div className="flex gap-8">
          <div className="avatar w-32 h-32 max-w-32 min-h-32 group">
            <img
              className="rounded-2xl object-cover cursor-pointer min-h-full min-w-full outline outline-2 outline-gray-200"
              src={avatar ? avatar : userData?.logo}
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
          <div className="flex flex-col gap-3">
            <EditableField
              placeholder={userData?.name ? userData?.name : userData?.username}
            />
            <EditableField
              placeholder={userData?.description}
              multiline={true}
            />
          </div>
        </div>
      </main>

      <div className="extra"></div>
    </div>
  );
};

export default Settings;
