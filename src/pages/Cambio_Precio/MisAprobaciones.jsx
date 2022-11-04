import React from "react";
import BtnSearch from "../../components/BtnSearch";

const MisAprobaciones = () => {
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
                <select name="id_rol" onChange={(e) => {}}>
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
                <select name="id_rol" onChange={(e) => {}}>
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
              onClick={() => {}}
            />
          </div>
        </div>
        <section>
          <div className="container-table">
            <div className="container-table-sm">
              <table className="content-table">
                <thead>
                  <tr>
                    <th style={{ textAlign: "left" }}>N° SOLICITUD</th>
                    <th style={{ textAlign: "left" }}>FECHA REGISTRO</th>
                    <th style={{ textAlign: "left" }}>ESTADO</th>
                    <th style={{ textAlign: "left" }}>CLIENTE</th>
                    <th style={{ textAlign: "left" }}>ORG. VENTAS</th>
                    <th style={{ textAlign: "left" }}>ACCION</th>
                  </tr>
                </thead>
                <tbody>
                  {/* {dataAuditoria.length >= 1
                    ? dataAuditoria.map((item, key) => ( */}
                  <tr key={1}>
                    <th>1010</th>
                    <th>31-10-2022</th>
                    <th>PENDIENTE</th>
                    <th>AXELERA</th>
                    <th>AGRO</th>
                    <th>
                      <i
                        style={{ cursor: "pointer", margin: "2px" }}
                        title="Editar material"
                        className="fas fa-edit"
                        onClick={() => {}}
                      ></i>
                      <i
                        style={{ cursor: "pointer", margin: "2px" }}
                        title="Eliminar material"
                        className="fas fa-trash-alt"
                        onClick={() => {}}
                      ></i>
                    </th>
                  </tr>
                  {/* ))
                    : null} */}
                </tbody>
              </table>
              {/* {spinner==false && dataAuditoria.length == 0 ? (
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
              {spinner && <Spinner />} */}
            </div>
          </div>
        </section>
      </div>
    </React.Fragment>
  );
};

export default MisAprobaciones;
