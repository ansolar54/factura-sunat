import React, { useState, useEffect, useRef } from "react";
import ReactExport from "react-data-export";

import InputForm from "../../components/InputForm";
import BtnSearch from "../../components/BtnSearch";
import BtnExportar from "../../components/BtnExport";
import {
  ConsultaPedido,
  ExportarConsultaPedido,
} from "../../Services/ServiceConsultaPedido";
// import { ExportarConsPedido_DetalleCli } from '../../Services/ServiceCliente';
import { ValidarRuta } from "../../Services/ServiceValidaUsuario";

import Spinner from "../../components/Spinner";
import Pagination from "../../components/Pagination";
import VerPedido from "./VerPedido";

import Mc_Org_Ventas_desde from "./Matchcode_Organ_Ventas/Mc_Org_Ventas_desde";
import Mc_Org_Ventas_hasta from "./Matchcode_Organ_Ventas/Mc_Org_Ventas_hasta";
import Mc_Ofi_Ventas_desde from "./Matchcode_Ofi_Ventas/Mc_Ofi_Ventas_desde";
import Mc_Ofi_Ventas_hasta from "./Matchcode_Ofi_Ventas/Mc_Ofi_Ventas_hasta";
import Mc_Cliente_desde from "./Matchcode_Cliente/Mc_Cliente_desde";
import Mc_Cliente_hasta from "./Matchcode_Cliente/Mc_Cliente_hasta";
import Mc_Material_desde from "./Matchcode_Material_v2/Mc_Material_desde";
import Mc_Material_hasta from "./Matchcode_Material_v2/Mc_Material_hasta";
// import Mc_Material from "../Consulta_Stock/Matchcode_Material/Mc_Material";
import jwt from "jwt-decode";

import "./Consulta.css";

import BusquedaMult from "../../components/BusquedaMultiple/BusquedaMult";
import FiltroConsultaPedido from "./FiltroConsultaPedido";
import { ConsPedidoFiltro } from "../../Services/ServicePedidos";
import ChangeStatusPassword from "../../components/ChangeStatusPassword/ChangeStatusPassword";
import { getUser } from "../../Services/ServiceUser";
import {
  getOficinaVentasSAP,
  RegistrarAuditoria,
} from "../../Services/ServiceAuditoria";
import Mc_Cliente_desde_v2 from "./Matchcode_Cliente/Mc_Cliente_desde_v2";
import Mc_Cliente_hasta_v2 from "./Matchcode_Cliente/Mc_Cliente_hasta_v2";
import Mc_Comercial_desde from "./Matchcode_Comercial/Mc_Comercial_desde";
import Mc_Comercial_hasta from "./Matchcode_Comercial/Mc_Comercial_hasta";
import SelectFormMd from "../../components/SelectFormModal";
import toast, { Toaster } from "react-hot-toast";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

const Consulta = () => {
  //@MC

  const [showModalPagina, setshowModalPagina] = useState(false);

  const [ind_pagina, setind_pagina] = useState(1);
  // para mostrar fila de filtros
  const [mostrar_filtro_fila, setmostrar_filtro_fila] = useState(false);
  const [text_btn_filtro, settext_btn_filtro] = useState("Filtrar");

  const [f_vbelnField, setf_vbelnField] = useState("");
  const [f_vkorgField, setf_vkorgField] = useState("");
  const [f_erdatField, setf_erdatField] = useState("");
  const [f_kunnrField, setf_kunnrField] = useState("");
  const [f_name1Field, setf_name1Field] = useState("");
  const [f_netwrField, setf_netwrField] = useState("");
  const [f_waerkField, setf_waerkField] = useState("");
  const [f_text1Field, setf_text1Field] = useState("");
  const [f_statusField, setf_statusField] = useState("");
  const [f_bezeiField, setf_bezeiField] = useState("");

  const [col_1, setcol_1] = useState(0);
  const [col_2, setcol_2] = useState(0);
  const [col_3, setcol_3] = useState(0);
  const [col_4, setcol_4] = useState(0);
  const [col_5, setcol_5] = useState(0);
  const [col_6, setcol_6] = useState(0);
  const [col_7, setcol_7] = useState(0);
  const [col_8, setcol_8] = useState(0);
  const [col_9, setcol_9] = useState(0);
  const [col_10, setcol_10] = useState(0);

  const [IsCampo, setIsCampo] = useState("");
  const [IsOrden, setIsOrden] = useState("");

  //para el cambio de contraseña
  const [show_status_password, setshow_status_password] = useState(false);
  // para el paginado
  const [datosxpagina, setDatosxpagina] = useState(10); // para el input
  const [IsRegxpag, setIsRegxpag] = useState(10); // cantidad de datos por página
  const [pageNumber, setpageNumber] = useState(1);
  const [showFiltroConsultaPedido, setshowFiltroConsultaPedido] =
    useState(false);
  const [indicadorfiltro, setindicadorfiltro] = useState(false);
  const [model_filtro, setmodel_filtro] = useState({});
  const [model_conspedido, setmodel_conspedido] = useState();
  const [type_input, settype_input] = useState("text");
  // usestate de rangos
  const [rangos, setrangos] = useState([
    { Sign: "I", Option: "EQ", Low: "", High: "" },
  ]);
  const [ind_rang, setind_rang] = useState({ num: 1, bool: false });
  //MODAL para rango (busqueda multiple)
  const [showBusMult, setshowBusMult] = useState(false);
  //para check de cabecera
  const [stateChecboxHeader, setstateChecboxHeader] = useState(false);
  //--------------------------------------------------------------------------------------------------------------------------------
  // rangos documento comercial
  const [rangos_doccomercial, setrangos_doccomercial] = useState([
    { Sign: "I", Option: "EQ", Low: "", High: "" },
  ]);

  // rangos organizacion ventas
  const [rangos_org_ventas, setrangos_org_ventas] = useState([
    { Sign: "I", Option: "EQ", Low: "", High: "" },
  ]);

  // rangos oficina ventas
  const [rangos_ofi_ventas, setrangos_ofi_ventas] = useState([
    { Sign: "I", Option: "EQ", Low: "", High: "" },
  ]);

  // rangos cliente
  const [rangos_cliente, setrangos_cliente] = useState([
    { Sign: "I", Option: "EQ", Low: "", High: "" },
  ]);

  // rangos creado el
  const [rangos_creado_el, setrangos_creado_el] = useState([
    { Sign: "I", Option: "EQ", Low: "", High: "" },
  ]);

  // rangos creado por
  const [rangos_creado_por, setrangos_creado_por] = useState([
    { Sign: "I", Option: "EQ", Low: "", High: "" },
  ]);

  // rangos comercial
  const [rangos_comercial, setrangos_comercial] = useState([
    { Sign: "I", Option: "EQ", Low: "", High: "" },
  ]);

  // rangos material
  const [rangos_material, setrangos_material] = useState([
    { Sign: "I", Option: "EQ", Low: "", High: "" },
  ]);

  //----------------------------------------------------------------------------------------------------------------------------------
  //INPUT Documento comercial
  const [docu_comercial, setdocu_comercial] = useState([
    { Sign: "I", Option: "EQ", Low: "", High: "" },
  ]);
  const [docu_comercial_desde, setdocu_comercial_desde] = useState("");
  const [docu_comercial_hasta, setdocu_comercial_hasta] = useState("");
  //INPUT Organización ventas
  const [org_ventas, setorg_ventas] = useState([
    { Sign: "I", Option: "EQ", Low: "", High: "" },
  ]);
  const [org_ventas_desde, setorg_ventas_desde] = useState("");
  const [org_ventas_hasta, setorg_ventas_hasta] = useState("");
  //INPUT Oficina de ventas
  const [ofi_ventas, setofi_ventas] = useState([
    { Sign: "I", Option: "EQ", Low: "", High: "" },
  ]);
  const [ofi_ventas_desde, setofi_ventas_desde] = useState("");
  const [ofi_ventas_hasta, setofi_ventas_hasta] = useState("");
  //INPUT Cliente
  const [cliente, setcliente] = useState([
    { Sign: "I", Option: "EQ", Low: "", High: "" },
  ]);
  const [cliente_desde, setcliente_desde] = useState("");
  const [cliente_hasta, setcliente_hasta] = useState("");
  //INPUT Creado el
  const [creado_el, setcreado_el] = useState([
    { Sign: "I", Option: "EQ", Low: "", High: "" },
  ]);
  const [creado_el_desde, setcreado_el_desde] = useState("");
  const [creado_el_hasta, setcreado_el_hasta] = useState("");
  //INPUT Creado por
  const [creado_por, setcreado_por] = useState([
    { Sign: "I", Option: "EQ", Low: "", High: "" },
  ]);
  const [creado_por_desde, setcreado_por_desde] = useState("");
  const [creado_por_hasta, setcreado_por_hasta] = useState("");
  //INPUT Material
  const [material, setmaterial] = useState([
    { Sign: "I", Option: "EQ", Low: "", High: "" },
  ]);
  const [material_desde, setmaterial_desde] = useState("");
  const [material_hasta, setmaterial_hasta] = useState("");
  //INPUT Comercial
  const [comercial, setcomercial] = useState([
    { Sign: "I", Option: "EQ", Low: "", High: "" },
  ]);
  const [comercial_desde, setcomercial_desde] = useState("");
  const [comercial_hasta, setcomercial_hasta] = useState("");
  const [comercial_desde_value, setcomercial_desde_value] = useState("");
  const [comercial_hasta_value, setcomercial_hasta_value] = useState("");

  const [BuscaMaterial, setBuscaMaterial] = useState([
    { Sign: "", Option: "", Low: "", High: "" },
  ]);
  //RESPONSE CONSULTA PEDIDO
  const [response_consulta_pedido, setresponse_consulta_pedido] = useState([]);
  //CARGA DE SPINNER
  const [spinner, setspinner] = useState(false);
  //CARGA DE SPINNER DE ACCESO DE RUTA
  const [spinnerroute, setspinnerroute] = useState(false);
  //NUMERO TOTAL DE DATOS
  const [TotalData, setTotalData] = useState();
  //ACTIVAR SECCION DE PAGINADO
  const [valuepagination, setvaluepagination] = useState(false);
  //ACTIVAR MODAL DE VER PEDIDO
  const [showverpedido, setshowVerPedido] = useState(false);
  //VALOR PARA ENVIAR AL MODAL DE VER PEDIDO
  const [PVbeln, setPVbeln] = useState();

  //ACTIVAR MODAL MATCHCODE ORGANIZACIÓN DE VENTAS
  const [showorgventa_desde, setshoworgventa_desde] = useState(false);
  const [showorgventa_hasta, setshoworgventa_hasta] = useState(false);
  //ACTIVAR MODAL MATCHCODE OFICINA DE VENTAS
  const [showofiventa_desde, setshowofiventa_desde] = useState(false);
  const [showofiventa_hasta, setshowofiventa_hasta] = useState(false);
  //ACTIVAR MODAL MATCHCODE CLIENTE
  const [showcliente_desde, setshowcliente_desde] = useState(false);
  const [showcliente_hasta, setshowcliente_hasta] = useState(false);
  //ACTIVAR MODAL MATCHCODE MATERIAL
  const [showmaterial_desde, setshowmaterial_desde] = useState(false);
  const [showmaterial_hasta, setshowmaterial_hasta] = useState(false);
  //ACTIVAR MODAL MATCHCODE COMERCIAL
  const [showcomercial_desde, setshowcomercial_desde] = useState(false);
  const [showcomercial_hasta, setshowcomercial_hasta] = useState(false);

  const modalRef = useRef();

  const [ItemsNumberDates, setItemsNumberDates] = useState([
    { id: 10, name: 10 },
    { id: 20, name: 20 },
    { id: 50, name: 50 },
    { id: 100, name: 100 },
  ]);

  //PARA ACCESO A RUTA
  const [accesoruta, setaccesoruta] = useState(false);
  //INDICADOR SI YA VALIDO RUTA
  const [indicadorruta, setindicadorruta] = useState(false);
  //ALMACENA CHECKBOX MARCADOS INDIVIDUALMENTE PARA COMPARARLOS POR PAGINA BUSCADA Y MARCARLOS CON CHECK
  const [arraycheckbox, setarraycheckbox] = useState([]);
  const [arraycheckbox_export, setarraycheckbox_export] = useState([
    {
      columns: [
        {
          title: "N° Pedido",
          style: { font: { sz: "18", bold: true } },
          width: { wpx: 125 },
        },
        {
          title: "Clase Pedido",
          style: { font: { sz: "18", bold: true } },
          width: { wpx: 125 },
        },
        {
          title: "OrgVt",
          style: { font: { sz: "18", bold: true } },
          width: { wpx: 125 },
        },
        {
          title: "Creado el",
          style: { font: { sz: "18", bold: true } },
          width: { wpx: 125 },
        },
        {
          title: "Cliente",
          style: { font: { sz: "18", bold: true } },
          width: { wpx: 125 },
        },
        {
          title: "Razón Social",
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
          title: "Condición de Pago",
          style: { font: { sz: "18", bold: true } },
          width: { wpx: 125 },
        },
        {
          title: "Est. Operac.",
          style: { font: { sz: "18", bold: true } },
          width: { wpx: 125 },
        },
        {
          title: "Motivo",
          style: { font: { sz: "18", bold: true } },
          width: { wpx: 125 },
        },
      ],
      data: [],
    },
  ]);

  //PARA ALMACENAR LOS DATOS A EXPORTAR
  const [DataSet, setDataSet] = useState([{ columns: [], data: [] }]);

  useEffect(() => {
    //valida para el nuevo cambio de contraseña
    getUser(jwt(localStorage.getItem("_token")).nameid).then((result) => {
      if (result.data[0].status_password === "1") {
        setshow_status_password(true);
      } else {
        setshow_status_password(false);
      }
    });
    //valida acceso a ruta
    // if (indicadorruta == false) {
    //   setspinnerroute(true);
    //   ValidarRuta("01").then((result) => {
    //     if (result.reporte == 1) {
    //       setspinnerroute(false);
    //       setaccesoruta(true);
    //       setindicadorruta(true);
    //       // Search(1, 0,"","");
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
          id_event: 1,
          sales_ofi: ofi_ventas,
          indicator: "WEB",
        });
      }
    });
  }, []);

  //useeffect modal rangos documento comercial
  useEffect(() => {
    // ind_rang.num
    // 1: documento comercial
    // 2: oficina de ventas
    // 3: creado el
    // 4: material
    // 5: organizacion ventas
    // 6: cliente
    // 7: comercial
    switch (ind_rang.num) {
      case 1:
        setrangos_doccomercial(rangos);
        RangosDocuComercial();
        break;
      case 2:
        setrangos_ofi_ventas(rangos);
        RangosOficinaVentas();
        break;
      case 3:
        setrangos_creado_el(rangos);
        RangosCreadoEl();
        break;
      case 4:
        setrangos_material(rangos);
        RangosMaterial();
        break;
      case 5:
        setrangos_org_ventas(rangos);
        RangosOrganizacionVentas();
        break;
      case 6:
        setrangos_cliente(rangos);
        RangosCliente();
        break;
      case 7:
        setrangos_comercial(rangos);
        RangosComercial();
        break;
      default:
        break;
    }
  }, [ind_rang]);

  function clearColumnsIcon(num_col) {
    switch (num_col) {
      case 1:
        setcol_2(0);
        setcol_3(0);
        setcol_4(0);
        setcol_5(0);
        setcol_6(0);
        setcol_7(0);
        setcol_8(0);
        setcol_9(0);
        setcol_10(0);
        break;
      case 2:
        setcol_1(0);
        setcol_3(0);
        setcol_4(0);
        setcol_5(0);
        setcol_6(0);
        setcol_7(0);
        setcol_8(0);
        setcol_9(0);
        setcol_10(0);
        break;
      case 3:
        setcol_1(0);
        setcol_2(0);
        setcol_4(0);
        setcol_5(0);
        setcol_6(0);
        setcol_7(0);
        setcol_8(0);
        setcol_9(0);
        setcol_10(0);
        break;
      case 4:
        setcol_1(0);
        setcol_2(0);
        setcol_3(0);
        setcol_5(0);
        setcol_6(0);
        setcol_7(0);
        setcol_8(0);
        setcol_9(0);
        setcol_10(0);
        break;
      case 5:
        setcol_1(0);
        setcol_2(0);
        setcol_3(0);
        setcol_4(0);
        setcol_6(0);
        setcol_7(0);
        setcol_8(0);
        setcol_9(0);
        setcol_10(0);
        break;
      case 6:
        setcol_1(0);
        setcol_2(0);
        setcol_3(0);
        setcol_4(0);
        setcol_5(0);
        setcol_7(0);
        setcol_8(0);
        setcol_9(0);
        setcol_10(0);
        break;
      case 7:
        setcol_1(0);
        setcol_2(0);
        setcol_3(0);
        setcol_4(0);
        setcol_5(0);
        setcol_6(0);
        setcol_8(0);
        setcol_9(0);
        setcol_10(0);
        break;
      case 8:
        setcol_1(0);
        setcol_2(0);
        setcol_3(0);
        setcol_4(0);
        setcol_5(0);
        setcol_6(0);
        setcol_7(0);
        setcol_9(0);
        setcol_10(0);
        break;
      case 9:
        setcol_1(0);
        setcol_2(0);
        setcol_3(0);
        setcol_4(0);
        setcol_5(0);
        setcol_6(0);
        setcol_7(0);
        setcol_8(0);
        setcol_10(0);
        break;
      case 10:
        setcol_1(0);
        setcol_2(0);
        setcol_3(0);
        setcol_4(0);
        setcol_5(0);
        setcol_6(0);
        setcol_7(0);
        setcol_8(0);
        setcol_9(0);
        break;
      default:
        break;
    }
  }

  function handleChangeColumna(num_col) {
    // 9 columnas
    switch (num_col) {
      // 1: ascendente
      // 0: descendente
      case 1:
        clearColumnsIcon(1);
        if (col_1 === 0) {
          setcol_1(col_1 + 1);
          setIsCampo("VBELN");
          setIsOrden("0");
          if (indicadorfiltro == true) {
            buscar_filtro_fila(1, "VBELN", "0");
          } else {
            Search(1, 0, "VBELN", "0");
          }
        } else if (col_1 === 1) {
          setcol_1(col_1 + 1);
          setIsCampo("VBELN");
          setIsOrden("1");
          if (indicadorfiltro == true) {
            buscar_filtro_fila(1, "VBELN", "1");
          } else {
            Search(1, 0, "VBELN", "1");
          }
        } else {
          setcol_1(0);
          // Search(1, 0, "", "");
          setIsCampo("");
          setIsOrden("");
          if (indicadorfiltro == true) {
            buscar_filtro_fila(1, "", "");
          } else {
            Search(1, 0, "", "");
          }
        }
        break;
      case 2:
        clearColumnsIcon(2);
        if (col_2 === 0) {
          setcol_2(col_2 + 1);
          // Search(1, 0, "VKORG", "0");
          setIsCampo("VKORG");
          setIsOrden("0");
          if (indicadorfiltro == true) {
            buscar_filtro_fila(1, "VKORG", "0");
          } else {
            Search(1, 0, "VKORG", "0");
          }
        } else if (col_2 === 1) {
          setcol_2(col_2 + 1);
          // Search(1, 0, "VKORG", "1");
          setIsCampo("VKORG");
          setIsOrden("1");
          if (indicadorfiltro == true) {
            buscar_filtro_fila(1, "VKORG", "1");
          } else {
            Search(1, 0, "VKORG", "1");
          }
        } else {
          setcol_2(0);
          // Search(1, 0, "", "");
          setIsCampo("");
          setIsOrden("");
          if (indicadorfiltro == true) {
            buscar_filtro_fila(1, "", "");
          } else {
            Search(1, 0, "", "");
          }
        }
        break;
      case 3:
        clearColumnsIcon(3);
        if (col_3 === 0) {
          setcol_3(col_3 + 1);
          // Search(1, 0, "ERDAT", "0");
          setIsCampo("ERDAT");
          setIsOrden("0");
          if (indicadorfiltro == true) {
            buscar_filtro_fila(1, "ERDAT", "1");
          } else {
            Search(1, 0, "ERDAT", "0");
          }
        } else if (col_3 === 1) {
          setcol_3(col_3 + 1);
          // Search(1, 0, "ERDAT", "1");
          setIsCampo("ERDAT");
          setIsOrden("1");
          if (indicadorfiltro == true) {
            buscar_filtro_fila(1, "ERDAT", "1");
          } else {
            Search(1, 0, "ERDAT", "1");
          }
        } else {
          setcol_3(0);
          // Search(1, 0, "", "");
          setIsCampo("");
          setIsOrden("");
          if (indicadorfiltro == true) {
            buscar_filtro_fila(1, "", "");
          } else {
            Search(1, 0, "", "");
          }
        }
        break;
      case 4:
        clearColumnsIcon(4);
        if (col_4 === 0) {
          setcol_4(col_4 + 1);
          // Search(1, 0, "KUNNR", "0");
          setIsCampo("KUNNR");
          setIsOrden("0");
          if (indicadorfiltro == true) {
            buscar_filtro_fila(1, "KUNNR", "0");
          } else {
            Search(1, 0, "KUNNR", "0");
          }
        } else if (col_4 === 1) {
          setcol_4(col_4 + 1);
          // Search(1, 0, "KUNNR", "1");
          setIsCampo("KUNNR");
          setIsOrden("1");
          if (indicadorfiltro == true) {
            buscar_filtro_fila(1, "KUNNR", "1");
          } else {
            Search(1, 0, "KUNNR", "1");
          }
        } else {
          setcol_4(0);
          // Search(1, 0, "", "");
          setIsCampo("");
          setIsOrden("");
          if (indicadorfiltro == true) {
            buscar_filtro_fila(1, "", "");
          } else {
            Search(1, 0, "", "");
          }
        }
        break;
      case 5:
        clearColumnsIcon(5);
        if (col_5 === 0) {
          setcol_5(col_5 + 1);
          // Search(1, 0, "NAME1", "0");
          setIsCampo("NAME1");
          setIsOrden("0");
          if (indicadorfiltro == true) {
            buscar_filtro_fila(1, "NAME1", "0");
          } else {
            Search(1, 0, "NAME1", "0");
          }
        } else if (col_5 === 1) {
          setcol_5(col_5 + 1);
          // Search(1, 0, "NAME1", "1");
          setIsCampo("NAME1");
          setIsOrden("1");
          if (indicadorfiltro == true) {
            buscar_filtro_fila(1, "NAME1", "1");
          } else {
            Search(1, 0, "NAME1", "1");
          }
        } else {
          setcol_5(0);
          // Search(1, 0, "", "");
          setIsCampo("");
          setIsOrden("");
          if (indicadorfiltro == true) {
            buscar_filtro_fila(1, "", "");
          } else {
            Search(1, 0, "", "");
          }
        }
        break;
      case 6:
        clearColumnsIcon(6);
        if (col_6 === 0) {
          setcol_6(col_6 + 1);
          // Search(1, 0, "NETWR", "0");
          setIsCampo("NETWR");
          setIsOrden("0");
          if (indicadorfiltro == true) {
            buscar_filtro_fila(1, "NETWR", "0");
          } else {
            Search(1, 0, "NETWR", "0");
          }
        } else if (col_6 === 1) {
          setcol_6(col_6 + 1);
          // Search(1, 0, "NETWR", "1");
          setIsCampo("NETWR");
          setIsOrden("1");
          if (indicadorfiltro == true) {
            buscar_filtro_fila(1, "NETWR", "1");
          } else {
            Search(1, 0, "NETWR", "1");
          }
        } else {
          setcol_6(0);
          // Search(1, 0, "", "");
          setIsCampo("");
          setIsOrden("");
          if (indicadorfiltro == true) {
            buscar_filtro_fila(1, "", "");
          } else {
            Search(1, 0, "", "");
          }
        }
        break;
      case 7:
        clearColumnsIcon(7);
        if (col_7 === 0) {
          setcol_7(col_7 + 1);
          // Search(1, 0, "WAERK", "0");
          setIsCampo("WAERK");
          setIsOrden("0");
          if (indicadorfiltro == true) {
            buscar_filtro_fila(1, "WAERK", "0");
          } else {
            Search(1, 0, "WAERK", "0");
          }
        } else if (col_7 === 1) {
          setcol_7(col_7 + 1);
          // Search(1, 0, "WAERK", "1");
          setIsCampo("WAERK");
          setIsOrden("1");
          if (indicadorfiltro == true) {
            buscar_filtro_fila(1, "WAERK", "1");
          } else {
            Search(1, 0, "WAERK", "1");
          }
        } else {
          setcol_7(0);
          // Search(1, 0, "", "");
          setIsCampo("");
          setIsOrden("");
          if (indicadorfiltro == true) {
            buscar_filtro_fila(1, "", "");
          } else {
            Search(1, 0, "", "");
          }
        }
        break;
      case 8:
        clearColumnsIcon(8);
        if (col_8 === 0) {
          setcol_8(col_8 + 1);
          // Search(1, 0, "TEXT1", "0");
          setIsCampo("TEXT1");
          setIsOrden("0");
          if (indicadorfiltro == true) {
            buscar_filtro_fila(1, "TEXT1", "0");
          } else {
            Search(1, 0, "TEXT1", "0");
          }
        } else if (col_8 === 1) {
          setcol_8(col_8 + 1);
          // Search(1, 0, "TEXT1", "1");
          setIsCampo("TEXT1");
          setIsOrden("1");
          if (indicadorfiltro == true) {
            buscar_filtro_fila(1, "TEXT1", "1");
          } else {
            Search(1, 0, "TEXT1", "1");
          }
        } else {
          setcol_8(0);
          // Search(1, 0, "", "");
          setIsCampo("");
          setIsOrden("");
          if (indicadorfiltro == true) {
            buscar_filtro_fila(1, "", "");
          } else {
            Search(1, 0, "", "");
          }
        }
        break;
      case 9:
        clearColumnsIcon(9);
        if (col_9 === 0) {
          setcol_9(col_9 + 1);
          // Search(1, 0, "STATUS", "0");
          setIsCampo("STATUS");
          setIsOrden("0");
          if (indicadorfiltro == true) {
            buscar_filtro_fila(1, "STATUS", "0");
          } else {
            Search(1, 0, "STATUS", "0");
          }
        } else if (col_9 === 1) {
          setcol_9(col_9 + 1);
          // Search(1, 0, "STATUS", "1");
          setIsCampo("STATUS");
          setIsOrden("1");
          if (indicadorfiltro == true) {
            buscar_filtro_fila(1, "STATUS", "1");
          } else {
            Search(1, 0, "STATUS", "1");
          }
        } else {
          setcol_9(0);
          // Search(1, 0, "", "");
          setIsCampo("");
          setIsOrden("");
          if (indicadorfiltro == true) {
            buscar_filtro_fila(1, "", "");
          } else {
            Search(1, 0, "", "");
          }
        }
        break;
      case 10:
        clearColumnsIcon(10);
        if (col_10 === 0) {
          setcol_10(col_10 + 1);
          // Search(1, 0, "STATUS", "0");
          setIsCampo("BEZEI");
          setIsOrden("0");
          if (indicadorfiltro == true) {
            buscar_filtro_fila(1, "BEZEI", "0");
          } else {
            Search(1, 0, "BEZEI", "0");
          }
        } else if (col_10 === 1) {
          setcol_10(col_10 + 1);
          // Search(1, 0, "STATUS", "1");
          setIsCampo("BEZEI");
          setIsOrden("1");
          if (indicadorfiltro == true) {
            buscar_filtro_fila(1, "BEZEI", "1");
          } else {
            Search(1, 0, "BEZEI", "1");
          }
        } else {
          setcol_10(0);
          // Search(1, 0, "", "");
          setIsCampo("");
          setIsOrden("");
          if (indicadorfiltro == true) {
            buscar_filtro_fila(1, "", "");
          } else {
            Search(1, 0, "", "");
          }
        }
        break;
      default:
        break;
    }
  }

  //para el filtro
  function handleChangeFiltro(name, value) {
    switch (name) {
      case "f_vbelnField":
        setf_vbelnField(value);
        break;
      case "f_vkorgField":
        setf_vkorgField(value);
        break;
      case "f_erdatField":
        setf_erdatField(value);
        break;
      case "f_kunnrField":
        setf_kunnrField(value);
        break;
      case "f_name1Field":
        setf_name1Field(value);
        break;
      case "f_netwrField":
        setf_netwrField(value);
        break;
      case "f_waerkField":
        setf_waerkField(value);
        break;
      case "f_text1Field":
        setf_text1Field(value);
        break;
      case "f_statusField":
        setf_statusField(value);
        break;
      case "f_bezeiField":
        setf_bezeiField(value);
        break;
      default:
        break;
    }
  }

  function ModalFiltro() {
    clear_filtro_fila();
    if (mostrar_filtro_fila == true) {
      settext_btn_filtro("Filtrar");
      setmostrar_filtro_fila(false);
    } else {
      settext_btn_filtro("Borrar filtros");
      setmostrar_filtro_fila(true);
    }
    setindicadorfiltro(true);
    // setshowFiltroConsultaPedido(true);
  }

  // Funcion Rangos Documento Comercial
  function RangosDocuComercial() {
    if (rangos_doccomercial.length === 1) {
      if (
        rangos_doccomercial[0].Low.trim() === "" &&
        rangos_doccomercial[0].High.trim() === ""
      ) {
        return docu_comercial;
      } else {
        setdocu_comercial_desde(rangos_doccomercial[0].Low);
        setdocu_comercial_hasta(rangos_doccomercial[0].High);
        return rangos_doccomercial;
      }
    } else {
      setdocu_comercial_desde(rangos_doccomercial[0].Low);
      setdocu_comercial_hasta(rangos_doccomercial[0].High);
      return rangos_doccomercial;
    }
  }

  // Funcion Rangos organizacion ventas
  function RangosOrganizacionVentas() {
    if (rangos_org_ventas.length === 1) {
      if (
        rangos_org_ventas[0].Low.trim() === "" &&
        rangos_org_ventas[0].High.trim() === ""
      ) {
        return org_ventas;
      } else {
        setorg_ventas_desde(rangos_org_ventas[0].Low);
        setorg_ventas_hasta(rangos_org_ventas[0].High);
        return rangos_org_ventas;
      }
    } else {
      setorg_ventas_desde(rangos_org_ventas[0].Low);
      setorg_ventas_hasta(rangos_org_ventas[0].High);
      return rangos_org_ventas;
    }
  }

  // Funcion Rangos oficina de ventas
  function RangosOficinaVentas() {
    if (rangos_ofi_ventas.length === 1) {
      if (
        rangos_ofi_ventas[0].Low.trim() === "" &&
        rangos_ofi_ventas[0].High.trim() === ""
      ) {
        return ofi_ventas;
      } else {
        setofi_ventas_desde(rangos_ofi_ventas[0].Low);
        setofi_ventas_hasta(rangos_ofi_ventas[0].High);
        return rangos_ofi_ventas;
      }
    } else {
      setofi_ventas_desde(rangos_ofi_ventas[0].Low);
      setofi_ventas_hasta(rangos_ofi_ventas[0].High);
      return rangos_ofi_ventas;
    }
  }

  // Funcion Rangos cliente
  function RangosCliente() {
    console.log("rangos cliente");
    if (rangos_cliente.length === 1) {
      if (
        rangos_cliente[0].Low.trim() === "" &&
        rangos_cliente[0].High.trim() === ""
      ) {
        return cliente;
      } else {
        setcliente_desde(rangos_cliente[0].Low);
        setcliente_hasta(rangos_cliente[0].High);
        return rangos_cliente;
      }
    } else {
      setcliente_desde(rangos_cliente[0].Low);
      setcliente_hasta(rangos_cliente[0].High);
      return rangos_cliente;
    }
  }

  // Funcion Rangos Creado El
  function RangosCreadoEl() {
    if (rangos_creado_el.length === 1) {
      if (
        rangos_creado_el[0].Low.trim() === "" &&
        rangos_creado_el[0].High.trim() === ""
      ) {
        return creado_el;
      } else {
        // setcreado_el_desde(rangos_creado_el[0].Low);
        // setcreado_el_hasta(rangos_creado_el[0].High);
        if (rangos_creado_el[0].Low.length === 10) {
          setcreado_el_desde(rangos_creado_el[0].Low);
          setcreado_el_hasta(rangos_creado_el[0].High);
        }
        if (rangos_creado_el[0].Low.length === 10) {
          rangos_creado_el[0].Low = formatDateSAP(rangos_creado_el[0].Low);
          rangos_creado_el[0].High = formatDateSAP(rangos_creado_el[0].High);
        } else {
          rangos_creado_el[0].Low = rangos_creado_el[0].Low;
          rangos_creado_el[0].High = rangos_creado_el[0].High;
        }

        return rangos_creado_el;
      }
    } else {
      if (rangos_creado_el[0].Low.length === 10) {
        setcreado_el_desde(rangos_creado_el[0].Low);
        setcreado_el_hasta(rangos_creado_el[0].High);
      }

      for (let i = 0; i < rangos_creado_el.length; i++) {
        if (i !== 0) {
          if (rangos_creado_el[i].Low.length === 10) {
            rangos_creado_el[i].Low = formatDateSAP(rangos_creado_el[i].Low);
            rangos_creado_el[i].High = formatDateSAP(rangos_creado_el[i].High);
          }
        } else {
          rangos_creado_el[i].Low = rangos_creado_el[i].Low;
          rangos_creado_el[i].High = rangos_creado_el[i].High;
        }

        if (rangos_creado_el.length - 1 === i) {
          return rangos_creado_el;
        }
      }
    }
  }

  // Funcion Creado Por
  function RangosCreadoPor() {
    if (rangos_creado_por.length === 1) {
      if (
        rangos_creado_por[0].Low.trim() === "" &&
        rangos_creado_por[0].High.trim() === ""
      ) {
        return creado_por;
      } else {
        setcreado_por_desde(rangos_creado_por[0].Low);
        setcreado_por_hasta(rangos_creado_por[0].High);
        return rangos_creado_por;
      }
    } else {
      setcreado_por_desde(rangos_creado_por[0].Low);
      setcreado_por_hasta(rangos_creado_por[0].High);
      return rangos_creado_por;
    }
  }

  // Funcion Comercial
  function RangosComercial() {
    if (rangos_comercial.length === 1) {
      if (
        rangos_comercial[0].Low.trim() === "" &&
        rangos_comercial[0].High.trim() === ""
      ) {
        return comercial;
      } else {
        setcomercial_desde(rangos_comercial[0].Low);
        setcomercial_hasta(rangos_comercial[0].High);
        return rangos_comercial;
      }
    } else {
      setcomercial_desde(rangos_comercial[0].Low);
      setcomercial_hasta(rangos_comercial[0].High);
      return rangos_comercial;
    }
  }

  // Funcion Material
  function RangosMaterial() {
    if (rangos_material.length === 1) {
      if (
        rangos_material[0].Low.trim() === "" &&
        rangos_material[0].High.trim() === ""
      ) {
        return material;
      } else {
        setmaterial_desde(rangos_material[0].Low);
        setmaterial_hasta(rangos_material[0].High);
        return rangos_material;
      }
    } else {
      setmaterial_desde(rangos_material[0].Low);
      setmaterial_hasta(rangos_material[0].High);
      return rangos_material;
    }
  }

  function clear_icons_colum() {
    setcol_1(0);
    setcol_2(0);
    setcol_3(0);
    setcol_4(0);
    setcol_5(0);
    setcol_6(0);
    setcol_7(0);
    setcol_8(0);
    setcol_9(0);
  }

  //BUSQUEDAA DE POPUP NUMERO DE DATOS
  async function Search_02(page, ind, IsCampo, IsOrden, numdatos) {
    setTotalData(0);
    if (page == 1) {
      setind_pagina(1);
    } else {
      setind_pagina(0);
    }
    if (IsCampo === "" && IsOrden === "") {
      clear_icons_colum();
    }
    settext_btn_filtro("Filtrar");
    setmostrar_filtro_fila(false);
    setspinner(true);
    setindicadorfiltro(false);
    let model_consulta_pedido = {
      IsCampo: IsCampo,
      IsOrden: IsOrden,
      IsNpag: page,
      IsRegxpag: numdatos,
      IsExport: "",
      IsUser: jwt(localStorage.getItem("_token")).username,
      ItErdat: RangosCreadoEl(),
      ItErnam: RangosCreadoPor(),
      ItKunnr: RangosCliente(),
      ItPernr: RangosComercial(),
      ItMatnr: RangosMaterial(),
      ItVbeln: RangosDocuComercial(),
      ItVkbur: RangosOficinaVentas(),
      ItVkorg: RangosOrganizacionVentas(),
    };
    setmodel_conspedido(model_consulta_pedido);
    if (ind == 0) {
      Exportar();
      // setarraycheckbox([]);
      arraycheckbox_export[0].data = [];
      // console.log(model_consulta_pedido);
      setresponse_consulta_pedido([]);
      ConsultaPedido(model_consulta_pedido).then((result) => {
        // document.getElementById("checkbox-consultapedido-head").disabled=false;
        setresponse_consulta_pedido(
          result.itConsultaPedidosField.map((d) => {
            return {
              select: false,
              bezeiField: d.bezeiField,
              bstdkField: d.bstdkField,
              erdatField: d.erdatField,
              kunnrField: d.kunnrField,
              motivoField: d.motivoField,
              name1Field: d.name1Field,
              netwrField: d.netwrField,
              statusField: d.statusField,
              text1Field: d.text1Field,
              vbelnField: d.vbelnField,
              vkorgField: d.vkorgField,
              waerkField: d.waerkField,
              ztermField: d.ztermField,
            };
          })
        );

        setTotalData(result.esRegtotField);
        setspinner(false);
        setvaluepagination(true);
      });
    } else {
      ConsultaPedido(model_consulta_pedido).then((result) => {
        // document.getElementById("checkbox-consultapedido-head").disabled=false;

        if (stateChecboxHeader === true) {
          setresponse_consulta_pedido(
            result.itConsultaPedidosField.map((d) => {
              return {
                select: true,
                bezeiField: d.bezeiField,
                bstdkField: d.bstdkField,
                erdatField: d.erdatField,
                kunnrField: d.kunnrField,
                motivoField: d.motivoField,
                name1Field: d.name1Field,
                netwrField: d.netwrField,
                statusField: d.statusField,
                text1Field: d.text1Field,
                vbelnField: d.vbelnField,
                vkorgField: d.vkorgField,
                waerkField: d.waerkField,
                ztermField: d.ztermField,
              };
            })
          );

          for (let i = 0; i < result.itConsultaPedidosField.length; i++) {
            document.getElementById(
              "checkbox-body-" + result.itConsultaPedidosField[i].vbelnField
            ).checked = true;
          }
        } else {
          setresponse_consulta_pedido(
            result.itConsultaPedidosField.map((d) => {
              return {
                select: false,
                bstdkField: d.bstdkField,
                bezeiField: d.bezeiField,
                erdatField: d.erdatField,
                kunnrField: d.kunnrField,
                motivoField: d.motivoField,
                name1Field: d.name1Field,
                netwrField: d.netwrField,
                statusField: d.statusField,
                text1Field: d.text1Field,
                vbelnField: d.vbelnField,
                vkorgField: d.vkorgField,
                waerkField: d.waerkField,
                ztermField: d.ztermField,
              };
            })
          );

          for (let i = 0; i < result.itConsultaPedidosField.length; i++) {
            document.getElementById(
              "checkbox-body-" + result.itConsultaPedidosField[i].vbelnField
            ).checked = false;
          }
        }

        for (let y = 0; y < result.itConsultaPedidosField.length; y++) {
          if (arraycheckbox.length > 0) {
            for (let i = 0; i < arraycheckbox.length; i++) {
              if (
                result.itConsultaPedidosField[y].vbelnField ==
                arraycheckbox[i].vbelnField
              ) {
                document.getElementById(
                  "checkbox-body-" + result.itConsultaPedidosField[y].vbelnField
                ).checked = true;
              }
            }
          }
        }

        setTotalData(result.esRegtotField);
        setspinner(false);
        setvaluepagination(true);
      });
    }
  }

  //BÚSQUEDA
  async function Search(page, ind, IsCampo, IsOrden) {
    setTotalData(0);
    if (page == 1) {
      setind_pagina(1);
    } else {
      setind_pagina(0);
    }
    if (IsCampo === "" && IsOrden === "") {
      clear_icons_colum();
    }
    settext_btn_filtro("Filtrar");
    setmostrar_filtro_fila(false);
    setspinner(true);
    setindicadorfiltro(false);
    let model_consulta_pedido = {
      IsCampo: IsCampo,
      IsOrden: IsOrden,
      IsNpag: page,
      IsRegxpag: IsRegxpag,
      IsExport: "",
      IsUser: jwt(localStorage.getItem("_token")).username,
      ItErdat: RangosCreadoEl(),
      ItErnam: RangosCreadoPor(),
      ItKunnr: RangosCliente(),
      ItPernr: RangosComercial(),
      ItMatnr: RangosMaterial(),
      ItVbeln: RangosDocuComercial(),
      ItVkbur: RangosOficinaVentas(),
      ItVkorg: RangosOrganizacionVentas(),
    };
    setmodel_conspedido(model_consulta_pedido);
    if (ind == 0) {
      Exportar();
      // setarraycheckbox([]);
      arraycheckbox_export[0].data = [];
      // console.log(model_consulta_pedido);
      setresponse_consulta_pedido([]);
      ConsultaPedido(model_consulta_pedido).then((result) => {
        // document.getElementById("checkbox-consultapedido-head").disabled=false;
        setresponse_consulta_pedido(
          result.itConsultaPedidosField.map((d) => {
            return {
              select: false,
              bezeiField: d.bezeiField,
              bstdkField: d.bstdkField,
              erdatField: d.erdatField,
              kunnrField: d.kunnrField,
              motivoField: d.motivoField,
              name1Field: d.name1Field,
              netwrField: d.netwrField,
              statusField: d.statusField,
              text1Field: d.text1Field,
              vbelnField: d.vbelnField,
              vkorgField: d.vkorgField,
              waerkField: d.waerkField,
              ztermField: d.ztermField,
            };
          })
        );

        setTotalData(result.esRegtotField);
        setspinner(false);
        setvaluepagination(true);
      });
    } else {
      ConsultaPedido(model_consulta_pedido).then((result) => {
        // document.getElementById("checkbox-consultapedido-head").disabled=false;

        if (stateChecboxHeader === true) {
          setresponse_consulta_pedido(
            result.itConsultaPedidosField.map((d) => {
              return {
                select: true,
                bezeiField: d.bezeiField,
                bstdkField: d.bstdkField,
                erdatField: d.erdatField,
                kunnrField: d.kunnrField,
                motivoField: d.motivoField,
                name1Field: d.name1Field,
                netwrField: d.netwrField,
                statusField: d.statusField,
                text1Field: d.text1Field,
                vbelnField: d.vbelnField,
                vkorgField: d.vkorgField,
                waerkField: d.waerkField,
                ztermField: d.ztermField,
              };
            })
          );

          for (let i = 0; i < result.itConsultaPedidosField.length; i++) {
            document.getElementById(
              "checkbox-body-" + result.itConsultaPedidosField[i].vbelnField
            ).checked = true;
          }
        } else {
          setresponse_consulta_pedido(
            result.itConsultaPedidosField.map((d) => {
              return {
                select: false,
                bezeiField: d.bezeiField,
                bstdkField: d.bstdkField,
                erdatField: d.erdatField,
                kunnrField: d.kunnrField,
                motivoField: d.motivoField,
                name1Field: d.name1Field,
                netwrField: d.netwrField,
                statusField: d.statusField,
                text1Field: d.text1Field,
                vbelnField: d.vbelnField,
                vkorgField: d.vkorgField,
                waerkField: d.waerkField,
                ztermField: d.ztermField,
              };
            })
          );

          for (let i = 0; i < result.itConsultaPedidosField.length; i++) {
            document.getElementById(
              "checkbox-body-" + result.itConsultaPedidosField[i].vbelnField
            ).checked = false;
          }
        }

        for (let y = 0; y < result.itConsultaPedidosField.length; y++) {
          if (arraycheckbox.length > 0) {
            for (let i = 0; i < arraycheckbox.length; i++) {
              if (
                result.itConsultaPedidosField[y].vbelnField ==
                arraycheckbox[i].vbelnField
              ) {
                document.getElementById(
                  "checkbox-body-" + result.itConsultaPedidosField[y].vbelnField
                ).checked = true;
              }
            }
          }
        }

        setTotalData(result.esRegtotField);
        setspinner(false);
        setvaluepagination(true);
      });
    }
  }

  //EXPORTAR A EXCEL
  function Exportar() {
    //setDataSet([{columns:[], data:[]}]);
    // let detallecli = {
    //     ItVbeln:[]};

    // if(arraycheckbox_export[0].data.length > 0){
    //     console.log(arraycheckbox_export[0].data)
    //     arraycheckbox.forEach(element => {
    //         detallecli.ItVbeln = [...detallecli.ItVbeln,{Sign:"I",Option:"EQ",Low:element.vbelnField, High:""}]
    //     });

    //     for (let index = 0; index < detallecli.ItVbeln.length; index++) {
    //         if(detallecli.ItVbeln.length - 1 == index){

    //             ExportarConsPedido_DetalleCli(detallecli).then((result)=>{

    //             });
    //         }
    //     }

    // }else{
    let model_consulta_pedido = {
      IsCampo: IsCampo,
      IsOrden: IsOrden,
      IsNpag: "",
      IsRegxpag: "",
      IsExport: "X",
      IsUser: jwt(localStorage.getItem("_token")).username,
      ItErdat: RangosCreadoEl(),
      ItErnam: RangosCreadoPor(),
      ItKunnr: RangosCliente(),
      ItPernr: RangosComercial(),
      ItMatnr: RangosMaterial(),
      ItVbeln: RangosDocuComercial(),
      ItVkbur: RangosOficinaVentas(),
      ItVkorg: RangosOrganizacionVentas(),
    };

    if (
      creado_el[0].Low.trim() != "" ||
      creado_por[0].Low.trim() != "" ||
      cliente[0].Low.trim() != "" ||
      material[0].Low.trim() != "" ||
      docu_comercial[0].Low.trim() != "" ||
      ofi_ventas[0].Low.trim() != "" ||
      org_ventas[0].Low.trim() != ""
    ) {
      ExportarConsultaPedido(model_consulta_pedido)
        .then((result) => {
          setDataSet([
            {
              columns: [
                {
                  title: "N° Pedido",
                  style: { font: { sz: "18", bold: true } },
                  width: { wpx: 125 },
                },
                {
                  title: "Clase Pedido",
                  style: { font: { sz: "18", bold: true } },
                  width: { wpx: 125 },
                },
                {
                  title: "OrgVt",
                  style: { font: { sz: "18", bold: true } },
                  width: { wpx: 125 },
                },
                {
                  title: "Creado el",
                  style: { font: { sz: "18", bold: true } },
                  width: { wpx: 125 },
                },
                {
                  title: "Cliente",
                  style: { font: { sz: "18", bold: true } },
                  width: { wpx: 125 },
                },
                {
                  title: "Razón Social",
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
                  title: "Condición de Pago",
                  style: { font: { sz: "18", bold: true } },
                  width: { wpx: 125 },
                },
                {
                  title: "Est. Operac.",
                  style: { font: { sz: "18", bold: true } },
                  width: { wpx: 125 },
                },
                {
                  title: "Motivo",
                  style: { font: { sz: "18", bold: true } },
                  width: { wpx: 125 },
                },
              ],
              data: result.itConsultaPedidosField.map((data) => {
                return [
                  { value: data.vbelnField, style: { font: { sz: "14" } } },
                  { value: data.bezeiField, style: { font: { sz: "14" } } },
                  { value: data.vkorgField, style: { font: { sz: "14" } } },
                  {
                    value: formatDate(data.erdatField),
                    style: { font: { sz: "14" } },
                  },
                  { value: data.kunnrField, style: { font: { sz: "14" } } },
                  { value: data.name1Field, style: { font: { sz: "14" } } },
                  {
                    value: convertDecimal(data.netwrField, 2),
                    style: { font: { sz: "14" } },
                  },
                  { value: data.waerkField, style: { font: { sz: "14" } } },
                  { value: data.text1Field, style: { font: { sz: "14" } } },
                  { value: data.statusField, style: { font: { sz: "14" } } },
                  { value: data.motivoField, style: { font: { sz: "14" } } },
                ];
              }),
            },
          ]);
        })
        .catch((error) => {
          console.log(error);
        });
      // }
    }
  }

  //INPUT organización de ventas
  function mc_org_ventas_desde() {
    setshoworgventa_desde((prev) => !prev);
  }
  function mc_org_ventas_hasta() {
    setshoworgventa_hasta((prev) => !prev);
  }
  //INPUT oficina de ventas
  function mc_ofi_ventas_desde() {
    setshowofiventa_desde((prev) => !prev);
  }
  function mc_ofi_ventas_hasta() {
    setshowofiventa_hasta((prev) => !prev);
  }
  //INPUT cliente
  function mc_cliente_desde() {
    setshowcliente_desde((prev) => !prev);
  }
  function mc_cliente_hasta() {
    setshowcliente_hasta((prev) => !prev);
  }
  //INPUT material
  function mc_material_desde() {
    setshowmaterial_desde((prev) => !prev);
  }
  function mc_material_hasta() {
    setshowmaterial_hasta((prev) => !prev);
  }
  //INPUT comercial
  function mc_comercial_desde() {
    setshowcomercial_desde((prev) => !prev);
  }
  function mc_comercial_hasta() {
    setshowcomercial_hasta((prev) => !prev);
  }

  function handleChange(name, value) {
    switch (name) {
      //documento comercial
      case "id_role":
        setIsRegxpag(value);
        Search_02(1, 0, "", "", value);
        setshowModalPagina((prev) => !prev);
        break;
      case "num_datos_pagina":
        setDatosxpagina(value);
        break;
      case "docu_comercial":
        setdocu_comercial([{ Sign: "I", Option: "EQ", Low: "", High: "" }]);
        break;
      case "docu_comercial_desde":
        setdocu_comercial_desde(value);
        if (value.trim() != "") {
          if (docu_comercial_hasta == "") {
            setdocu_comercial([
              { Sign: "I", Option: "EQ", Low: value, High: "" },
            ]);
          } else {
            setdocu_comercial([
              {
                Sign: "I",
                Option: "BT",
                Low: value,
                High: docu_comercial_hasta,
              },
            ]);
          }
        } else {
          if (docu_comercial_hasta != "") {
            setdocu_comercial([
              { Sign: "I", Option: "EQ", Low: "", High: docu_comercial_hasta },
            ]);
          } else {
            setdocu_comercial([{ Sign: "", Option: "", Low: "", High: "" }]);
          }
        }
        break;
      case "docu_comercial_hasta":
        setdocu_comercial_hasta(value);
        if (value.trim() != "") {
          if (docu_comercial_desde == "") {
            setdocu_comercial([
              { Sign: "I", Option: "EQ", Low: "", High: value },
            ]);
          } else {
            setdocu_comercial([
              {
                Sign: "I",
                Option: "BT",
                Low: docu_comercial_desde,
                High: value,
              },
            ]);
          }
        } else {
          if (docu_comercial_desde != "") {
            setdocu_comercial([
              { Sign: "I", Option: "EQ", Low: docu_comercial_desde, High: "" },
            ]);
          } else {
            setdocu_comercial([{ Sign: "", Option: "", Low: "", High: "" }]);
          }
        }
        break;
      //organizacion de ventas
      case "org_ventas":
        setorg_ventas([{ Sign: "I", Option: "EQ", Low: "", High: "" }]);
        break;
      case "org_ventas_desde":
        setorg_ventas_desde(value);
        if (value.trim() != "") {
          setorg_ventas_desde(value);
          if (org_ventas_hasta == "") {
            setorg_ventas([
              {
                Sign: "I",
                Option: "EQ",
                Low: value,
                High: "",
              },
            ]);
          } else {
            setorg_ventas([
              {
                Sign: "I",
                Option: "BT",
                Low: value,
                High: org_ventas_hasta,
              },
            ]);
          }
        } else {
          setorg_ventas_desde(value);
          if (org_ventas_hasta != "") {
            setorg_ventas([
              { Sign: "I", Option: "EQ", Low: "", High: org_ventas_hasta },
            ]);
          } else {
            setorg_ventas([{ Sign: "", Option: "", Low: "", High: "" }]);
          }
        }
        break;
      case "org_ventas_hasta":
        setorg_ventas_hasta(value);
        if (value.trim() != "") {
          if (org_ventas_desde == "") {
            setorg_ventas([
              {
                Sign: "I",
                Option: "EQ",
                Low: "",
                High: value,
              },
            ]);
          } else {
            setorg_ventas([
              {
                Sign: "I",
                Option: "BT",
                Low: org_ventas_desde,
                High: value,
              },
            ]);
          }
        } else {
          if (org_ventas_desde != "") {
            setorg_ventas([
              { Sign: "I", Option: "EQ", Low: org_ventas_desde, High: "" },
            ]);
          } else {
            setorg_ventas([{ Sign: "", Option: "", Low: "", High: "" }]);
          }
        }

        break;
      //oficina de ventas
      case "ofi_ventas":
        setofi_ventas([{ Sign: "I", Option: "EQ", Low: "", High: "" }]);
        break;
      case "ofi_ventas_desde":
        setofi_ventas_desde(value);
        if (value.trim() != "") {
          if (ofi_ventas_hasta == "") {
            setofi_ventas([{ Sign: "I", Option: "EQ", Low: value, High: "" }]);
          } else {
            setofi_ventas([
              {
                Sign: "I",
                Option: "BT",
                Low: value,
                High: ofi_ventas_hasta,
              },
            ]);
          }
        } else {
          if (ofi_ventas_hasta != "") {
            setofi_ventas([
              { Sign: "I", Option: "EQ", Low: "", High: ofi_ventas_hasta },
            ]);
          } else {
            setofi_ventas([{ Sign: "", Option: "", Low: "", High: "" }]);
          }
        }
        break;
      case "ofi_ventas_hasta":
        setofi_ventas_hasta(value);
        if (value.trim() != "") {
          if (ofi_ventas_desde == "") {
            setofi_ventas([{ Sign: "I", Option: "EQ", Low: "", High: value }]);
          } else {
            setofi_ventas([
              {
                Sign: "I",
                Option: "BT",
                Low: ofi_ventas_desde,
                High: value,
              },
            ]);
          }
        } else {
          if (ofi_ventas_desde != "") {
            setofi_ventas([
              { Sign: "I", Option: "EQ", Low: ofi_ventas_desde, High: "" },
            ]);
          } else {
            setofi_ventas([{ Sign: "", Option: "", Low: "", High: "" }]);
          }
        }
        break;
      //cliente
      case "cliente":
        setcliente([{ Sign: "I", Option: "EQ", Low: "", High: "" }]);
        break;
      case "cliente_desde":
        setcliente_desde(value);
        if (value.trim() != "") {
          if (cliente_hasta == "") {
            setcliente([{ Sign: "I", Option: "EQ", Low: value, High: "" }]);
          } else {
            setcliente([
              {
                Sign: "I",
                Option: "BT",
                Low: value,
                High: cliente_hasta,
              },
            ]);
          }
        } else {
          if (cliente_hasta != "") {
            setcliente([
              { Sign: "I", Option: "EQ", Low: "", High: cliente_hasta },
            ]);
          } else {
            setcliente([{ Sign: "", Option: "", Low: "", High: "" }]);
          }
        }
        break;
      case "cliente_hasta":
        setcliente_hasta(value);
        if (value.trim() != "") {
          if (cliente_desde == "") {
            setcliente([{ Sign: "I", Option: "EQ", Low: "", High: value }]);
          } else {
            setcliente([
              {
                Sign: "I",
                Option: "BT",
                Low: cliente_desde,
                High: value,
              },
            ]);
          }
        } else {
          if (cliente_desde != "") {
            setcliente([
              { Sign: "I", Option: "EQ", Low: cliente_desde, High: "" },
            ]);
          } else {
            setcliente([{ Sign: "", Option: "", Low: "", High: "" }]);
          }
        }
        break;
      //creado el
      case "creado_el":
        setcreado_el([{ Sign: "I", Option: "EQ", Low: "", High: "" }]);
        break;
      case "creado_el_desde":
        setcreado_el_desde(value);
        if (value.trim() != "") {
          if (creado_el_hasta == "") {
            setcreado_el([
              {
                Sign: "I",
                Option: "EQ",
                Low: formatDateSAP(value),
                High: "",
              },
            ]);
          } else {
            setcreado_el([
              {
                Sign: "I",
                Option: "BT",
                Low: formatDateSAP(value),
                High: formatDateSAP(creado_el_hasta),
              },
            ]);
          }
        } else {
          if (creado_el_hasta != "") {
            setcreado_el([
              {
                Sign: "I",
                Option: "EQ",
                Low: "",
                High: formatDateSAP(creado_el_hasta),
              },
            ]);
          } else {
            setcreado_el([{ Sign: "", Option: "", Low: "", High: "" }]);
          }
        }
        break;
      case "creado_el_hasta":
        setcreado_el_hasta(value);
        if (value.trim() != "") {
          if (creado_el_desde == "") {
            setcreado_el([
              {
                Sign: "I",
                Option: "EQ",
                Low: "",
                High: formatDateSAP(value),
              },
            ]);
          } else {
            setcreado_el([
              {
                Sign: "I",
                Option: "BT",
                Low: formatDateSAP(creado_el_desde),
                High: formatDateSAP(value),
              },
            ]);
          }
        } else {
          if (creado_el_desde != "") {
            setcreado_el([
              {
                Sign: "I",
                Option: "EQ",
                Low: formatDateSAP(creado_el_desde),
                High: "",
              },
            ]);
          } else {
            setcreado_el([{ Sign: "", Option: "", Low: "", High: "" }]);
          }
        }
        break;
      //creado por
      case "creado_por":
        setcreado_por([{ Sign: "I", Option: "EQ", Low: "", High: "" }]);
        break;
      case "creado_por_desde":
        setcreado_por_desde(value);
        if (value.trim() != "") {
          if (creado_por_hasta == "") {
            setcreado_por([{ Sign: "I", Option: "EQ", Low: value, High: "" }]);
          } else {
            setcreado_por([
              {
                Sign: "I",
                Option: "BT",
                Low: value,
                High: creado_por_hasta,
              },
            ]);
          }
        } else {
          if (creado_por_hasta != "") {
            setcreado_por([
              { Sign: "I", Option: "EQ", Low: "", High: creado_por_hasta },
            ]);
          } else {
            setcreado_por([{ Sign: "", Option: "", Low: "", High: "" }]);
          }
        }
        break;
      case "creado_por_hasta":
        setcreado_por_hasta(value);
        if (value.trim() != "") {
          if (creado_por_desde == "") {
            setcreado_por([{ Sign: "I", Option: "EQ", Low: "", High: value }]);
          } else {
            setcreado_por([
              {
                Sign: "I",
                Option: "BT",
                Low: creado_por_desde,
                High: value,
              },
            ]);
          }
        } else {
          if (creado_por_desde != "") {
            setcreado_por([
              { Sign: "I", Option: "EQ", Low: creado_por_desde, High: "" },
            ]);
          } else {
            setcreado_por([{ Sign: "", Option: "", Low: "", High: "" }]);
          }
        }
        break;
      //material
      case "material":
        setmaterial([{ Sign: "I", Option: "EQ", Low: "", High: "" }]);
        break;
      case "material_desde":
        setmaterial_desde(value);
        if (value.trim() != "") {
          if (material_hasta == "") {
            setmaterial([{ Sign: "I", Option: "EQ", Low: value, High: "" }]);
          } else {
            setmaterial([
              {
                Sign: "I",
                Option: "BT",
                Low: value,
                High: material_hasta,
              },
            ]);
          }
        } else {
          if (material_hasta != "") {
            setmaterial([
              { Sign: "I", Option: "EQ", Low: "", High: material_hasta },
            ]);
          } else {
            setmaterial([{ Sign: "", Option: "", Low: "", High: "" }]);
          }
        }
        break;
      case "material_hasta":
        setmaterial_hasta(value);
        if (value.trim() != "") {
          if (material_desde == "") {
            setmaterial([{ Sign: "I", Option: "EQ", Low: "", High: value }]);
          } else {
            setmaterial([
              {
                Sign: "I",
                Option: "BT",
                Low: material_desde,
                High: value,
              },
            ]);
          }
        } else {
          if (material_desde != "") {
            setmaterial([
              { Sign: "I", Option: "EQ", Low: material_desde, High: "" },
            ]);
          } else {
            setmaterial([{ Sign: "", Option: "", Low: "", High: "" }]);
          }
        }
        break;
      //comercial
      case "comercial":
        setcomercial([{ Sign: "I", Option: "EQ", Low: "", High: "" }]);
        break;
      case "comercial_desde":
        setcomercial_desde(value);
        if (value.trim() != "") {
          if (comercial_hasta == "") {
            setcomercial([{ Sign: "I", Option: "EQ", Low: value, High: "" }]);
          } else {
            setcomercial([
              {
                Sign: "I",
                Option: "BT",
                Low: value,
                High: comercial_hasta,
              },
            ]);
          }
        } else {
          if (comercial_hasta != "") {
            setcomercial([
              { Sign: "I", Option: "EQ", Low: "", High: comercial_hasta },
            ]);
          } else {
            setcomercial([{ Sign: "", Option: "", Low: "", High: "" }]);
          }
        }
        break;
      case "comercial_hasta":
        setcomercial_hasta(value);
        if (value.trim() != "") {
          if (comercial_desde == "") {
            setcomercial([{ Sign: "I", Option: "EQ", Low: "", High: value }]);
          } else {
            setcomercial([
              {
                Sign: "I",
                Option: "BT",
                Low: comercial_desde,
                High: value,
              },
            ]);
          }
        } else {
          if (comercial_desde != "") {
            setcomercial([
              { Sign: "I", Option: "EQ", Low: comercial_desde, High: "" },
            ]);
          } else {
            setmaterial([{ Sign: "", Option: "", Low: "", High: "" }]);
          }
        }
        break;
      default:
        break;
    }
  }

  //formateo de la fecha para visualizar
  function formatDate(value) {
    var datePart = value.match(/\d+/g),
      year = datePart[0],
      month = datePart[1],
      day = datePart[2];

    return day + "-" + month + "-" + year;
  }
  //formateo de la fecha para enviar a SAP YYYYMMDD
  function formatDateSAP(value) {
    var datePart = value.match(/\d+/g),
      year = datePart[0],
      month = datePart[1],
      day = datePart[2];

    return year + "" + month + "" + day;
  }

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

  // seleccionar pagina
  function changePage(pageNumber) {
    setresponse_consulta_pedido([]);
    if (indicadorfiltro == false) {
      Search(pageNumber, 1, IsCampo, IsOrden);
    } else {
      setpageNumber(pageNumber);
      buscar_filtro_fila(pageNumber, IsCampo, IsOrden);
      // SearchFiltro();
    }
  }
  // siguiente pagina
  function prevPage(value) {
    setresponse_consulta_pedido([]);

    if (indicadorfiltro == false) {
      Search(value - 1, 1, IsCampo, IsOrden);
    } else {
      setmodel_filtro({ ...model_filtro, IsNpag: value - 1 });
      // SearchFiltro();
      buscar_filtro_fila(value - 1, IsCampo, IsOrden);
    }
  }
  //pagina anterior
  function nextPage(value) {
    setresponse_consulta_pedido([]);

    if (indicadorfiltro == false) {
      Search(value + 1, 1, IsCampo, IsOrden);
    } else {
      setmodel_filtro({ ...model_filtro, IsNpag: value + 1 });
      // SearchFiltro();
      buscar_filtro_fila(value + 1, IsCampo, IsOrden);
    }
  }
  //ver detalle de pedido
  function verPedido(value) {
    setPVbeln(value);
    setshowVerPedido((prev) => !prev);
  }

  const ChangeBusquedaMult_DocComercial = () => {
    setrangos(rangos_doccomercial);
    settype_input("text");
    setind_rang({ num: 1, bool: true });
    setshowBusMult(true);
  };

  const ChangeBusquedaMult_OrganizacionVentas = () => {
    setrangos(rangos_org_ventas);
    settype_input("text");
    setind_rang({ num: 5, bool: true });
    setshowBusMult(true);
  };

  const ChangeBusquedaMult_OficinaVentas = () => {
    setrangos(rangos_ofi_ventas);
    settype_input("text");
    setind_rang({ num: 2, bool: true });
    setshowBusMult(true);
  };

  const ChangeBusquedaMult_Cliente = () => {
    setrangos(rangos_cliente);
    settype_input("text");
    setind_rang({ num: 6, bool: true });
    setshowBusMult(true);
  };

  const ChangeBusquedaMult_CreadoEl = () => {
    setrangos(rangos_creado_el);
    settype_input("date");
    setind_rang({ num: 3, bool: true });
    setshowBusMult(true);
  };

  const ChangeBusquedaMult_CreadoPor = () => {
    setrangos(rangos_creado_por);
    settype_input("text");
    setind_rang({ num: 7, bool: true });
    setshowBusMult(true);
  };

  const ChangeBusquedaMult_Material = () => {
    setrangos(rangos_material);
    settype_input("text");
    setind_rang({ num: 4, bool: true });
    setshowBusMult(true);
  };

  const ChangeBusquedaMult_Comercial = () => {
    setrangos(rangos_comercial);
    settype_input("text");
    setind_rang({ num: 7, bool: true });
    setshowBusMult(true);
  };

  // function SearchFiltro() {
  //   setspinner(true);
  //   ConsPedidoFiltro(model_filtro).then((result) => {
  //     setspinner(false);

  //     setresponse_consulta_pedido(
  //       result.itConsultaPedidosField.map((d) => {
  //         return {
  //           select: false,
  //           bstdkField: d.bstdkField,
  //           erdatField: d.erdatField,
  //           kunnrField: d.kunnrField,
  //           motivoField: d.motivoField,
  //           name1Field: d.name1Field,
  //           netwrField: d.netwrField,
  //           statusField: d.statusField,
  //           text1Field: d.text1Field,
  //           vbelnField: d.vbelnField,
  //           vkorgField: d.vkorgField,
  //           waerkField: d.waerkField,
  //           ztermField: d.ztermField,
  //         };
  //       })
  //     );
  //     setTotalData(result.esRegtotField);
  //   });
  // }

  //Limpiar Campos
  function Clear() {
    setmostrar_filtro_fila(false);
    setrangos_ofi_ventas([{ Sign: "I", Option: "EQ", Low: "", High: "" }]);
    setrangos_cliente([{ Sign: "I", Option: "EQ", Low: "", High: "" }]);
    setrangos_comercial([{ Sign: "I", Option: "EQ", Low: "", High: "" }]);
    setrangos_creado_el([{ Sign: "I", Option: "EQ", Low: "", High: "" }]);
    setrangos_creado_por([{ Sign: "I", Option: "EQ", Low: "", High: "" }]);
    setrangos_doccomercial([{ Sign: "I", Option: "EQ", Low: "", High: "" }]);
    setrangos_material([{ Sign: "I", Option: "EQ", Low: "", High: "" }]);
    setrangos_org_ventas([{ Sign: "I", Option: "EQ", Low: "", High: "" }]);

    setvaluepagination(false);
    setresponse_consulta_pedido([]);
    handleChange("docu_comercial", "");
    setdocu_comercial_desde("");
    setdocu_comercial_hasta("");

    handleChange("ofi_ventas", "");
    setofi_ventas_desde("");
    setofi_ventas_hasta("");

    handleChange("creado_el", "");
    setcreado_el_desde("");
    setcreado_el_hasta("");

    handleChange("material", "");
    setmaterial_desde("");
    setmaterial_hasta("");

    handleChange("org_ventas", "");
    setorg_ventas_desde("");
    setorg_ventas_hasta("");

    handleChange("cliente", "");
    setcliente_desde("");
    setcliente_hasta("");

    handleChange("comercial", "");
    setcomercial_desde("");
    setcomercial_hasta("");

    setcomercial_desde_value("");
    setcomercial_hasta_value("");
  }

  function onClickHeaderCheckbox(e) {
    console.log("check");
    setstateChecboxHeader(e.target.checked);
    if (e.target.checked === true) {
      for (let i = 0; i < response_consulta_pedido.length; i++) {
        document.getElementById(
          "checkbox-body-" + response_consulta_pedido[i].vbelnField
        ).checked = true;
        arraycheckbox_export[0].data = [];

        // arraycheckbox_export[0].data.push(
        //   [
        //     {
        //       value: response_consulta_pedido[i].vbelnField,
        //       style: {
        //         font: { sz: "14" },
        //       },
        //     },
        //     {
        //       value: response_consulta_pedido[i].vkorgField,
        //       style: {
        //         font: { sz: "14" },
        //       },
        //     },
        //     {
        //       value: formatDate(
        //         response_consulta_pedido[i].erdatField
        //       ),
        //       style: {
        //         font: { sz: "14" },
        //       },
        //     },
        //     {
        //       value: response_consulta_pedido[i].kunnrField,
        //       style: {
        //         font: { sz: "14" },
        //       },
        //     },
        //     {
        //       value: response_consulta_pedido[i].name1Field,
        //       style: {
        //         font: { sz: "14" },
        //       },
        //     },
        //     {
        //       value: convertDecimal(
        //         response_consulta_pedido[i].netwrField,
        //         2
        //       ),
        //       style: {
        //         font: { sz: "14" },
        //       },
        //     },
        //     {
        //       value: response_consulta_pedido[i].waerkField,
        //       style: {
        //         font: { sz: "14" },
        //       },
        //     },
        //     {
        //       value: response_consulta_pedido[i].text1Field,
        //       style: {
        //         font: { sz: "14" },
        //       },
        //     },
        //     {
        //       value: response_consulta_pedido[i].statusField,
        //       style: {
        //         font: { sz: "14" },
        //       },
        //     },
        //     {
        //       value: response_consulta_pedido[i].motivoField,
        //       style: {
        //         font: { sz: "14" },
        //       },
        //     },
        //   ]
        // );
      }
    } else {
      for (let i = 0; i < response_consulta_pedido.length; i++) {
        document.getElementById(
          "checkbox-body-" + response_consulta_pedido[i].vbelnField
        ).checked = false;
      }
    }
  }

  function ordenamiento(d) {
    arraycheckbox_export[0].data.push([
      {
        value: d.vbelnField,
        style: {
          font: { sz: "14" },
        },
      },
      {
        value: d.bezeiField,
        style: {
          font: { sz: "14" },
        },
      },
      {
        value: d.vkorgField,
        style: {
          font: { sz: "14" },
        },
      },
      {
        value: formatDate(d.erdatField),
        style: {
          font: { sz: "14" },
        },
      },
      {
        value: d.kunnrField,
        style: {
          font: { sz: "14" },
        },
      },
      {
        value: d.name1Field,
        style: {
          font: { sz: "14" },
        },
      },
      {
        value: convertDecimal(d.netwrField, 2),
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
      {
        value: d.text1Field,
        style: {
          font: { sz: "14" },
        },
      },
      {
        value: d.statusField,
        style: {
          font: { sz: "14" },
        },
      },
      {
        value: d.motivoField,
        style: {
          font: { sz: "14" },
        },
      },
    ]);

    arraycheckbox_export[0].data.sort(function (a, b) {
      return a[0].value - b[0].value;
    });
  }
  function clear_filtro_fila() {
    setf_vbelnField("");
    setf_vkorgField("");
    setf_erdatField("");
    setf_kunnrField("");
    setf_name1Field("");
    setf_netwrField("");
    setf_waerkField("");
    setf_text1Field("");
    setf_statusField("");
    setf_bezeiField("");
  }
  function buscar_filtro_fila(pageNumber, IsCampo, IsOrden) {
    setTotalData(0);
    if (pageNumber == 1) {
      setind_pagina(1);
    } else {
      setind_pagina(0);
    }
    if (IsCampo === "" && IsOrden === "") {
      clear_icons_colum();
    }
    settext_btn_filtro("Filtrar");
    setmostrar_filtro_fila(false);
    let model = {
      IsCampo: IsCampo,
      IsOrden: IsOrden,
      IsNpag: pageNumber,
      IsRegxpag: IsRegxpag,
      IsExport: " ",
      IsUser: jwt(localStorage.getItem("_token")).username,
      ItErdat: RangosCreadoEl(),
      ItErnam: RangosCreadoPor(),
      ItKunnr: RangosCliente(),
      ItMatnr: RangosMaterial(),
      ItVbeln: RangosDocuComercial(),
      ItVkbur: RangosOficinaVentas(),
      ItVkorg: RangosOrganizacionVentas(),
      ItPernr: RangosComercial(),
      ItFilter: [
        {
          Vbeln: f_vbelnField,
          Bezei: f_bezeiField,
          Vkorg: f_vkorgField,
          Erdat: f_erdatField,
          Kunnr: f_kunnrField,
          Name1: f_name1Field,
          Netwr: f_netwrField.replace(/,/g, ""),
          Waerk: f_waerkField,
          Bstdk: "",
          Zterm: "",
          Text1: f_text1Field,
          Status: f_statusField,
          Motivo: "",
        },
      ],
    };

    console.log("FILTRO MODEL CONSULTAS",model)
    setmostrar_filtro_fila(false);
    arraycheckbox_export[0].data = [];
    setresponse_consulta_pedido([]);
    setspinner(true);
    ConsPedidoFiltro(model)
      .then((result) => {
        setspinner(false);
        setresponse_consulta_pedido(
          result.itConsultaPedidosField.map((d) => {
            return {
              select: false,
              bezeiField: d.bezeiField,
              bstdkField: d.bstdkField,
              erdatField: d.erdatField,
              kunnrField: d.kunnrField,
              motivoField: d.motivoField,
              name1Field: d.name1Field,
              netwrField: d.netwrField,
              statusField: d.statusField,
              text1Field: d.text1Field,
              vbelnField: d.vbelnField,
              vkorgField: d.vkorgField,
              waerkField: d.waerkField,
              ztermField: d.ztermField,
            };
          })
        );
        setTotalData(result.esRegtotField);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function buscar_filtro_enter(event) {
    var keycode = event.keyCode;
    if (keycode == "13") {
      buscar_filtro_fila(1, "", "");
    }
  }

  function buscar_filtro_icono_btn() {
    if(( f_bezeiField || f_erdatField || f_kunnrField || f_name1Field || f_netwrField ||
      f_statusField || f_text1Field || f_vbelnField || f_vkorgField || f_waerkField)!= ""){
        buscar_filtro_fila(1, "", "");
    }else{
      toast.error("Debe seleccionar algún filtro por columna.", {
        position: "top-center",
        autoClose: 6000,
        style: {
            backgroundColor: "#212121",
            color: "#fff",
        },
    });
    }
  }

  const closeModal = (e) => {
    if (modalRef.current === e.target) {
      setDatosxpagina(IsRegxpag);
      setshowModalPagina(false);
    }
  };

  function openDatosPagina() {
    // showModalPagina == true
    setshowModalPagina((prev) => !prev);
  }

  function SaveNumberPage() {
    console.log(ItemsNumberDates);
    setIsRegxpag(datosxpagina);
    setshowModalPagina((prev) => !prev);
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
      {showModalPagina ? (
        <React.Fragment>
          <div
            className="container-modal-background"
            onClick={closeModal}
            ref={modalRef}
          >
            <div className="modal-wrapper modal-wrapper-paginate p-5">
              <div className="col-sm-12 d-flex align-items-center">
                <label>Número de datos por página</label>
              </div>
              <div className="col-sm-12">
                {/* <InputForm
                        attribute={{
                          name: "num_datos_pagina",
                          type: "number",
                          value: datosxpagina,
                          disabled: false,
                          checked: false,
                          matchcode: false,
                          maxlength:10
                        }}
                        handleChange={handleChange}
                      /> */}
                <SelectFormMd
                  attribute={{ name: "id_role", disabled: false, default: 0 }}
                  values={ItemsNumberDates}
                  handleChange={handleChange}
                ></SelectFormMd>
              </div>
              {/* <div className="col-sm-12 col-md-12 p-1">
                      <BtnSearch
                        attribute={{
                          name: "Guardar",
                          classNamebtn: "btn_search",
                        }}
                        onClick={() => SaveNumberPage()}
                      />
                    </div> */}
              <div
                className="close-modal-button"
                onClick={() => {
                  setshowModalPagina((prev) => !prev);
                  setDatosxpagina(IsRegxpag);
                }}
              >
                <i className="fas fa-times"></i>
              </div>
            </div>
          </div>
        </React.Fragment>
      ) : null}
      {show_status_password ? (
        <ChangeStatusPassword
          setshow_status_password={setshow_status_password}
        />
      ) : null}
      {spinnerroute ? (
        <Spinner />
      ) : (
        <React.Fragment>
          {/* {accesoruta ? ( */}
          <div className="container-view">
            {/* MODAL DE RANGO */}
            <BusquedaMult
              showBusMult={showBusMult}
              setshowBusMult={setshowBusMult}
              rangos={rangos}
              setrangos={setrangos}
              ind_rangos={ind_rang}
              setind_rangos={setind_rang}
              type_input={type_input}
              settype_input={settype_input}
            />
            {/* MODALES  */}
            <VerPedido
              showverpedido={showverpedido}
              setshowVerPedido={setshowVerPedido}
              data={PVbeln}
            />
            {/* MODAL MATCHCODE ORGANIZACION DE VENTAS */}
            <Mc_Org_Ventas_desde
              showorgventa={showorgventa_desde}
              setshoworgventa={setshoworgventa_desde}
              setorg_ventas_desde={setorg_ventas_desde}
              org_ventas_desde={org_ventas_desde}
              org_ventas_hasta={org_ventas_hasta}
              setorg_ventas={setorg_ventas}
            />
            <Mc_Org_Ventas_hasta
              showorgventa={showorgventa_hasta}
              setshoworgventa={setshoworgventa_hasta}
              setorg_ventas_hasta={setorg_ventas_hasta}
              org_ventas_hasta={org_ventas_hasta}
              org_ventas_desde={org_ventas_desde}
              setorg_ventas={setorg_ventas}
            />
            {/* MODAL MATCHCODE OFICINA DE VENTAS */}
            <Mc_Ofi_Ventas_desde
              showofiventa={showofiventa_desde}
              setshowofiventa={setshowofiventa_desde}
              setofi_ventas_desde={setofi_ventas_desde}
              ofi_ventas_desde={ofi_ventas_desde}
              ofi_ventas_hasta={ofi_ventas_hasta}
              setofi_ventas={setofi_ventas}
            />
            <Mc_Ofi_Ventas_hasta
              showofiventa={showofiventa_hasta}
              setshowofiventa={setshowofiventa_hasta}
              setofi_ventas_hasta={setofi_ventas_hasta}
              ofi_ventas_hasta={ofi_ventas_hasta}
              ofi_ventas_desde={ofi_ventas_desde}
              setofi_ventas={setofi_ventas}
            />
            {/* MODAL MATCHCODE CLIENTE */}
            {/* <Mc_Cliente_desde
                showcliente={showcliente_desde}
                setshowcliente={setshowcliente_desde}
                setcliente_desde={setcliente_desde}
                cliente_desde={cliente_desde}
                cliente_hasta={cliente_hasta}
                setcliente={setcliente}
              /> */}
            {/* <Mc_Cliente_hasta
                showcliente={showcliente_hasta}
                setshowcliente={setshowcliente_hasta}
                setcliente_hasta={setcliente_hasta}
                cliente_hasta={cliente_hasta}
                cliente_desde={cliente_desde}
                setcliente={setcliente}
              /> */}
            <Mc_Cliente_desde_v2
              showcliente={showcliente_desde}
              setshowcliente={setshowcliente_desde}
              setcliente_desde={setcliente_desde}
              cliente_desde={cliente_desde}
              cliente_hasta={cliente_hasta}
              setcliente={setcliente}
            />
            <Mc_Cliente_hasta_v2
              showcliente={showcliente_hasta}
              setshowcliente={setshowcliente_hasta}
              setcliente_hasta={setcliente_hasta}
              cliente_hasta={cliente_hasta}
              cliente_desde={cliente_desde}
              setcliente={setcliente}
            />
            {/* MODAL MATCHCODE MATERIAL */}
            <Mc_Material_desde
              showmaterial={showmaterial_desde}
              setshowmaterial={setshowmaterial_desde}
              setmaterial_desde={setmaterial_desde}
              material_desde={material_desde}
              material_hasta={material_hasta}
              setmaterial={setmaterial}
            />
            <Mc_Material_hasta
              showmaterial={showmaterial_hasta}
              setshowmaterial={setshowmaterial_hasta}
              setmaterial_hasta={setmaterial_hasta}
              material_hasta={material_hasta}
              material_desde={material_desde}
              setmaterial={setmaterial}
            />
            <Mc_Comercial_desde
              showcomercial={showcomercial_desde}
              setshowcomercial={setshowcomercial_desde}
              setcomercial_desde={setcomercial_desde}
              comercial_desde={comercial_desde}
              comercial_hasta={comercial_hasta}
              setcomercial={setcomercial}
              setcomercial_desde_value={setcomercial_desde_value}
            />
            <Mc_Comercial_hasta
              showcomercial={showcomercial_hasta}
              setshowcomercial={setshowcomercial_hasta}
              setcomercial_hasta={setcomercial_hasta}
              comercial_hasta={comercial_hasta}
              comercial_desde={comercial_desde}
              setcomercial={setcomercial}
              setcomercial_hasta_value={setcomercial_hasta_value}
            />
            <Toaster />
            <div className="title-section">
              <div>
                <label> Reportes / Consulta de Pedidos </label>
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
                  Fecha :{" "}
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
                <div className="col-sm-4 d-flex align-items-center">
                  <label>N° de Pedido</label>
                </div>
                <div className="col-sm-3">
                  <InputForm
                    attribute={{
                      name: "docu_comercial_desde",
                      type: "text",
                      value: docu_comercial_desde,
                      disabled: false,
                      checked: false,
                      matchcode: false,
                      maxlength: 10,
                    }}
                    handleChange={handleChange}
                  />
                </div>
                <div className="col-sm-3">
                  <InputForm
                    attribute={{
                      name: "docu_comercial_hasta",
                      type: "text",
                      value: docu_comercial_hasta,
                      disabled: false,
                      checked: false,
                      matchcode: false,
                      maxlength: 10,
                    }}
                    handleChange={handleChange}
                  />
                </div>
                <div className="col-sm-2 d-flex align-items-center">
                  <i
                    className="fas fa-file-export icon-matchcode-2"
                    onClick={ChangeBusquedaMult_DocComercial}
                  ></i>
                </div>

                <div className="col-sm-4 d-flex align-items-center">
                  <label>Oficina de ventas</label>
                </div>
                <div className="col-sm-3">
                  <InputForm
                    attribute={{
                      name: "ofi_ventas_desde",
                      type: "text",
                      value: ofi_ventas_desde,
                      disabled: false,
                      checked: false,
                      matchcode: true,
                      maxlength: 4,
                    }}
                    handleChange={handleChange}
                    onClick={() => mc_ofi_ventas_desde()}
                  />
                </div>
                <div className="col-sm-3">
                  <InputForm
                    attribute={{
                      name: "ofi_ventas_hasta",
                      type: "text",
                      value: ofi_ventas_hasta,
                      disabled: false,
                      checked: false,
                      matchcode: true,
                      maxlength: 4,
                    }}
                    handleChange={handleChange}
                    onClick={() => mc_ofi_ventas_hasta()}
                  />
                </div>
                <div className="col-sm-2 d-flex align-items-center">
                  <i
                    className="fas fa-file-export icon-matchcode-2"
                    onClick={ChangeBusquedaMult_OficinaVentas}
                  ></i>
                </div>

                <div className="col-sm-4 d-flex align-items-center">
                  <label>Creado el</label>
                </div>
                <div className="col-sm-3">
                  <InputForm
                    attribute={{
                      name: "creado_el_desde",
                      type: "date",
                      value: creado_el_desde,
                      disabled: false,
                      checked: false,
                      matchcode: false,
                    }}
                    handleChange={handleChange}
                  />
                </div>
                <div className="col-sm-3">
                  <InputForm
                    attribute={{
                      name: "creado_el_hasta",
                      type: "date",
                      value: creado_el_hasta,
                      disabled: false,
                      checked: false,
                      matchcode: false,
                    }}
                    handleChange={handleChange}
                  />
                </div>
                <div className="col-sm-2 d-flex align-items-center">
                  <i
                    className="fas fa-file-export icon-matchcode-2"
                    onClick={ChangeBusquedaMult_CreadoEl}
                  ></i>
                </div>

                <div className="col-sm-4 d-flex align-items-center">
                  <label>Material</label>
                </div>
                <div className="col-sm-3">
                  <InputForm
                    attribute={{
                      name: "material_desde",
                      type: "text",
                      value: material_desde,
                      disabled: false,
                      checked: false,
                      matchcode: true,
                      maxlength: 18,
                    }}
                    handleChange={handleChange}
                    onClick={() => mc_material_desde()}
                  />
                </div>
                <div className="col-sm-3">
                  <InputForm
                    attribute={{
                      name: "material_hasta",
                      type: "text",
                      value: material_hasta,
                      disabled: false,
                      checked: false,
                      matchcode: true,
                      maxlength: 18,
                    }}
                    handleChange={handleChange}
                    onClick={() => mc_material_hasta()}
                  />
                </div>
                <div className="col-sm-2 d-flex align-items-center">
                  <i
                    className="fas fa-file-export icon-matchcode-2"
                    onClick={ChangeBusquedaMult_Material}
                  ></i>
                </div>

                <div className="col-sm-4 d-flex align-items-center">
                  <label>Organización ventas</label>
                </div>
                <div className="col-sm-3">
                  <InputForm
                    attribute={{
                      name: "org_ventas_desde",
                      type: "text",
                      value: org_ventas_desde,
                      disabled: false,
                      checked: false,
                      matchcode: true,
                      maxlength: 4,
                    }}
                    handleChange={handleChange}
                    onClick={() => mc_org_ventas_desde()}
                  />
                </div>
                <div className="col-sm-3">
                  <InputForm
                    attribute={{
                      name: "org_ventas_hasta",
                      type: "text",
                      value: org_ventas_hasta,
                      disabled: false,
                      checked: false,
                      matchcode: true,
                      maxlength: 4,
                    }}
                    handleChange={handleChange}
                    onClick={() => mc_org_ventas_hasta()}
                  />
                </div>
                <div className="col-sm-2 d-flex align-items-center">
                  <i
                    className="fas fa-file-export icon-matchcode-2"
                    onClick={ChangeBusquedaMult_OrganizacionVentas}
                  ></i>
                </div>

                <div className="col-sm-4 d-flex align-items-center">
                  <label>Cod. Cliente</label>
                </div>
                <div className="col-sm-3">
                  <InputForm
                    attribute={{
                      name: "cliente_desde",
                      type: "text",
                      value: cliente_desde,
                      disabled: false,
                      checked: false,
                      matchcode: true,
                      maxlength: 10,
                    }}
                    handleChange={handleChange}
                    onClick={() => mc_cliente_desde()}
                  />
                </div>
                <div className="col-sm-3">
                  <InputForm
                    attribute={{
                      name: "cliente_hasta",
                      type: "text",
                      value: cliente_hasta,
                      disabled: false,
                      checked: false,
                      matchcode: true,
                      maxlength: 10,
                    }}
                    handleChange={handleChange}
                    onClick={() => mc_cliente_hasta()}
                  />
                </div>
                <div className="col-sm-2 d-flex align-items-center">
                  <i
                    className="fas fa-file-export icon-matchcode-2"
                    onClick={ChangeBusquedaMult_Cliente}
                  ></i>
                </div>

                <div className="col-sm-4 d-flex align-items-center">
                  <label>Comercial</label>
                </div>
                <div className="col-sm-3">
                  <InputForm
                    attribute={{
                      name: "comercial_desde",
                      type: "text",
                      value: comercial_desde_value,
                      disabled: true,
                      checked: false,
                      matchcode: true,
                      maxlength: 6,
                    }}
                    handleChange={handleChange}
                    onClick={() => mc_comercial_desde()}
                  />
                </div>
                <div className="col-sm-3">
                  <InputForm
                    attribute={{
                      name: "comercial_hasta",
                      type: "text",
                      value: comercial_hasta_value,
                      disabled: true,
                      checked: false,
                      matchcode: true,
                      maxlength: 6,
                    }}
                    handleChange={handleChange}
                    onClick={() => mc_comercial_hasta()}
                  />
                </div>
                <div className="col-sm-2 d-flex align-items-center">
                  <i
                    className="fas fa-file-export icon-matchcode-2"
                    onClick={ChangeBusquedaMult_Comercial}
                  ></i>
                </div>
              </div>
            </section>
            <section>
              <div className="col-sm-12 col-md-2 p-1">
                <BtnSearch
                  attribute={{ name: "Buscar", classNamebtn: "btn_search" }}
                  onClick={() => Search(1, 0, "", "")}
                />
              </div>
              <div className="col-sm-12 col-md-2 p-1">
                <BtnSearch
                  attribute={{
                    name: "Limpiar Campos",
                    classNamebtn: "btn_search",
                  }}
                  onClick={() => Clear()}
                />
              </div>
              <div className="col-sm-12 col-md-2 p-1">
                {arraycheckbox_export[0].data.length > 0 ? (
                  <ExcelFile
                    filename="Consulta de Pedidos"
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
                      dataSet={arraycheckbox_export}
                      name="exportacion"
                    />
                  </ExcelFile>
                ) : (
                  <ExcelFile
                    filename="Consulta de Pedidos"
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
                    <ExcelSheet dataSet={DataSet} name="exportacion" />
                  </ExcelFile>
                )}
              </div>
              <div className="col-sm-12 col-md-2 p-1">
                <BtnSearch
                  attribute={{
                    name: "Cantidad de documentos",
                    classNamebtn: "btn_search",
                  }}
                  onClick={() => openDatosPagina()}
                />
              </div>
              {response_consulta_pedido.length ? (
                <div className="col-sm-12 col-md-2 p-1">
                  <BtnSearch
                    attribute={{
                      name: text_btn_filtro,
                      classNamebtn: "btn_search",
                    }}
                    onClick={() => ModalFiltro()}
                  />
                </div>
              ) : null}
            </section>
            <section>
              <div className="container-table">
                <div className="container-table-sm">
                  <table className="content-table">
                    <thead>
                      <tr>
                        <th>
                          <input
                            type="checkbox"
                            onClick={(e) => {
                              onClickHeaderCheckbox(e);
                            }}
                          />
                        </th>
                        <th>
                          N° Pedido |{" "}
                          {col_1 === 0 ? (
                            <i
                              className="fas fa-arrows-alt-v"
                              style={{ cursor: "pointer" }}
                              onClick={() => handleChangeColumna(1)}
                            ></i>
                          ) : null}
                          {col_1 === 1 ? (
                            <i
                              className="fas fa-sort-amount-up"
                              style={{ cursor: "pointer" }}
                              onClick={() => handleChangeColumna(1)}
                            ></i>
                          ) : null}
                          {col_1 === 2 ? (
                            <i
                              className="fas fa-sort-amount-down-alt"
                              style={{ cursor: "pointer" }}
                              onClick={() => handleChangeColumna(1)}
                            ></i>
                          ) : null}
                        </th>
                        {/* <th style={{textAlign:'center'}}>Clase Pedido |{" "}
                          {col_10 === 0 ? (
                              <i
                              className="fas fa-arrows-alt-v"
                                style={{ cursor: "pointer" }}
                                onClick={() => handleChangeColumna(10)}
                              ></i>
                            ) : null}
                            {col_10 === 1 ? (
                              <i
                              className="fas fa-sort-amount-up"
                                style={{ cursor: "pointer" }}
                                onClick={() => handleChangeColumna(10)}
                              ></i>
                            ) : null}
                            {col_10 === 2 ? (
                              <i
                              className="fas fa-sort-amount-down-alt"
                                style={{ cursor: "pointer" }}
                                onClick={() => handleChangeColumna(10)}
                              ></i>
                            ) : null}
                          </th> */}
                        <th>
                          Org. Ventas. |{" "}
                          {col_2 === 0 ? (
                            <i
                              className="fas fa-arrows-alt-v"
                              style={{ cursor: "pointer" }}
                              onClick={() => handleChangeColumna(2)}
                            ></i>
                          ) : null}
                          {col_2 === 1 ? (
                            <i
                              className="fas fa-sort-amount-up"
                              style={{ cursor: "pointer" }}
                              onClick={() => handleChangeColumna(2)}
                            ></i>
                          ) : null}
                          {col_2 === 2 ? (
                            <i
                              className="fas fa-sort-amount-down-alt"
                              style={{ cursor: "pointer" }}
                              onClick={() => handleChangeColumna(2)}
                            ></i>
                          ) : null}
                        </th>
                        <th>
                          Creado el |{" "}
                          {col_3 === 0 ? (
                            <i
                              className="fas fa-arrows-alt-v"
                              style={{ cursor: "pointer" }}
                              onClick={() => handleChangeColumna(3)}
                            ></i>
                          ) : null}
                          {col_3 === 1 ? (
                            <i
                              className="fas fa-sort-amount-up"
                              style={{ cursor: "pointer" }}
                              onClick={() => handleChangeColumna(3)}
                            ></i>
                          ) : null}
                          {col_3 === 2 ? (
                            <i
                              className="fas fa-sort-amount-down-alt"
                              style={{ cursor: "pointer" }}
                              onClick={() => handleChangeColumna(3)}
                            ></i>
                          ) : null}
                        </th>
                        <th>
                          Cod. Cliente |{" "}
                          {col_4 === 0 ? (
                            <i
                              className="fas fa-arrows-alt-v"
                              style={{ cursor: "pointer" }}
                              onClick={() => handleChangeColumna(4)}
                            ></i>
                          ) : null}
                          {col_4 === 1 ? (
                            <i
                              className="fas fa-sort-amount-up"
                              style={{ cursor: "pointer" }}
                              onClick={() => handleChangeColumna(4)}
                            ></i>
                          ) : null}
                          {col_4 === 2 ? (
                            <i
                              className="fas fa-sort-amount-down-alt"
                              style={{ cursor: "pointer" }}
                              onClick={() => handleChangeColumna(4)}
                            ></i>
                          ) : null}
                        </th>
                        <th style={{ textAlign: "center" }}>
                          Nombre Cliente |{" "}
                          {col_5 === 0 ? (
                            <i
                              className="fas fa-arrows-alt-v"
                              style={{ cursor: "pointer" }}
                              onClick={() => handleChangeColumna(5)}
                            ></i>
                          ) : null}
                          {col_5 === 1 ? (
                            <i
                              className="fas fa-sort-amount-up"
                              style={{ cursor: "pointer" }}
                              onClick={() => handleChangeColumna(5)}
                            ></i>
                          ) : null}
                          {col_5 === 2 ? (
                            <i
                              className="fas fa-sort-amount-down-alt"
                              style={{ cursor: "pointer" }}
                              onClick={() => handleChangeColumna(5)}
                            ></i>
                          ) : null}
                        </th>
                        <th style={{ textAlign: "end" }}>
                          Valor Neto |{" "}
                          {col_6 === 0 ? (
                            <i
                              className="fas fa-arrows-alt-v"
                              style={{ cursor: "pointer" }}
                              onClick={() => handleChangeColumna(6)}
                            ></i>
                          ) : null}
                          {col_6 === 1 ? (
                            <i
                              className="fas fa-sort-amount-up"
                              style={{ cursor: "pointer" }}
                              onClick={() => handleChangeColumna(6)}
                            ></i>
                          ) : null}
                          {col_6 === 2 ? (
                            <i
                              className="fas fa-sort-amount-down-alt"
                              style={{ cursor: "pointer" }}
                              onClick={() => handleChangeColumna(6)}
                            ></i>
                          ) : null}
                        </th>
                        <th>
                          Moneda |{" "}
                          {col_7 === 0 ? (
                            <i
                              className="fas fa-arrows-alt-v"
                              style={{ cursor: "pointer" }}
                              onClick={() => handleChangeColumna(7)}
                            ></i>
                          ) : null}
                          {col_7 === 1 ? (
                            <i
                              className="fas fa-sort-amount-up"
                              style={{ cursor: "pointer" }}
                              onClick={() => handleChangeColumna(7)}
                            ></i>
                          ) : null}
                          {col_7 === 2 ? (
                            <i
                              className="fas fa-sort-amount-down-alt"
                              style={{ cursor: "pointer" }}
                              onClick={() => handleChangeColumna(7)}
                            ></i>
                          ) : null}
                        </th>
                        <th>
                          Condición de Pago |{" "}
                          {col_8 === 0 ? (
                            <i
                              className="fas fa-arrows-alt-v"
                              style={{ cursor: "pointer" }}
                              onClick={() => handleChangeColumna(8)}
                            ></i>
                          ) : null}
                          {col_8 === 1 ? (
                            <i
                              className="fas fa-sort-amount-up"
                              style={{ cursor: "pointer" }}
                              onClick={() => handleChangeColumna(8)}
                            ></i>
                          ) : null}
                          {col_8 === 2 ? (
                            <i
                              className="fas fa-sort-amount-down-alt"
                              style={{ cursor: "pointer" }}
                              onClick={() => handleChangeColumna(8)}
                            ></i>
                          ) : null}
                        </th>
                        <th>
                          Est. Operac. |{" "}
                          {col_9 === 0 ? (
                            <i
                              className="fas fa-arrows-alt-v"
                              style={{ cursor: "pointer" }}
                              onClick={() => handleChangeColumna(9)}
                            ></i>
                          ) : null}
                          {col_9 === 1 ? (
                            <i
                              className="fas fa-sort-amount-up"
                              style={{ cursor: "pointer" }}
                              onClick={() => handleChangeColumna(9)}
                            ></i>
                          ) : null}
                          {col_9 === 2 ? (
                            <i
                              className="fas fa-sort-amount-down-alt"
                              style={{ cursor: "pointer" }}
                              onClick={() => handleChangeColumna(9)}
                            ></i>
                          ) : null}
                        </th>
                        <th>Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mostrar_filtro_fila == true ? (
                        <tr>
                          <th>
                            <button
                              className="btn_search_filter"
                              onClick={() => buscar_filtro_icono_btn()}
                            >
                              <i className="fas fa-filter"></i>
                            </button>
                          </th>
                          <th>
                            <input
                              type="text"
                              onKeyUp={(e) => buscar_filtro_enter(e)}
                              name="f_vbelnField"
                              maxLength="10"
                              onChange={(e) =>
                                handleChangeFiltro(
                                  e.target.name,
                                  e.target.value
                                )
                              }
                            />
                          </th>
                          {/* <th>
                              <input
                                type="text"
                                onKeyUp={(e) => buscar_filtro_enter(e)}
                                name="f_bezeiField"
                                maxLength="10"
                                onChange={(e) =>
                                  handleChangeFiltro(
                                    e.target.name,
                                    e.target.value
                                  )
                                }
                              />
                            </th> */}
                          <th style={{ textAlign: "center" }}>
                            <div >
                            <select style={{ paddingTop: "2px", paddingBottom: "2px" }} className="px-1" name="f_vkorgField"
                              onKeyUp={(e) => buscar_filtro_enter(e)}
                              //onChange={(e) => selectedFiltro(e)}
                              onChange={(e) =>
                                handleChangeFiltro(
                                  e.target.name,
                                  e.target.value
                                )
                              }
                            >
                              <option value="">TODOS</option>
                              <option value="AGRO">AGRO</option>
                              <option value="ESPE">ESPE</option>
                              <option value="SALU">SALU</option>
                              <option value="SEMI">SEMI</option>
                            </select>
                            </div>
                            
                            {/* <input
                              type="text"
                              onKeyUp={(e) => buscar_filtro_enter(e)}
                              name="f_vkorgField"
                              maxLength="4"
                              onChange={(e) =>
                                handleChangeFiltro(
                                  e.target.name,
                                  e.target.value
                                )
                              }
                            /> */}
                          </th>
                          <th>
                            <input
                              type="date"
                              onKeyUp={(e) => buscar_filtro_enter(e)}
                              name="f_erdatField"
                              onChange={(e) =>
                                handleChangeFiltro(
                                  e.target.name,
                                  e.target.value
                                )
                              }
                            />
                          </th>
                          <th>
                            <input
                              type="text"
                              onKeyUp={(e) => buscar_filtro_enter(e)}
                              name="f_kunnrField"
                              maxLength="10"
                              onChange={(e) =>
                                handleChangeFiltro(
                                  e.target.name,
                                  e.target.value
                                )
                              }
                            />
                          </th>
                          <th>
                            <input
                              type="text"
                              onKeyUp={(e) => buscar_filtro_enter(e)}
                              name="f_name1Field"
                              maxLength="30"
                              onChange={(e) =>
                                handleChangeFiltro(
                                  e.target.name,
                                  e.target.value
                                )
                              }
                            />
                          </th>
                          <th>
                            <input
                              type="text"
                              onKeyUp={(e) => buscar_filtro_enter(e)}
                              name="f_netwrField"
                              maxLength="18"
                              onChange={(e) =>
                                handleChangeFiltro(
                                  e.target.name,
                                  e.target.value
                                )
                              }
                            />
                          </th>
                          <th>
                            <input
                              type="text"
                              onKeyUp={(e) => buscar_filtro_enter(e)}
                              name="f_waerkField"
                              maxLength="5"
                              onChange={(e) =>
                                handleChangeFiltro(
                                  e.target.name,
                                  e.target.value
                                )
                              }
                            />
                          </th>
                          <th>
                            <input
                              type="text"
                              onKeyUp={(e) => buscar_filtro_enter(e)}
                              name="f_text1Field"
                              maxLength="50"
                              onChange={(e) =>
                                handleChangeFiltro(
                                  e.target.name,
                                  e.target.value
                                )
                              }
                            />
                          </th>
                          <th>
                            <input
                              type="text"
                              onKeyUp={(e) => buscar_filtro_enter(e)}
                              name="f_statusField"
                              maxLength="25"
                              onChange={(e) =>
                                handleChangeFiltro(
                                  e.target.name,
                                  e.target.value
                                )
                              }
                            />
                          </th>
                          <th></th>
                        </tr>
                      ) : null}

                      {response_consulta_pedido != null &&
                        response_consulta_pedido.length > 0
                        ? response_consulta_pedido.map((response, key) => {
                          return (
                            <tr key={key}>
                              <th>
                                <input
                                  type="checkbox"
                                  id={`checkbox-body-` + response.vbelnField}
                                  onChange={(e) => {
                                    setresponse_consulta_pedido(
                                      response_consulta_pedido.map((d) => {
                                        if (
                                          d.vbelnField == response.vbelnField
                                        ) {
                                          d.select = e.target.checked;
                                          if (e.target.checked == true) {
                                            if (stateChecboxHeader == true) {
                                              // DataSet[0].data

                                              // setDataSet([
                                              //   ...DataSet,
                                              //   DataSet[0].data = [
                                              //     { value: d.vbelnField, style: { font: { sz: "14" } } },
                                              //     { value: d.vkorgField, style: { font: { sz: "14" } } },
                                              //     {
                                              //       value: formatDate(d.erdatField),
                                              //       style: { font: { sz: "14" } },
                                              //     },
                                              //     { value: d.kunnrField, style: { font: { sz: "14" } } },
                                              //     { value: d.name1Field, style: { font: { sz: "14" } } },
                                              //     {
                                              //       value: convertDecimal(d.netwrField, 2),
                                              //       style: { font: { sz: "14" } },
                                              //     },
                                              //     { value: d.waerkField, style: { font: { sz: "14" } } },
                                              //     { value: d.text1Field, style: { font: { sz: "14" } } },
                                              //     { value: d.statusField, style: { font: { sz: "14" } } },
                                              //     { value: d.motivoField, style: { font: { sz: "14" } } },
                                              //   ]

                                              // ]);
                                              DataSet[0].data.push([
                                                {
                                                  value: d.vbelnField,
                                                  style: {
                                                    font: { sz: "14" },
                                                  },
                                                },
                                                // { value: d.bezeiField, style: { font: { sz: "14" } } },
                                                {
                                                  value: d.vkorgField,
                                                  style: {
                                                    font: { sz: "14" },
                                                  },
                                                },
                                                {
                                                  value: formatDate(
                                                    d.erdatField
                                                  ),
                                                  style: {
                                                    font: { sz: "14" },
                                                  },
                                                },
                                                {
                                                  value: d.kunnrField,
                                                  style: {
                                                    font: { sz: "14" },
                                                  },
                                                },
                                                {
                                                  value: d.name1Field,
                                                  style: {
                                                    font: { sz: "14" },
                                                  },
                                                },
                                                {
                                                  value: convertDecimal(
                                                    d.netwrField,
                                                    2
                                                  ),
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
                                                {
                                                  value: d.text1Field,
                                                  style: {
                                                    font: { sz: "14" },
                                                  },
                                                },
                                                {
                                                  value: d.statusField,
                                                  style: {
                                                    font: { sz: "14" },
                                                  },
                                                },
                                                {
                                                  value: d.motivoField,
                                                  style: {
                                                    font: { sz: "14" },
                                                  },
                                                },
                                              ]);
                                              console.log(DataSet);
                                            } else {
                                              setarraycheckbox([
                                                ...arraycheckbox,
                                                {
                                                  vbelnField: d.vbelnField,
                                                },
                                              ]);
                                              ordenamiento(d);
                                            }
                                          } else if (
                                            e.target.checked == false
                                          ) {
                                            // console.log("false")
                                            // setDataSet([{columns:[], data:[]}]);
                                            // // console.log(arraycheckbox_export)
                                            // console.log(arraycheckbox)

                                            for (
                                              let i = 0;
                                              i < arraycheckbox.length;
                                              i++
                                            ) {
                                              if (
                                                d.vbelnField ==
                                                arraycheckbox[i].vbelnField
                                              ) {
                                                arraycheckbox.splice(i, 1);
                                                arraycheckbox_export[0].data.splice(
                                                  i,
                                                  1
                                                );
                                              } else {
                                                setarraycheckbox([
                                                  ...arraycheckbox,
                                                  {
                                                    vbelnField:
                                                      arraycheckbox[i]
                                                        .vbelnField,
                                                  },
                                                ]);
                                                ordenamiento(d);
                                                // console.log(arraycheckbox)
                                              }
                                            }
                                            for (
                                              let y = 0;
                                              y < DataSet[0].data.length;
                                              y++
                                            ) {
                                              if (
                                                d.vbelnField ==
                                                DataSet[0].data[y][0].value
                                              ) {
                                                //  console.log(DataSet[0].data[y])
                                                arraycheckbox_export[0].data =
                                                  [];
                                                DataSet[0].data.splice(y, 1);
                                              }
                                              // console.log(DataSet);
                                              // console.log(arraycheckbox_export[0].data)
                                            }
                                          }
                                        }
                                        return d;
                                      })
                                    );
                                  }}
                                />
                              </th>
                              <th style={{ textAlign: "center" }}>
                                {response.vbelnField}
                              </th>
                              {/* <th style={{ textAlign: "left" }}>
                                    {response.bezeiField}
                                  </th> */}
                              <th style={{ textAlign: "center" }}>
                                {response.vkorgField}
                              </th>
                              <th style={{ textAlign: "center" }}>
                                {formatDate(response.erdatField)}
                              </th>
                              <th style={{ textAlign: "center" }}>
                                {response.kunnrField}
                              </th>
                              <th
                                style={{ textAlign: "left" }}
                                align={"left"}
                              >
                                {response.name1Field}
                              </th>
                              <th
                                style={{ textAlign: "right" }}
                                align={"right"}
                              >
                                {convertDecimal(response.netwrField, 2)}
                              </th>
                              <th style={{ textAlign: "center" }}>
                                {response.waerkField}
                              </th>
                              <th
                                style={{ textAlign: "left" }}
                                align={"left"}
                              >
                                {response.text1Field}
                              </th>
                              <th style={{ textAlign: "center" }}>
                                {response.statusField}
                              </th>
                              <th
                                onClick={() => verPedido(response.vbelnField)}
                              >
                                <i
                                  className="fas fa-clipboard-list"
                                  title="Ver pedido"
                                ></i>
                              </th>
                            </tr>
                          );
                        })
                        : null}
                    </tbody>
                  </table>
                </div>
                {response_consulta_pedido == 0 && spinner == false ? (
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
            </section>
            <div>
              {valuepagination && (
                <Pagination
                  postsPerPage={IsRegxpag}
                  totalPosts={TotalData}
                  changePage={changePage}
                  prevPage={prevPage}
                  nextPage={nextPage}
                  ind={ind_pagina}
                />
              )}
            </div>
          </div>
          {/* ) : (
            <div className="access-route">NO TIENE ACCESO A ESTE REPORTE</div>
          )} */}
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default Consulta;
