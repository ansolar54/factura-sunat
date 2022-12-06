import React, { useState, useEffect, useRef } from "react";
import InputForm from "../../components/InputForm";
import BtnSearch from "../../components/BtnSearch";
import Spinner from "../../components/Spinner";
import Matchcode_InfoCliente from "./Matchcode_InfoCliente/Matchcode_InfoCliente";
import { InfoClienteClienteBuscar } from "../../Services/ServiceCliente";
import { PedidoAnioAct, PedidoAnioAnt } from "../../Services/ServicePedidos";
import { ValidarRuta } from "../../Services/ServiceValidaUsuario";
import BtnExportar from "../../components/BtnExport";
import { Mc_InfoCliente_Cliente } from "../../Services/ServiceCliente";
import jwt from "jwt-decode";
import { getUser } from "../../Services/ServiceUser";
import ChangeStatusPassword from "../../components/ChangeStatusPassword/ChangeStatusPassword";
import {
  getOficinaVentasSAP,
  RegistrarAuditoria,
} from "../../Services/ServiceAuditoria";
import { InfoClienteMateriales } from "../../Services/ServiceInfoCliMateriales";
import react from "react";
import ExcelFile from "react-data-export/dist/ExcelPlugin/components/ExcelFile";
import ExcelSheet from "react-data-export/dist/ExcelPlugin/elements/ExcelSheet";

//@MC - MIGUEL CARRASCO
const Info_Cliente = () => {
  const [indicadorfiltro_1, setindicadorfiltro_1] = useState(false);
  const [mostrar_filtro_fila_1, setmostrar_filtro_fila_1] = useState(false);
  const [text_btn_filtro_1, settext_btn_filtro_1] = useState("Filtrar");

  const [indicadorfiltro_2, setindicadorfiltro_2] = useState(false);
  const [mostrar_filtro_fila_2, setmostrar_filtro_fila_2] = useState(false);
  const [text_btn_filtro_2, settext_btn_filtro_2] = useState("Filtrar");

  const modalRef_1 = useRef();
  const modalRef_2 = useRef();

  const [showmodal_1, setshowmodal_1] = useState(false);
  const [showmodal_2, setshowmodal_2] = useState(false);

  //para el cambio de contraseña
  const [show_status_password, setshow_status_password] = useState(false);
  const [condicion_agro, setcondicion_agro] = useState("");
  const [condicion_semi, setcondicion_semi] = useState("");
  const [condicion_espe, setcondicion_espe] = useState("");
  const [condicion_salu, setcondicion_salu] = useState("");
  const [name1Field, setname1Field] = useState("");
  const [chkField, setchkField] = useState("");
  const [chkDescField, setchkDescField] = useState("");
  const [vtwegField, setvtwegField] = useState("");
  const [vtwegVtextField, setvtwegVtextField] = useState("");

  const [fcreacionField, setfcreacionField] = useState("");
  const [mjeFcreaField, setmjeFcreaField] = useState("");

  const [ctaCreditoField, setctaCreditoField] = useState("");
  const [nameCtacredField, setnameCtacredField] = useState("");

  const [pltypField_agro, setpltypField_agro] = useState("");
  const [pltypPtextField_agro, setpltypPtextField_agro] = useState("");
  const [pltypField_espe, setpltypField_espe] = useState("");
  const [pltypPtextField_espe, setpltypPtextField_espe] = useState("");
  const [pltypField_salu, setpltypField_salu] = useState("");
  const [pltypPtextField_salu, setpltypPtextField_salu] = useState("");
  const [pltypField_semi, setpltypField_semi] = useState("");
  const [pltypPtextField_semi, setpltypPtextField_semi] = useState("");

  const [PKunnr, setPKunnr] = useState("");
  //indicador para que se ejecute las fechas por el use effect al momento de buscar por cliente
  const [
    indicador_fechas_response_infocliente,
    setindicador_fechas_response_infocliente,
  ] = useState(false);
  //indicador para poder saber si se ha realizado una busqueda de cliente o no
  const [indicador_response_infocliente, setindicador_response_infocliente] =
    useState(false);
  const [response_infocliente, setresponse_infocliente] = useState({
    isVentasFechasField: [],
    itInfoCreditoField: [],
    itNcuentaPagarField: [],
  });

  const [indicador_spinner, setindicador_spinner] = useState(false);
  const [indicador_spinner_1, setindicador_spinner_1] = useState(false);
  const [indicador_spinner_2, setindicador_spinner_2] = useState(false);

  const [InputPAnt, setInputPAnt] = useState({ PAntDesde: "", PAntHasta: "" });
  const [response_pedidoanioant, setresponse_pedidoanioant] = useState({
    itProductosAntField: [],
  });

  const [InputPAct, setInputPAct] = useState({ PActDesde: "", PActHasta: "" });
  const [response_pedidoanioact, setresponse_pedidoanioact] = useState({
    itProductosActField: [],
  });

  const [showmc_infocliente, setshowmc_infocliente] = useState(false);

  //para imprimir los datos en los textbox no editables
  const [etClientesField, setetClientesField] = useState([
    { name1Field: "", vkorgField: "" },
  ]);
  //PARA ACCESO A RUTA
  const [accesoruta, setaccesoruta] = useState(false);
  //CARGA DE SPINNER DE ACCESO DE RUTA
  const [spinnerroute, setspinnerroute] = useState(false);
  //INDICADOR SI YA VALIDO RUTA
  const [indicadorruta, setindicadorruta] = useState(false);

  const [f_matnrField_1, setf_matnrField_1] = useState("");
  const [f_maktxField_1, setf_maktxField_1] = useState("");
  const [f_kwmengField_1, setf_kwmengField_1] = useState("");
  const [f_vrkmeField_1, setf_vrkmeField_1] = useState("");
  const [f_netwrField_1, setf_netwrField_1] = useState("");
  const [f_waerkField_1, setf_waerkField_1] = useState("");
  const [f_vkorgField_1, setf_vkorgField_1] = useState("");

  const [f_matnrField_2, setf_matnrField_2] = useState("");
  const [f_maktxField_2, setf_maktxField_2] = useState("");
  const [f_kwmengField_2, setf_kwmengField_2] = useState("");
  const [f_vrkmeField_2, setf_vrkmeField_2] = useState("");
  const [f_netwrField_2, setf_netwrField_2] = useState("");
  const [f_waerkField_2, setf_waerkField_2] = useState("");
  const [f_vkorgField_2, setf_vkorgField_2] = useState("");

  const [col1_1, setcol1_1] = useState(0);
  const [col1_2, setcol1_2] = useState(0);
  const [col1_3, setcol1_3] = useState(0);
  const [col1_4, setcol1_4] = useState(0);
  const [col1_5, setcol1_5] = useState(0);
  const [col1_6, setcol1_6] = useState(0);
  const [col1_7, setcol1_7] = useState(0);

  const [col2_1, setcol2_1] = useState(0);
  const [col2_2, setcol2_2] = useState(0);
  const [col2_3, setcol2_3] = useState(0);
  const [col2_4, setcol2_4] = useState(0);
  const [col2_5, setcol2_5] = useState(0);
  const [col2_6, setcol2_6] = useState(0);
  const [col2_7, setcol2_7] = useState(0);

  //ALMACENA CHECKBOX MARCADOS INDIVIDUALMENTE PARA COMPARARLOS POR PAGINA BUSCADA Y MARCARLOS CON CHECK
  const [arraycheckbox_1, setarraycheckbox_1] = useState([]);
  const [arraycheckbox_export_1, setarraycheckbox_export_1] = useState([
    {
      columns: [
        {
          title: "Material",
          style: { font: { sz: "18", bold: true } },
          width: { wpx: 125 },
        },
        {
          title: "Denominación",
          style: { font: { sz: "18", bold: true } },
          width: { wpx: 125 },
        },
        {
          title: "Cantidad",
          style: { font: { sz: "18", bold: true } },
          width: { wpx: 125 },
        },
        {
          title: "UM",
          style: { font: { sz: "18", bold: true } },
          width: { wpx: 125 },
        },
        {
          title: "Valor Neto",
          style: { font: { sz: "18", bold: true } },
          width: { wpx: 125 },
        },
        {
          title: "Moneda",
          style: { font: { sz: "18", bold: true } },
          width: { wpx: 125 },
        },
        {
          title: "Org. Ventas",
          style: { font: { sz: "18", bold: true } },
          width: { wpx: 125 },
        },
      ],
      data: [],
    },
  ]);

  //PARA ALMACENAR LOS DATOS A EXPORTAR
  const [DataSet_1, setDataSet_1] = useState([{ columns: [], data: [] }]);

  //ALMACENA CHECKBOX MARCADOS INDIVIDUALMENTE PARA COMPARARLOS POR PAGINA BUSCADA Y MARCARLOS CON CHECK
  const [arraycheckbox_2, setarraycheckbox_2] = useState([]);
  const [arraycheckbox_export_2, setarraycheckbox_export_2] = useState([
    {
      columns: [
        {
          title: "Material",
          style: { font: { sz: "18", bold: true } },
          width: { wpx: 125 },
        },
        {
          title: "Denominación",
          style: { font: { sz: "18", bold: true } },
          width: { wpx: 125 },
        },
        {
          title: "Cantidad",
          style: { font: { sz: "18", bold: true } },
          width: { wpx: 125 },
        },
        {
          title: "UM",
          style: { font: { sz: "18", bold: true } },
          width: { wpx: 125 },
        },
        {
          title: "Valor Neto",
          style: { font: { sz: "18", bold: true } },
          width: { wpx: 125 },
        },
        {
          title: "Moneda",
          style: { font: { sz: "18", bold: true } },
          width: { wpx: 125 },
        },
        {
          title: "Org. Ventas",
          style: { font: { sz: "18", bold: true } },
          width: { wpx: 125 },
        },
      ],
      data: [],
    },
  ]);

  //PARA ALMACENAR LOS DATOS A EXPORTAR
  const [DataSet_2, setDataSet_2] = useState([{ columns: [], data: [] }]);

  useEffect(() => {
    //valida para el nuevo cambio de contraseña
    // getUser(jwt(localStorage.getItem("_token")).nameid).then((result) => {
    //   if (result.data[0].status_password === "1") {
    //     setshow_status_password(true);
    //   } else {
    //     setshow_status_password(false);
    //   }
    // });
    //valida acceso a ruta
    // if (indicadorruta == false) {
    //   setspinnerroute(true);
    //   ValidarRuta("02").then((result) => {
    //     if (result.reporte == 1) {
    //       setspinnerroute(false);
    //       setaccesoruta(true);
    //       setindicadorruta(true);
    //       // Search();
    //     } else {
    //       setspinnerroute(false);
    //       setaccesoruta(false);
    //       setindicadorruta(true);
    //     }
    //   });
    // }
    // OBTENER OFICINA DE VENTAS DE USUARIO DESDE SAP
    let ofi_ventas = "";
    getOficinaVentasSAP({
      IsUser: jwt(localStorage.getItem("_token")).username,
    }).then((result) => {
      if (result.etOfiVentasField.length) {
        ofi_ventas =
          result.etOfiVentasField[0].codOfventaField +
          " - " +
          result.etOfiVentasField[0].descripcionField;
        //REGISTRO DE AUDITORÍA
        RegistrarAuditoria({
          id_user: Number(jwt(localStorage.getItem("_token")).nameid),
          id_event: 2,
          sales_ofi: ofi_ventas,
          indicator: "WEB",
        });
      }
    });
  }, []);

  useEffect(() => {
    if (indicador_fechas_response_infocliente == true) {
      if (
        InputPAnt.PAntHasta >= "1900-01-01" &&
        InputPAnt.PAntDesde >= "1900-01-01"
      ) {
        if (
          PKunnr != "" &&
          InputPAnt.PAntDesde != "" &&
          InputPAnt.PAntHasta != ""
        ) {
          // SearchPedidoAnioAnt();
        }
      }
    }
  }, [InputPAnt]);

  useEffect(() => {
    console.log(InputPAct.PActHasta);
    if (indicador_fechas_response_infocliente == true) {
      if (
        InputPAct.PActHasta >= "1900-01-01" &&
        InputPAct.PActDesde >= "1900-01-01"
      ) {
        if (
          PKunnr != "" &&
          InputPAct.PActDesde != "" &&
          InputPAct.PActHasta != ""
        ) {
          // SearchPedidoAnioAct();
        }
      }
    }
  }, [InputPAct]);

  function Search() {
    let model_InfoCliente = {
      PKunnr: PKunnr,
    };
    setindicador_spinner_1(true);
    setindicador_spinner_2(true);

    setindicador_spinner(true);
    setindicador_fechas_response_infocliente(false);
    setindicador_response_infocliente(false);

    setresponse_infocliente({
      isVentasFechasField: [],
      itInfoCreditoField: [],
      itNcuentaPagarField: [],
    });
    setresponse_pedidoanioant({
      // itPedidosAntField: [],
      itProductosAntField: [],
    });
    setresponse_pedidoanioact({
      // itPedidosActField: [],
      itProductosActField: [],
    });

    let modal_mc_infocliente_cliente = {
      IsKunnr: PKunnr,
      IsName1: "",
      IsNpag: 1,
      IsRegxpag: 15,
      IsStcd1: "",
      IsUser: jwt(localStorage.getItem("_token")).username,
      IsDuplicate: "X",
    };
    setcondicion_agro("");
    setcondicion_semi("");
    setcondicion_espe("");
    setcondicion_salu("");
    setname1Field("");
    setchkField("");
    setchkDescField("");
    setvtwegField("");
    setvtwegVtextField("");

    setfcreacionField("");
    setmjeFcreaField("");

    setctaCreditoField("");
    setnameCtacredField("");

    setpltypField_agro("");
    setpltypPtextField_agro("");
    setpltypField_espe("");
    setpltypPtextField_espe("");
    setpltypField_salu("");
    setpltypPtextField_salu("");
    setpltypField_semi("");
    setpltypPtextField_semi("");
    Mc_InfoCliente_Cliente(modal_mc_infocliente_cliente).then((resultmc) => {
      if (resultmc.etClientesField.length >= 1) {
        InfoClienteClienteBuscar(model_InfoCliente).then((result) => {
          setindicador_fechas_response_infocliente(true);
          setindicador_response_infocliente(true);
          setresponse_infocliente(result);
          let model_materiales = {
            IsCampoAct: "",
            IsCampoAnt: "",
            IsOrdenAct: "",
            IsOrdenAnt: "",
            PKunnr: PKunnr,
          };

          InfoClienteMateriales(model_materiales).then((res) => {
            setindicador_spinner_1(false);
            setindicador_spinner_2(false);
            setInputPAnt({
              PAntDesde: res.isVentasFechasField.ventAntDesdeField,
              PAntHasta: res.isVentasFechasField.ventAntHastaField,
            });
            setInputPAct({
              PActDesde: res.isVentasFechasField.ventActDesdeField,
              PActHasta: res.isVentasFechasField.ventActHastaField,
            });
            console.log(res);
            setDataSet_2([
              {
                columns: [
                  {
                    title: "Código: " + PKunnr,
                    style: { font: { sz: "18", bold: true } },
                    width: { wpx: 125 },
                  },
                  {
                    title: "Cliente: " + resultmc.etClientesField[0].name1Field,
                    style: { font: { sz: "18", bold: true } },
                    width: { wpx: 125 },
                  },
                  {
                    title:
                      "Desde: " + res.isVentasFechasField.ventActDesdeField,
                    style: { font: { sz: "18", bold: false } },
                    width: { wpx: 125 },
                  },
                  {
                    title:
                      "Hasta: " + res.isVentasFechasField.ventActHastaField,
                    style: { font: { sz: "18", bold: false } },
                    width: { wpx: 125 },
                  },
                ],
                data: [],
              },

              {
                ySteps: 1,
                columns: [
                  {
                    title: "Org. Ventas",
                    style: { font: { sz: "18", bold: true } },
                    width: { wpx: 125 },
                  },
                  {
                    title: "Material",
                    style: { font: { sz: "18", bold: true } },
                    width: { wpx: 125 },
                  },
                  {
                    title: "Denominación",
                    style: { font: { sz: "18", bold: true } },
                    width: { wpx: 125 },
                  },
                  {
                    title: "Cantidad",
                    style: { font: { sz: "18", bold: true } },
                    width: { wpx: 125 },
                  },
                  {
                    title: "UM",
                    style: { font: { sz: "18", bold: true } },
                    width: { wpx: 125 },
                  },
                  {
                    title: "Valor Neto",
                    style: { font: { sz: "18", bold: true } },
                    width: { wpx: 125 },
                  },
                  {
                    title: "Moneda",
                    style: { font: { sz: "18", bold: true } },
                    width: { wpx: 125 },
                  },
                ],
                data: res.itProductosActField.map((data) => {
                  return [
                    { value: data.vkorgField, style: { font: { sz: "14" } } },
                    { value: data.matnrField, style: { font: { sz: "14" } } },
                    { value: data.maktxField, style: { font: { sz: "14" } } },
                    {
                      value: Math.round(data.kwmengField),
                      style: { font: { sz: "14" } },
                    },
                    { value: data.vrkmeField, style: { font: { sz: "14" } } },
                    {
                      value: convertDecimal(data.netwrField),
                      style: { font: { sz: "14" } },
                    },
                    {
                      value: data.waerkField,
                      style: { font: { sz: "14" } },
                    },
                  ];
                }),
              },
            ]);

            setresponse_pedidoanioact({
              itProductosActField: res.itProductosActField.map((d, index) => {
                return {
                  select: false,
                  index: index,
                  matnrField: d.matnrField,
                  maktxField: d.maktxField,
                  kwmengField: d.kwmengField,
                  vrkmeField: d.vrkmeField,
                  netwrField: d.netwrField,
                  waerkField: d.waerkField,
                  vkorgField: d.vkorgField,
                };
              }),
            });
            //setresponse_pedidoanioact(res);

            setDataSet_1([
              {
                columns: [
                  {
                    title: "Código: " + PKunnr,
                    style: { font: { sz: "18", bold: true } },
                    width: { wpx: 125 },
                  },
                  {
                    title: "Cliente: " + resultmc.etClientesField[0].name1Field,
                    style: { font: { sz: "18", bold: true } },
                    width: { wpx: 125 },
                  },
                  {
                    title:
                      "Desde: " + res.isVentasFechasField.ventAntDesdeField,
                    style: { font: { sz: "18", bold: false } },
                    width: { wpx: 125 },
                  },
                  {
                    title:
                      "Hasta: " + res.isVentasFechasField.ventAntHastaField,
                    style: { font: { sz: "18", bold: false } },
                    width: { wpx: 125 },
                  },
                ],
                data: [],
              },
              {
                ySteps: 1,
                columns: [
                  {
                    title: "Org. Ventas",
                    style: { font: { sz: "18", bold: true } },
                    width: { wpx: 125 },
                  },
                  {
                    title: "Material",
                    style: { font: { sz: "18", bold: true } },
                    width: { wpx: 125 },
                  },
                  {
                    title: "Denominación",
                    style: { font: { sz: "18", bold: true } },
                    width: { wpx: 125 },
                  },
                  {
                    title: "Cantidad",
                    style: { font: { sz: "18", bold: true } },
                    width: { wpx: 125 },
                  },
                  {
                    title: "UM",
                    style: { font: { sz: "18", bold: true } },
                    width: { wpx: 125 },
                  },
                  {
                    title: "Valor Neto",
                    style: { font: { sz: "18", bold: true } },
                    width: { wpx: 125 },
                  },
                  {
                    title: "Moneda",
                    style: { font: { sz: "18", bold: true } },
                    width: { wpx: 125 },
                  },
                ],
                data: res.itProductosAntField.map((data) => {
                  return [
                    { value: data.vkorgField, style: { font: { sz: "14" } } },
                    { value: data.matnrField, style: { font: { sz: "14" } } },
                    { value: data.maktxField, style: { font: { sz: "14" } } },
                    {
                      value: Math.round(data.kwmengField),
                      style: { font: { sz: "14" } },
                    },
                    { value: data.vrkmeField, style: { font: { sz: "14" } } },
                    {
                      value: convertDecimal(data.netwrField),
                      style: { font: { sz: "14" } },
                    },
                    {
                      value: data.waerkField,
                      style: { font: { sz: "14" } },
                    },
                  ];
                }),
              },
            ]);

            setresponse_pedidoanioant({
              itProductosAntField: res.itProductosAntField.map((d, index) => {
                return {
                  select: false,
                  index: index,
                  matnrField: d.matnrField,
                  maktxField: d.maktxField,
                  kwmengField: d.kwmengField,
                  vrkmeField: d.vrkmeField,
                  netwrField: d.netwrField,
                  waerkField: d.waerkField,
                  vkorgField: d.vkorgField,
                };
              }),
            });

            // setresponse_pedidoanioant(res);

            setindicador_fechas_response_infocliente(false);
          });

          setindicador_spinner(false);
        });
        console.log(resultmc.etClientesField[0].name1Field);
        setetClientesField(resultmc.etClientesField);
        setname1Field(resultmc.etClientesField[0].name1Field);
        setchkField(resultmc.etClientesField[0].chkField);
        setchkDescField(resultmc.etClientesField[0].chkDescField);
        setvtwegField(resultmc.etClientesField[0].vtwegField);
        setvtwegVtextField(resultmc.etClientesField[0].vtwegVtextField);

        setfcreacionField(resultmc.etClientesField[0].fcreacionField);
        setmjeFcreaField(resultmc.etClientesField[0].mjeFcreaField);

        setctaCreditoField(resultmc.etClientesField[0].ctaCreditoField);
        setnameCtacredField(resultmc.etClientesField[0].nameCtacredField);

        for (let i = 0; i < resultmc.etClientesField.length; i++) {
          if (resultmc.etClientesField[i].vkorgField === "AGRO") {
            setcondicion_agro(
              resultmc.etClientesField[i].ztermField +
              " / " +
              resultmc.etClientesField[i].vtextField
            );
            setpltypField_agro(resultmc.etClientesField[i].pltypField);
            setpltypPtextField_agro(
              resultmc.etClientesField[i].pltypPtextField
            );
          }
          if (resultmc.etClientesField[i].vkorgField === "SEMI") {
            setcondicion_semi(
              resultmc.etClientesField[i].ztermField +
              " / " +
              resultmc.etClientesField[i].vtextField
            );
            setpltypField_semi(resultmc.etClientesField[i].pltypField);
            setpltypPtextField_semi(
              resultmc.etClientesField[i].pltypPtextField
            );
          }
          if (resultmc.etClientesField[i].vkorgField === "ESPE") {
            setcondicion_espe(
              resultmc.etClientesField[i].ztermField +
              " / " +
              resultmc.etClientesField[i].vtextField
            );
            setpltypField_espe(resultmc.etClientesField[i].pltypField);
            setpltypPtextField_espe(
              resultmc.etClientesField[i].pltypPtextField
            );
          }
          if (resultmc.etClientesField[i].vkorgField === "SALU") {
            setcondicion_salu(
              resultmc.etClientesField[i].ztermField +
              " / " +
              resultmc.etClientesField[i].vtextField
            );
            setpltypField_salu(resultmc.etClientesField[i].pltypField);
            setpltypPtextField_salu(
              resultmc.etClientesField[i].pltypPtextField
            );
          }
        }
      } else {
        setindicador_fechas_response_infocliente(false);
        setindicador_spinner(false);
      }
      // setvaluepagination(true);
    });
  }

  function clear_filtro_fila_1() {
    setf_matnrField_1("");
    setf_maktxField_1("");
    setf_kwmengField_1("");
    setf_vrkmeField_1("");
    setf_netwrField_1("");
    setf_waerkField_1("");
    setf_vkorgField_1("");
  }

  function clear_filtro_fila_2() {
    setf_matnrField_2("");
    setf_maktxField_2("");
    setf_kwmengField_2("");
    setf_vrkmeField_2("");
    setf_netwrField_2("");
    setf_waerkField_2("");
    setf_vkorgField_2("");
  }

  function SearchPedidoAnioAnt(campo, orden) {
    setresponse_pedidoanioant({ itProductosAntField: [] });
    setindicador_spinner_1(true);
    settext_btn_filtro_1("Filtrar");
    setmostrar_filtro_fila_1(false);
    let model_pedidoanioant = {
      IsCampoAnt: campo,
      IsOrdenAnt: orden,
      ItFilterAnt: [
        {
          Matnr: f_matnrField_1,
          Maktx: f_maktxField_1,
          Kwmeng: f_kwmengField_1,
          Vrkme: f_vrkmeField_1,
          Netwr: f_netwrField_1,
          Waerk: f_waerkField_1,
          Vkorg: f_vkorgField_1,
        },
      ],
      PAntDesde: formatDateSAP(InputPAnt.PAntDesde),
      PAntHasta: formatDateSAP(InputPAnt.PAntHasta),
      PKunnr: PKunnr,
    };
    PedidoAnioAnt(model_pedidoanioant).then((result) => {
      setindicador_spinner_1(false);
      // setresponse_pedidoanioant(result);
      setDataSet_1([
        {
          columns: [
            {
              title: "Código: " + PKunnr,
              style: { font: { sz: "18", bold: true } },
              width: { wpx: 125 },
            },
            {
              title: "Cliente: " + name1Field,
              style: { font: { sz: "18", bold: true } },
              width: { wpx: 125 },
            },
            {
              title: "Desde: " + InputPAnt.PAntDesde,
              style: { font: { sz: "18", bold: false } },
              width: { wpx: 125 },
            },
            {
              title: "Hasta: " + InputPAnt.PAntHasta,
              style: { font: { sz: "18", bold: false } },
              width: { wpx: 125 },
            },
          ],
          data: [],
        },
        {
          ySteps: 1,
          columns: [
            {
              title: "Org. Ventas",
              style: { font: { sz: "18", bold: true } },
              width: { wpx: 125 },
            },
            {
              title: "Material",
              style: { font: { sz: "18", bold: true } },
              width: { wpx: 125 },
            },
            {
              title: "Denominación",
              style: { font: { sz: "18", bold: true } },
              width: { wpx: 125 },
            },
            {
              title: "Cantidad",
              style: { font: { sz: "18", bold: true } },
              width: { wpx: 125 },
            },
            {
              title: "UM",
              style: { font: { sz: "18", bold: true } },
              width: { wpx: 125 },
            },
            {
              title: "Valor Neto",
              style: { font: { sz: "18", bold: true } },
              width: { wpx: 125 },
            },
            {
              title: "Moneda",
              style: { font: { sz: "18", bold: true } },
              width: { wpx: 125 },
            },
          ],
          data: result.itProductosAntField.map((data) => {
            return [
              { value: data.vkorgField, style: { font: { sz: "14" } } },
              { value: data.matnrField, style: { font: { sz: "14" } } },
              { value: data.maktxField, style: { font: { sz: "14" } } },
              {
                value: Math.round(data.kwmengField),
                style: { font: { sz: "14" } },
              },
              { value: data.vrkmeField, style: { font: { sz: "14" } } },
              {
                value: convertDecimal(data.netwrField),
                style: { font: { sz: "14" } },
              },
              {
                value: data.waerkField,
                style: { font: { sz: "14" } },
              },
            ];
          }),
        },
      ]);

      setresponse_pedidoanioant({
        itProductosAntField: result.itProductosAntField.map((d, index) => {
          return {
            select: false,
            index: index,
            matnrField: d.matnrField,
            maktxField: d.maktxField,
            kwmengField: d.kwmengField,
            vrkmeField: d.vrkmeField,
            netwrField: d.netwrField,
            waerkField: d.waerkField,
            vkorgField: d.vkorgField,
          };
        }),
      });
    });
  }

  function SearchPedidoAnioAct(campo, orden) {
    arraycheckbox_export_2[0].data = [];
    setresponse_pedidoanioact({ itProductosActField: [] });
    setindicador_spinner_2(true);
    settext_btn_filtro_2("Filtrar");
    setmostrar_filtro_fila_2(false);
    let model_pedidoanioact = {
      IsCampoAct: campo,
      IsOrdenAct: orden,
      ItFilterAct: [
        {
          Matnr: f_matnrField_2,
          Maktx: f_maktxField_2,
          Kwmeng: f_kwmengField_2,
          Vrkme: f_vrkmeField_2,
          Netwr: f_netwrField_2,
          Waerk: f_waerkField_2,
          Vkorg: f_vkorgField_2,
        },
      ],
      PActDesde: formatDateSAP(InputPAct.PActDesde),
      PActHasta: formatDateSAP(InputPAct.PActHasta),
      PKunnr: PKunnr,
    };
    PedidoAnioAct(model_pedidoanioact).then((result) => {
      setindicador_spinner_2(false);
      setDataSet_2([
        {
          columns: [
            {
              title: "Código: " + PKunnr,
              style: { font: { sz: "18", bold: true } },
              width: { wpx: 125 },
            },
            {
              title: "Cliente: " + name1Field,
              style: { font: { sz: "18", bold: true } },
              width: { wpx: 125 },
            },
            {
              title: "Desde: " + InputPAnt.PActDesde,
              style: { font: { sz: "18", bold: false } },
              width: { wpx: 125 },
            },
            {
              title: "Hasta: " + InputPAnt.PActHasta,
              style: { font: { sz: "18", bold: false } },
              width: { wpx: 125 },
            },
          ],
          data: [],
        },
        {
          ySteps: 1,
          columns: [
            {
              title: "Org. Ventas",
              style: { font: { sz: "18", bold: true } },
              width: { wpx: 125 },
            },
            {
              title: "Material",
              style: { font: { sz: "18", bold: true } },
              width: { wpx: 125 },
            },
            {
              title: "Denominación",
              style: { font: { sz: "18", bold: true } },
              width: { wpx: 125 },
            },
            {
              title: "Cantidad",
              style: { font: { sz: "18", bold: true } },
              width: { wpx: 125 },
            },
            {
              title: "UM",
              style: { font: { sz: "18", bold: true } },
              width: { wpx: 125 },
            },
            {
              title: "Valor Neto",
              style: { font: { sz: "18", bold: true } },
              width: { wpx: 125 },
            },
            {
              title: "Moneda",
              style: { font: { sz: "18", bold: true } },
              width: { wpx: 125 },
            },
          ],
          data: result.itProductosActField.map((data) => {
            return [
              { value: data.vkorgField, style: { font: { sz: "14" } } },
              { value: data.matnrField, style: { font: { sz: "14" } } },
              { value: data.maktxField, style: { font: { sz: "14" } } },
              {
                value: Math.round(data.kwmengField),
                style: { font: { sz: "14" } },
              },
              { value: data.vrkmeField, style: { font: { sz: "14" } } },
              {
                value: convertDecimal(data.netwrField),
                style: { font: { sz: "14" } },
              },
              {
                value: data.waerkField,
                style: { font: { sz: "14" } },
              },
            ];
          }),
        },
      ]);

      setresponse_pedidoanioact({
        itProductosActField: result.itProductosActField.map((d, index) => {
          return {
            select: false,
            index: index,
            matnrField: d.matnrField,
            maktxField: d.maktxField,
            kwmengField: d.kwmengField,
            vrkmeField: d.vrkmeField,
            netwrField: d.netwrField,
            waerkField: d.waerkField,
            vkorgField: d.vkorgField,
          };
        }),
      });
    });
  }

  function handleChange(name, value) {
    switch (name) {
      case "infocliente_cliente":
        setPKunnr(value);
        break;
      case "desde_infocliente_anio_ant_fecha":
        setInputPAnt({ PAntDesde: value, PAntHasta: InputPAnt.PAntHasta });
        break;
      case "hasta_infocliente_anio_ant_fecha":
        setInputPAnt({ PAntDesde: InputPAnt.PAntDesde, PAntHasta: value });
        break;
      case "desde_infocliente_anio_act_fecha":
        setInputPAct({ PActDesde: value, PActHasta: InputPAct.PActHasta });
        break;
      case "hasta_infocliente_anio_act_fecha":
        setInputPAct({ PActDesde: InputPAct.PActHasta, PActHasta: value });
        break;
      default:
        break;
    }
  }

  function mc_InfoCliente() {
    setshowmc_infocliente((prev) => !prev);
  }

  function formatDateSinguion(value) {
    if (value != "") {
      return (
        value.substring(6, 8) +
        "-" +
        value.substring(4, 6) +
        "-" +
        value.substring(0, 4)
      );
    } else {
      return "";
    }
  }

  //completar decimal de 2 digitos
  function convertDecimal(num) {
    if (num.toString().split(".").length == 2) {
      return (
        num
          .toString()
          .split(".")[0]
          .replace(/\D/g, "")
          .replace(/\B(?=(\d{3})+(?!\d)\.?)/g, ",") +
        "." +
        num.toString().split(".")[1].padStart(2, "0")
      );
    } else {
      return (
        num
          .toString()
          .split(".")[0]
          .replace(/\D/g, "")
          .replace(/\B(?=(\d{3})+(?!\d)\.?)/g, ",") + ".00"
      );
    }
  }

  //formateo de la fecha para enviar a SAP YYYYMMDD
  function formatDateSAP(value) {
    var datePart = value.match(/\d+/g),
      year = datePart[0],
      month = datePart[1],
      day = datePart[2];

    return year + "" + month + "" + day;
  }

  //formateo de la fecha para visualizar
  function formatDate(value) {
    var datePart = value.match(/\d+/g),
      year = datePart[0],
      month = datePart[1],
      day = datePart[2];

    return day + "-" + month + "-" + year;
  }

  const closeModal_1 = (e) => {
    if (modalRef_1.current === e.target) {
      setshowmodal_1(false);
      settext_btn_filtro_1("Filtrar");
      setmostrar_filtro_fila_1(false);
    }
  };

  const closeModal_2 = (e) => {
    if (modalRef_2.current === e.target) {
      setshowmodal_2(false);
      settext_btn_filtro_2("Filtrar");
      setmostrar_filtro_fila_2(false);
    }
  };

  const MostrarFiltro_1 = () => {
    clear_filtro_fila_1();
    if (mostrar_filtro_fila_1 == true) {
      settext_btn_filtro_1("Filtrar");
      setmostrar_filtro_fila_1(false);
    } else {
      settext_btn_filtro_1("Borrar filtros");
      setmostrar_filtro_fila_1(true);
    }
    setindicadorfiltro_1(true);
  };

  const MostrarFiltro_2 = () => {
    clear_filtro_fila_2();
    if (mostrar_filtro_fila_2 == true) {
      settext_btn_filtro_2("Filtrar");
      setmostrar_filtro_fila_2(false);
    } else {
      settext_btn_filtro_2("Borrar filtros");
      setmostrar_filtro_fila_2(true);
    }
    setindicadorfiltro_2(true);
  };

  //para el filtro
  function handleChangeFiltro_1(name, value) {
    switch (name) {
      case "f_matnrField_1":
        setf_matnrField_1(value);
        break;
      case "f_maktxField_1":
        setf_maktxField_1(value);
        break;
      case "f_kwmengField_1":
        setf_kwmengField_1(value);
        break;
      case "f_vrkmeField_1":
        setf_vrkmeField_1(value);
        break;
      case "f_netwrField_1":
        setf_netwrField_1(value);
        break;
      case "f_waerkField_1":
        setf_waerkField_1(value);
        break;
      case "f_vkorgField_1":
        setf_vkorgField_1(value);
        break;
      default:
        break;
    }
  }

  //para el filtro
  function handleChangeFiltro_2(name, value) {
    switch (name) {
      case "f_matnrField_2":
        setf_matnrField_2(value);
        break;
      case "f_maktxField_2":
        setf_maktxField_2(value);
        break;
      case "f_kwmengField_2":
        setf_kwmengField_2(value);
        break;
      case "f_vrkmeField_2":
        setf_vrkmeField_2(value);
        break;
      case "f_netwrField_2":
        setf_netwrField_2(value);
        break;
      case "f_waerkField_2":
        setf_waerkField_2(value);
        break;
      case "f_vkorgField_2":
        setf_vkorgField_2(value);
        break;
      default:
        break;
    }
  }

  function buscar_filtro_enter_1(event) {
    var keycode = event.keyCode;
    if (keycode == "13") {
      ClearAllColumns_1();
      SearchPedidoAnioAnt("", "");
    }
  }

  function buscar_filtro_enter_2(event) {
    var keycode = event.keyCode;
    if (keycode == "13") {
      SearchPedidoAnioAct("", "");
    }
  }

  function buscar_filtro_icono_btn_1() {
    SearchPedidoAnioAnt("", "");
  }
  function buscar_filtro_icono_btn_2() {
    SearchPedidoAnioAct("", "");
  }

  function ClearAllColumns_1() {
    setcol1_1(0);
    setcol1_2(0);
    setcol1_3(0);
    setcol1_4(0);
    setcol1_5(0);
    setcol1_6(0);
    setcol1_7(0);
  }

  function ClearAllColumns_2() {
    setcol2_1(0);
    setcol2_2(0);
    setcol2_3(0);
    setcol2_4(0);
    setcol2_5(0);
    setcol2_6(0);
    setcol2_7(0);
  }

  function clearColumnsIcon_1(num_col) {
    switch (num_col) {
      case 1:
        setcol1_2(0);
        setcol1_3(0);
        setcol1_4(0);
        setcol1_5(0);
        setcol1_6(0);
        setcol1_7(0);
        break;
      case 2:
        setcol1_1(0);
        setcol1_3(0);
        setcol1_4(0);
        setcol1_5(0);
        setcol1_6(0);
        setcol1_7(0);
        break;
      case 3:
        setcol1_1(0);
        setcol1_2(0);
        setcol1_4(0);
        setcol1_5(0);
        setcol1_6(0);
        setcol1_7(0);
        break;
      case 4:
        setcol1_1(0);
        setcol1_2(0);
        setcol1_3(0);
        setcol1_5(0);
        setcol1_6(0);
        setcol1_7(0);
        break;
      case 5:
        setcol1_1(0);
        setcol1_2(0);
        setcol1_3(0);
        setcol1_4(0);
        setcol1_6(0);
        setcol1_7(0);
        break;
      case 6:
        setcol1_1(0);
        setcol1_2(0);
        setcol1_3(0);
        setcol1_4(0);
        setcol1_5(0);
        setcol1_7(0);
        break;
      case 7:
        setcol1_1(0);
        setcol1_2(0);
        setcol1_3(0);
        setcol1_4(0);
        setcol1_5(0);
        setcol1_6(0);
        break;
      default:
        break;
    }
  }

  function clearColumnsIcon_2(num_col) {
    switch (num_col) {
      case 1:
        setcol2_2(0);
        setcol2_3(0);
        setcol2_4(0);
        setcol2_5(0);
        setcol2_6(0);
        setcol2_7(0);
        break;
      case 2:
        setcol2_1(0);
        setcol2_3(0);
        setcol2_4(0);
        setcol2_5(0);
        setcol2_6(0);
        setcol2_7(0);
        break;
      case 3:
        setcol2_1(0);
        setcol2_2(0);
        setcol2_4(0);
        setcol2_5(0);
        setcol2_6(0);
        setcol2_7(0);
        break;
      case 4:
        setcol2_1(0);
        setcol2_2(0);
        setcol2_3(0);
        setcol2_5(0);
        setcol2_6(0);
        setcol2_7(0);
        break;
      case 5:
        setcol2_1(0);
        setcol2_2(0);
        setcol2_3(0);
        setcol2_4(0);
        setcol2_6(0);
        setcol2_7(0);
        break;
      case 6:
        setcol2_1(0);
        setcol2_2(0);
        setcol2_3(0);
        setcol2_4(0);
        setcol2_5(0);
        setcol2_7(0);
        break;
      case 7:
        setcol2_1(0);
        setcol2_2(0);
        setcol2_3(0);
        setcol2_4(0);
        setcol2_5(0);
        setcol2_6(0);
        break;
      default:
        break;
    }
  }

  function Clear() {
    setPKunnr("");

    setresponse_infocliente({
      isVentasFechasField: [],
      itInfoCreditoField: [],
      itNcuentaPagarField: [],
    });

    setname1Field("");
    setvtwegField("");
    setvtwegVtextField("");
    setchkField("");
    setchkDescField("");
    setfcreacionField("");
    setmjeFcreaField("");
    setcondicion_agro("");
    setcondicion_semi("");
    setcondicion_espe("");
    setcondicion_salu("");
    setpltypField_agro("");
    setpltypPtextField_agro("");
    setpltypField_espe("");
    setpltypPtextField_espe("");
    setpltypField_salu("");
    setpltypPtextField_salu("");
    setpltypField_semi("");
    setpltypPtextField_semi("");
  }

  function handleChangeColumna_1(num_col) {
    switch (num_col) {
      case 1:
        clearColumnsIcon_1(1);
        if (col1_1 === 0) {
          setcol1_1(col1_1 + 1);
          SearchPedidoAnioAnt("MATNR", "0");
        } else if (col1_1 === 1) {
          setcol1_1(col1_1 + 1);
          SearchPedidoAnioAnt("MATNR", "1");
        } else {
          setcol1_1(0);
          SearchPedidoAnioAnt("", "");
        }
        break;
      case 2:
        clearColumnsIcon_1(2);
        if (col1_2 === 0) {
          setcol1_2(col1_2 + 1);
          SearchPedidoAnioAnt("MAKTX", "0");
        } else if (col1_2 === 1) {
          setcol1_2(col1_2 + 1);
          SearchPedidoAnioAnt("MAKTX", "1");
        } else {
          setcol1_2(0);
          SearchPedidoAnioAnt("", "");
        }
        break;
      case 3:
        clearColumnsIcon_1(3);
        if (col1_3 === 0) {
          setcol1_3(col1_3 + 1);
          SearchPedidoAnioAnt("KWMENG", "0");
        } else if (col1_3 === 1) {
          setcol1_3(col1_3 + 1);
          SearchPedidoAnioAnt("KWMENG", "1");
        } else {
          setcol1_3(0);
          SearchPedidoAnioAnt("", "");
        }
        break;
      case 4:
        clearColumnsIcon_1(4);
        if (col1_4 === 0) {
          setcol1_4(col1_4 + 1);
          SearchPedidoAnioAnt("VRKME", "0");
        } else if (col1_4 === 1) {
          setcol1_4(col1_4 + 1);
          SearchPedidoAnioAnt("VRKME", "1");
        } else {
          setcol1_4(0);
          SearchPedidoAnioAnt("", "");
        }
        break;
      case 5:
        clearColumnsIcon_1(5);
        if (col1_5 === 0) {
          setcol1_5(col1_5 + 1);
          SearchPedidoAnioAnt("NETWR", "0");
        } else if (col1_5 === 1) {
          setcol1_5(col1_5 + 1);
          SearchPedidoAnioAnt("NETWR", "1");
        } else {
          setcol1_5(0);
          SearchPedidoAnioAnt("", "");
        }
        break;
      case 6:
        clearColumnsIcon_1(6);
        if (col1_6 === 0) {
          setcol1_6(col1_6 + 1);
          SearchPedidoAnioAnt("WAERK", "0");
        } else if (col1_6 === 1) {
          setcol1_6(col1_6 + 1);
          SearchPedidoAnioAnt("WAERK", "1");
        } else {
          setcol1_6(0);
          SearchPedidoAnioAnt("", "");
        }
        break;
      case 7:
        clearColumnsIcon_1(7);
        if (col1_7 === 0) {
          setcol1_7(col1_7 + 1);
          SearchPedidoAnioAnt("VKORG", "0");
        } else if (col1_7 === 1) {
          setcol1_7(col1_7 + 1);
          SearchPedidoAnioAnt("VKORG", "1");
        } else {
          setcol1_7(0);
          SearchPedidoAnioAnt("", "");
        }
        break;
    }
  }

  function handleChangeColumna_2(num_col) {
    switch (num_col) {
      case 1:
        clearColumnsIcon_2(1);
        if (col2_1 === 0) {
          setcol2_1(col2_1 + 1);
          SearchPedidoAnioAct("MATNR", "0");
        } else if (col2_1 === 1) {
          setcol2_1(col2_1 + 1);
          SearchPedidoAnioAct("MATNR", "1");
        } else {
          setcol2_1(0);
          SearchPedidoAnioAct("", "");
        }
        break;
      case 2:
        clearColumnsIcon_2(2);
        if (col2_2 === 0) {
          setcol2_2(col2_2 + 1);
          SearchPedidoAnioAct("MAKTX", "0");
        } else if (col2_2 === 1) {
          setcol2_2(col2_2 + 1);
          SearchPedidoAnioAct("MAKTX", "1");
        } else {
          setcol2_2(0);
          SearchPedidoAnioAct("", "");
        }
        break;
      case 3:
        clearColumnsIcon_2(3);
        if (col2_3 === 0) {
          setcol2_3(col2_3 + 1);
          SearchPedidoAnioAct("KWMENG", "0");
        } else if (col2_3 === 1) {
          setcol2_3(col2_3 + 1);
          SearchPedidoAnioAct("KWMENG", "1");
        } else {
          setcol2_3(0);
          SearchPedidoAnioAct("", "");
        }
        break;
      case 4:
        clearColumnsIcon_1(4);
        if (col2_4 === 0) {
          setcol2_4(col2_4 + 1);
          SearchPedidoAnioAct("VRKME", "0");
        } else if (col2_4 === 1) {
          setcol2_4(col2_4 + 1);
          SearchPedidoAnioAct("VRKME", "1");
        } else {
          setcol2_4(0);
          SearchPedidoAnioAct("", "");
        }
        break;
      case 5:
        clearColumnsIcon_1(5);
        if (col2_5 === 0) {
          setcol2_5(col2_5 + 1);
          SearchPedidoAnioAct("NETWR", "0");
        } else if (col2_5 === 1) {
          setcol2_5(col2_5 + 1);
          SearchPedidoAnioAct("NETWR", "1");
        } else {
          setcol2_5(0);
          SearchPedidoAnioAct("", "");
        }
        break;
      case 6:
        clearColumnsIcon_1(6);
        if (col2_6 === 0) {
          setcol2_6(col2_6 + 1);
          SearchPedidoAnioAct("WAERK", "0");
        } else if (col2_6 === 1) {
          setcol2_6(col2_6 + 1);
          SearchPedidoAnioAct("WAERK", "1");
        } else {
          setcol2_6(0);
          SearchPedidoAnioAct("", "");
        }
        break;
      case 7:
        clearColumnsIcon_1(7);
        if (col2_7 === 0) {
          setcol2_7(col2_7 + 1);
          SearchPedidoAnioAct("VKORG", "0");
        } else if (col2_7 === 1) {
          setcol2_7(col2_7 + 1);
          SearchPedidoAnioAct("VKORG", "1");
        } else {
          setcol2_7(0);
          SearchPedidoAnioAct("", "");
        }
        break;
    }
  }

  //completar decimal de 2 digitos
  function convertDecimal(num) {
    let signo = "";

    // return num.toFixed(Math.max(((num+'').split(".")[1]||"").length, 2));
    if (num == null || num == "" || num == "0") {
      return "0.00";
    } else {
      if (Math.sign(num) == "-1") {
        signo = "-";
      }
      if (num.toString().split(".").length == 2) {
        // console.log( num.toString().split(".")[0].replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d)\.?)/g, ",") + "."+num.toString().split(".")[1]);
        return (
          signo +
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
          signo +
          num
            .toString()
            .split(".")[0]
            .replace(/\D/g, "")
            .replace(/\B(?=(\d{3})+(?!\d)\.?)/g, ",") +
          ".00"
        );
      }
    }
  }

  function ordenamiento_2(d) {
    arraycheckbox_export_2[0].data.push([
      {
        value: d.vkorgField,
        style: {
          font: { sz: "14" },
        },
      },
      {
        value: d.matnrField,
        style: {
          font: { sz: "14" },
        },
      },
      {
        value: d.maktxField,
        style: {
          font: { sz: "14" },
        },
      },
      {
        value: Math.round(d.kwmengField),
        style: {
          font: { sz: "14" },
        },
      },
      {
        value: d.vrkmeField,
        style: {
          font: { sz: "14" },
        },
      },
      {
        value: convertDecimal(d.netwrField),
        style: {
          font: { sz: "14" },
        },
      },
      {
        value: d.waerkField,
        style: {
          font: { sz: "14" },
        },
      },
    ]);
    arraycheckbox_export_2[0].data.sort(function (a, b) {
      return a[0].value - b[0].value;
    });
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
      {/* {show_status_password ? (
        <ChangeStatusPassword
          setshow_status_password={setshow_status_password}
        />
      ) : null} */}
      {spinnerroute ? (
        <Spinner />
      ) : (
        <>
          {/* {accesoruta ? ( */}
          <div className="container-view">
            {/* MODAL MATCHCODE PARA CLIENTE */}
            <Matchcode_InfoCliente
              showmc_infocliente={showmc_infocliente}
              setshowmc_infocliente={setshowmc_infocliente}
              setPKunnr={setPKunnr}
              PKunnr={PKunnr}
              setetClientesField={setetClientesField}
            />
            <div className="title-section">
              <div>
                <label> Reportes / Información del Cliente </label>
                <label>
                  {" "}
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
                  Fecha (hoy) :{" "}
                  {/* <i class="fas fa-dollar-sign"></i> {" "}:{" "} */}
                  <label style={{ color: "#008040" }}>
                    {getDateAct()}
                  </label>{" "}
                </label>
              </div>
              <hr />
            </div>
            <section>
              <div style={{ margin: "10px" }} className="row">
                <div className="col-sm-3 d-flex align-items-center">
                  <label>Cod. Cliente</label>
                </div>
                <div className="col-sm-9">
                  <InputForm
                    attribute={{
                      name: "infocliente_cliente",
                      type: "text",
                      value: PKunnr,
                      disabled: false,
                      checked: false,
                      matchcode: true,
                      maxlength: 10,
                    }}
                    handleChange={handleChange}
                    onClick={() => mc_InfoCliente()}
                  />
                </div>
              </div>
            </section>
            <section className="col-md-6 p-1">
              <div>
                <BtnSearch
                  attribute={{ name: "Buscar", classNamebtn: "btn_search" }}
                  onClick={() => Search()}
                />
              </div>
            </section>
            <section className="col-md-6 p-1">
              <div>
                <BtnSearch
                  attribute={{
                    name: "Limpiar Campos",
                    classNamebtn: "btn_search",
                  }}
                  onClick={() => Clear()}
                />
              </div>
            </section>
            <section>
              <div style={{ margin: "10px" }} className="row">
                <div className="container-input-2">
                  {/* <label>Organiz. ventas</label>
                                    <div className="col-1">
                                        <InputForm attribute={{name:'infocliente_orgventas',type:'text',value:etClientesField.vkorgField,disabled:true,checked:false,matchcode:false}} handleChange={handleChange} />
                                    </div> */}
                </div>

                <div className="col-sm-3 d-flex align-items-center">
                  <label>Nombre Cliente</label>
                </div>
                <div className="col-sm-9">
                  <InputForm
                    attribute={{
                      name: "infocliente_nombcliente",
                      type: "text",
                      value: name1Field,
                      disabled: true,
                      checked: false,
                      matchcode: false,
                    }}
                    handleChange={handleChange}
                  />
                </div>

                <div className="col-sm-3 d-flex align-items-center">
                  <label></label>
                </div>
                <div
                  className="col-sm-9 d-flex align-items-center"
                  style={{ paddingLeft: "19px" }}
                >
                  <input
                    type="checkbox"
                    name="2"
                    className="checkbox_detalle_2"
                    disabled
                    checked={chkField == "X" ? true : false}
                  />
                  <label
                    style={{
                      margin: "10px",
                      textTransform: "uppercase",
                      fontWeight: "bold",
                      paddingLeft: "3px",
                    }}
                  >
                    {chkDescField}
                  </label>
                </div>

                <div className="col-sm-3 d-flex align-items-center">
                  <label>Canal distrib.</label>
                </div>
                <div className="col-sm-9" style={{ marginBottom: "20px" }}>
                  <InputForm
                    attribute={{
                      name: "infocliente_canaldistrib",
                      type: "text",
                      value:
                        vtwegField !== "" || vtwegVtextField !== ""
                          ? vtwegField + " / " + vtwegVtextField
                          : "",
                      disabled: true,
                      checked: false,
                      matchcode: false,
                    }}
                    handleChange={handleChange}
                  />
                </div>

                <div className="col-sm-3 d-flex align-items-center">
                  <label>Creado el:</label>
                </div>
                <div className="col-sm-9" style={{ marginBottom: "20px" }}>
                  <InputForm
                    attribute={{
                      name: "infocliente_canaldistrib",
                      type: "text",
                      value:
                        formatDateSinguion(fcreacionField) +
                        "  " +
                        mjeFcreaField,
                      disabled: true,
                      checked: false,
                      matchcode: false,
                    }}
                    handleChange={handleChange}
                  />
                </div>

                {ctaCreditoField != "" ? (
                  <react.Fragment>
                    <div className="col-sm-3 d-flex align-items-center">
                      <label>Relacionado a:</label>
                    </div>

                    <div className="col-sm-9" style={{ marginBottom: "20px" }}>
                      <InputForm
                        attribute={{
                          name: "infocliente_canaldistrib",
                          type: "text",
                          value: ctaCreditoField + " - " + nameCtacredField,
                          disabled: true,
                          checked: false,
                          matchcode: false,
                        }}
                        handleChange={handleChange}
                      />
                    </div>
                  </react.Fragment>
                ) : null}

                <div className="col-sm-3 d-flex align-items-center">
                  <label>Condición AGRO</label>
                </div>
                <div className="col-sm-3">
                  <InputForm
                    attribute={{
                      name: "infocliente_condicion",
                      type: "text",
                      value: condicion_agro,
                      disabled: true,
                      checked: false,
                      matchcode: false,
                    }}
                    handleChange={handleChange}
                  />
                </div>

                <div className="col-sm-3 d-flex align-items-center">
                  <label>Lista precios</label>
                </div>
                <div className="col-sm-3">
                  <InputForm
                    attribute={{
                      name: "infocliente_listprecio",
                      type: "text",
                      value:
                        pltypField_agro !== "" || pltypPtextField_agro !== ""
                          ? pltypField_agro + " / " + pltypPtextField_agro
                          : "",
                      disabled: true,
                      checked: false,
                      matchcode: false,
                    }}
                    handleChange={handleChange}
                  />
                </div>

                <div className="col-sm-3 d-flex align-items-center">
                  <label>Condición ESPE</label>
                </div>
                <div className="col-sm-3">
                  <InputForm
                    attribute={{
                      name: "infocliente_condicion",
                      type: "text",
                      value: condicion_espe,
                      disabled: true,
                      checked: false,
                      matchcode: false,
                    }}
                    handleChange={handleChange}
                  />
                </div>

                <div className="col-sm-3 d-flex align-items-center">
                  <label>Lista precios</label>
                </div>
                <div className="col-sm-3">
                  <InputForm
                    attribute={{
                      name: "infocliente_listprecio",
                      type: "text",
                      value:
                        pltypField_espe !== "" || pltypPtextField_espe !== ""
                          ? pltypField_espe + " / " + pltypPtextField_espe
                          : "",
                      disabled: true,
                      checked: false,
                      matchcode: false,
                    }}
                    handleChange={handleChange}
                  />
                </div>

                <div className="col-sm-3 d-flex align-items-center">
                  <label>Condición SEMI</label>
                </div>
                <div className="col-sm-3">
                  <InputForm
                    attribute={{
                      name: "infocliente_condicion",
                      type: "text",
                      value: condicion_semi,
                      disabled: true,
                      checked: false,
                      matchcode: false,
                    }}
                    handleChange={handleChange}
                  />
                </div>

                <div className="col-sm-3 d-flex align-items-center">
                  <label>Lista precios</label>
                </div>
                <div className="col-sm-3">
                  <InputForm
                    attribute={{
                      name: "infocliente_listprecio",
                      type: "text",
                      value:
                        pltypField_semi !== "" || pltypPtextField_semi !== ""
                          ? pltypField_semi + " / " + pltypPtextField_semi
                          : "",
                      disabled: true,
                      checked: false,
                      matchcode: false,
                    }}
                    handleChange={handleChange}
                  />
                </div>

                <div className="col-sm-3 d-flex align-items-center">
                  <label>Condición SALU</label>
                </div>
                <div className="col-sm-3">
                  <InputForm
                    attribute={{
                      name: "infocliente_condicion",
                      type: "text",
                      value: condicion_salu,
                      disabled: true,
                      checked: false,
                      matchcode: false,
                    }}
                    handleChange={handleChange}
                  />
                </div>

                <div className="col-sm-3 d-flex align-items-center">
                  <label>Lista precios</label>
                </div>
                <div className="col-sm-3">
                  <InputForm
                    attribute={{
                      name: "infocliente_listprecio",
                      type: "text",
                      value:
                        pltypField_salu !== "" || pltypPtextField_salu !== ""
                          ? pltypField_salu + " / " + pltypPtextField_salu
                          : "",
                      disabled: true,
                      checked: false,
                      matchcode: false,
                    }}
                    handleChange={handleChange}
                  />
                </div>
              </div>
            </section>

            <section style={{ margin: "10px" }}>
              <div className="subtitle-section">Información de ventas</div>
              <div className="col-md-6 p-1" style={{ marginBottom: "20px" }}>
                <BtnSearch
                  attribute={{
                    name: "Ver Pedidos del año anterior",
                    classNamebtn: "btn_search",
                    iconname: "fas fa-file-alt",
                  }}
                  onClick={() => setshowmodal_1((prev) => !prev)}
                />
              </div>
              <div className="col-md-6 p-1" style={{ marginBottom: "20px" }}>
                <BtnSearch
                  attribute={{
                    name: "Ver Pedidos de este año",
                    classNamebtn: "btn_search",
                    iconname: "fas fa-file-alt",
                  }}
                  onClick={() => setshowmodal_2((prev) => !prev)}
                />
              </div>
            </section>

            <section>
              <div style={{ margin: "10px" }}>
                <div className="subtitle-section">
                  Información Línea de Crédito y Grado de Uso
                </div>
                <div className="container-table" style={{ margin: "15px" }}>
                  <div className="container-table-sm">
                    <table className="content-table">
                      <thead>
                        <tr style={{ border: "1px solid #91c848" }}>
                          <th
                            rowSpan="2"
                            style={{ border: "1px solid #91c848" }}
                          >
                            Línea de Crédito
                          </th>
                          <th
                            colSpan="2"
                            style={{ border: "1px solid #91c848" }}
                          >
                            Línea de crédito utilizada
                          </th>
                          <th
                            rowSpan="2"
                            style={{ border: "1px solid #91c848" }}
                          >
                            Línea disponible
                          </th>
                          <th
                            rowSpan="2"
                            style={{ border: "1px solid #91c848" }}
                          >
                            Moneda
                          </th>
                        </tr>
                        <tr style={{ border: "1px solid #91c848" }}>
                          <td style={{ border: "1px solid #91c848" }}>
                            Vigente
                          </td>
                          <td style={{ border: "1px solid #91c848" }}>
                            Vencida
                          </td>
                        </tr>
                      </thead>
                      <tbody>
                        {response_infocliente.itInfoCreditoField.map(
                          (response, key) => (
                            <tr key={key}>
                              <th style={{ textAlign: "center" }}>
                                {convertDecimal(response.klimkField)}
                              </th>
                              <th style={{ textAlign: "center" }}>
                                {convertDecimal(response.klimuVigField)}
                              </th>
                              <th style={{ textAlign: "center", color: "red" }}>
                                {convertDecimal(response.klimuVenField)}
                              </th>
                              <th style={{ textAlign: "center" }}>
                                {convertDecimal(response.klimdField)}
                              </th>
                              <th style={{ textAlign: "center" }}>
                                {response.waerkField}
                              </th>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                  {indicador_spinner && <Spinner />}
                </div>
              </div>
              <div style={{ margin: "10px" }}>
                <div className="subtitle-section">
                  Información Cuenta por Pagar y Días de Vencimiento
                </div>
                <div className="container-table" style={{ margin: "15px" }}>
                  <div className="container-table-sm">
                    <table className="content-table">
                      <thead>
                        <tr style={{ border: "1px solid #91c848" }}>
                          <th
                            colSpan="2"
                            style={{ border: "1px solid #91c848" }}
                          >
                            Vigente
                          </th>
                          <th
                            colSpan="4"
                            style={{ border: "1px solid #91c848" }}
                          >
                            Vencido
                          </th>
                          <th
                            rowSpan="2"
                            style={{ border: "1px solid #91c848" }}
                          >
                            Moneda
                          </th>
                        </tr>
                        <tr style={{ border: "1px solid #91c848" }}>
                          <th style={{ border: "1px solid #91c848" }}>
                            No vencido
                          </th>
                          <th style={{ border: "1px solid #91c848" }}>
                            Vcdo 1-8 días
                          </th>
                          <th style={{ border: "1px solid #91c848" }}>
                            Vcdo 9-30
                          </th>
                          <th style={{ border: "1px solid #91c848" }}>
                            Vcdo 31-60
                          </th>
                          <th style={{ border: "1px solid #91c848" }}>
                            Vcdo 61-90
                          </th>
                          <th style={{ border: "1px solid #91c848" }}>
                            Vcdo más de 90 días
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {response_infocliente.itNcuentaPagarField.map(
                          (response, key) => (
                            <tr key={key}>
                              <th style={{ textAlign: "center" }}>
                                {convertDecimal(response.noVencidoField)}
                              </th>
                              <th style={{ textAlign: "center" }}>
                                {convertDecimal(response.deu18Field)}
                              </th>
                              <th
                                style={
                                  response.deu930Field > 0
                                    ? { textAlign: "center", color: "red" }
                                    : { textAlign: "center" }
                                }
                              >
                                {convertDecimal(response.deu930Field)}
                              </th>
                              <th
                                style={
                                  response.deu3160Field > 0
                                    ? { textAlign: "center", color: "red" }
                                    : { textAlign: "center" }
                                }
                              >
                                {convertDecimal(response.deu3160Field)}
                              </th>
                              <th
                                style={
                                  response.deu6190Field > 0
                                    ? { textAlign: "center", color: "red" }
                                    : { textAlign: "center" }
                                }
                              >
                                {convertDecimal(response.deu6190Field)}
                              </th>
                              <th
                                style={
                                  response.deu91Field > 0
                                    ? { textAlign: "center", color: "red" }
                                    : { textAlign: "center" }
                                }
                              >
                                {convertDecimal(response.deu91Field)}
                              </th>
                              <th style={{ textAlign: "center" }}>
                                {response.waersField}
                              </th>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                  {indicador_spinner && <Spinner />}
                </div>
              </div>
            </section>

            {showmodal_1 == true ? (
              <react.Fragment>
                <div
                  className="container-modal-background"
                  onClick={closeModal_1}
                  ref={modalRef_1}
                >
                  <div className="modal-wrapper modal-wrapper-bg">
                    <section className="row" style={{ paddingTop: "50px" }}>
                      <section>
                        <div style={{ margin: "10px" }} className="row">
                          <div className="subtitle-section">
                            Pedidos del año anterior (3 últimos meses)
                          </div>

                          <div className="col-sm-3 d-flex align-items-center">
                            <label>Desde</label>
                          </div>
                          <div className="col-sm-3">
                            <InputForm
                              attribute={{
                                name: "desde_infocliente_anio_ant_fecha",
                                type: "date",
                                value: InputPAnt.PAntDesde,
                                disabled: false,
                                checked: false,
                                matchcode: false,
                              }}
                              handleChange={handleChange}
                            />
                          </div>

                          <div className="col-sm-3 d-flex align-items-center">
                            <label>Hasta</label>
                          </div>
                          <div className="col-sm-3">
                            <InputForm
                              attribute={{
                                name: "hasta_infocliente_anio_ant_fecha",
                                type: "date",
                                value: InputPAnt.PAntHasta,
                                disabled: false,
                                checked: false,
                                matchcode: false,
                              }}
                              handleChange={handleChange}
                            />
                          </div>

                          {indicador_response_infocliente && (
                            <div
                              style={{ margin: "10px", alignSelf: "center" }}
                            >
                              <div className="col-md-6 p-1">
                                <BtnSearch
                                  attribute={{
                                    name: "Buscar",
                                    classNamebtn: "btn_search",
                                  }}
                                  onClick={() => {
                                    ClearAllColumns_1();
                                    clear_filtro_fila_1();
                                    SearchPedidoAnioAnt("", "");
                                  }}
                                />
                              </div>
                              <div className="col-md-6 p-1">
                                {arraycheckbox_export_1[0].data.length > 0 ? (
                                  <ExcelFile
                                    filename="Informacion de Cliente"
                                    element={
                                      <BtnExportar
                                        attribute={{
                                          name: "Descargar Excel",
                                          classNamebtn: "btn_export",
                                          disabled: false,
                                        }}
                                      />
                                    }
                                  >
                                    <ExcelSheet
                                      dataSet={arraycheckbox_export_1}
                                      name="exportacion"
                                    />
                                  </ExcelFile>
                                ) : (
                                  <ExcelFile
                                    filename="Informacion de Cliente"
                                    element={
                                      <BtnExportar
                                        attribute={{
                                          name: "Descargar Excel",
                                          classNamebtn: "btn_export",
                                          disabled: false,
                                        }}
                                      />
                                    }
                                  >
                                    <ExcelSheet
                                      dataSet={DataSet_1}
                                      name="exportacion"
                                    />
                                  </ExcelFile>
                                )}
                              </div>
                              <div className="col-sm-12 col-md-12 m-1">
                                <BtnSearch
                                  attribute={{
                                    name: text_btn_filtro_1,
                                    classNamebtn: "btn_search",
                                  }}
                                  onClick={() => MostrarFiltro_1()}
                                />
                              </div>
                            </div>
                          )}

                          <div className="col-md-12">
                            <div className="title-section">
                              <label> Productos </label>
                              <hr />
                            </div>
                            <div className="container-table-200">
                              <table className="content-table">
                                <thead>
                                  <tr>
                                    <th></th>
                                    <th style={{ textAlign: "center" }}>
                                      Org. Ventas |{" "}
                                      {col1_7 === 0 ? (
                                        <i
                                          className="fas fa-arrows-alt-v"
                                          style={{ cursor: "pointer" }}
                                          onClick={() =>
                                            handleChangeColumna_1(7)
                                          }
                                        ></i>
                                      ) : null}
                                      {col1_7 === 1 ? (
                                        <i
                                          className="fas fa-sort-amount-up"
                                          style={{ cursor: "pointer" }}
                                          onClick={() =>
                                            handleChangeColumna_1(7)
                                          }
                                        ></i>
                                      ) : null}
                                      {col1_7 === 2 ? (
                                        <i
                                          className="fas fa-sort-amount-down-alt"
                                          style={{ cursor: "pointer" }}
                                          onClick={() =>
                                            handleChangeColumna_1(7)
                                          }
                                        ></i>
                                      ) : null}
                                    </th>
                                    <th style={{ height: "auto" }}>
                                      Material |{" "}
                                      {col1_1 === 0 ? (
                                        <i
                                          className="fas fa-arrows-alt-v"
                                          style={{ cursor: "pointer" }}
                                          onClick={() =>
                                            handleChangeColumna_1(1)
                                          }
                                        ></i>
                                      ) : null}
                                      {col1_1 === 1 ? (
                                        <i
                                          className="fas fa-sort-amount-up"
                                          style={{ cursor: "pointer" }}
                                          onClick={() =>
                                            handleChangeColumna_1(1)
                                          }
                                        ></i>
                                      ) : null}
                                      {col1_1 === 2 ? (
                                        <i
                                          className="fas fa-sort-amount-down-alt"
                                          style={{ cursor: "pointer" }}
                                          onClick={() =>
                                            handleChangeColumna_1(1)
                                          }
                                        ></i>
                                      ) : null}
                                    </th>
                                    <th style={{ textAlign: "left" }}>
                                      Denominación |{" "}
                                      {col1_2 === 0 ? (
                                        <i
                                          className="fas fa-arrows-alt-v"
                                          style={{ cursor: "pointer" }}
                                          onClick={() =>
                                            handleChangeColumna_1(2)
                                          }
                                        ></i>
                                      ) : null}
                                      {col1_2 === 1 ? (
                                        <i
                                          className="fas fa-sort-amount-up"
                                          style={{ cursor: "pointer" }}
                                          onClick={() =>
                                            handleChangeColumna_1(2)
                                          }
                                        ></i>
                                      ) : null}
                                      {col1_2 === 2 ? (
                                        <i
                                          className="fas fa-sort-amount-down-alt"
                                          style={{ cursor: "pointer" }}
                                          onClick={() =>
                                            handleChangeColumna_1(2)
                                          }
                                        ></i>
                                      ) : null}
                                    </th>
                                    <th style={{ textAlign: "right" }}>
                                      Cantidad |{" "}
                                      {col1_3 === 0 ? (
                                        <i
                                          className="fas fa-arrows-alt-v"
                                          style={{ cursor: "pointer" }}
                                          onClick={() =>
                                            handleChangeColumna_1(3)
                                          }
                                        ></i>
                                      ) : null}
                                      {col1_3 === 1 ? (
                                        <i
                                          className="fas fa-sort-amount-up"
                                          style={{ cursor: "pointer" }}
                                          onClick={() =>
                                            handleChangeColumna_1(3)
                                          }
                                        ></i>
                                      ) : null}
                                      {col1_3 === 2 ? (
                                        <i
                                          className="fas fa-sort-amount-down-alt"
                                          style={{ cursor: "pointer" }}
                                          onClick={() =>
                                            handleChangeColumna_1(3)
                                          }
                                        ></i>
                                      ) : null}
                                    </th>
                                    <th style={{ textAlign: "center" }}>
                                      UM |{" "}
                                      {col1_4 === 0 ? (
                                        <i
                                          className="fas fa-arrows-alt-v"
                                          style={{ cursor: "pointer" }}
                                          onClick={() =>
                                            handleChangeColumna_1(4)
                                          }
                                        ></i>
                                      ) : null}
                                      {col1_4 === 1 ? (
                                        <i
                                          className="fas fa-sort-amount-up"
                                          style={{ cursor: "pointer" }}
                                          onClick={() =>
                                            handleChangeColumna_1(4)
                                          }
                                        ></i>
                                      ) : null}
                                      {col1_4 === 2 ? (
                                        <i
                                          className="fas fa-sort-amount-down-alt"
                                          style={{ cursor: "pointer" }}
                                          onClick={() =>
                                            handleChangeColumna_1(4)
                                          }
                                        ></i>
                                      ) : null}
                                    </th>
                                    <th style={{ textAlign: "right" }}>
                                      Valor Neto |{" "}
                                      {col1_5 === 0 ? (
                                        <i
                                          className="fas fa-arrows-alt-v"
                                          style={{ cursor: "pointer" }}
                                          onClick={() =>
                                            handleChangeColumna_1(5)
                                          }
                                        ></i>
                                      ) : null}
                                      {col1_5 === 1 ? (
                                        <i
                                          className="fas fa-sort-amount-up"
                                          style={{ cursor: "pointer" }}
                                          onClick={() =>
                                            handleChangeColumna_1(5)
                                          }
                                        ></i>
                                      ) : null}
                                      {col1_5 === 2 ? (
                                        <i
                                          className="fas fa-sort-amount-down-alt"
                                          style={{ cursor: "pointer" }}
                                          onClick={() =>
                                            handleChangeColumna_1(5)
                                          }
                                        ></i>
                                      ) : null}
                                    </th>
                                    <th style={{ textAlign: "center" }}>
                                      Moneda |{" "}
                                      {col1_6 === 0 ? (
                                        <i
                                          className="fas fa-arrows-alt-v"
                                          style={{ cursor: "pointer" }}
                                          onClick={() =>
                                            handleChangeColumna_1(6)
                                          }
                                        ></i>
                                      ) : null}
                                      {col1_6 === 1 ? (
                                        <i
                                          className="fas fa-sort-amount-up"
                                          style={{ cursor: "pointer" }}
                                          onClick={() =>
                                            handleChangeColumna_1(6)
                                          }
                                        ></i>
                                      ) : null}
                                      {col1_6 === 2 ? (
                                        <i
                                          className="fas fa-sort-amount-down-alt"
                                          style={{ cursor: "pointer" }}
                                          onClick={() =>
                                            handleChangeColumna_1(6)
                                          }
                                        ></i>
                                      ) : null}
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {mostrar_filtro_fila_1 == true ? (
                                    <tr>
                                      <th>
                                        <button
                                          className="btn_search_filter"
                                          onClick={() =>
                                            buscar_filtro_icono_btn_1()
                                          }
                                        >
                                          <i className="fas fa-filter"></i>
                                        </button>
                                      </th>
                                      <th>
                                        <input
                                          type="text"
                                          onKeyUp={(e) =>
                                            buscar_filtro_enter_1(e)
                                          }
                                          name="f_vkorgField_1"
                                          maxLength="10"
                                          onChange={(e) =>
                                            handleChangeFiltro_1(
                                              e.target.name,
                                              e.target.value
                                            )
                                          }
                                        />
                                      </th>
                                      <th>
                                        <input
                                          type="text"
                                          onKeyUp={(e) =>
                                            buscar_filtro_enter_1(e)
                                          }
                                          name="f_matnrField_1"
                                          maxLength="10"
                                          onChange={(e) =>
                                            handleChangeFiltro_1(
                                              e.target.name,
                                              e.target.value
                                            )
                                          }
                                        />
                                      </th>
                                      <th>
                                        <input
                                          type="text"
                                          onKeyUp={(e) =>
                                            buscar_filtro_enter_1(e)
                                          }
                                          name="f_maktxField_1"
                                          maxLength="10"
                                          onChange={(e) =>
                                            handleChangeFiltro_1(
                                              e.target.name,
                                              e.target.value
                                            )
                                          }
                                        />
                                      </th>
                                      <th>
                                        <input
                                          type="text"
                                          onKeyUp={(e) =>
                                            buscar_filtro_enter_1(e)
                                          }
                                          name="f_kwmengField_1"
                                          maxLength="10"
                                          onChange={(e) =>
                                            handleChangeFiltro_1(
                                              e.target.name,
                                              e.target.value
                                            )
                                          }
                                        />
                                      </th>
                                      <th>
                                        <input
                                          type="text"
                                          onKeyUp={(e) =>
                                            buscar_filtro_enter_1(e)
                                          }
                                          name="f_vrkmeField_1"
                                          maxLength="10"
                                          onChange={(e) =>
                                            handleChangeFiltro_1(
                                              e.target.name,
                                              e.target.value
                                            )
                                          }
                                        />
                                      </th>
                                      <th>
                                        <input
                                          type="text"
                                          onKeyUp={(e) =>
                                            buscar_filtro_enter_1(e)
                                          }
                                          name="f_netwrField_1"
                                          maxLength="10"
                                          onChange={(e) =>
                                            handleChangeFiltro_1(
                                              e.target.name,
                                              e.target.value
                                            )
                                          }
                                        />
                                      </th>
                                      <th>
                                        <input
                                          type="text"
                                          onKeyUp={(e) =>
                                            buscar_filtro_enter_1(e)
                                          }
                                          name="f_waerkField_1"
                                          maxLength="10"
                                          onChange={(e) =>
                                            handleChangeFiltro_1(
                                              e.target.name,
                                              e.target.value
                                            )
                                          }
                                        />
                                      </th>
                                    </tr>
                                  ) : null}
                                  {response_pedidoanioant.itProductosAntField.map(
                                    (response, key) => (
                                      <tr key={key}>
                                        <th></th>
                                        <th style={{ textAlign: "center" }}>
                                          {response.vkorgField}
                                        </th>
                                        <th style={{ textAlign: "center" }}>
                                          {response.matnrField}
                                        </th>
                                        <th style={{ textAlign: "left" }}>
                                          {response.maktxField}
                                        </th>
                                        <th style={{ textAlign: "right" }}>
                                          {Math.round(response.kwmengField)}
                                        </th>
                                        <th style={{ textAlign: "center" }}>
                                          {response.vrkmeField}
                                        </th>
                                        <th style={{ textAlign: "right" }}>
                                          {convertDecimal(response.netwrField)}
                                        </th>
                                        <th style={{ textAlign: "center" }}>
                                          {response.waerkField}
                                        </th>
                                      </tr>
                                    )
                                  )}
                                </tbody>
                              </table>
                            </div>
                            {indicador_spinner_1 && <Spinner />}
                          </div>
                        </div>
                      </section>
                    </section>
                    <div
                      className="close-modal-button"
                      onClick={() => {
                        setshowmodal_1((prev) => !prev);
                        settext_btn_filtro_1("Filtrar");
                        setmostrar_filtro_fila_1(false);
                      }}
                    >
                      <i className="fas fa-times"></i>
                    </div>
                  </div>
                </div>
              </react.Fragment>
            ) : null}

            {showmodal_2 == true ? (
              <react.Fragment>
                <div
                  className="container-modal-background"
                  onClick={closeModal_2}
                  ref={modalRef_2}
                >
                  <div className="modal-wrapper modal-wrapper-bg">
                    <section className="row" style={{ paddingTop: "50px" }}>
                      <section>
                        <div style={{ margin: "10px" }} className="row">
                          <div className="subtitle-section">
                            Pedidos de este año (3 últimos meses)
                          </div>

                          <div className="col-sm-3 d-flex align-items-center">
                            <label>Desde</label>
                          </div>
                          <div className="col-sm-3">
                            <InputForm
                              attribute={{
                                name: "desde_infocliente_anio_act_fecha",
                                type: "date",
                                value: InputPAct.PActDesde,
                                disabled: false,
                                checked: false,
                                matchcode: false,
                              }}
                              handleChange={handleChange}
                            />
                          </div>

                          <div className="col-sm-3 d-flex align-items-center">
                            <label>Hasta</label>
                          </div>
                          <div className="col-sm-3">
                            <InputForm
                              attribute={{
                                name: "hasta_infocliente_anio_act_fecha",
                                type: "date",
                                value: InputPAct.PActHasta,
                                disabled: false,
                                checked: false,
                                matchcode: false,
                              }}
                              handleChange={handleChange}
                            />
                          </div>

                          {indicador_response_infocliente && (
                            <div
                              style={{ margin: "10px", alignSelf: "center" }}
                            >
                              <div className="col-md-6 p-1">
                                <BtnSearch
                                  attribute={{
                                    name: "Buscar",
                                    classNamebtn: "btn_search",
                                  }}
                                  onClick={() => {
                                    ClearAllColumns_2();
                                    clear_filtro_fila_2();
                                    SearchPedidoAnioAct("", "");
                                  }}
                                />
                              </div>

                              <div className="col-md-6 p-1">
                                {arraycheckbox_export_2[0].data.length > 0 ? (
                                  <ExcelFile
                                    filename="Informacion de Cliente"
                                    element={
                                      <BtnExportar
                                        attribute={{
                                          name: "Descargar Excel",
                                          classNamebtn: "btn_export",
                                          disabled: false,
                                        }}
                                      />
                                    }
                                  >
                                    <ExcelSheet
                                      dataSet={arraycheckbox_export_2}
                                      name="exportacion"
                                    />
                                  </ExcelFile>
                                ) : (
                                  <ExcelFile
                                    filename="Informacion de Cliente"
                                    element={
                                      <BtnExportar
                                        attribute={{
                                          name: "Descargar Excel",
                                          classNamebtn: "btn_export",
                                          disabled: false,
                                        }}
                                      />
                                    }
                                  >
                                    <ExcelSheet
                                      dataSet={DataSet_2}
                                      name="exportacion"
                                    />
                                  </ExcelFile>
                                )}
                              </div>
                              <div className="col-sm-12 col-md-12 m-1">
                                <BtnSearch
                                  attribute={{
                                    name: text_btn_filtro_2,
                                    classNamebtn: "btn_search",
                                  }}
                                  onClick={() => MostrarFiltro_2()}
                                />
                              </div>
                            </div>
                          )}

                          <div className="col-md-12">
                            <div className="title-section">
                              <label> Productos </label>
                              <hr />
                            </div>
                            <div className="container-table-200">
                              <table className="content-table">
                                <thead>
                                  <tr>
                                    <th></th>
                                    <th style={{ textAlign: "center" }}>
                                      Org. Ventas |{" "}
                                      {col2_7 === 0 ? (
                                        <i
                                          className="fas fa-arrows-alt-v"
                                          style={{ cursor: "pointer" }}
                                          onClick={() =>
                                            handleChangeColumna_2(7)
                                          }
                                        ></i>
                                      ) : null}
                                      {col2_7 === 1 ? (
                                        <i
                                          className="fas fa-sort-amount-up"
                                          style={{ cursor: "pointer" }}
                                          onClick={() =>
                                            handleChangeColumna_2(7)
                                          }
                                        ></i>
                                      ) : null}
                                      {col2_7 === 2 ? (
                                        <i
                                          className="fas fa-sort-amount-down-alt"
                                          style={{ cursor: "pointer" }}
                                          onClick={() =>
                                            handleChangeColumna_2(7)
                                          }
                                        ></i>
                                      ) : null}
                                    </th>
                                    <th style={{ height: "auto" }}>
                                      Material |{" "}
                                      {col2_1 === 0 ? (
                                        <i
                                          className="fas fa-arrows-alt-v"
                                          style={{ cursor: "pointer" }}
                                          onClick={() =>
                                            handleChangeColumna_2(1)
                                          }
                                        ></i>
                                      ) : null}
                                      {col2_1 === 1 ? (
                                        <i
                                          className="fas fa-sort-amount-up"
                                          style={{ cursor: "pointer" }}
                                          onClick={() =>
                                            handleChangeColumna_2(1)
                                          }
                                        ></i>
                                      ) : null}
                                      {col2_1 === 2 ? (
                                        <i
                                          className="fas fa-sort-amount-down-alt"
                                          style={{ cursor: "pointer" }}
                                          onClick={() =>
                                            handleChangeColumna_2(1)
                                          }
                                        ></i>
                                      ) : null}
                                    </th>
                                    <th style={{ textAlign: "left" }}>
                                      Denominación |{" "}
                                      {col2_2 === 0 ? (
                                        <i
                                          className="fas fa-arrows-alt-v"
                                          style={{ cursor: "pointer" }}
                                          onClick={() =>
                                            handleChangeColumna_2(2)
                                          }
                                        ></i>
                                      ) : null}
                                      {col2_2 === 1 ? (
                                        <i
                                          className="fas fa-sort-amount-up"
                                          style={{ cursor: "pointer" }}
                                          onClick={() =>
                                            handleChangeColumna_2(2)
                                          }
                                        ></i>
                                      ) : null}
                                      {col2_2 === 2 ? (
                                        <i
                                          className="fas fa-sort-amount-down-alt"
                                          style={{ cursor: "pointer" }}
                                          onClick={() =>
                                            handleChangeColumna_2(2)
                                          }
                                        ></i>
                                      ) : null}
                                    </th>
                                    <th style={{ textAlign: "right" }}>
                                      Cantidad |{" "}
                                      {col2_3 === 0 ? (
                                        <i
                                          className="fas fa-arrows-alt-v"
                                          style={{ cursor: "pointer" }}
                                          onClick={() =>
                                            handleChangeColumna_2(3)
                                          }
                                        ></i>
                                      ) : null}
                                      {col2_3 === 1 ? (
                                        <i
                                          className="fas fa-sort-amount-up"
                                          style={{ cursor: "pointer" }}
                                          onClick={() =>
                                            handleChangeColumna_2(3)
                                          }
                                        ></i>
                                      ) : null}
                                      {col2_3 === 2 ? (
                                        <i
                                          className="fas fa-sort-amount-down-alt"
                                          style={{ cursor: "pointer" }}
                                          onClick={() =>
                                            handleChangeColumna_2(3)
                                          }
                                        ></i>
                                      ) : null}
                                    </th>
                                    <th style={{ textAlign: "center" }}>
                                      UM |{" "}
                                      {col2_4 === 0 ? (
                                        <i
                                          className="fas fa-arrows-alt-v"
                                          style={{ cursor: "pointer" }}
                                          onClick={() =>
                                            handleChangeColumna_2(4)
                                          }
                                        ></i>
                                      ) : null}
                                      {col2_4 === 1 ? (
                                        <i
                                          className="fas fa-sort-amount-up"
                                          style={{ cursor: "pointer" }}
                                          onClick={() =>
                                            handleChangeColumna_2(4)
                                          }
                                        ></i>
                                      ) : null}
                                      {col2_4 === 2 ? (
                                        <i
                                          className="fas fa-sort-amount-down-alt"
                                          style={{ cursor: "pointer" }}
                                          onClick={() =>
                                            handleChangeColumna_2(4)
                                          }
                                        ></i>
                                      ) : null}
                                    </th>
                                    <th style={{ textAlign: "right" }}>
                                      Valor Neto |{" "}
                                      {col2_5 === 0 ? (
                                        <i
                                          className="fas fa-arrows-alt-v"
                                          style={{ cursor: "pointer" }}
                                          onClick={() =>
                                            handleChangeColumna_2(5)
                                          }
                                        ></i>
                                      ) : null}
                                      {col2_5 === 1 ? (
                                        <i
                                          className="fas fa-sort-amount-up"
                                          style={{ cursor: "pointer" }}
                                          onClick={() =>
                                            handleChangeColumna_2(5)
                                          }
                                        ></i>
                                      ) : null}
                                      {col2_5 === 2 ? (
                                        <i
                                          className="fas fa-sort-amount-down-alt"
                                          style={{ cursor: "pointer" }}
                                          onClick={() =>
                                            handleChangeColumna_2(5)
                                          }
                                        ></i>
                                      ) : null}
                                    </th>
                                    <th style={{ textAlign: "center" }}>
                                      Moneda |{" "}
                                      {col2_6 === 0 ? (
                                        <i
                                          className="fas fa-arrows-alt-v"
                                          style={{ cursor: "pointer" }}
                                          onClick={() =>
                                            handleChangeColumna_2(6)
                                          }
                                        ></i>
                                      ) : null}
                                      {col2_6 === 1 ? (
                                        <i
                                          className="fas fa-sort-amount-up"
                                          style={{ cursor: "pointer" }}
                                          onClick={() =>
                                            handleChangeColumna_2(6)
                                          }
                                        ></i>
                                      ) : null}
                                      {col2_6 === 2 ? (
                                        <i
                                          className="fas fa-sort-amount-down-alt"
                                          style={{ cursor: "pointer" }}
                                          onClick={() =>
                                            handleChangeColumna_2(6)
                                          }
                                        ></i>
                                      ) : null}
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {mostrar_filtro_fila_2 == true ? (
                                    <tr>
                                      <th>
                                        <button
                                          className="btn_search_filter"
                                          onClick={() =>
                                            buscar_filtro_icono_btn_2()
                                          }
                                        >
                                          <i className="fas fa-filter"></i>
                                        </button>
                                      </th>
                                      <th>
                                        <input
                                          type="text"
                                          onKeyUp={(e) =>
                                            buscar_filtro_enter_2(e)
                                          }
                                          name="f_vkorgField_2"
                                          maxLength="10"
                                          onChange={(e) =>
                                            handleChangeFiltro_2(
                                              e.target.name,
                                              e.target.value
                                            )
                                          }
                                        />
                                      </th>
                                      <th>
                                        <input
                                          type="text"
                                          onKeyUp={(e) =>
                                            buscar_filtro_enter_2(e)
                                          }
                                          name="f_matnrField_2"
                                          maxLength="10"
                                          onChange={(e) =>
                                            handleChangeFiltro_2(
                                              e.target.name,
                                              e.target.value
                                            )
                                          }
                                        />
                                      </th>
                                      <th>
                                        <input
                                          type="text"
                                          onKeyUp={(e) =>
                                            buscar_filtro_enter_2(e)
                                          }
                                          name="f_maktxField_2"
                                          maxLength="10"
                                          onChange={(e) =>
                                            handleChangeFiltro_2(
                                              e.target.name,
                                              e.target.value
                                            )
                                          }
                                        />
                                      </th>
                                      <th>
                                        <input
                                          type="text"
                                          onKeyUp={(e) =>
                                            buscar_filtro_enter_2(e)
                                          }
                                          name="f_kwmengField_2"
                                          maxLength="10"
                                          onChange={(e) =>
                                            handleChangeFiltro_2(
                                              e.target.name,
                                              e.target.value
                                            )
                                          }
                                        />
                                      </th>
                                      <th>
                                        <input
                                          type="text"
                                          onKeyUp={(e) =>
                                            buscar_filtro_enter_2(e)
                                          }
                                          name="f_vrkmeField_2"
                                          maxLength="10"
                                          onChange={(e) =>
                                            handleChangeFiltro_2(
                                              e.target.name,
                                              e.target.value
                                            )
                                          }
                                        />
                                      </th>
                                      <th>
                                        <input
                                          type="text"
                                          onKeyUp={(e) =>
                                            buscar_filtro_enter_2(e)
                                          }
                                          name="f_netwrField_2"
                                          maxLength="10"
                                          onChange={(e) =>
                                            handleChangeFiltro_2(
                                              e.target.name,
                                              e.target.value
                                            )
                                          }
                                        />
                                      </th>
                                      <th>
                                        <input
                                          type="text"
                                          onKeyUp={(e) =>
                                            buscar_filtro_enter_2(e)
                                          }
                                          name="f_waerkField_2"
                                          maxLength="10"
                                          onChange={(e) =>
                                            handleChangeFiltro_2(
                                              e.target.name,
                                              e.target.value
                                            )
                                          }
                                        />
                                      </th>
                                    </tr>
                                  ) : null}
                                  {response_pedidoanioact.itProductosActField.map(
                                    (response, key) => (
                                      <tr key={key}>
                                        <th>
                                          {/* <input
                                              type="checkbox"
                                              id={
                                                `checkbox-body-` + response.index
                                              }
                                              onChange={(e) => {
                                                console.log(response_pedidoanioact.itProductosActField);
                                                setresponse_pedidoanioact(
                                                  {itProductosActField:response_pedidoanioact.itProductosActField.map((d) => {
                                                    if (
                                                      d.index ==
                                                      response.index
                                                    ) {
                                                      d.select = e.target.checked;
                                                      if (e.target.checked == true) {
                                                        setarraycheckbox_2([
                                                          ...arraycheckbox_2,
                                                          { index: d.index },
                                                        ]);
                                                        ordenamiento_2(d);
                                                      } else if (
                                                        e.target.checked == false
                                                      ) {
                                                        for (
                                                          let i = 0;
                                                          i < arraycheckbox_2.length;
                                                          i++
                                                        ) {
                                                          if (
                                                            d.index ==
                                                            arraycheckbox_2[i].index
                                                          ) {
                                                            arraycheckbox_2.splice(i, 1);
                                                            arraycheckbox_export_2[0].data.splice(
                                                              i,
                                                              1
                                                            );
                                                          }
                                                        }
                                                      }
                                                    }
                                                    return d;
                                                  })
                                                  });
                                              }}
                                            /> */}
                                        </th>
                                        <th style={{ textAlign: "center" }}>
                                          {response.vkorgField}
                                        </th>
                                        <th style={{ textAlign: "center" }}>
                                          {response.matnrField}
                                        </th>
                                        <th style={{ textAlign: "left" }}>
                                          {response.maktxField}
                                        </th>
                                        <th style={{ textAlign: "right" }}>
                                          {Math.round(response.kwmengField)}
                                        </th>
                                        <th style={{ textAlign: "center" }}>
                                          {response.vrkmeField}
                                        </th>
                                        <th style={{ textAlign: "right" }}>
                                          {convertDecimal(response.netwrField)}
                                        </th>
                                        <th style={{ textAlign: "center" }}>
                                          {response.waerkField}
                                        </th>
                                      </tr>
                                    )
                                  )}
                                </tbody>
                              </table>
                            </div>
                            {indicador_spinner_2 && <Spinner />}
                          </div>
                        </div>
                      </section>
                    </section>
                    <div
                      className="close-modal-button"
                      onClick={() => {
                        setshowmodal_2((prev) => !prev);
                        settext_btn_filtro_2("Filtrar");
                        setmostrar_filtro_fila_2(false);
                      }}
                    >
                      <i className="fas fa-times"></i>
                    </div>
                  </div>
                </div>
              </react.Fragment>
            ) : null}
          </div>
          {/* ) : (
            <div className="access-route">NO TIENE ACCESO A ESTE REPORTE</div>
          )} */}
        </>
      )}
    </React.Fragment>
  );
};

export default Info_Cliente;
