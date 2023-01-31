export function ConsultarEventos () {

    const base = process.env.REACT_APP_BASE_URL;

    let BaseUrl = base + 'event/get_event';
    return new Promise((resolve, reject) => {
        fetch(BaseUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then((response) => response.json())
        .then((responseJson) => {
            resolve(responseJson)
        })
        .catch((error) => {
            reject(error)
        })
    })

}

export function GetEventos (texto, limit, offset) {

    const base = process.env.REACT_APP_BASE_URL;

    let BaseUrl = base + 'event/gets_events?texto=' +texto + '&limit=' + limit + '&offset=' + offset;;
    return new Promise((resolve, reject) => {
        fetch(BaseUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then((response) => response.json())
        .then((responseJson) => {
            resolve(responseJson)
        })
        .catch((error) => {
            reject(error)
        })
    })

}

export function NewEvento (req) {

    const base = process.env.REACT_APP_BASE_URL;

    let BaseUrl = base + 'event/create_event';
    return new Promise((resolve, reject) => {
        fetch(BaseUrl, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(req)
        })
        .then((response) => response.json())
        .then((responseJson) => {
            resolve(responseJson)
        })
        .catch((error) => {
            reject(error)
        })
    })

}

export function updateStateEvento (request, id){
    
    const base=process.env.REACT_APP_BASE_URL;
    let BaseUrl = base + 'event/update_state_event?id=' + id;

    return new Promise((resolve,reject)=>{
        fetch(BaseUrl,{
            method:'PUT',
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

export function updateEvento (request, id){
    
    const base=process.env.REACT_APP_BASE_URL;
    let BaseUrl = base + 'event/update_event?id=' + id;

    return new Promise((resolve,reject)=>{
        fetch(BaseUrl,{
            method:'PUT',
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