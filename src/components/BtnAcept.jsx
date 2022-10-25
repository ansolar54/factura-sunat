import React from 'react';
import './BtnAcept.css'
const BtnAcept = ({attribute,onClick}) =>{
    return(
        <button className={attribute.classNamebtn} onClick={() => onClick()}>
            {attribute.name}
        </button>
    )
}

export default BtnAcept;