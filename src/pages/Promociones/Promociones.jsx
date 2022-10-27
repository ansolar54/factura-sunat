import React, { useEffect, useState } from "react";
import InputForm from "../../components/InputForm";
import BtnSearch from "../../components/BtnSearch";
import jwt from "jwt-decode";
import {
  ConsuPromocionesBuscar,
  ConsuPromocionesBuscarFiltro,
  MatchcodePromociones,
} from "../../Services/ServicePromociones";
import Spinner from "../../components/Spinner";
import Pagination from "../../components/Pagination";
import Matchcode_Org_Ventas from "./Matchcode_Org_Ventas/Matchcode_Org_Ventas";
import Matchcode_Lista_Precios from "./Matchcode_Lista_Precios/Matchcode_Lista_Precios";
import Matchcode_Ofi_Ventas from "./Matchcode_Ofi_Ventas/Matchcode_Ofi_Ventas";
import { RegistrarAuditoria } from "../../Services/ServiceAuditoria";
import { ValidarRuta } from "../../Services/ServiceValidaUsuario";
import InputFormKeyUp from "../../components/InputFormKeyUp";

const Promociones = () => {
  var n = new Date();
  //Año
  var y = n.getFullYear();
  //Mes
  var m = ("0" + (n.getMonth() + 1)).slice(-2);
  //Día
  var d = ("0" + n.getDate()).slice(-2);

  const [showOrgVentas, setShowOrgVentas] = useState(false);
  const [showListaPrecios, setShowListaPrecios] = useState(false);
  const [showOfiVentas, setShowOfiVentas] = useState(false);

  const [ind_pagina, setind_pagina] = useState(1);
  const [IsRegxpag] = useState(15); // cantidad de datos por página
  const [pageNumber, setpageNumber] = useState(1);
  const [mostrar_filtro_fila, setmostrar_filtro_fila] = useState(false);
  const [text_btn_filtro, settext_btn_filtro] = useState("Filtrar");
  const [IsCampo, setIsCampo] = useState("");
  const [IsOrden, setIsOrden] = useState("");
  const [indicadorfiltro, setindicadorfiltro] = useState(false);
  //NUMERO TOTAL DE DATOS
  const [TotalData, setTotalData] = useState();
  //CARGA DE SPINNER
  const [spinner, setspinner] = useState(false);
  //ACTIVAR SECCION DE PAGINADO
  const [valuepagination, setvaluepagination] = useState(false);
  const [filtroInicial, setFiltroInicial] = useState({
    org_ventas: [{ Sign: "I", Option: "EQ", Low: "", High: "" }],
    canal_distri: [{ Sign: "I", Option: "EQ", Low: "22", High: "" }],
    lista_precios: [{ Sign: "I", Option: "EQ", Low: "", High: "" }],
    ofi_ventas: [{ Sign: "I", Option: "EQ", Low: "", High: "" }],
    valido_el: [
      { Sign: "I", Option: "EQ", Low: y + "-" + m + "-" + d, High: "" },
    ],
  });
  const [descFiltroInicial, setDescFiltroInicial] = useState({
    org_ventas: "",
    lista_precios: "",
    ofi_ventas: "",
  });
  const [resultado_consulta_promociones, setresultado_consulta_promociones] =
    useState([]);

  const [f_matnrField, setf_matnrField] = useState("");
  const [f_maktxField, setf_maktxField] = useState("");
  const [f_knrmmField, setf_knrmmField] = useState("");
  const [f_knrnmField, setf_knrnmField] = useState("");
  const [f_knrmeField, setf_knrmeField] = useState("");
  const [f_knrzmField, setf_knrzmField] = useState("");
  const [f_knrezField, setf_knrezField] = useState("");
  const [f_vkorgField, setf_vkorgField] = useState("");
  const [f_knrmatField, setf_knrmatField] = useState("");
  const [f_nrmaktxtField, setf_nrmaktxtField] = useState("");

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

  //PARA ACCESO A RUTA
  const [accesoruta, setaccesoruta] = useState(false);
  //CARGA DE SPINNER DE ACCESO DE RUTA
  const [spinnerroute, setspinnerroute] = useState(false);
  //INDICADOR SI YA VALIDO RUTA
  const [indicadorruta, setindicadorruta] = useState(false);

  useEffect(() => {
    if (indicadorruta == false) {
      setspinnerroute(true);
      ValidarRuta("05").then((result) => {
        if (result.reporte == 1) {
          setspinnerroute(false);
          setaccesoruta(true);
          setindicadorruta(true);
          setTimeout(() => {
            // var n =  new Date();
            // //Año
            // var y = n.getFullYear();
            // //Mes
            // var m = n.getMonth() + 1;
            // //Día
            // var d = n.getDate();
            // console.log(d + "/" + m + "/" + y)
            // setFiltroInicial({
            //   ...filtroInicial,
            //   ["valido_el"]: [{ Sign: "I", Option: "EQ", Low: d + "/" + m + "/" + y, High: "" }],
            // });
            // console.log(filtroInicial)
            // document.getElementById('valido_el').value = d + "/" + m + "/" + y;
          }, 1000);
        } else {
          setspinnerroute(false);
          setaccesoruta(false);
          setindicadorruta(true);
        }
      });
    }
    //REGISTRO DE AUDITORÍA
    RegistrarAuditoria({
      id_user: Number(jwt(localStorage.getItem("_token")).nameid),
      id_event: 6,
    });
  }, []);

  //formateo de la fecha para enviar a SAP YYYYMMDD
  function formatDateSAP(value) {
    var datePart = value.match(/\d+/g),
      year = datePart[0],
      month = datePart[1],
      day = datePart[2];

    return year + "" + month + "" + day;
  }

  function handleChange(name, value) {
    // console.log(name, value);
    setFiltroInicial({
      ...filtroInicial,
      [name]: [{ Sign: "I", Option: "EQ", Low: value, High: "" }],
    });
  }

  function Search(page, IsCampo, IsOrden) {
    console.log(IsCampo);
    setspinner(true);
    setindicadorfiltro(false);
    setTotalData(0);
    if (pageNumber == 1) {
      setind_pagina(1);
    } else {
      setind_pagina(0);
    }

    if (filtroInicial.org_ventas[0].Low !== "") {
      document.getElementById("lblorgventas").style.display = "block"; //@JR
      let model_vkorg = {
        IsParametro: "VKORG",
        PVkbur: "",
        PVkorg: filtroInicial.org_ventas[0].Low,
        IsUser:jwt(localStorage.getItem("_token")).username
      };
      MatchcodePromociones(model_vkorg).then((result) => {
        if (result.etOrgVentasField.length == 1) {
          setDescFiltroInicial({
            ...descFiltroInicial,
            org_ventas: result.etOrgVentasField[0].vtextField,
          });
        }
      });
    } else {
      
      document.getElementById("lblorgventas").style.display = "none"; //@JR
      setDescFiltroInicial({
        ...descFiltroInicial,
        org_ventas: "",
      });
    }

    if (filtroInicial.ofi_ventas[0].Low !== "") {
      let model_vkbur = {
        IsParametro: "VKBUR",
        PVkbur: filtroInicial.ofi_ventas[0].Low,
        PVkorg: "",
        IsUser:jwt(localStorage.getItem("_token")).username
      };
      MatchcodePromociones(model_vkbur).then((result) => {
        if (result.etOfiVentasField.length == 1) {
          setDescFiltroInicial({
            ...descFiltroInicial,
            ofi_ventas: result.etOfiVentasField[0].bezeiField,
          });
        }
      });
    }else{
      setDescFiltroInicial({
        ...descFiltroInicial,
        ofi_ventas: "",
      });
    }

    let model_consulta_promociones = {
      IsCampo: IsCampo,
      IsNpag: page,
      IsOrden: IsOrden,
      IsRegxpag: IsRegxpag,
      IsUser: jwt(localStorage.getItem("_token")).username,
      ItDatam:
        filtroInicial.valido_el[0].Low.length == 10
          ? [
              {
                Sign: "I",
                Option: "EQ",
                Low: formatDateSAP(filtroInicial.valido_el[0].Low),
                High: "",
              },
            ]
          : [{ Sign: "I", Option: "EQ", Low: "", High: "" }],
      ItPltyp: filtroInicial.lista_precios,
      ItVkbur: filtroInicial.ofi_ventas,
      ItVkorg: filtroInicial.org_ventas,
      ItVtweg: filtroInicial.canal_distri,
    };

    ConsuPromocionesBuscar(model_consulta_promociones).then((result) => {
      setspinner(false);
      setresultado_consulta_promociones(result.etOutputField);
      setvaluepagination(true);
      setTotalData(result.esRegtotField.trim());
    });
    
  }

  function Clear() {
    setvaluepagination(false);
    setFiltroInicial({
      org_ventas: [{ Sign: "I", Option: "EQ", Low: "", High: "" }],
      canal_distri: [{ Sign: "I", Option: "EQ", Low: "22", High: "" }],
      lista_precios: [{ Sign: "I", Option: "EQ", Low: "", High: "" }],
      ofi_ventas: [{ Sign: "I", Option: "EQ", Low: "", High: "" }],
      valido_el: [{ Sign: "I", Option: "EQ", Low: "", High: "" }],
    });
    setresultado_consulta_promociones([]);
    setDescFiltroInicial({
      org_ventas: "",
      lista_precios: "",
      ofi_ventas: "",
    });
  }

  // seleccionar pagina
  function changePage(pageNumber) {
    setresultado_consulta_promociones([]);
    Search(pageNumber, IsCampo, IsOrden);
  }
  // siguiente pagina
  function prevPage(value) {
    setresultado_consulta_promociones([]);
    Search(value - 1, IsCampo, IsOrden);
  }
  //pagina anterior
  function nextPage(value) {
    setresultado_consulta_promociones([]);
    Search(value + 1, IsCampo, IsOrden);
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
    setresultado_consulta_promociones([]);
    setspinner(true);

    let model = {
      IsCampo: IsCampo,
      IsNpag: pageNumber,
      IsOrden: IsOrden,
      IsRegxpag: IsRegxpag,
      IsUser: jwt(localStorage.getItem("_token")).username,
      ItFilter: [
        {
          Vkorg: f_vkorgField,
          Matnr: f_matnrField,
          Maktx: f_maktxField,
          Knumh: "",
          Knrmm: f_knrmmField,
          Knrmat: f_knrmatField,
          Knrnm: f_knrnmField,
          Knrme: f_knrmeField,
          Knrzm: f_knrzmField,
          Knrez: f_knrezField,
          Nrmaktxt: f_nrmaktxtField,
        },
      ],
      ItDatam:
        filtroInicial.valido_el[0].Low.length == 10
          ? [
              {
                Sign: "I",
                Option: "EQ",
                Low: formatDateSAP(filtroInicial.valido_el[0].Low),
                High: "",
              },
            ]
          : [{ Sign: "I", Option: "EQ", Low: "", High: "" }],
      ItPltyp: filtroInicial.lista_precios,
      ItVkbur: filtroInicial.ofi_ventas,
      ItVkorg: filtroInicial.org_ventas,
      ItVtweg: filtroInicial.canal_distri,
    };

    ConsuPromocionesBuscarFiltro(model).then((result) => {
      setspinner(false);
      setresultado_consulta_promociones(result.etOutputField);
      setvaluepagination(true);
      setTotalData(result.esRegtotField.trim());
    });
  }

  function handleChangeColumna(num_col) {
    switch (num_col) {
      // 1: ascendente
      // 0: descendente
      case 1:
        clearColumnsIcon(1);
        if (col_1 === 0) {
          setcol_1(col_1 + 1);
          setIsCampo("MATNR");
          setIsOrden("0");
          if (indicadorfiltro == true) {
            buscar_filtro_fila(1, "MATNR", "0");
          } else {
            Search(1, "MATNR", "0");
          }
        } else if (col_1 === 1) {
          setcol_1(col_1 + 1);
          setIsCampo("MATNR");
          setIsOrden("1");
          if (indicadorfiltro == true) {
            buscar_filtro_fila(1, "MATNR", "1");
          } else {
            Search(1, "MATNR", "1");
          }
        } else {
          setcol_1(0);
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
          setIsCampo("MAKTX");
          setIsOrden("0");
          if (indicadorfiltro == true) {
            buscar_filtro_fila(1, "MAKTX", "0");
          } else {
            Search(1, "MAKTX", "0");
          }
        } else if (col_2 === 1) {
          setcol_2(col_2 + 1);
          setIsCampo("MAKTX");
          setIsOrden("1");
          if (indicadorfiltro == true) {
            buscar_filtro_fila(1, "MAKTX", "1");
          } else {
            Search(1, "MAKTX", "1");
          }
        } else {
          setcol_2(0);
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
          setIsCampo("KNRMM");
          setIsOrden("0");
          if (indicadorfiltro == true) {
            buscar_filtro_fila(1, "KNRMM", "1");
          } else {
            Search(1, "KNRMM", "0");
          }
        } else if (col_3 === 1) {
          setcol_3(col_3 + 1);
          setIsCampo("KNRMM");
          setIsOrden("1");
          if (indicadorfiltro == true) {
            buscar_filtro_fila(1, "KNRMM", "1");
          } else {
            Search(1, "KNRMM", "1");
          }
        } else {
          setcol_3(0);
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
          setIsCampo("KNRNM");
          setIsOrden("0");
          if (indicadorfiltro == true) {
            buscar_filtro_fila(1, "KNRNM", "0");
          } else {
            Search(1, "KNRNM", "0");
          }
        } else if (col_4 === 1) {
          setcol_4(col_4 + 1);
          setIsCampo("KNRNM");
          setIsOrden("1");
          if (indicadorfiltro == true) {
            buscar_filtro_fila(1, "KNRNM", "1");
          } else {
            Search(1, "KNRNM", "1");
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
          setIsCampo("KNRME");
          setIsOrden("0");
          if (indicadorfiltro == true) {
            buscar_filtro_fila(1, "KNRME", "0");
          } else {
            Search(1, "KNRME", "0");
          }
        } else if (col_5 === 1) {
          setcol_5(col_5 + 1);
          setIsCampo("KNRME");
          setIsOrden("1");
          if (indicadorfiltro == true) {
            buscar_filtro_fila(1, "KNRME", "1");
          } else {
            Search(1, "KNRME", "1");
          }
        } else {
          setcol_5(0);
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
          setIsCampo("KNRZM");
          setIsOrden("0");
          if (indicadorfiltro == true) {
            buscar_filtro_fila(1, "KNRZM", "0");
          } else {
            Search(1, "KNRZM", "0");
          }
        } else if (col_6 === 1) {
          setcol_6(col_6 + 1);
          setIsCampo("KNRZM");
          setIsOrden("1");
          if (indicadorfiltro == true) {
            buscar_filtro_fila(1, "KNRZM", "1");
          } else {
            Search(1, "KNRZM", "1");
          }
        } else {
          setcol_6(0);
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
          // Search(1, 0, "WAERK", "0");
          setIsCampo("KNREZ");
          setIsOrden("0");
          if (indicadorfiltro == true) {
            buscar_filtro_fila(1, "KNREZ", "0");
          } else {
            Search(1, "KNREZ", "0");
          }
        } else if (col_7 === 1) {
          setcol_7(col_7 + 1);
          // Search(1, 0, "WAERK", "1");
          setIsCampo("KNREZ");
          setIsOrden("1");
          if (indicadorfiltro == true) {
            buscar_filtro_fila(1, "KNREZ", "1");
          } else {
            Search(1, "KNREZ", "1");
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
          // Search(1, 0, "WAERK", "0");
          setIsCampo("VKORG");
          setIsOrden("0");
          if (indicadorfiltro == true) {
            buscar_filtro_fila(1, "VKORG", "0");
          } else {
            Search(1, "VKORG", "0");
          }
        } else if (col_8 === 1) {
          setcol_8(col_8 + 1);
          // Search(1, 0, "WAERK", "1");
          setIsCampo("VKORG");
          setIsOrden("1");
          if (indicadorfiltro == true) {
            buscar_filtro_fila(1, "VKORG", "1");
          } else {
            Search(1, "VKORG", "1");
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
          // Search(1, 0, "WAERK", "0");
          setIsCampo("KNRMAT");
          setIsOrden("0");
          if (indicadorfiltro == true) {
            buscar_filtro_fila(1, "KNRMAT", "0");
          } else {
            Search(1, "KNRMAT", "0");
          }
        } else if (col_9 === 1) {
          setcol_9(col_9 + 1);
          // Search(1, 0, "WAERK", "1");
          setIsCampo("KNRMAT");
          setIsOrden("1");
          if (indicadorfiltro == true) {
            buscar_filtro_fila(1, "KNRMAT", "1");
          } else {
            Search(1, "KNRMAT", "1");
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
          // Search(1, 0, "WAERK", "0");
          setIsCampo("NRMAKTXT");
          setIsOrden("0");
          if (indicadorfiltro == true) {
            buscar_filtro_fila(1, "NRMAKTXT", "0");
          } else {
            Search(1, "NRMAKTXT", "0");
          }
        } else if (col_10 === 1) {
          setcol_10(col_10 + 1);
          // Search(1, 0, "WAERK", "1");
          setIsCampo("NRMAKTXT");
          setIsOrden("1");
          if (indicadorfiltro == true) {
            buscar_filtro_fila(1, "NRMAKTXT", "1");
          } else {
            Search(1, "NRMAKTXT", "1");
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
    }
  }

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

  function clear_filtro_fila() {
    setf_matnrField("");
    setf_maktxField("");
    setf_knrmmField("");
    setf_knrnmField("");
    setf_knrmeField("");
    setf_knrzmField("");
    setf_knrezField("");
    setf_vkorgField("");
    setf_knrmatField("");
    setf_nrmaktxtField("");
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
  }

  function buscar_filtro_icono_btn() {
    buscar_filtro_fila(1, "", "");
  }

  //para el filtro
  function handleChangeFiltro(name, value) {
    switch (name) {
      case "f_matnrField":
        setf_matnrField(value);
        break;
      case "f_maktxField":
        setf_maktxField(value);
        break;
      case "f_knrmmField":
        setf_knrmmField(value);
        break;
      case "f_knrnmField":
        setf_knrnmField(value);
        break;
      case "f_knrmeField":
        setf_knrmeField(value);
        break;
      case "f_knrzmField":
        setf_knrzmField(value);
        break;
      case "f_knrezField":
        setf_knrezField(value);
        break;
      case "f_vkorgField":
        setf_vkorgField(value);
        break;
      case "f_knrmatField":
        setf_knrmatField(value);
        break;
      case "f_nrmaktxtField":
        setf_nrmaktxtField(value);
        break;
      default:
        break;
    }
  }

  function buscar_filtro_enter(event) {
    var keycode = event.keyCode;
    if (keycode == "13") {
      buscar_filtro_fila(1, "", "");
    }
  }

  const mc_org_ventas = () => {
    setShowOrgVentas((prev) => !prev);
  };

  const mc_lista_precios = () => {
    setShowListaPrecios((prev) => !prev);
  };

  const mc_ofi_ventas = () => {
    setShowOfiVentas((prev) => !prev);
  };

  function onKeyUpOrgVentas(e) {
    var keycode = e.keyCode;
    console.log(keycode);
    let model = {
      IsParametro: "VKORG",
      PVkbur: "",
      PVkorg: filtroInicial.org_ventas[0].Low,
      IsUser:jwt(localStorage.getItem("_token")).username
    };
    if (keycode == "13") {
      document.getElementById("lblorgventas").style.display = "block"; //@JR
      MatchcodePromociones(model).then((result) => {
        if (result.etOrgVentasField.length == 1) {
          setDescFiltroInicial({
            ...descFiltroInicial,
            org_ventas: result.etOrgVentasField[0].vtextField,
          });
          // nameOrgVentas = result.etOrgVentasField[0].vtextField
        }
      });
    }
  }

  function onKeyUpOfiVentas(e) {
    var keycode = e.keyCode;

    let model = {
      IsParametro: "VKBUR",
      PVkbur: filtroInicial.ofi_ventas[0].Low,
      PVkorg: "",
      IsUser:jwt(localStorage.getItem("_token")).username
    };
    if (keycode == "13") {
      MatchcodePromociones(model).then((result) => {
        if (result.etOfiVentasField.length == 1) {
          setDescFiltroInicial({
            ...descFiltroInicial,
            ofi_ventas: result.etOfiVentasField[0].bezeiField,
          });
          // nameOfiVentas = result.etOfiVentasField[0].bezeiField
        }
      });
    }
  }

  return (
    <React.Fragment>
      {spinnerroute ? (
        <Spinner />
      ) : (
        <React.Fragment>
          {accesoruta ? (
            <div className="container-view">
              <Matchcode_Org_Ventas
                showOrgVentas={showOrgVentas}
                setShowOrgVentas={setShowOrgVentas}
                setFiltroInicial={setFiltroInicial}
                filtroInicial={filtroInicial}
                setDescFiltroInicial={setDescFiltroInicial}
                descFiltroInicial={descFiltroInicial}
              />
              {/* <Matchcode_Lista_Precios
                showListaPrecios={showListaPrecios}
                setShowListaPrecios={setShowListaPrecios}
                setFiltroInicial={setFiltroInicial}
                filtroInicial={filtroInicial}
                setDescFiltroInicial={setDescFiltroInicial}
                descFiltroInicial={descFiltroInicial}
              /> */}
              <Matchcode_Ofi_Ventas
                showOfiVentas={showOfiVentas}
                setShowOfiVentas={setShowOfiVentas}
                setFiltroInicial={setFiltroInicial}
                filtroInicial={filtroInicial}
                setDescFiltroInicial={setDescFiltroInicial}
                descFiltroInicial={descFiltroInicial}
              />

              <div className="title-section">
                <div>
                  <label> Reportes / Promociones </label>
                  <label> Tipo cambio : <label style={{color: '#03BF68'}}>{localStorage.getItem("_tipoCambio")}</label> </label>
                </div>
                <hr />
              </div>
              <section>
                <div style={{ margin: "10px" }} className="row">
                  <div className="col-sm-2 d-flex align-items-center">
                    <label>Organización de ventas:</label>
                  </div>
                  <div className="col-sm-2">
                    <InputFormKeyUp
                      attribute={{
                        name: "org_ventas",
                        type: "text",
                        value: filtroInicial.org_ventas[0].Low,
                        disabled: false,
                        checked: false,
                        matchcode: true,
                        maxlength: 10,
                      }}
                      handleChange={handleChange}
                      onClick={() => mc_org_ventas()}
                      onKeyUp={(e) => onKeyUpOrgVentas(e)}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                    className="col-sm-2"
                  >
                    <label id="lblorgventas">{descFiltroInicial.org_ventas}</label>
                    {/* <label>{nameOrgVentas}</label> */}
                  </div>
                  <div className="col-sm-2 d-flex align-items-center">
                    <label>Canal distribuidor:</label>
                  </div>
                  <div className="col-sm-2">
                    <InputForm
                      attribute={{
                        name: "canal_distri",
                        type: "text",
                        value: 22,
                        disabled: true,
                        checked: false,
                        matchcode: false,
                        maxlength: 10,
                      }}
                      handleChange={handleChange}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                    className="col-sm-2"
                  >
                    <label>DISTRIBUIDOR</label>
                  </div>
                  {/* <div className="col-sm-2 d-flex align-items-center">
                    <label>Lista de precios:</label>
                  </div>
                  <div className="col-sm-2">
                    <InputForm
                      attribute={{
                        name: "lista_precios",
                        type: "text",
                        value: filtroInicial.lista_precios[0].Low,
                        disabled: false,
                        checked: false,
                        matchcode: true,
                        maxlength: 10,
                      }}
                      handleChange={handleChange}
                      onClick={() => mc_lista_precios()}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                    className="col-sm-2"
                  >
                    <label>{descFiltroInicial.lista_precios}</label>
                  </div> */}

                  <div className="col-sm-2 d-flex align-items-center">
                    <label>Válido el:</label>
                  </div>
                  <div className="col-sm-2">
                    <InputForm
                      attribute={{
                        name: "valido_el",
                        type: "date",
                        id: "valido_el",
                        value: filtroInicial.valido_el[0].Low,
                        disabled: false,
                        checked: false,
                        matchcode: false,
                        maxlength: 10,
                      }}
                      handleChange={handleChange}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                    className="col-sm-2"
                  >
                    <label></label>
                  </div>

                  <div className="col-sm-2 d-flex align-items-center">
                    <label>Oficina de ventas:</label>
                  </div>
                  <div className="col-sm-2">
                    <InputFormKeyUp
                      attribute={{
                        name: "ofi_ventas",
                        type: "text",
                        value: filtroInicial.ofi_ventas[0].Low,
                        disabled: false,
                        checked: false,
                        matchcode: true,
                        maxlength: 10,
                      }}
                      handleChange={handleChange}
                      onClick={() => mc_ofi_ventas()}
                      onKeyUp={(e) => onKeyUpOfiVentas(e)}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                    className="col-sm-2"
                  >
                    <label>{descFiltroInicial.ofi_ventas}</label>
                    {/* <label>{nameOfiVentas}</label> */}
                  </div>
                </div>
              </section>
              <section>
                <div className="col-sm-12 col-md-6 p-1">
                  <BtnSearch
                    attribute={{ name: "Buscar", classNamebtn: "btn_search" }}
                    onClick={() => Search(1, "", "")}
                  />
                </div>
                <div className="col-sm-12 col-md-6 p-1">
                  <BtnSearch
                    attribute={{
                      name: "Limpiar Campos",
                      classNamebtn: "btn_search",
                    }}
                    onClick={() => Clear()}
                  />
                </div>
                {resultado_consulta_promociones.length ? (
                  <div className="col-sm-12 col-md-12 m-1">
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
                          <th></th>
                          <th>
                            Org. Ventas |{" "}
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
                            Material |{" "}
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
                          <th style={{ textAlign: "left" }}>
                            Denominación |{" "}
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
                            Ctd.mín. |{" "}
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
                            De |{" "}
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
                            UM Be |{" "}
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
                            Son bonif.es |{" "}
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
                            UM adic. |{" "}
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
                            MatAdBonEsp |{" "}
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
                          <th style={{ textAlign: "left" }}>
                            Texto breve material |{" "}
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
                                name="f_vkorgField"
                                maxLength="150"
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
                                name="f_matnrField"
                                maxLength="150"
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
                                name="f_maktxField"
                                maxLength="150"
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
                                name="f_knrmmField"
                                maxLength="150"
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
                                name="f_knrnmField"
                                maxLength="150"
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
                                name="f_knrmeField"
                                maxLength="150"
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
                                name="f_knrzmField"
                                maxLength="150"
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
                                name="f_knrezField"
                                maxLength="150"
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
                                name="f_knrmatField"
                                maxLength="150"
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
                                name="f_nrmaktxtField"
                                maxLength="150"
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

                        {resultado_consulta_promociones.length > 0
                          ? resultado_consulta_promociones.map(
                              (response, key) => {
                                return (
                                  <tr key={key}>
                                    <th style={{ textAlign: "center" }}></th>
                                    <th style={{ textAlign: "center" }}>
                                      {response.vkorgField}
                                    </th>
                                    <th style={{ textAlign: "center" }}>
                                      {response.matnrField.replace(
                                        /^(0+)/g,
                                        ""
                                      )}
                                    </th>
                                    <th style={{ textAlign: "left" }}>
                                      {response.maktxField}
                                    </th>
                                    <th style={{ textAlign: "center" }}>
                                      {response.knrmmField}
                                    </th>
                                    <th style={{ textAlign: "center" }}>
                                      {response.knrnmField}
                                    </th>
                                    <th style={{ textAlign: "center" }}>
                                      {response.knrmeField}
                                    </th>
                                    <th style={{ textAlign: "center" }}>
                                      {response.knrzmField}
                                    </th>
                                    <th style={{ textAlign: "center" }}>
                                      {response.knrezField}
                                    </th>
                                    <th style={{ textAlign: "center" }}>
                                      {response.knrmatField.replace(
                                        /^(0+)/g,
                                        ""
                                      )}
                                    </th>
                                    <th style={{ textAlign: "left" }}>
                                      {response.nrmaktxtField}
                                    </th>
                                  </tr>
                                );
                              }
                            )
                          : null}
                      </tbody>
                    </table>
                  </div>
                  {resultado_consulta_promociones == 0 && spinner == false ? (
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
          ) : (
            <div className="access-route">NO TIENE ACCESO A ESTE REPORTE</div>
          )}
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default Promociones;
