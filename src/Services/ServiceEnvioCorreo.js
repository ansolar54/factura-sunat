//servicio para deuda cliente envio de correo
export function DeuCli_EnvCorreo(req){
    const base=process.env.REACT_APP_BASE_URL_SAP;
    let BaseUrl = base + 'DeuCli_EnvPDF/DeuCli_EnvPDF';

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



export function ConsPedido_EnvCorreo(req){
    const base=process.env.REACT_APP_BASE_URL_SAP;
    let BaseUrl = base + 'PDFaCorreo/Pdf_Correo';

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