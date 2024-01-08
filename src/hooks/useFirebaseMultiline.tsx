import React, { ReactElement, Children } from "react";

export const toMultiline = (text: string) => {
  if (!text || typeof text !== "string") {
    return <></>;
  }

  const lines = text.split(/\n|\\n/);

  const replacedText = lines.map((line, index) => (
    <React.Fragment key={index}>
      {line}
      {index < lines.length - 1 && <br />}
    </React.Fragment>
  ));

  return <>{replacedText}</>;
};

export const fromMultiline = (input: string | React.ReactElement) => {
  if (typeof input === "string") {
    // Replace all <br /> with \n in the string
    return input.replace(/<br\s*\/?>/g, "\n");
  }

  const extractTextFromElement = (element: React.ReactElement): string => {
    if (typeof element === "string") {
      return element;
    }

    if (React.isValidElement(element)) {
      if (element.type === "br") {
        return "\n";
      }
      if (!element.props) return "";

      const children = (element.props as React.PropsWithChildren<{}>).children;
      if (!children) return "";
      if (Array.isArray(children)) {
        return children.map(extractTextFromElement).join("");
      } else {
        // Handle the case when children is not an array
        return "";
      }
    }

    return "";
  };

  return extractTextFromElement(input);
};
