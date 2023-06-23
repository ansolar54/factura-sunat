import React, { useRef, useEffect, useState } from "react";
import "./GenerarSolicitud.css";
import BtnAddMaterial from "../../../components/BtnAddMaterial";
import BtnSearch from "../../../components/BtnSearch";
import ModalAddMaterial from "./Modals/ModalAddMaterial";
import ModalEditMaterial from "./Modals/ModalEditMaterial";
// import McOrgVentas from "../Modals_General/McOrgVentas";
// import McCliente from "../Modals_General/McCliente";
import Dialog from "../Dialog";
import Spinner from "../../../components/Spinner";
import toast, { Toaster } from "react-hot-toast";

import InputForm1 from "../../../components/InputForm1";
import { GenerarXML, GuardarFactura } from "../../../Services/ServiceFactura";

import { InputMask } from "primereact/inputmask";
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { addLocale } from 'primereact/api';


const GenerarSolicitud = () => {
  const [showModalMaterial, setShowModalMaterial] = useState(false);
  const [showModalEditMaterial, setShowModalEditMaterial] = useState(false);
  const [idMaterial, setIdMaterial] = useState();
  // const [precioSugeridoMaterial, setprecioSugeridoMaterial] = useState();

  // DATA MATERIAL
  const [dataMaterial, setDataMaterial] = useState([]);

  // MODAL FACTURA
  const [rucEmisor, setrucEmisor] = useState("");
  const [nroFactura, setnroFactura] = useState("F001-");
  const [cliente, setcliente] = useState("");
  const [rucCliente, setrucCliente] = useState("");
  const [direccionCliente, setdireccionCliente] = useState("");
  const [fechaEmision, setfechaEmision] = useState("");
  const [fechaVencimiento, setfechaVencimiento] = useState("");
  const [condicionPago, setcondicionPago] = useState("");
  const [moneda, setmoneda] = useState("DOLARES AMERICANOS");
  const [nroPedido, setnroPedido] = useState("");
  const [ordenCompra, setordenCompra] = useState("");
  const [vendedor, setvendedor] = useState("");
  const [guiaRemision, setguiaRemision] = useState("");
  let [opGravadas, setopGravadas] = useState("");
  const [opInafectas, setopInafectas] = useState("");
  const [opExonerada, setopExonerada] = useState("");
  const [descuentos, setdescuentos] = useState("");
  const [anticipos, setanticipos] = useState("");
  let [igv, setigv] = useState("");
  let [importeTotal, setimporteTotal] = useState("");
  const [observacion, setobservacion] = useState("");

  //CARGA DE SPINNER
  const [spinner, setspinner] = useState(false);

  // console.log("DATA MATERIAL GENERAR SOLICITUD", dataMaterial);

  const openEditMaterial = (id_material) => {
    setIdMaterial(id_material);
    // setprecioSugeridoMaterial(precio_sugerido);
    setShowModalEditMaterial((prev) => !prev);
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

    handleDialog1("¿Seguro de eliminar el producto?", true, "");
    idProductRef.current = id;
  };

  const handleEnviarSolicitud = () => {
    //Update
    // const index = data.findIndex((p) => p.id === id);

    handleDialog("¿Seguro de registrar la factura?", true, "");
    //idProductRef.current = id;
  };

  const areUSureSend = (choose) => {
    // console.log(choose);
    if (choose) {
      enviarFactura();
      handleDialog("", false);
    } else {
      handleDialog("", false);
    }
  };

  const areUSureDelete = (choose) => {
    console.log(choose);
    if (choose) {
      setDataMaterial(
        dataMaterial.filter((p) => p.codigoProducto !== idProductRef.current)
      );
      handleDialog1("", false);
    } else {
      handleDialog1("", false);
    }
  };

  // ---------------------

  const formatFecha = (fecha) => {
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

  // useEffect(() => {
  //   // SUM_IMPORTE_TOTAL();
  // }, []);


  function solounproducto() {
    const openAddMaterial = () => {
      setShowModalMaterial((prev) => !prev);
    };
    // if (dataMaterial.length != 0) {
    //   toast.error("Solo se puede seleccionar un material.", {
    //     position: "top-center",
    //     autoClose: 1000,
    //     style: {
    //       backgroundColor: "#212121",
    //       color: "#fff",
    //     }
    //   })
    // }
    if (rucEmisor == "" || nroFactura == "F001-" || fechaEmision == "" ||
      fechaVencimiento == "" || condicionPago == "" || moneda == "" ||
      nroPedido == "" || ordenCompra == "" || vendedor == "" ||
      guiaRemision == "" || observacion == "" ||
      rucCliente == "" || direccionCliente == "" || cliente == "") {
      toast.error("Debe rellenar los campos de : \" DATOS DE LA FACTURA - EMISOR Y CLIENTE \".", {
        position: "top-center",
        autoClose: 1000,
        style: {
          backgroundColor: "#212121",
          color: "#fff",
        }
      })
    }
    // else {
    return openAddMaterial();
    // }
  }

  function limpiarCampos() {
    // FACTURA - EMISOR
    setrucEmisor("");
    setnroFactura("F001-");
    setfechaEmision("");
    setfechaVencimiento("");
    setcondicionPago("");
    setmoneda("DOLARES AMERICANOS");
    setnroPedido("");
    setordenCompra("");
    setvendedor("");
    setguiaRemision("");
    setobservacion("");
    // CLIENTE
    setrucCliente("");
    setdireccionCliente("");
    setcliente("");
    setDataMaterial([])
  }

  const enviarFactura = () => {

    let data_detail = [];

    for (let i = 0; i < dataMaterial.length; i++) {
      const element = dataMaterial[i];
      let model_detail = {
        codigoProducto: element.codigoProducto,
        descripcion: element.descripcion,
        cantidad: Number(element.cantidad),
        unidadMedida: element.unidadMedida,
        precioUnitario: Number(element.precioUnitario == "" ? 0 : element.precioUnitario),
        importe: element.importe == "" ? 0 : Number((element.importe).replaceAll(",", ""))
      }
      data_detail.push(model_detail);
    }

    let model_factura = {
      rucEmisor: rucEmisor,
      nroFactura: nroFactura,
      cliente: cliente,
      rucCliente: rucCliente,
      direccionCliente: direccionCliente,
      fechaEmision: fechaEmision,
      fechaVencimiento: fechaVencimiento,
      condicionPago: condicionPago,
      moneda: moneda,
      nroPedido: nroPedido,
      ordenCompra: ordenCompra,
      vendedor: vendedor,
      guiaRemision: guiaRemision,
      opGravadas: opGravadas != "" ? Number(Number(opGravadas.replaceAll(",", "")).toFixed(2)) : 0,
      opInafectas: opInafectas != "" ? Number(Number(opInafectas).toFixed(2)) : 0,
      opExonerada: opExonerada != "" ? Number(Number(opExonerada).toFixed(2)) : 0,
      descuentos: descuentos != "" ? Number(Number(descuentos).toFixed(2)) : 0,
      anticipos: anticipos != "" ? Number(Number(anticipos).toFixed(2)) : 0,
      igv: igv != "" ? Number(Number(igv.replaceAll(",", "")).toFixed(2)) : 0,
      importeTotal: importeTotal != "" ? Number(Number(importeTotal.replaceAll(",", "")).toFixed(2)) : 0,
      observacion: observacion,
      detalleFactura: data_detail
    }

    console.log("model factura", model_factura)

    let TiempoEspera;

    function Retraso2Seg(){
      TiempoEspera = setTimeout(FunctionGenerarXML,3000)
    }

    function FunctionGenerarXML(){
        GenerarXML(model_factura).then((result) => {
          if(result.indicator == 1){
            toast.success(result.message, {
              position: "top-center",
              autoClose: 5000,
              style: {
                backgroundColor: "#212121",
                color: "#fff",
              },
            });
          }
          else{
            toast.error(result.message, {
              position: "top-center",
              autoClose: 5000,
              style: {
                backgroundColor: "#212121",
                color: "#fff",
              },
            });
          }
        })
    }

    GuardarFactura(model_factura).then((result) => {
      if (result.indicator == 1) {
        toast.success(result.message, {
          position: "top-center",
          autoClose: 5000,
          style: {
            backgroundColor: "#212121",
            color: "#fff",
          },
        });
        Retraso2Seg();
      }else if (result.indicator == 0) {
        toast.error(result.message, {
          position: "top-center",
          autoClose: 5000,
          style: {
            backgroundColor: "#212121",
            color: "#fff",
          },
        });
      }
      else{
        toast.error("Completar campos obligatorios", {
          position: "top-center",
          autoClose: 5000,
          style: {
            backgroundColor: "#212121",
            color: "#fff",
          },
        });
      }
      console.log("RESULT", result)
    })
  }

  function handleChange(name, value) {
    // console.log(value);
    switch (name) {
      case "ruc_emisor":
        setrucEmisor(value.slice(0, 11));
        break;
      case "nro_factura":
        setnroFactura(value.toUpperCase());
        break;
      case "cliente":
        setcliente(value.toUpperCase());
        break;
      case "ruc_cliente":
        setrucCliente(value.slice(0, 11));
        break;
      case "direccionCliente":
        setdireccionCliente(value.toUpperCase());
        break;
      case "fechaEmision":
        setfechaEmision(value);
        break;
      case "fechaVencimiento":
        setfechaVencimiento(value);
        break;
      case "condicionPago":
        setcondicionPago(value.toUpperCase());
        break;
      case "moneda":
        setmoneda(value.toUpperCase());
        break;
      case "nro_Pedido":
        setnroPedido(value.slice(0, 8));
        break;
      case "orden_Compra":
        setordenCompra(value.slice(0, 10));
        break;
      case "vendedor":
        setvendedor(value.toUpperCase());
        break;
      case "guiaRemision":
        setguiaRemision(value.toUpperCase());
        break;
      case "opGravadas":
        setopGravadas(value);
        break;
      case "opInafectas":
        setopInafectas(value);
        break;
      case "opExonerada":
        setopExonerada(value);
        break;
      case "descuentos":
        setdescuentos(value);
        break;
      case "anticipos":
        setanticipos(value);
        break;
      case "igv":
        setigv(value);
        break;
      case "importeTotal":
        setimporteTotal(value);
// setimporteTotal(convertDecimal(Number(SUM_IMPORTE_TOTAL()).toFixed(2)))
// setimporteTotal(SUM_IMPORTE_TOTAL())
        break;
      case "observacion":
        setobservacion(value.toUpperCase());
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

  // const getDateAct = () => {
  //   let date = new Date();

  //   let day = date.getDate();
  //   let month = date.getMonth() + 1;
  //   let year = date.getFullYear();

  //   if (month < 10) {
  //     return `${day}/0${month}/${year}`;
  //     // console.log(`${day}-0${month}-${year}`);
  //   } else {
  //     return `${day}/${month}/${year}`;
  //     // console.log(`${day}-${month}-${year}`);
  //   }
  // };

  // const [SUM_importeTotal, setSUM_importeTotal] = useState(0);
  function SUM_IMPORTE_TOTAL() {
    let reporte_sum = 0;

    for (let i = 0; i < dataMaterial.length; i++) {
      const element = dataMaterial[i];
      reporte_sum = reporte_sum + Number((element.importe).replaceAll(",", ""))

      console.log("reporte_sum", reporte_sum);

      // reporte_sum.(model_detail);

    }
    // setSUM_importeTotal(reporte_sum)

    // console.log("SUM_importeTotal",SUM_importeTotal);
    // setimporteTotal(reporte_sum)
    return (reporte_sum);

  }

   console.log("first", SUM_IMPORTE_TOTAL())
   console.log("importeTotal",importeTotal)
  // console.log("first", dataMaterial)

  const [value, setValue] = useState('');
  const [date, setDate] = useState(null);

  addLocale('es', {
    firstDayOfWeek: 1,
    dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
    dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
    dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
    monthNames: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
    monthNamesShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
    today: 'Hoy',
    clear: 'Limpiar'
  });

  // console.log("PRUEBITA", date)
  return (
    <React.Fragment>
      <div className="container-view">
        <Toaster />

        <ModalAddMaterial
          showModalMaterial={showModalMaterial}
          setShowModalMaterial={setShowModalMaterial}
          dataMaterial={dataMaterial}
        // SUM_IMPORTE_TOTAL={SUM_IMPORTE_TOTAL()}
        // orgVentas={orgVentasValue}
        // cliente={IsCliente}
        // canalDistValue={canalDistValue}
        />
        <ModalEditMaterial
          showModalEditMaterial={showModalEditMaterial}
          setShowModalEditMaterial={setShowModalEditMaterial}
          dataMaterial={dataMaterial}
          idMaterial={idMaterial}
        // precioSugeridoMaterial={precioSugeridoMaterial}
        />

        <div className="title-section">
          <div>
            <label>Facturas / Registrar Factura </label>
          </div>
          <hr />
        </div>

        <div className="container-form2">
          <div className="container-form1" style={{ width: "100%" }}>
            <div className="title-section">
              <div>
                <label>DATOS DE LA FACTURA - EMISOR </label>
              </div>
            </div>
            <div className="mb-3">
              <div className="col-sm-1 d-flex align-items-center">
                <label>Ruc Emisor : </label>
              </div>
              <div style={{ marginRight: "120px" }}>
                <InputText
                  keyfilter="int"
                  value={rucEmisor}
                  name="ruc_emisor"
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                  maxLength={11}
                />

                {/* <InputForm1
                  attribute={{
                    name: "ruc_emisor",
                    id: "ruc_emisor",
                    type: "number",
                    value: rucEmisor,
                    disabled: false,
                    max: 11
                  }}
                  handleChange={handleChange}
                /> */}
              </div>
              <div className="col-sm-1 d-flex align-items-center">
                <label>Nro Factura : </label>
              </div>
              <div style={{ marginRight: "120px" }}>
                <InputMask
                  name="nro_factura"
                  value={nroFactura}
                  // onKeyDown={(e) => setValue(e.target.value)} 
                  mask="F999-99999999"
                  placeholder="F001-00000000"
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                />
                {/* <InputForm1
                  attribute={{
                    name: "nro_factura",
                    type: "text",
                    value: nroFactura,
                    disabled: false,
                    maxlength: 15,
                  }}
                  handleChange={handleChange}
                /> */}
              </div>
              <div className="col-sm-1 d-flex align-items-center">
                <label>Fch. Emisión : </label>
              </div>
              <div>
                <InputText
                  style={{ width: "213px" }}
                  name="fechaEmision"
                  type="date"
                  // placeholder="Normal"
                  value={fechaEmision}
                  max="9999-12-31"
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                />
                {/* <Calendar
                  // name="fechaEmision"
                  value={date}
                  // max= "9999-12-31"
                  // dateFormat="dd/mm/yy"
                  // onChange={(e) => handleChange(e.target.name, e.target.value)}
                  onChange={(e) => setDate(e.value)}
                  showIcon locale="es"
                /> */}
                {/* <InputForm1
                  attribute={{
                    name: "fechaEmision",
                    type: "date",
                    value: fechaEmision,
                    disabled: false,
                    max: "9999-12-31"
                  }}
                  handleChange={handleChange}
                /> */}
              </div>
            </div>
            <div className="mb-3">
              <div className="col-sm-1 d-flex align-items-center">
                <label>Fch. Vencimi. : </label>
              </div>
              <div style={{ marginRight: "120px" }}>
                <InputText
                  style={{ width: "213px" }}
                  name="fechaVencimiento"
                  type="date"
                  // placeholder="Normal"
                  value={fechaVencimiento}
                  max="9999-12-31"
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                />
                {/* <Calendar
                  // name="fechaEmision"
                  value={date}
                  // max= "9999-12-31"
                  // dateFormat="dd/mm/yy"
                  // onChange={(e) => handleChange(e.target.name, e.target.value)}
                  onChange={(e) => setDate(e.value)}
                  showIcon locale="es"
                /> */}
                {/* <InputForm1
                  attribute={{
                    name: "fechaVencimiento",
                    type: "date",
                    value: fechaVencimiento,
                    disabled: false,
                    max: "9999-12-31"
                  }}
                  handleChange={handleChange}
                /> */}
              </div>
              <div className="col-sm-1 d-flex align-items-center">
                <label>Condi. Pago. : </label>
              </div>
              <div style={{ marginRight: "120px" }}>
                <InputText
                  value={condicionPago}
                  name="condicionPago"
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                  maxLength={150}
                />
                {/* <InputForm1
                  attribute={{
                    name: "condicionPago",
                    type: "text",
                    value: condicionPago,
                    disabled: false,
                    maxlength: 150,
                  }}
                  handleChange={handleChange}
                /> */}
              </div>
              <div className="col-sm-1 d-flex align-items-center">
                <label>Moneda : </label>
              </div>
              <div>
                <InputText
                  value={moneda}
                  name="moneda"
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                  maxLength={20}
                />
                {/* <InputForm1
                  attribute={{
                    name: "moneda",
                    type: "text",
                    value: moneda,
                    disabled: false,
                    maxlength: 20,
                  }}
                  handleChange={handleChange}
                /> */}
              </div>
            </div>
            <div className="mb-3">
              <div className="col-sm-1 d-flex align-items-center">
                <label>Nro Pedido : </label>
              </div>
              <div style={{ marginRight: "120px" }}>
                <InputText
                  keyfilter="int"
                  // placeholder="RUC"
                  value={nroPedido}
                  name="nro_Pedido"
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                  maxLength={8}
                />
                {/* <InputForm1
                  attribute={{
                    name: "nro_Pedido",
                    id: "nro_Pedido",
                    type: "number",
                    value: nroPedido,
                    disabled: false,
                    max: 8
                  }}
                  handleChange={handleChange}
                /> */}
              </div>
              <div className="col-sm-1 d-flex align-items-center">
                <label>Ord. Compra : </label>
              </div>
              <div style={{ marginRight: "120px" }}>
                <InputText
                  keyfilter="int"
                  placeholder=""
                  value={ordenCompra}
                  name="orden_Compra"
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                  maxLength={10}


                />
                {/* <InputForm1
                  attribute={{
                    name: "orden_Compra",
                    id: "orden_Compra",
                    type: "number",
                    value: ordenCompra,
                    disabled: false,
                    max: 10
                  }}
                  handleChange={handleChange}
                /> */}
              </div>
              <div className="col-sm-1 d-flex align-items-center">
                <label>Vendedor : </label>
              </div>
              <div>
                <InputText
                  // keyfilter="int"
                  // placeholder="Vendedor"
                  value={vendedor}
                  name="vendedor"
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                  maxLength={200}
                />
                {/* <InputForm1
                  attribute={{
                    name: "vendedor",
                    type: "text",
                    value: vendedor,
                    disabled: false,
                    checked: false,
                    matchcode: false,
                    maxlength: 200,
                  }}
                  handleChange={handleChange}
                /> */}
              </div>
            </div>
            {/* //////////// */}
            <div className="mb-3">
              <div className="col-sm-1 d-flex align-items-center">
                <label>Guía Remi. : </label>
              </div>
              <div style={{ marginRight: "120px" }}>
                <InputMask
                  name="guiaRemision"
                  value={guiaRemision}
                  // onKeyDown={(e) => setValue(e.target.value)} 
                  mask="9999-99999999"
                  placeholder="Ej: 0001-00000000"
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                />

                {/* <InputForm1
                  attribute={{
                    name: "guiaRemision",
                    type: "text",
                    value: guiaRemision,
                    disabled: false,
                    checked: false,
                    matchcode: false,
                    maxlength: 15,
                    placeholder: "NUMBER + - ",

                  }}
                  handleChange={handleChange}
                // onClick={() => openMcOrgVentas()}
                /> */}
              </div>
              <div className="col-sm-1 d-flex align-items-center">
                <label>Observación : </label>
              </div>
              <div>
                <InputText
                  name="observacion"
                  type="text"
                  // placeholder="Normal"
                  value={observacion}
                  maxLength={500}
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                />
                {/* <InputForm1
                  attribute={{
                    name: "observacion",
                    type: "text",
                    value: observacion,
                    disabled: false,
                    checked: false,
                    matchcode: false,
                    maxlength: 500,
                    // placeholder: "Seleccione..."
                  }}
                  handleChange={handleChange}
                // onClick={() => openMcOrgVentas()}
                /> */}
              </div>
            </div>

            <div className="title-section">
              <div>
                <label>DATOS DEL CLIENTE </label>
              </div>
            </div>
            <div className="mb-3">
              <div className="col-sm-1 d-flex align-items-center">
                <label>Ruc Cliente : </label>
              </div>
              <div style={{ marginRight: "120px" }}>
                <InputText
                  keyfilter="int"
                  placeholder="RUC"
                  value={rucCliente}
                  name="ruc_cliente"
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                  maxLength={11}
                />
                {/* <InputForm1
                  attribute={{
                    name: "ruc_cliente",
                    id: "ruc_cliente",
                    type: "number",
                    value: rucCliente,
                    disabled: false,
                    max: 11
                  }}
                  handleChange={handleChange}
                /> */}
              </div>
              <div className="col-sm-1 d-flex align-items-center">
                <label>Dirección Cli. : </label>
              </div>
              <div style={{ marginRight: "120px" }}>
                <InputText
                  // keyfilter="int"
                  placeholder="Dirección Cliente"
                  value={direccionCliente}
                  name="direccionCliente"
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                  maxLength={200}
                />
                {/* <InputForm1
                  attribute={{
                    name: "direccionCliente",
                    type: "text",
                    value: direccionCliente,
                    disabled: false,
                    maxlength: 200,
                  }}
                  handleChange={handleChange}

                /> */}
              </div>
              <div className="col-sm-1 d-flex align-items-center">
                <label>Cliente : </label>
              </div>
              <div style={{ marginRight: "35px" }}>
                <InputText
                  // keyfilter="int"
                  type="text"
                  // placeholder="Vendedor"
                  value={cliente}
                  name="cliente"
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                  maxLength={200}
                />
                {/* <InputForm1
                  attribute={{
                    name: "cliente",
                    type: "text",
                    value: cliente,
                    disabled: false,
                    maxlength: 200,
                  }}
                  handleChange={handleChange}
                /> */}
              </div>
            </div>
            <div className="title-section">
              <div>
                <label>DATOS DEL PRODUCTO </label>
              </div>
            </div>
            <div className="mb-3">
              <div className="col-sm-1 d-flex align-items-center">
                <label>Op. Gravadas : </label>
              </div>
              <div style={{ marginRight: "120px" }}>
                <InputText
                  type="text"
                  value={opGravadas = convertDecimal(Number(SUM_IMPORTE_TOTAL() / 1.18).toFixed(2))}
                  name="opGravadas"
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                  placeholder="0.00"
                  readOnly
                />
                {/* <InputForm1
                  attribute={{
                    name: "opGravadas",
                    type: "text",
                    value: opGravadas = convertDecimal(Number(SUM_IMPORTE_TOTAL() / 1.18).toFixed(2)),
                    disabled: true,
                    placeholder: "0.00"
                  }}
                  handleChange={handleChange}
                /> */}
              </div>
              <div className="col-sm-1 d-flex align-items-center">
                <label>Op. Inafectas : </label>
              </div>
              <div style={{ marginRight: "120px" }}>
                <InputText
                  type="text"
                  value={opInafectas}
                  name="opInafectas"
                  placeholder="0.00"
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                  readOnly
                />
                {/* <InputForm1
                  attribute={{
                    name: "opInafectas",
                    type: "text",
                    value: opInafectas,
                    disabled: true,
                    placeholder: "0.00"
                  }}
                  handleChange={handleChange}
                /> */}
              </div>
              <div className="col-sm-1 d-flex align-items-center">
                <label>Op. Exoner. : </label>
              </div>
              <div style={{ marginRight: "120px" }}>
                <InputText
                  type="text"
                  value={opExonerada}
                  name="opExonerada"
                  placeholder="0.00"
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                  readOnly
                />
                {/* <InputForm1
                  attribute={{
                    name: "opExonerada",
                    type: "number",
                    value: opExonerada,
                    disabled: true,
                    placeholder: "0.00"
                  }}
                  handleChange={handleChange}
                /> */}
              </div>
            </div>
            <div className="mb-3">
              <div className="col-sm-1 d-flex align-items-center">
                <label>Descuentos : </label>
              </div>
              <div style={{ marginRight: "120px" }}>
                <InputText
                  type="text"
                  value={descuentos}
                  name="descuentos"
                  placeholder="0.00"
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                  readOnly
                />
                {/* <InputForm1
                  attribute={{
                    name: "descuentos",
                    type: "number",
                    value: descuentos,
                    disabled: true,
                    placeholder: "0.00"
                  }}
                  handleChange={handleChange}
                /> */}
              </div>
              <div className="col-sm-1 d-flex align-items-center">
                <label>Anticipos : </label>
              </div>
              <div style={{ marginRight: "120px" }}>
                <InputText
                  type="text"
                  value={anticipos}
                  name="anticipos"
                  placeholder="0.00"
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                  readOnly
                />
                {/* <InputForm1
                  attribute={{
                    name: "anticipos",
                    type: "number",
                    value: anticipos,
                    disabled: true,
                    placeholder: "0.00"
                  }}
                  handleChange={handleChange}
                /> */}
              </div>
              <div className="col-sm-1 d-flex align-items-center">
                <label>I.G.V. : </label>
              </div>
              <div style={{ marginRight: "35px" }}>
                <InputText
                  type="text"
                  value={igv = convertDecimal(Number((SUM_IMPORTE_TOTAL() / 1.18) * 0.18).toFixed(2))}
                  name="igv"
                  placeholder="0.00"
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                  readOnly
                />
                {/* <InputForm1
                  attribute={{
                    name: "igv",
                    type: "text",
                    value: igv = convertDecimal(Number((SUM_IMPORTE_TOTAL() / 1.18) * 0.18).toFixed(2)),
                    // convertDecimal(Number((SUM_IMPORTE_TOTAL() / 1.18)*0.18).toFixed(2)),
                    placeholder: "0.00",
                    disabled: true
                  }}
                  handleChange={handleChange}
                /> */}
              </div>
            </div>
            <div className="mb-3">

              <div className="col-sm-1 d-flex align-items-center">
                <label>Impor. Total : </label>
              </div>
              <div style={{ marginRight: "35px" }}>
                <InputText
                  type="text"
                  value={importeTotal = convertDecimal(SUM_IMPORTE_TOTAL().toFixed(2))}
                  name="importeTotal"
                  placeholder="0.00"
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                  readOnly
                />
                {/* <InputForm1
                  attribute={{
                    name: "importeTotal",
                    id: "importeTotal",
                    type: "text",
                    value: importeTotal = convertDecimal(Number(SUM_IMPORTE_TOTAL()).toFixed(2)),
                    disabled: false,
                    placeholder: "0.00",
                    disabled: true
                  }}
                  handleChange={handleChange}
                /> */}


              </div>

            </div>
            <div className="">
              <div
                className="input-box1 col-md-3"
                style={{
                  flex: 1,
                  marginTop: "0px",
                  alignSelf: "center",
                  // marginBlock: 10,
                }}
              >
                <BtnAddMaterial
                  attribute={{
                    name: "Agregar Material",
                    classNamebtn: "btn_search",
                    //disabled: dataMaterial.length == 0,
                  }}
                  onClick={() => solounproducto()}
                />
              </div>

              <div
                className="input-box1 col-md-3"
                style={{
                  flex: 1,
                  marginTop: "0px",
                  alignSelf: "center",
                  // marginBlock: 10,
                }}
              >
                <BtnSearch
                  attribute={{
                    name: "Limpiar Campos",
                    classNamebtn: "btn_search",
                    //disabled: dataMaterial.length == 0,
                  }}
                  onClick={() => limpiarCampos()}
                />
              </div>
            </div>
          </div>
          {/* <div className="">
            <div
              className="input-box1 col-md-3"
              style={{
                flex: 1,
                marginTop: "0px",
                alignSelf: "center",
                // marginBlock: 10,
              }}
            >
              <BtnAddMaterial
                attribute={{
                  name: "Agregar Material",
                  classNamebtn: "btn_search",
                  //disabled: dataMaterial.length == 0,
                }}
                onClick={() => solounproducto()}
              />
            </div>

            <div
              className="input-box1 mt-4 col-md-3"
              style={{
                flex: 1,
                alignSelf: "center",
                // marginBlock: 10,
              }}
            >
              <BtnSearch
                attribute={{
                  name: "Limpiar Campos",
                  classNamebtn: "btn_search",
                  //disabled: dataMaterial.length == 0,
                }}
                onClick={() => limpiarCampos()}
              />
            </div>
          </div> */}


        </div>



        <section>
          <div className="container-table">
            <div className="container-table-sm">
              <table className="content-table">
                <thead>
                  <tr>
                    <th style={{ textAlign: "center" }}>CÓDIGO</th>
                    <th style={{ textAlign: "center" }}>DESCRIPCIÓN</th>
                    <th style={{ textAlign: "center" }}>CANTIDAD</th>
                    <th style={{ textAlign: "center" }}>UNIDAD DE MEDIDA</th>
                    <th style={{ textAlign: "center" }}>PRECIO UNITARIO</th>
                    <th style={{ textAlign: "center" }}>IMPORTE</th>
                    {/* <th style={{ textAlign: "left" }}>FECHA FIN</th> */}
                    <th style={{ textAlign: "left" }}>ACCION</th>
                  </tr>
                </thead>
                <tbody>
                  {dataMaterial.length >= 1
                    ? dataMaterial.map((item, key) => (

                      <tr key={item.codigoProducto}>
                        <th style={{ textAlign: "center" }}>{item.codigoProducto}</th>
                        <th>{item.descripcion}</th>
                        <th style={{ textAlign: "center" }}>{convertDecimal(item.cantidad)}</th>
                        <th style={{ textAlign: "center" }}>{item.unidadMedida}</th>
                        <th style={{ textAlign: "center" }}>{convertDecimal(item.precioUnitario)}</th>
                        <th style={{ textAlign: "center" }}>{convertDecimal(item.importe)}</th>
                        {/* <th style={{ textAlign: "center" }}>
                          {convertDecimal(item.prec_act)}
                        </th> */}
                        {/* <th style={{ textAlign: "center" }}>
                          {convertDecimal(item.prec_sug)}
                        </th>
                        <th style={{ textAlign: "center" }}>{formatFecha(item.fec_ini)}</th>
                        <th style={{ textAlign: "center" }}>{formatFecha(item.fec_fin)}</th> */}
                        <th>
                          <i
                            style={{ cursor: "pointer", margin: "6px" }}
                            title="Editar material"
                            className="fas fa-edit fa-lg"
                            onClick={() => openEditMaterial(item.codigoProducto)}
                          ></i>
                          <i
                            style={{ cursor: "pointer", margin: "6px" }}
                            title="Eliminar material"
                            className="fas fa-trash-alt fa-lg"
                            onClick={() => handleDelete(item.codigoProducto)}
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
