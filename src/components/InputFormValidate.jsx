import React from "react";
import "./InputForm.css";

const InputFormValidate = ({ attribute, handleChange, onKeyDown,onClick}) => {
  return (
    <div className="content-inputform">
      <input
      
        className="inputform"
        type={attribute.type}
        id={attribute.id}
        name={attribute.name}
        value={attribute.value}
        disabled={attribute.disabled}
        checked={attribute.checked}
        maxLength={attribute.maxlength}
        max={attribute.max}
        onChange={(e) => handleChange(e.target.name, e.target.value)}
        min={attribute.min}
        placeholder={attribute.placeholder}
        pattern={attribute.pattern}
        onKeyDown={(e) => onKeyDown(e)}
      
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

export default InputFormValidate;
