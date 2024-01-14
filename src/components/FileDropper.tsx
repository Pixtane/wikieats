import { useEffect, useState } from "react";
import EditableField from "./editableField";

// FRONTEND BY Håvard Brynjulfsen
// FROM https://codepen.io/havardob/pen/mdPoYmY

type Props = {
  closeFileDropper: () => void;
  onFileUpload: (file: File) => void;
  title?: string;
  URLwriter?: (url: string) => void;
};

const FileDropper = ({
  closeFileDropper,
  onFileUpload,
  title,
  URLwriter,
}: Props) => {
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  let [urlValue, setUrlValue] = useState("");

  useEffect(() => {
    // Dynamically import the CSS module
    import("./styles/FileDropper.css").then((module) => {
      // Access the imported CSS module
      const styles = module.default;

      // Use styles as needed, e.g., apply them to elements in your component
    });

    // Add event listener for the Escape key
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeFileDropper();
      }
    };

    window.addEventListener("keydown", handleEscapeKey);

    // Remove event listener when the component unmounts
    return () => {
      window.removeEventListener("keydown", handleEscapeKey);
    };
  }, [closeFileDropper]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileInput = event.target;
    const selectedFile = fileInput.files && fileInput.files[0];

    if (selectedFile) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };

      reader.readAsDataURL(selectedFile);

      setSelectedFile(selectedFile);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      // Call the callback function to handle the file upload
      onFileUpload(selectedFile);
      closeFileDropper(); // Close the file dropper modal
    } else if (URLwriter && urlValue !== "") {
      setFilePreview(urlValue);
      URLwriter(urlValue);
      closeFileDropper();
    }
  };

  return (
    <>
      <div
        onClick={closeFileDropper}
        className="fixed top-0 left-0 w-screen h-screen bg-black blur-md opacity-20 z-30"
      ></div>
      <div className="modal scale-0 fixed bg-white shadow-xl z-40">
        <div className="modal-header">
          <div className="modal-logo">
            <span className="logo-circle">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                width="512"
                height="419.116"
                viewBox="0 0 512 419.116"
              >
                <defs>
                  <clipPath id="clip-folder-new">
                    <rect width="512" height="419.116" />
                  </clipPath>
                </defs>
                <g id="folder-new" clipPath="url(#clip-folder-new)">
                  <path
                    id="Union_1"
                    data-name="Union 1"
                    d="M16.991,419.116A16.989,16.989,0,0,1,0,402.125V16.991A16.989,16.989,0,0,1,16.991,0H146.124a17,17,0,0,1,10.342,3.513L227.217,57.77H437.805A16.989,16.989,0,0,1,454.8,74.761v53.244h40.213A16.992,16.992,0,0,1,511.6,148.657L454.966,405.222a17,17,0,0,1-16.6,13.332H410.053v.562ZM63.06,384.573H424.722L473.86,161.988H112.2Z"
                    fill="var(--c-action-primary)"
                    stroke=""
                    strokeWidth="1"
                  />
                </g>
              </svg>
            </span>
          </div>
          <button onClick={closeFileDropper} className="btn-close">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path fill="none" d="M0 0h24v24H0V0z" />
              <path
                d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"
                fill="var(--c-text-secondary)"
              />
            </svg>
          </button>
        </div>
        <div className="modal-body">
          <h2 className="modal-title">Upload {title ? title : "a file"}</h2>
          <p className="modal-description">
            Attach the {title ? title : "file"} below
          </p>
          <button className="upload-area relative">
            {filePreview && (
              <>
                <div className="-mt-8 mb-3  font-bold text-xl">Preview</div>
                <div className="grid items-center previewOuter">
                  <div className="preview">
                    <img
                      src={filePreview}
                      alt="File Preview"
                      className="file-preview opacity-100 rounded-full w-80 h-80 object-cover border border-black z-10"
                    />
                  </div>
                  <img
                    src={filePreview}
                    alt="File Preview"
                    className="file-preview opacity-50 w-80 h-80 object-cover preview z-0"
                  />
                </div>
              </>
            )}
            {!filePreview && (
              <>
                <span className="upload-area-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    width="340.531"
                    height="419.116"
                    viewBox="0 0 340.531 419.116"
                  >
                    <g id="files-new" clipPath="url(#clip-files-new)">
                      <path
                        id="Union_2"
                        data-name="Union 2"
                        d="M-2904.708-8.885A39.292,39.292,0,0,1-2944-48.177V-388.708A39.292,39.292,0,0,1-2904.708-428h209.558a13.1,13.1,0,0,1,9.3,3.8l78.584,78.584a13.1,13.1,0,0,1,3.8,9.3V-48.177a39.292,39.292,0,0,1-39.292,39.292Zm-13.1-379.823V-48.177a13.1,13.1,0,0,0,13.1,13.1h261.947a13.1,13.1,0,0,0,13.1-13.1V-323.221h-52.39a26.2,26.2,0,0,1-26.194-26.195v-52.39h-196.46A13.1,13.1,0,0,0-2917.805-388.708Zm146.5,241.621a14.269,14.269,0,0,1-7.883-12.758v-19.113h-68.841c-7.869,0-7.87-47.619,0-47.619h68.842v-18.8a14.271,14.271,0,0,1,7.882-12.758,14.239,14.239,0,0,1,14.925,1.354l57.019,42.764c.242.185.328.485.555.671a13.9,13.9,0,0,1,2.751,3.292,14.57,14.57,0,0,1,.984,1.454,14.114,14.114,0,0,1,1.411,5.987,14.006,14.006,0,0,1-1.411,5.973,14.653,14.653,0,0,1-.984,1.468,13.9,13.9,0,0,1-2.751,3.293c-.228.2-.313.485-.555.671l-57.019,42.764a14.26,14.26,0,0,1-8.558,2.847A14.326,14.326,0,0,1-2771.3-147.087Z"
                        transform="translate(2944 428)"
                        fill="var(--c-action-primary)"
                      />
                    </g>
                  </svg>
                </span>
                <span className="upload-area-title">
                  Drag file(s) here to upload.
                </span>
                <span className="upload-area-description">
                  Alternatively, you can select a file by <br />
                  <strong>clicking here</strong>
                </span>
              </>
            )}
            <input
              type="file"
              name="Image upload"
              id="imageFileInput"
              className="w-full h-full absolute top-0 left-0 opacity-0 cursor-pointer"
              onChange={handleFileChange}
            />
          </button>
          {URLwriter && (
            <div className="w-full flex flex-col items-center">
              <span className="font-bold mt-2">OR</span>
              <input
                className="outline-none w-full bg-white border-b-2 border  focus:border-b-green-300 px-2"
                type="url"
                name="url"
                id="imgurl"
                autoComplete="photo"
                placeholder="Write or paste URL here"
                onChange={(e) => setUrlValue(e.target.value)}
              />
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button onClick={closeFileDropper} className="btn-secondary">
            Cancel
          </button>
          <button onClick={handleUpload} className="btn-primary">
            Upload File
          </button>
        </div>
      </div>
    </>
  );
};

export default FileDropper;
