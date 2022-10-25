export function ConsuPromocionesBuscar(req){

    const base=process.env.REACT_APP_BASE_URL_SAP;
    let BaseUrl = base + 'ConsultaPromociones/ConsultaPromociones';

    return new Promise((resolve,reject)=>{
        fetch(BaseUrl,{
            method:'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(req)
        })
        .then((response)=>response.json())
        .then((responseJson)=>{
            resolve(responseJson);
        })
        .catch((error)=>{
            reject(error);
        });
    });
}

export function ConsuPromocionesBuscarFiltro(req){

    const base=process.env.REACT_APP_BASE_URL_SAP;
    let BaseUrl = base + 'ConsultaPromocionesFiltro/ConsultaPromocionesFiltro';

    return new Promise((resolve,reject)=>{
        fetch(BaseUrl,{
            method:'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(req)
        })
        .then((response)=>response.json())
        .then((responseJson)=>{
            resolve(responseJson);
        })
        .catch((error)=>{
            reject(error);
        });
    });
}

//Matchcode de promociones
export function MatchcodePromociones(req){

    const base=process.env.REACT_APP_BASE_URL_SAP;
    let BaseUrl = base + 'ConsultaPromociones_Mc/ConsultaPromociones_Mc';

    return new Promise((resolve,reject)=>{
        fetch(BaseUrl,{
            method:'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(req)
        })
        .then((response)=>response.json())
        .then((responseJson)=>{
            resolve(responseJson);
        })
        .catch((error)=>{
            reject(error);
        });
    });
}
