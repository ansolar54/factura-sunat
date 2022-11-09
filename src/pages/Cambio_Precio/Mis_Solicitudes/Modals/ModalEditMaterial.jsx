import React, { useCallback, useEffect, useRef, useState } from "react";
import BtnCancel from "../../../../components/BtnCancel";
import BtnSave from "../../../../components/BtnSave";
import InputForm from "../../../../components/InputForm";
import McMaterial from "../../Modals_General/McMaterial";
import toast, { Toaster } from "react-hot-toast";
import {
  AprobMargen,
  GetDetalleSolicitud,
  ModificarRequestDetail,
} from "../../../../Services/ServiceCambioPrecio";

const ModalEditMaterial = ({
  showModalEditMaterial,
  setShowModalEditMaterial,
  dataMaterial,
  setDetalle,
}) => {
  // console.log("MATERIAL", dataMaterial);

  const [showMcMaterial, setShowMcMaterial] = useState(false);

  const [activateButton, setActivateButton] = useState(false);

  // DATA MATERIAL
  const [material, setMaterial] = useState({
    actual_price: 0.0,
    currency: "",
    end_date: "",
    id: 0,
    id_request: 0,
    lower_limit: 0.0,
    margin: 0.0,
    material: "",
    material_name: "",
    start_date: "",
    suggested_price: 0.0,
    upper_limit: 0.0,
    center: "",
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
    // loadDataFromControls();
    setMaterial(dataMaterial);
    // console.log(dataMaterial.id_request);
    document.addEventListener("keydown", keyPress);
    return () => document.removeEventListener("keydown", keyPress);
  }, [keyPress]);

  // const loadDataFromControls = () => {
  //   for (let i = 0; i < dataMaterial.length; i++) {
  //     const element = dataMaterial[i];
  //     if (element.cod_mat == idMaterial) {
  //       setMaterial(dataMaterial[i]);
  //     }
  //   }
  // };

  const cancelar = () => {
    setShowModalEditMaterial(false);
  };

  const calcularMargen = () => {
    let model = {
      itAprobmargen: [
        {
          Matnr: material.material,
          Werks: material.center, // guardar centro en bd
          PreSuge: material.suggested_price,
          Margen: 0.0,
        },
      ],
    };

    AprobMargen(model).then((result) => {
      // console.log("MARGEN", result.etAprobmargenField[0].margenField);
      setMaterial((prevState) => ({
        ...prevState,
        margin: result.etAprobmargenField[0].margenField,
      }));
      setActivateButton(false);
    });
  };

  const guardar = () => {
    // console.log("guardar");
    let model = {
      id: material.id,
      suggested_price:
        typeof material.suggested_price == "number"
          ? material.suggested_price
          : Number(material.suggested_price.replaceAll(",", "")),
      lower_limit:
        typeof material.lower_limit == "number"
          ? material.lower_limit
          : Number(material.lower_limit.replaceAll(",", "")),
      upper_limit:
        typeof material.upper_limit == "number"
          ? material.upper_limit
          : Number(material.upper_limit.replaceAll(",", "")),
      end_date: material.end_date,
      margin:
        typeof material.margin == "number"
          ? material.margin
          : Number(material.margin.replaceAll(",", "")),
    };
    console.log(model);
    // llamado a servicio parar modificar request detail
    ModificarRequestDetail(model).then((result) => {
      console.log(result);
      GetDetalleSolicitud(dataMaterial.id_request).then((result) => {
        console.log(result);
        setDetalle(result);
        // setViewInfo(true);
      });
    });

    setShowModalEditMaterial(false);
  };

  function handleChange(name, value) {
    // console.log(name, " : ", value);
    switch (name) {
      case "material":
        setMaterial((prevState) => ({
          ...prevState,
          material: value,
        }));
        break;
      case "precio_actual":
        setMaterial((prevState) => ({
          ...prevState,
          actual_price: value,
        }));
        break;
      case "precio_sugerido":
        setMaterial((prevState) => ({
          ...prevState,
          suggested_price: value,
        }));
        setActivateButton(true);
        break;
      case "limite_inferior":
        setMaterial((prevState) => ({
          ...prevState,
          lower_limit: value,
        }));
        break;
      case "limite_superior":
        setMaterial((prevState) => ({
          ...prevState,
          upper_limit: value,
        }));
        break;
      case "fecha_inicio":
        setMaterial((prevState) => ({
          ...prevState,
          start_date: value,
        }));
        break;
      default:
        console.log(name, " : ", value);
        setMaterial((prevState) => ({
          ...prevState,
          end_date: value,
        }));
        break;
    }
  }

  function convertDecimal(num) {
    // console.log(num);
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

  const formatFecha = (fecha) => {
    // console.log(fecha);
    let newDate = "";
    if (fecha != null || fecha != undefined || fecha != "") {
      newDate = fecha.split("-");
    }
    return newDate[0] + "-" + newDate[1] + "-" + newDate[2];
  };

  const extraeFecha = (fecha) => {
    console.log(fecha);
    if (fecha.includes("T")) {
      let parts = fecha.split("T");
      return parts[0];
    } else {
      return formatFecha(fecha);
    }
  };

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
                      value: material.material,
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
                        value: convertDecimal(material.actual_price),
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
                        value: convertDecimal(material.suggested_price),
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
                        value: convertDecimal(material.lower_limit),
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
                        value: convertDecimal(material.upper_limit),
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
                      value: extraeFecha(material.start_date),
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
                      value: extraeFecha(material.end_date),
                      disabled: false,
                      checked: false,
                    }}
                    handleChange={handleChange}
                    onClick={() => {}}
                  />
                </div>
              </div>
              {activateButton && (
                <div className="row-md">
                  <BtnSave
                    attribute={{
                      name: "btnCalcular",
                      value: "Calcular margen",
                      classNamebtn: "btn_search",
                    }}
                    onClick={() => calcularMargen()}
                  />
                </div>
              )}
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
