export function ConsPedidoEnviarFactura (archivo, request, pedido, nombCliente){
    
    const base=process.env.REACT_APP_BASE_URL;
    let BaseUrl = base + 'conspedidofactura/post_correo_factura?archivo='+archivo+".pdf&pedido="+pedido+"&cliente="+nombCliente;

    return new Promise((resolve,reject)=>{
        fetch(BaseUrl,{
            method:'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(request)
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

export function ConsPedidoGetFactura (archivo){
    
    const base=process.env.REACT_APP_BASE_URL;
    let BaseUrl = base + 'conspedidofactura/get_factura?archivo='+archivo+".pdf";

    return new Promise((resolve,reject)=>{
        fetch(BaseUrl,{
            method:'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
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