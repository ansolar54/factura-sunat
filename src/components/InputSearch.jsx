import React from 'react';
import './BtnSearch.css';

const InputSearch = ({attribute,search}) => {    
    return(
        <>
            <input className="inputSearch" type={attribute.type} 
            name={attribute.name} 
            id={attribute.id}
            placeholder={attribute.placeholder}
             value={attribute.value} 
             disabled={attribute.disabled} 
             onChange={ (e) => search(e.target.name, e.target.value)}
             />
        </>
    )
}

export default InputSearch;