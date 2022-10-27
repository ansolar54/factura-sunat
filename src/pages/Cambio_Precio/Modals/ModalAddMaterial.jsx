import React, { useCallback, useEffect, useRef, useState } from "react";
import BtnCancel from "../../../components/BtnCancel";
import BtnSave from "../../../components/BtnSave";
import InputForm from "../../../components/InputForm";
import McMaterial from "./McMaterial";

const ModalAddMaterial = ({ showModalMaterial, setShowModalMaterial }) => {
  const [showMcMaterial, setShowMcMaterial] = useState(false);

  const modalRef = useRef();
  const closeModal = (e) => {
    if (modalRef.current === e.target) {
      setShowModalMaterial(false);
    }
  };

  const keyPress = useCallback(
    (e) => {
      if (e.key === "Escape" && showModalMaterial) {
        setShowModalMaterial(false);
      }
    },
    [setShowModalMaterial, showModalMaterial]
  );

  useEffect(() => {
    document.addEventListener("keydown", keyPress);
    return () => document.removeEventListener("keydown", keyPress);
  }, [keyPress]);

  const cancelar = () => {
    setShowModalMaterial(false);
  };

  const guardar = () => {
    console.log("guardar");
  };

  return (
    <>
      {showModalMaterial ? (
        <div
          className="container-modal-background"
          onClick={closeModal}
          ref={modalRef}
        >
          <McMaterial
            showMcMaterial={showMcMaterial}
            setShowMcMaterial={setShowMcMaterial}
          />
          <div className="modal-wrapper modal-wrapper-sm">
            <div className="modal-header">
              <div className="modal-title">
                <h5>Agregar Material</h5>
              </div>
              <div
                className="close-modal-button"
                onClick={() => setShowModalMaterial((prev) => !prev)}
              >
                <i className="fas fa-times"></i>
              </div>
            </div>
            <div className="modal-body">
              <div className="row-md">
                <div className="col-sm-2 d-flex align-items-center">
                  <label>Material : </label>
                </div>
                <div>
                  <InputForm
                    attribute={{
                      name: "material",
                      type: "text",
                      value: "1001061",
                      disabled: false,
                      checked: false,
                      matchcode: true,
                    }}
                    handleChange={""}
                    onClick={() => setShowMcMaterial((prev) => !prev)}
                  />
                </div>
              </div>
              <div className="row-md">
                <div className="col-sm-2 d-flex align-items-center">
                  <label>Precio actual : </label>
                </div>
                <div>
                  <InputForm
                    attribute={{
                      name: "precio_actual",
                      type: "text",
                      value: "100.00",
                      disabled: true,
                      checked: false,
                    }}
                    handleChange={""}
                    onClick={() => {}}
                  />
                </div>
              </div>
              <div className="row-md">
                <div className="col-sm-2 d-flex align-items-center">
                  <label>Precio sugerido : </label>
                </div>
                <div>
                  <InputForm
                    attribute={{
                      name: "precio_sugerido",
                      type: "text",
                      value: "105.00",
                      disabled: false,
                      checked: false,
                    }}
                    handleChange={""}
                    onClick={() => {}}
                  />
                </div>
              </div>
              <div className="row-md">
                <div className="col-sm-2 d-flex align-items-center">
                  <label>Fecha inicio : </label>
                </div>
                <div>
                  <InputForm
                    attribute={{
                      name: "fecha_inicio",
                      type: "date",
                      value: "dd/mm/aaaa",
                      disabled: true,
                      checked: false,
                    }}
                    handleChange={""}
                    onClick={() => {}}
                  />
                </div>
              </div>
              <div className="row-md">
                <div className="col-sm-2 d-flex align-items-center">
                  <label>Fecha fin : </label>
                </div>
                <div>
                  <InputForm
                    attribute={{
                      name: "fecha_fin",
                      type: "date",
                      value: "dd/mm/aaaa",
                      disabled: false,
                      checked: false,
                    }}
                    handleChange={""}
                    onClick={() => {}}
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
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

export default ModalAddMaterial;
