import React, { useEffect, useState } from "react";
import BtnSearch from "../../../components/BtnSearch";
import Pagination from "../../../components/Pagination";
import Spinner from "../../../components/Spinner";
import {
  AprobSolicitud,
  EnviarCorreoAprob,
  GetDetalleSolicitud,
  ListadoSolicitudes,
  ListadoSolicitudesForAprob,
  ModificarStateRequest,
  UsuarioNotifi,
} from "../../../Services/ServiceCambioPrecio";
import toast, { Toaster } from "react-hot-toast";
import {
  getDistinctUser,
  getUser,
  getUsers,
} from "../../../Services/ServiceUser";
import jwtDecode from "jwt-decode";
import ModalDetailSolicitud from "./Modals/ModalDetailSolicitud";
import jwt from "jwt-decode";

const MisAprobaciones = () => {
  // PAGINATION
  const [limit, setLimit] = useState(5);
  const [offset, setOffset] = useState(1);

  // SOLICITUDES OBJECT
  const [solicitudes, setSolicitudes] = useState([]);

  //CARGA DE SPINNER
  const [spinner, setspinner] = useState(false);
  //ACTIVAR SECCION DE PAGINADO
  const [valuepagination, setvaluepagination] = useState(false);
  //NUMERO TOTAL DE DATOS
  const [TotalData, setTotalData] = useState();

  // FILTRO ESTADO COMBO: 1=APROBADO, 2=PENDIENTE, 3=RECHAZADO
  const [state, setState] = useState("");

  // USERS
  const [users, setUsers] = useState([]);
  const [idUser, setIdUser] = useState(0);

  // MODAL DETAIL
  const [showModalDetail, setShowModalDetail] = useState(false);
  const [idSolicitud, setIdSolicitud] = useState();
  const [stateSolicitud, setStateSolicitud] = useState();

  useEffect(() => {
    obtenerSolicitudes(1);
    getUsers();
  }, []);

  const getUsers = () => {
    getDistinctUser(jwtDecode(localStorage.getItem("_token")).nameid).then(
      (result) => {
        // console.log(result);
        setUsers(result.data);
      }
    );
  };

  const obtenerSolicitudes = (page) => {
    setspinner(true);
    ListadoSolicitudesForAprob(
      idUser,
      state,
      jwt(localStorage.getItem("_token")).sales_org,
      limit,
      page
    ).then((result) => {
      // console.log(result);
      setSolicitudes(result.data);
      setTotalData(result.totalItems);
      setspinner(false);
      setvaluepagination(true);
    });
  };

  const formatFecha = (fecha) => {
    let newDate = "";
    if (fecha != null || fecha != undefined || fecha != "") {
      newDate = fecha.split("-");
    }
    return newDate[2] + "-" + newDate[1] + "-" + newDate[0];
  };

  const extraeFecha = (fecha) => {
    if (fecha.includes("T")) {
      let parts = fecha.split("T");
      return formatFecha(parts[0]);
    } else {
      return formatFecha(fecha);
    }
  };

  const validateState = (state) => {
    if (state == "1") {
      return "APROBADO";
    } else if (state == "2") {
      return "PENDIENTE";
    } else if (state == "3") {
      return "RECHAZADO";
    } else {
      return "ANULADO";
    }
  };

  // PAGINATION
  const changePage = (pageNumber) => {
    setOffset(pageNumber);
    obtenerSolicitudes(pageNumber);
  };
  // siguiente pagina
  const prevPage = (value) => {
    setOffset(value - 1);
    obtenerSolicitudes(value - 1);
  };
  //pagina anterior
  const nextPage = (value) => {
    setOffset(value + 1);
    obtenerSolicitudes(value + 1);
  };

  const formatoFechaForAprob = (fecha) => {
    let parts = fecha.split("T");
    let newDate = parts[0].split("-");
    return newDate[0] + newDate[1] + newDate[2];
  };

  const formatFechaForCorreo = (fecha) => {
    let parts = fecha.split("-");
    return parts[2] + "-" + parts[1] + "-" + parts[0];
  };

  function convertDecimal(num) {
    // return num.toFixed(Math.max(((num+'').split(".")[1]||"").length, 2));
    if (num == null || num == "" || num == "0") {
      return "0.00";
    } else {
      if (num.toString().split(".").length == 2) {
        // console.log( num.toString().split(".")[0].replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d)\.?)/g, ",") + "."+num.toString().split(".")[1]);
        return (
          num
            .toString()
            .split(".")[0]
            .replace(/\D/g, "")
            .replace(/\B(?=(\d{3})+(?!\d)\.?)/g, ",") +
          "." +
          // num.toString().split(".")[1].padStart(2, "0")
          num.toString().split(".")[1].padEnd(2, "0")
        );
      } else {
        // console.log( num.toString().split(".")[0].replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d)\.?)/g, ",") + ".00");
        return (
          num
            .toString()
            .split(".")[0]
            .replace(/\D/g, "")
            .replace(/\B(?=(\d{3})+(?!\d)\.?)/g, ",") + ".00"
        );
      }
    }
  }

  const updateStateRequest = (state, item) => {
    // console.log(item);
    let model = {
      id: item.id,
      state: state.toString(),
    };

    ModificarStateRequest(model).then((result) => {
      // console.log(result);
      setspinner(true);
      if (result.indicator == 1) {
        GetDetalleSolicitud(item.id).then((result) => {
          // console.log(result);

          if (result.indicator == 1) {
            let itMatAprob = [];
            let detalleCorreo = []; // para llenar tabla detalle de correo de aprobacion
            for (let i = 0; i < result.data.length; i++) {
              const element = result.data[i];
              // console.log(element);
              let matAprob = {
                Matnr: element.material,
                Maktx: element.material_name,
                Kbetr: element.actual_price, // reemplazo de suggested_price
                Konwa: element.currency,
                Kpein: element.base_amount,
                Kmein: element.measure_unit,
                Datab: formatoFechaForAprob(element.start_date), // yyyymmdd - formatear
                Datbi: formatoFechaForAprob(element.end_date), // yyyymmdd - formatear
                Mxwrt: element.suggested_price, // reeplazo de lower_limit
                Gkwrt: element.upper_limit,
              };
              itMatAprob.push(matAprob);

              // mapeamos los campos para detalle de correo
              let detalle = {
                producto: element.material_name,
                moneda: element.currency,
                precio: convertDecimal(element.suggested_price.toString()),
                fec_ini: formatFechaForCorreo(element.start_date.split("T")[0]),
                fec_fin: formatFechaForCorreo(element.end_date.split("T")[0]),
              };

              detalleCorreo.push(detalle);
            }

            if (state == 1) {
              let model_aprob = {
                IsKunnr: item.client,
                IsVkorg: item.sales_org,
                ItMatAprobacion: itMatAprob,
              };
              console.log(model_aprob);
              AprobSolicitud(model_aprob).then((result) => {
                console.log(result);
                if (result.etMsgReturnField[0].successField == "X") {
                  // let email_solicitante = "";
                  // obteniendo correo de solicitante
                  // console.log(item.id_user);
                  getUser(item.id_user).then((result) => {
                    // console.log(result.data[0].email);
                    if (result.indicator == 1) {
                      // email_solicitante = result.data[0].email;
                      // notificacion de correo - llamado a servicio
                      let model_usua_notifi = {
                        IsNotif: "2",
                        IsUser: result.data[0].username,
                        IsVkbur: item.sales_ofi,
                        IsVkorg: "",
                      };
                      let correos = [];
                      console.log(model_usua_notifi);
                      UsuarioNotifi(model_usua_notifi).then((result) => {
                        if (result.etListusuariosField.length > 0) {
                          for (
                            let i = 0;
                            i < result.etListusuariosField.length;
                            i++
                          ) {
                            const element = result.etListusuariosField[i];
                            if (element.correoField !== "") {
                              let mails = {
                                email: element.correoField,
                              };
                              correos.push(mails); // se pasa lista de correo de gerentes
                            }
                          }

                          let model_email_aprob = {
                            state: state, // para identificar aprobacion o rechazo de solicitud en backend
                            cliente: item.client_name,
                            aprobador: jwt(localStorage.getItem("_token")).user, // se obtiene nombre de usuario de token vendedor = aprobador
                            correos: correos,
                            detalle: detalleCorreo,
                          };
                          console.log("model_correo", model_email_aprob);
                          EnviarCorreoAprob(model_email_aprob).then(
                            (result) => {
                              console.log(result);
                              if (result.indicator == 1) {
                                toast.success(
                                  "Solicitud aprobada correctamente.",
                                  {
                                    position: "top-center",
                                    autoClose: 1000,
                                    style: {
                                      backgroundColor: "#212121",
                                      color: "#fff",
                                    },
                                  }
                                );
                                obtenerSolicitudes(offset);
                                setspinner(false);
                              } else {
                                setspinner(false);
                              }
                            }
                          );
                        }
                      });
                    }
                  });
                  // -------------------------
                } else {
                  toast.success(result.etMsgReturnField[0].messageField, {
                    position: "top-center",
                    autoClose: 1000,
                    style: {
                      backgroundColor: "#212121",
                      color: "#fff",
                    },
                  });
                }
              });
            } else {
              getUser(item.id_user).then((result) => {
                // console.log(result.data[0].email);
                if (result.indicator == 1) {
                  // email_solicitante = result.data[0].email;
                  // notificacion de correo - llamado a servicio

                  let model_usua_notifi = {
                    IsNotif: "2",
                    IsUser: result.data[0].username,
                    IsVkbur: item.sales_ofi,
                    IsVkorg: "",
                  };
                  let correos = [];
                  console.log(model_usua_notifi);
                  UsuarioNotifi(model_usua_notifi).then((result) => {
                    if (result.etListusuariosField.length > 0) {
                      for (
                        let i = 0;
                        i < result.etListusuariosField.length;
                        i++
                      ) {
                        const element = result.etListusuariosField[i];
                        if (element.correoField !== "") {
                          let mails = {
                            email: element.correoField,
                          };
                          correos.push(mails); // se pasa lista de correo de gerentes
                        }
                      }

                      let model_email_aprob = {
                        state: state, // para identificar aprobacion o rechazo de solicitud en backend
                        cliente: item.client_name,
                        aprobador: jwt(localStorage.getItem("_token")).user, // se obtiene nombre de usuario de token vendedor = aprobador
                        correos: correos,
                        detalle: detalleCorreo,
                      };
                      console.log(model_email_aprob);
                      EnviarCorreoAprob(model_email_aprob).then((result) => {
                        console.log(result);
                        if (result.indicator == 1) {
                          toast.success("Solicitud rechazada correctamente.", {
                            position: "top-center",
                            autoClose: 1000,
                            style: {
                              backgroundColor: "#212121",
                              color: "#fff",
                            },
                          });
                          setspinner(false);
                          obtenerSolicitudes(offset);
                        } else {
                          setspinner(false);
                        }
                      });
                    }
                  });
                }
              });
              // -------------------------
            }
          }
        });
      } else {
        let validate = state == 1 ? "aprobar" : "rechazar";
        toast.error("No se puedo " + validate + " la solicitud.", {
          position: "top-center",
          autoClose: 1000,
          style: {
            backgroundColor: "#212121",
            color: "#fff",
          },
        });
        setspinner(false);
      }
    });
  };

  const selectedItem = (e) => {
    // console.log(e.target.name, " - ", e.target.value);
    if (e.target.name == "id_user") {
      if (e.target.value == "0") {
        // console.log("zero");
        setIdUser(0);
      } else {
        // console.log(e.target.value);
        setIdUser(e.target.value);
      }
    } else {
      if (e.target.value == "0") {
        // console.log("zero");
        setState("");
      } else {
        // console.log(e.target.value);
        setState(e.target.value);
      }
    }
  };

  const openDetalle = (item) => {
    setIdSolicitud(item.id);
    setStateSolicitud(item.state);
    setShowModalDetail((prev) => !prev);
  };

  return (
    <React.Fragment>
      <div className="container-view">
        <Toaster />
        <ModalDetailSolicitud
          showModalDetail={showModalDetail}
          setShowModalDetail={setShowModalDetail}
          idSolicitud={idSolicitud}
          extraeFecha={extraeFecha}
          stateSolicitud={stateSolicitud}
        />
        <div className="title-section">
          <label> Mis Aprobaciones </label>
          <hr />
        </div>
        <div className="container-form2">
          <div className="container-form1" style={{ width: "90%" }}>
            <div>
              <div className="col-sm-2 d-flex align-items-center">
                <label>Filtro : </label>
              </div>
              <div className="input-box1">
                <select name="id_state" onChange={(e) => selectedItem(e)}>
                  <option value="0">TODOS</option>
                  <option value="1">APROBADO</option>
                  <option value="2">PENDIENTE</option>
                  <option value="3">RECHAZADO</option>
                  <option value="4">ANULADO</option>
                  {/* {roles.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))} */}
                </select>
              </div>
            </div>
            <div>
              <div className="col-sm-2 d-flex align-items-center">
                <label>Usuario : </label>
              </div>
              <div className="input-box2">
                <select name="id_user" onChange={(e) => selectedItem(e)}>
                  <option value="0">Seleccione...</option>
                  {users.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name + " " + item.ape_pat + " " + item.ape_mat}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div
            style={{
              flex: 1,
              alignSelf: "center",
            }}
          >
            <BtnSearch
              attribute={{
                name: "Buscar",
                classNamebtn: "btn_search",
              }}
              onClick={() => obtenerSolicitudes(1)}
            />
          </div>
        </div>
        <section>
          <div className="container-table">
            <div className="container-table-sm">
              <table className="content-table">
                <thead>
                  <tr>
                    <th style={{ textAlign: "center" }}>N° SOLICITUD</th>
                    <th style={{ textAlign: "center" }}>FECHA REGISTRO</th>
                    <th style={{ textAlign: "center" }}>ESTADO</th>
                    <th style={{ textAlign: "center" }}>CLIENTE</th>
                    <th style={{ textAlign: "center" }}>ORG. VENTAS</th>
                    <th style={{ textAlign: "center" }}>ACCION</th>
                  </tr>
                </thead>
                <tbody>
                  {solicitudes.length >= 1
                    ? solicitudes.map((item, key) => (
                        <tr key={item.id}>
                          <th style={{ textAlign: "center" }}>{item.id}</th>
                          <th style={{ textAlign: "center" }}>
                            {extraeFecha(item.created_at)}
                          </th>
                          <th
                            style={{
                              textAlign: "center",
                              color: item.state == "4" ? "red" : "",
                            }}
                          >
                            {validateState(item.state)}
                          </th>
                          <th style={{ textAlign: "center" }}>
                            {item.client_name}
                          </th>
                          <th style={{ textAlign: "center" }}>
                            {item.sales_org}
                          </th>
                          <th
                            style={{
                              textAlign: "center",
                            }}
                          >
                            <i
                              style={{ cursor: "pointer", margin: "2px" }}
                              title="Ver detalle"
                              className="fa fa-bars"
                              onClick={() => openDetalle(item)}
                            ></i>
                            {item.state == "2" && (
                              <>
                                <i
                                  style={{ cursor: "pointer", margin: "2px" }}
                                  title="Aprobar solicitud"
                                  className="fa fa-check-circle"
                                  onClick={() => updateStateRequest(1, item)}
                                ></i>
                                <i
                                  style={{ cursor: "pointer", margin: "2px" }}
                                  title="Rechazar solicitud"
                                  className="fa fa-minus-circle"
                                  onClick={() => updateStateRequest(3, item)}
                                ></i>
                              </>
                            )}
                          </th>
                        </tr>
                      ))
                    : null}
                </tbody>
              </table>
              {spinner == false && solicitudes.length == 0 ? (
                <div
                  style={{
                    margin: "10px",
                    textAlign: "center",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  No se encontraron resultados.
                </div>
              ) : null}
              {spinner && <Spinner />}
            </div>
          </div>
        </section>
        <div>
          {valuepagination && (
            <Pagination
              postsPerPage={limit}
              totalPosts={TotalData}
              changePage={changePage}
              prevPage={prevPage}
              nextPage={nextPage}
            />
          )}
        </div>
      </div>
    </React.Fragment>
  );
};

export default MisAprobaciones;
