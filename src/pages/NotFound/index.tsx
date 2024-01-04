import React, { ReactNode } from "react";
import { Link } from "react-router-dom"; // Assuming you are using react-router-dom for routing
import Navbar from "../../components/navbar";

interface NotFoundProps {
  linkPath?: string;
  linkText?: string;
  children?: ReactNode;
}

const NotFound: React.FC<NotFoundProps> = ({
  linkPath,
  linkText,
  children,
}) => {
  return (
    <>
      <Navbar />
      <div className="flex flex-col w-screen bg-white h-screen justify-center font-sans items-center font-bold text-4xl text-red-900">
        <p>404 Not Found.</p>
        {linkPath && (
          <Link to={linkPath} className="text-blue-600 text-xl hover:underline">
            {linkText || "Go back"}
          </Link>
        )}
        {children}
      </div>
    </>
  );
};

export default NotFound;
