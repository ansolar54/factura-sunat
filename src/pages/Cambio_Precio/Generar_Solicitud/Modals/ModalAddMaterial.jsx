import React, { useCallback, useEffect, useRef, useState } from "react";
import BtnCancel from "../../../../components/BtnCancel";
import BtnSave from "../../../../components/BtnSave";
import InputForm from "../../../../components/InputForm";
import InputFormKeyUp from "../../../../components/InputFormKeyUp";
// import McMaterial from "../../Modals_General/McMaterial";
import toast, { Toaster } from "react-hot-toast";
// import { AprobMargen } from "../../../../Services/ServiceCambioPrecio";
import Spinner from "../../../../components/Spinner";
import { InputText } from 'primereact/inputtext';

const ModalAddMaterial = ({
  showModalMaterial,
  setShowModalMaterial,
  dataMaterial,
  SUM_IMPORTE_TOTAL,
}) => {

  // console.log("dasdasdasdasdasdasd", SUM_IMPORTE_TOTAL)

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
      limpiarControles();
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
    if (indicator) {
      dataMaterial.push(material);
      setShowModalMaterial(false);
      limpiarControles();
      setIndicator(false);

    }
  }, [indicator]);

  useEffect(() => {
    document.addEventListener("keydown", keyPress);
    return () => document.removeEventListener("keydown", keyPress);
  }, [keyPress]);

  const limpiarControles = () => {
    setMaterial({
      codigoProducto: "",
      descripcion: "",
      cantidad: "",
      unidadMedida: "UND",
      precioUnitario: "",
      importe: "",
    });
  };

  const closeModalButton = () => {
    limpiarControles();
    setShowModalMaterial((prev) => !prev);
  };

  const cancelar = () => {
    limpiarControles();
    setShowModalMaterial(false);
  };

  const calcularMargen = () => {


    setMaterial({
      ...material,

    });
    setMaterial((prevState) => ({
      ...prevState,


    }));
    setActivateButton(false);
    setspinner(false);
    setIndicator(true);

    console.log("IMPORTE ADD", material.importe)
  };

  // console.log(material);

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

  // console.log(material);

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

  // let separador = document.getElementById('precio_sugerido');

  // if (separador) {
  //   separador.addEventListener('keyup', (e) => {
  //     var entrada = e.target.value.split('.'),
  //       parteEntera = entrada[0].replace(/\,/g, ''),
  //       parteDecimal = entrada[1],
  //       salida = parteEntera.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");

  //     e.target.value = salida + (parteDecimal !== undefined ? '.' + parteDecimal : '');
  //   }, false);
  // }

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
      {showModalMaterial ? (
        <div
          className="container-modal-background"
          onClick={closeModal}
          ref={modalRef}
        >
          <Toaster />
          <div className="modal-wrapper modal-wrapper-sm-1">
            <div className="modal-header">
              <div className="modal-title">
                <h5>Agregar Producto</h5>
              </div>
              <div
                className="close-modal-button"
                onClick={() => closeModalButton()}
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
                      matchcode: false,
                    }}
                    handleChange={handleChange}
                  // onClick={() => setShowMcMaterial((prev) => !prev)}
                  /> */}

                  <InputText
                    style={{ width: "785px" }}
                    keyfilter="int"
                    // placeholder="RUC"
                    value={material.codigoProducto}
                    name="codigo_Producto"
                    onChange={(e) => handleChange(e.target.name, e.target.value)}
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
                        disabled: false,
                        checked: false,
                        maxlength: "3"
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
                      value= {material.importe = convertDecimal(material.cantidad * material.precioUnitario)}
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

export default ModalAddMaterial;
