import React, { useState } from "react";
import BtnSearch from "../../components/BtnSearch";
import InputForm from "../../components/InputForm";
import McCliente from "./Modals/McCliente";
import McOrgVentas from "./Modals/McOrgVentas";
import "./CambioPrecio.css";

const MisSolicitudes = () => {
  // ORG VENTAS
  const [orgVentasValue, setOrgVentasValue] = useState("AGRO");
  const [orgVentas, setOrgVentas] = useState([
    { Sign: "I", Option: "EQ", Low: "", High: "" },
  ]);
  const [showOrgVentas, setShowOrgVentas] = useState(false);

  // CLIENTE
  const [IsCliente, setIsCliente] = useState("");
  const [showMcCliente, setShowMcCliente] = useState(false);

  const openMcOrgVentas = () => {
    setShowOrgVentas((prev) => !prev);
  };

  const openMcCliente = () => {
    setShowMcCliente((prev) => !prev);
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
        />
        <McCliente
          IsCliente={IsCliente}
          setIsCliente={setIsCliente}
          setShowMcCliente={setShowMcCliente}
          showMcCliente={showMcCliente}
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
                  handleChange={""}
                  onClick={() => openMcOrgVentas()}
                />
              </div>
              <div className="align-items-center">
                <label>Descripción de organización de ventas.</label>
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
                    value: "1005141",
                    disabled: false,
                    checked: false,
                    matchcode: true,
                    maxlength: 4,
                  }}
                  handleChange={""}
                  onClick={() => openMcCliente()}
                />
              </div>
              <div className="align-items-center">
                <label>Descripción de cliente.</label>
              </div>
            </div>
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
      ;
    </React.Fragment>
  );
};

export default MisSolicitudes;
