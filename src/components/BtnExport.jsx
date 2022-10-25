import React from 'react';
import './BtnExport.css';

const BtnExport = ({attribute}) =>{
    return(
        <button className={attribute.classNamebtn} disabled={attribute.disabled}>
            {attribute.name}
        </button>
    )
}

export default BtnExport;