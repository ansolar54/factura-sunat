import React, { useEffect, useState } from "react";
import BtnSearch from "../../../components/BtnSearch";
import Pagination from "../../../components/Pagination";
import Spinner from "../../../components/Spinner";
import { ListadoSolicitudes } from "../../../Services/ServiceCambioPrecio";

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

  useEffect(() => {
    obtenerSolicitudes(1);
  }, []);

  const obtenerSolicitudes = (page) => {
    setspinner(true);
    ListadoSolicitudes("", "", state, limit, page).then((result) => {
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

  return (
    <React.Fragment>
      <div className="container-view">
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
            <div>
              <div className="col-sm-2 d-flex align-items-center">
                <label>Usuario : </label>
              </div>
              <div className="input-box2">
                <select name="id_user" onChange={(e) => {}}>
                  <option value="0">Seleccione...</option>
                  <option value="1">Axelera</option>
                  <option value="2">Elvis Segura</option>
                  <option value="3">Miguel Carrasco</option>
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
                              onClick={() => {}}
                            ></i>
                            {item.state == "2" && (
                              <>
                                <i
                                  style={{ cursor: "pointer", margin: "2px" }}
                                  title="Aprobar solicitud"
                                  className="fa fa-check-circle"
                                  onClick={() => {}}
                                ></i>
                                <i
                                  style={{ cursor: "pointer", margin: "2px" }}
                                  title="Rechazar solicitud"
                                  className="fa fa-minus-circle"
                                  onClick={() => {}}
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
