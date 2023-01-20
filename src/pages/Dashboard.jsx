import React, { Component, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";
import { ValidarUsuarioSAP } from "../Services/ServiceValidaUsuario";
import { getUser } from "../Services/ServiceUser";
import Spinner from "../components/Spinner";
import jwt from "jwt-decode";
import ChangeStatusPassword from "../components/ChangeStatusPassword/ChangeStatusPassword";
import { ConfiPerfiles } from "../Services/ServiceCambioPrecio";
const Dashboard = () => {
  document.body.classList.remove("body-green");
  document.body.classList.add("body-light");

  //CARGA DE SPINNER
  const [spinner, setspinner] = useState(false);

  //para el cambio de contraseña
  const [show_status_password, setshow_status_password] = useState(false);

  // CONTROL DE ACCESO A ITEMS DE MENUS
  const [usuarios, setUsuarios] = useState(false);
  const [roles, setRoles] = useState(false);
  const [auditoria, setAuditoria] = useState(false);
  const [configuracion, setConfiguracion] = useState(false);
  const [consPedidos, setConsPedidos] = useState(false);
  const [consStock, setConsStock] = useState(false);
  const [promociones, setPromociones] = useState(false);
  const [infoCliente, setInfoCliente] = useState(false);
  const [estadoCuenta, setEstadoCuenta] = useState(false);
  const [reporteDespacho, setReporteDespacho] = useState(false);
  const [listaPrecio, setListaPrecio] = useState(false);


  const [generarSolicitud, setGenerarSolicitud] = useState(false);
  const [misSolicitudes, setMisSolicitudes] = useState(false);
  const [misAprobaciones, setMisAprobaciones] = useState(false);
  const [reporteSolicitud, setReporteSolicitud] = useState(false);

  const [modAdministracion, setModAdministracion] = useState(false);
  const [modReportes, setModReportes] = useState(false);
  const [modCambioPrecio, setModCambioPrecio] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("_token")) {
      //valida para el nuevo cambio de contraseña
      getUser(jwt(localStorage.getItem("_token")).nameid).then((result) => {
        console.log(result.data[0].status_password);
        if (result.data[0].status_password === "1") {
          setshow_status_password(true);
        } else {
          setshow_status_password(false);
        }
      });

      setspinner(true);
      getUser(jwt(localStorage.getItem("_token")).nameid).then((result) => {
        // rol 1 -- adminsitrador
        // rol 2 -- supervisor
        // rol 3 -- gerente
        let model_perfil = {
          IsOpcion: "L",
          IsRol: result.data[0].id_role.toString(),
          IsUser: "",
          ItPerfil: [],
        };
        ConfiPerfiles(model_perfil).then((result) => {
          console.log("HOLA AARON", result);
          if (result.etPerfilField.length > 0) {
            for (let i = 0; i < result.etPerfilField.length; i++) {
              const element = result.etPerfilField[i];
              if (element.grupoField == "1") {
                if (
                  element.idModuloField == "AUD" &&
                  element.activeField == "X"
                ) {
                  setAuditoria(true);
                  setModAdministracion(true);
                }

                if (
                  element.idModuloField == "CONF" &&
                  element.activeField == "X"
                ) {
                  setConfiguracion(true);
                  setModAdministracion(true);
                }

                if (
                  element.idModuloField == "ROL" &&
                  element.activeField == "X"
                ) {
                  setRoles(true);
                  setModAdministracion(true);
                }

                if (
                  element.idModuloField == "USU" &&
                  element.activeField == "X"
                ) {
                  setUsuarios(true);
                  setModAdministracion(true);
                }
              }

              if (element.grupoField == "2") {
                if (
                  element.idModuloField == "R01" &&
                  element.activeField == "X"
                ) {
                  setConsPedidos(true);
                  setModReportes(true);
                }

                if (
                  element.idModuloField == "R02" &&
                  element.activeField == "X"
                ) {
                  setConsStock(true);
                  setModReportes(true);
                }

                if (
                  element.idModuloField == "R03" &&
                  element.activeField == "X"
                ) {
                  setPromociones(true);
                  setModReportes(true);
                }

                if (
                  element.idModuloField == "R04" &&
                  element.activeField == "X"
                ) {
                  setInfoCliente(true);
                  setModReportes(true);
                }

                if (
                  element.idModuloField == "R05" &&
                  element.activeField == "X"
                ) {
                  setEstadoCuenta(true);
                  setModReportes(true);
                }

                if (
                  element.idModuloField == "R06" &&
                  element.activeField == "X"
                ) {
                  setReporteDespacho(true);
                  setModReportes(true);
                }
                if (
                  element.idModuloField == "R07" &&
                  element.activeField == "X"
                ) {
                  setListaPrecio(true);
                  setModReportes(true);
                }
              }

              if (element.grupoField == "3") {
                if (
                  element.idModuloField == "CP01" &&
                  element.activeField == "X"
                ) {
                  setGenerarSolicitud(true);
                  setModCambioPrecio(true);
                }

                if (
                  element.idModuloField == "CP02" &&
                  element.activeField == "X"
                ) {
                  setMisSolicitudes(true);
                  setModCambioPrecio(true);
                }

                if (
                  element.idModuloField == "CP03" &&
                  element.activeField == "X"
                ) {
                  setMisAprobaciones(true);
                  setModCambioPrecio(true);
                }
                if (
                  element.idModuloField == "CP04" &&
                  element.activeField == "X"
                ) {
                  setReporteSolicitud(true);
                  setModCambioPrecio(true);
                }
              }
            }
          }
          setspinner(false);
        });
      });
    }
  }, []);

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
    <>
      {show_status_password ? (
        <ChangeStatusPassword
          setshow_status_password={setshow_status_password}
        />
      ) : null}
      <div className="title-section m-3 me-5">
        <div>
          <label></label>
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

      <div className="container-dashboard">

        {usuarios && (
          <Link to="users" style={{ textDecoration: "none" }}>
            <div className="dasboard-grid">
              {/* Usuarios */}
              <div className="row-fila">
                <i className="fas fa-users"></i>
              </div>
              <label>Usuarios</label>
            </div>
          </Link>
        )}

        {roles && (
          <Link to="roles" style={{ textDecoration: "none" }}>
            <div className="dasboard-grid">
              {/* Usuarios */}
              <div className="row-fila">
                <i className="far fa-address-card"></i>
              </div>
              <label>Roles</label>
            </div>
          </Link>
        )}

        {auditoria && (
          <Link to="auditoria" style={{ textDecoration: "none" }}>
            <div className="dasboard-grid">
              {/* Auditoria */}
              <div className="row-fila">
                <i className="fas fa-newspaper"></i>
              </div>
              <label>Auditoría</label>
            </div>
          </Link>
        )}
        {configuracion && (
          <Link to="configuracion" style={{ textDecoration: "none" }}>
            <div className="dasboard-grid">
              {/* Auditoria */}
              <div className="row-fila">
                <i className="fas fa-cog"></i>
              </div>
              <label>Configuración</label>
            </div>
          </Link>
        )}
        {spinner && <Spinner />}
        {consPedidos && (
          <Link to="consulta_pedido" style={{ textDecoration: "none" }}>
            <div className="dasboard-grid">
              {/* Consulta de pedidos */}
              <div className="row-fila">
                <i className="fas fa-search"></i>
              </div>
              <label>Consulta de Pedidos</label>
            </div>
          </Link>
        )}
        {consStock && (
          <Link to="consulta_stock" style={{ textDecoration: "none" }}>
            <div className="dasboard-grid">
              {/* Consulta de stock */}
              <div className="row-fila">
                <i className="fas fa-pencil-alt"></i>
              </div>
              <label>Consulta de stock</label>
            </div>
          </Link>
        )}
        {promociones && (
          <Link to="promociones" style={{ textDecoration: "none" }}>
            <div className="dasboard-grid">
              {/* Reporte de Promociones */}
              <div className="row-fila">
                <i className="fas fa-list-alt"></i>
              </div>
              <label>Promociones</label>
            </div>
          </Link>
        )}
        {infoCliente && (
          <Link to="informacion_cliente" style={{ textDecoration: "none" }}>
            <div className="dasboard-grid">
              {/* Información del cliente */}
              <div className="row-fila">
                <i className="fas fa-id-card"></i>
              </div>
              <label>Información del Cliente</label>
            </div>
          </Link>
        )}
        {estadoCuenta && (
          <Link to="estado_cuenta" style={{ textDecoration: "none" }}>
            <div className="dasboard-grid">
              {/* Deuda de cliente */}
              <div className="row-fila">
                <i className="fas fa-digital-tachograph"></i>
              </div>
              <label>Estado de Cuenta</label>
            </div>
          </Link>
        )}

        {reporteDespacho && (
          <Link to="reporte_despacho" style={{ textDecoration: "none" }}>
            <div className="dasboard-grid">
              <div className="row-fila">
                <i className="fas fa-money-check"></i>
              </div>
              <label>Reporte de Despacho</label>
            </div>
          </Link>
        )}

        {listaPrecio && (
          <Link to="lista_precio" style={{ textDecoration: "none" }}>
            <div className="dasboard-grid">
              <div className="row-fila">
                <i className="fas fa-list"></i>
              </div>
              <label>Lista de Precios</label>
            </div>
          </Link>
        )}

        {generarSolicitud && (
          <Link to="generar_solicitud" style={{ textDecoration: "none" }}>
            <div className="dasboard-grid">
              <div className="row-fila">
                <i className="fa fa-book"></i>
              </div>
              <label>Generar Solicitud</label>
            </div>
          </Link>
        )}

        {misSolicitudes && (
          <Link to="mis_solicitudes" style={{ textDecoration: "none" }}>
            <div className="dasboard-grid">
              <div className="row-fila">
                <i className="fa fa-credit-card"></i>
              </div>
              <label>Mis Solicitudes</label>
            </div>
          </Link>
        )}

        {misAprobaciones && (
          <Link to="mis_aprobaciones" style={{ textDecoration: "none" }}>
            <div className="dasboard-grid">
              <div className="row-fila">
                <i className="fa fa-fax"></i>
              </div>
              <label>Mis aprobaciones</label>
            </div>
          </Link>
        )}
        {reporteSolicitud && (
          <Link to="reporte_solicitud" style={{ textDecoration: "none" }}>
            <div className="dasboard-grid">
              <div className="row-fila">
                <i className="fa fa-file"></i>
              </div>
              <label>Reporte de Solicitud</label>
            </div>
          </Link>
        )}
        {<a style={{ textDecoration: "none" }}
          href="https://my350505.crm.ondemand.com/sap/ap/ui/clogin?saml2=disabled&app.component=%2fSAP_UI_CT%2fMain%2froot.uiccwoc&rootWindow=X&redirectUrl=%2fsap%2fpublic%2fbyd%2fruntime&supressAutoLogon=true#"
          target="_blank"
        >
          <div className="dasboard-grid">
            {/* Acceso a NEXO */}
            <div className="row-fila">
              <i className="fas fa-link"></i>
            </div>
            Acceso a NEXO
          </div>
        </a>
        }
      </div>
    </>
  );

  // }
};

export default Dashboard;
