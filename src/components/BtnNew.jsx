import React from 'react';
import './BtnNew.css'
const BtnNew = ({attribute,onClick}) =>{
    return(
        <button name={attribute.name} className={attribute.classNamebtn} onClick={() => onClick()}>
            {attribute.value}
        </button>
    )
}

export default BtnNew;