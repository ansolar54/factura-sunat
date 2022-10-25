
export function ConsultarStock(req){

    const base=process.env.REACT_APP_BASE_URL_SAP;
    let BaseUrl = base + 'ConsultaStock/ConsultaStock';

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

export function ConsultarStockFiltro(req){

    const base=process.env.REACT_APP_BASE_URL_SAP;
    let BaseUrl = base + 'ConsStockFiltro/ConsultaStockFiltro';

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

export function ExportarConsultarStock(req){

    const base=process.env.REACT_APP_BASE_URL_SAP;
    let BaseUrl = base + 'ConsultaStock/ConsultaStock';

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

// export function ExportarConsultaStock(req){

//     const base=process.env.REACT_APP_BASE_URL_SAP;
//     let BaseUrl = base + 'ConsultaStock/ExportarConsultaStock';

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
// }