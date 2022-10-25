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