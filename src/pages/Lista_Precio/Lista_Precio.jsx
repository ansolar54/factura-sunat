import React, { useState, useEffect, useRef } from "react";
import jwt from "jwt-decode";
import ChangeStatusPassword from "../../components/ChangeStatusPassword/ChangeStatusPassword";
import Spinner from "../../components/Spinner";
import { getUser } from "../../Services/ServiceUser";
import toast, { Toaster } from "react-hot-toast";
import BusquedaMult from "../../components/BusquedaMultiple/BusquedaMult";
import Mc_Lista_Precio_desde from "./Matchcode_Lista_Precios/Mc_Lista_Precio_desde";
import Mc_Material_desde from "./Matchcode_Material_v2/Mc_Material_desde";
import Mc_Material_hasta from "./Matchcode_Material_v2/Mc_Material_hasta";
import Mc_Cliente_desde_v2 from "./Matchcode_Cliente/Mc_Cliente_desde_v2";
// import Mc_Cliente_hasta_v2 from "./Matchcode_Cliente/Mc_Cliente_hasta_v2";
import InputForm from "../../components/InputForm";
import BtnSearch from "../../components/BtnSearch";
import Pagination from "../../components/Pagination";
import { ConsultaListaPrecios, ParamEnter } from "../../Services/ServiceListaPrecios";
import {
    getOficinaVentasSAP,
    RegistrarAuditoria,
} from "../../Services/ServiceAuditoria";
import InputFormKeyUp from "../../components/InputFormKeyUp";
import { MatchcodePromociones } from '../../Services/ServicePromociones';
import Mc_Org_Ventas_desde from "./Matchcode_Organ_Ventas/Mc_Org_Ventas_desde"
import Mc_Ofi_Ventas_desde from "./Matchcode_Ofi_Ventas/Mc_Ofi_Ventas_desde"

///////////////////////

import { TreeTable } from 'primereact/treetable';
import { Column } from 'primereact/column';


const Lista_Precio = () => {
    var n = new Date();
    //Año
    var y = n.getFullYear();
    //Mes
    var m = ("0" + (n.getMonth() + 1)).slice(-2);
    //Día
    var d = ("0" + n.getDate()).slice(-2);

    // const [filtroInicial, setFiltroInicial] = useState({
    //     // valido_el: [
    //     //     { Sign: "I", Option: "EQ", Low: y + "-" + m + "-" + d, High: "" },
    //     // ],
    //     valido_el: y + "-" + m + "-" + d,
    // });
    const [valido_el, setvalido_el] = useState(y + "-" + m + "-" + d)
    // para mostrar fila de filtros
    const [ind_pagina, setind_pagina] = useState(1);
    const [mostrar_filtro_fila, setmostrar_filtro_fila] = useState(false);
    const [text_btn_filtro, settext_btn_filtro] = useState("Filtrar");

    const [f_vkorgField, setf_vkorgField] = useState("");
    const [f_matnrField, setf_matnrField] = useState("");
    const [f_maktxField, setf_maktxField] = useState("");
    const [f_kbetrField, setf_kbetrField] = useState("");
    const [f_konwaField, setf_konwaField] = useState("");
    const [f_mxwrtField, setf_mxwrtField] = useState("");
    const [f_konwa2Field, setf_konwa2Field] = useState("");
    const [f_databField, setf_databField] = useState("");
    const [f_datbiField, setf_datbiField] = useState("");
    const [f_name1Field, setf_name1Field] = useState("");
    const [f_namepltypField, setf_namepltypField] = useState("");

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

    //para el cambio de contraseña
    const [show_status_password, setshow_status_password] = useState(false);

    const [IsCampo, setIsCampo] = useState("");
    const [IsOrden, setIsOrden] = useState("");

    //RESPONSE LISTA DE PRECIOS
    const [response_lista_precios, setresponse_lista_precios] = useState([]);

    //NUMERO TOTAL DE DATOS
    const [TotalData, setTotalData] = useState();

    //ACTIVAR SECCION DE PAGINADO
    const [valuepagination, setvaluepagination] = useState(false);

    // para el paginado
    const [IsRegxpag, setIsRegxpag] = useState(10); // cantidad de datos por página
    const [pageNumber, setpageNumber] = useState(1);
    const [indicadorfiltro, setindicadorfiltro] = useState(false);
    const [model_filtro, setmodel_filtro] = useState({});
    const [model_listaprecio, setmodel_listaprecio] = useState();

    const [type_input, settype_input] = useState("text");

    //MODAL para rango (busqueda multiple)
    const [showBusMult, setshowBusMult] = useState(false);

    //CARGA DE SPINNER
    const [spinner, setspinner] = useState(false);
    //CARGA DE SPINNER DE ACCESO DE RUTA
    const [spinnerroute, setspinnerroute] = useState(false);

    //----------------------------------------------------
    // usestate de rangos
    const [rangos, setrangos] = useState([
        { Sign: "I", Option: "EQ", Low: "", High: "" },
    ]);
    const [ind_rang, setind_rang] = useState({ num: 1, bool: false });
    // rangos material
    const [rangos_material, setrangos_material] = useState([
        { Sign: "I", Option: "EQ", Low: "", High: "" },
    ]);

    //----------------------------------------------------

    //INPUT Organización ventas
    const [org_ventas, setorg_ventas] = useState("");
    const [org_ventas_desde, setorg_ventas_desde] = useState("");
    const [orgVentasName, setOrgVentasName] = useState("");

    //INPUT Oficina de ventas
    const [ofi_ventas, setofi_ventas] = useState("");
    const [ofi_ventas_desde, setofi_ventas_desde] = useState("");
    const [ofiVentasName, setofi_ventas_name] = useState("");

    //INPUT Lista de Precios
    const [lista_precio, setlista_precio] = useState("");
    const [lista_precio_desde, setlista_precio_desde] = useState("");
    const [listaPrecioName, setlista_precio_name] = useState("");

    //INPUT Cliente
    const [cliente, setcliente] = useState("");
    const [cliente_desde, setcliente_desde] = useState("");
    const [clienteName, setclienteName] = useState("");

    // const [cliente_hasta, setcliente_hasta] = useState("");

    //INPUT Material
    const [material, setmaterial] = useState([
        { Sign: "I", Option: "EQ", Low: "", High: "" },
    ]);
    const [material_desde, setmaterial_desde] = useState("");
    const [material_hasta, setmaterial_hasta] = useState("");



    //----------------------------------------------------
    //ACTIVAR MODAL MATCHCODE ORGANIZACIÓN DE VENTAS
    const [showorgventa_desde, setshoworgventa_desde] = useState(false);

    //ACTIVAR MODAL MATCHCODE OFICINA DE VENTAS
    const [showofiventa_desde, setshowofiventa_desde] = useState(false);

    //ACTIVAR MODAL MATCHCODE LISTA DE PRECIOS
    const [showlistaprecio_desde, setshowlistaprecio_desde] = useState(false);

    //ACTIVAR MODAL MATCHCODE MATERIAL
    const [showmaterial_desde, setshowmaterial_desde] = useState(false);
    const [showmaterial_hasta, setshowmaterial_hasta] = useState(false);

    //ACTIVAR MODAL MATCHCODE CLIENTE
    const [showcliente_desde, setshowcliente_desde] = useState(false);
    //const [showcliente_hasta, setshowcliente_hasta] = useState(false);

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
                    id_event: 8,
                    sales_ofi: ofi_ventas,
                    indicator: "WEB",
                });
            }
        });
    }, []);

    useEffect(() => {
        // ind_rang.num
        // 1: material
        switch (ind_rang.num) {
            case 1:
                setrangos_material(rangos);
                RangosMaterial();
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
                break;
            default:
                break;
        }
    }

    function handleChangeColumna(num_col) {
        switch (num_col) {
            // 1: ascendente
            // 0: descendente
            case 1:
                clearColumnsIcon(1);
                if (col_1 === 0) {
                    setcol_1(col_1 + 1);
                    setIsCampo("VKORG");
                    setIsOrden("0");
                    if (indicadorfiltro == true) {
                        buscar_filtro_fila(1, "VKORG", "0");
                    } else {
                        Search(1, "VKORG", "0");
                    }
                } else if (col_1 === 1) {
                    setcol_1(col_1 + 1);
                    setIsCampo("VKORG");
                    setIsOrden("1");
                    if (indicadorfiltro == true) {
                        buscar_filtro_fila(1, "VKORG", "1");
                    } else {
                        Search(1, "VKORG", "1");
                    }
                } else {
                    setcol_1(0);
                    // Search(1, 0, "", "");
                    setIsCampo("");
                    setIsOrden("");
                    if (indicadorfiltro == true) {
                        buscar_filtro_fila(1, "", "");
                    } else {
                        Search(1, "", "");
                    }
                }
                break;
            case 2:
                clearColumnsIcon(2);
                if (col_2 === 0) {
                    setcol_2(col_2 + 1);
                    // Search(1, 0, "VKORG", "0");
                    setIsCampo("MATNR");
                    setIsOrden("0");
                    if (indicadorfiltro == true) {
                        buscar_filtro_fila(1, "MATNR", "0");
                    } else {
                        Search(1, "MATNR", "0");
                    }
                } else if (col_2 === 1) {
                    setcol_2(col_2 + 1);
                    // Search(1, 0, "VKORG", "1");
                    setIsCampo("MATNR");
                    setIsOrden("1");
                    if (indicadorfiltro == true) {
                        buscar_filtro_fila(1, "MATNR", "1");
                    } else {
                        Search(1, "MATNR", "1");
                    }
                } else {
                    setcol_2(0);
                    // Search(1, 0, "", "");
                    setIsCampo("");
                    setIsOrden("");
                    if (indicadorfiltro == true) {
                        buscar_filtro_fila(1, "", "");
                    } else {
                        Search(1, "", "");
                    }
                }
                break;
            case 3:
                clearColumnsIcon(3);
                if (col_3 === 0) {
                    setcol_3(col_3 + 1);
                    // Search(1, 0, "ERDAT", "0");
                    setIsCampo("MAKTX");
                    setIsOrden("0");
                    if (indicadorfiltro == true) {
                        buscar_filtro_fila(1, "MAKTX", "1");
                    } else {
                        Search(1, "MAKTX", "0");
                    }
                } else if (col_3 === 1) {
                    setcol_3(col_3 + 1);
                    // Search(1, 0, "ERDAT", "1");
                    setIsCampo("MAKTX");
                    setIsOrden("1");
                    if (indicadorfiltro == true) {
                        buscar_filtro_fila(1, "MAKTX", "1");
                    } else {
                        Search(1, "MAKTX", "1");
                    }
                } else {
                    setcol_3(0);
                    // Search(1, 0, "", "");
                    setIsCampo("");
                    setIsOrden("");
                    if (indicadorfiltro == true) {
                        buscar_filtro_fila(1, "", "");
                    } else {
                        Search(1, "", "");
                    }
                }
                break;
            case 4:
                clearColumnsIcon(4);
                if (col_4 === 0) {
                    setcol_4(col_4 + 1);
                    // Search(1, 0, "KUNNR", "0");
                    setIsCampo("KBETR");
                    setIsOrden("0");
                    if (indicadorfiltro == true) {
                        buscar_filtro_fila(1, "KBETR", "0");
                    } else {
                        Search(1, "KBETR", "0");
                    }
                } else if (col_4 === 1) {
                    setcol_4(col_4 + 1);
                    // Search(1, 0, "KUNNR", "1");
                    setIsCampo("KBETR");
                    setIsOrden("1");
                    if (indicadorfiltro == true) {
                        buscar_filtro_fila(1, "KBETR", "1");
                    } else {
                        Search(1, "KBETR", "1");
                    }
                } else {
                    setcol_4(0);
                    // Search(1, 0, "", "");
                    setIsCampo("");
                    setIsOrden("");
                    if (indicadorfiltro == true) {
                        buscar_filtro_fila(1, "", "");
                    } else {
                        Search(1, "", "");
                    }
                }
                break;
            case 5:
                clearColumnsIcon(5);
                if (col_5 === 0) {
                    setcol_5(col_5 + 1);
                    // Search(1, 0, "NAME1", "0");
                    setIsCampo("KONWA");
                    setIsOrden("0");
                    if (indicadorfiltro == true) {
                        buscar_filtro_fila(1, "KONWA", "0");
                    } else {
                        Search(1, "KONWA", "0");
                    }
                } else if (col_5 === 1) {
                    setcol_5(col_5 + 1);
                    // Search(1, 0, "NAME1", "1");
                    setIsCampo("KONWA");
                    setIsOrden("1");
                    if (indicadorfiltro == true) {
                        buscar_filtro_fila(1, "KONWA", "1");
                    } else {
                        Search(1, "KONWA", "1");
                    }
                } else {
                    setcol_5(0);
                    // Search(1, 0, "", "");
                    setIsCampo("");
                    setIsOrden("");
                    if (indicadorfiltro == true) {
                        buscar_filtro_fila(1, "", "");
                    } else {
                        Search(1, "", "");
                    }
                }
                break;
            case 6:
                clearColumnsIcon(6);
                if (col_6 === 0) {
                    setcol_6(col_6 + 1);
                    // Search(1, 0, "NETWR", "0");
                    setIsCampo("MXWRT");
                    setIsOrden("0");
                    if (indicadorfiltro == true) {
                        buscar_filtro_fila(1, "MXWRT", "0");
                    } else {
                        Search(1, "MXWRT", "0");
                    }
                } else if (col_6 === 1) {
                    setcol_6(col_6 + 1);
                    // Search(1, 0, "NETWR", "1");
                    setIsCampo("MXWRT");
                    setIsOrden("1");
                    if (indicadorfiltro == true) {
                        buscar_filtro_fila(1, "MXWRT", "1");
                    } else {
                        Search(1, "MXWRT", "1");
                    }
                } else {
                    setcol_6(0);
                    // Search(1, 0, "", "");
                    setIsCampo("");
                    setIsOrden("");
                    if (indicadorfiltro == true) {
                        buscar_filtro_fila(1, "", "");
                    } else {
                        Search(1, "", "");
                    }
                }
                break;
            case 7:
                clearColumnsIcon(7);
                if (col_7 === 0) {
                    setcol_7(col_7 + 1);
                    // Search(1, 0, "NTRANS", "0");
                    setIsCampo("KONWA2");
                    setIsOrden("0");
                    if (indicadorfiltro == true) {
                        buscar_filtro_fila(1, "KONWA2", "0");
                    } else {
                        Search(1, "KONWA2", "0");
                    }
                } else if (col_7 === 1) {
                    setcol_7(col_7 + 1);
                    // Search(1, 0, "NTRANS", "1");
                    setIsCampo("KONWA2");
                    setIsOrden("1");
                    if (indicadorfiltro == true) {
                        buscar_filtro_fila(1, "KONWA2", "1");
                    } else {
                        Search(1, "KONWA2", "1");
                    }
                } else {
                    setcol_7(0);
                    // Search(1, 0, "", "");
                    setIsCampo("");
                    setIsOrden("");
                    if (indicadorfiltro == true) {
                        buscar_filtro_fila(1, "", "");
                    } else {
                        Search(1, "", "");
                    }
                }
                break;
            case 8:
                clearColumnsIcon(8);
                if (col_8 === 0) {
                    setcol_8(col_8 + 1);
                    // Search(1, 0, "TEXT1", "0");
                    setIsCampo("DATAB");
                    setIsOrden("0");
                    if (indicadorfiltro == true) {
                        buscar_filtro_fila(1, "DATAB", "0");
                    } else {
                        Search(1, "DATAB", "0");
                    }
                } else if (col_8 === 1) {
                    setcol_8(col_8 + 1);
                    // Search(1, 0, "TEXT1", "1");
                    setIsCampo("DATAB");
                    setIsOrden("1");
                    if (indicadorfiltro == true) {
                        buscar_filtro_fila(1, "DATAB", "1");
                    } else {
                        Search(1, "DATAB", "1");
                    }
                } else {
                    setcol_8(0);
                    // Search(1, 0, "", "");
                    setIsCampo("");
                    setIsOrden("");
                    if (indicadorfiltro == true) {
                        buscar_filtro_fila(1, "", "");
                    } else {
                        Search(1, "", "");
                    }
                }
                break;
            case 9:
                clearColumnsIcon(9);
                if (col_9 === 0) {
                    setcol_9(col_9 + 1);
                    // Search(1, 0, "ARKTX", "0");
                    setIsCampo("DATBI");
                    setIsOrden("0");
                    if (indicadorfiltro == true) {
                        buscar_filtro_fila(1, "DATBI", "0");
                    } else {
                        Search(1, "DATBI", "0");
                    }
                } else if (col_9 === 1) {
                    setcol_9(col_9 + 1);
                    // Search(1, 0, "ARKTX", "1");
                    setIsCampo("DATBI");
                    setIsOrden("1");
                    if (indicadorfiltro == true) {
                        buscar_filtro_fila(1, "DATBI", "1");
                    } else {
                        Search(1, "DATBI", "1");
                    }
                } else {
                    setcol_9(0);
                    // Search(1, 0, "", "");
                    setIsCampo("");
                    setIsOrden("");
                    if (indicadorfiltro == true) {
                        buscar_filtro_fila(1, "", "");
                    } else {
                        Search(1, "", "");
                    }
                }
                break;
            case 10:
                clearColumnsIcon(10);
                if (col_10 === 0) {
                    setcol_10(col_10 + 1);
                    // Search(1, 0, "ARKTX", "0");
                    setIsCampo("NAME1");
                    setIsOrden("0");
                    if (indicadorfiltro == true) {
                        buscar_filtro_fila(1, "NAME1", "0");
                    } else {
                        Search(1, "NAME1", "0");
                    }
                } else if (col_10 === 1) {
                    setcol_10(col_10 + 1);
                    // Search(1, 0, "ARKTX", "1");
                    setIsCampo("NAME1");
                    setIsOrden("1");
                    if (indicadorfiltro == true) {
                        buscar_filtro_fila(1, "NAME1", "1");
                    } else {
                        Search(1, "NAME1", "1");
                    }
                } else {
                    setcol_10(0);
                    // Search(1, 0, "", "");
                    setIsCampo("");
                    setIsOrden("");
                    if (indicadorfiltro == true) {
                        buscar_filtro_fila(1, "", "");
                    } else {
                        Search(1, "", "");
                    }
                }
                break;
            case 11:
                clearColumnsIcon(11);
                if (col_11 === 0) {
                    setcol_11(col_11 + 1);
                    // Search(1, 0, "ARKTX", "0");
                    setIsCampo("NAMEPLTYP");
                    setIsOrden("0");
                    if (indicadorfiltro == true) {
                        buscar_filtro_fila(1, "NAMEPLTYP", "0");
                    } else {
                        Search(1, "NAMEPLTYP", "0");
                    }
                } else if (col_11 === 1) {
                    setcol_11(col_11 + 1);
                    // Search(1, 0, "ARKTX", "1");
                    setIsCampo("NAMEPLTYP");
                    setIsOrden("1");
                    if (indicadorfiltro == true) {
                        buscar_filtro_fila(1, "NAMEPLTYP", "1");
                    } else {
                        Search(1, "NAMEPLTYP", "1");
                    }
                } else {
                    setcol_11(0);
                    // Search(1, 0, "", "");
                    setIsCampo("");
                    setIsOrden("");
                    if (indicadorfiltro == true) {
                        buscar_filtro_fila(1, "", "");
                    } else {
                        Search(1, "", "");
                    }
                }
                break;
            default:
                break;
        }
    }

    function handleChangeFiltro(name, value) {
        switch (name) {
            case "f_vkorgField":
                setf_vkorgField(value);
                break;
            case "f_matnrField":
                setf_matnrField(value);
                break;
            case "f_maktxField":
                setf_maktxField(value);
                break;
            case "f_kbetrField":
                setf_kbetrField(value);
                break;
            case "f_konwaField":
                setf_konwaField(value);
                break;
            case "f_mxwrtField":
                setf_mxwrtField(value);
                break;
            case "f_konwa2Field":
                setf_konwa2Field(value);
                break;
            case "f_databField":
                setf_databField(value);
                break;
            case "f_datbiField":
                setf_datbiField(value);
                break;
            case "f_name1Field":
                setf_name1Field(value);
                break;
            case "f_namepltypField":
                setf_namepltypField(value);
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
        setcol_10(0);
        setcol_11(0);
    }

    function Search(page, IsCampo, IsOrden) {
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

        let model_lista_precios = {
            IsCampo: IsCampo,
            IsFecha: formatDateSAP(valido_el),
            IsNpag: page,
            IsOrden: IsOrden,
            IsPltyp: lista_precio_desde,
            IsRegxpag: IsRegxpag,
            IsUser: jwt(localStorage.getItem("_token")).username,
            IsVkbur: ofi_ventas_desde,
            IsVkorg: org_ventas_desde,
            ItFilter: [],
            ItMatnr: (material_desde || material_hasta) !== "" ?
                RangosMaterial() : [],
            IsKunnr: cliente_desde,
            //ItKunnr: []
        };
        console.log("BUSCAR FILTRO INICIAL", model_lista_precios);
        setmodel_listaprecio(model_lista_precios);

        //arraycheckbox_export[0].data = [];
        //setresponse_lista_precios([]);
        ConsultaListaPrecios(model_lista_precios).then((result) => {
            if (result.etMsgReturnField.length == 0) {
                setresponse_lista_precios(
                    result.etListaDetailField.map((d) => {
                        return {
                            select: true,
                            vkorgField: d.vkorgField,
                            matnrField: d.matnrField,
                            maktxField: d.maktxField,
                            kbetrField: d.kbetrField,
                            konwaField: d.konwaField,
                            mxwrtField: d.mxwrtField,
                            konwa2Field: d.konwa2Field,
                            databField: d.databField,
                            datbiField: d.datbiField,
                            name1Field: d.name1Field,
                            namepltypField: d.namepltypField
                        };
                    })
                );
                setTotalData(result.esRegtotField);
                setspinner(false);
                setvaluepagination(true);
            }
            else {
                toast.error(result.etMsgReturnField[0].messageField, {
                    position: "top-center",
                    autoClose: 3000,
                    // duration: 10000,
                    style: {
                        backgroundColor: "#212121",
                        color: "#FFF",
                        display: "flex"
                    },
                    //className: "toastsize",


                });
                setspinner(false);
            }

        });

        // COMENTAR CLEAR PARA QUE FUNCIONE ORDENAMIENTO

        //Clear();
    }

    //INPUT material
    function mc_material_desde() {
        if (org_ventas_desde == "") {
            toast.error("Debe seleccionar una Org. Ventas.", {
                position: "top-center",
                autoClose: 1000,
                style: {
                    backgroundColor: "#212121",
                    color: "#fff",
                }
            })
        }else{
            setshowmaterial_desde((prev) => !prev);
        }
        
    }
    function mc_material_hasta() {
        if (org_ventas_desde == "") {
            toast.error("Debe seleccionar una Org. Ventas.", {
                position: "top-center",
                autoClose: 1000,
                style: {
                    backgroundColor: "#212121",
                    color: "#fff",
                }
            })
        }else{
        setshowmaterial_hasta((prev) => !prev);
        }
    }

    //INPUT organización de ventas
    function mc_org_ventas_desde() {
        setshoworgventa_desde((prev) => !prev);
    }

    //INPUT oficina de ventas
    function mc_ofi_ventas_desde() {
        setshowofiventa_desde((prev) => !prev);
    }

    //INPUT lista de precios
    function mc_lista_precio_desde() {
        setshowlistaprecio_desde((prev) => !prev);
    }

    //INPUT cliente
    function mc_cliente_desde() {
        if (org_ventas_desde != "" && ofi_ventas_desde != "" && lista_precio_desde != "") {
            setshowcliente_desde((prev) => !prev);
        }
        else if (org_ventas_desde == "" && lista_precio_desde == "" && ofi_ventas_desde == "") {
            toast.error("Debe seleccionar una \"Org. Ventas\", \"Oficina de Ventas\" y \"Lista de Precios\".", {
                position: "top-center",
                autoClose: 1000,
                style: {
                    backgroundColor: "#212121",
                    color: "#fff",
                }
            })
        }
        else if (lista_precio_desde == "" && ofi_ventas_desde == "") {
            toast.error("Debe seleccionar una \"Oficina de Ventas\" y \"Lista de Precios\".", {
                position: "top-center",
                autoClose: 1000,
                style: {
                    backgroundColor: "#212121",
                    color: "#fff",
                }
            })
        }
        else if (org_ventas_desde == "" && lista_precio_desde == "") {
            toast.error("Debe seleccionar una \"Org. Ventas\" y \"Lista de Precios\".", {
                position: "top-center",
                autoClose: 1000,
                style: {
                    backgroundColor: "#212121",
                    color: "#fff",
                }
            })
        }
        else if (org_ventas_desde == "" && ofi_ventas_desde == "") {
            toast.error("Debe seleccionar una \"Org. Ventas\" y \"Oficina de Ventas\".", {
                position: "top-center",
                autoClose: 1000,
                style: {
                    backgroundColor: "#212121",
                    color: "#fff",
                }
            })
        }
        else if (org_ventas_desde == "") {
            toast.error("Debe seleccionar una Org. Ventas.", {
                position: "top-center",
                autoClose: 1000,
                style: {
                    backgroundColor: "#212121",
                    color: "#fff",
                }
            })
        }
        else if (ofi_ventas_desde == "") {
            toast.error("Debe seleccionar una Oficina Ventas.", {
                position: "top-center",
                autoClose: 1000,
                style: {
                    backgroundColor: "#212121",
                    color: "#fff",
                }
            })
        }
        else if (lista_precio_desde == "") {
            toast.error("Debe seleccionar una Lista de Precios.", {
                position: "top-center",
                autoClose: 1000,
                style: {
                    backgroundColor: "#212121",
                    color: "#fff",
                }
            })
        }


    }



    function handleChange(name, value) {
        //console.log(name, value)
        switch (name) {
            //org. ventas
            case "org_ventas_desde":
                setorg_ventas_desde(value.toUpperCase());
                // setFiltroInicial({
                //     org_ventas: value
                // })
                // let hola = document.getElementById('org_ventas_desde');
                // const hola1 = hola?.value || ''
                // console.log("PRUEBITA",hola1)
                // let separador = document.getElementById('org_ventas_desde');
                // if (separador) {
                //     separador.addEventListener('keyup', (e) => {
                //         e.target.value = e.target.value.toUpperCase();
                //     }, false);
                // }

                if (org_ventas_desde == "") {
                    setOrgVentasName("")
                }

                break;
            //ofi. ventas
            case "ofi_ventas_desde":
                // setFiltroInicial({
                //     ofi_ventas: value
                // })
                setofi_ventas_desde(value);
                if (ofi_ventas_desde == "") {
                    setofi_ventas_name("")
                }
                break;
            //lista precio
            case "lista_precio_desde":
                setlista_precio_desde(value);
                if (lista_precio_desde == "") {
                    setlista_precio_name("")
                }
                break;
            //cliente
            case "cliente_desde":
                setcliente_desde(value);
                if (cliente_desde == "") {
                    setclienteName("");
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
        }

    }

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



    // seleccionar pagina
    function changePage(pageNumber) {
        setresponse_lista_precios([]);
        if (indicadorfiltro == false) {
            Search(pageNumber, IsCampo, IsOrden);
        } else {
            setpageNumber(pageNumber);
            buscar_filtro_fila(pageNumber, IsCampo, IsOrden);
            // SearchFiltro();
        }
    }
    // siguiente pagina
    function prevPage(value) {
        setresponse_lista_precios([]);

        if (indicadorfiltro == false) {
            Search(value - 1, IsCampo, IsOrden);
        } else {
            setmodel_filtro({ ...model_filtro, IsNpag: value - 1 });
            // SearchFiltro();
            buscar_filtro_fila(value - 1, IsCampo, IsOrden);
        }
    }
    //pagina anterior
    function nextPage(value) {
        setresponse_lista_precios([]);

        if (indicadorfiltro == false) {
            Search(value + 1, IsCampo, IsOrden);
        } else {
            setmodel_filtro({ ...model_filtro, IsNpag: value + 1 });
            // SearchFiltro();
            buscar_filtro_fila(value + 1, IsCampo, IsOrden);
        }
    }

    const ChangeBusquedaMult_Material = () => {
        setrangos(rangos_material);
        settype_input("text");
        setind_rang({ num: 1, bool: true });
        setshowBusMult(true);
    };



    function Clear() {
        setmostrar_filtro_fila(false);
        setvaluepagination(false);
        setresponse_lista_precios([]);
        setrangos_material([{ Sign: "I", Option: "EQ", Low: "", High: "" }]);
        setorg_ventas_desde("");
        setofi_ventas_desde("");
        setlista_precio_desde("");

        handleChange("cliente", "");
        setcliente_desde("");

        handleChange("material", "");
        setmaterial_desde("");
        setmaterial_hasta("");

        // DESCRIPCIÓN

        setOrgVentasName("");
        setclienteName("");
        setofi_ventas_name("");
        setlista_precio_name("");

    }

    function clear_filtro_fila() {
        setf_vkorgField("");
        setf_matnrField("");
        setf_maktxField("");
        setf_kbetrField("");
        setf_konwaField("");
        setf_mxwrtField("");
        setf_konwa2Field("");
        setf_databField("");
        setf_datbiField("");
        setf_name1Field("");
        setf_namepltypField("");
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

        let model_lista_precios_filtro = {
            IsCampo: IsCampo,
            IsFecha: formatDateSAP(valido_el),
            IsNpag: pageNumber,
            IsOrden: IsOrden,
            IsPltyp: lista_precio_desde,
            IsRegxpag: IsRegxpag,
            IsUser: jwt(localStorage.getItem("_token")).username,
            IsVkbur: ofi_ventas_desde,
            IsVkorg: org_ventas_desde,
            ItFilter: [{
                Vkorg: f_vkorgField,
                Matnr: f_matnrField,
                Maktx: f_maktxField,
                Kbetr: Number(Number((f_kbetrField).replace(",", '')).toFixed(1)),
                Konwa: f_konwaField,
                Mxwrt: Number(Number((f_mxwrtField).replace(",", '')).toFixed(1)),
                Konwa2: f_konwa2Field,
                Datab: formatDateSAP(f_databField),
                Datib: formatDateSAP(f_datbiField),
                Name1: f_name1Field,
                Namepltyp: f_namepltypField
            }],
            ItMatnr: (material_desde || material_hasta) !== "" ?
                RangosMaterial() : [],
            IsKunnr: cliente_desde,
        };
        console.log("FILTRO TABLA LISTA PRECIO", model_lista_precios_filtro);
        setmostrar_filtro_fila(false);
        //arraycheckbox_export[0].data = [];
        setresponse_lista_precios([]);
        setspinner(true);
        ConsultaListaPrecios(model_lista_precios_filtro).then((result) => {
            setspinner(false);
            setresponse_lista_precios(
                result.etListaDetailField.map((d) => {
                    return {
                        select: true,
                        vkorgField: d.vkorgField,
                        matnrField: d.matnrField,
                        maktxField: d.maktxField,
                        kbetrField: d.kbetrField,
                        konwaField: d.konwaField,
                        mxwrtField: d.mxwrtField,
                        konwa2Field: d.konwa2Field,
                        databField: d.databField,
                        datbiField: d.datbiField,
                        name1Field: d.name1Field,
                        namepltypField: d.namepltypField
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
        if ((f_vkorgField || f_matnrField || f_maktxField || f_kbetrField || f_konwaField
            || f_mxwrtField || f_konwa2Field || f_databField || f_datbiField || f_name1Field || f_namepltypField) != "") {
            buscar_filtro_fila(1, "", "");
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

    const ValidacionSearch = () => {
        if ((org_ventas_desde == "" && ofi_ventas_desde == "" && lista_precio_desde == "")) {
            toast.error("Debe seleccionar una \"Org. Ventas.\", \"Oficina de Ventas.\" y \"Lista de Precio.\"", {
                position: "top-center",
                autoClose: 6000,
                style: {
                    backgroundColor: "#212121",
                    color: "#fff",
                },
            });
        }
        else if ((ofi_ventas_desde == "" && lista_precio_desde == "")) {
            toast.error("Debe seleccionar una \"Oficina de Ventas.\" y \"Lista de Precios.\"", {
                position: "top-center",
                autoClose: 6000,
                style: {
                    backgroundColor: "#212121",
                    color: "#fff",
                },
            });
        }
        else if ((org_ventas_desde == "" && lista_precio_desde == "")) {
            toast.error("Debe seleccionar una \"Org. Ventas.\" y \"Lista de Precios.\"", {
                position: "top-center",
                autoClose: 6000,
                style: {
                    backgroundColor: "#212121",
                    color: "#fff",
                },
            });
        }
        else if ((org_ventas_desde == "" && ofi_ventas_desde == "")) {
            toast.error("Debe seleccionar una \"Org. Ventas.\" y \"Oficina de Ventas.\"", {
                position: "top-center",
                autoClose: 6000,
                style: {
                    backgroundColor: "#212121",
                    color: "#fff",
                },
            });
        }
        else if ((org_ventas_desde == "")) {
            toast.error("Debe seleccionar una \"Org. Ventas.\"", {
                position: "top-center",
                autoClose: 6000,
                style: {
                    backgroundColor: "#212121",
                    color: "#fff",
                },
            });
        }
        else if ((ofi_ventas_desde == "")) {
            toast.error("Debe seleccionar una \"Oficina de Ventas.\"", {
                position: "top-center",
                autoClose: 6000,
                style: {
                    backgroundColor: "#212121",
                    color: "#fff",
                },
            });
        }
        else if ((lista_precio_desde == "")) {
            toast.error("Debe seleccionar una \"Lista de Precios.\"", {
                position: "top-center",
                autoClose: 6000,
                style: {
                    backgroundColor: "#212121",
                    color: "#fff",
                },
            });
        }
        else {
            Search(1, "", "");

        }
    }

    function onKeyUpOrgVentas(e) {
        var keycode = e.keyCode;
        console.log("KEYCODE ORG", keycode);
        let model = {
            IsParametro: "VKORG",
            PVkbur: "",
            PVkorg: org_ventas_desde,
            IsUser: jwt(localStorage.getItem("_token")).username,
        };
        if (keycode == "13") {
            MatchcodePromociones(model).then((result) => {
                if (result.etOrgVentasField.length == 1) {
                    setOrgVentasName(
                        result.etOrgVentasField[0].vtextField,
                    )
                    // setDescFiltroInicial({
                    //     ...descFiltroInicial,
                    //     org_ventas: result.etOrgVentasField[0].vtextField,
                    // });
                }
            });


        }
    }

    function onKeyUpOfiVentas(e) {
        var keycode = e.keyCode;

        let model = {
            IsParametro: "VKBUR",
            PVkbur: ofi_ventas_desde,
            PVkorg: "",
            IsUser: jwt(localStorage.getItem("_token")).username,
        };
        if (keycode == "13") {
            MatchcodePromociones(model).then((result) => {
                if (result.etOfiVentasField.length == 1) {
                    setofi_ventas_name(
                        result.etOfiVentasField[0].bezeiField,
                    )
                }
            });
        }
    }

    function onKeyUpLPrecios(e) {
        var keycode = e.keyCode;
        console.log("KEY CODE", keycode)
        let model = {
            IsParametro: "PLTYP",
            PKunnr: "",
            PPltyp: lista_precio_desde,
        };
        if (keycode == "13") {
            ParamEnter(model).then((result) => {
                if (result.etListaPreciosField.length == 1) {
                    setlista_precio_name(
                        result.etListaPreciosField[0].ptextField,
                    )
                }
            });
        }
    }

    function onKeyUpClientes(e) {
        var keycode = e.keyCode;
        console.log("KEY CODE", keycode)
        let model = {
            IsParametro: "KUNNR",
            PKunnr: cliente_desde,
            PPltyp: "",
        };
        if (keycode == "13") {
            ParamEnter(model).then((result) => {
                if (result.etClientesField.length == 1) {
                    setclienteName(
                        result.etClientesField[0].name1Field,
                    )
                }
            });
        }
    }

    return (
        <React.Fragment>
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
                        {/* /////////// */}
                        <Mc_Org_Ventas_desde
                            showorgventa={showorgventa_desde}
                            setshoworgventa={setshoworgventa_desde}
                            setorg_ventas_desde={setorg_ventas_desde}
                            org_ventas_desde={org_ventas_desde}
                            setorg_ventas={setorg_ventas}
                            setOrgVentasName={setOrgVentasName}
                        />
                        {/* MODAL MATCHCODE OFICINA DE VENTAS */}
                        <Mc_Ofi_Ventas_desde
                            showofiventa={showofiventa_desde}
                            setshowofiventa={setshowofiventa_desde}
                            setofi_ventas_desde={setofi_ventas_desde}
                            ofi_ventas_desde={ofi_ventas_desde}
                            setofi_ventas={setofi_ventas}
                            setofi_ventas_name={setofi_ventas_name}
                        />

                        {/* MODAL MATCHCODE LISTA DE PRECIOS */}
                        <Mc_Lista_Precio_desde
                            showlistaprecio={showlistaprecio_desde}
                            setshowlistaprecio={setshowlistaprecio_desde}
                            setlista_precio_desde={setlista_precio_desde}
                            lista_precio_desde={lista_precio_desde}
                            setlista_precio={setlista_precio}
                            setlista_precio_name={setlista_precio_name}
                        />
                        {/* MODAL MATCHCODE MATERIAL */}
                        <Mc_Material_desde
                            showmaterial={showmaterial_desde}
                            setshowmaterial={setshowmaterial_desde}
                            setmaterial_desde={setmaterial_desde}
                            material_desde={material_desde}
                            material_hasta={material_hasta}
                            setmaterial={setmaterial}
                            orgVentas={org_ventas_desde}
                        />
                        <Mc_Material_hasta
                            showmaterial={showmaterial_hasta}
                            setshowmaterial={setshowmaterial_hasta}
                            setmaterial_hasta={setmaterial_hasta}
                            material_hasta={material_hasta}
                            material_desde={material_desde}
                            setmaterial={setmaterial}
                            orgVentas={org_ventas_desde}
                        />

                        {/* MODAL MATCHCODE CLIENTE */}
                        <Mc_Cliente_desde_v2
                            showcliente={showcliente_desde}
                            setshowcliente={setshowcliente_desde}
                            setcliente_desde={setcliente_desde}
                            cliente_desde={cliente_desde}
                            //cliente_hasta={cliente_hasta}
                            setcliente={setcliente}
                            org_ventas={org_ventas_desde}
                            ofi_ventas={ofi_ventas_desde}
                            lista_precio={lista_precio_desde}
                            setclienteName={setclienteName}
                        />
                        <Toaster />

                        <div className="title-section">
                            <div>
                                <label> Reportes / Lista de Precios </label>
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

                                {/* Org. Ventas */}
                                <div className="col-sm-4 d-flex align-items-center">
                                    <label>
                                        <label>Organización Ventas : </label>{" "}
                                        <label style={{ color: "red" }}>(*)</label>
                                    </label>
                                </div>
                                <div className="col-sm-3">
                                    <InputFormKeyUp
                                        attribute={{
                                            name: "org_ventas_desde",
                                            id: "org_ventas_desde",
                                            type: "text",
                                            value: org_ventas_desde,
                                            disabled: false,
                                            checked: false,
                                            matchcode: true,
                                            maxlength: 4,
                                        }}
                                        handleChange={handleChange}
                                        onClick={() => mc_org_ventas_desde()}
                                        onKeyUp={(e) => onKeyUpOrgVentas(e)}
                                    />
                                </div>
                                {/* <div className="col-sm-3">
                                    <label className="py-2" id="lblorgventas">
                                        {descFiltroInicial.org_ventas}
                                    </label>
                                </div> */}

                                <div className="col-sm-3">
                                    <label className="py-2">
                                        {org_ventas_desde != "" ? orgVentasName : ""}
                                    </label>
                                </div>

                                {/* Oficina de Ventas */}
                                <div className="col-sm-4 d-flex align-items-center">
                                    <label>
                                        <label>Oficina de Ventas : </label>{" "}
                                        <label style={{ color: "red" }}>(*)</label>
                                    </label>
                                </div>
                                <div className="col-sm-3">
                                    <InputFormKeyUp
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
                                        onKeyUp={(e) => onKeyUpOfiVentas(e)}
                                    />
                                </div>
                                <div className="col-sm-3">
                                    <label className="py-2">
                                        {ofi_ventas_desde != "" ? ofiVentasName : ""}
                                    </label>
                                </div>

                                {/* Lista de Precios */}
                                <div className="col-sm-4 d-flex align-items-center">
                                    <label>
                                        <label>Lista de Precios : </label>{" "}
                                        <label style={{ color: "red" }}>(*)</label>
                                    </label>
                                </div>
                                <div className="col-sm-3">
                                    <InputFormKeyUp
                                        attribute={{
                                            name: "lista_precio_desde",
                                            type: "text",
                                            value: lista_precio_desde,
                                            disabled: false,
                                            checked: false,
                                            matchcode: true,
                                            maxlength: 4,
                                        }}
                                        handleChange={handleChange}
                                        onClick={() => mc_lista_precio_desde()}
                                        onKeyUp={(e) => onKeyUpLPrecios(e)}
                                    />
                                </div>
                                <div className="col-sm-3">
                                    {/* <label className="py-2">
                                        {lista_precio_desde != "" ? listaPrecioName : ""}
                                    </label> */}
                                    <label className="py-2">
                                        {lista_precio_desde != "" ? listaPrecioName : ''}
                                    </label>
                                </div>

                                {/* MATERIAL */}
                                <div className="col-sm-4 d-flex align-items-center">
                                    <label>Material : </label>
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
                                            maxlength: 10,
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
                                            maxlength: 10,
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

                                {/* CLIENTE */}
                                <div className="col-sm-4 d-flex align-items-center">
                                    <label>Cliente : </label>
                                </div>
                                <div className="col-sm-3">
                                    <InputFormKeyUp
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
                                        onKeyUp={(e) => onKeyUpClientes(e)}
                                    />
                                </div>
                                <div className="col-sm-3">
                                    <label className="py-2">
                                        {cliente_desde != '' ? clienteName : ''}
                                    </label>
                                </div>
                                {/* <div className="col-sm-3">
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
                                </div> */}

                                {/* FECHA VALIDO EL */}
                                <div className="col-sm-4 d-flex align-items-center">
                                    <label>Fecha de Consulta : </label>
                                </div>
                                <div className="col-sm-3">
                                    <InputForm
                                        attribute={{
                                            name: "valido_el",
                                            type: "date",
                                            value: valido_el,
                                            disabled: true,
                                            checked: false,
                                            matchcode: false,
                                            //maxlength: 10,
                                        }}
                                        handleChange={handleChange}
                                    //onClick={() => mc_cliente_desde()}
                                    />
                                </div>
                                <div className="col-sm-3">

                                </div>
                                <div className="col-sm-2 d-flex align-items-center">

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
                            {response_lista_precios.length ? (
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
                            {/* <div className="content-table">
                                <TreeTable  reorderableColumns>
                                    <Column field="name" header="Name" expander></Column>
                                    <Column field="size" header="Size"></Column>
                                    <Column field="type" header="Type"></Column>
                                </TreeTable>
                            </div> */}
                            <div className="container-table">
                                <div className="container-table-sm">
                                    <table className="content-table">
                                        <thead>
                                            <tr>
                                                {/* <th>
                                                    <input
                                                        type="checkbox"
                                                        onClick={(e) => {
                                                            onClickHeaderCheckbox(e);
                                                        }}
                                                    />
                                                </th> */}
                                                <th></th>
                                                <th>
                                                    Org. Venta |{" "}
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
                                                    Cod. Mat |{" "}
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
                                                    Material |{" "}
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
                                                    Precio LP |{" "}
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
                                                    Mon. |{" "}
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
                                                <th style={{ textAlign: "center" }}>
                                                    Precio Min. |{" "}
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
                                                    Mon. |{" "}
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
                                                    Fecha Inicio |{" "}
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
                                                    Fecha Fin |{" "}
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
                                                {(cliente_desde != "") && (
                                                    <th>
                                                        Cliente |{" "}
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
                                                )}
                                                <th>
                                                    Lista de Precios |{" "}
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
                                                {/* <th>Acción</th> */}
                                            </tr>
                                        </thead>
                                        <tbody>
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
                                                    <th style={{ textAlign: "center" }}>
                                                        <div >
                                                            <select style={{ paddingTop: "4px", paddingBottom: "3px" }} className="px-2"
                                                                name="f_vkorgField"
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
                                                            name="f_matnrField"
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
                                                        <input style={{ width: "270px" }}
                                                            type="text"
                                                            onKeyUp={(e) => buscar_filtro_enter(e)}
                                                            name="f_maktxField"
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
                                                        <input style={{ width: "110px" }}
                                                            type="text"
                                                            onKeyUp={(e) => buscar_filtro_enter(e)}
                                                            name="f_kbetrField"
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
                                                        <input style={{ width: "60px" }}
                                                            type="text"
                                                            onKeyUp={(e) => buscar_filtro_enter(e)}
                                                            name="f_konwaField"
                                                            maxLength="3"
                                                            onChange={(e) =>
                                                                handleChangeFiltro(
                                                                    e.target.name,
                                                                    e.target.value
                                                                )
                                                            }
                                                        />
                                                    </th>
                                                    <th>
                                                        <input style={{ width: "110px" }}
                                                            type="text"
                                                            onKeyUp={(e) => buscar_filtro_enter(e)}
                                                            name="f_mxwrtField"
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
                                                        <input style={{ width: "60px" }}
                                                            type="text"
                                                            onKeyUp={(e) => buscar_filtro_enter(e)}
                                                            name="f_konwa2Field"
                                                            maxLength="3"
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
                                                            name="f_databField"
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
                                                        <input
                                                            type="date"
                                                            onKeyUp={(e) => buscar_filtro_enter(e)}
                                                            name="f_datbiField"
                                                            style={{ paddingTop: "1.5px", paddingBottom: "1px" }} className="px-2"
                                                            onChange={(e) =>
                                                                handleChangeFiltro(
                                                                    e.target.name,
                                                                    e.target.value
                                                                )
                                                            }
                                                        />
                                                    </th>
                                                    {(cliente_desde != "") && (
                                                    <th>
                                                        <input style={{ width: "300px" }}
                                                            type="text"
                                                            onKeyUp={(e) => buscar_filtro_enter(e)}
                                                            name="f_name1Field"
                                                            maxLength="40"
                                                            onChange={(e) =>
                                                                handleChangeFiltro(
                                                                    e.target.name,
                                                                    e.target.value
                                                                )
                                                            }
                                                        />
                                                    </th>
                                                    )}
                                                    <th>
                                                        <input
                                                            type="text"
                                                            onKeyUp={(e) => buscar_filtro_enter(e)}
                                                            name="f_namepltypField"
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

                                            {response_lista_precios != null &&
                                                response_lista_precios.length > 0
                                                ? response_lista_precios.map((response, key) => {
                                                    return (
                                                        <tr key={key}>
                                                            {/* <th>
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
                                                            </th> */}
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
                                                            <th style={{ textAlign: "center" }}>
                                                                {convertDecimal(response.kbetrField)}
                                                            </th>
                                                            <th style={{ textAlign: "center" }}>
                                                                {response.konwaField}
                                                            </th>
                                                            <th style={{ textAlign: "center" }}>
                                                                {convertDecimal(response.mxwrtField)}
                                                            </th>
                                                            <th style={{ textAlign: "center" }}>
                                                                {response.konwa2Field}
                                                            </th>
                                                            <th style={{ textAlign: "center" }}>
                                                                {formatFecha(response.databField)}
                                                            </th>
                                                            <th style={{ textAlign: "center" }}>
                                                                {formatFecha(response.datbiField)}
                                                            </th>
                                                            {(cliente_desde != "") && (
                                                                <th style={{ textAlign: "left" }}>
                                                                    {(response.name1Field)}
                                                                </th>
                                                            )}

                                                            <th style={{ textAlign: "center" }}>
                                                                {(response.namepltypField)}
                                                            </th>
                                                            {/* <th
                                                            //onClick={() => verPedido(response.vbelnField)}
                                                            >
                                                                <i
                                                                    className="fas fa-clipboard-list"
                                                                    title="Ver pedido"
                                                                ></i>
                                                            </th> */}
                                                        </tr>
                                                    );
                                                })
                                                : null}
                                        </tbody>
                                    </table>
                                </div>
                                {response_lista_precios == 0 && spinner == false ? (
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
export default Lista_Precio;