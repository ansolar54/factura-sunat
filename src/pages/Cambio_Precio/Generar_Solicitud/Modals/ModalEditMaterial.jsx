import React, { useCallback, useEffect, useRef, useState } from "react";
import BtnCancel from "../../../../components/BtnCancel";
import BtnSave from "../../../../components/BtnSave";
import InputForm from "../../../../components/InputForm";
// import McMaterial from "../../Modals_General/McMaterial";
import toast, { Toaster } from "react-hot-toast";
// import { AprobMargen } from "../../../../Services/ServiceCambioPrecio";
import Spinner from "../../../../components/Spinner";

import { InputText } from 'primereact/inputtext';

const ModalEditMaterial = ({
  showModalEditMaterial,
  setShowModalEditMaterial,
  dataMaterial,
  idMaterial,
  precioSugeridoMaterial
}) => {
  // console.log("DATA MATERIAL EDITAR SOLICITUD",dataMaterial)
  //  console.log("PRECIO SUGERIDO MATERIAL EDITAR SOLICITUD",precioSugeridoMaterial);

  const [showMcMaterial, setShowMcMaterial] = useState(false);

  const [activateButton, setActivateButton] = useState(false);

  const [spinner, setspinner] = useState(false);

  const [indicator, setIndicator] = useState(false);

  // DATA MATERIAL
  const [material, setMaterial] = useState({
    codigoProducto: "",
    descripcion: "",
    cantidad: "",
    unidadMedida: "UND",
    precioUnitario: "",
    importe: "",
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
    // console.log("cambio", material);
    if (indicator) {
      for (let i = 0; i < dataMaterial.length; i++) {
        const element = dataMaterial[i];
        if (element.codigoProducto == idMaterial) {
          element.descripcion = material.descripcion;
          element.cantidad = material.cantidad;
          element.unidadMedida = material.unidadMedida;
          element.precioUnitario = material.precioUnitario;
          element.importe = material.importe;
        }
      }
      // setActivateButton(false);
      setShowModalEditMaterial(false);
      setIndicator(false);
    }
  }, [indicator]);

  useEffect(() => {
    loadDataFromControls();
    document.addEventListener("keydown", keyPress);
    return () => document.removeEventListener("keydown", keyPress);
  }, [keyPress]);

  const loadDataFromControls = () => {
    for (let i = 0; i < dataMaterial.length; i++) {
      const element = dataMaterial[i];
      if (element.codigoProducto == idMaterial) {
        setMaterial(dataMaterial[i]);
      }
    }
  };

  const cancelar = () => {
    setShowModalEditMaterial(false);
  };

  const calcularMargen = () => {
    setspinner(true);
    // let model = {
    //   itAprobmargen: [
    //     {
    //       Matnr: material.cod_mat,
    //       Werks: material.centro,
    //       //LimInfer: material.lim_inf,
    //       PreSuge: material.prec_sug,
    //       Margen: 0.0,
    //     },
    //   ],
    // };
    setMaterial((prevState) => ({
      ...prevState,


    }));

    setActivateButton(false);
    setspinner(false);
    setIndicator(true);

    // AprobMargen(model).then((result) => {
    //   // console.log("MARGEN", result.etAprobmargenField[0].margenField);
    //   setMaterial((prevState) => ({
    //     ...prevState,
    //     margen: result.etAprobmargenField[0].margenField,
    //   }));
    //   // setActivateButton(false);
    //   setspinner(false);
    //   setIndicator(true);
    // });
  };

  const guardar = () => {
    // console.log(material.prec_sug, material.lim_inf);
    console.log(typeof material.codigoProducto, typeof material.descripcion, typeof material.cantidad);
    console.log(material.codigoProducto, material.descripcion, material.cantidad)
    if (material.codigoProducto === "" || material.descripcion === "" || material.cantidad === "" || material.precioUnitario === "") {
      toast.error("Debe rellenar los campos obligatorios.", {
        position: "top-center",
        autoClose: 5000,
        style: {
          backgroundColor: "#212121",
          color: "#fff",
        },
      });
    }
    else {
      calcularMargen();

    }
  };

  function handleChange(name, value) {
    //  console.log(name, " : ", value);
    switch (name) {
      case "codigo_Producto":
        setMaterial((prevState) => ({
          ...prevState,
          codigoProducto: value,
        }));
        break;
      case "descripcion":
        setMaterial((prevState) => ({
          ...prevState,
          descripcion: value.toUpperCase(),
        }));
        break;
      case "cantidad":
        setMaterial((prevState) => ({
          ...prevState,
          cantidad: value,
        }));
        // setActivateButton(true); // activar boton calcular margen
        break;
      case "unidadMedida":
        setMaterial((prevState) => ({
          ...prevState,
          unidadMedida: value.toUpperCase(),
        }));
        break;
      case "precioUnitario":
        setMaterial((prevState) => ({
          ...prevState,
          precioUnitario: value,
        }));
        break;
      case "importe":
        setMaterial((prevState) => ({
          ...prevState,
          importe: value,
        }));
        break;
      default:
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

  const formatFecha = (fecha) => {
    // console.log(fecha);
    if (fecha != null || fecha != undefined || fecha != "") {
      if (fecha.length == 10) {
        return fecha;
      } else {
        return (
          fecha.substr(0, 4) +
          "-" +
          fecha.substr(4, 2) +
          "-" +
          fecha.substr(6, 2)
        );
      }
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
          {/* <McMaterial
            showMcMaterial={showMcMaterial}
            setShowMcMaterial={setShowMcMaterial}
          /> */}
          <div className="modal-wrapper modal-wrapper-sm-1">
            <div className="modal-header">
              <div className="modal-title">
                <h5>Editar Producto</h5>
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
                <div className="col-sm-3 d-flex align-items-center">
                  <label>
                    <label>Códidgo Producto : </label>{" "}
                    <label style={{ color: "red" }}>(*)</label>
                  </label>
                </div>
                <div>
                  {/* <InputForm
                    attribute={{
                      name: "codigo_Producto",
                      id: "codigo_Producto",
                      type: "number",
                      value: material.codigoProducto,
                      disabled: false,
                      checked: false,
                      // matchcode: false,
                    }}
                    handleChange={""}
                    // onClick={() => setShowMcMaterial((prev) => !prev)}
                  /> */}
                  <InputText
                    style={{ width: "785px" }}
                    keyfilter="int"
                    // placeholder="RUC"
                    value={material.codigoProducto}
                    name="codigo_Producto"
                    readOnly
                    // onChange={(e) => handleChange(e.target.name, e.target.value)}
                    maxLength={10}
                  />
                </div>
              </div>
              <div className="row-md">
                <div className="col-sm-2 d-flex align-items-center">
                  <label>
                    <label>Descripción : </label>{" "}
                    <label style={{ color: "red" }}>(*)</label>
                  </label>
                  {/* <label>Descripción : </label> */}
                </div>
                <div>
                  {/* <InputForm
                    attribute={{
                      name: "descripcion",
                      type: "text",
                      value: material.descripcion,
                      disabled: false,
                      checked: false,
                      matchcode: false,
                      maxlength: 200
                    }}
                    handleChange={handleChange}
                  // onClick={() => setShowMcMaterial((prev) => !prev)}
                  /> */}
                  <InputText
                    style={{ width: "785px" }}
                    // keyfilter="int"
                    // placeholder="RUC"
                    type="text"
                    value={material.descripcion}
                    name="descripcion"
                    onChange={(e) => handleChange(e.target.name, e.target.value)}
                    maxLength={200}
                  />
                </div>
              </div>
              <div className="row-md">
                <div className="col-md col-md-6">
                  <div>
                    <label>
                      <label>Cantidad : </label>{" "}
                      <label style={{ color: "red" }}>(*)</label>
                    </label>
                    {/* <label>Cantidad : </label> */}
                  </div>
                  <div>
                    {/* <InputForm
                      attribute={{
                        name: "cantidad",
                        type: "number",
                        value: (material.cantidad),
                        disabled: false,
                        checked: false,
                        placeholder: "0"
                      }}
                      handleChange={handleChange}
                    /> */}
                    <InputText
                      style={{ width: "400px" }}
                      // keyfilter="int"
                      placeholder="0"
                      type="number"
                      value={material.cantidad}
                      name="cantidad"
                      onChange={(e) => handleChange(e.target.name, e.target.value)}
                    // maxLength={200}
                    />
                  </div>
                </div>
                <div className="col-md col-md-6">
                  <div>
                    <label>Unidad de Medida : </label>
                  </div>
                  <div>

                    {/* <InputForm
                      attribute={{
                        name: "unidadMedida",
                        type: "text",
                        value: (material.unidadMedida),
                        checked: false,
                        maxlength: "3",
                        disabled: false,
                      }}
                      handleChange={handleChange}
                    //onKeyUp={(e) => formatoComaDecimal(e.target.value)}
                    /> */}
                    <InputText
                      style={{ width: "400px" }}
                      // keyfilter="int"
                      // placeholder="0"
                      type="text"
                      value={material.unidadMedida}
                      name="unidadMedida"
                      onChange={(e) => handleChange(e.target.name, e.target.value)}
                      maxLength={3}
                    />
                  </div>
                </div>
              </div>
              <div className="row-md">
                <div className="col-md col-md-6">
                  <div>
                    <label>
                      <label>Precio Unitario : </label>{" "}
                      <label style={{ color: "red" }}>(*)</label>
                    </label>
                    {/* <label>Precio Unitario : </label> */}
                  </div>
                  <div>
                    {/* <InputForm
                      attribute={{
                        name: "precioUnitario",
                        type: "number",
                        value: (material.precioUnitario),
                        disabled: false,
                        checked: false,
                        placeholder: "0.00"
                      }}
                      handleChange={handleChange}
                    /> */}

                    <InputText
                      style={{ width: "400px" }}
                      // keyfilter="int"
                      placeholder="0.00"
                      type="number"
                      value={material.precioUnitario}
                      name="precioUnitario"
                      onChange={(e) => handleChange(e.target.name, e.target.value)}
                    // maxLength={200}
                    />
                  </div>
                </div>
                <div className="col-md col-md-6">
                  <div>
                    <label>Importe : </label>
                  </div>
                  <div>
                    {/* <InputForm
                      attribute={{
                        name: "importe",
                        type: "text",
                        value: material.importe = convertDecimal(material.cantidad * material.precioUnitario),
                        disabled: true,
                        checked: false,
                        placeholder: "0.00"
                      }}
                      handleChange={handleChange}
                    /> */}
                    <InputText
                      style={{ width: "400px" }}
                      // keyfilter="int"
                      placeholder="0.00"
                      readOnly
                      type="text"
                      value={material.importe = convertDecimal(material.cantidad * material.precioUnitario)}
                      name="importe"
                      onChange={(e) => handleChange(e.target.name, e.target.value)}
                    // maxLength={200}
                    />
                  </div>
                </div>
              </div>

              {spinner && <Spinner />}
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
