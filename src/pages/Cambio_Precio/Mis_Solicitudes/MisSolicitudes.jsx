import React, { useEffect, useState,useRef } from "react";
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
import Dialog from "../Dialog";
import { getMailGerents } from "../../../Services/ServiceUser";
import InputForm1 from "../../../components/InputForm1";

const MisSolicitudes = () => {
  // ORG VENTAS
  const [orgVentasValue, setOrgVentasValue] = useState("");
  const [orgVentasName, setOrgVentasName] = useState("");
  const [orgVentas, setOrgVentas] = useState([
    { Sign: "I", Option: "EQ", Low: "", High: "" },
  ]);
  const [showOrgVentas, setShowOrgVentas] = useState(false);
  // NUEVOS PARAMETROS PARA FILTRAR SOLICITUD
  const [nroSolicitud, setNroSolicitud] = useState(0);
  const [filtroFechas, setFiltroFechas] = useState({
    created_at: "",
    created_up: "",
  });

  // ORG VENTAS FOR MODAL EDIT MATERIAL
  const [orgVentasForModal, setOrgVentasForModal] = useState("");
  const [orgVentasDescForModal, setOrgVentasDescForModal] = useState("");

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
  const [CanalDistDescValue, setCanalDistDescValue] = useState("");

  // OBTENER OFICINA DE VENTAS PARA REGISTRAR EN TB_REQUEST
  const [ofiVentas, setOfiVentas] = useState("");

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
      nroSolicitud,
      filtroFechas.created_at,
      filtroFechas.created_up,
      limit,
      page,
      console.log(filtroFechas.created_up)
    ).then((result) => {
      console.log("TABLA MIS SOLICITUDES", result);
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
    } else if (state == "2" || state == "5" || state == "6") {
      return "PENDIENTE";
    } else if (state == "3") {
      return "RECHAZADO";
    } else {
      return "ANULADO";
    }
  };

  const handleChange1 = (e) => {
    setFiltroFechas({ ...filtroFechas, [e.target.name]: e.target.value });
  };

  function handleChange(name, value) {
    // console.log(value);
    switch (name) {
      case "org_ventas":
        setOrgVentasValue(value);
        break;
      case "nroSolicitud":
        setNroSolicitud(Number(value));
        break;
      default:
        setIsCliente(value);
        break;
    }
  }

  //ANULAR SOLICITUD DIALOG
  const [dialog, setDialog] = useState({
    message: "",
    isLoading: false,
    //Update
    nameProduct: "",
  });
  const itemRef = useRef();
  const handleDialog = (message, isLoading, nameProduct) => {
    setDialog({
      message,
      isLoading,
      //Update
      nameProduct,
    });
  };
  const handleDelete = (item) => {
    //Update
    // const index = data.findIndex((p) => p.id === id);

    handleDialog("¿Seguro de anular la solicitud?", true, "");
    itemRef.current = item;
  };

  const areUSureDelete = (choose) => {
    console.log(choose);
    if (choose) {
      anularSolicitud(4, itemRef.current)
      handleDialog("", false);
    } else {
      handleDialog("", false);
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

  const openDetalle = (item) => {
    console.log("ITEM SOLICITUD", item);
    setOrgVentasForModal(item.sales_org);
    setOrgVentasDescForModal(item.sales_org_desc);
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
    console.log("viendo item", item);
    let model = {
      id: item.id,
      state: state.toString(),
    };
    setspinner(true);
    ModificarStateRequest(model).then((result) => {
      console.log("estado - anulado", result);

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
                // provisional
                let mails = {
                  email: "amendozac@farmex.com.pe",
                  //email: "ansolar54@gmail.com",
                };

                // notificacion de correo - llamado a servicio
                let model_email_aprob = {
                  state: state, // para identificar aprobacion o rechazo de solicitud en backend
                  nro_solicitud: item.id.toString(),
                  cliente: item.client_name,
                  aprobador: jwt(localStorage.getItem("_token")).user, // se obtiene nombre de usuario de token vendedor = aprobador
                  correos: [mails],
                  org_ventas: item.sales_org_desc,
                  detalle: detalleCorreo,
                };
                console.log("model_correo_solicitud", model_email_aprob);
                EnviarCorreoAprob(model_email_aprob).then((result) => {
                  console.log(result);
                  if (result.indicator == 1) {
                    toast.success("Solicitud N° " +model_email_aprob.nro_solicitud + " anulada.", {
                      position: "top-center",
                      autoClose: 6000,
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

  const getDateAct = () => {
    let date = new Date();

    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    if (month < 10) {
      return `${day}/0${month}/${year}`;
      // console.log(`${day}-0${month}-${year}`);
    } else {
      return `${day}/${month}/${year}`;
      // console.log(`${day}-${month}-${year}`);
    }
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
          setCanalDistDescValue={setCanalDistDescValue}
          setOfiVentas={setOfiVentas}
        />
        <ModalDetailSolicitud
          showModalDetail={showModalDetail}
          setShowModalDetail={setShowModalDetail}
          idSolicitud={idSolicitud}
          extraeFecha={extraeFecha}
          stateSolicitud={stateSolicitud}
          orgVentas={orgVentasForModal}
          orgVentasDesc={orgVentasDescForModal}
        />

        <div className="title-section">
          <div>
            <label>Cambio Precio / Mis Solicitudes </label>
            <label >
              Tipo de cambio :{" "}
              <i style={{ color: "#008040" }} class="fas fa-dollar-sign"></i>{" "}
              <label style={{ color: "#008040", fontSize: "17px" }}>
                {localStorage.getItem("_tipoCambio")}
              </label>{" "}
            </label>
          </div>
          <div style={{ justifyContent: "flex-end", display: "flex" }} className="col-md-12">
            <label>
              {" "}
              Fecha :{" "}
              {/* <i class="fas fa-dollar-sign"></i> {" "}:{" "} */}
              <label style={{ color: "#008040" }}>
                {getDateAct()}
              </label>{" "}
            </label>
          </div>
          <hr />
        </div>

        <div className="container-form2">
          <div className="container-form1" style={{ width: "90%" }}>
            <div>
              <div className="col-sm-2 d-flex align-items-center">
                <label>Organización de ventas : </label>
              </div>
              <div style={{ marginRight: "40px" }}>
                <InputForm1
                  attribute={{
                    name: "org_ventas",
                    type: "text",
                    value: orgVentasValue,
                    disabled: true,
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
              <div style={{ marginRight: "40px" }}>
                <InputForm1
                  attribute={{
                    name: "cliente",
                    type: "text",
                    value: IsCliente,
                    disabled: true,
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
                <label>Estado : </label>
              </div>
              <div className="input-box1" style={{ marginRight: "40px" }}>
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
              <div className="col-md-6">
                {/* style={{ fontWeight: "bold" }} */}
                <div className="col-sm-4 d-flex align-items-center">
                  <label>N° Solicitud :</label>
                </div>

                <div className="">
                  <InputForm1
                    attribute={{
                      name: "nroSolicitud",
                      type: "text",
                      value: nroSolicitud,
                      disabled: false,
                      checked: false,

                    }}
                    handleChange={handleChange}
                    onChange={(e) => handleChange(e)}
                  />
                </div>

              </div>
            </div>
            <div >
              <div className="col-sm-2 d-flex align-items-center">
                <label>Fecha (Desde) : </label>
              </div>
              <div className="input-box1" style={{ marginRight: "40px" }}>
                <input
                  className="inputcustom"
                  type="date"
                  name="created_at"
                  onChange={(e) => handleChange1(e)}
                />
              </div>
              <div className=" col-sm-2 d-flex align-items-center">
                <label>Fecha (Hasta) : </label>
              </div>
              <div className="input-box1">
                <input
                  className="inputcustom"
                  type="date"
                  name="created_up"
                  onChange={(e) => handleChange1(e)}
                />
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
                        <th style={{ textAlign: "left" }}>
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
                            style={{ cursor: "pointer", margin: "6px" }}
                            title="Ver detalle"
                            className="fa fa-bars fa-lg"
                            onClick={() => openDetalle(item)}
                          ></i>
                          {(item.state == "2") && (
                            <>
                              {/* <i
                                  style={{ cursor: "pointer", margin: "2px" }}
                                  title="Editar solicitud"
                                  className="fas fa-edit"
                                  onClick={() => {}}
                                ></i> */}
                              <i
                                style={{ cursor: "pointer", margin: "6px" }}
                                title="Anular solicitud"
                                className="fas fa-trash-alt fa-lg"
                                onClick={() => handleDelete(item)
                                  //anularSolicitud(4, item)
                                }
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
          {dialog.isLoading && (
          <Dialog
            //Update
            nameProduct={dialog.nameProduct}
            onDialog={areUSureDelete}
            message={dialog.message}
          />
        )}
        </div>
      </div>
      ;
    </React.Fragment>
  );
};

export default MisSolicitudes;
