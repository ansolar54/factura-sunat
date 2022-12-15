export function ConsultarAuditoria(req,search,created_at,created_up,limit,offset,exp){
  const base = process.env.REACT_APP_BASE_URL;
 // console.log('SEARCH', typeof search)
  let BaseUrl =
    base +
    "userevent/get_user_event_audit?search=" +
    (search.trim() == "" ? "null" : search) +
    "&created_at=" +
    (created_at.trim() == "" ? "null" : created_at) +
    "&created_up=" +
    (created_up.trim() == "" ? "null" : created_up) +
    "&limit=" +
    limit +
    "&offset=" +
    offset +
    "&export=" +
    exp;
    console.log('URL', BaseUrl);
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

// export function ConsultarAuditoria(
//   id_rol,
//   search,
//   id_event,
//   created_at,
//   limit,
//   offset,
//   exp
// ) {
//   const base = process.env.REACT_APP_BASE_URL;

//   let BaseUrl =
//     base +
//     "userevent/get_user_event?id_rol=" +
//     id_rol +
//     "&search=" +
//     (search.trim() == "" ? "null" : search) +
//     "&id_event=" +
//     id_event +
//     "&created_at=" +
//     (created_at.trim() == "" ? "null" : "'" + created_at + "'") +
//     "&limit=" +
//     limit +
//     "&offset=" +
//     offset +
//     "&export=" +
//     exp;
//   console.log(BaseUrl);
//   return new Promise((resolve, reject) => {
//     fetch(BaseUrl, {
//       method: "GET",
//       headers: {
//         Accept: "application/json",
//         "Content-Type": "application/json",
//       },
//     })
//       .then((response) => response.json())
//       .then((responseJson) => {
//         resolve(responseJson);
//       })
//       .catch((error) => {
//         reject(error);
//       });
//   });
// }

export function RegistrarAuditoria(req) {
  const base = process.env.REACT_APP_BASE_URL;

  let BaseUrl = base + "userevent/create_user_event";

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

// AUDITORIA SAP @JR
export function getOficinaVentasSAP(req) {
  const base = process.env.REACT_APP_BASE_URL_SAP;

  let BaseUrl = base + "AuditoriaOfiVentas/Auditoria_OfiVentas";

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
