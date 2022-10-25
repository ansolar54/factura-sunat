import React from 'react';
import './SelectFormModal.css';

const SelectFormMd = ({attribute, values, handleChange}) => {    
    return(
        <>
            <select className="selectModal" name={attribute.name} disabled={attribute.disabled} onChange={ (e) => handleChange(e.target.name, e.target.value)} >
                <option value="0">Selecione ...</option>
                {
                    values.map((row, key) => (
                        <option key={key} value={row.id} selected={row.id===attribute.default} >{row.name}</option>
                    ))
                }
            </select>
        </>
    )
}

export default SelectFormMd;