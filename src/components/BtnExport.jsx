import React from 'react';
import './BtnExport.css';

const BtnExport = ({attribute, onClick}) =>{
    return(
        <button className={attribute.classNamebtn} disabled={attribute.disabled} onClick={() => onClick()}>
            {attribute.name}
        </button>
    )
}

export default BtnExport;