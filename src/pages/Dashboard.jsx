import React, { Component, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";
import { ValidarUsuarioSAP } from "../Services/ServiceValidaUsuario";
import { getUser } from "../Services/ServiceUser";
import Spinner from "../components/Spinner";
import jwt from "jwt-decode";
import ChangeStatusPassword from "../components/ChangeStatusPassword/ChangeStatusPassword";
const Dashboard = () => {
  document.body.classList.remove("body-green");
  document.body.classList.add("body-light");

  //CARGA DE SPINNER
  const [spinner, setspinner] = useState(false);
  const [roladmin, setroladmin] = useState(false);
  const [consultapedido, setconsultapedido] = useState(false);
  const [informacioncliente, setinformacioncliente] = useState(false);
  const [consultastock, setconsultastock] = useState(false);
  const [deudacliente, setdeudacliente] = useState(false);
  const [reportepromociones, setreportepromociones] = useState(false);

  //para el cambio de contraseña
  const [show_status_password, setshow_status_password] = useState(false);

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
        if (result.data[0].id_role == 1) {
          setroladmin(true);
        }
        let model_sap = {
          IsUsuario: result.data[0].username,
        };
        ValidarUsuarioSAP(model_sap).then((result_sap) => {
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

  return (
    <>
      {show_status_password ? (
        <ChangeStatusPassword
          setshow_status_password={setshow_status_password}
        />
      ) : null}
      <div className="container-dashboard">
        {roladmin && (
          <div className="dasboard-grid">
            {/* Usuarios */}
            <div className="row-fila">
              <i className="fas fa-users"></i>
            </div>
            <Link to="users">Usuarios</Link>
          </div>
        )}
        {roladmin && (
          <div className="dasboard-grid">
            {/* Auditoria */}
            <div className="row-fila">
              <i className="fas fa-newspaper"></i>
            </div>
            <Link to="auditoria">Auditoría</Link>
          </div>
        )}
        {roladmin && (
          <div className="dasboard-grid">
            {/* Auditoria */}
            <div className="row-fila">
              <i className="fas fa-cog"></i>
            </div>
            <Link to="configuracion">Configuración</Link>
          </div>
        )}
        {spinner && <Spinner />}
        {consultapedido && (
          <div className="dasboard-grid">
            {/* Consulta de pedidos */}
            <div className="row-fila">
              <i className="fas fa-search"></i>
            </div>
            <Link to="consulta_pedido">Consulta de Pedidos</Link>
          </div>
        )}
        {consultastock && (
          <div className="dasboard-grid">
            {/* Consulta de stock */}
            <div className="row-fila">
              <i className="fas fa-pencil-alt"></i>
            </div>
            <Link to="consulta_stock">Consulta de stock</Link>
          </div>
        )}
        {reportepromociones && (
          <div className="dasboard-grid">
            {/* Reporte de Promociones */}
            <div className="row-fila">
              <i className="fas fa-list-alt"></i>
            </div>
            <a href="promociones">Promociones</a>
          </div>
        )}
        {informacioncliente && (
          <div className="dasboard-grid">
            {/* Información del cliente */}
            <div className="row-fila">
              <i className="fas fa-id-card"></i>
            </div>
            <Link to="informacion_cliente">Información del Cliente</Link>
          </div>
        )}
        {deudacliente && (
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
