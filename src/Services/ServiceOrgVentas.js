export function OrgVentas(){

    const base=process.env.REACT_APP_BASE_URL_SAP;
    let BaseUrl = base + 'OrganVentas/OrganVentas';

    return new Promise((resolve,reject)=>{
        fetch(BaseUrl,{
            method:'POST',
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
//Para Matchcode de Consultar Stock
export function ConsultarStockOrgVentas(req){

    const base=process.env.REACT_APP_BASE_URL_SAP;
    let BaseUrl = base + 'ConsStock_OrgVentas/ConsStock_OrgVentas';

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
