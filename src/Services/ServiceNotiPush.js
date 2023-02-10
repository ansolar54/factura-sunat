export function ObtenerTokenDevices (req) {

    const base = process.env.REACT_APP_BASE_URL;

    let BaseUrl = base + 'user/get_user_correo';
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

export function EnviarNotificacion (req) {

    const base = process.env.REACT_APP_BASE_URL;

    let BaseUrl = base + 'Notification/SendNotification';
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