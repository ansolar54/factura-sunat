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

export function ListadoReporteSolicitud(req,limit,offset) {
  const base = process.env.REACT_APP_BASE_URL;
  let BaseUrl = base + "request/search_reports_request?limit=" + limit + "&offset=" + offset;
  console.log(BaseUrl)
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

export function ListadoSolicitudes(
  id_user,
  sales_org,
  client,
  state,
  limit,
  offset
) {
  const base = process.env.REACT_APP_BASE_URL;
  let BaseUrl =
    base +
    "request/all?id_user=" +
    id_user +
    "&sales_org=" +
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

export function ModificarRequestDetail(req) {
  const base = process.env.REACT_APP_BASE_URL;
  let BaseUrl = base + "request/update_request_detail";

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

export function ModificarStateRequest(req) {
  const base = process.env.REACT_APP_BASE_URL;
  let BaseUrl = base + "request/update_state_request";

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

export function ListadoSolicitudesForAprob(
  id_user,
  state,
  sales_org,
  limit,
  offset
) {
  const base = process.env.REACT_APP_BASE_URL;
  let BaseUrl =
    base +
    "request/all_for_aprob?id_user=" +
    id_user +
    "&state=" +
    state +
    "&sales_org=" +
    sales_org +
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

export function EnviarCorreoAprob(req) {
  const base = process.env.REACT_APP_BASE_URL;
  let BaseUrl = base + "request/enviar_correo_aprob";

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

export function GetSolicitud(id) {
  const base = process.env.REACT_APP_BASE_URL;
  let BaseUrl = base + "request/get_request?id_request=" + id;

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

export function GetSolicitudLimit() {
  const base = process.env.REACT_APP_BASE_URL;
  let BaseUrl = base + "request/get_request_limit";

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

export function UpdateDetailRequestLastAprobRequest(req) {
  const base = process.env.REACT_APP_BASE_URL;
  let BaseUrl = base + "request/update_request_detail_last_aprob";

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

export function AprobSolicitud(req) {
  const base = process.env.REACT_APP_BASE_URL_SAP;
  let BaseUrl = base + "AprobSolicitud/CambioPrecio_AprobSolicitud";

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

export function UsuarioNotifi(req) {
  const base = process.env.REACT_APP_BASE_URL_SAP;
  let BaseUrl = base + "UsuaNotif/CambioPrecio_UsuaNotifi";

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

export function ConfiPerfiles(req) {
  const base = process.env.REACT_APP_BASE_URL_SAP;
  let BaseUrl = base + "ConfiPerfiles/CambioPrecio_ConfiPerfiles";

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
