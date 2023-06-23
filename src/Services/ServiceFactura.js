export function GuardarFactura(req) {
    const base = process.env.REACT_APP_BASE_URL;
    let BaseUrl = base + "factura/registrar";
  
    return new Promise((resolve, reject) => {
      fetch(BaseUrl, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(req),
      })
        .then((response) => response.json())
        .then((responseJson) => {
          resolve(responseJson);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  export function GenerarXML(req) {
    const base = process.env.REACT_APP_BASE_URL;
    let BaseUrl = base + "factura/generar_xml";
  
    return new Promise((resolve, reject) => {
      fetch(BaseUrl, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(req),
      })
        .then((response) => response.json())
        .then((responseJson) => {
          resolve(responseJson);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }