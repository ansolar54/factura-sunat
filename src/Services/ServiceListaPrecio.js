export function ListaPrecios(req){

    const base=process.env.REACT_APP_BASE_URL_SAP;
    let BaseUrl = base + 'MatchListPrec/ListaPrecios_MatchListPrec';

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