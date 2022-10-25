import React from 'react';
import './Input.css';

const Input = ({attribute,handleChange,label,div}) =>{
    return(
        <div className={div.className}>
            <span></span>
            <input type={attribute.type} name={attribute.name} onChange={ (e) => handleChange(e.target.name, e.target.value)} required/>
            <label>{label.value}</label>
        </div>
    )
}

export default Input;