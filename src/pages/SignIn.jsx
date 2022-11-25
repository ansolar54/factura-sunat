import React, { useState, useEffect } from "react";
import BtnAcept from "../components/BtnAcept";
import Input from "../components/Input";
import { SignInUser } from "../Services/ServiceUser";
import Spinner from "../components/Spinner";
import "./SignIn.css";
import { Redirect } from "react-router-dom";
import jwt from "jwt-decode";
import logo_farmex from "../assets/logo-farmex.png";
import {
  getOficinaVentasSAP,
  RegistrarAuditoria,
} from "../Services/ServiceAuditoria";
import { ConsultarTipoCambio } from "../Services/ServiceTipoCambio";

const SignIn = () => {
  //DATOS DE ENTRADA PARA INICIAR SESIÓN
  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");
  //CARGA DE SPINNER
  const [spinner, setspinner] = useState(false);
  //CONDICIONAL SI INICIA SESIÓN
  const [accessuser, setaccessuser] = useState(false);
  //MENSAJE DE LOGUEO
  const [messagesignin, setmessagesignin] = useState("");

  useEffect(() => {
    document.body.classList.remove("body-light");
    document.body.classList.add("body-green");
  }, []);
  function handleChange(name, value) {
    switch (name) {
      case "username":
        setusername(value);
        break;
      case "password":
        setpassword(value);
        break;
      default:
        break;
    }
  }

  function SigIn() {
    setmessagesignin("");
    setspinner(true);
    if (username.trim() != "" && password.trim() != "") {
      let model_signin = {
        username: username.trim(),
        password: password.trim(),
      };
      SignInUser(model_signin).then((result) => {
        setspinner(false);
        if (result.indicator == 1) {
          setaccessuser(true);
          localStorage.setItem("_token", result.data.token);
          document.body.classList.remove("body-green");
          // OBTENER OFICINA DE VENTAS DE USUARIO DESDE SAP
          let ofi_ventas = "";
          getOficinaVentasSAP({
            IsUser: jwt(localStorage.getItem("_token")).username,
          }).then((result) => {
            if (result.etOfiVentasField.length) {
              ofi_ventas =
                result.etOfiVentasField[0].codOfventaField +
                " - " +
                result.etOfiVentasField[0].descripcionField;
              //REGISTRO DE AUDITORÍA
              let model = {
                id_user: Number(jwt(localStorage.getItem("_token")).nameid),
                id_event: 5,
                sales_ofi: ofi_ventas,
                indicator: "WEB",
              };
              // console.log(model);
              RegistrarAuditoria(model);
            }
          });

          // window.location.pathname("/dashboard");

          // OBTENIENDO TIPO DE CAMBIO DE SAP
          getTipoCambio();
        } else {
          setmessagesignin(result.message);
        }
      });
    } else {
      setmessagesignin("Ingrese credenciales correctamente.");
      setspinner(false);
    }
  }

  const getTipoCambio = () => {
    ConsultarTipoCambio().then((result) => {
      //   console.log("tipo cambio ", Number(result.eTipoCambioField).toFixed(3));
      localStorage.setItem(
        "_tipoCambio",
        Number(result.eTipoCambioField).toFixed(3)
      );
      // console.log('storage ', localStorage.getItem("_tipoCambio"))
    });
  };

  return (
    <div className="container-signin">
      <img src={logo_farmex} alt="" />
      <h4>Iniciar Sesión</h4>
      <Input
        attribute={{ type: "text", className: "", name: "username" }}
        label={{ value: "Usuario" }}
        div={{ className: "container-sigin-data" }}
        handleChange={handleChange}
      />
      <Input
        attribute={{ type: "password", className: "", name: "password" }}
        label={{ value: "Contraseña" }}
        div={{ className: "container-sigin-data" }}
        handleChange={handleChange}
      />
      <div className="container-sigin-btn">
        <BtnAcept
          attribute={{ name: "Ingresar", classNamebtn: "btn_signin" }}
          onClick={SigIn}
        />
      </div>
      {spinner && <Spinner />}
      {accessuser ? (
        <Redirect to={"dashboard"} />
      ) : (
        <>
          <div className="message-signin">{messagesignin}</div>
        </>
      )}
    </div>
  );
};

export default SignIn;
