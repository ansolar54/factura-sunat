
export function ActualizarPasswordStatus(req,id_user){
    
    const base=process.env.REACT_APP_BASE_URL;
    let BaseUrl = base + 'configuration/configuration_password?id_user=' + id_user;

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


export function GetConfiguracionPassword(id){
    
    const base=process.env.REACT_APP_BASE_URL;
    let BaseUrl = base + 'configuration/get_configuration_password?id=' + id;

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

export function PostConfiguracionPassword(req,id){
    
    const base=process.env.REACT_APP_BASE_URL;
    let BaseUrl = base + 'configuration/post_configuration_password?id=' + id;

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
