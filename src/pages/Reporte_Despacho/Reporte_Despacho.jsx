import React, { useState, useEffect, useRef } from "react";
import ReactExport from "react-data-export";
import { getUser } from "../../Services/ServiceUser";
import jwt from "jwt-decode";
import SelectFormMd from "../../components/SelectFormModal";
import ChangeStatusPassword from "../../components/ChangeStatusPassword/ChangeStatusPassword";
import Spinner from "../../components/Spinner";
import Pagination from "../../components/Pagination";
import BusquedaMult from "../../components/BusquedaMultiple/BusquedaMult";
import Mc_Org_Ventas_desde from "./Matchcode_Organ_Ventas/Mc_Org_Ventas_desde";
import Mc_Org_Ventas_hasta from "./Matchcode_Organ_Ventas/Mc_Org_Ventas_hasta";
import Mc_Cliente_desde_v2 from "./Matchcode_Cliente/Mc_Cliente_desde_v2";
import Mc_Cliente_hasta_v2 from "./Matchcode_Cliente/Mc_Cliente_hasta_v2";
import Mc_Punto_Exp_desde from "./Matchcode_Punto_Exp/Mc_Punto_Exp_desde";
import Mc_Punto_Exp_hasta from "./Matchcode_Punto_Exp/Mc_Punto_Exp_hasta";
import Mc_Ofi_Ventas_desde from "./Matchcode_Ofi_Ventas/Mc_Ofi_Ventas_desde";
import Mc_Ofi_Ventas_hasta from "./Matchcode_Ofi_Ventas/Mc_Ofi_Ventas_hasta";
import Mc_Comercial_desde from "./Matchcode_Comercial/Mc_Comercial_desde";
import Mc_Comercial_hasta from "./Matchcode_Comercial/Mc_Comercial_hasta";
import InputForm from "../../components/InputForm";
import BtnSearch from "../../components/BtnSearch";
import BtnExportar from "../../components/BtnExport";
import {
    getOficinaVentasSAP,
    RegistrarAuditoria,
} from "../../Services/ServiceAuditoria";
import {
    ConsultaReporteDespacho,
} from "../../Services/ServiceReporteDespacho";
import toast, { Toaster } from "react-hot-toast";
import ModalNameFile from "./Modal/ModalNameFile";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

const Reporte_Despacho = () => {
    //@MC
    const [showModalPagina, setshowModalPagina] = useState(false);
    const [ind_pagina, setind_pagina] = useState(1);
    // para mostrar fila de filtros
    const [mostrar_filtro_fila, setmostrar_filtro_fila] = useState(false);
    const [text_btn_filtro, settext_btn_filtro] = useState("Filtrar");

    const [f_name1Field, setf_name1Field] = useState("");
    const [f_bstkdField, setf_bstkdField] = useState("");
    const [f_erdatField, setf_erdatField] = useState("");
    const [f_aubelField, setf_aubelField] = useState("");
    const [f_xblnrField, setf_xblnrField] = useState("");
    const [f_xblnr1Field, setf_xblnr1Field] = useState("");
    const [f_ntransField, setf_ntransField] = useState("");
    const [f_vkorgField, setf_vkorgField] = useState("");
    const [f_arktxField, setf_arktxField] = useState("");
    const [f_werksField, setf_werksField] = useState("");
    const [f_chargField, setf_chargField] = useState("");
    const [f_lfimgField, setf_lfimgField] = useState("");
    const [f_vkburbezeiField, setf_vkburbezeiField] = useState("");
    const [f_vkgrpbezeiField, setf_vkgrpbezeiField] = useState("");
    const [f_snameField, setf_snameField] = useState("");

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
    const [col_11, setcol_11] = useState(0);
    const [col_12, setcol_12] = useState(0);
    const [col_13, setcol_13] = useState(0);
    const [col_14, setcol_14] = useState(0);
    const [col_15, setcol_15] = useState(0);

    //para el cambio de contraseña
    const [show_status_password, setshow_status_password] = useState(false);

    const [IsCampo, setIsCampo] = useState("");
    const [IsOrden, setIsOrden] = useState("");
    // para el paginado
    const [datosxpagina, setDatosxpagina] = useState(10); // para el input
    const [IsRegxpag, setIsRegxpag] = useState(10); // cantidad de datos por página
    const [IsBukrs, setIsBukrs] = useState("FRMX")
    const [pageNumber, setpageNumber] = useState(1);
    const [indicadorfiltro, setindicadorfiltro] = useState(false);
    const [model_filtro, setmodel_filtro] = useState({});
    //const [model_conspedido, setmodel_conspedido] = useState();
    const [model_reportedespacho, setmodel_reportedespacho] = useState();
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

    // rangos organizacion ventas
    const [rangos_org_ventas, setrangos_org_ventas] = useState([
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

    // rangos punto exp
    const [rangos_puntoexp, setrangos_puntoexp] = useState([
        { Sign: "I", Option: "EQ", Low: "", High: "" },
    ]);
    // rangos documento comercial
    const [rangos_doccomercial, setrangos_doccomercial] = useState([
        { Sign: "I", Option: "EQ", Low: "", High: "" },
    ]);
    // rangos oficina ventas
    const [rangos_ofi_ventas, setrangos_ofi_ventas] = useState([
        { Sign: "I", Option: "EQ", Low: "", High: "" },
    ]);
    // rangos comercial
    const [rangos_comercial, setrangos_comercial] = useState([
        { Sign: "I", Option: "EQ", Low: "", High: "" },
    ]);

    //----------------------------------------------------------------------------------------------------------------------------------

    //INPUT Organización ventas
    const [org_ventas, setorg_ventas] = useState([
        { Sign: "I", Option: "EQ", Low: "", High: "" },
    ]);
    const [org_ventas_desde, setorg_ventas_desde] = useState("");
    const [org_ventas_hasta, setorg_ventas_hasta] = useState("");
    //INPUT Cliente
    const [cliente, setcliente] = useState([
        { Sign: "I", Option: "EQ", Low: "", High: "" },
    ]);
    console.log("PRUEBA CLIENTE", cliente)
    const [cliente_desde, setcliente_desde] = useState("");
    const [cliente_hasta, setcliente_hasta] = useState("");
    //INPUT Creado el
    const [creado_el, setcreado_el] = useState([
        { Sign: "I", Option: "EQ", Low: "", High: "" },
    ]);
    const [creado_el_desde, setcreado_el_desde] = useState("");
    const [creado_el_hasta, setcreado_el_hasta] = useState("");
    //INPUT PUNTO EXP
    const [puntoexp, setpuntoexp] = useState([
        { Sign: "I", Option: "EQ", Low: "", High: "" },
    ]);
    const [puntoexp_desde, setpuntoexp_desde] = useState("");
    const [puntoexp_hasta, setpuntoexp_hasta] = useState("");
    //INPUT Documento comercial
    const [docu_comercial, setdocu_comercial] = useState([
        { Sign: "I", Option: "EQ", Low: "", High: "" },
    ]);
    const [docu_comercial_desde, setdocu_comercial_desde] = useState("");
    const [docu_comercial_hasta, setdocu_comercial_hasta] = useState("");
    //INPUT Oficina de ventas
    const [ofi_ventas, setofi_ventas] = useState([
        { Sign: "I", Option: "EQ", Low: "", High: "" },
    ]);
    const [ofi_ventas_desde, setofi_ventas_desde] = useState("");
    const [ofi_ventas_hasta, setofi_ventas_hasta] = useState("");
    //INPUT Comercial
    const [comercial, setcomercial] = useState([
        { Sign: "I", Option: "EQ", Low: "", High: "" },
    ]);
    const [comercial_desde, setcomercial_desde] = useState("");
    const [comercial_hasta, setcomercial_hasta] = useState("");
    const [comercial_desde_value, setcomercial_desde_value] = useState("");
    const [comercial_hasta_value, setcomercial_hasta_value] = useState("");

    //RESPONSE CONSULTA PEDIDO
    const [response_reporte_despacho, setresponse_reporte_despacho] = useState([]);
    //CARGA DE SPINNER
    const [spinner, setspinner] = useState(false);
    //CARGA DE SPINNER DE ACCESO DE RUTA
    const [spinnerroute, setspinnerroute] = useState(false);
    //NUMERO TOTAL DE DATOS
    const [TotalData, setTotalData] = useState();
    //ACTIVAR SECCION DE PAGINADO
    const [valuepagination, setvaluepagination] = useState(false);

    //ACTIVAR MODAL MATCHCODE ORGANIZACIÓN DE VENTAS
    const [showorgventa_desde, setshoworgventa_desde] = useState(false);
    const [showorgventa_hasta, setshoworgventa_hasta] = useState(false);
    //ACTIVAR MODAL MATCHCODE CLIENTE
    const [showcliente_desde, setshowcliente_desde] = useState(false);
    const [showcliente_hasta, setshowcliente_hasta] = useState(false);
    //ACTIVAR MODAL MATCHCODE PUNTO EXP.
    const [showpuntoexp_desde, setshowpuntoexp_desde] = useState(false);
    const [showpuntoexp_hasta, setshowpuntoexp_hasta] = useState(false);
    //ACTIVAR MODAL MATCHCODE OFICINA DE VENTAS
    const [showofiventa_desde, setshowofiventa_desde] = useState(false);
    const [showofiventa_hasta, setshowofiventa_hasta] = useState(false);
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

    //ALMACENA CHECKBOX MARCADOS INDIVIDUALMENTE PARA COMPARARLOS POR PAGINA BUSCADA Y MARCARLOS CON CHECK
    const [arraycheckbox, setarraycheckbox] = useState([]);
    const [arraycheckbox_export, setarraycheckbox_export] = useState([
        {
            columns: [
                {
                    title: "Cod. de Cliente",
                    style: { font: { sz: "18", bold: true } },
                    width: { wpx: 125 },
                },
                {
                    title: "Cliente",
                    style: { font: { sz: "18", bold: true } },
                    width: { wpx: 125 },
                },
                {
                    title: "Org. Venta",
                    style: { font: { sz: "18", bold: true } },
                    width: { wpx: 125 },
                },
                {
                    title: "Pedido",
                    style: { font: { sz: "18", bold: true } },
                    width: { wpx: 125 },
                },
                {
                    title: "Fecha Entrega",
                    style: { font: { sz: "18", bold: true } },
                    width: { wpx: 125 },
                },
                {
                    title: "Denominación",
                    style: { font: { sz: "18", bold: true } },
                    width: { wpx: 125 },
                },
                {
                    title: "Ctd. Ent.",
                    style: { font: { sz: "18", bold: true } },
                    width: { wpx: 125 },
                },
                {
                    title: "Lote",
                    style: { font: { sz: "18", bold: true } },
                    width: { wpx: 125 },
                },
                {
                    title: "Guía Remisión",
                    style: { font: { sz: "18", bold: true } },
                    width: { wpx: 125 },
                },
                {
                    title: "Cod. Transporte",
                    style: { font: { sz: "18", bold: true } },
                    width: { wpx: 125 },
                },
                {
                    title: "Transporte",
                    style: { font: { sz: "18", bold: true } },
                    width: { wpx: 125 },
                },
                {
                    title: "Fact/Bol.Vta.",
                    style: { font: { sz: "18", bold: true } },
                    width: { wpx: 125 },
                },
                {
                    title: "N° OC",
                    style: { font: { sz: "18", bold: true } },
                    width: { wpx: 125 },
                },
                {
                    title: "Centro",
                    style: { font: { sz: "18", bold: true } },
                    width: { wpx: 125 },
                },
                {
                    title: "Cod. Ofic",
                    style: { font: { sz: "18", bold: true } },
                    width: { wpx: 125 },
                },
                {
                    title: "Denom. Oficina",
                    style: { font: { sz: "18", bold: true } },
                    width: { wpx: 125 },
                },
                {
                    title: "Cod. Grup. Venta",
                    style: { font: { sz: "18", bold: true } },
                    width: { wpx: 125 },
                },
                {
                    title: "Grup. Venta",
                    style: { font: { sz: "18", bold: true } },
                    width: { wpx: 125 },
                },
                {
                    title: "Vendedor",
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
                    id_event: 7,
                    sales_ofi: ofi_ventas,
                    indicator: "WEB",
                });
            }
        });



    }, []);

    //useeffect modal rangos documento comercial
    useEffect(() => {
        // ind_rang.num
        // 1: creado el
        // 2: organizacion de ventas
        // 3: cliente
        // 4: punto exp
        switch (ind_rang.num) {
            case 1:
                setrangos_creado_el(rangos);
                RangosCreadoEl();
                break;
                break;
            case 2:
                setrangos_org_ventas(rangos);
                RangosOrganizacionVentas();
                break;
            case 3:
                setrangos_cliente(rangos);
                RangosCliente();
                break;
            case 4:
                setrangos_puntoexp(rangos);
                RangosPuntoExp();
                break;
            case 5:
                setrangos_doccomercial(rangos);
                RangosDocuComercial();
                break;
            case 6:
                setrangos_ofi_ventas(rangos);
                RangosOficinaVentas();
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
                setcol_11(0);
                setcol_12(0);
                setcol_13(0);
                setcol_14(0);
                setcol_15(0);
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
                setcol_11(0);
                setcol_12(0);
                setcol_13(0);
                setcol_14(0);
                setcol_15(0);
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
                setcol_11(0);
                setcol_12(0);
                setcol_13(0);
                setcol_14(0);
                setcol_15(0);
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
                setcol_11(0);
                setcol_12(0);
                setcol_13(0);
                setcol_14(0);
                setcol_15(0);
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
                setcol_11(0);
                setcol_12(0);
                setcol_13(0);
                setcol_14(0);
                setcol_15(0);
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
                setcol_11(0);
                setcol_12(0);
                setcol_13(0);
                setcol_14(0);
                setcol_15(0);
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
                setcol_11(0);
                setcol_12(0);
                setcol_13(0);
                setcol_14(0);
                setcol_15(0);
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
                setcol_11(0);
                setcol_12(0);
                setcol_13(0);
                setcol_14(0);
                setcol_15(0);
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
                setcol_11(0);
                setcol_12(0);
                setcol_13(0);
                setcol_14(0);
                setcol_15(0);
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
                setcol_11(0);
                setcol_12(0);
                setcol_13(0);
                setcol_14(0);
                setcol_15(0);
                break;
            case 11:
                setcol_1(0);
                setcol_2(0);
                setcol_3(0);
                setcol_4(0);
                setcol_5(0);
                setcol_6(0);
                setcol_7(0);
                setcol_8(0);
                setcol_9(0);
                setcol_10(0);
                setcol_12(0);
                setcol_13(0);
                setcol_14(0);
                setcol_15(0);
                break;
            case 12:
                setcol_1(0);
                setcol_2(0);
                setcol_3(0);
                setcol_4(0);
                setcol_5(0);
                setcol_6(0);
                setcol_7(0);
                setcol_8(0);
                setcol_9(0);
                setcol_10(0);
                setcol_11(0);
                setcol_13(0);
                setcol_14(0);
                setcol_15(0);
                break;
            case 13:
                setcol_1(0);
                setcol_2(0);
                setcol_3(0);
                setcol_4(0);
                setcol_5(0);
                setcol_6(0);
                setcol_7(0);
                setcol_8(0);
                setcol_9(0);
                setcol_10(0);
                setcol_11(0);
                setcol_12(0);
                setcol_14(0);
                setcol_15(0);
                break;
            case 14:
                setcol_1(0);
                setcol_2(0);
                setcol_3(0);
                setcol_4(0);
                setcol_5(0);
                setcol_6(0);
                setcol_7(0);
                setcol_8(0);
                setcol_9(0);
                setcol_10(0);
                setcol_11(0);
                setcol_12(0);
                setcol_13(0);
                setcol_15(0);
                break;
            case 15:
                setcol_1(0);
                setcol_2(0);
                setcol_3(0);
                setcol_4(0);
                setcol_5(0);
                setcol_6(0);
                setcol_7(0);
                setcol_8(0);
                setcol_9(0);
                setcol_10(0);
                setcol_11(0);
                setcol_12(0);
                setcol_13(0);
                setcol_14(0);
                break;
            default:
                break;
        }
    }

    function handleChangeColumna(num_col) {
        // 15 columnas
        switch (num_col) {
            // 1: ascendente
            // 0: descendente
            case 1:
                clearColumnsIcon(1);
                if (col_1 === 0) {
                    setcol_1(col_1 + 1);
                    setIsCampo("NAME1");
                    setIsOrden("0");
                    if (indicadorfiltro == true) {
                        buscar_filtro_fila(1, "NAME1", "0");
                    } else {
                        Search(1, 0, "NAME1", "0");
                    }
                } else if (col_1 === 1) {
                    setcol_1(col_1 + 1);
                    setIsCampo("NAME1");
                    setIsOrden("1");
                    if (indicadorfiltro == true) {
                        buscar_filtro_fila(1, "NAME1", "1");
                    } else {
                        Search(1, 0, "NAME1", "1");
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
                    setIsCampo("BSTKD");
                    setIsOrden("0");
                    if (indicadorfiltro == true) {
                        buscar_filtro_fila(1, "BSTKD", "0");
                    } else {
                        Search(1, 0, "BSTKD", "0");
                    }
                } else if (col_2 === 1) {
                    setcol_2(col_2 + 1);
                    // Search(1, 0, "VKORG", "1");
                    setIsCampo("BSTKD");
                    setIsOrden("1");
                    if (indicadorfiltro == true) {
                        buscar_filtro_fila(1, "BSTKD", "1");
                    } else {
                        Search(1, 0, "BSTKD", "1");
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
                    setIsCampo("AUBEL");
                    setIsOrden("0");
                    if (indicadorfiltro == true) {
                        buscar_filtro_fila(1, "AUBEL", "0");
                    } else {
                        Search(1, 0, "AUBEL", "0");
                    }
                } else if (col_4 === 1) {
                    setcol_4(col_4 + 1);
                    // Search(1, 0, "KUNNR", "1");
                    setIsCampo("AUBEL");
                    setIsOrden("1");
                    if (indicadorfiltro == true) {
                        buscar_filtro_fila(1, "AUBEL", "1");
                    } else {
                        Search(1, 0, "AUBEL", "1");
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
                    setIsCampo("XBLNR");
                    setIsOrden("0");
                    if (indicadorfiltro == true) {
                        buscar_filtro_fila(1, "XBLNR", "0");
                    } else {
                        Search(1, 0, "XBLNR", "0");
                    }
                } else if (col_5 === 1) {
                    setcol_5(col_5 + 1);
                    // Search(1, 0, "NAME1", "1");
                    setIsCampo("XBLNR");
                    setIsOrden("1");
                    if (indicadorfiltro == true) {
                        buscar_filtro_fila(1, "XBLNR", "1");
                    } else {
                        Search(1, 0, "XBLNR", "1");
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
                    setIsCampo("XBLNR1");
                    setIsOrden("0");
                    if (indicadorfiltro == true) {
                        buscar_filtro_fila(1, "XBLNR1", "0");
                    } else {
                        Search(1, 0, "XBLNR1", "0");
                    }
                } else if (col_6 === 1) {
                    setcol_6(col_6 + 1);
                    // Search(1, 0, "NETWR", "1");
                    setIsCampo("XBLNR1");
                    setIsOrden("1");
                    if (indicadorfiltro == true) {
                        buscar_filtro_fila(1, "XBLNR1", "1");
                    } else {
                        Search(1, 0, "XBLNR1", "1");
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
                    // Search(1, 0, "NTRANS", "0");
                    setIsCampo("NTRANS");
                    setIsOrden("0");
                    if (indicadorfiltro == true) {
                        buscar_filtro_fila(1, "NTRANS", "0");
                    } else {
                        Search(1, 0, "NTRANS", "0");
                    }
                } else if (col_7 === 1) {
                    setcol_7(col_7 + 1);
                    // Search(1, 0, "NTRANS", "1");
                    setIsCampo("NTRANS");
                    setIsOrden("1");
                    if (indicadorfiltro == true) {
                        buscar_filtro_fila(1, "NTRANS", "1");
                    } else {
                        Search(1, 0, "NTRANS", "1");
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
                    setIsCampo("VKORG");
                    setIsOrden("0");
                    if (indicadorfiltro == true) {
                        buscar_filtro_fila(1, "VKORG", "0");
                    } else {
                        Search(1, 0, "VKORG", "0");
                    }
                } else if (col_8 === 1) {
                    setcol_8(col_8 + 1);
                    // Search(1, 0, "TEXT1", "1");
                    setIsCampo("VKORG");
                    setIsOrden("1");
                    if (indicadorfiltro == true) {
                        buscar_filtro_fila(1, "VKORG", "1");
                    } else {
                        Search(1, 0, "VKORG", "1");
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
                    // Search(1, 0, "ARKTX", "0");
                    setIsCampo("ARKTX");
                    setIsOrden("0");
                    if (indicadorfiltro == true) {
                        buscar_filtro_fila(1, "ARKTX", "0");
                    } else {
                        Search(1, 0, "ARKTX", "0");
                    }
                } else if (col_9 === 1) {
                    setcol_9(col_9 + 1);
                    // Search(1, 0, "ARKTX", "1");
                    setIsCampo("ARKTX");
                    setIsOrden("1");
                    if (indicadorfiltro == true) {
                        buscar_filtro_fila(1, "ARKTX", "1");
                    } else {
                        Search(1, 0, "ARKTX", "1");
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
                    // Search(1, 0, "WERKS", "0");
                    setIsCampo("WERKS");
                    setIsOrden("0");
                    if (indicadorfiltro == true) {
                        buscar_filtro_fila(1, "WERKS", "0");
                    } else {
                        Search(1, 0, "WERKS", "0");
                    }
                } else if (col_10 === 1) {
                    setcol_10(col_10 + 1);
                    // Search(1, 0, "WERKS", "1");
                    setIsCampo("WERKS");
                    setIsOrden("1");
                    if (indicadorfiltro == true) {
                        buscar_filtro_fila(1, "WERKS", "1");
                    } else {
                        Search(1, 0, "WERKS", "1");
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
            case 11:
                clearColumnsIcon(11);
                if (col_11 === 0) {
                    setcol_11(col_11 + 1);
                    // Search(1, 0, "WERKS", "0");
                    setIsCampo("CHARG");
                    setIsOrden("0");
                    if (indicadorfiltro == true) {
                        buscar_filtro_fila(1, "CHARG", "0");
                    } else {
                        Search(1, 0, "CHARG", "0");
                    }
                } else if (col_11 === 1) {
                    setcol_11(col_11 + 1);
                    // Search(1, 0, "WERKS", "1");
                    setIsCampo("CHARG");
                    setIsOrden("1");
                    if (indicadorfiltro == true) {
                        buscar_filtro_fila(1, "CHARG", "1");
                    } else {
                        Search(1, 0, "CHARG", "1");
                    }
                } else {
                    setcol_11(0);
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
            case 12:
                clearColumnsIcon(12);
                if (col_12 === 0) {
                    setcol_12(col_12 + 1);
                    // Search(1, 0, "WERKS", "0");
                    setIsCampo("LFIMG");
                    setIsOrden("0");
                    if (indicadorfiltro == true) {
                        buscar_filtro_fila(1, "LFIMG", "0");
                    } else {
                        Search(1, 0, "LFIMG", "0");
                    }
                } else if (col_12 === 1) {
                    setcol_12(col_12 + 1);
                    // Search(1, 0, "WERKS", "1");
                    setIsCampo("LFIMG");
                    setIsOrden("1");
                    if (indicadorfiltro == true) {
                        buscar_filtro_fila(1, "LFIMG", "1");
                    } else {
                        Search(1, 0, "LFIMG", "1");
                    }
                } else {
                    setcol_12(0);
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
            case 13:
                clearColumnsIcon(13);
                if (col_13 === 0) {
                    setcol_13(col_13 + 1);
                    // Search(1, 0, "WERKS", "0");
                    setIsCampo("VKBURBEZEI ");
                    setIsOrden("0");
                    if (indicadorfiltro == true) {
                        buscar_filtro_fila(1, "VKBURBEZEI", "0");
                    } else {
                        Search(1, 0, "VKBURBEZEI", "0");
                    }
                } else if (col_13 === 1) {
                    setcol_13(col_13 + 1);
                    // Search(1, 0, "WERKS", "1");
                    setIsCampo("VKBURBEZEI");
                    setIsOrden("1");
                    if (indicadorfiltro == true) {
                        buscar_filtro_fila(1, "VKBURBEZEI", "1");
                    } else {
                        Search(1, 0, "VKBURBEZEI", "1");
                    }
                } else {
                    setcol_13(0);
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
            case 14:
                clearColumnsIcon(14);
                if (col_14 === 0) {
                    setcol_14(col_14 + 1);
                    // Search(1, 0, "WERKS", "0");
                    setIsCampo("VKGRPBEZEI  ");
                    setIsOrden("0");
                    if (indicadorfiltro == true) {
                        buscar_filtro_fila(1, "VKGRPBEZEI", "0");
                    } else {
                        Search(1, 0, "VKGRPBEZEI", "0");
                    }
                } else if (col_14 === 1) {
                    setcol_14(col_14 + 1);
                    // Search(1, 0, "WERKS", "1");
                    setIsCampo("VKGRPBEZEI");
                    setIsOrden("1");
                    if (indicadorfiltro == true) {
                        buscar_filtro_fila(1, "VKGRPBEZEI", "1");
                    } else {
                        Search(1, 0, "VKGRPBEZEI", "1");
                    }
                } else {
                    setcol_14(0);
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
            case 15:
                clearColumnsIcon(15);
                if (col_15 === 0) {
                    setcol_15(col_15 + 1);
                    // Search(1, 0, "WERKS", "0");
                    setIsCampo("SNAME");
                    setIsOrden("0");
                    if (indicadorfiltro == true) {
                        buscar_filtro_fila(1, "SNAME", "0");
                    } else {
                        Search(1, 0, "SNAME", "0");
                    }
                } else if (col_15 === 1) {
                    setcol_15(col_15 + 1);
                    // Search(1, 0, "WERKS", "1");
                    setIsCampo("SNAME");
                    setIsOrden("1");
                    if (indicadorfiltro == true) {
                        buscar_filtro_fila(1, "SNAME", "1");
                    } else {
                        Search(1, 0, "SNAME", "1");
                    }
                } else {
                    setcol_15(0);
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

    // Para el filtro
    function handleChangeFiltro(name, value) {
        switch (name) {
            case "f_name1Field":
                setf_name1Field(value);
                break;
            case "f_bstkdField":
                setf_bstkdField(value);
                break;
            case "f_erdatField":
                setf_erdatField(value);
                break;
            case "f_aubelField":
                setf_aubelField(value);
                break;
            case "f_xblnrField":
                setf_xblnrField(value);
                break;
            case "f_xblnr1Field":
                setf_xblnr1Field(value);
                break;
            case "f_ntransField":
                setf_ntransField(value);
                break;
            case "f_vkorgField":
                setf_vkorgField(value);
                break;
            case "f_arktxField":
                setf_arktxField(value);
                break;
            case "f_werksField":
                setf_werksField(value);
                break;
            case "f_chargField":
                setf_chargField(value);
                break;
            case "f_lfimgField":
                setf_lfimgField(value);
                break;
            case "f_vkburbezeiField":
                setf_vkburbezeiField(value);
                break;
            case "f_vkgrpbezeiField":
                setf_vkgrpbezeiField(value);
                break;
            case "f_snameField":
                setf_snameField(value);
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

    // Funcion Rangos organizacion ventas
    function RangosOrganizacionVentas() {
        console.log(org_ventas)
        console.log(rangos_org_ventas)
        if (rangos_org_ventas.length === 1) {
            if (
                rangos_org_ventas[0].Low.trim() === "" &&
                rangos_org_ventas[0].High.trim() === ""

            ) {
                // org_ventas.length = 0
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

    // Funcion Rangos punto exp
    function RangosPuntoExp() {
        console.log("rangos punto exp");
        if (rangos_puntoexp.length === 1) {
            if (
                rangos_puntoexp[0].Low.trim() === "" &&
                rangos_puntoexp[0].High.trim() === ""
            ) {
                return puntoexp;
            } else {
                setpuntoexp_desde(rangos_puntoexp[0].Low);
                setpuntoexp_hasta(rangos_puntoexp[0].High);
                return rangos_puntoexp;
            }
        } else {
            setpuntoexp_desde(rangos_puntoexp[0].Low);
            setpuntoexp_hasta(rangos_puntoexp[0].High);
            return rangos_puntoexp;
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
        setcol_10(0);
        setcol_11(0);
        setcol_12(0);
        setcol_13(0);
        setcol_14(0);
        setcol_15(0);
    }

    function Search(page, ind, IsCampo, IsOrden) {
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

        let model_repor_despacho = {
            IsCampo: IsCampo,
            IsOrden: IsOrden,
            IsNpag: page,
            IsRegxpag: IsRegxpag,
            IsExport: "",
            // IsUser: jwt(localStorage.getItem("_token")).username,
            IsBukrs: IsBukrs,
            ItErdat: (creado_el_desde || creado_el_hasta) !== "" ?
                RangosCreadoEl() : [],
            // ItKunnr: cliente[0].Low == "" ? (
            // (cliente_desde || cliente_hasta) !== "" ?
            //     RangosCliente() : []) : cliente,
            ItKunnr: (cliente_desde || cliente_hasta) !== "" ?
                RangosCliente() : [],
            //ItVbeln: [],
            //RangosDocuComercial(), //NÚMERO DE PEDIDO
            ItVkorg: (org_ventas_desde || org_ventas_hasta) !== "" ?
                RangosOrganizacionVentas() : [],
            ItVstel: (puntoexp_desde || puntoexp_hasta) !== "" ?
                RangosPuntoExp() : [],
            ItFilter: [],
            ItAubel: (docu_comercial_desde || docu_comercial_hasta) !== "" ?
                RangosDocuComercial() : [],
            ItVkbur: (ofi_ventas_desde || ofi_ventas_hasta) !== "" ?
                RangosOficinaVentas() : [],
            ItPernr: (comercial_desde_value || comercial_hasta_value) !== "" ?
                RangosComercial() : [],
            IsUser: jwt(localStorage.getItem("_token")).username,
        };
        console.log("PRUEBITA", model_repor_despacho)
        setmodel_reportedespacho(model_repor_despacho);

        if (ind == 0) {
            Exportar();

            // setarraycheckbox([]);
            arraycheckbox_export[0].data = [];
            // console.log(model_consulta_pedido);
            setresponse_reporte_despacho([]);
            ConsultaReporteDespacho(model_repor_despacho).then((result) => {
                // document.getElementById("checkbox-consultapedido-head").disabled=false;
                setresponse_reporte_despacho(
                    result.etPedidosField.map((d) => {
                        return {
                            select: true,
                            kunnrField: d.kunnrField,
                            name1Field: d.name1Field,
                            bstkdField: d.bstkdField,
                            erdatField: d.erdatField,
                            aubelField: d.aubelField,
                            xblnrField: d.xblnrField,
                            xblnr1Field: d.xblnr1Field,
                            ctransField: d.ctransField,
                            ntransField: d.ntransField,
                            vkorgField: d.vkorgField,
                            arktxField: d.arktxField,
                            werksField: d.werksField,
                            chargField: d.chargField,
                            lfimgField: d.lfimgField,
                            vkburField: d.vkburField,
                            vkburbezeiField: d.vkburbezeiField,
                            vkgrpField: d.vkgrpField,
                            vkgrpbezeiField: d.vkgrpbezeiField,
                            snameField: d.snameField,
                        };
                    })
                );
                setTotalData(result.esRegtotField);
                setspinner(false);
                setvaluepagination(true);
            });
        } else {
            ConsultaReporteDespacho(model_repor_despacho).then((result) => {
                // document.getElementById("checkbox-consultapedido-head").disabled=false;

                if (stateChecboxHeader === true) {
                    setresponse_reporte_despacho(
                        result.etPedidosField.map((d) => {
                            
                            return {
                                select: true,
                                kunnrField: d.kunnrField,
                                name1Field: d.name1Field,
                                bstkdField: d.bstkdField,
                                erdatField: d.erdatField,
                                aubelField: d.aubelField,
                                xblnrField: d.xblnrField,
                                xblnr1Field: d.xblnr1Field,
                                ctransField: d.ctransField,
                                ntransField: d.ntransField,
                                vkorgField: d.vkorgField,
                                arktxField: d.arktxField,
                                werksField: d.werksField,
                                chargField: d.chargField,
                                lfimgField: d.lfimgField,
                                vkburField: d.vkburField,
                                vkburbezeiField: d.vkburbezeiField,
                                vkgrpField: d.vkgrpField,
                                vkgrpbezeiField: d.vkgrpbezeiField,
                                snameField: d.snameField,

                            };
                        })
                    );

                    // CAMBIAR EL "vbelnField"

                    // for (let i = 0; i < result.etPedidosField.length; i++) {
                    //     document.getElementById(
                    //         "checkbox-body-" + result.etPedidosField[i].name1Field
                    //     ).checked = true;
                    // }
                } else {
                    setresponse_reporte_despacho(
                        result.etPedidosField.map((d) => {
                            return {
                                select: true,
                                kunnrField: d.kunnrField,
                                name1Field: d.name1Field,
                                bstkdField: d.bstkdField,
                                erdatField: d.erdatField,
                                aubelField: d.aubelField,
                                xblnrField: d.xblnrField,
                                xblnr1Field: d.xblnr1Field,
                                ctransField: d.ctransField,
                                ntransField: d.ntransField,
                                vkorgField: d.vkorgField,
                                arktxField: d.arktxField,
                                werksField: d.werksField,
                                chargField: d.chargField,
                                lfimgField: d.lfimgField,
                                vkburField: d.vkburField,
                                vkburbezeiField: d.vkburbezeiField,
                                vkgrpField: d.vkgrpField,
                                vkgrpbezeiField: d.vkgrpbezeiField,
                                snameField: d.snameField,

                               
                            };
                            
                        })
                    );

                    // CORREGIR vbelnField

                    for (let i = 0; i < result.etPedidosField.length; i++) {
                        document.getElementById(
                            "checkbox-body-" + result.etPedidosField[i].name1Field
                        ).checked = false;
                    }
                }

                for (let y = 0; y < result.etPedidosField.length; y++) {
                    if (arraycheckbox.length > 0) {
                        for (let i = 0; i < arraycheckbox.length; i++) {
                            if (
                                result.etPedidosField[y].name1Field ==
                                arraycheckbox[i].name1Field
                            ) {
                                document.getElementById(
                                    "checkbox-body-" + result.etPedidosField[y].name1Field
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

    function Search_02(page, ind, IsCampo, IsOrden, numdatos) {
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

        let model_repor_despacho = {
            IsCampo: IsCampo,
            IsOrden: IsOrden,
            IsNpag: page,
            IsRegxpag: numdatos,
            IsExport: "",
            // IsUser: jwt(localStorage.getItem("_token")).username,
            IsBukrs: IsBukrs,
            ItErdat: (creado_el_desde || creado_el_hasta) !== "" ?
                RangosCreadoEl() : [],
            ItKunnr: (cliente_desde || cliente_hasta) !== "" ?
                RangosCliente() : [],
            //ItVbeln: [],
            //RangosDocuComercial(), //NÚMERO DE PEDIDO
            ItVkorg: (org_ventas_desde || org_ventas_hasta) !== "" ?
                RangosOrganizacionVentas() : [],
            ItVstel: (puntoexp_desde || puntoexp_hasta) !== "" ?
                RangosPuntoExp() : [],
            ItFilter: [],
            ItAubel: (docu_comercial_desde || docu_comercial_hasta) !== "" ?
                RangosDocuComercial() : [],
            ItVkbur: (ofi_ventas_desde || ofi_ventas_hasta) !== "" ?
                RangosOficinaVentas() : [],
            ItPernr: (comercial_desde_value || comercial_hasta_value) !== "" ?
                RangosComercial() : [],
            IsUser: jwt(localStorage.getItem("_token")).username,
        };
        console.log(model_repor_despacho)
        setmodel_reportedespacho(model_repor_despacho);

        if (ind == 0) {
            Exportar();

            // setarraycheckbox([]);
            arraycheckbox_export[0].data = [];
            // console.log(model_consulta_pedido);
            setresponse_reporte_despacho([]);
            ConsultaReporteDespacho(model_repor_despacho).then((result) => {
                // document.getElementById("checkbox-consultapedido-head").disabled=false;
                setresponse_reporte_despacho(
                    result.etPedidosField.map((d) => {
                        return {
                            select: true,
                            kunnrField: d.kunnrField,
                            name1Field: d.name1Field,
                            bstkdField: d.bstkdField,
                            erdatField: d.erdatField,
                            aubelField: d.aubelField,
                            xblnrField: d.xblnrField,
                            xblnr1Field: d.xblnr1Field,
                            ctransField: d.ctransField,
                            ntransField: d.ntransField,
                            vkorgField: d.vkorgField,
                            arktxField: d.arktxField,
                            werksField: d.werksField,
                            chargField: d.chargField,
                            lfimgField: d.lfimgField,
                            vkburField: d.vkburField,
                            vkburbezeiField: d.vkburbezeiField,
                            vkgrpField: d.vkgrpField,
                            vkgrpbezeiField: d.vkgrpbezeiField,
                            snameField: d.snameField,
                        };
                    })
                );
                setTotalData(result.esRegtotField);
                setspinner(false);
                setvaluepagination(true);
            });
        } else {
            ConsultaReporteDespacho(model_repor_despacho).then((result) => {
                // document.getElementById("checkbox-consultapedido-head").disabled=false;

                if (stateChecboxHeader === true) {
                    setresponse_reporte_despacho(
                        result.etPedidosField.map((d) => {
                            return {
                                select: true,
                                kunnrField: d.kunnrField,
                                name1Field: d.name1Field,
                                bstkdField: d.bstkdField,
                                erdatField: d.erdatField,
                                aubelField: d.aubelField,
                                xblnrField: d.xblnrField,
                                xblnr1Field: d.xblnr1Field,
                                ctransField: d.ctransField,
                                ntransField: d.ntransField,
                                vkorgField: d.vkorgField,
                                arktxField: d.arktxField,
                                werksField: d.werksField,
                                chargField: d.chargField,
                                lfimgField: d.lfimgField,
                                vkburField: d.vkburField,
                                vkburbezeiField: d.vkburbezeiField,
                                vkgrpField: d.vkgrpField,
                                vkgrpbezeiField: d.vkgrpbezeiField,
                                snameField: d.snameField,

                            };
                        })
                    );

                    // CAMBIAR EL "vbelnField"

                    for (let i = 0; i < result.etPedidosField.length; i++) {
                        document.getElementById(
                            "checkbox-body-" + result.etPedidosField[i].name1Field
                        ).checked = true;
                    }
                } else {
                    setresponse_reporte_despacho(
                        result.etPedidosField.map((d) => {
                            return {
                                select: true,
                                kunnrField: d.kunnrField,
                                name1Field: d.name1Field,
                                bstkdField: d.bstkdField,
                                erdatField: d.erdatField,
                                aubelField: d.aubelField,
                                xblnrField: d.xblnrField,
                                xblnr1Field: d.xblnr1Field,
                                ctransField: d.ctransField,
                                ntransField: d.ntransField,
                                vkorgField: d.vkorgField,
                                arktxField: d.arktxField,
                                werksField: d.werksField,
                                chargField: d.chargField,
                                lfimgField: d.lfimgField,
                                vkburField: d.vkburField,
                                vkburbezeiField: d.vkburbezeiField,
                                vkgrpField: d.vkgrpField,
                                vkgrpbezeiField: d.vkgrpbezeiField,
                                snameField: d.snameField,
                            };
                        })
                    );

                    // CORREGIR vbelnField

                    for (let i = 0; i < result.etPedidosField.length; i++) {
                        document.getElementById(
                            "checkbox-body-" + result.etPedidosField[i].name1Field
                        ).checked = false;
                    }
                }

                for (let y = 0; y < result.etPedidosField.length; y++) {
                    if (arraycheckbox.length > 0) {
                        for (let i = 0; i < arraycheckbox.length; i++) {
                            if (
                                result.etPedidosField[y].name1Field ==
                                arraycheckbox[i].name1Field
                            ) {
                                document.getElementById(
                                    "checkbox-body-" + result.etPedidosField[y].name1Field
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

    function Exportar() {
        let model_reporte_exportar = {
            IsCampo: IsCampo,
            IsOrden: IsOrden,
            IsNpag: "",
            IsRegxpag: "",
            IsExport: "X",
            IsBukrs: IsBukrs,
            ItErdat: (creado_el_desde || creado_el_hasta) !== "" ?
                RangosCreadoEl() : [],
            ItKunnr: (cliente_desde || cliente_hasta) !== "" ?
                RangosCliente() : [],
            //ItVbeln: [],
            //RangosDocuComercial(), //NÚMERO DE PEDIDO
            ItVkorg: (org_ventas_desde || org_ventas_hasta) !== "" ?
                RangosOrganizacionVentas() : [],
            ItVstel: (puntoexp_desde || puntoexp_hasta) !== "" ?
                RangosPuntoExp() : [],
            ItFilter: mostrar_filtro_fila == true ? [
                {
                    Knnur: "",
                    Name1: f_name1Field,
                    Bstkd: f_bstkdField,
                    Erdat: formatDateSAP(f_erdatField),
                    Aubel: f_aubelField,
                    Xblnr: f_xblnrField,
                    Xblnr1: f_xblnr1Field,
                    Ctrans: "",
                    Ntrans: f_ntransField,
                    Vkorg: f_vkorgField,
                    Arktx: f_arktxField,
                    Werks: f_werksField,
                    Charg: f_chargField,
                    Lfimg: f_lfimgField !== "" ?
                        Number(f_lfimgField).toFixed(1) : 0,
                    Vkbur: "",
                    Vkburbezei: f_vkburbezeiField,
                    Vkgrp: "",
                    Vkgrpbezei: f_vkgrpbezeiField,
                    Sname: f_snameField,
                },
            ] : [],
            ItAubel: (docu_comercial_desde || docu_comercial_hasta) !== "" ?
                RangosDocuComercial() : [],
            ItVkbur: (ofi_ventas_desde || ofi_ventas_hasta) !== "" ?
                RangosOficinaVentas() : [],
            ItPernr: (comercial_desde_value || comercial_hasta_value) !== "" ?
                RangosComercial() : [],
            IsUser: jwt(localStorage.getItem("_token")).username,
        };
        console.log("MODEL REPORTE EXPORTAR", model_reporte_exportar);

        if (
            creado_el[0].Low.trim() != "" ||
            cliente[0].Low.trim() != "" ||
            org_ventas[0].Low.trim() != ""
        ) {
            ConsultaReporteDespacho(model_reporte_exportar)
                .then((result) => {
                    setDataSet([
                        {
                            columns: [
                                {
                                    title: "Cod. de Cliente",
                                    style: { font: { sz: "18", bold: true } },
                                    width: { wpx: 125 },
                                },
                                {
                                    title: "Cliente",
                                    style: { font: { sz: "18", bold: true } },
                                    width: { wpx: 125 },
                                },
                                {
                                    title: "Org. Venta",
                                    style: { font: { sz: "18", bold: true } },
                                    width: { wpx: 125 },
                                },
                                {
                                    title: "Pedido",
                                    style: { font: { sz: "18", bold: true } },
                                    width: { wpx: 125 },
                                },
                                {
                                    title: "Fecha Entrega",
                                    style: { font: { sz: "18", bold: true } },
                                    width: { wpx: 125 },
                                },
                                {
                                    title: "Denominación",
                                    style: { font: { sz: "18", bold: true } },
                                    width: { wpx: 125 },
                                },
                                {
                                    title: "Ctd. Ent.",
                                    style: { font: { sz: "18", bold: true } },
                                    width: { wpx: 125 },
                                },
                                {
                                    title: "Lote",
                                    style: { font: { sz: "18", bold: true } },
                                    width: { wpx: 125 },
                                },
                                {
                                    title: "Guía Remisión",
                                    style: { font: { sz: "18", bold: true } },
                                    width: { wpx: 125 },
                                },
                                {
                                    title: "Cod. Transporte",
                                    style: { font: { sz: "18", bold: true } },
                                    width: { wpx: 125 },
                                },
                                {
                                    title: "Transporte",
                                    style: { font: { sz: "18", bold: true } },
                                    width: { wpx: 125 },
                                },
                                {
                                    title: "Fact/Bol.Vta.",
                                    style: { font: { sz: "18", bold: true } },
                                    width: { wpx: 125 },
                                },
                                {
                                    title: "N° OC",
                                    style: { font: { sz: "18", bold: true } },
                                    width: { wpx: 125 },
                                },
                                {
                                    title: "Centro",
                                    style: { font: { sz: "18", bold: true } },
                                    width: { wpx: 125 },
                                },
                                {
                                    title: "Cod. Ofic",
                                    style: { font: { sz: "18", bold: true } },
                                    width: { wpx: 125 },
                                },
                                {
                                    title: "Denom. Oficina",
                                    style: { font: { sz: "18", bold: true } },
                                    width: { wpx: 125 },
                                },
                                {
                                    title: "Cod. Grup. Venta",
                                    style: { font: { sz: "18", bold: true } },
                                    width: { wpx: 125 },
                                },
                                {
                                    title: "Grup. Venta",
                                    style: { font: { sz: "18", bold: true } },
                                    width: { wpx: 125 },
                                },
                                {
                                    title: "Vendedor",
                                    style: { font: { sz: "18", bold: true } },
                                    width: { wpx: 125 },
                                },
                            ],
                            data: result.etPedidosField.map((data) => {
                                return [
                                    { value: data.kunnrField, style: { font: { sz: "14" } } },
                                    { value: data.name1Field, style: { font: { sz: "14" } } },
                                    { value: data.vkorgField, style: { font: { sz: "14" } } },
                                    { value: data.aubelField, style: { font: { sz: "14" } } },
                                    { value: formatFecha(data.erdatField), style: { font: { sz: "14" } } },
                                    { value: data.arktxField, style: { font: { sz: "14" } } },
                                    { value: data.lfimgField, style: { font: { sz: "14" } } },
                                    { value: data.chargField, style: { font: { sz: "14" } } },
                                    { value: data.xblnrField, style: { font: { sz: "14" } } },
                                    { value: data.ctransField, style: { font: { sz: "14" } } },
                                    { value: data.ntransField, style: { font: { sz: "14" } } },
                                    { value: data.xblnr1Field, style: { font: { sz: "14" } } },
                                    { value: data.bstkdField, style: { font: { sz: "14" } } },
                                    { value: data.werksField, style: { font: { sz: "14" } } },
                                    { value: data.vkburField, style: { font: { sz: "14" } } },
                                    { value: data.vkburbezeiField, style: { font: { sz: "14" } } },
                                    { value: data.vkgrpField, style: { font: { sz: "14" } } },
                                    { value: data.vkgrpbezeiField, style: { font: { sz: "14" } } },
                                    { value: data.snameField, style: { font: { sz: "14" } } },
                                ];
                            }),
                        },
                    ]);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }

    //INPUT organización de ventas
    function mc_org_ventas_desde() {
        setshoworgventa_desde((prev) => !prev);
    }
    function mc_org_ventas_hasta() {
        setshoworgventa_hasta((prev) => !prev);
    }

    //INPUT cliente
    function mc_cliente_desde() {
        if ((org_ventas_desde == "") && (org_ventas_hasta == "")) {
            toast.error("Debe seleccionar una \"Org. Ventas\" .", {
                position: "top-center",
                autoClose: 1000,
                style: {
                    backgroundColor: "#212121",
                    color: "#fff",
                }
            })

        }
        else if (org_ventas_desde != "" || org_ventas_hasta != "") {
            setshowcliente_desde((prev) => !prev);
            setcliente([{ Sign: "I", Option: "EQ", Low: "", High: "" }]);
            setcliente_desde('');
        }

    }
    function mc_cliente_hasta() {
        if ((org_ventas_desde == "") && (org_ventas_hasta == "")) {
            toast.error("Debe seleccionar una \"Org. Ventas\" .", {
                position: "top-center",
                autoClose: 1000,
                style: {
                    backgroundColor: "#212121",
                    color: "#fff",
                }
            })

        }
        else if (org_ventas_desde != "" || org_ventas_hasta != "") {
            setshowcliente_hasta((prev) => !prev);
        }

    }

    // INPUT punto exp
    function mc_puntoexp_desde() {
        setshowpuntoexp_desde((prev) => !prev);
    }
    function mc_puntoexp_hasta() {
        setshowpuntoexp_hasta((prev) => !prev);
    }

    //INPUT oficina de ventas
    function mc_ofi_ventas_desde() {
        setshowofiventa_desde((prev) => !prev);
    }
    function mc_ofi_ventas_hasta() {
        setshowofiventa_hasta((prev) => !prev);
    }

    //INPUT comercial
    function mc_comercial_desde() {
        setshowcomercial_desde((prev) => !prev);
    }
    function mc_comercial_hasta() {
        setshowcomercial_hasta((prev) => !prev);
    }

    function handleChange(name, value) {
        console.log(name, value)
        switch (name) {
            case "id_role":
                setIsRegxpag(value);
                Search_02(1, 0, "", "", value);
                setshowModalPagina((prev) => !prev);
                break;
            case "num_datos_pagina":
                setDatosxpagina(value);
                break;
            case "sociedad":
                setIsBukrs(value);
                break;
            //organizacion de ventas
            case "org_ventas":
                setorg_ventas([{ Sign: "I", Option: "EQ", Low: "", High: "" }]);
                //setorg_ventas([]);
                break;
            case "org_ventas_desde":
                setorg_ventas_desde(value);
                if (value.trim() != "") {
                    setorg_ventas_desde(value.toUpperCase());
                    if (org_ventas_hasta == "") {
                        setorg_ventas([
                            {
                                Sign: "I",
                                Option: "EQ",
                                Low: value.toUpperCase(),
                                High: "",
                            },
                        ]);
                    } else {
                        setorg_ventas([
                            {
                                Sign: "I",
                                Option: "BT",
                                Low: value.toUpperCase(),
                                High: org_ventas_hasta,
                            },
                        ]);
                    }
                } else {
                    setorg_ventas_desde(value.toUpperCase());
                    if (org_ventas_hasta != "") {
                        setorg_ventas([
                            { Sign: "I", Option: "EQ", Low: "", High: org_ventas_hasta },
                        ]);
                    } else {
                        setorg_ventas([{ Sign: "", Option: "", Low: "", High: "" }]);
                        //setorg_ventas([]);
                    }
                }
                break;
            case "org_ventas_hasta":
                setorg_ventas_hasta(value.toUpperCase());
                if (value.trim() != "") {
                    if (org_ventas_desde == "") {
                        setorg_ventas([
                            {
                                Sign: "I",
                                Option: "EQ",
                                Low: "",
                                High: value.toUpperCase(),
                            },
                        ]);
                    } else {
                        setorg_ventas([
                            {
                                Sign: "I",
                                Option: "BT",
                                Low: org_ventas_desde,
                                High: value.toUpperCase(),
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
                        // setorg_ventas([]);
                    }
                }
                break;

            //cliente
            case "cliente":
                setcliente([{ Sign: "I", Option: "EQ", Low: "", High: "" }]);
                //setcliente([]);
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
                    }
                    else {
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
                    }
                    else {
                        setcliente([{ Sign: "", Option: "", Low: "", High: "" }]);
                    }
                }
                break;



            //punto exp
            case "puntoexp":
                setpuntoexp([{ Sign: "I", Option: "EQ", Low: "", High: "" }]);
                //setcliente([]);
                break;
            case "puntoexp_desde":
                setpuntoexp_desde(value);
                if (value.trim() != "") {
                    if (puntoexp_hasta == "") {
                        setpuntoexp([{ Sign: "I", Option: "EQ", Low: value, High: "" }]);
                    } else {
                        setpuntoexp([
                            {
                                Sign: "I",
                                Option: "BT",
                                Low: value,
                                High: puntoexp_hasta,
                            },
                        ]);
                    }
                } else {
                    if (puntoexp_hasta != "") {
                        setpuntoexp([
                            { Sign: "I", Option: "EQ", Low: "", High: puntoexp_hasta },
                        ]);
                    } else {
                        setpuntoexp([{ Sign: "", Option: "", Low: "", High: "" }]);
                    }
                }
                break;
            case "puntoexp_hasta":
                setpuntoexp_hasta(value);
                if (value.trim() != "") {
                    if (puntoexp_desde == "") {
                        setpuntoexp([{ Sign: "I", Option: "EQ", Low: "", High: value }]);
                    } else {
                        setpuntoexp([
                            {
                                Sign: "I",
                                Option: "BT",
                                Low: puntoexp_desde,
                                High: value,
                            },
                        ]);
                    }
                } else {
                    if (puntoexp_desde != "") {
                        setpuntoexp([
                            { Sign: "I", Option: "EQ", Low: puntoexp_desde, High: "" },
                        ]);
                    } else {
                        setpuntoexp([{ Sign: "", Option: "", Low: "", High: "" }]);
                    }
                }
                break;

            //creado el
            case "creado_el":
                setcreado_el([{ Sign: "I", Option: "EQ", Low: "", High: "" }]);
                //setcreado_el([]);
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
                        setcomercial([{ Sign: "", Option: "", Low: "", High: "" }]);
                    }
                }
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
        if (value == "") {
            return ""
        } else {
            var datePart = value.match(/\d+/g),
                year = datePart[0],
                month = datePart[1],
                day = datePart[2];

            return year + "" + month + "" + day;
        }

    }

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
        setresponse_reporte_despacho([]);
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
        setresponse_reporte_despacho([]);

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
        setresponse_reporte_despacho([]);

        if (indicadorfiltro == false) {
            Search(value + 1, 1, IsCampo, IsOrden);
        } else {
            setmodel_filtro({ ...model_filtro, IsNpag: value + 1 });
            // SearchFiltro();
            buscar_filtro_fila(value + 1, IsCampo, IsOrden);
        }
    }
    const ChangeBusquedaMult_CreadoEl = () => {
        setrangos(rangos_creado_el);
        settype_input("date");
        setind_rang({ num: 1, bool: true });
        setshowBusMult(true);
    };

    const ChangeBusquedaMult_OrganizacionVentas = () => {
        setrangos(rangos_org_ventas);
        settype_input("text");
        setind_rang({ num: 2, bool: true });
        setshowBusMult(true);
    };

    const ChangeBusquedaMult_Cliente = () => {
        setrangos(rangos_cliente);
        settype_input("text");
        setind_rang({ num: 3, bool: true });
        setshowBusMult(true);
    };
    const ChangeBusquedaMult_PuntoExp = () => {
        setrangos(rangos_puntoexp);
        settype_input("text");
        setind_rang({ num: 4, bool: true });
        setshowBusMult(true);
    };

    const ChangeBusquedaMult_DocComercial = () => {
        setrangos(rangos_doccomercial);
        settype_input("text");
        setind_rang({ num: 5, bool: true });
        setshowBusMult(true);
    };
    //  CAMBIAR NUM
    const ChangeBusquedaMult_OficinaVentas = () => {
        setrangos(rangos_ofi_ventas);
        settype_input("text");
        setind_rang({ num: 6, bool: true });
        setshowBusMult(true);
    };

    const ChangeBusquedaMult_Comercial = () => {
        setrangos(rangos_comercial);
        settype_input("text");
        setind_rang({ num: 7, bool: true });
        setshowBusMult(true);
    };

    function Clear() {
        setmostrar_filtro_fila(false);
        setrangos_cliente([{ Sign: "I", Option: "EQ", Low: "", High: "" }]);
        setrangos_creado_el([{ Sign: "I", Option: "EQ", Low: "", High: "" }]);
        setrangos_org_ventas([{ Sign: "I", Option: "EQ", Low: "", High: "" }]);
        setrangos_comercial([{ Sign: "I", Option: "EQ", Low: "", High: "" }]);
        setrangos_doccomercial([{ Sign: "I", Option: "EQ", Low: "", High: "" }]);
        setrangos_ofi_ventas([{ Sign: "I", Option: "EQ", Low: "", High: "" }]);
        setvaluepagination(false);
        setresponse_reporte_despacho([]);

        handleChange("creado_el", "");
        setcreado_el_desde("");
        setcreado_el_hasta("");

        handleChange("comercial", "");
        setcomercial_desde("");
        setcomercial_hasta("");
        setcomercial_desde_value("");
        setcomercial_hasta_value("");

        handleChange("ofi_ventas", "");
        setofi_ventas_desde("");
        setofi_ventas_hasta("");

        handleChange("docu_comercial", "");
        setdocu_comercial_desde("");
        setdocu_comercial_hasta("");

        handleChange("org_ventas", "");
        setorg_ventas_desde("");
        setorg_ventas_hasta("");

        handleChange("cliente", "");
        setcliente_desde("");
        setcliente_hasta("");

        handleChange("puntoexp", "");
        setpuntoexp_desde("");
        setpuntoexp_hasta("");
    }

    function onClickHeaderCheckbox(e) {
        console.log("check");
        setstateChecboxHeader(e.target.checked);
        if (e.target.checked === true) {
            
            for (let i = 0; i < response_reporte_despacho.length; i++) {
               
                document.getElementById(
                    "checkbox-body-" + response_reporte_despacho[i].name1Field
                ).checked = true;
                arraycheckbox_export[0].data = []
            }
                
           
        } else {
            // response_reporte_despacho.map((response,key) => {
            for (let i = 0; i < response_reporte_despacho.length; i++) {
                document.getElementById(
                    "checkbox-body-" + response_reporte_despacho[i].name1Field
                ).checked = false;
            }
        // })
        }
    }

    function ordenamiento(d) {
        arraycheckbox_export[0].data.push([
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
                value: d.bstkdField,
                style: {
                    font: { sz: "14" },
                },
            },
            {
                value: formatFecha(d.erdatField),
                style: {
                    font: { sz: "14" },
                },
            },
            {
                value: d.aubelField,
                style: {
                    font: { sz: "14" },
                },
            },
            {
                value: d.xblnrField,
                style: {
                    font: { sz: "14" },
                },
            },
            {
                value: d.xblnr1Field,
                style: {
                    font: { sz: "14" },
                },
            },
            {
                value: d.ctransField,
                style: {
                    font: { sz: "14" },
                },
            },
            {
                value: d.ntransField,
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
                value: d.arktxField,
                style: {
                    font: { sz: "14" },
                },
            },
            {
                value: d.werksField,
                style: {
                    font: { sz: "14" },
                },
            },
            {
                value: d.chargField,
                style: {
                    font: { sz: "14" },
                },
            },
            {
                value: convertDecimal(d.lfimgField, 2),
                style: {
                    font: { sz: "14" },
                },
            },
            {
                value: d.vkburField,
                style: {
                    font: { sz: "14" },
                },
            },
            {
                value: d.vkburbezeiField,
                style: {
                    font: { sz: "14" },
                },
            },
            {
                value: d.vkgrpField,
                style: {
                    font: { sz: "14" },
                },
            },
            {
                value: d.vkgrpbezeiField,
                style: {
                    font: { sz: "14" },
                },
            },
            {
                value: d.snameField,
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
        setf_name1Field("");
        setf_bstkdField("");
        setf_erdatField("");
        setf_aubelField("");
        setf_xblnrField("");
        setf_xblnr1Field("");
        setf_ntransField("");
        setf_vkorgField("");
        setf_arktxField("");
        setf_werksField("");
        setf_chargField("");
        setf_lfimgField("");
        setf_vkburbezeiField("");
        setf_vkgrpbezeiField("");
        setf_snameField("");
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

        let model_repor_despacho_filtro = {
            IsCampo: IsCampo,
            IsOrden: IsOrden,
            IsNpag: pageNumber,
            IsRegxpag: IsRegxpag,
            IsExport: "",
            // IsUser: jwt(localStorage.getItem("_token")).username,
            IsBukrs: IsBukrs,
            ItErdat: (creado_el_desde || creado_el_hasta) !== "" ?
                RangosCreadoEl() : [],
            ItKunnr: (cliente_desde || cliente_hasta) !== "" ?
                RangosCliente() : [],
            // ItVbeln: [],
            //RangosDocuComercial(), //NÚMERO DE PEDIDO
            ItVkorg: (org_ventas_desde || org_ventas_hasta) !== "" ?
                RangosOrganizacionVentas() : [],
            ItVstel: (puntoexp_desde || puntoexp_hasta) !== "" ?
                RangosPuntoExp() : [],
            ItFilter: [
                {
                    Knnur: "",
                    Name1: f_name1Field,
                    Bstkd: f_bstkdField,
                    Erdat: formatDateSAP(f_erdatField),
                    Aubel: f_aubelField,
                    Xblnr: f_xblnrField,
                    Xblnr1: f_xblnr1Field,
                    Ctrans: "",
                    Ntrans: f_ntransField,
                    Vkorg: f_vkorgField,
                    Arktx: f_arktxField,
                    Werks: f_werksField,
                    Charg: f_chargField,
                    Lfimg: f_lfimgField !== "" ?
                        Number(f_lfimgField).toFixed(1) : 0,
                    Vkbur: "",
                    Vkburbezei: f_vkburbezeiField,
                    Vkgrp: "",
                    Vkgrpbezei: f_vkgrpbezeiField,
                    Sname: f_snameField,
                },
            ],
            ItAubel: (docu_comercial_desde || docu_comercial_hasta) !== "" ?
                RangosDocuComercial() : [],
            ItVkbur: (ofi_ventas_desde || ofi_ventas_hasta) !== "" ?
                RangosOficinaVentas() : [],
            ItPernr: (comercial_desde_value || comercial_hasta_value) !== "" ?
                RangosComercial() : [],
            IsUser: jwt(localStorage.getItem("_token")).username,
        };
        console.log("FILTRO MODEL REPORTE", model_repor_despacho_filtro);
        setmostrar_filtro_fila(false);
        arraycheckbox_export[0].data = [];
        setresponse_reporte_despacho([]);
        setspinner(true);
        ConsultaReporteDespacho(model_repor_despacho_filtro)
            .then((result) => {
                setspinner(false);
                setresponse_reporte_despacho(
                    result.etPedidosField.map((d) => {
                        return {
                            select: true,
                            kunnrField: d.kunnrField,
                            name1Field: d.name1Field,
                            bstkdField: d.bstkdField,
                            erdatField: d.erdatField,
                            aubelField: d.aubelField,
                            xblnrField: d.xblnrField,
                            xblnr1Field: d.xblnr1Field,
                            ctransField: d.ctransField,
                            ntransField: d.ntransField,
                            vkorgField: d.vkorgField,
                            arktxField: d.arktxField,
                            werksField: d.werksField,
                            chargField: d.chargField,
                            lfimgField: d.lfimgField,
                            vkburField: d.vkburField,
                            vkburbezeiField: d.vkburbezeiField,
                            vkgrpField: d.vkgrpField,
                            vkgrpbezeiField: d.vkgrpbezeiField,
                            snameField: d.snameField,

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
        if ((f_name1Field || f_bstkdField || f_erdatField || f_aubelField ||
            f_xblnrField || f_xblnr1Field || f_ntransField || f_vkorgField ||
            f_arktxField || f_werksField || f_chargField || f_lfimgField ||
            f_vkburbezeiField || f_vkgrpbezeiField || f_snameField) != "") {
            buscar_filtro_fila(1, "", "");
            Exportar();
        }
        else {
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
        if ((creado_el_desde == "" && creado_el_hasta == "") && (org_ventas_desde == "" && org_ventas_hasta == "")) {
            toast.error("Debe seleccionar una \"Org. Ventas\" y \"Fecha Registro\"", {
                position: "top-center",
                autoClose: 6000,
                style: {
                    backgroundColor: "#212121",
                    color: "#fff",
                },
            });
        }
        else if (creado_el_desde == "" && creado_el_hasta == "") {
            toast.error("Debe seleccionar una \"Fecha Registro\"", {
                position: "top-center",
                autoClose: 6000,
                style: {
                    backgroundColor: "#212121",
                    color: "#fff",
                },
            });
        }
        else if (org_ventas_desde == "" && org_ventas_hasta == "") {
            toast.error("Debe seleccionar una \"Org. Ventas\"", {
                position: "top-center",
                autoClose: 6000,
                style: {
                    backgroundColor: "#212121",
                    color: "#fff",
                },
            });
        }
        else {
            setshowModalPagina((prev) => !prev);

        }
        // showModalPagina == true

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

    const ValidacionSearch = () => {
        if ((creado_el_desde == "" && creado_el_hasta == "") && (org_ventas_desde == "" && org_ventas_hasta == "")) {
            toast.error("Debe seleccionar una \"Org. Ventas\" y \"Fecha Registro\"", {
                position: "top-center",
                autoClose: 6000,
                style: {
                    backgroundColor: "#212121",
                    color: "#fff",
                },
            });
        }
        else if (creado_el_desde == "" && creado_el_hasta == "") {
            toast.error("Debe seleccionar una \"Fecha Registro\"", {
                position: "top-center",
                autoClose: 6000,
                style: {
                    backgroundColor: "#212121",
                    color: "#fff",
                },
            });
        }
        else if (org_ventas_desde == "" && org_ventas_hasta == "") {
            toast.error("Debe seleccionar una \"Org. Ventas\"", {
                position: "top-center",
                autoClose: 6000,
                style: {
                    backgroundColor: "#212121",
                    color: "#fff",
                },
            });
        }
        else {
            Search(1, 0, "", "");

        }
    }

   
    const [ShowName, setShowName] = useState(false);

    const NameFile = () => {
        setShowName((prev) => !prev);
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
                                <SelectFormMd
                                    attribute={{ name: "id_role", disabled: false, default: 0 }}
                                    values={ItemsNumberDates}
                                    handleChange={handleChange}
                                ></SelectFormMd>
                            </div>
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
                        {/* MODAL MATCHCODE CLIENTE */}
                        <Mc_Cliente_desde_v2
                            showcliente={showcliente_desde}
                            setshowcliente={setshowcliente_desde}
                            setcliente_desde={setcliente_desde}
                            cliente_desde={cliente_desde}
                            cliente_hasta={cliente_hasta}
                            setcliente={setcliente}
                            org_ventas_desde={org_ventas_desde}
                            org_ventas_hasta={org_ventas_hasta}
                        />
                        <Mc_Cliente_hasta_v2
                            showcliente={showcliente_hasta}
                            setshowcliente={setshowcliente_hasta}
                            setcliente_hasta={setcliente_hasta}
                            cliente_hasta={cliente_hasta}
                            cliente_desde={cliente_desde}
                            setcliente={setcliente}
                            org_ventas_desde={org_ventas_desde}
                            org_ventas_hasta={org_ventas_hasta}
                        />
                        {/* MODAL MATCHCODE PUNTO EXP */}
                        <Mc_Punto_Exp_desde
                            showpuntoexp={showpuntoexp_desde}
                            setshowpuntoexp={setshowpuntoexp_desde}
                            setpuntoexp_desde={setpuntoexp_desde}
                            puntoexp_desde={puntoexp_desde}
                            puntoexp_hasta={puntoexp_hasta}
                            setpuntoexp={setpuntoexp}
                        />

                        <Mc_Punto_Exp_hasta
                            showpuntoexp={showpuntoexp_hasta}
                            setshowpuntoexp={setshowpuntoexp_hasta}
                            setpuntoexp_hasta={setpuntoexp_hasta}
                            puntoexp_hasta={puntoexp_hasta}
                            puntoexp_desde={puntoexp_desde}
                            setpuntoexp={setpuntoexp}
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

                        <ModalNameFile 
                        showMdRol={ShowName} 
                        setShowMdRol={setShowName} 
                        arraycheckbox_export={arraycheckbox_export}
                        DataSet={DataSet}
                        />

                        <div className="title-section">
                            <div>
                                <label> Reportes / Reporte de Despacho </label>
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
                                    <label>
                                        <label>Sociedad :</label>{" "}
                                        <label style={{ color: "red" }}>(*)</label>
                                    </label>
                                </div>
                                <div className="col-sm-3">
                                    <InputForm
                                        attribute={{
                                            name: "sociedad",
                                            type: "text",
                                            value: IsBukrs,
                                            disabled: false,
                                            checked: false,
                                            matchcode: false,
                                            maxlength: 10,
                                            placeholder: "FRMX"
                                        }}
                                        handleChange={handleChange}
                                        onChange={(e) => handleChange(e)}
                                    />
                                </div>
                                {/* <div className="col-sm-3">
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
                                </div> */}
                                <div className="col-sm-2 d-flex align-items-center">
                                    <i
                                    // className="fas fa-file-export icon-matchcode-2"
                                    //onClick={ChangeBusquedaMult_DocComercial}
                                    ></i>
                                </div>

                                {/* Org. Ventas */}
                                <div className="col-sm-4 d-flex align-items-center">
                                    <label>
                                        <label>Organización Ventas :</label>{" "}
                                        <label style={{ color: "red" }}>(*)</label>
                                    </label>
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

                                {/* FECHA REGISTRO */}
                                <div className="col-sm-4 d-flex align-items-center">
                                    <label>
                                        <label>Fecha Registro :</label>{" "}
                                        <label style={{ color: "red" }}>(*)</label>
                                    </label>
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

                                {/* PUNTO DE EXP */}
                                {/* FALTA AJUSTAR PUNTO DE EXP */}
                                <div className="col-sm-4 d-flex align-items-center">
                                    <label>Puesto de Expedición :</label>
                                </div>
                                <div className="col-sm-3">
                                    <InputForm
                                        attribute={{
                                            name: "puntoexp_desde",
                                            type: "text",
                                            value: puntoexp_desde,
                                            disabled: false,
                                            checked: false,
                                            matchcode: true,
                                            maxlength: 4,
                                        }}
                                        handleChange={handleChange}
                                        onClick={() => mc_puntoexp_desde()}
                                    />
                                </div>
                                <div className="col-sm-3">
                                    <InputForm
                                        attribute={{
                                            name: "puntoexp_hasta",
                                            type: "text",
                                            value: puntoexp_hasta,
                                            disabled: false,
                                            checked: false,
                                            matchcode: true,
                                            maxlength: 4,
                                        }}
                                        handleChange={handleChange}
                                        onClick={() => mc_puntoexp_hasta()}
                                    />
                                </div>
                                <div className="col-sm-2 d-flex align-items-center">
                                    <i
                                        className="fas fa-file-export icon-matchcode-2"
                                        onClick={ChangeBusquedaMult_PuntoExp}
                                    ></i>
                                </div>

                                {/* CLIENTE */}
                                <div className="col-sm-4 d-flex align-items-center">
                                    <label>Cliente :</label>
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






                                {/* NRO DE PEDIDO */}
                                <div className="col-sm-4 d-flex align-items-center">
                                    <label>N° de Pedido :</label>
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

                                {/* Oficina de Venta */}
                                <div className="col-sm-4 d-flex align-items-center">
                                    <label>Oficina de Ventas :</label>
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

                                {/* COMERCIAL */}
                                <div className="col-sm-4 d-flex align-items-center">
                                    <label>Comercial :</label>
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
                                    onClick={() => ValidacionSearch()}
                                //Search(1, 0, "", "")}
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
                            {/* /////// */}
                            <div className="col-sm-12 col-md-2 p-1">
                                {response_reporte_despacho.length != 0 ?
                                    (
                                        <BtnSearch
                                            attribute={{
                                                name: "Descargar Excel",
                                                classNamebtn: "btn_search",
                                                disabled: false
                                            }}
                                            onClick={() => NameFile()}
                                        />
                                    ) : 
                                    (
                                        <BtnSearch
                                            attribute={{
                                                name: "Descargar Excel",
                                                classNamebtn: "btn_search",
                                                disabled: true
                                            }}
                                            onClick={() => NameFile()}
                                        />
                                    )
                                    }

                            </div>
                            {/* ////////////// */}
                            {/* <div className="col-sm-12 col-md-2 p-1">
                                {arraycheckbox_export[0].data.length > 0 ? (
                                    <ExcelFile
                                        filename="Reporte de Despachos"
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
                                ) : response_reporte_despacho.length != 0 ?
                                    (
                                        <ExcelFile
                                            // filename={NombreFile}
                                            element={
                                                <BtnExportar
                                                    attribute={{
                                                        name: "Descargar Excel",
                                                        classNamebtn: "btn_export",
                                                        disabled: false,
                                                    }}
                                                    onClick={() => NameFile()}
                                                />
                                            }
                                        >
                                            <ExcelSheet dataSet={DataSet} name="exportacion" />
                                        </ExcelFile>
                                    ) :
                                    (
                                        <ExcelFile
                                            filename="Reporte de Despachos"
                                            element={
                                                <BtnExportar
                                                    attribute={{
                                                        name: "Descargar Excel",
                                                        classNamebtn: "btn_export",
                                                        disabled: true,
                                                    }}
                                                />
                                            }
                                        >
                                            <ExcelSheet dataSet={DataSet} name="exportacion" />
                                        </ExcelFile>
                                    )
                                }
                            </div> */}
                            <div className="col-sm-12 col-md-2 p-1">
                                <BtnSearch
                                    attribute={{
                                        name: "Cantidad de Filas",
                                        classNamebtn: "btn_search",
                                    }}
                                    onClick={() => openDatosPagina()}
                                />
                            </div>
                            {response_reporte_despacho.length ? (
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
                                                {/* <th></th> */}
                                                <th>
                                                    Cliente |{" "}
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
                                                <th>
                                                    Org. Venta |{" "}
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
                                                    Pedido |{" "}
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
                                                <th>
                                                    Fecha Ent. |{" "}
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
                                                    Denominación |{" "}
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
                                                <th>
                                                    Ctd. Ent. |{" "}
                                                    {col_12 === 0 ? (
                                                        <i
                                                            className="fas fa-arrows-alt-v"
                                                            style={{ cursor: "pointer" }}
                                                            onClick={() => handleChangeColumna(12)}
                                                        ></i>
                                                    ) : null}
                                                    {col_12 === 1 ? (
                                                        <i
                                                            className="fas fa-sort-amount-up"
                                                            style={{ cursor: "pointer" }}
                                                            onClick={() => handleChangeColumna(12)}
                                                        ></i>
                                                    ) : null}
                                                    {col_12 === 2 ? (
                                                        <i
                                                            className="fas fa-sort-amount-down-alt"
                                                            style={{ cursor: "pointer" }}
                                                            onClick={() => handleChangeColumna(12)}
                                                        ></i>
                                                    ) : null}
                                                </th>
                                                <th>
                                                    Lote |{" "}
                                                    {col_11 === 0 ? (
                                                        <i
                                                            className="fas fa-arrows-alt-v"
                                                            style={{ cursor: "pointer" }}
                                                            onClick={() => handleChangeColumna(11)}
                                                        ></i>
                                                    ) : null}
                                                    {col_11 === 1 ? (
                                                        <i
                                                            className="fas fa-sort-amount-up"
                                                            style={{ cursor: "pointer" }}
                                                            onClick={() => handleChangeColumna(11)}
                                                        ></i>
                                                    ) : null}
                                                    {col_11 === 2 ? (
                                                        <i
                                                            className="fas fa-sort-amount-down-alt"
                                                            style={{ cursor: "pointer" }}
                                                            onClick={() => handleChangeColumna(11)}
                                                        ></i>
                                                    ) : null}
                                                </th>
                                                <th style={{ textAlign: "center" }}>
                                                    Guía Remisión |{" "}
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
                                                <th>
                                                    Transporte |{" "}
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
                                                <th style={{ textAlign: "center" }}>
                                                    Fac / Bol. Vta |{" "}
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
                                                    N° OC |{" "}
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
                                                    Centro |{" "}
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
                                                </th>
                                                <th>
                                                    Denom. Ofi. |{" "}
                                                    {col_13 === 0 ? (
                                                        <i
                                                            className="fas fa-arrows-alt-v"
                                                            style={{ cursor: "pointer" }}
                                                            onClick={() => handleChangeColumna(13)}
                                                        ></i>
                                                    ) : null}
                                                    {col_13 === 1 ? (
                                                        <i
                                                            className="fas fa-sort-amount-up"
                                                            style={{ cursor: "pointer" }}
                                                            onClick={() => handleChangeColumna(13)}
                                                        ></i>
                                                    ) : null}
                                                    {col_13 === 2 ? (
                                                        <i
                                                            className="fas fa-sort-amount-down-alt"
                                                            style={{ cursor: "pointer" }}
                                                            onClick={() => handleChangeColumna(13)}
                                                        ></i>
                                                    ) : null}
                                                </th>
                                                <th>
                                                    Grup. Ventas |{" "}
                                                    {col_14 === 0 ? (
                                                        <i
                                                            className="fas fa-arrows-alt-v"
                                                            style={{ cursor: "pointer" }}
                                                            onClick={() => handleChangeColumna(14)}
                                                        ></i>
                                                    ) : null}
                                                    {col_14 === 1 ? (
                                                        <i
                                                            className="fas fa-sort-amount-up"
                                                            style={{ cursor: "pointer" }}
                                                            onClick={() => handleChangeColumna(14)}
                                                        ></i>
                                                    ) : null}
                                                    {col_14 === 2 ? (
                                                        <i
                                                            className="fas fa-sort-amount-down-alt"
                                                            style={{ cursor: "pointer" }}
                                                            onClick={() => handleChangeColumna(14)}
                                                        ></i>
                                                    ) : null}
                                                </th>
                                                <th>
                                                    Vendedor |{" "}
                                                    {col_15 === 0 ? (
                                                        <i
                                                            className="fas fa-arrows-alt-v"
                                                            style={{ cursor: "pointer" }}
                                                            onClick={() => handleChangeColumna(15)}
                                                        ></i>
                                                    ) : null}
                                                    {col_15 === 1 ? (
                                                        <i
                                                            className="fas fa-sort-amount-up"
                                                            style={{ cursor: "pointer" }}
                                                            onClick={() => handleChangeColumna(15)}
                                                        ></i>
                                                    ) : null}
                                                    {col_15 === 2 ? (
                                                        <i
                                                            className="fas fa-sort-amount-down-alt"
                                                            style={{ cursor: "pointer" }}
                                                            onClick={() => handleChangeColumna(15)}
                                                        ></i>
                                                    ) : null}
                                                </th>
                                                {/* <th>Acción</th> */}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {/* AQUIIIIIIIIIII */}
                                            {mostrar_filtro_fila == true ? (
                                                <tr>
                                                    <th>
                                                        <button
                                                            className="btn_search_filter mt-0"
                                                            onClick={() => buscar_filtro_icono_btn()}
                                                        >
                                                            <i className="fas fa-filter"></i>
                                                        </button>
                                                    </th>
                                                    <th>
                                                        <input style={{ width: "220px" }}
                                                            type="text"
                                                            onKeyUp={(e) => buscar_filtro_enter(e)}
                                                            id="f_name1Field"
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
                                                    <th style={{ textAlign: "center" }}>
                                                        <div >
                                                            <select style={{ paddingTop: "4px", paddingBottom: "3px" }} className="px-2" name="f_vkorgField"
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
                                                    </th>
                                                    <th>
                                                        <input style={{ width: "100px" }}
                                                            type="text"
                                                            onKeyUp={(e) => buscar_filtro_enter(e)}
                                                            name="f_aubelField"
                                                            maxLength="20"
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
                                                            type="date"
                                                            onKeyUp={(e) => buscar_filtro_enter(e)}
                                                            name="f_erdatField"
                                                            style={{ paddingTop: "1.5px", paddingBottom: "1px" }} className="px-2"
                                                            onChange={(e) =>
                                                                handleChangeFiltro(
                                                                    e.target.name,
                                                                    e.target.value
                                                                )
                                                            }
                                                        />
                                                    </th>
                                                    <th>
                                                        <input style={{ width: "250px" }}
                                                            type="text"
                                                            onKeyUp={(e) => buscar_filtro_enter(e)}
                                                            name="f_arktxField"
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
                                                        <input style={{ width: "70px" }}
                                                            type="text"
                                                            onKeyUp={(e) => buscar_filtro_enter(e)}
                                                            name="f_lfimgField"
                                                            maxLength="20"
                                                            onChange={(e) =>
                                                                handleChangeFiltro(
                                                                    e.target.name,
                                                                    e.target.value
                                                                )
                                                            }
                                                        />
                                                    </th>
                                                    <th>
                                                        <input style={{ width: "150px" }}
                                                            type="text"
                                                            onKeyUp={(e) => buscar_filtro_enter(e)}
                                                            name="f_chargField"
                                                            maxLength="20"
                                                            onChange={(e) =>
                                                                handleChangeFiltro(
                                                                    e.target.name,
                                                                    e.target.value
                                                                )
                                                            }
                                                        />
                                                    </th>
                                                    <th>
                                                        <input style={{ width: "150px" }}
                                                            type="text"
                                                            onKeyUp={(e) => buscar_filtro_enter(e)}
                                                            name="f_xblnrField"
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
                                                        <input style={{ width: "300px" }}
                                                            type="text"
                                                            onKeyUp={(e) => buscar_filtro_enter(e)}
                                                            name="f_ntransField"
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
                                                        <input style={{ width: "150px" }}
                                                            type="text"
                                                            onKeyUp={(e) => buscar_filtro_enter(e)}
                                                            name="f_xblnr1Field"
                                                            maxLength="15"
                                                            onChange={(e) =>
                                                                handleChangeFiltro(
                                                                    e.target.name,
                                                                    e.target.value
                                                                )
                                                            }
                                                        />
                                                    </th>
                                                    <th>
                                                        <input style={{ width: "150px" }}
                                                            type="text"
                                                            onKeyUp={(e) => buscar_filtro_enter(e)}
                                                            name="f_bstkdField"
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
                                                        <input style={{ width: "70px" }}
                                                            type="text"
                                                            onKeyUp={(e) => buscar_filtro_enter(e)}
                                                            name="f_werksField"
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
                                                        <input style={{ width: "150px" }}
                                                            type="text"
                                                            onKeyUp={(e) => buscar_filtro_enter(e)}
                                                            name="f_vkburbezeiField"
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
                                                        <input style={{ width: "130px" }}
                                                            type="text"
                                                            onKeyUp={(e) => buscar_filtro_enter(e)}
                                                            name="f_vkgrpbezeiField"
                                                            maxLength="25"
                                                            onChange={(e) =>
                                                                handleChangeFiltro(
                                                                    e.target.name,
                                                                    e.target.value
                                                                )
                                                            }
                                                        />
                                                    </th>
                                                    <th>
                                                        <input style={{ width: "260px" }}
                                                            type="text"
                                                            onKeyUp={(e) => buscar_filtro_enter(e)}
                                                            name="f_snameField"
                                                            maxLength="40"
                                                            onChange={(e) =>
                                                                handleChangeFiltro(
                                                                    e.target.name,
                                                                    e.target.value
                                                                )
                                                            }
                                                        />
                                                    </th>
                                                </tr>
                                            ) : null}

                                            {response_reporte_despacho != null &&
                                                response_reporte_despacho.length > 0
                                                ? response_reporte_despacho.map((response, key) => {
                                                    console.log("keyyyyyyy",key)
                                                    return (
                                                        
                                                        <tr key={key}>
                                                            
                                                            <th>
                                                                 <input
                                                                    type="checkbox"
                                                                    id={`checkbox-body-` + response.name1Field}
                                                                    onChange={(e) => {
                                                                        setresponse_reporte_despacho(
                                                                            response_reporte_despacho.map((d) => {
                                                                                if (
                                                                                    d.name1Field == response.name1Field
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
                                                                                                    value: d.name1Field,
                                                                                                    style: {
                                                                                                        font: { sz: "14" },
                                                                                                    },
                                                                                                },
                                                                                                // { value: d.bezeiField, style: { font: { sz: "14" } } },
                                                                                                {
                                                                                                    value: d.bstkdField,
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
                                                                                                    value: d.aubelField,
                                                                                                    style: {
                                                                                                        font: { sz: "14" },
                                                                                                    },
                                                                                                },
                                                                                                {
                                                                                                    value: d.xblnrField,
                                                                                                    style: {
                                                                                                        font: { sz: "14" },
                                                                                                    },
                                                                                                },
                                                                                                {
                                                                                                    value: d.xblnr1Field,
                                                                                                    style: {
                                                                                                        font: { sz: "14" },
                                                                                                    },
                                                                                                },
                                                                                                {
                                                                                                    value: d.ntransField,
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
                                                                                                    value: d.arktxField,
                                                                                                    style: {
                                                                                                        font: { sz: "14" },
                                                                                                    },
                                                                                                },
                                                                                                {
                                                                                                    value: d.werksField,
                                                                                                    style: {
                                                                                                        font: { sz: "14" },
                                                                                                    },
                                                                                                },
                                                                                                {
                                                                                                    value: d.chargField,
                                                                                                    style: {
                                                                                                        font: { sz: "14" },
                                                                                                    },
                                                                                                },
                                                                                                {
                                                                                                    value: convertDecimal(
                                                                                                        d.lfimgField,
                                                                                                        2
                                                                                                    ),
                                                                                                    style: {
                                                                                                        font: { sz: "14" },
                                                                                                    },
                                                                                                },
                                                                                                {
                                                                                                    value: d.vkburbezeiField,
                                                                                                    style: {
                                                                                                        font: { sz: "14" },
                                                                                                    },
                                                                                                },
                                                                                                {
                                                                                                    value: d.vkgrpbezeiField,
                                                                                                    style: {
                                                                                                        font: { sz: "14" },
                                                                                                    },
                                                                                                },
                                                                                                {
                                                                                                    value: d.snameField,
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
                                                                                                    name1Field: d.name1Field,
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
                                                                                                d.name1Field ==
                                                                                                arraycheckbox[i].name1Field
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
                                                                                                        name1Field:
                                                                                                            arraycheckbox[i]
                                                                                                                .name1Field,
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
                                                                                                d.name1Field ==
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
                                                            {/* <th></th> */}
                                                            {/* AQUIIIIIIIIIII */}
                                                            <th style={{ textAlign: "left" }}>
                                                                {response.name1Field}
                                                            </th>
                                                            <th
                                                                style={{ textAlign: "center" }}
                                                            >
                                                                {response.vkorgField}
                                                            </th>
                                                            <th style={{ textAlign: "center" }}>
                                                                {response.aubelField}
                                                            </th>
                                                            <th style={{ textAlign: "center" }}>
                                                                {formatFecha(response.erdatField)}
                                                            </th>
                                                            <th style={{ textAlign: "left" }}>
                                                                {response.arktxField}
                                                            </th>
                                                            <th style={{ textAlign: "center" }}>
                                                                {response.lfimgField}
                                                            </th>
                                                            <th style={{ textAlign: "center" }}>
                                                                {response.chargField}
                                                            </th>
                                                            <th
                                                                style={{ textAlign: "center" }}
                                                            >
                                                                {response.xblnrField}
                                                            </th>
                                                            <th style={{ textAlign: "left" }}>
                                                                {response.ntransField}
                                                            </th>
                                                            <th style={{ textAlign: "center" }}>
                                                                {response.xblnr1Field}
                                                            </th>
                                                            <th style={{ textAlign: "center" }}>
                                                                {response.bstkdField}
                                                            </th>
                                                            <th style={{ textAlign: "center" }}>
                                                                {response.werksField}
                                                            </th>
                                                            <th style={{ textAlign: "center" }}>
                                                                {response.vkburbezeiField}
                                                            </th>
                                                            <th style={{ textAlign: "center" }}>
                                                                {response.vkgrpbezeiField}
                                                            </th>
                                                            <th style={{ textAlign: "left" }}>
                                                                {response.snameField}
                                                            </th>
                                                        </tr>
                                                    );
                                                })
                                                : null}
                                        </tbody>
                                    </table>
                                </div>
                                {response_reporte_despacho == 0 && spinner == false ? (
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
export default Reporte_Despacho;
