import React, { useEffect, useState } from "react";
import "./Slidebar.css";
import { Link, useHistory } from "react-router-dom";
import { ValidarUsuarioSAP } from "../Services/ServiceValidaUsuario";
import { getUser } from "../Services/ServiceUser";
import Spinner from "./Spinner";
import jwt from "jwt-decode";
import logo_farmex from "../assets/logo-farmex-white.png";
import { ConfiPerfiles } from "../Services/ServiceCambioPrecio";

const Slidebar = () => {
  //CARGA DE SPINNER
  const [spinner, setspinner] = useState(false);

  const history = useHistory();
  const [estado_switch, setestado_switch] = useState(1);
  const [nameuser, setnameuser] = useState("");

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

  function HandleCategory(id_html) {
    switch (id_html) {
      case "icon-close-01":
        document.getElementById("subcat-01").classList.toggle("show-collapse");
        break;
      case "icon-close-02":
        document.getElementById("subcat-02").classList.toggle("show-collapse");
        break;
      case "icon-close-03":
        document.getElementById("subcat-03").classList.toggle("show-collapse");
        break;
      default:
        break;
    }
  }
  function ClickCloseSession() {
    history.push("/signin");
    localStorage.clear();
  }

  useEffect(() => {
    setspinner(true);
    if (sessionStorage.getItem("darkmode") == 0) {
      document.body.style.setProperty("--primary-color", "#03BF68");
      document.body.style.backgroundColor = "#fff";
      setestado_switch(1);
    }
    // si estado llega como  0 es porque esta en modo normal
    if (sessionStorage.getItem("darkmode") == 1) {
      document.body.style.setProperty("--primary-color", "#333333");
      document.body.style.backgroundColor = "#cccccc";
      setestado_switch(0);
    }

    //redireccionamiento a login si no se encuentra logueado
    if (!localStorage.getItem("_token")) {
      history.push("/signin");
    } else {
      getUser(jwt(localStorage.getItem("_token")).nameid).then((result) => {
        setnameuser(jwt(localStorage.getItem("_token")).username);
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

  function activeSlide() {
    document.getElementById("slidebar").classList.add("expand-slidebar");
    document.getElementById("slidebar").classList.remove("not-expand-slidebar");
  }
  function notactiveSlide() {
    document.getElementById("slidebar").classList.remove("expand-slidebar");
    document.getElementById("slidebar").classList.add("not-expand-slidebar");
  }

  const ClickDarkMode = (Estado) => {
    sessionStorage.setItem("darkmode", Estado);
    // si estado llega como 1 es porque esta en modo oscuro
    if (Estado == 0) {
      document.body.style.setProperty("--primary-color", "#03BF68");
      document.body.style.backgroundColor = "#fff";
      setestado_switch(1);
    }
    // si estado llega como  0 es porque esta en modo normal
    if (Estado == 1) {
      document.body.style.setProperty("--primary-color", "#333333");
      document.body.style.backgroundColor = "#cccccc";
      setestado_switch(0);
    }
  };

  return (
    <div>
      <div className="navbar-container">
        <i className="fas fa-bars" onClick={() => activeSlide()}></i>
      </div>
      <div className="slidebar-container" id="slidebar">
        <div className="slidebar-header-user">
          <div className="close-slidebar">
            <i
              className="fas fa-angle-double-left"
              onClick={() => notactiveSlide()}
            ></i>
          </div>
          <div>
            <img
              src={logo_farmex}
              style={{ width: "50%", padding: "8px", marginBottom: "5px" }}
            />
          </div>
          <Link to="dashboard">Bienvenido {nameuser}</Link>
        </div>
        <div className="switch-container">
          {sessionStorage.getItem("darkmode") == 0 ? (
            <label className="switch-darkmode">
              <input
                type="checkbox"
                onChange={() => ClickDarkMode(estado_switch)}
              />
              <span className="slider-darkmode round"></span>
            </label>
          ) : (
            <label className="switch-darkmode">
              <input
                type="checkbox"
                onChange={() => ClickDarkMode(estado_switch)}
                defaultChecked
              />
              <span className="slider-darkmode round"></span>
            </label>
          )}
        </div>

        {modAdministracion && (
          <div className="slidebar-categories">
            <div
              className="slidebar-categories-header"
              onClick={() => HandleCategory("icon-close-01")}
            >
              <i className="fas fa-user-cog"></i>
              <a>Administración</a>
              <i className="fas fa-angle-down slider-down-icon"></i>
            </div>
            <div className="slidebar-subcategories" id="subcat-01">
              <ul>
                {usuarios && (
                  <li className="slidebar-categories-child">
                    <i className="fas fa-users"></i>
                    <Link to="users">Usuarios</Link>
                  </li>
                )}
                {roles && (
                  <li className="slidebar-categories-child">
                    <i className="far fa-address-card"></i>
                    <Link to="roles">Roles</Link>
                  </li>
                )}
                {auditoria && (
                  <li className="slidebar-categories-child">
                    <i className="fas fa-newspaper"></i>
                    <Link to="auditoria">Auditoría</Link>
                  </li>
                )}
                {configuracion && (
                  <li className="slidebar-categories-child">
                    <i className="fas fa-cog"></i>
                    <Link to="configuracion">Configuración</Link>
                  </li>
                )}
              </ul>
            </div>
          </div>
        )}

        {/* REPORTES */}
        {modReportes && (
          <div className="slidebar-categories">
            <div
              className="slidebar-categories-header"
              onClick={() => HandleCategory("icon-close-02")}
            >
              <i className="fas fa-box-open"></i>
              <a>Reportes</a>
              <i className="fas fa-angle-down slider-down-icon"></i>
            </div>
            <div className="slidebar-subcategories" id="subcat-02">
              {spinner && <Spinner />}
              <ul>
                {consPedidos && (
                  <li className="slidebar-categories-child">
                    <i className="fas fa-search"></i>
                    <Link to="consulta_pedido">Consulta de Pedidos</Link>
                  </li>
                )}
                {consStock && (
                  <li className="slidebar-categories-child">
                    <i className="fas fa-pencil-alt"></i>
                    <Link to="consulta_stock">Consulta de Stock</Link>
                  </li>
                )}
                {promociones && (
                  <li className="slidebar-categories-child">
                    <i className="fas fa-list-alt"></i>
                    <Link to="promociones">Promociones</Link>
                  </li>
                )}
                {infoCliente && (
                  <li className="slidebar-categories-child">
                    <i className="fas fa-id-card"></i>
                    <Link to="informacion_cliente">
                      Información del Cliente
                    </Link>
                  </li>
                )}

                {estadoCuenta && (
                  <li className="slidebar-categories-child">
                    <i className="fas fa-digital-tachograph"></i>
                    <Link to="estado_cuenta">Estado de Cuenta</Link>
                  </li>
                )}
              </ul>
            </div>
          </div>
        )}

        {/* CAMBIO PRECIO */}
        {modCambioPrecio && (
          <div className="slidebar-categories">
            <div
              className="slidebar-categories-header"
              onClick={() => HandleCategory("icon-close-03")}
            >
              <i className="fas fa-box-open"></i>
              <a>Cambio precio</a>
              <i className="fas fa-angle-down slider-down-icon"></i>
            </div>
            <div className="slidebar-subcategories" id="subcat-03">
              {spinner && <Spinner />}
              <ul>
                {generarSolicitud && (
                  <li className="slidebar-categories-child">
                    <i className="fa fa-book"></i>
                    <Link to="generar_solicitud">Generar solicitud</Link>
                  </li>
                )}

                {misSolicitudes && (
                  <li className="slidebar-categories-child">
                    <i className="fa fa-credit-card"></i>
                    <Link to="mis_solicitudes">Mis solicitudes</Link>
                  </li>
                )}
                {misAprobaciones && (
                  <li className="slidebar-categories-child">
                    <i className="fa fa-fax"></i>
                    <Link to="mis_aprobaciones">Mis aprobaciones</Link>
                  </li>
                )}
              </ul>
            </div>
          </div>
        )}

        {/* <div className="slidebar-categories">
          <div
            className="slidebar-categories-header"
            onClick={() => HandleCategory("icon-close-03")}
          >
            <i class="fas fa-cogs"></i>
            <a>Configuración</a>
            <i className="fas fa-angle-down slider-down-icon"></i>
          </div>
          <div className="slidebar-subcategories" id="subcat-03">
            <ul>
                <li className="slidebar-categories-child">
                  <i className="fas fa-dice-d6"></i>
                  <a>Cambiar contraseña</a>
                </li> 
            </ul>
          </div>
        </div> */}

        <div className="slidebar-categories">
          <li className="slidebar-categories-child">
            <i className="fas fa-link"></i>
            <a
              href="https://my350505.crm.ondemand.com/sap/ap/ui/clogin?saml2=disabled&app.component=%2fSAP_UI_CT%2fMain%2froot.uiccwoc&rootWindow=X&redirectUrl=%2fsap%2fpublic%2fbyd%2fruntime&supressAutoLogon=true#"
              target="_blank"
            >
              Acceso a NEXO
            </a>
          </li>
        </div>

        <div className="slidebar-categories">
          <button
            className="btn_closesession"
            onClick={() => ClickCloseSession()}
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default Slidebar;
