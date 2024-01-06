import React from "react";

type Props = {
  placeholder: string;
  multiline?: boolean;
};

const editableField = ({ placeholder, multiline = false }: Props) => {
  return (
    <div className="min-w-16 border-b border-blue-600 bg-blue-300 outline">
      &nbsp;{placeholder}
      {/* &nbsp; makes invisible character which makes min-h the same as text size */}
    </div>
  );
};

export default editableField;
