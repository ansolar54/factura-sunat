// SERVICIOS MYSQL
export function GuardarSolicitud(req) {
  const base = process.env.REACT_APP_BASE_URL;
  let BaseUrl = base + "request/create_request";

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

export function ListadoSolicitudes(sales_org, client, state, limit, offset) {
  const base = process.env.REACT_APP_BASE_URL;
  let BaseUrl =
    base +
    "request/all?sales_org=" +
    sales_org +
    "&client=" +
    client +
    "&state=" +
    state +
    "&limit=" +
    limit +
    "&offset=" +
    offset;

  return new Promise((resolve, reject) => {
    fetch(BaseUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
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

export function GetDetalleSolicitud(id_request) {
  const base = process.env.REACT_APP_BASE_URL;
  let BaseUrl = base + "request/detail?id_request=" + id_request;

  return new Promise((resolve, reject) => {
    fetch(BaseUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
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

export function EnviarCorreo(req) {
  const base = process.env.REACT_APP_BASE_URL;
  let BaseUrl = base + "request/enviar_correo";

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
// ---------------------

// SERVICIOS SAP
export function DetalleMaterialSAP(req) {
  const base = process.env.REACT_APP_BASE_URL_SAP;
  let BaseUrl = base + "DetMaterial/CambioPrecio_DetMaterial";

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

export function MatchCliente(req) {
  const base = process.env.REACT_APP_BASE_URL_SAP;
  let BaseUrl = base + "MatchCliente/CambioPrecio_McCliente";

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

export function MatchMaterial(req) {
  const base = process.env.REACT_APP_BASE_URL_SAP;
  let BaseUrl = base + "MatchMaterial/CambioPrecio_McMaterial";

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

export function AprobMargen(req) {
  const base = process.env.REACT_APP_BASE_URL_SAP;
  let BaseUrl = base + "AprobMargen/CambioPrecio_AprovMargen";

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
// ----------------------
