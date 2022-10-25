import React from 'react';
import './BtnCancel.css'
const BtnCancel = ({attribute,onClick}) =>{
    return(
        <button name={attribute.name} className={attribute.classNamebtn} onClick={() => onClick()}>
            {attribute.value}
        </button>
    )
}

export default BtnCancel;