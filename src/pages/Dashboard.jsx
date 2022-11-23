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
  const [generarSolicitud, setGenerarSolicitud] = useState(false);
  const [misSolicitudes, setMisSolicitudes] = useState(false);
  const [misAprobaciones, setMisAprobaciones] = useState(false);

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
          console.log(result);
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
              }
            }
          }
          setspinner(false);
        });
      });
    }
  }, []);

  return (
    <>
      {show_status_password ? (
        <ChangeStatusPassword
          setshow_status_password={setshow_status_password}
        />
      ) : null}
      <div className="container-dashboard">
        {usuarios && (
          <div className="dasboard-grid">
            {/* Usuarios */}
            <div className="row-fila">
              <i className="fas fa-users"></i>
            </div>
            <Link to="users">Usuarios</Link>
          </div>
        )}
        {auditoria && (
          <div className="dasboard-grid">
            {/* Auditoria */}
            <div className="row-fila">
              <i className="fas fa-newspaper"></i>
            </div>
            <Link to="auditoria">Auditoría</Link>
          </div>
        )}
        {configuracion && (
          <div className="dasboard-grid">
            {/* Auditoria */}
            <div className="row-fila">
              <i className="fas fa-cog"></i>
            </div>
            <Link to="configuracion">Configuración</Link>
          </div>
        )}
        {spinner && <Spinner />}
        {consPedidos && (
          <div className="dasboard-grid">
            {/* Consulta de pedidos */}
            <div className="row-fila">
              <i className="fas fa-search"></i>
            </div>
            <Link to="consulta_pedido">Consulta de Pedidos</Link>
          </div>
        )}
        {consStock && (
          <div className="dasboard-grid">
            {/* Consulta de stock */}
            <div className="row-fila">
              <i className="fas fa-pencil-alt"></i>
            </div>
            <Link to="consulta_stock">Consulta de stock</Link>
          </div>
        )}
        {promociones && (
          <div className="dasboard-grid">
            {/* Reporte de Promociones */}
            <div className="row-fila">
              <i className="fas fa-list-alt"></i>
            </div>
            <a href="promociones">Promociones</a>
          </div>
        )}
        {infoCliente && (
          <div className="dasboard-grid">
            {/* Información del cliente */}
            <div className="row-fila">
              <i className="fas fa-id-card"></i>
            </div>
            <Link to="informacion_cliente">Información del Cliente</Link>
          </div>
        )}
        {estadoCuenta && (
          <div className="dasboard-grid">
            {/* Deuda de cliente */}
            <div className="row-fila">
              <i className="fas fa-digital-tachograph"></i>
            </div>
            <a href="estado_cuenta">Estado de Cuenta</a>
          </div>
        )}
        {
          <div className="dasboard-grid">
            {/* Acceso a NEXO */}
            <div className="row-fila">
              <i className="fas fa-link"></i>
            </div>
            <a
              href="https://my350505.crm.ondemand.com/sap/ap/ui/clogin?saml2=disabled&app.component=%2fSAP_UI_CT%2fMain%2froot.uiccwoc&rootWindow=X&redirectUrl=%2fsap%2fpublic%2fbyd%2fruntime&supressAutoLogon=true#"
              target="_blank"
            >
              Acceso a NEXO
            </a>
          </div>
        }
      </div>
    </>
  );

  // }
};

export default Dashboard;
