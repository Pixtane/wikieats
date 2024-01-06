import React, { useRef } from "react";

type Props = {
  copyText: string;
  innerText?: string;
};

const ClickToCopy = ({ copyText, innerText }: Props) => {
  const copyStatusRef = useRef<HTMLSpanElement | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        // Update the ref value when copy operation is successful
        if (copyStatusRef.current) {
          copyStatusRef.current.innerHTML =
            "Copied<div class='w-3 h-3 bg-gray-100 border-l border-t absolute -top-[0.375rem] rotate-45'></div>";
        }
        setTimeout(() => {
          if (copyStatusRef.current) {
            copyStatusRef.current.style.opacity = "1";
          }
        }, 500);
      })
      .catch((error) => {
        console.error("Error copying to clipboard:", error);
      });
  };
  const resetCopyStatus = () => {
    // Reset the text when not hovering
    if (copyStatusRef.current) {
      copyStatusRef.current.innerHTML =
        "Click to copy<div class='w-3 h-3 bg-gray-100 border-l border-t absolute -top-[0.375rem] rotate-45'></div>";
    }
  };

  return (
    <div
      onClick={() => copyToClipboard(copyText)}
      onMouseEnter={() => resetCopyStatus()}
      className="text-md flex flex-col items-center font-medium group hover:underline cursor-pointer active:text-[#505050]"
    >
      {innerText}
      <span
        ref={copyStatusRef}
        className="bg-gray-100 flex justify-center text-center border duration-200 transition-all origin-top mt-8 w-32 text-gray-900 absolute rounded-lg p-1 scale-0 group-hover:scale-100"
      >
        Click to copy
      </span>
    </div>
  );
};

export default ClickToCopy;
