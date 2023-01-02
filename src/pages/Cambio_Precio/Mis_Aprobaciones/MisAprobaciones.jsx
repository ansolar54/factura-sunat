import React, { useEffect, useState, useRef } from "react";
import BtnSearch from "../../../components/BtnSearch";
import Pagination from "../../../components/Pagination";
import Spinner from "../../../components/Spinner";
import InputForm from "../../../components/InputForm";
import Dialog from "../Dialog";
import {
  AprobSolicitud,
  EnviarCorreoAprob,
  GetDetalleSolicitud,
  ListadoSolicitudes,
  ListadoSolicitudesForAprob,
  ModificarStateRequest,
  UpdateDetailRequestLastAprobRequest,
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
import McOrgVentas from "../Modals_General/McOrgVentas";
import jwt from "jwt-decode";
import ModalEditMaterial from "./Modals/ModalEditMaterial";

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
  const [idUserForModal, setIdUserForModal] = useState(0);
  //const [orgVentasName, setOrgVentasName] = useState("");
  const [salesOfi, setSalesOfi] = useState("");
  const [orgVentasDescForModal, setOrgVentasDescForModal] = useState("");

  // PARAMETROS PARA APROBAR - MODIFICAR

  const [codi_clientForModal, setcodi_clientForModal] = useState(0);
  const [org_ventasForModal, setorg_ventasForModal] = useState("");
  const [itMatAprobForModal, setitMatAprobForModal] = useState([]);

  // NUEVOS PARAMETROS PARA FILTRAR SOLICITUD
  const [nroSolicitud, setNroSolicitud] = useState(0);
  const [filtroFechas, setFiltroFechas] = useState({
    created_at: "",
    created_up: "",
  });
  const [orgVentasValue, setOrgVentasValue] = useState("");
  const [orgVentasName, setOrgVentasName] = useState("");
  const [showOrgVentas, setShowOrgVentas] = useState(false);
  const [orgVentas, setOrgVentas] = useState([
    { Sign: "I", Option: "EQ", Low: "", High: "" },
  ]);

  useEffect(() => {
    obtenerSolicitudes(1);
    getUsers();
  }, []);

  const openMcOrgVentas = () => {
    setShowOrgVentas((prev) => !prev);
  };

  const getUsers = () => {
    getDistinctUser(jwtDecode(localStorage.getItem("_token")).nameid, 2).then(
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
      orgVentasValue,
      // jwt(localStorage.getItem("_token")).sales_org,
      nroSolicitud,
      filtroFechas.created_at,
      filtroFechas.created_up,
      limit,
      page
    ).then((result) => {
      console.log(result);
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
    console.log("probando item", item);
    let model = {
      id: item.id,
      state: state.toString(),
      id_manager: Number(jwt(localStorage.getItem("_token")).nameid)
    };

    // let nro_solicitud = '';
    ModificarStateRequest(model).then((result) => {
      // console.log(result);
      setspinner(true);

      if (result.indicator == 1) {
        GetDetalleSolicitud(item.id).then((result) => {
          // console.log(result);

          if (result.indicator == 1) {
            let itMatAprob = [];

            let detalleCorreo = []; // para llenar tabla detalle de correo de aprobacion
            let detailMaterial = []; // ARREGLO DE DETALLE MATERIAL PARA SU MODIFICACION EN BD
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
              //setitMatAprobForModal(matAprob);

              //console.log("itMatAprob222222",itMatAprobForModal);


              // mapeamos los campos para detalle de correo
              let detalle = {
                producto: element.material_name,
                moneda: element.currency,
                precio: convertDecimal(element.suggested_price.toString()),
                fec_ini: formatFechaForCorreo(element.start_date.split("T")[0]),
                fec_fin: formatFechaForCorreo(element.end_date.split("T")[0]),
              };

              detalleCorreo.push(detalle);

              // nro_solicitud = element.id_request;
              //  MODEL FROM EDIT DETAIL MATERIAL
              let material = {
                id: element.id,
                suggested_price: Number(element.actual_price),
                lower_limit: element.suggested_price,
              };
              detailMaterial.push(material);
            }



            if (state == 1) {
              let model_aprob = {
                IsKunnr: item.client,
                IsVkorg: item.sales_org,
                ItMatAprobacion: itMatAprob,
              };
              console.log("MODEL CORREOOOOOO", model_aprob);
              AprobSolicitud(model_aprob).then((result) => {
                console.log(result);
                if (result.etMsgReturnField[0].successField == "X") {
                  // let email_solicitante = "";
                  // modificacion de detalle de solicitud en base de datos
                  UpdateDetailRequestLastAprobRequest({
                    detailMaterial: detailMaterial,
                  }).then((result) => {
                    console.log("result modify detail", result);
                  });
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
                          // provisional
                          let mails = {
                            email: "gnieri@farmex.com.pe",
                            //email: "ansolar54@gmail.com",
                          };
                          let model_email_aprob = {
                            state: state, // para identificar aprobacion o rechazo de solicitud en backend
                            nro_solicitud: item.id.toString(),
                            cliente: item.client_name,
                            aprobador: jwt(localStorage.getItem("_token")).user, // se obtiene nombre de usuario de token vendedor = aprobador
                            org_ventas: item.sales_org_desc,
                            correos: [mails],
                            detalle: detalleCorreo,
                          };
                          console.log("model_correo", model_email_aprob);
                          EnviarCorreoAprob(model_email_aprob).then(
                            (result) => {
                              console.log(result);
                              if (result.indicator == 1) {
                                toast.success(
                                  "Solicitud N° " + model_email_aprob.nro_solicitud +" aprobada correctamente.",
                                  {
                                    position: "top-center",
                                    autoClose: 6000,
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
                      // provisional
                      let mails = {
                        email: "gnieri@farmex.com.pe",
                        //email: "ansolar54@gmail.com",

                      };

                      let model_email_aprob = {
                        state: state, // para identificar aprobacion o rechazo de solicitud en backend
                        nro_solicitud: item.id.toString(),
                        cliente: item.client_name,
                        aprobador: jwt(localStorage.getItem("_token")).user, // se obtiene nombre de usuario de token vendedor = aprobador
                        correos: [mails],
                        org_ventas: item.sales_org_desc,
                        detalle: detalleCorreo,
                      };
                      console.log(model_email_aprob);
                      EnviarCorreoAprob(model_email_aprob).then((result) => {
                        console.log(result);
                        if (result.indicator == 1) {
                          toast.success("Solicitud N° " + model_email_aprob.nro_solicitud +" rechazada.", {
                            position: "top-center",
                            autoClose: 6000,
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
        toast.error("No se pudo " + validate + " la solicitud.", {
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

  const handleChange1 = (e) => {
    setFiltroFechas({ ...filtroFechas, [e.target.name]: e.target.value });
  };

  function handleChange(name, value) {
    // console.log(value);
    switch (name) {
      case "nroSolicitud":
        setNroSolicitud(Number(value));
        break;
      case "org_ventas":
        setOrgVentasValue(value);
        break;
    }
  }

  //RECHAZAR SOLICITUD DIALOG
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

    handleDialog("¿Seguro de rechazar la solicitud?", true, "");
    itemRef.current = item;
  };
  const areUSureDelete = (choose) => {
    console.log(choose);
    if (choose) {
      updateStateRequest(3, itemRef.current)
      //anularSolicitud(4, itemRef.current)
      handleDialog("", false);
    } else {
      handleDialog("", false);
    }
  };

  //APROBAR SOLICITUD DIALOG
  const [dialog1, setDialog1] = useState({
    message: "",
    isLoading: false,
    //Update
    nameProduct: "",
  });
  const itemRef1 = useRef();
  const handleDialog1 = (message, isLoading, nameProduct) => {
    setDialog1({
      message,
      isLoading,
      //Update
      nameProduct,
    });
  };
  const handleApprove = (item) => {
    //Update
    // const index = data.findIndex((p) => p.id === id);

    handleDialog1("¿Seguro de aprobar la solicitud?", true, "");
    itemRef1.current = item;
  };
  const areUSureApprove = (choose) => {
    console.log(choose);
    if (choose) {
      updateStateRequest(1, itemRef1.current)
      //anularSolicitud(4, itemRef.current)
      handleDialog1("", false);
    } else {
      handleDialog1("", false);
    }
  };

  const openDetalle = (item) => {
    setIdSolicitud(item.id);
    setStateSolicitud(item.state);
    setIdUserForModal(item.id_user);
    setSalesOfi(item.sales_ofi);
    setOrgVentasDescForModal(item.sales_org_desc);
    setShowModalDetail((prev) => !prev);
    setcodi_clientForModal(item.client);
    setorg_ventasForModal(item.sales_org);
    //setitMatAprobForModal(itMatAprob);
    setitMatAprobForModal(itMatAprobForModal);
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
        <ModalDetailSolicitud
          showModalDetail={showModalDetail}
          setShowModalDetail={setShowModalDetail}
          idSolicitud={idSolicitud}
          extraeFecha={extraeFecha}
          stateSolicitud={stateSolicitud}
          idUser={idUserForModal}
          salesOfi={salesOfi}
          orgVentasDesc={orgVentasDescForModal}
          codi_client={codi_clientForModal}
          org_ventas={org_ventasForModal}
          itMatAprob={itMatAprobForModal}
          obtenerSolicitudesF = {obtenerSolicitudes}
        />
        <McOrgVentas
          orgVentasValue={orgVentasValue}
          setOrgVentas={setOrgVentas}
          setOrgVentasValue={setOrgVentasValue}
          setShowOrgVentas={setShowOrgVentas}
          showOrgVentas={showOrgVentas}
          setOrgVentasName={setOrgVentasName}
        />
        <div className="title-section">
          <div>
            <label> Cambio Precio / Mis Aprobaciones </label>
            <label>
              {" "}
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
                <label>Estado : </label>
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
            <div >
              <div className="col-sm-2 d-flex align-items-center">
                <label>Fecha (Desde) : </label>
              </div>
              <div className="input-box1">
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
              <div className="input-box2">
                <input
                  className="inputcustom"
                  type="date"
                  name="created_up"
                  onChange={(e) => handleChange1(e)}
                />
              </div>
            </div>
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
                    disabled: true,
                    checked: false,
                    matchcode: true,
                    maxlength: 4,
                  }}
                  handleChange={handleChange}
                  onClick={() => openMcOrgVentas()}
                />
              </div>
              {/* <div className="align-items-center">
                <label>{orgVentasValue != "" ? orgVentasName : ""}</label>
              </div> */}

              <div className="col-sm-2 d-flex align-items-center">
                <label>O. V. Descripción : </label>
              </div>
              <div className="input-box2">
                <input
                  className="inputcustom"
                  type="search"
                  name="orgventasdesc"
                  value={orgVentasValue != "" ? orgVentasName : ""}
                  readOnly="disabled"
                  placeholder="--"
                  onChange={(e) => handleChange(e)}
                />
              </div>
            </div>
            <div>
              {/* style={{ fontWeight: "bold" }} */}
              <div className="col-sm-2 d-flex align-items-center">
                <label>N° Solicitud :</label>
              </div>
              <div className="">
                <InputForm
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
              <div className="col-md-5 input-box2 mt-0">

              </div>

            </div>

          </div>
          <div
            style={{
              flex: 1,
              alignSelf: "center",
              marginTop: "0px"
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
                    <th style={{ textAlign: "center" }}>USUARIO</th>
                    <th style={{ textAlign: "center" }}>FECHA SOLICITUD</th>
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
                          {item.user}
                        </th>
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
                              <i
                                style={{ cursor: "pointer", margin: "6px" }}
                                title="Aprobar solicitud"
                                className="fa fa-check-circle fa-lg"
                                onClick={() => handleApprove(item)
                                  //updateStateRequest(1, item)
                                }
                              ></i>
                              <i
                                style={{ cursor: "pointer", margin: "6px" }}
                                title="Rechazar solicitud"
                                className="fa fa-minus-circle fa-lg"
                                onClick={() => handleDelete(item)
                                  //updateStateRequest(3, item)
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
          {dialog1.isLoading && (
            <Dialog
              //Update
              nameProduct={dialog1.nameProduct}
              onDialog={areUSureApprove}
              message={dialog1.message}
            />
          )}
        </div>
      </div>
    </React.Fragment>
  );
};

export default MisAprobaciones;
