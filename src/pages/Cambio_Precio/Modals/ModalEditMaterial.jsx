import React, { useCallback, useEffect, useRef, useState } from "react";
import BtnCancel from "../../../components/BtnCancel";
import BtnSave from "../../../components/BtnSave";
import InputForm from "../../../components/InputForm";
import McMaterial from "./McMaterial";
import toast, { Toaster } from "react-hot-toast";

const ModalEditMaterial = ({
  showModalEditMaterial,
  setShowModalEditMaterial,
  dataMaterial,
  idMaterial,
}) => {
  // console.log(material.cod_mat);

  const [showMcMaterial, setShowMcMaterial] = useState(false);

  // DATA MATERIAL
  const [material, setMaterial] = useState({
    cod_mat: "",
    name_mat: "",
    moneda: "",
    prec_act: 0.0,
    prec_sug: 0.0,
    fec_ini: "",
    fec_fin: "",
    lim_inf: 0.0,
    lim_sup: 0.0,
  });

  const modalRef = useRef();
  const closeModal = (e) => {
    if (modalRef.current === e.target) {
      setShowModalEditMaterial(false);
    }
  };

  const keyPress = useCallback(
    (e) => {
      if (e.key === "Escape" && showModalEditMaterial) {
        setShowModalEditMaterial(false);
      }
    },
    [setShowModalEditMaterial, showModalEditMaterial]
  );

  useEffect(() => {
    loadDataFromControls();
    document.addEventListener("keydown", keyPress);
    return () => document.removeEventListener("keydown", keyPress);
  }, [keyPress]);

  const loadDataFromControls = () => {
    for (let i = 0; i < dataMaterial.length; i++) {
      const element = dataMaterial[i];
      if (element.cod_mat == idMaterial) {
        setMaterial(dataMaterial[i]);
      }
    }
  };

  const cancelar = () => {
    setShowModalEditMaterial(false);
  };

  const guardar = () => {
    // console.log("guardar");
    if (material.prec_sug >= material.lim_inf) {
      toast.error("Precio sugerido debe ser inferior a " + material.lim_inf, {
        position: "top-center",
        autoClose: 5000,
        style: {
          backgroundColor: "#212121",
          color: "#fff",
        },
      });
    } else {
      for (let i = 0; i < dataMaterial.length; i++) {
        const element = dataMaterial[i];
        if (element.cod_mat == idMaterial) {
          element.prec_sug = material.prec_sug;
          element.lim_inf = material.lim_inf;
          element.lim_sup = material.lim_sup;
          element.fec_fin = material.fec_fin;
        }
      }
      setShowModalEditMaterial(false);
    }
  };

  function handleChange(name, value) {
    // console.log(name, " : ", value);
    switch (name) {
      case "material":
        setMaterial((prevState) => ({
          ...prevState,
          cod_mat: value,
        }));
        break;
      case "precio_actual":
        setMaterial((prevState) => ({
          ...prevState,
          prec_act: value,
        }));
        break;
      case "precio_sugerido":
        setMaterial((prevState) => ({
          ...prevState,
          prec_sug: value,
        }));
        break;
      case "limite_inferior":
        setMaterial((prevState) => ({
          ...prevState,
          lim_inf: value,
        }));
        break;
      case "limite_superior":
        setMaterial((prevState) => ({
          ...prevState,
          lim_sup: value,
        }));
        break;
      case "fecha_inicio":
        setMaterial((prevState) => ({
          ...prevState,
          fec_ini: value,
        }));
        break;
      default:
        setMaterial((prevState) => ({
          ...prevState,
          fec_fin: value,
        }));
        break;
    }
  }

  function convertDecimal(num) {
    // return num.toFixed(Math.max(((num+'').split(".")[1]||"").length, 2));
    if (num == null || num == "" || num == "0") {
      return "0.00";
    } else {
      if (num.toString().split(".").length == 2) {
        // console.log( num.toString().split(".")[0].replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d)\.?)/g, ",") + "."+num.toString().split(".")[1]);
        return (
          num
            .toString()
            .split(".")[0]
            .replace(/\D/g, "")
            .replace(/\B(?=(\d{3})+(?!\d)\.?)/g, ",") +
          "." +
          // num.toString().split(".")[1].padStart(2, "0")
          num.toString().split(".")[1].padEnd(2, "0")
        );
      } else {
        // console.log( num.toString().split(".")[0].replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d)\.?)/g, ",") + ".00");
        return (
          num
            .toString()
            .split(".")[0]
            .replace(/\D/g, "")
            .replace(/\B(?=(\d{3})+(?!\d)\.?)/g, ",") + ".00"
        );
      }
    }
  }

  return (
    <>
      {showModalEditMaterial ? (
        <div
          className="container-modal-background"
          onClick={closeModal}
          ref={modalRef}
        >
          <Toaster />
          <McMaterial
            showMcMaterial={showMcMaterial}
            setShowMcMaterial={setShowMcMaterial}
          />
          <div className="modal-wrapper modal-wrapper-sm">
            <div className="modal-header">
              <div className="modal-title">
                <h5>Editar Material</h5>
              </div>
              <div
                className="close-modal-button"
                onClick={() => setShowModalEditMaterial((prev) => !prev)}
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
                      value: material.cod_mat,
                      disabled: true,
                      checked: false,
                      matchcode: false,
                    }}
                    handleChange={""}
                    onClick={() => setShowMcMaterial((prev) => !prev)}
                  />
                </div>
              </div>
              <div className="row-md">
                <div className="col-md col-md-6">
                  <div>
                    <label>Precio actual : </label>
                  </div>
                  <div>
                    <InputForm
                      attribute={{
                        name: "precio_actual",
                        type: "text",
                        value: convertDecimal(material.prec_act),
                        disabled: true,
                        checked: false,
                      }}
                      handleChange={handleChange}
                    />
                  </div>
                </div>
                <div className="col-md col-md-6">
                  <div>
                    <label>Precio sugerido : </label>
                  </div>
                  <div>
                    <InputForm
                      attribute={{
                        name: "precio_sugerido",
                        type: "text",
                        value: convertDecimal(material.prec_sug),
                        disabled: false,
                        checked: false,
                      }}
                      handleChange={handleChange}
                    />
                  </div>
                </div>
              </div>
              <div className="row-md">
                <div className="col-md col-md-6">
                  <div>
                    <label>Límite inferior : </label>
                  </div>
                  <div>
                    <InputForm
                      attribute={{
                        name: "limite_inferior",
                        type: "text",
                        value: convertDecimal(material.lim_inf),
                        disabled: false,
                        checked: false,
                      }}
                      handleChange={handleChange}
                    />
                  </div>
                </div>
                <div className="col-md col-md-6">
                  <div>
                    <label>Límite superior : </label>
                  </div>
                  <div>
                    <InputForm
                      attribute={{
                        name: "limite_superior",
                        type: "text",
                        value: convertDecimal(material.lim_sup),
                        disabled: false,
                        checked: false,
                      }}
                      handleChange={handleChange}
                    />
                  </div>
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
                      value: material.fec_ini,
                      disabled: true,
                      checked: false,
                    }}
                    handleChange={handleChange}
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
                      value: material.fec_fin,
                      disabled: false,
                      checked: false,
                    }}
                    handleChange={handleChange}
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

export default ModalEditMaterial;
