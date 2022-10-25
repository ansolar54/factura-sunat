export function getsRoles (texto, limit, offset){
    
    const base=process.env.REACT_APP_BASE_URL;
    let BaseUrl = base + 'role/gets_roles?texto=' + texto + '&limit=' + limit + '&offset=' + offset;

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

export function getRol (id) {
    
    const base=process.env.REACT_APP_BASE_URL;
    let BaseUrl = base + 'role/get_role?id=' + id;

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

export function getRoleState (){
    
    const base=process.env.REACT_APP_BASE_URL;
    let BaseUrl = base + 'role/get_role_state';

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

export function createRol (request){
    
    const base=process.env.REACT_APP_BASE_URL;
    let BaseUrl = base + 'role/create_role';

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

export function updateRol (request, id){
    
    const base=process.env.REACT_APP_BASE_URL;
    let BaseUrl = base + 'role/update_role?id=' + id;

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

export function updateStateRol (request, id){
    
    const base=process.env.REACT_APP_BASE_URL;
    let BaseUrl = base + 'role/update_state_role?id=' + id;

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