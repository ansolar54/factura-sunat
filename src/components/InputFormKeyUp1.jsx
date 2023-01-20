import React from "react";
import "./InputFormKeyUp1.css";

const InputFormKeyUp1 = ({ attribute, handleChange, onClick, onKeyUp }) => {
  return (
    <div className="content-inputform">
      <input
        className="inputform1"
        type={attribute.type}
        id={attribute.id}
        name={attribute.name}
        value={attribute.value}
        disabled={attribute.disabled}
        checked={attribute.checked}
        maxLength={attribute.maxlength}
        placeholder={attribute.placeholder}
        onChange={(e) => handleChange(e.target.name, e.target.value)}
        onKeyUp={(e) => onKeyUp(e)}
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

export default InputFormKeyUp1;
