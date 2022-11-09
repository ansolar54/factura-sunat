import React, { useEffect, useState } from "react";
import BtnSearch from "../../../components/BtnSearch";
import InputForm from "../../../components/InputForm";
import McCliente from "../Modals_General/McCliente";
import McOrgVentas from "../Modals_General/McOrgVentas";
import "./MisSolicitudes.css";
import { ListadoSolicitudes } from "../../../Services/ServiceCambioPrecio";
import Spinner from "../../../components/Spinner";
import Pagination from "../../../components/Pagination";
import ModalDetailSolicitud from "./Modals/ModalDetailSolicitud";

const MisSolicitudes = () => {
  // ORG VENTAS
  const [orgVentasValue, setOrgVentasValue] = useState("");
  const [orgVentasName, setOrgVentasName] = useState("");
  const [orgVentas, setOrgVentas] = useState([
    { Sign: "I", Option: "EQ", Low: "", High: "" },
  ]);
  const [showOrgVentas, setShowOrgVentas] = useState(false);

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
    ListadoSolicitudes(orgVentasValue, IsCliente, state, limit, page).then(
      (result) => {
        // console.log(result);
        setSolicitudes(result.data);
        setTotalData(result.totalItems);
        setspinner(false);
        setvaluepagination(true);
      }
    );
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
    } else {
      return "RECHAZADO";
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
    obtenerSolicitudes(pageNumber);
  };
  // siguiente pagina
  const prevPage = (value) => {
    obtenerSolicitudes(value - 1);
  };
  //pagina anterior
  const nextPage = (value) => {
    obtenerSolicitudes(value + 1);
  };

  const openDetalle = (item) => {
    setIdSolicitud(item.id);
    setStateSolicitud(item.state);
    setShowModalDetail((prev) => !prev);
  };

  return (
    <React.Fragment>
      <div className="container-view">
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
        />
        <ModalDetailSolicitud
          showModalDetail={showModalDetail}
          setShowModalDetail={setShowModalDetail}
          idSolicitud={idSolicitud}
          extraeFecha={extraeFecha}
          stateSolicitud={stateSolicitud}
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
                  <option value="0">Seleccione...</option>
                  <option value="1">Aprobadas</option>
                  <option value="2">Pendientes</option>
                  <option value="3">Rechazadas</option>
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
                          <th style={{ textAlign: "center" }}>
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
                            {/* {item.state == "2" && (
                              <>
                                <i
                                  style={{ cursor: "pointer", margin: "2px" }}
                                  title="Editar solicitud"
                                  className="fas fa-edit"
                                  onClick={() => {}}
                                ></i>
                                <i
                                  style={{ cursor: "pointer", margin: "2px" }}
                                  title="Eliminar solicitud"
                                  className="fas fa-trash-alt"
                                  onClick={() => {}}
                                ></i>
                              </>
                            )} */}
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
