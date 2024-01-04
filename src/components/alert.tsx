// Alert.js
import React from "react";

const Alert = ({ title = "Alert", message, onClose }: any) => {
  return (
    <div className="fixed top-0 left-0 w-screen h-screen flex justify-center items-center">
      <div className="fixed top-0 left-0 w-screen h-screen bg-black blur-md opacity-20 z-10"></div>
      <div className="alert-container bg-white p-6 rounded-md flex flex-col shadow-lg z-20">
        <h2 className="text-2xl font-bold text-red-700 mb-4">{title}</h2>
        <p className="text-black text-lg">{message}</p>
        <button
          onClick={onClose}
          className="mt-4 px-8 py-2 bg-blue-500 self-end text-white rounded-full select-none"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Alert;
