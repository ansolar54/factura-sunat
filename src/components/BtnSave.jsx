import React from 'react';
import './BtnSave.css'
const BtnSave = ({attribute,onClick}) =>{
    return(
        <button name={attribute.name} className={attribute.classNamebtn} onClick={() => onClick()}>
            {attribute.value}
        </button>
    )
}

export default BtnSave;