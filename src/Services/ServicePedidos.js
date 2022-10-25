export function PedidoAnioAnt(req){

    const base=process.env.REACT_APP_BASE_URL_SAP;
    let BaseUrl = base + 'InfoCliente_CliPedFecAnt/InfoCliente_CliPedFecAnt';

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

export function PedidoAnioAct(req){

    const base=process.env.REACT_APP_BASE_URL_SAP;
    let BaseUrl = base + 'InfoCliente_CliPedFecAct/InfoCliente_CliPedFecAct';

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

export function ConsPedidoFiltro(req){

    const base=process.env.REACT_APP_BASE_URL_SAP;
    let BaseUrl = base + 'ConsPedidoFiltro/ConsultaPedidoFiltro';

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