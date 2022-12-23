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
  GetSolicitudLimit,
  GuardarSolicitud,
  UsuarioNotifi,
} from "../../../Services/ServiceCambioPrecio";
import { getMailGerents } from "../../../Services/ServiceUser";
import Spinner from "../../../components/Spinner";

const GenerarSolicitud = () => {
  const [showModalMaterial, setShowModalMaterial] = useState(false);
  const [showModalEditMaterial, setShowModalEditMaterial] = useState(false);
  const [idMaterial, setIdMaterial] = useState();
  const [precioSugeridoMaterial, setprecioSugeridoMaterial] = useState();

  // DATA MATERIAL
  const [dataMaterial, setDataMaterial] = useState([]);

  // ORG VENTAS
  const [orgVentasValue, setOrgVentasValue] = useState(""); // IsVkorg
  const [orgVentasName, setOrgVentasName] = useState("");
  const [orgVentas, setOrgVentas] = useState([
    { Sign: "I", Option: "EQ", Low: "", High: "" },
  ]);
  const [showOrgVentas, setShowOrgVentas] = useState(false);

  // CLIENTE
  const [IsCliente, setIsCliente] = useState(""); // IsKunnr
  const [isClientName, setIsClientName] = useState("");
  const [showMcCliente, setShowMcCliente] = useState(false);

  // PARA OBTENER CANAL DE DIST. DE MATCH CLIENTE
  const [canalDistValue, setCanalDistValue] = useState("");
  const [CanalDistDescValue, setCanalDistDescValue] = useState("");
  // OBTENER OFICINA DE VENTAS PARA REGISTRAR EN TB_REQUEST
  const [ofiVentas, setOfiVentas] = useState("");

  //CARGA DE SPINNER
  const [spinner, setspinner] = useState(false);

  console.log("DATA MATERIAL GENERAR SOLICITUD",dataMaterial);



  const openEditMaterial = (id_material,precio_sugerido) => {
    setIdMaterial(id_material);
    setprecioSugeridoMaterial(precio_sugerido);
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
  const [dialog1, setDialog1] = useState({
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
  const handleDialog1 = (message, isLoading, nameProduct) => {
    setDialog1({
      message,
      isLoading,
      //Update
      nameProduct,
    });
  };

  const handleDelete = (id) => {
    //Update
    // const index = data.findIndex((p) => p.id === id);

    handleDialog1("¿Seguro de eliminar el registro?", true, "");
    idProductRef.current = id;
  };

  const handleEnviarSolicitud = () => {
    //Update
    // const index = data.findIndex((p) => p.id === id);

    handleDialog("¿Seguro de enviar esta solicitud?", true, "");
    //idProductRef.current = id;
  };

  const areUSureSend = (choose) => {
    console.log(choose);
    if (choose) {
      // SE PASA A ELIMINAR REGISTRO
      // setProducts(products.filter((p) => p.id !== idProductRef.current));
      enviarSolicitud();
      // setDataMaterial(
      //   dataMaterial.filter((p) => p.cod_mat !== idProductRef.current)
      // );
      handleDialog("", false);
    } else {
      handleDialog("", false);
    }
  };

  const areUSureDelete = (choose) => {
    console.log(choose);
    if (choose) {
      // SE PASA A ELIMINAR REGISTRO
      // setProducts(products.filter((p) => p.id !== idProductRef.current));
      setDataMaterial(
        dataMaterial.filter((p) => p.cod_mat !== idProductRef.current)
      );
      handleDialog1("", false);
    } else {
      handleDialog1("", false);
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

  function solounproducto() {
    const openAddMaterial = () => {
      setShowModalMaterial((prev) => !prev);
    };
    if (dataMaterial.length != 0) {
      toast.error("Solo se puede seleccionar un material.", {
        position: "top-center",
        autoClose: 1000,
        style: {
          backgroundColor: "#212121",
          color: "#fff",
        }
      })
    }
    else {
      return openAddMaterial();
    }
  }

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
      let detalleCorreo = []
      for (let i = 0; i < dataMaterial.length; i++) {
        const element = dataMaterial[i];
        // console.log(Number(element.prec_sug.replaceAll(",", "")));
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

        let detalle = {
          producto: element.name_mat,
          moneda: element.moneda,
          precio: convertDecimal(element.prec_sug.toString()),
          // typeof element.prec_act == "String"
          //   ? element.prec_act
          //   : (element.prec_act.replaceAll(",", "")).toString,
          fec_ini: formatFechaMysql(element.fec_ini),
          fec_fin: formatFechaMysql(element.fec_fin),
        };

        detalleCorreo.push(detalle);
      }

     console.log("DATA DETAILS GENERAR SOLI",data_detail);

      let model_usua_notifi = {
        IsNotif: "1",
        IsUser: "",
        IsVkbur: "",
        IsVkorg: orgVentasValue,
      };
      let correos = [];



      UsuarioNotifi(model_usua_notifi).then((result) => {
        console.log("SAP", result.etListusuariosField.length);
        if (result.etListusuariosField.length > 0) {
          for (let i = 0; i < result.etListusuariosField.length; i++) {
            const element = result.etListusuariosField[i];
            let mails = {
              email: element.correoField,
            };
            correos.push(mails); // se pasa lista de correo de gerentes
          }

          // provisional
          let mails = {
            email: "amendozac@farmex.com.pe",
            //email: "ansolar54@gmail.com",
          };



          // correos = result.data; // se pasa lista de correo de gerentes
          // se debe de enviar canal de Distribución (Canal de Venta)
          let model = {
            sales_org: orgVentasValue,
            client: IsCliente,
            client_name: isClientName,
            id_user: Number(jwt(localStorage.getItem("_token")).nameid),
            sales_ofi: ofiVentas,
            sales_org_desc: orgVentasName,
            sales_channel: canalDistValue,
            sales_channel_desc: CanalDistDescValue,
            detail: data_detail,
          };
          //console.log("generando solicitud",model);
          GuardarSolicitud(model).then((result) => {
            let mensajedialog = result;
            console.log("DATOS GUARDAR SOLICITUD",result);
            if (result.indicator == 1) {
              // OBTENER SOLICITUD CREADA - se necesita el id generado
              GetSolicitudLimit().then((result) => {
                if (result.data.length > 0) {
                  // ENVIAR SOLICITUD PARA APROBACION POR CORREO
                  let model_correo = {
                    nro_solicitud: result.data[0].id.toString(),
                    cliente: isClientName,
                    vendedor: jwt(localStorage.getItem("_token")).user,
                    org_ventas: orgVentasName,
                    correos: [mails],
                    detalle: detalleCorreo,
                  };
                  console.log("MODEL CORREO", model_correo);
                  EnviarCorreo(model_correo).then((result) => {
                    console.log(result);
                    if (result.indicator == 1) {
                      toast.success(mensajedialog.message,{
                        position: "top-center",
                        autoClose: 3000,
                        style: {
                          backgroundColor: "#212121",
                          color: "#fff",
                        },
                      });
                      setDataMaterial([]);
                      setOrgVentasValue("");
                      setOrgVentasName("");
                      setIsCliente("");
                      setIsClientName("");
                      setspinner(false);
                    } else {
                      setspinner(false);
                    }
                  });
                }
              });

              // ----------------------------------------
            } else {
              toast.error(result.message, {
                position: "top-center",
                autoClose: 3000,
                style: {
                  backgroundColor: "#212121",
                  color: "#fff",
                }
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

  const getDateAct = () => {
    let date = new Date();

    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    if (month < 10) {
      return `${day}/0${month}/${year}`;
      // console.log(`${day}-0${month}-${year}`);
    } else {
      return `${day}/${month}/${year}`;
      // console.log(`${day}-${month}-${year}`);
    }
  };

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
          canalDistValue={canalDistValue}
        />
        <ModalEditMaterial
          showModalEditMaterial={showModalEditMaterial}
          setShowModalEditMaterial={setShowModalEditMaterial}
          dataMaterial={dataMaterial}
          idMaterial={idMaterial}
          precioSugeridoMaterial={precioSugeridoMaterial}
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
          orgVentasValue={orgVentasValue}
          setCanalDistValue={setCanalDistValue}
          setCanalDistDescValue={setCanalDistDescValue}
          setOfiVentas={setOfiVentas}
        />

        <div className="title-section">
          <div>
            <label>Cambio Precio / Generar Solicitud </label>
            <label >
              Tipo de cambio :{" "}
              <i style={{ color: "#008040" }} class="fas fa-dollar-sign"></i>{" "}
              <label style={{ color: "#008040", fontSize: "17px" }}>
                {localStorage.getItem("_tipoCambio")}
              </label>{" "}
            </label>
          </div>
          <div style={{ justifyContent: "flex-end", display: "flex" }} className="col-md-12">
            <label>
              {" "}
              Fecha :{" "}
              {/* <i class="fas fa-dollar-sign"></i> {" "}:{" "} */}
              <label style={{ color: "#008040" }}>
                {getDateAct()}
              </label>{" "}
            </label>
          </div>
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
                    disabled: true,
                    checked: false,
                    matchcode: true,
                    maxlength: 4,
                    placeholder: "Seleccione..."
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
                    disabled: true,
                    checked: false,
                    matchcode: true,
                    placeholder: "Seleccione..."
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
                //disabled: dataMaterial.length == 0,
              }}
              onClick={() => solounproducto()}
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
                        <th style={{ textAlign: "center" }}>{item.moneda}</th>
                        <th style={{ textAlign: "center" }}>
                          {convertDecimal(item.prec_act)}
                        </th>
                        <th style={{ textAlign: "center" }}>
                          {convertDecimal(item.prec_sug)}
                        </th>
                        <th style={{ textAlign: "center" }}>{formatFecha(item.fec_ini)}</th>
                        <th style={{ textAlign: "center" }}>{formatFecha(item.fec_fin)}</th>
                        <th>
                          <i
                            style={{ cursor: "pointer", margin: "6px" }}
                            title="Editar material"
                            className="fas fa-edit fa-lg"
                            onClick={() => openEditMaterial(item.cod_mat,convertDecimal(item.prec_sug))}
                          ></i>
                          <i
                            style={{ cursor: "pointer", margin: "6px" }}
                            title="Eliminar material"
                            className="fas fa-trash-alt fa-lg"
                            onClick={() => handleDelete(item.cod_mat)}
                          ></i>
                        </th>
                      </tr>
                    )
                    )

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
                  {/* No se encontraron resultados. */}
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
            onClick={() => handleEnviarSolicitud()}
          />
        </div>
        {dialog.isLoading && (
          <Dialog
            //Update
            nameProduct={dialog.nameProduct}
            onDialog={areUSureSend}
            message={dialog.message}
          />
        )}
        {dialog1.isLoading && (
          <Dialog
            //Update
            nameProduct={dialog1.nameProduct}
            onDialog={areUSureDelete}
            message={dialog1.message}
          />
        )}
      </div>
    </React.Fragment>
  );
};

export default GenerarSolicitud;
