import React, { useEffect, useState } from "react";
import "./Slidebar.css";
import { Link, useHistory } from "react-router-dom";
import { ValidarUsuarioSAP } from "../Services/ServiceValidaUsuario";
import { getUser } from "../Services/ServiceUser";
import Spinner from "./Spinner";
import jwt from "jwt-decode";
import logo_farmex from "../assets/logo-farmex-white.png";

const Slidebar = () => {
  //CARGA DE SPINNER
  const [spinner, setspinner] = useState(false);
  // const [rol, setRol] = useState(1);
  const [roladmin, setroladmin] = useState(false);
  const [consultapedido, setconsultapedido] = useState(false);
  const [informacioncliente, setinformacioncliente] = useState(false);
  const [consultastock, setconsultastock] = useState(false);
  const [deudacliente, setdeudacliente] = useState(false);
  const [reportepromociones, setreportepromociones] = useState(false);

  const history = useHistory();
  const [estado_switch, setestado_switch] = useState(1);
  const [nameuser, setnameuser] = useState("");

  const [isGerente, setIsGerente] = useState(false);

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
        // rol 4 -- gerente
        if (result.data[0].id_role == 1) {
          setroladmin(true);
        }

        if (result.data[0].id_role == 4) {
          setIsGerente(true);
        }
        // setRol(result.data[0].id_role);
        let model_sap = {
          IsUsuario: result.data[0].username,
        };
        ValidarUsuarioSAP(model_sap).then((result_sap) => {
          // console.log(result_sap);
          for (
            let index = 0;
            index < result_sap.etValidaViewField.length;
            index++
          ) {
            if (result_sap.etValidaViewField[index].reporteField == "01") {
              if (result_sap.etValidaViewField[index].validoField == "1") {
                setconsultapedido(true);
              } else {
                setconsultapedido(false);
              }
            } else if (
              result_sap.etValidaViewField[index].reporteField == "02"
            ) {
              if (result_sap.etValidaViewField[index].validoField == "1") {
                setinformacioncliente(true);
              } else {
                setinformacioncliente(false);
              }
            } else if (
              result_sap.etValidaViewField[index].reporteField == "03"
            ) {
              if (result_sap.etValidaViewField[index].validoField == "1") {
                setconsultastock(true);
              } else {
                setconsultastock(false);
              }
            } else if (
              result_sap.etValidaViewField[index].reporteField == "04"
            ) {
              if (result_sap.etValidaViewField[index].validoField == "1") {
                setdeudacliente(true);
              } else {
                setdeudacliente(false);
              }
            } else if (
              result_sap.etValidaViewField[index].reporteField == "05"
            ) {
              if (result_sap.etValidaViewField[index].validoField == "1") {
                setreportepromociones(true);
              } else {
                setreportepromociones(false);
              }
            }
            if (result_sap.etValidaViewField.length - 1 == index) {
              setspinner(false);
            }
          }
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

        {roladmin && (
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
                <li className="slidebar-categories-child">
                  <i className="fas fa-users"></i>
                  <Link to="users">Usuarios</Link>
                </li>
                <li className="slidebar-categories-child">
                  <i className="far fa-address-card"></i>
                  <Link to="roles">Roles</Link>
                </li>
                <li className="slidebar-categories-child">
                  <i className="fas fa-newspaper"></i>
                  <Link to="auditoria">Auditoría</Link>
                </li>
                <li className="slidebar-categories-child">
                  <i className="fas fa-cog"></i>
                  <Link to="configuracion">Configuración</Link>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* REPORTES */}
        {!isGerente && (
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
                {consultapedido && (
                  <li className="slidebar-categories-child">
                    <i className="fas fa-search"></i>
                    <Link to="consulta_pedido">Consulta de Pedidos</Link>
                  </li>
                )}
                {consultastock && (
                  <li className="slidebar-categories-child">
                    <i className="fas fa-pencil-alt"></i>
                    <Link to="consulta_stock">Consulta de Stock</Link>
                  </li>
                )}
                {reportepromociones && (
                  <li className="slidebar-categories-child">
                    <i className="fas fa-list-alt"></i>
                    <Link to="promociones">Promociones</Link>
                  </li>
                )}
                {informacioncliente && (
                  <li className="slidebar-categories-child">
                    <i className="fas fa-id-card"></i>
                    <Link to="informacion_cliente">
                      Información del Cliente
                    </Link>
                  </li>
                )}

                {deudacliente && (
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
              {isGerente ? (
                <li className="slidebar-categories-child">
                  <i className="fa fa-fax"></i>
                  <Link to="mis_aprobaciones">Mis aprobaciones</Link>
                </li>
              ) : (
                <>
                  <li className="slidebar-categories-child">
                    <i className="fa fa-book"></i>
                    <Link to="generar_solicitud">Generar solicitud</Link>
                  </li>

                  <li className="slidebar-categories-child">
                    <i className="fa fa-credit-card"></i>
                    <Link to="mis_solicitudes">Mis solicitudes</Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>

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
