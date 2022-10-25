export function Cliente(req){

    const base=process.env.REACT_APP_BASE_URL_SAP;
    let BaseUrl = base + 'Cliente/Clientes';

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
};

export function InfoClienteClienteBuscar(req){
    const base=process.env.REACT_APP_BASE_URL_SAP;
    let BaseUrl = base + 'InfoCliente/InformacionCliente';

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
};

//Matchcode de cliente
export function Mc_InfoCliente_Cliente(req){
    const base=process.env.REACT_APP_BASE_URL_SAP;
    let BaseUrl = base + 'InfoCliente_McCliente/InfoCliente_McCliente';

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
};

//Servicio buscar cliente de Deuda Cliente
export function DeuCli_Buscar(req){
    const base=process.env.REACT_APP_BASE_URL_SAP;
    let BaseUrl = base + 'DeuCli_BuscarCli/DeuCli_BusCli';

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
};

//Matchcode de cliente de deuda cliente
export function McDeuCliCliente(req){
    const base=process.env.REACT_APP_BASE_URL_SAP;
    let BaseUrl = base + 'DeuCli_McCliente/DeuCli_McCliente';

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
};

//Detalle de cliente para búsqueda por nro pedido

// export function ExportarConsPedido_DetalleCli(req){
//     const base=process.env.REACT_APP_BASE_URL_SAP;
//     let BaseUrl = base + 'DetalleCliente/ConsPedido_ExportarDetalleCliente';

//     return new Promise((resolve,reject)=>{
//         fetch(BaseUrl,{
//             method:'POST',
//             headers: {
//                 'Accept': 'application/json',
//                 'Content-Type': 'application/json'
//             },
//             body:JSON.stringify(req)
//         })
//         .then(response => response.blob())
//         .then(blob => {
//             // DateTime filename
//             var filename = new Date().getTime();
//             var url = window.URL.createObjectURL(blob);
//             var a = document.createElement('a');
//             a.href = url;
//             a.download = filename+".xlsx";
//             document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
//             a.click();    
//             a.remove();  //afterwards we remove the element again         
//         })
//         .catch((error)=>{
//             console.log(error);
//             reject(error);
//         });
//     });
// };


//Matchcode de cliente de deuda cliente
export function ExportarConsPedido_DetalleCli(req){
    const base=process.env.REACT_APP_BASE_URL_SAP;
    let BaseUrl = base + 'DetalleCliente/ConsPedido_ExportarDetalleCliente';

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
};