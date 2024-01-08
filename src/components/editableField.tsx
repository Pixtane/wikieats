import React, { useEffect, useState } from "react";
import { fromMultiline } from "../hooks/useFirebaseMultiline";

type TInput =
  | "button"
  | "checkbox"
  | "color"
  | "date"
  | "datetime-local"
  | "email"
  | "file"
  | "hidden"
  | "image"
  | "month"
  | "number"
  | "password"
  | "radio"
  | "range"
  | "reset"
  | "search"
  | "submit"
  | "tel"
  | "text"
  | "time"
  | "url"
  | "week";

type Props = {
  placeholder: string | React.ReactElement;
  multiline?: boolean;
  editMode: boolean;
  onSave: (newValue: string) => void;
  onCancel: () => void;
  setEditMode: (arg0: boolean) => void;
  inputType: TInput | "select";
  selectMultiple?: boolean;
  optionsList?: string[];
};
type PreviewProps = Omit<
  Props,
  "onSave" | "onCancel" | "inputType" | "optionsList"
>;

const preview = ({ placeholder, editMode, setEditMode }: PreviewProps) => {
  return (
    <div className="flex gap-2 items-center">
      <div className="min-w-16 border-b-2 border-gray-300">
        &zwnj;{placeholder}
        {/* &zwnj; makes invisible character which makes min-h the same as text size */}
      </div>
      <div
        onClick={() => setEditMode(!editMode)}
        className=" hover:drop-shadow drop-shadow-2xl text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
          <path
            fillRule="evenodd"
            d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"
          />
        </svg>
      </div>
    </div>
  );
};

const editing = (
  {
    placeholder,
    multiline,
    editMode,
    setEditMode,
    onSave,
    onCancel,
    inputType,
    optionsList,
    selectMultiple,
  }: Props,
  inputData: any,
  setInputData: any
) => {
  function handleCancel() {
    setEditMode(false);
    setInputData(placeholder);
    onCancel();
  }
  function handleSave() {
    setEditMode(false);
    onSave(inputData);
  }

  const renderSelectOptions = () => {
    if (optionsList && optionsList.length > 0) {
      return optionsList.map((option, index) => (
        <option key={index} value={option}>
          {option}
        </option>
      ));
    }
    return null;
  };

  return (
    <div className="flex flex-col relative">
      {selectMultiple && optionsList && optionsList.length > 0 && (
        <div className="flex flex-col outline outline-gray-300 outline-1 bg-gray-100 border-b-2 border-green-300 px-2">
          {optionsList.map((option, index) => (
            <label key={index} className="flex items-center gap-2 border-b">
              <input
                type="checkbox"
                value={option}
                checked={inputData.includes(option)}
                onChange={(e) => {
                  const newValue = e.target.value;

                  setInputData((prevData: string) => {
                    // Convert the string to an array
                    const dataArray =
                      prevData !== "" ? prevData.split(",") : [];

                    // Update the array based on checkbox state
                    if (e.target.checked) {
                      dataArray.push(newValue);
                    } else {
                      const indexToRemove = dataArray.indexOf(newValue);
                      if (indexToRemove !== -1) {
                        dataArray.splice(indexToRemove, 1);
                      }
                    }
                    // Convert the array back to a string
                    return dataArray.join(",");
                  });
                }}
              />
              {option}
            </label>
          ))}
        </div>
      )}

      {inputType === "select" && !selectMultiple && (
        <select
          className="outline outline-gray-300 outline-1 bg-gray-100 border-b-2 border-green-300"
          value={inputData}
          onChange={(e) => setInputData(e.target.value)}
        >
          <option key={-1} value="">
            -
          </option>
          {renderSelectOptions()}
        </select>
      )}
      {!(multiline && inputType === "text") && inputType !== "select" && (
        <input
          className="outline outline-gray-300 outline-1 bg-gray-100 border-b-2 border-green-300"
          type={inputType}
          value={inputData}
          placeholder={typeof placeholder === "string" ? placeholder : ""}
          onChange={(e) => setInputData(e.target.value)}
        />
      )}
      {multiline && inputType === "text" && (
        <textarea
          className="outline outline-gray-300 outline-1 bg-gray-100 border-b-2 border-green-300 placeholder:text-black"
          placeholder={
            typeof placeholder === "string"
              ? placeholder
              : fromMultiline(placeholder)
          }
          value={fromMultiline(inputData)}
          onChange={(e) => setInputData(e.target.value)}
        />
      )}
      <div className="flex gap-2 text-lg font-medium absolute -bottom-10 z-10">
        <button
          onClick={handleCancel}
          className=" bg-gray-300 hover:bg-gray-400 transition-colors duration-300 cursor-pointer hover:drop-shadow p-1 px-3 rounded-full"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className=" bg-green-500 text-white hover:bg-green-600 transition-colors hover:drop-shadow cursor-pointer p-1 px-3 rounded-full"
        >
          Save
        </button>
      </div>
    </div>
  );
};

const editableField = ({
  placeholder,
  multiline = false,
  onSave,
  onCancel,
  inputType,
  optionsList = ["Undefined"],
  selectMultiple = false,
}: Omit<Props, "editMode" | "setEditMode">) => {
  const [editMode, setEditMode] = useState(false);
  let [inputData, setInputData] = useState(
    typeof placeholder === "string" ? placeholder : fromMultiline(placeholder)
  );

  useEffect(() => {
    // This code will run only once when the component first mounts
    setInputData(
      typeof placeholder === "string" ? placeholder : fromMultiline(placeholder)
    );

    // Return a cleanup function to avoid unnecessary updates
    return () => {};
  }, [placeholder]);

  if (editMode) {
    return editing(
      {
        placeholder,
        multiline,
        editMode,
        setEditMode,
        onSave,
        onCancel,
        inputType,
        optionsList,
        selectMultiple,
      },
      inputData,
      setInputData
    );
  } else {
    return preview({ placeholder, multiline, editMode, setEditMode });
  }
};

export default editableField;
