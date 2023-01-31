import React, { useCallback, useEffect, useRef, useState } from "react";
import BtnCancel from "../../../../components/BtnCancel";
import BtnSave from "../../../../components/BtnSave";
import InputForm from "../../../../components/InputForm";
import McMaterial from "../../Modals_General/McMaterial";
import Dialog from "../../Dialog";
import toast, { Toaster } from "react-hot-toast";
import {
  AprobMargen,
  EnviarCorreoAprob,
  GetDetalleSolicitud,
  GetSolicitud,
  ModificarRequestDetail,
  UsuarioNotifi,
  ModificarStateRequest,
  AprobSolicitud,
  UpdateDetailRequestLastAprobRequest,
  
} from "../../../../Services/ServiceCambioPrecio";
import Spinner from "../../../../components/Spinner";
import { getUser } from "../../../../Services/ServiceUser";
import jwt from "jwt-decode";

const ModalEditMaterial = ({
  showModalEditMaterial,
  setShowModalEditMaterial,
  dataMaterial,
  setDetalle,
  idUser,
  salesOfi,
  orgVentasDesc,
  codi_client,
  org_ventas,
  obtenerSolicitudesF,
  itMatAprob,
}) => {

  console.log("OBTENER SOLI EDITAR", obtenerSolicitudesF);
  //console.log("ORG_VENTAS", org_ventas);
  // console.log("ITMAT_APROB", itMatAprob);
  //console.log("ORG VENTAS DESC", orgVentasDesc);

  const [showMcMaterial, setShowMcMaterial] = useState(false);

  const [activateButton, setActivateButton] = useState(false);

  const [spinner, setspinner] = useState(false);

  const [indicator, setIndicator] = useState(false);

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
    // console.log("cambio", material);
    if (indicator) {
      setspinner(true);
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
      let detalle_mat = [];
      let itMatAprob = [];
      let detailMaterial = [];
      ModificarRequestDetail(model).then((result) => {
        console.log(result);
        GetDetalleSolicitud(dataMaterial.id_request).then((result) => {
          console.log(result);
          setDetalle(result);
          // setViewInfo(true);
          for (let i = 0; i < result.data.length; i++) {
            const element = result.data[i];
            // mapeamos los campos para detalle de correo
            let detalle = {
              producto: element.material_name,
              moneda: element.currency,
              precio: convertDecimal(element.suggested_price.toString()),
              fec_ini: formatFechaForCorreo(element.start_date.split("T")[0]),
              fec_fin: formatFechaForCorreo(element.end_date.split("T")[0]),
            };

            detalle_mat.push(detalle);


            let matAprob = {
              Matnr: element.material,
              Maktx: element.material_name,
              Kbetr: element.actual_price, // reemplazo de suggested_price
              Konwa: element.currency,
              Kpein: element.base_amount,
              Kmein: element.measure_unit,
              Datab: formatoFechaForAprob(element.start_date), // yyyymmdd - formatear
              Datbi: formatoFechaForAprob(element.end_date), // yyyymmdd - formatear
              Mxwrt: element.suggested_price, // reeplazo de lower_limit
              Gkwrt: element.upper_limit,
            };
            itMatAprob.push(matAprob);

            console.log(matAprob)

            let material = {
              id: element.id,
              suggested_price: element.actual_price,
              lower_limit: element.suggested_price,
            };
            detailMaterial.push(material);

          }
          // IMPLEMENTACION PARA NOTIFICAR POR CORREO LA MODIFICACION DE DETALLE DE SOLICITUD
          // IMPLEMENTAR SERVICIO EN C# QUE CUANDO LE ENVIE material.id_request DEVUELVA LA SOLICITUD CABECERA DE TB_REQUEST
          GetSolicitud(dataMaterial.id_request).then((result) => {
            if (result.indicator == 1) {
              let client = result.data[0].client_name;
              let nro_solicitud = result.data[0].id.toString();

              getUser(idUser).then((result) => {
                if (result.indicator == 1) {
                  // console.log(result.data[0].id_user);
                  let model_usua_notifi = {
                    IsNotif: "2",
                    IsUser: result.data[0].username,
                    IsVkbur: salesOfi,
                    IsVkorg: "",
                  };
                  let correos = [];
                  UsuarioNotifi(model_usua_notifi).then((result) => {
                    if (result.etListusuariosField.length > 0) {
                      for (
                        let i = 0;
                        i < result.etListusuariosField.length;
                        i++
                      ) {
                        const element = result.etListusuariosField[i];
                        let mails = {
                          email: element.correoField,
                        };
                        correos.push(mails); // se pasa lista de correo de gerentes
                      }

                      // provisional
                      let mails = {
                        email: "gnieri@farmex.com.pe",
                        // email: "ansolar54@gmail.com",
                      };

                      let model_email_aprob = {
                        state: 6, // para identificar aprobacion o rechazo de solicitud en backend
                        nro_solicitud: nro_solicitud,
                        cliente: client,
                        org_ventas: orgVentasDesc,
                        aprobador: jwt(localStorage.getItem("_token")).user, // se obtiene nombre de usuario de token vendedor = aprobador
                        correos: [mails],
                        detalle: detalle_mat,
                      };
                      console.log("MODEL EMAIL APROB", model_email_aprob);
                      EnviarCorreoAprob(model_email_aprob).then((result) => {
                        console.log(result);
                        let model = {
                          id: Number(nro_solicitud),
                          state: "1",
                          id_manager: Number(jwt(localStorage.getItem("_token")).nameid),
                        };
                        if (result.indicator == 1) {
                          ModificarStateRequest(model).then((result) => {
                            console.log("estado - modificado", result);
                          });

                          let model_aprob = {
                            // REVISAR CODI_CLIENT
                            IsKunnr: codi_client,
                            IsVkorg: org_ventas,
                            ItMatAprobacion: itMatAprob,
                          };
                          console.log('MODEL APROB ', model_aprob);
                          AprobSolicitud(model_aprob).then((result) => {
                            console.log("MODIFICADA Y APROBADA",result);
                            if (result.etMsgReturnField[0].successField == "X") {
                              // let email_solicitante = "";
                              // modificacion de detalle de solicitud en base de datos
                              console.log('DETAIL', detailMaterial)
                              UpdateDetailRequestLastAprobRequest({
                                detailMaterial: detailMaterial,
                              }).then((result) => {
                                console.log("result modify detail", result);
                                setIndicator(false);
                                //setIsLoading(false)
                                toast.success("Solicitud N° " + model_email_aprob.nro_solicitud+" modificada y aprobada correctamente.", {
                                  position: "top-center",
                                  autoClose: 6000,
                                  style: {
                                    backgroundColor: "#212121",
                                    color: "#fff",
                                  },
                                });
                                setShowModalEditMaterial(false);
                                setspinner(false);
                                obtenerSolicitudesF(1);
                              });
                            }
                          })




                        } else {
                          setspinner(false);
                        }
                      });
                    }
                  });
                }
              });
            }
          });
        });
      });

      //setShowModalEditMaterial(false);
      //setIndicator(false);
    }
  }, [indicator]);

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

  const formatFechaForCorreo = (fecha) => {
    let parts = fecha.split("-");
    return parts[2] + "-" + parts[1] + "-" + parts[0];
  };

  const formatoFechaForAprob = (fecha) => {
    let parts = fecha.split("T");
    let newDate = parts[0].split("-");
    return newDate[0] + newDate[1] + newDate[2];
  };

  const cancelar = () => {
    setShowModalEditMaterial(false);
  };

  const calcularMargen = () => {
    let model = {
      itAprobmargen: [
        {
          Matnr: material.material,
          Werks: material.center, // guardar centro en bd
          //LimInfer: material.lower_limit,
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
      // setActivateButton(false);
      setIndicator(true);
    });
  };

  const guardar = () => {
    // console.log("guardar");
    calcularMargen();
  };

  //APROBAR SOLICITUD DIALOG
  const [dialog1, setDialog1] = useState({
    message: "",
    isLoading: false,
    //Update
    nameProduct: "",
  });
  //const itemRef1 = useRef();
  const handleDialog1 = (message, isLoading, nameProduct) => {
    setDialog1({
      message,
      isLoading,
      //Update
      nameProduct,
    });
  };
  const handleApprove = () => {
    //Update
    // const index = data.findIndex((p) => p.id === id);

    handleDialog1("Desea aprobar el nuevo precio?", true, "");
    //itemRef1.current = item;
  };
  const areUSureApprove = (choose) => {
    console.log(choose);
    if (choose) {
      guardar();
      //anularSolicitud(4, itemRef.current)
      handleDialog1("", false);
    } else {
      handleDialog1("", false);
    }
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
        // setActivateButton(true);
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
                        disabled: true,
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
                        disabled: true,
                        checked: false,
                      }}
                      handleChange={handleChange}
                    />
                  </div>
                </div>
                {/* <div className="col-md col-md-6">
                  <div>
                    <label>Límite superior : </label>
                  </div>
                  <div>
                    <InputForm
                      attribute={{
                        name: "limite_superior",
                        type: "text",
                        value: convertDecimal(material.upper_limit),
                        disabled: true,
                        checked: false,
                      }}
                      handleChange={handleChange}
                    />
                  </div>
                </div> */}
                <div className="col-md col-md-6">
                  <div>
                    <label>Moneda : </label>
                  </div>
                  <div>
                    <InputForm
                      attribute={{
                        name: "moneda",
                        type: "text",
                        value: material.currency,
                        disabled: true,
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
                    onClick={() => { }}
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
                      min: extraeFecha(material.start_date),
                    }}
                    handleChange={handleChange}
                    onClick={() => { }}
                  />
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
                onClick={() => handleApprove()
                  // guardar()
                }
              />
              {dialog1.isLoading && (
                <Dialog
                  //Update
                  nameProduct={dialog1.nameProduct}
                  onDialog={areUSureApprove}
                  message={dialog1.message}
                />
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default ModalEditMaterial;
