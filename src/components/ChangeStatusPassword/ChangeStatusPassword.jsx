import React, { useState } from "react";
import BtnSave from "../BtnSave";
import InputForm from "../InputForm";
import jwt from "jwt-decode";
import { getUser, updatePasswordUser } from "../../Services/ServiceUser";
import Spinner from "../Spinner";
const ChangeStatusPassword = ({ setshow_status_password }) => {
  const [pass, setpass] = useState("");
  const [pass_confirm, setpass_confirm] = useState("");

  const [Messages, setMessages] = useState({ msgPassword: "" });
  const [MsgGeneral, setMsgGeneral] = useState("");

  const [state_change_pass, setstate_change_pass] = useState(false);

  const [spinner, setSpinner] = useState(false);

  function guardar() {
    setSpinner(true);
    let mgPassword;
    let countMsg = false;
    let request = { password: pass, status_password: "0" };
    if (request.password === "" || pass_confirm === "") {
      mgPassword = "Ingrese la constraseña";
      countMsg = true;
    } else if (request.password !== pass_confirm) {
      mgPassword = "Las contraseñas no coinciden.";
      countMsg = true;
    }
    if (countMsg) {
      setMessages({ msgPassword: mgPassword });
      setstate_change_pass(false);
      setSpinner(false);
    } else {
      let classMsg = document.getElementById("msg-general");
      classMsg.classList.remove("msg-success");
      classMsg.classList.remove("msg-error");
      updatePasswordUser(
        request,
        jwt(localStorage.getItem("_token")).nameid
      ).then((result) => {
        if (result.indicator === 1) {
          setMessages({ msgPassword: "" });
          setMsgGeneral(result.message);
          classMsg.classList.add("msg-success");
          setstate_change_pass(true);
          setTimeout(() => {
            setshow_status_password(false);
          }, 3000);
        } else {
          setMsgGeneral(result.message);
          classMsg.classList.add("msg-error");
          setstate_change_pass(false);
        }
        
        setSpinner(false);
      });
    }
  }
  const handleChange = (name, value) => {
    switch (name) {
      case "pass":
        setpass(value);
        break;
      case "pass_confirm":
        setpass_confirm(value);
        break;
      default:
        break;
    }
  };
  return (
    <div className="container-modal-background">
      <div className="modal-wrapper modal-wrapper-30-40">
        <div className="modal-header">
          <div className="modal-title">
            <h5>Cambiar Contraseña</h5>
          </div>
        </div>
        <div className="modal-body">
          <div id="msg-general" className="row-message ">
            <span>{MsgGeneral}</span>
          </div>
          <section
            className="row"
            style={{ margin: "auto", paddingTop: "20px" }}
          >
            <label
              style={{
                textAlign: "center",
                marginBottom: "25px",
                color: "red",
              }}
            >
              Cambie a una nueva contraseña para poder continuar.
            </label>

            <div className="col-sm-12 d-flex align-items-center">
              <label>Contraseña nueva</label>
            </div>
            <div className="col-sm-12">
              <InputForm
                attribute={{
                  name: "pass",
                  type: "password",
                  value: pass,
                  disabled: false,
                  checked: false,
                  matchcode: false,
                }}
                handleChange={handleChange}
              />
              <span className="errorInput">{Messages.msgPassword}</span>
            </div>
            <div className="col-sm-12 d-flex align-items-center">
              <label>Confirmar contraseña</label>
            </div>
            <div className="col-sm-12">
              <InputForm
                attribute={{
                  name: "pass_confirm",
                  type: "password",
                  value: pass_confirm,
                  disabled: false,
                  checked: false,
                  matchcode: false,
                }}
                handleChange={handleChange}
              />
            </div>
          </section>
        </div>
        <div className="modal-footer">
          {spinner ? (
            <Spinner />
          ) : state_change_pass ? 
          <label style={{textAlign:'center'}}>
            Cerrando ventana ...
          </label> : (
            <BtnSave
              attribute={{
                name: "btnGuardar",
                value: "Guardar",
                classNamebtn: "btn_save",
              }}
              onClick={() => guardar()}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ChangeStatusPassword;
