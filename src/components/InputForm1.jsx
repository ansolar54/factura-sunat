import React from "react";
import "./InputForm1.css";

const InputForm1 = ({ attribute, handleChange, onClick }) => {
  return (
    <div className="content-inputform">
      <input
        style={{ width: "190px" }}
        className="inputform1"
        type={attribute.type}
        id={attribute.id}
        name={attribute.name}
        value={attribute.value}
        disabled={attribute.disabled}
        checked={attribute.checked}
        maxLength={attribute.maxlength}
        onChange={(e) => handleChange(e.target.name, e.target.value)}
        min={attribute.min}
        placeholder={attribute.placeholder}
      />
      {
        attribute.matchcode && (
          // <button className="buton-matchcode" onClick={() => onClick()}>
          // <i className="fab fa-buffer"  onClick={() => onClick()}></i>
          <>
            <i
              className="far fa-clone icon-matchcode-1"
              onClick={() => onClick()}
            ></i>
          </>
        )
        // </button>
      }
    </div>
  );
};

export default InputForm1;
