import React from "react";
import "./BtnSearch.css";
const BtnAcept = ({ attribute, onClick }) => {
  return (
    <button className={attribute.classNamebtn} onClick={() => onClick()}>
      <i className={attribute.iconname}></i> {attribute.name}
    </button>
  );
};

export default BtnAcept;
