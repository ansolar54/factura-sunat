import React from "react";
import "./BtnAddMaterial.css";
const BtnAddMaterial = ({ attribute, onClick }) => {
  return (
    <button className={attribute.classNamebtn} onClick={() => onClick()}>
      {attribute.name}
    </button>
  );
};

export default BtnAddMaterial;
