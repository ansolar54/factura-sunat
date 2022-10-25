export function getsModules (){
    
    const base=process.env.REACT_APP_BASE_URL;
    let BaseUrl = base + 'module/gets_modules';

    return new Promise((resolve,reject)=>{
        fetch(BaseUrl,{
            method:'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
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