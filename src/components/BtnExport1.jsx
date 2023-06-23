import React from 'react';
import './BtnExport1.css';

const BtnExport1 = ({attribute, onClick}) =>{
    return(
        <button className={attribute.classNamebtn} disabled={attribute.disabled} onClick={() => onClick()}>
            {attribute.name}
        </button>
    )
}

export default BtnExport1;