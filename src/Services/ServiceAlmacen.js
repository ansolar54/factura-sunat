export function ConsultarAlmacenes () {

    const base = process.env.REACT_APP_BASE_URL_SAP
    let BaseUrl = base + 'Almacen/Almacen'

    return new Promise((resolve, reject) => {
        fetch(BaseUrl, {
            method: 'POST',
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