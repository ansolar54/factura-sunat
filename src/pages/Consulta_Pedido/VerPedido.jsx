import React, { useRef, useEffect, useCallback, useState } from "react";
import { VerPedidoService } from "../../Services/ServiceConsultaPedido";
import BtnSearch from "../../components/BtnSearch";
import InputForm from "../../components/InputForm";
import Spinner from "../../components/Spinner";
import "./VerPedido.css";
import Envio_Correo from "./Envio_Correo/Envio_Correo";
import Visualizar_Factura from "./Visualizar_Factura/Visualizar_Factura";
import Envio_Correo_Factura from "./Envio_Correo_Factura/Envio_Correo_Factura";

const VerPedido = ({ showverpedido, setshowVerPedido, data }) => {
  //contiene la respuesta del servicio ver pedido
  const [response_verpedido, setresponse_verpedido] = useState({
    isCabPedidosField: { vbelnField: "" },
    itDeudaClienteField: [],
    itMaterialesField: [],
  });

  const [listaCorreo,setListaCorreo] = useState([]);
  const [showEnvCorreo, setshowEnvCorreo] = useState(false);

  const [showEnvCorreoFactura, setshowEnvCorreoFactura] = useState(false);
  const [showVerFactura, setshowVerFactura] = useState(false);
  const [nombFactField, setnombFactField] = useState("");

  const [vkorgField, setvkorgField] = useState();
  const [vtwegField, setvtwegField] = useState();
  const [spartField, setspartField] = useState();
  const [vbelnField, setvbelnField] = useState();
  const [oficinaField, setoficinaField] = useState();
  const [vkburField, setvkburField] = useState();
  const [pltypField, setpltypField] = useState();
  const [kunnrField, setkunnrField] = useState();
  const [solicitanteField, setsolicitanteField] = useState();
  const [rmonedaField, setrmonedaField] = useState();
  const [vkgrpField, setvkgrpField] = useState();
  const [gpovendField, setgpovendField] = useState();
  const [ztermField, setztermField] = useState();
  const [kunn3Field, setkunn3Field] = useState();
  const [transportistaField, settransportistaField] = useState();
  const [documentoField, setdocumentoField] = useState();
  const [bstnkField, setbstnkField] = useState();
  const [comercialField, setcomercialField] = useState();
  const [fletePedidoField, setfletePedidoField] = useState();
  const [subtotalField, setsubtotalField] = useState();
  const [ivaField, setivaField] = useState();
  const [totalField, settotalField] = useState();
  const [destinatarioField, setdestinatarioField] = useState();
  const [obsGuiaField, setobsGuiaField] = useState();
  const [obsFacturaField, setobsFacturaField] = useState();
  const [chkLlegadaField, setchkLlegadaField] = useState();
  const [chkFleteField, setchkFleteField] = useState();
  const [condPagoField, setcondPagoField] = useState();
  const [kunn2Field, setkunn2Field] = useState();

  const [ViewInfo, setViewInfo] = useState(false);
  const modalRef = useRef();

  const [factura, setFactura] = useState('');

  //modelo para enviar data  de servicio VerPedido
  let modelverPedido = {
    PVbeln: data,
  };

  const closeModal = (e) => {
    if (modalRef.current === e.target) {
      setshowVerPedido(false);
    }
  };

  const keyPress = useCallback(
    (e) => {
      if (e.key === "Escape" && showverpedido) {
        setshowVerPedido(false);
      }
    },
    [setshowVerPedido, showverpedido]
  );

  useEffect(() => {
    setresponse_verpedido({
      isCabPedidosField: { vbelnField: "" },
      itDeudaClienteField: [],
      itMaterialesField: [],
    });
    setvkorgField();
    setvtwegField();
    setspartField();
    setvbelnField();
    setoficinaField();
    setvkburField();
    setpltypField();
    setkunnrField();
    setsolicitanteField();
    setrmonedaField();
    setvkgrpField();
    setgpovendField();
    setztermField();
    setkunn3Field();
    settransportistaField();
    setdocumentoField();
    setbstnkField();
    setcomercialField();
    setfletePedidoField();
    setsubtotalField();
    setivaField();
    settotalField();
    setdestinatarioField();
    setobsGuiaField();
    setobsFacturaField();
    setchkLlegadaField();
    setchkFleteField();
    setcondPagoField();
    setkunn2Field();
    //consulta servicio de ver pedido
    if (showverpedido == true) {
      setViewInfo(false);
      VerPedidoService(modelverPedido).then((result) => {
        console.log(result);
        setListaCorreo(result.etCorreosField)
        setresponse_verpedido(result);
        setvkorgField(result.isCabPedidosField.vkorgField);
        setvtwegField(result.isCabPedidosField.vtwegField);
        setspartField(result.isCabPedidosField.spartField);
        setvbelnField(result.isCabPedidosField.vbelnField);
        setoficinaField(result.isCabPedidosField.oficinaField);
        setvkburField(result.isCabPedidosField.vkburField);
        setpltypField(result.isCabPedidosField.pltypField);
        setkunnrField(result.isCabPedidosField.kunnrField);
        setsolicitanteField(result.isCabPedidosField.solicitanteField);
        setrmonedaField(result.isCabPedidosField.rmonedaField);
        setvkgrpField(result.isCabPedidosField.vkgrpField);
        setgpovendField(result.isCabPedidosField.gpovendField);
        setztermField(result.isCabPedidosField.ztermField);
        setkunn3Field(result.isCabPedidosField.kunn3Field);
        settransportistaField(result.isCabPedidosField.transportistaField);
        setdocumentoField(result.isCabPedidosField.documentoField);
        setbstnkField(result.isCabPedidosField.bstnkField);
        setcomercialField(result.isCabPedidosField.comercialField);
        setfletePedidoField(result.isCabPedidosField.fletePedidoField);
        setsubtotalField(result.isCabPedidosField.subtotalField);
        setivaField(result.isCabPedidosField.ivaField);
        settotalField(result.isCabPedidosField.totalField);
        setdestinatarioField(result.isCabPedidosField.destinatarioField);
        setobsGuiaField(result.isCabPedidosField.obsGuiaField);
        setobsFacturaField(result.isCabPedidosField.obsFacturaField);
        setchkLlegadaField(result.isCabPedidosField.chkLlegadaField);
        setchkFleteField(result.isCabPedidosField.chkFleteField);
        setcondPagoField(result.isCabPedidosField.condPagoField);
        setkunn2Field(result.isCabPedidosField.kunn2Field);
        setViewInfo(true);
      });

      document.addEventListener("keydown", keyPress);
      return () => document.removeEventListener("keydown", keyPress);
    }
  }, [keyPress]);

  function handleChange(name, value) {}

  //completar decimal de 2 digitos
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

  function Exportar_pdf() {
    setshowEnvCorreo((prev) => !prev);
  }


  function Exportar_factura(name) {
    setnombFactField(name)
    setFactura(factura)
    setshowEnvCorreoFactura((prev) => !prev);
  }

  function ver_factura(name){
    setnombFactField(name)
    console.log(name)
    setshowVerFactura((prev) => !prev); 
  }

  return (
    <>
        <Envio_Correo
            showEnvcorreo={showEnvCorreo}
            setshowEnvcorreo={setshowEnvCorreo}
            PVbeln={data}
            listaCorreo={listaCorreo}
          />
        <Envio_Correo_Factura
            showEnvcorreoFactura={showEnvCorreoFactura}
            setshowEnvcorreoFactura={setshowEnvCorreoFactura}
            PVbeln={data}
            listaCorreo={listaCorreo}
            nombFactField={nombFactField}
            nombCliente={solicitanteField}
          />
        <Visualizar_Factura
            showVerFactura={showVerFactura}
            setshowVerFactura={setshowVerFactura}
            nombFactField={nombFactField}
          />

      {showverpedido ? (
        <div
          className="container-modal-background"
          onClick={closeModal}
          ref={modalRef}
        >
          <div className="modal-wrapper modal-wrapper-bg">
            {ViewInfo ? (
              <div>
                <section
                  className="row"
                  style={{ margin: "auto", paddingTop: "50px" }}
                >
                  <div className="col-sm-2 d-flex align-items-center">
                    <label>N° Pedido</label>
                  </div>
                  <div className="col-sm-10">
                    <InputForm
                      attribute={{
                        name: "organiz_ventas",
                        type: "text",
                        value: vbelnField,
                        disabled: true,
                        checked: false,
                      }}
                      handleChange={handleChange}
                    />
                  </div>

                  <div className="col-sm-2 d-flex align-items-center">
                    <label>Solicitante</label>
                  </div>
                  <div className="col-sm-2">
                    <InputForm
                      attribute={{
                        name: "organiz_ventas",
                        type: "text",
                        value: kunnrField,
                        disabled: true,
                        checked: false,
                      }}
                      handleChange={handleChange}
                    />
                  </div>
                  <div className="col-sm-8">
                    <InputForm
                      attribute={{
                        name: "organiz_ventas",
                        type: "text",
                        value: solicitanteField,
                        disabled: true,
                        checked: false,
                      }}
                      handleChange={handleChange}
                    />
                  </div>
                  <div className="col-sm-2 d-flex align-items-center">
                    <label>Destinatario Mercancía</label>
                  </div>
                  <div className="col-sm-2">
                    <InputForm
                      attribute={{
                        name: "organiz_ventas",
                        type: "text",
                        value: kunn2Field,
                        disabled: true,
                        checked: false,
                      }}
                      handleChange={handleChange}
                    />
                  </div>
                  <div className="col-sm-8">
                    <InputForm
                      attribute={{
                        name: "organiz_ventas",
                        type: "text",
                        value: destinatarioField,
                        disabled: true,
                        checked: false,
                      }}
                      handleChange={handleChange}
                    />
                  </div>

                  <div className="col-sm-2 d-flex align-items-center">
                    <label>Transportista</label>
                  </div>
                  <div className="col-sm-2">
                    <InputForm
                      attribute={{
                        name: "organiz_ventas",
                        type: "text",
                        value: kunn3Field,
                        disabled: true,
                        checked: false,
                      }}
                      handleChange={handleChange}
                    />
                  </div>
                  <div className="col-sm-8">
                    <InputForm
                      attribute={{
                        name: "organiz_ventas",
                        type: "text",
                        value: transportistaField,
                        disabled: true,
                        checked: false,
                      }}
                      handleChange={handleChange}
                    />
                  </div>
                  <div className="col-sm-2 d-flex align-items-center">
                    <label>Oficina</label>
                  </div>
                  <div className="col-sm-2">
                    <InputForm
                      attribute={{
                        name: "organiz_ventas",
                        type: "text",
                        value: vkburField,
                        disabled: true,
                        checked: false,
                      }}
                      handleChange={handleChange}
                    />
                  </div>
                  <div className="col-sm-8">
                    <InputForm
                      attribute={{
                        name: "organiz_ventas",
                        type: "text",
                        value: oficinaField,
                        disabled: true,
                        checked: false,
                      }}
                      handleChange={handleChange}
                    />
                  </div>
                  <div className="col-sm-2 d-flex align-items-center">
                    <label>Gpo. Vend.</label>
                  </div>
                  <div className="col-sm-2">
                    <InputForm
                      attribute={{
                        name: "organiz_ventas",
                        type: "text",
                        value: vkgrpField,
                        disabled: true,
                        checked: false,
                      }}
                      handleChange={handleChange}
                    />
                  </div>
                  <div className="col-sm-8">
                    <InputForm
                      attribute={{
                        name: "organiz_ventas",
                        type: "text",
                        value: gpovendField,
                        disabled: true,
                        checked: false,
                      }}
                      handleChange={handleChange}
                    />
                  </div>
                  <div className="col-sm-2 d-flex align-items-center">
                    <label>Organiz. Ventas</label>
                  </div>
                  <div className="col-sm-2">
                    <InputForm
                      attribute={{
                        name: "organiz_ventas",
                        type: "text",
                        value: vkorgField,
                        disabled: true,
                        checked: false,
                      }}
                      handleChange={handleChange}
                    />
                  </div>
                  <div className="col-sm-2 d-flex align-items-center">
                    <label>Canal Distrib.</label>
                  </div>
                  <div className="col-sm-2">
                    <InputForm
                      attribute={{
                        name: "organiz_ventas",
                        type: "text",
                        value: vtwegField,
                        disabled: true,
                        checked: false,
                      }}
                      handleChange={handleChange}
                    />
                  </div>
                  <div className="col-sm-2 d-flex align-items-center">
                    <label>Sector</label>
                  </div>
                  <div className="col-sm-2">
                    <InputForm
                      attribute={{
                        name: "organiz_ventas",
                        type: "text",
                        value: spartField,
                        disabled: true,
                        checked: false,
                      }}
                      handleChange={handleChange}
                    />
                  </div>

                  <div className="col-sm-2 d-flex align-items-center">
                    <label>Lista Precios</label>
                  </div>
                  <div className="col-sm-2">
                    <InputForm
                      attribute={{
                        name: "organiz_ventas",
                        type: "text",
                        value: pltypField,
                        disabled: true,
                        checked: false,
                      }}
                      handleChange={handleChange}
                    />
                  </div>
                  <div className="col-sm-2 d-flex align-items-center">
                    <label>Cond. Pago</label>
                  </div>
                  <div className="col-sm-6">
                    <InputForm
                      attribute={{
                        name: "organiz_ventas",
                        type: "text",
                        value: ztermField + "  " + condPagoField,
                        disabled: true,
                        checked: false,
                      }}
                      handleChange={handleChange}
                    />
                  </div>
                  <div className="col-sm-2 d-flex align-items-center">
                    <label>Moneda:</label>
                  </div>
                  <div className="col-sm-2 row">
                    {/* <div className="col-sm-6">
                      <InputForm
                        attribute={{
                          name: "moneda",
                          type: "radio",
                          value: "",
                          disabled: true,
                          checked: rmonedaField == 1 ? true : false,
                        }}
                        handleChange={handleChange}
                      />
                    </div> */}
                    <div className="col-sm-6 d-flex align-items-center">
                      <input
                        type="radio"
                        name="moneda"
                        disabled
                        checked={rmonedaField == 1 ? true : false}
                      />
                      <label style={{ margin: "10px" }}>Soles</label>
                    </div>
                  </div>
                  <div className="col-sm-2 row">
                    {/* <div className="col-sm-6"> */}
                    {/* <InputForm
                        attribute={{
                          name: "moneda",
                          type: "radio",
                          value: "",
                          disabled: true,
                          checked: rmonedaField == 2 ? true : false,
                        }}
                        handleChange={handleChange}
                      /> */}
                    {/* </div> */}
                    <div className="col-sm-6 d-flex align-items-center">
                      <input
                        type="radio"
                        name="moneda"
                        disabled
                        checked={rmonedaField == 2 ? true : false}
                      />
                      <label style={{ margin: "10px" }}>Dolares</label>
                    </div>
                  </div>

                  <div className="col-sm-2 d-flex align-items-center">
                    <label>Clase Doc.:</label>
                  </div>
                  <div className="col-sm-2 row">
                    {/* <div className="col-sm-6"> */}
                    {/* <InputForm
                        attribute={{
                          name: "clase_doc",
                          type: "radio",
                          value: "",
                          disabled: true,
                          checked: documentoField == "BOLETA" ? true : false,
                        }}
                        handleChange={handleChange}
                      /> */}
                    {/* </div> */}
                    <div className="col-sm-6 d-flex align-items-center">
                      <input
                        type="radio"
                        name="clase_doc"
                        disabled
                        checked={documentoField == "BOLETA" ? true : false}
                      />
                      <label style={{ margin: "10px" }}>Boleta</label>
                    </div>
                  </div>
                  <div className="col-sm-2 row">
                    {/* <div className="col-sm-6"> */}
                    {/* <InputForm
                        attribute={{
                          name: "clase_doc",
                          type: "radio",
                          value: "",
                          disabled: true,
                          checked: documentoField == "FACTURA" ? true : false,
                        }}
                        handleChange={handleChange}
                      /> */}
                    {/* </div> */}
                    <div className="col-sm-6 d-flex align-items-center">
                      <input
                        type="radio"
                        name="clase_doc"
                        disabled
                        checked={documentoField == "FACTURA" ? true : false}
                      />
                      <label style={{ margin: "10px" }}>Factura</label>
                    </div>
                  </div>

                  <div className="col-sm-2 d-flex align-items-center">
                    <label>N° Ped. Cliente</label>
                  </div>
                  <div className="col-sm-2">
                    <InputForm
                      attribute={{
                        name: "organiz_ventas",
                        type: "text",
                        value: bstnkField,
                        disabled: true,
                        checked: false,
                      }}
                      handleChange={handleChange}
                    />
                  </div>
                  <div className="col-sm-2 d-flex align-items-center">
                    <label>Comercial</label>
                  </div>
                  <div className="col-sm-6">
                    <InputForm
                      attribute={{
                        name: "organiz_ventas",
                        type: "text",
                        value: comercialField,
                        disabled: true,
                        checked: false,
                      }}
                      handleChange={handleChange}
                    />
                  </div>
                  <div className="col-sm-2 d-flex align-items-center">
                    <label>Observación Guía</label>
                  </div>
                  <div className="col-sm-10">
                    <InputForm
                      attribute={{
                        name: "organiz_ventas",
                        type: "text",
                        value: obsGuiaField,
                        disabled: true,
                        checked: false,
                      }}
                      handleChange={handleChange}
                    />
                  </div>
                  <div className="col-sm-2 d-flex align-items-center">
                    <label>Observación Factura</label>
                  </div>
                  <div className="col-sm-10">
                    <InputForm
                      attribute={{
                        name: "organiz_ventas",
                        type: "text",
                        value: obsFacturaField,
                        disabled: true,
                        checked: false,
                      }}
                      handleChange={handleChange}
                    />
                  </div>

                  {/* <div className="col-sm-2 d-flex align-items-center">
                    <label>-</label>
                  </div> */}
                  <div className="col-sm-6 row">
                    {/* <div className="col-sm-6">
                      <InputForm
                        attribute={{
                          name: "clase_doc",
                          type: "checkbox",
                          value: "",
                          disabled: true,
                          checked: chkLlegadaField == "X" ? true : false,
                        }}
                        handleChange={handleChange}
                      />
                    </div> */}
                    <div className="col-sm-6 d-flex align-items-center">
                      <input
                        type="checkbox"
                        name="1"
                        className="checkbox_detalle_2"
                        disabled
                        checked={chkLlegadaField == "X" ? true : false}
                      />
                      <label style={{ margin: "10px" }}>2 puntos llegada</label>
                    </div>
                  </div>
                  <div className="col-sm-6 row">
                    {/* <div className="col-sm-6">
                      <InputForm
                        attribute={{
                          name: "clase_doc",
                          type: "checkbox",
                          value: "",
                          disabled: true,
                          checked: chkFleteField == "X" ? true : false,
                        }}
                        handleChange={handleChange}
                      />
                    </div> */}
                    <div className="col-sm-6 d-flex align-items-center">
                      <input
                        type="checkbox"
                        name="2"
                        className="checkbox_detalle_2"
                        disabled
                        checked={chkFleteField == "X" ? true : false}
                      />
                      <label style={{ margin: "10px" }}>
                        Farmex asume flete
                      </label>
                    </div>
                  </div>
                </section>

                <div className="col-md-12 p-2">
                    <BtnSearch
                      attribute={{
                        name: "Enviar PDF",
                        classNamebtn: "btn_search",
                      }}
                      onClick={() => Exportar_pdf()}
                    />
                </div>

                <section className="section-verpedido-table">
                  <div className="container-table responsive-table">
                    <table className="content-table ">
                      <thead>
                        <tr>
                          <th>Pos.</th>
                          <th>Centro</th>
                          <th>Almacén</th>
                          <th>Material</th>
                          <th>Denominación</th>
                          <th>UM</th>
                          <th>Cantidad</th>
                          <th>Precio</th>
                          <th>%Desc.</th>
                          <th>Valor Venta Unitario</th>
                          <th>Flete</th>
                          <th>Valor Venta Total</th>
                          <th>Cant. Desp.</th>
                          <th>Despacho</th>
                          <th>Factura</th>
                          <th>Acción</th>
                        </tr>
                      </thead>
                      <tbody>
                        {response_verpedido.itMaterialesField.map(
                          (response, key) => (
                            <tr key={key}>
                              <th>{response.posnrField}</th>
                              <th>{response.werksField}</th>
                              <th>{response.lgortField}</th>
                              <th>{response.matnrField}</th>
                              <th>{response.maktxField}</th>
                              <th>{response.vrkmeField}</th>
                              <th>{response.zmengField}</th>
                              <th>
                                {convertDecimal(response.precioListaField)}
                              </th>
                              <th>{response.descField}</th>
                              <th>{convertDecimal(response.precioField)}</th>
                              <th>{response.fleteField}</th>
                              <th>{convertDecimal(response.subtotalField)}</th>
                              <th>{response.cantDespField.trim()}</th>
                              <th>{response.vbelnGuiaField}</th>
                              <th>{response.vbelnFactField}</th>
                              <th >
                                    <i
                                      onClick={()=>ver_factura(response.nombFactField)}
                                      className="fas fa-file-pdf"
                                      title="Ver factura"
                                      style={{padding:'5px'}}
                                    ></i>

                                    <i
                                      onClick={()=>Exportar_factura(response.nombFactField)}
                                      className="fas fa-envelope"
                                      title="Enviar factura"
                                    ></i>
                              </th>
                             
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </section>
                <section>
                  <div className="row" style={{ padding: "10px" }}>
                    {/* ---------------------------nuevo------------------------------ */}

                    <div className="col-sm-3">
                      <label>Flete Pedido</label>
                    </div>
                    <div className="col-sm-3">
                      <InputForm
                        attribute={{
                          name: "organiz_ventas",
                          type: "text",
                          value: fletePedidoField,
                          disabled: true,
                          checked: false,
                        }}
                        handleChange={handleChange}
                      />
                    </div>
                    <div className="col-sm-3">
                      <label>Valor Neto</label>
                    </div>
                    <div className="col-sm-2">
                      <InputForm
                        attribute={{
                          name: "organiz_ventas",
                          type: "text",
                          value: convertDecimal(subtotalField),
                          disabled: true,
                          checked: false,
                        }}
                        handleChange={handleChange}
                      />
                    </div>
                    <div className="col-sm-6"></div>
                    <div className="col-sm-3">
                    <label>I.G.V.</label>
                    </div>
                    <div className="col-sm-2">
                    <InputForm
                        attribute={{
                          name: "organiz_ventas",
                          type: "text",
                          value: convertDecimal(ivaField),
                          disabled: true,
                          checked: false,
                        }}
                        handleChange={handleChange}
                      />
                    </div>
                    <div className="col-sm-6"></div>
                    <div className="col-sm-3">
                    <label>Valor Total</label>
                    </div>
                    <div className="col-sm-2">
                    <InputForm
                        attribute={{
                          name: "organiz_ventas",
                          type: "text",
                          value: convertDecimal(totalField),
                          disabled: true,
                          checked: false,
                        }}
                        handleChange={handleChange}
                      />
                    </div>

                    {/* <div className="container-input-ver-pedido">
                          <label>Flete Pedido</label>
                          <InputForm
                            attribute={{
                              name: "organiz_ventas",
                              type: "text",
                              value: fletePedidoField,
                              disabled: true,
                              checked: false,
                            }}
                            handleChange={handleChange}
                          />
                        </div> */}

                    {/* ---------------------nuevo fin---------------------- */}

                    {/* <div className="container-input-ver-pedido">
                      <label>Valor Neto</label>
                      <InputForm
                        attribute={{
                          name: "organiz_ventas",
                          type: "text",
                          value: convertDecimal(subtotalField),
                          disabled: true,
                          checked: false,
                        }}
                        handleChange={handleChange}
                      />
                    </div>
                    <div className="container-input-ver-pedido">
                      <label>I.G.V.</label>
                      <InputForm
                        attribute={{
                          name: "organiz_ventas",
                          type: "text",
                          value: convertDecimal(ivaField),
                          disabled: true,
                          checked: false,
                        }}
                        handleChange={handleChange}
                      />
                    </div>
                    <div className="container-input-ver-pedido">
                      <label>Valor Total</label>
                      <InputForm
                        attribute={{
                          name: "organiz_ventas",
                          type: "text",
                          value: convertDecimal(totalField),
                          disabled: true,
                          checked: false,
                        }}
                        handleChange={handleChange}
                      />
                    </div> */}
                  </div>
                </section>
              </div>
            ) : (
              <div>
                <Spinner />
              </div>
            )}

            <div
              className="close-modal-button"
              onClick={() => setshowVerPedido((prev) => !prev)}
            >
              <i className="fas fa-times"></i>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default VerPedido;
