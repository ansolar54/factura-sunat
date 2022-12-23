import React, { useCallback, useEffect, useRef, useState } from "react";
import BtnCancel from "../../../components/BtnCancel";
import BtnSave from "../../../components/BtnSave";
import InputFormMd from "../../../components/InputFormModal";
import Spinner from "../../../components/Spinner";
import { ConfiPerfiles } from "../../../Services/ServiceCambioPrecio";
import jwt from "jwt-decode";

const ModalAsignarPerfiles = ({
  showModalAsignarPerfil,
  setShowModalAsignarPerfil,
  setPerfiles,
  perfiles,
  idRol,
}) => {
  const modalRef = useRef();
  const closeModal = (e) => {
    if (modalRef.current === e.target) {
      setShowModalAsignarPerfil(false);
    }
  };

  const [grupo, setGrupo] = useState([
    {
      id: "1",
      name: "Administración",
    },
    {
      id: "2",
      name: "Reportes",
    },
    {
      id: "3",
      name: "Cambio precio",
    },
  ]);

  const keyPress = useCallback(
    (e) => {
      if (e.key === "Escape" && showModalAsignarPerfil) {
        setShowModalAsignarPerfil(false);
      }
    },
    [setShowModalAsignarPerfil, showModalAsignarPerfil]
  );

  useEffect(() => {
    document.addEventListener("keydown", keyPress);
    return () => document.removeEventListener("keydown", keyPress);
  }, [keyPress, showModalAsignarPerfil]);

  const cancelar = () => {
    setShowModalAsignarPerfil(false);
  };

  const guardar = () => {
    let model = {
      IsOpcion: "U",
      IsRol: idRol, // id de rol
      IsUser: jwt(localStorage.getItem("_token")).username,
      ItPerfil: perfiles,
    };
    console.log(model);
    ConfiPerfiles(model).then((result) => {
      console.log(result);
    });
    setShowModalAsignarPerfil(false);
  };

  const handleChange = (item) => {
    if (item.activeField === "X") {
      item.activeField = "";
    } else {
      item.activeField = "X";
    }
    // item.checked = !item.checked;
    setPerfiles([...perfiles]);
  };

  const getNameOfAbrev = (abrev) => {
    switch (abrev) {
      case "AUD":
        return "Auditoría";
      case "CONF":
        return "Configuración";
      case "CP01":
        return "Generar solicitud";
      case "CP02":
        return "Mis solicitudes";
      case "CP03":
        return "Mis aprobaciones";
      case "CP04":
        return "Reporte Solicitudes";
      case "R01":
        return "Consulta de pedidos";
      case "R02":
        return "Consulta de stock";
      case "R03":
        return "Promociones";
      case "R04":
        return "Información de cliente";
      case "R05":
        return "Estado de cuenta";
      case "R06":
        return "Reporte de despacho";
      case "ROL":
        return "Roles";
      default:
        return "Usuario";
    }
  };

  return (
    <>
      {showModalAsignarPerfil ? (
        <div
          className="container-modal-background"
          onClick={closeModal}
          ref={modalRef}
        >
          <div className="modal-wrapper modal-wrapper-35-40">
            <div className="modal-header">
              <div className="modal-title">
                <h5>Asignar Perfil</h5>
              </div>
              <div
                className="close-modal-button"
                onClick={() => setShowModalAsignarPerfil((prev) => !prev)}
              >
                <i className="fas fa-times"></i>
              </div>
            </div>
            <div className="modal-body">
              <div id="msg-general" className="row-message">
                <span>{""}</span>
              </div>
              <div className="row-md">
                <div className="col-md col-md-6">
                  {grupo.map((item, key) => (
                    <ul style={{ listStyleType: "none" }}>
                      <li key={key}>
                        <label htmlFor={item.id}> {item.name}</label>
                        <ul>
                          {perfiles.map((item2, key2) => {
                            if (item.id === item2.grupoField) {
                              return (
                                <ul
                                  style={{
                                    listStyleType: "none",
                                    width: 400,
                                  }}
                                >
                                  <li key={key2}>
                                    <InputFormMd
                                      attribute={{
                                        type: "checkbox",
                                        id: key2,
                                        name: item2.idModuloField,
                                        value: item2.idModuloField,
                                        className: "checkModal",
                                        disabled: false,
                                        cheched:
                                          item2.activeField === "X"
                                            ? true
                                            : false,
                                      }}
                                      handleChange={() => handleChange(item2)}
                                    ></InputFormMd>
                                    <label htmlFor={key2}>
                                      {getNameOfAbrev(item2.idModuloField)}
                                    </label>
                                  </li>
                                </ul>
                              );
                            }
                          })}
                        </ul>
                      </li>
                    </ul>
                  ))}
                </div>
              </div>
            </div>
            {/* {spinner && <Spinner />} */}
            <div className="modal-footer" style={{alignContent: "center"}}>
              <BtnCancel
                attribute={{
                  name: "btnCancelar",
                  value: "Cancelar",
                  classNamebtn: "btn_cancel",
                }}
                onClick={() => cancelar()}
              />
              <BtnSave
                attribute={{
                  name: "btnGuardar",
                  value: "Guardar",
                  classNamebtn: "btn_save",
                }}
                onClick={() => guardar()}
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default ModalAsignarPerfiles;
