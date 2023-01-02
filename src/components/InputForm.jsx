import React from "react";
import "./InputForm.css";

const InputForm = ({ attribute, handleChange, onClick}) => {
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
        onChange={(e) => handleChange(e.target.name, e.target.value)}
        min={attribute.min}
        placeholder={attribute.placeholder}
        onKeyUp={attribute.onKeyUp}
      />
      {
        attribute.matchcode && (
          // <button className="buton-matchcode" onClick={() => onClick()}>
          // <i className="fab fa-buffer"  onClick={() => onClick()}></i>
          <>
            <i
              className="far fa-clone icon-matchcode-1"
              onClick={() => onClick()}
              //onKeyUp={() => onKeyUp()}
            ></i>
          </>
        )
        // </button>
      }
    </div>
  );
};

export default InputForm;
