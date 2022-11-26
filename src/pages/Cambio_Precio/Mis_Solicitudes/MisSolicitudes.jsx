import React, { useEffect, useState } from "react";
import BtnSearch from "../../../components/BtnSearch";
import InputForm from "../../../components/InputForm";
import McCliente from "../Modals_General/McCliente";
import McOrgVentas from "../Modals_General/McOrgVentas";
import "./MisSolicitudes.css";
import {
  ListadoSolicitudes,
  ModificarStateRequest,
  GetDetalleSolicitud,
  EnviarCorreoAprob,
  UsuarioNotifi,
} from "../../../Services/ServiceCambioPrecio";
import Spinner from "../../../components/Spinner";
import Pagination from "../../../components/Pagination";
import ModalDetailSolicitud from "./Modals/ModalDetailSolicitud";
import toast, { Toaster } from "react-hot-toast";
import jwt from "jwt-decode";
import { getMailGerents } from "../../../Services/ServiceUser";

const MisSolicitudes = () => {
  // ORG VENTAS
  const [orgVentasValue, setOrgVentasValue] = useState("");
  const [orgVentasName, setOrgVentasName] = useState("");
  const [orgVentas, setOrgVentas] = useState([
    { Sign: "I", Option: "EQ", Low: "", High: "" },
  ]);
  const [showOrgVentas, setShowOrgVentas] = useState(false);

  // ORG VENTAS FOR MODAL EDIT MATERIAL
  const [orgVentasForModal, setOrgVentasForModal] = useState("");

  // CLIENTE
  const [IsCliente, setIsCliente] = useState("");
  const [isClientName, setIsClientName] = useState("");
  const [showMcCliente, setShowMcCliente] = useState(false);

  // MODAL DETAIL
  const [showModalDetail, setShowModalDetail] = useState(false);
  const [idSolicitud, setIdSolicitud] = useState();
  const [stateSolicitud, setStateSolicitud] = useState();

  // FILTRO ESTADO COMBO: 1=APROBADO, 2=PENDIENTE, 3=RECHAZADO
  const [state, setState] = useState("");

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

  // PARA OBTENER CANAL DE DIST. DE MATCH CLIENTE
  const [canalDistValue, setCanalDistValue] = useState("");

  useEffect(() => {
    obtenerSolicitudes(1);
  }, []);

  const openMcOrgVentas = () => {
    setShowOrgVentas((prev) => !prev);
  };

  const openMcCliente = () => {
    setShowMcCliente((prev) => !prev);
  };

  const obtenerSolicitudes = (page) => {
    setspinner(true);
    ListadoSolicitudes(
      jwt(localStorage.getItem("_token")).nameid,
      orgVentasValue,
      IsCliente,
      state,
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

  const selectedFiltro = (e) => {
    // console.log(typeof e.target.value);
    if (e.target.value == "0") {
      // console.log("zero");
      setState("");
    } else {
      // console.log(e.target.value);
      setState(e.target.value);
    }
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

  function handleChange(name, value) {
    // console.log(value);
    switch (name) {
      case "org_ventas":
        setOrgVentasValue(value);
        break;
      default:
        setIsCliente(value);
        break;
    }
  }

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

  const openDetalle = (item) => {
    // console.log(item);
    setOrgVentasForModal(item.sales_org);
    setIdSolicitud(item.id);
    setStateSolicitud(item.state);
    setShowModalDetail((prev) => !prev);
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

  const anularSolicitud = (state, item) => {
    let model = {
      id: item.id,
      state: state.toString(),
    };
    setspinner(true);
    ModificarStateRequest(model).then((result) => {
      // console.log(result);

      if (result.indicator == 1) {
        GetDetalleSolicitud(item.id).then((result) => {
          if (result.indicator == 1) {
            let detalleCorreo = []; // para llenar tabla detalle de correo de aprobacion
            for (let i = 0; i < result.data.length; i++) {
              const element = result.data[i];
              // console.log(element);

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

            // obteniendo correos de gerentes por org_ventas
            let model_usua_notifi = {
              IsNotif: "1",
              IsUser: "",
              IsVkbur: "",
              IsVkorg: item.sales_org,
            };
            let correos = [];
            UsuarioNotifi(model_usua_notifi).then((result) => {
              if (result.etListusuariosField.length > 0) {
                for (let i = 0; i < result.etListusuariosField.length; i++) {
                  const element = result.etListusuariosField[i];
                  let mails = {
                    email: element.correoField,
                  };
                  correos.push(mails); // se pasa lista de correo de gerentes
                }
                // correos = result.data; // se pasa lista de correo de gerentes

                // notificacion de correo - llamado a servicio
                let model_email_aprob = {
                  state: state, // para identificar aprobacion o rechazo de solicitud en backend
                  nro_solicitud: item.id.toString(),
                  cliente: item.client_name,
                  aprobador: jwt(localStorage.getItem("_token")).user, // se obtiene nombre de usuario de token vendedor = aprobador
                  correos: correos,
                  detalle: detalleCorreo,
                };
                console.log("model_correo", model_email_aprob);
                EnviarCorreoAprob(model_email_aprob).then((result) => {
                  console.log(result);
                  if (result.indicator == 1) {
                    toast.success("Solicitud anulada.", {
                      position: "top-center",
                      autoClose: 1000,
                      style: {
                        backgroundColor: "#212121",
                        color: "#fff",
                      },
                    });
                    obtenerSolicitudes(offset);
                    setspinner(false);
                  } else {
                    setspinner(false);
                  }
                });
              }
            });
          }
        });
      }

      // toast.success(result.message, {
      //   position: "top-center",
      //   autoClose: 1000,
      //   style: {
      //     backgroundColor: "#212121",
      //     color: "#fff",
      //   },
      // });
      // obtenerSolicitudes(offset);
    });
  };

  return (
    <React.Fragment>
      <div className="container-view">
        <Toaster />
        <McOrgVentas
          orgVentasValue={orgVentasValue}
          setOrgVentas={setOrgVentas}
          setOrgVentasValue={setOrgVentasValue}
          setShowOrgVentas={setShowOrgVentas}
          showOrgVentas={showOrgVentas}
          setOrgVentasName={setOrgVentasName}
        />
        <McCliente
          IsCliente={IsCliente}
          setIsCliente={setIsCliente}
          setShowMcCliente={setShowMcCliente}
          showMcCliente={showMcCliente}
          setIsClientName={setIsClientName}
          orgVentasValue={orgVentasValue}
          setCanalDistValue={setCanalDistValue}
        />
        <ModalDetailSolicitud
          showModalDetail={showModalDetail}
          setShowModalDetail={setShowModalDetail}
          idSolicitud={idSolicitud}
          extraeFecha={extraeFecha}
          stateSolicitud={stateSolicitud}
          orgVentas={orgVentasForModal}
        />

        <div className="title-section">
          <label> Mis Solicitudes </label>
          <hr />
        </div>

        <div className="container-form2">
          <div className="container-form1" style={{ width: "90%" }}>
            <div>
              <div className="col-sm-2 d-flex align-items-center">
                <label>Organización de ventas : </label>
              </div>
              <div>
                <InputForm
                  attribute={{
                    name: "org_ventas",
                    type: "text",
                    value: orgVentasValue,
                    disabled: false,
                    checked: false,
                    matchcode: true,
                    maxlength: 4,
                  }}
                  handleChange={handleChange}
                  onClick={() => openMcOrgVentas()}
                />
              </div>
              <div className="align-items-center">
                <label>{orgVentasValue != "" ? orgVentasName : ""}</label>
              </div>
            </div>
            <div>
              <div className="col-sm-2 d-flex align-items-center">
                <label>Cliente : </label>
              </div>
              <div>
                <InputForm
                  attribute={{
                    name: "cliente",
                    type: "text",
                    value: IsCliente,
                    disabled: false,
                    checked: false,
                    matchcode: true,
                    maxlength: 4,
                  }}
                  handleChange={handleChange}
                  onClick={() => openMcCliente()}
                />
              </div>
              <div className="align-items-center">
                <label>{isClientName != "" ? isClientName : ""}</label>
              </div>
            </div>
            <div>
              <div className="col-sm-2 d-flex align-items-center">
                <label>Filtro : </label>
              </div>
              <div className="input-box1">
                <select name="id_state" onChange={(e) => selectedFiltro(e)}>
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
                    <th style={{ textAlign: "center" }}>ORG. VENTAS</th>
                    <th style={{ textAlign: "center" }}>CLIENTE</th>
                    <th style={{ textAlign: "center" }}>ESTADO</th>
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
                          <th style={{ textAlign: "center" }}>
                            {item.sales_org}
                          </th>
                          <th style={{ textAlign: "center" }}>
                            {item.client_name}
                          </th>
                          <th
                            style={{
                              textAlign: "center",
                              color: item.state == "4" ? "red" : "",
                            }}
                          >
                            {validateState(item.state)}
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
                                {/* <i
                                  style={{ cursor: "pointer", margin: "2px" }}
                                  title="Editar solicitud"
                                  className="fas fa-edit"
                                  onClick={() => {}}
                                ></i> */}
                                <i
                                  style={{ cursor: "pointer", margin: "2px" }}
                                  title="Anular solicitud"
                                  className="fas fa-trash-alt"
                                  onClick={() => anularSolicitud(4, item)}
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
      ;
    </React.Fragment>
  );
};

export default MisSolicitudes;
