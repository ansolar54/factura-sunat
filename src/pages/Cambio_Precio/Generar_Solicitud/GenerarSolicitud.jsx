import React, { useRef, useState } from "react";
import InputForm from "../../../components/InputForm";
import "./GenerarSolicitud.css";
import BtnAddMaterial from "../../../components/BtnAddMaterial";
import ModalAddMaterial from "./Modals/ModalAddMaterial";
import ModalEditMaterial from "./Modals/ModalEditMaterial";
import McOrgVentas from "../Modals_General/McOrgVentas";
import McCliente from "../Modals_General/McCliente";
import Dialog from "../Dialog";
import toast, { Toaster } from "react-hot-toast";
import jwt from "jwt-decode";
import {
  EnviarCorreo,
  GuardarSolicitud,
} from "../../../Services/ServiceCambioPrecio";
import { getMailGerents } from "../../../Services/ServiceUser";
import Spinner from "../../../components/Spinner";

const GenerarSolicitud = () => {
  const [showModalMaterial, setShowModalMaterial] = useState(false);
  const [showModalEditMaterial, setShowModalEditMaterial] = useState(false);
  const [idMaterial, setIdMaterial] = useState();

  // DATA MATERIAL
  const [dataMaterial, setDataMaterial] = useState([]);

  // ORG VENTAS
  const [orgVentasValue, setOrgVentasValue] = useState("AGRO"); // IsVkorg
  const [orgVentasName, setOrgVentasName] = useState("");
  const [orgVentas, setOrgVentas] = useState([
    { Sign: "I", Option: "EQ", Low: "", High: "" },
  ]);
  const [showOrgVentas, setShowOrgVentas] = useState(false);

  // CLIENTE
  const [IsCliente, setIsCliente] = useState(""); // IsKunnr
  const [isClientName, setIsClientName] = useState("");
  const [showMcCliente, setShowMcCliente] = useState(false);

  //CARGA DE SPINNER
  const [spinner, setspinner] = useState(false);

  const openAddMaterial = () => {
    setShowModalMaterial((prev) => !prev);
  };

  const openEditMaterial = (id_material) => {
    setIdMaterial(id_material);
    setShowModalEditMaterial((prev) => !prev);
  };

  const openMcOrgVentas = () => {
    setShowOrgVentas((prev) => !prev);
  };

  const openMcCliente = () => {
    setShowMcCliente((prev) => !prev);
  };

  // DELETE --------------
  //You can put all product information into diaglog
  const [dialog, setDialog] = useState({
    message: "",
    isLoading: false,
    //Update
    nameProduct: "",
  });
  const idProductRef = useRef();
  const handleDialog = (message, isLoading, nameProduct) => {
    setDialog({
      message,
      isLoading,
      //Update
      nameProduct,
    });
  };

  const handleDelete = (id) => {
    //Update
    // const index = data.findIndex((p) => p.id === id);

    handleDialog("¿Seguro de eliminar el registro?", true, "");
    idProductRef.current = id;
  };

  const areUSureDelete = (choose) => {
    console.log(choose);
    if (choose) {
      // SE PASA A ELIMINAR REGISTRO
      // setProducts(products.filter((p) => p.id !== idProductRef.current));
      setDataMaterial(
        dataMaterial.filter((p) => p.cod_mat !== idProductRef.current)
      );
      handleDialog("", false);
    } else {
      handleDialog("", false);
    }
  };

  // ---------------------

  const formatFecha = (fecha) => {
    // console.log(fecha);
    let newDate = "";
    if (fecha != null || fecha != undefined || fecha != "") {
      if (fecha.length == 10) {
        newDate = fecha.split("-");
        return newDate[2] + "-" + newDate[1] + "-" + newDate[0];
      } else {
        return (
          fecha.substr(6, 2) +
          "-" +
          fecha.substr(4, 2) +
          "-" +
          fecha.substr(0, 4)
        );
      }
    }
  };

  const formatFechaMysql = (fecha) => {
    console.log(fecha);
    if (fecha != null || fecha != undefined || fecha != "") {
      if (fecha.length == 8) {
        return (
          fecha.substr(0, 4) +
          "-" +
          fecha.substr(4, 2) +
          "-" +
          fecha.substr(6, 2)
        );
      } else {
        return fecha;
      }
    }
  };

  const enviarSolicitud = () => {
    // MAPEO DE CAMPOS DE ARREGLO MATERIAL
    setspinner(true);
    if (dataMaterial.length == 0) {
      toast.error("No existen materiales", {
        position: "top-center",
        autoClose: 1000,
        style: {
          backgroundColor: "#212121",
          color: "#fff",
        },
      });
      setspinner(false);
    } else {
      let data_detail = [];
      for (let i = 0; i < dataMaterial.length; i++) {
        const element = dataMaterial[i];
        console.log(Number(element.prec_sug.replaceAll(",", "")));
        let model_detail = {
          material: element.cod_mat,
          material_name: element.name_mat,
          currency: element.moneda,
          actual_price:
            typeof element.prec_act == "number"
              ? element.prec_act
              : Number(element.prec_act.replaceAll(",", "")),
          suggested_price:
            typeof element.prec_sug == "number"
              ? element.prec_sug
              : Number(element.prec_sug.replaceAll(",", "")),
          start_date: formatFechaMysql(element.fec_ini),
          end_date: formatFechaMysql(element.fec_fin),
          lower_limit:
            typeof element.lim_inf == "number"
              ? element.lim_inf
              : Number(element.lim_inf.replaceAll(",", "")),
          upper_limit:
            typeof element.lim_sup == "number"
              ? element.lim_sup
              : Number(element.lim_sup.replaceAll(",", "")),
          margin:
            typeof element.margen == "number"
              ? element.margen
              : Number(element.margen.replaceAll(",", "")),
          center: element.centro,
          measure_unit: element.uni_med,
          base_amount:
            typeof element.cant_base == "number"
              ? element.cant_base
              : Number(element.cant_base.replaceAll(",", "")),
        };
        data_detail.push(model_detail);
      }
      let correos = [];
      getMailGerents(orgVentasValue).then((result) => {
        console.log(result);
        if (result.data.length > 0) {
          correos = result.data; // se pasa lista de correo de gerentes
          let model = {
            sales_org: orgVentasValue,
            client: IsCliente,
            client_name: isClientName,
            id_user: Number(jwt(localStorage.getItem("_token")).nameid),
            detail: data_detail,
          };
          console.log(model);
          GuardarSolicitud(model).then((result) => {
            console.log(result);
            if (result.indicator == 1) {
              setDataMaterial([]);
              setOrgVentasValue("AGRO");
              setOrgVentasName("");
              setIsCliente("");
              setIsClientName("");

              // ENVIAR SOLICITUD PARA APROBACION POR CORREO
              let model_correo = {
                cliente: IsCliente + " - " + isClientName,
                vendedor: jwt(localStorage.getItem("_token")).vendedor,
                correos: correos,
              };
              // console.log(model_correo);
              EnviarCorreo(model_correo).then((result) => {
                console.log(result);
                if (result.indicator == 1) {
                  toast.success("Solicitud creada correctamente.", {
                    position: "top-center",
                    autoClose: 1000,
                    style: {
                      backgroundColor: "#212121",
                      color: "#fff",
                    },
                  });
                  setspinner(false);
                } else {
                  setspinner(false);
                }
              });

              // ----------------------------------------
            } else {
              toast.error("No se pudo enviar la solicitud.", {
                position: "top-center",
                autoClose: 1000,
                style: {
                  backgroundColor: "#212121",
                  color: "#fff",
                },
              });
              setspinner(false);
            }
          });
        } else {
          toast.error(
            "No existen gerentes para la org. de ventas: ." + orgVentasValue,
            {
              position: "top-center",
              autoClose: 5000,
              style: {
                backgroundColor: "#212121",
                color: "#fff",
              },
            }
          );
          setspinner(false);
        }
      });
    }
  };

  function handleChange(name, value) {
    // console.log(value);
    switch (name) {
      case "org_ventas":
        setOrgVentasValue(value);
        break;
      default:
        setIsCliente(value);
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
    <React.Fragment>
      <div className="container-view">
        <Toaster />

        <ModalAddMaterial
          showModalMaterial={showModalMaterial}
          setShowModalMaterial={setShowModalMaterial}
          dataMaterial={dataMaterial}
          orgVentas={orgVentasValue}
          cliente={IsCliente}
        />
        <ModalEditMaterial
          showModalEditMaterial={showModalEditMaterial}
          setShowModalEditMaterial={setShowModalEditMaterial}
          dataMaterial={dataMaterial}
          idMaterial={idMaterial}
        />
        <McOrgVentas
          orgVentasValue={orgVentasValue}
          setOrgVentas={setOrgVentas}
          setOrgVentasValue={setOrgVentasValue}
          setShowOrgVentas={setShowOrgVentas}
          showOrgVentas={showOrgVentas}
          setOrgVentasName={setOrgVentasName}
        />
        <McCliente
          IsCliente={IsCliente}
          setIsCliente={setIsCliente}
          setShowMcCliente={setShowMcCliente}
          showMcCliente={showMcCliente}
          setIsClientName={setIsClientName}
        />

        <div className="title-section">
          <label> Generar Solicitud </label>
          <hr />
        </div>
        <div className="container-form2">
          <div className="container-form1" style={{ width: "90%" }}>
            <div>
              <div className="col-sm-2 d-flex align-items-center">
                <label>Organización de ventas : </label>
              </div>
              <div>
                <InputForm
                  attribute={{
                    name: "org_ventas",
                    type: "text",
                    value: orgVentasValue,
                    disabled: false,
                    checked: false,
                    matchcode: true,
                    maxlength: 4,
                  }}
                  handleChange={handleChange}
                  onClick={() => openMcOrgVentas()}
                />
              </div>
              <div className="align-items-center">
                <label>{orgVentasValue != "" ? orgVentasName : ""}</label>
              </div>
            </div>
            <div>
              <div className="col-sm-2 d-flex align-items-center">
                <label>Cliente : </label>
              </div>
              <div>
                <InputForm
                  attribute={{
                    name: "cliente",
                    type: "text",
                    value: IsCliente,
                    disabled: false,
                    checked: false,
                    matchcode: true,
                  }}
                  handleChange={handleChange}
                  onClick={() => openMcCliente()}
                />
              </div>
              <div className="align-items-center">
                <label>{isClientName != "" ? isClientName : ""}</label>
              </div>
            </div>
          </div>
          <div
            style={{
              flex: 1,
              marginBlock: 10,
            }}
          >
            <BtnAddMaterial
              attribute={{
                name: "Agregar material",
                classNamebtn: "btn_material",
              }}
              onClick={() => openAddMaterial()}
            />
          </div>
        </div>
        <section>
          <div className="container-table">
            <div className="container-table-sm">
              <table className="content-table">
                <thead>
                  <tr>
                    <th style={{ textAlign: "left" }}>MATERIAL</th>
                    <th style={{ textAlign: "left" }}>DENOMINACIÓN</th>
                    <th style={{ textAlign: "left" }}>MONEDA</th>
                    <th style={{ textAlign: "left" }}>PRECIO ACTUAL</th>
                    <th style={{ textAlign: "left" }}>PRECIO SUGERIDO</th>
                    <th style={{ textAlign: "left" }}>FECHA INICIO</th>
                    <th style={{ textAlign: "left" }}>FECHA FIN</th>
                    <th style={{ textAlign: "left" }}>ACCION</th>
                  </tr>
                </thead>
                <tbody>
                  {dataMaterial.length >= 1
                    ? dataMaterial.map((item, key) => (
                        <tr key={item.cod_mat}>
                          <th>{item.cod_mat}</th>
                          <th>{item.name_mat}</th>
                          <th>{item.moneda}</th>
                          <th style={{ textAlign: "center" }}>
                            {convertDecimal(item.prec_act)}
                          </th>
                          <th style={{ textAlign: "center" }}>
                            {convertDecimal(item.prec_sug)}
                          </th>
                          <th>{formatFecha(item.fec_ini)}</th>
                          <th>{formatFecha(item.fec_fin)}</th>
                          <th>
                            <i
                              style={{ cursor: "pointer", margin: "2px" }}
                              title="Editar material"
                              className="fas fa-edit"
                              onClick={() => openEditMaterial(item.cod_mat)}
                            ></i>
                            <i
                              style={{ cursor: "pointer", margin: "2px" }}
                              title="Eliminar material"
                              className="fas fa-trash-alt"
                              onClick={() => handleDelete(item.cod_mat)}
                            ></i>
                          </th>
                        </tr>
                      ))
                    : null}
                </tbody>
              </table>
              {spinner == false && dataMaterial.length == 0 ? (
                <div
                  style={{
                    margin: "10px",
                    textAlign: "center",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  No se encontraron resultados.
                </div>
              ) : null}
              {spinner && <Spinner />}
            </div>
          </div>
        </section>
        <div className="btn-enviar-solicitud">
          <BtnAddMaterial
            attribute={{
              name: "Enviar solicitud",
              classNamebtn: "btn_material",
            }}
            onClick={() => enviarSolicitud()}
          />
        </div>
        {dialog.isLoading && (
          <Dialog
            //Update
            nameProduct={dialog.nameProduct}
            onDialog={areUSureDelete}
            message={dialog.message}
          />
        )}
      </div>
    </React.Fragment>
  );
};

export default GenerarSolicitud;
