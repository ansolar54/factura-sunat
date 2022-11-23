import React from "react";
import "./InputFormModal.css";

const InputFormMd = ({ attribute, handleChange }) => {
  // console.log(attribute);
  return (
    <>
      <input
        className={attribute.className}
        type={attribute.type}
        id={attribute.id}
        name={attribute.name}
        value={attribute.value}
        disabled={attribute.disabled}
        checked={attribute.cheched}
        onChange={(e) => handleChange(e.target.name, e.target.value)}
      />
    </>
  );
};

export default InputFormMd;
