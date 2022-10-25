import React, { useState, useEffect } from "react";
import ReactExport from "react-data-export";

import InputForm from "../../components/InputForm";
import BtnSearch from "../../components/BtnSearch";
import {
  ConsultarStock,
  ExportarConsultarStock,
} from "../../Services/ServiceConsultaStock";
import Spinner from "../../components/Spinner";
import Pagination from "../../components/Pagination";
import Mc_Centro from "./Matchcode_Centro/Mc_Centro";
import Mc_Organiz_Ventas from "./Matchcode_Organiz_Ventas/Mc_Organiz_Ventas";
import Mc_Material from "./Matchcode_Material/Mc_Material";
import Mc_Lote from "./Matchcode_Lote/Mc_Lote";
import { ValidarRuta } from "../../Services/ServiceValidaUsuario";
import BtnExportar from "../../components/BtnExport";
import { ConsultarStockFiltro } from "../../Services/ServiceConsultaStock";
import FiltroConsultaStock from "./FiltroConsultaStock";

import jwt from "jwt-decode";
import ChangeStatusPassword from "../../components/ChangeStatusPassword/ChangeStatusPassword";
import { getUser } from "../../Services/ServiceUser";
import { RegistrarAuditoria } from "../../Services/ServiceAuditoria";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

const Consulta = () => {
  //@DQ
  const [ind_pagina, setind_pagina] = useState(1);
  const [col_1, setcol_1] = useState(0);
  const [col_2, setcol_2] = useState(0);
  const [col_3, setcol_3] = useState(0);
  const [col_4, setcol_4] = useState(0);
  const [col_5, setcol_5] = useState(0);
  const [col_6, setcol_6] = useState(0);
  const [col_7, setcol_7] = useState(0);
  const [col_8, setcol_8] = useState(0);
  const [col_9, setcol_9] = useState(0);

  // para mostrar fila de filtros
  const [mostrar_filtro_fila, setmostrar_filtro_fila] = useState(false);
  const [text_btn_filtro, settext_btn_filtro] = useState("Filtrar");

  const [f_werksField, setf_werksField] = useState("");
  const [f_matnrField, setf_matnrField] = useState("");
  const [f_maktxField, setf_maktxField] = useState("");
  const [f_labstField, setf_labstField] = useState("");
  const [f_meinsField, setf_meinsField] = useState("");
  const [f_chargField, setf_chargField] = useState("");
  const [f_clabsField, setf_clabsField] = useState("");
  const [f_fvencField, setf_fvencField] = useState("");
  const [f_mtartField, setf_mtartField] = useState("");

  const [showFiltroConsultaStock, setshowFiltroConsultaStock] =
  useState(false);
  const [indicadorfiltro, setindicadorfiltro] = useState(false);

  const [model_filtro, setmodel_filtro] = useState({});
  const [model_consStock, setmodel_consStock] = useState();
  const [pageNumber, setpageNumber] = useState(1);
  const [IsCampo, setIsCampo] = useState("");
  const [IsOrden, setIsOrden] = useState("");
  //para el cambio de contraseña
  const [show_status_password, setshow_status_password] = useState(false);
  const [IsRegxpag] = useState(15); // cantidad de datos por página
  //INPUT Centro
  const [Centro, setCentro] = useState("");
  //INPUT Organización ventas
  const [OrganizVentas, setOrganizVentas] = useState("");
  //INPUT Material
  const [Material, setMaterial] = useState("");
  //INPUT Almacen
  const [Almacen, setAlmacen] = useState("LU00");
  //INPUT Lote
  const [Lote, setLote] = useState("");
  //INPUT Sector
  const [Sector, setSector] = useState("");
  //INPUT Tipo Material
  const [TipoMaterial, setTipoMaterial] = useState("");
  //INPUT Grupo articulo
  const [GrupoArticulo, setGrupoArticulo] = useState("");

  //RESPONSE CONSULTA PEDIDO
  const [response_consulta, setresponse_consulta] = useState({
    esRegtotField: "",
    etStockField: [],
  });
  //CARGA DE SPINNER
  const [spinner, setspinner] = useState(false);
  //NUMERO TOTAL DE DATOS
  const [TotalData, setTotalData] = useState();
  //ACTIVAR SECCION DE PAGINADO
  const [valuepagination, setvaluepagination] = useState(false);
  //ACTIVAR MODAL DE VER PEDIDO
  const [showverpedido, setshowVerPedido] = useState(false);
  //VALOR PARA ENVIAR AL MODAL DE VER PEDIDO
  const [PVbeln, setPVbeln] = useState();

  //ACTIVAR MODAL MATCHCODE CENTRO
  const [ShowCentro, setShowCentro] = useState(false);
  //ACTIVAR MODAL MATCHCODE ORGANIZACION DE VENTAS
  const [ShowOrganizVentas, setShowOrganizVentas] = useState(false);
  //ACTIVAR MODAL MATCHCODE MATERIAL
  const [ShowMaterial, setShowMaterial] = useState(false);
  //ACTIVAR MODAL MATCHCODE LOTE
  const [ShowLote, setShowLote] = useState(false);
  //ACTIVAR MODAL MATCHCODE SECTOR
  const [ShowSector, setShowSector] = useState(false);
  //ACTIVAR MODAL MATCHCODE TIPO MATERIAL
  const [ShowTipoMaterial, setShowTipoMaterial] = useState(false);
  //ACTIVAR MODAL MATCHCODE GRUPO ARTICULO
  const [ShowGrupoArticulo, setShowGrupoArticulo] = useState(false);

  const [BuscaCentro, setBuscaCentro] = useState([
    { Sign: "", Option: "", Low: "", High: "" },
  ]);
  const [BuscaOrganizVentas, setBuscaOrganizVentas] = useState([
    { Sign: "", Option: "", Low: "", High: "" },
  ]);
  const [BuscaMaterial, setBuscaMaterial] = useState([
    { Sign: "", Option: "", Low: "", High: "" },
  ]);
  const [BuscaLote, setBuscaLote] = useState([
    { Sign: "", Option: "", Low: "", High: "" },
  ]);
  const [BuscaAlmacen, setBuscaAlmacen] = useState([
    { Sign: "I", Option: "EQ", Low: "LU00", High: "" },
  ]);

  //PARA ACCESO A RUTA
  const [accesoruta, setaccesoruta] = useState(false);
  //CARGA DE SPINNER DE ACCESO DE RUTA
  const [spinnerroute, setspinnerroute] = useState(false);
  //INDICADOR SI YA VALIDO RUTA
  const [indicadorruta, setindicadorruta] = useState(false);
  //ALMACENA CHECKBOX MARCADOS INDIVIDUALMENTE PARA COMPARARLOS POR PAGINA BUSCADA Y MARCARLOS CON CHECK
  const [arraycheckbox, setarraycheckbox] = useState([]);
  const [arraycheckbox_export, setarraycheckbox_export] = useState([
    {
      columns: [
        {
          title: "Ce.",
          style: { font: { sz: "18", bold: true } },
          width: { wpx: 125 },
        },
        {
          title: "Material",
          style: { font: { sz: "18", bold: true } },
          width: { wpx: 125 },
        },
        {
          title: "Texto breve material",
          style: { font: { sz: "18", bold: true } },
          width: { wpx: 125 },
        },
        {
          title: "Libre utiliz.",
          style: { font: { sz: "18", bold: true } },
          width: { wpx: 125 },
        },
        {
          title: "UMB",
          style: { font: { sz: "18", bold: true } },
          width: { wpx: 125 },
        },
        {
          title: "Lote",
          style: { font: { sz: "18", bold: true } },
          width: { wpx: 125 },
        },
        {
          title: "Stock/Lote",
          style: { font: { sz: "18", bold: true } },
          width: { wpx: 125 },
        },
        {
          title: "Fecha vencimiento",
          style: { font: { sz: "18", bold: true } },
          width: { wpx: 125 },
        },
        {
          title: "TpMt.",
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
    // getUser(jwt(localStorage.getItem("_token")).nameid).then((result) => {
    //   if (result.data[0].status_password === "1") {
    //     setshow_status_password(true);
    //   } else {
    //     setshow_status_password(false);
    //   }
    // });
    //valida acceso a ruta
    if (indicadorruta == false) {
      setspinnerroute(true);
      ValidarRuta("03").then((result) => {
        if (result.reporte == 1) {
          setspinnerroute(false);
          setaccesoruta(true);
          setindicadorruta(true);
          Search(1, 0, "", "");
        } else {
          setspinnerroute(false);
          setaccesoruta(false);
          setindicadorruta(true);
        }
      });
    } else {
      Search(1, 0, "", "");
    }
    //REGISTRO DE AUDITORÍA
    RegistrarAuditoria({id_user:Number(jwt(localStorage.getItem("_token")).nameid), id_event:3});
  }, []);

  //BÚSQUEDA
  function Search(page, ind, IsCampo, IsOrden) {
    settext_btn_filtro("Filtrar");
    setmostrar_filtro_fila(false);
    if(page==1){
      setind_pagina(1);
    }else{
      setind_pagina(0);
    }
    if(IsCampo==="" && IsOrden===""){
      clear_icons_colum();
    }
    setspinner(true);
    setindicadorfiltro(false);
    let model_consulta = {
      IsNpag: page,
      IsRegxpag: IsRegxpag,
      IsExport: "",
      IsCampo: IsCampo,
      IsOrden: IsOrden,
      IsUser: jwt(localStorage.getItem("_token")).username,
      ItCharg: BuscaLote,
      ItLgort: BuscaAlmacen,
      ItMatnr: BuscaMaterial,
      ItVkorg: BuscaOrganizVentas,
      ItWerks: BuscaCentro,
    };
    // console.log(ind);
    setmodel_consStock(model_consulta);
    if (ind == 0) {
      Exportar();
      arraycheckbox_export[0].data = [];

      // setresponse_consulta({esRegtotField:"",etStockField:[]});
      setresponse_consulta([]);

      ConsultarStock(model_consulta).then((result) => {
        setresponse_consulta(
          result.etStockField.map((d) => {
            return {
              select: false,
              werksField: d.werksField,
              matnrField: d.matnrField,
              maktxField: d.maktxField,
              labstField: d.labstField,
              meinsField: d.meinsField,
              chargField: d.chargField,
              clabsField: d.clabsField,
              fvencField: d.fvencField,
              mtartField: d.mtartField,
            };
          })
        );

        setTotalData(result.esRegtotField);
        setspinner(false);
        setvaluepagination(true);
      });
    } else {
      ConsultarStock(model_consulta).then((result) => {
        setresponse_consulta(
          result.etStockField.map((d) => {
            return {
              select: false,
              werksField: d.werksField,
              matnrField: d.matnrField,
              maktxField: d.maktxField,
              labstField: d.labstField,
              meinsField: d.meinsField,
              chargField: d.chargField,
              clabsField: d.clabsField,
              fvencField: d.fvencField,
              mtartField: d.mtartField,
            };
          })
        );

        for (let y = 0; y < result.etStockField.length; y++) {
          if (arraycheckbox.length > 0) {
            for (let i = 0; i < arraycheckbox.length; i++) {
              if (
                result.etStockField[y].werksField == arraycheckbox[i].werksField
              ) {
                document.getElementById(
                  "checkbox-body-" + result.etStockField[y].werksField
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
    
    let model_consulta_export = {
      IsNpag: "",
      IsRegxpag: "",
      IsExport: "X",
      IsCampo: IsCampo,
      IsOrden: IsOrden,
      IsUser: jwt(localStorage.getItem("_token")).username,
      ItCharg: BuscaLote,
      ItLgort: BuscaAlmacen,
      ItMatnr: BuscaMaterial,
      ItVkorg: BuscaOrganizVentas,
      ItWerks: BuscaCentro,
    };
    // ExportarConsultaStock(model_consulta).then((result)=>{

    // });
    console.log("stock")
    if (
      BuscaLote[0].Low.trim() != "" ||
      BuscaMaterial[0].Low.trim() != "" ||
      BuscaOrganizVentas[0].Low.trim() != "" ||
      BuscaCentro[0].Low.trim() != ""
    ) {
      ExportarConsultarStock(model_consulta_export).then((result) => {
        
        setDataSet([
          {
            columns: [
              {
                title: "Ce.",
                style: { font: { sz: "18", bold: true } },
                width: { wpx: 125 },
              },
              {
                title: "Material",
                style: { font: { sz: "18", bold: true } },
                width: { wpx: 125 },
              },
              {
                title: "Texto breve material",
                style: { font: { sz: "18", bold: true } },
                width: { wpx: 125 },
              },
              {
                title: "Libre utiliz.",
                style: { font: { sz: "18", bold: true } },
                width: { wpx: 125 },
              },
              {
                title: "UMB",
                style: { font: { sz: "18", bold: true } },
                width: { wpx: 125 },
              },
              {
                title: "Lote",
                style: { font: { sz: "18", bold: true } },
                width: { wpx: 125 },
              },
              {
                title: "Stock/Lote",
                style: { font: { sz: "18", bold: true } },
                width: { wpx: 125 },
              },
              {
                title: "Fecha vencimiento",
                style: { font: { sz: "18", bold: true } },
                width: { wpx: 125 },
              },
              {
                title: "TpMt.",
                style: { font: { sz: "18", bold: true } },
                width: { wpx: 125 },
              },
            ],
            data: result.etStockField.map((data) => {
              return [
                { value: data.werksField, style: { font: { sz: "14" } } },
                { value: data.matnrField, style: { font: { sz: "14" } } },
                { value: data.maktxField, style: { font: { sz: "14" } } },
                {
                  value: convertDecimal(data.labstField, 2),
                  style: { font: { sz: "14" } },
                },
                { value: data.meinsField, style: { font: { sz: "14" } } },
                { value: data.chargField, style: { font: { sz: "14" } } },
                {
                  value: convertDecimal(data.clabsField, 2),
                  style: { font: { sz: "14" } },
                },
                {
                  value: formatDate(data.fvencField),
                  style: { font: { sz: "14" } },
                },
                { value: data.mtartField, style: { font: { sz: "14" } } },
              ];
            }),
          },
        ]);
      });
    }
  }

  //INPUT Centro
  function mcCentro() {
    setShowCentro((prev) => !prev);
  }
  // INPUT Organizacion de ventas
  function mcOrganizVentas() {
    setShowOrganizVentas((prev) => !prev);
  }
  //INPUT Material
  function mcMaterial() {
    setShowMaterial((prev) => !prev);
  }
  // INPUT Lote
  function mcLote() {
    setShowLote((prev) => !prev);
  }
  //INPUT Sector
  // function mcSector () {
  //     setShowSector(prev => !prev);
  // }
  // INPUT Material
  // function mcTipoMaterial () {
  //     setShowTipoMaterial(prev => !prev);
  // }
  // INPUT Grupo Articulo
  // function mcGrupoArticulo () {
  //     setShowGrupoArticulo(prev => !prev);
  // }

  function handleChange(name, value) {
    switch (name) {
      case "centro":
        setCentro(value);
        if (value.trim() != "")
          setBuscaCentro([
            { Sign: "I", Option: "EQ", Low: value, High: "" },
          ]);
        else setBuscaCentro([{ Sign: "", Option: "", Low: "", High: "" }]);
        break;
      case "organizVentas":
        setOrganizVentas(value);
        if (value.trim() != "")
          setBuscaOrganizVentas([
            { Sign: "I", Option: "EQ", Low: value, High: "" },
          ]);
        else
          setBuscaOrganizVentas([{ Sign: "", Option: "", Low: "", High: "" }]);
        break;
      case "material":
        setMaterial(value);
        if (value.trim() != "")
          setBuscaMaterial([
            {
              Sign: "I",
              Option: "EQ",
              Low: value,
              High: "",
            },
          ]);
        else setBuscaMaterial([{ Sign: "", Option: "", Low: "", High: "" }]);
        break;
      case "almacen":
        setAlmacen(value);
        if (value.trim() != "")
          setBuscaAlmacen([
            {
              Sign: "I",
              Option: "EQ",
              Low: value,
              High: "",
            },
          ]);
        else setBuscaAlmacen([{ Sign: "", Option: "", Low: "", High: "" }]);
        break;
      //oficina de ventas
      case "lote":
        setLote(value);
        if (value.trim() != "")
          setBuscaLote([
            {
              Sign: "I",
              Option: "EQ",
              Low: value,
              High: "",
            },
          ]);
        else setBuscaLote([{ Sign: "", Option: "", Low: "", High: "" }]);
        break;
      default:
        break;
    }
  }

  function Clear() {
    setvaluepagination(false);
    setresponse_consulta({
      esRegtotField: "",
      etStockField: [],
    })
    setCentro("");
    setBuscaCentro([{ Sign: "", Option: "", Low: "", High: "" }]);
    setOrganizVentas("");
    setBuscaOrganizVentas([{ Sign: "", Option: "", Low: "", High: "" }]);
    setMaterial("");
    setBuscaMaterial([{ Sign: "", Option: "", Low: "", High: "" }]);
    setLote("");
    setBuscaLote([{ Sign: "", Option: "", Low: "", High: "" }]);
  }

  //formateo de la fecha para visualizar
  function formatDate(value) {
    console.log(value)
    if(value=="0000-00-00"){
      return "";
    }else {
      var datePart = value.match(/\d+/g),
      year = datePart[0],
      month = datePart[1],
      day = datePart[2];

    return day + "-" + month + "-" + year;
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

  //completar decimal de 2 digitos
  function convertDecimal(num) {
    // return num.toFixed(Math.max(((num+'').split(".")[1]||"").length, 2));
    if (num.toString().split(".").length == 2) {
      // console.log( num.toString().split(".")[0].replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d)\.?)/g, ",") + "."+num.toString().split(".")[1]);
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

  // seleccionar pagina
  function changePage(pageNumber) {
    setresponse_consulta([]);
    if (indicadorfiltro == false) {
      Search(pageNumber, 1, IsCampo, IsOrden);
    }else {
      setpageNumber(pageNumber);
      buscar_filtro_fila(pageNumber,IsCampo, IsOrden)
    }
    
    
  }
  // siguiente pagina
  function prevPage(value) {
    setresponse_consulta([]);
    if (indicadorfiltro == false) {
      Search(value - 1, 1, IsCampo, IsOrden);
    }else {
      setpageNumber(pageNumber);
      buscar_filtro_fila(value - 1,IsCampo, IsOrden)
    }
    
  }
  //pagina anterior
  function nextPage(value) {
    setresponse_consulta([]);
    if (indicadorfiltro == false) {
      Search(value + 1, 1, IsCampo, IsOrden);
    } else {
      setpageNumber(pageNumber);
      buscar_filtro_fila(value + 1,IsCampo, IsOrden)
    }
    
  }
  //ver detalle de pedido
  // function verPedido(value){
  //     setPVbeln(value);
  //     setshowVerPedido(prev => !prev);
  // }

  function zfill(number, width) {
    var numberOutput = Math.abs(number); /* Valor absoluto del número */
    var length = number.toString().length; /* Largo del número */
    var zero = "0"; /* String de cero */

    if (width <= length) {
      if (number < 0) {
        return "-" + numberOutput.toString();
      } else {
        return numberOutput.toString();
      }
    } else {
      if (number < 0) {
        return "-" + zero.repeat(width - length) + numberOutput.toString();
      } else {
        return zero.repeat(width - length) + numberOutput.toString();
      }
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
          // Search(1, 0, "WERKS", "0");
          setIsCampo("WERKS");
          setIsOrden("0");
          if(indicadorfiltro==true){
            buscar_filtro_fila(1, "WERKS", "0")
          } else {
            Search(1, 0, "WERKS", "0");
          }
        } else if (col_1 === 1) {
          setcol_1(col_1 + 1);
          // Search(1, 0, "WERKS", "1");
          setIsCampo("WERKS");
          setIsOrden("1");
          if(indicadorfiltro==true) {
            buscar_filtro_fila(1, "WERKS", "1")
          } else {
            Search(1, 0, "WERKS", "1");
          }
        } else {
          setcol_1(0);
          // Search(1, 0, "", "");
          setIsCampo("");
          setIsOrden("");
          if(indicadorfiltro==true) {
            buscar_filtro_fila(1, "", "")
          } else {
            Search(1, 0, "", "");
          }
        }
        break;
      case 2:
        clearColumnsIcon(2);
        if (col_2 === 0) {
          setcol_2(col_2 + 1);
          // Search(1, 0, "MATNR", "0");
          setIsCampo("MATNR");
          setIsOrden("0");
          if(indicadorfiltro==true) {
            buscar_filtro_fila(1,"MATNR", "0");
          } else {
            Search(1, 0, "MATNR", "0");
          }
        } else if (col_2 === 1) {
          setcol_2(col_2 + 1);
          // Search(1, 0, "MATNR", "1");
          setIsCampo("MATNR");
          setIsOrden("1");
          if(indicadorfiltro==true) {
            buscar_filtro_fila(1,"MATNR", "1");
          } else {
            Search(1, 0, "MATNR", "1");
          }
        } else {
          setcol_2(0);
          // Search(1, 0, "", "");
          setIsCampo("");
          setIsOrden("");
          if(indicadorfiltro==true) {
            buscar_filtro_fila(1,"", "");
          } else {
            Search(1, 0, "", "");
          }
        }
        break;
      case 3:
        clearColumnsIcon(3);
        if (col_3 === 0) {
          setcol_3(col_3 + 1);
          // Search(1, 0, "MAKTX", "0");
          setIsCampo("MAKTX");
          setIsOrden("0");
          if(indicadorfiltro==true) {
            buscar_filtro_fila(1,"MAKTX", "0");
          } else {
            Search(1, 0, "MAKTX", "0");
          }
        } else if (col_3 === 1) {
          setcol_3(col_3 + 1);
          // Search(1, 0, "MAKTX", "1");
          setIsCampo("MAKTX");
          setIsOrden("1");
          if(indicadorfiltro==true) {
            buscar_filtro_fila(1,"MAKTX", "1");
          } else {
            Search(1, 0, "MAKTX", "1");
          }
        } else {
          setcol_3(0);
          // Search(1, 0, "", "");
          setIsCampo("");
          setIsOrden("");
          if(indicadorfiltro==true) {
            buscar_filtro_fila(1,"", "");
          } else {
            Search(1, 0, "", "");
          }
        }
        break;
      case 4:
        clearColumnsIcon(4);
        if (col_4 === 0) {
          setcol_4(col_4 + 1);
          // Search(1, 0, "LABST", "0");
          setIsCampo("LABST");
          setIsOrden("0");
          if(indicadorfiltro==true) {
            buscar_filtro_fila(1,"LABST", "0");
          } else {
            Search(1, 0, "LABST", "0");
          }
        } else if (col_4 === 1) {
          setcol_4(col_4 + 1);
          // Search(1, 0, "LABST", "1");
          setIsCampo("LABST");
          setIsOrden("1");
          if(indicadorfiltro==true) {
            buscar_filtro_fila(1,"LABST", "1");
          } else {
            Search(1, 0, "LABST", "1");
          }
        } else {
          setcol_4(0);
          // Search(1, 0, "", "");
          setIsCampo("");
          setIsOrden("");
          if(indicadorfiltro==true) {
            buscar_filtro_fila(1,"", "");
          } else {
            Search(1, 0, "", "");
          }
        }
        break;
      case 5:
        clearColumnsIcon(5);
        if (col_5 === 0) {
          setcol_5(col_5 + 1);
          // Search(1, 0, "MEINS", "0");
          setIsCampo("MEINS");
          setIsOrden("0");
          if(indicadorfiltro==true) {
            buscar_filtro_fila(1, "MEINS", "0");
          } else {
            Search(1, 0, "MEINS", "0");
          }
        } else if (col_5 === 1) {
          setcol_5(col_5 + 1);
          // Search(1, 0, "MEINS", "1");
          setIsCampo("MEINS");
          setIsOrden("1");
          if(indicadorfiltro==true) {
            buscar_filtro_fila(1, "MEINS", "1");
          } else {
            Search(1, 0, "MEINS", "1");
          }
        } else {
          setcol_5(0);
          // Search(1, 0, "", "");
          setIsCampo("");
          setIsOrden("");
          if(indicadorfiltro==true) {
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
          // Search(1, 0, "CHARG", "0");
          setIsCampo("CHARG");
          setIsOrden("0");
          if(indicadorfiltro==true){
            buscar_filtro_fila(1, "CHARG", "0");
          } else {
            Search(1, 0, "CHARG", "0");
          }
        } else if (col_6 === 1) {
          setcol_6(col_6 + 1);
          // Search(1, 0, "CHARG", "1");
          setIsCampo("CHARG");
          setIsOrden("1");
          if(indicadorfiltro==true){
            buscar_filtro_fila(1, "CHARG", "1");
          } else {
            Search(1, 0, "CHARG", "1");
          }
        } else {
          setcol_6(0);
          // Search(1, 0, "", "");
          setIsCampo("");
          setIsOrden("");
          if(indicadorfiltro==true){
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
          // Search(1, 0, "CLABS", "0");
          setIsCampo("CLABS");
          setIsOrden("0");
          if(indicadorfiltro==true){
            buscar_filtro_fila(1, "CLABS", "0");
          } else {
            Search(1, 0, "CLABS", "0");
          }
        } else if (col_7 === 1) {
          setcol_7(col_7 + 1);
          // Search(1, 0, "CLABS", "1");
          setIsCampo("CLABS");
          setIsOrden("1");
          if(indicadorfiltro==true){
            buscar_filtro_fila(1, "CLABS", "1");
          } else {
            Search(1, 0, "CLABS", "1");
          }
        } else {
          setcol_7(0);
          // Search(1, 0, "", "");
          setIsCampo("");
          setIsOrden("");
          if(indicadorfiltro==true){
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
          // Search(1, 0, "FVENC", "0");
          setIsCampo("FVENC");
          setIsOrden("0");
          if(indicadorfiltro==true){
            buscar_filtro_fila(1, "FVENC", "0");
          } else {
            Search(1, 0, "FVENC", "0");
          }
        } else if (col_8 === 1) {
          setcol_8(col_8 + 1);
          // Search(1, 0, "FVENC", "1");
          setIsCampo("FVENC");
          setIsOrden("1");
          if(indicadorfiltro==true){
            buscar_filtro_fila(1, "FVENC", "1");
          } else {
            Search(1, 0, "FVENC", "1");
          }
        } else {
          setcol_8(0);
          // Search(1, 0, "", "");
          setIsCampo("");
          setIsOrden("");
          if(indicadorfiltro==true){
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
          // Search(1, 0, "MTART", "0");
          setIsCampo("MTART");
          setIsOrden("0");
          if(indicadorfiltro==true){
            buscar_filtro_fila(1, "MTART", "0");
          } else {
            Search(1, 0, "MTART", "0");
          }
        } else if (col_9 === 1) {
          setcol_9(col_9 + 1);
          // Search(1, 0, "MTART", "1");
          setIsCampo("MTART");
          setIsOrden("1");
          if(indicadorfiltro==true){
            buscar_filtro_fila(1, "MTART", "1");
          } else {
            Search(1, 0, "MTART", "1");
          }
        } else {
          setcol_9(0);
          // Search(1, 0, "", "");
          setIsCampo("");
          setIsOrden("");
          if(indicadorfiltro==true){
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
  function clear_filtro_fila() {
    setf_werksField("");
    setf_matnrField("");
    setf_maktxField("");
    setf_labstField("");
    setf_meinsField("");
    setf_chargField("");
    setf_clabsField("");
    setf_fvencField("");
    setf_mtartField("");
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
    // setshowFiltroConsultaStock(true);
  }

  function handleChangeFiltro(name, value){
    switch (name) {
      case "f_werksField":
        setf_werksField(value);
        break;
      case "f_matnrField":
        setf_matnrField(value);
        break;
      case "f_maktxField":
        setf_maktxField(value);
        break;
      case "f_labstField":
        setf_labstField(value);
        break;
      case "f_meinsField":
        setf_meinsField(value);
        break;
      case "f_chargField":
        setf_chargField(value);
        break;
      case "f_clabsField":
        setf_clabsField(value);
        break;
      case "f_fvencField":
        setf_fvencField(value);
        break;
      case "f_mtartField":
        setf_mtartField(value);
        break;
      default:
        break;
    }
  }
  function clear_icons_colum(){
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
  function buscar_filtro_fila(pageNumber,IsCampo,IsOrden) {
    settext_btn_filtro("Filtrar");
    setmostrar_filtro_fila(false);
    setindicadorfiltro(true);
    if(pageNumber==1){
      setind_pagina(1);
    }else{
      setind_pagina(0);
    }
    if(IsCampo==="" && IsOrden===""){
      clear_icons_colum();
    }
    let model = {

      IsCampo: IsCampo,
      IsOrden: IsOrden,
      IsNpag: pageNumber,
      IsRegxpag: IsRegxpag,
      IsExport: ' ',
      IsUser: jwt(localStorage.getItem("_token")).username,
      ItCharg: BuscaLote,
      ItLgort: BuscaAlmacen,
      ItMatnr: BuscaMaterial,
      ItVkorg: BuscaOrganizVentas,
      ItWerks: BuscaCentro,
      ItFilter: [
        {
          Werks: f_werksField,
          Matnr: f_matnrField,
          Maktx: f_maktxField,
          Labst: f_labstField,
          Meins: f_meinsField,
          Charg: f_chargField,
          Clabs: f_clabsField,
          Fvenc: f_fvencField,
          Mtart: f_mtartField,
        },
      ],
    };
    setresponse_consulta([]);
    setspinner(true);
    ConsultarStockFiltro(model).then((result) => {
      setspinner(false);
      setresponse_consulta(
        result.etStockField.map((d) => {
          return {
            select: false,
            werksField: d.werksField,
            matnrField: d.matnrField,
            maktxField: d.maktxField,
            labstField: d.labstField,
            meinsField: d.meinsField,
            chargField: d.chargField,
            clabsField: d.clabsField,
            fvencField: d.fvencField,
            mtartField: d.mtartField,
          };
        })
      );
      setTotalData(result.esRegtotField);
    });
  }
  function buscar_filtro_enter(event) {
    var keycode = event.keyCode;
    if (keycode == "13") {
      buscar_filtro_fila(1,"","");
    }
  }

  function buscar_filtro_icono_btn() {
    buscar_filtro_fila(1,"","");
  }
  return (
    <>
    {/* <FiltroConsultaStock
        showFiltroConsultaStock={showFiltroConsultaStock}
        setshowFiltroConsultaStock={setshowFiltroConsultaStock}
        model_filtro={model_filtro}
        setmodel_filtro={setmodel_filtro}
        model_consStock={model_consStock}
        setresponse_consulta_Stock={setresponse_consulta}
        setspinner={setspinner}
        setTotalData={setTotalData}
        indicadorfiltro={indicadorfiltro}
        pageNumber={pageNumber}
        DataSet={DataSet}
        setDataSet={setDataSet}
      /> */}
      {/* {show_status_password ? (
        <ChangeStatusPassword
          setshow_status_password={setshow_status_password}
        />
      ) : null} */}
      {spinnerroute ? (
        <Spinner />
      ) : (
        <>
          {accesoruta ? (
            <div className="container-view">
              {/* MODALES  */}
              <Mc_Centro
                showMcCentro={ShowCentro}
                setShowMcCentro={setShowCentro}
                setMcCentro={setCentro}
                McCentro={Centro}
                setMcBuscaCentro={setBuscaCentro}
              />
              <Mc_Organiz_Ventas
                showMcOrganizVenta={ShowOrganizVentas}
                setShowMcOrganizVenta={setShowOrganizVentas}
                setMcOrganizVenta={setOrganizVentas}
                McOrganizVenta={OrganizVentas}
                setMcBuscaOrganizVenta={setBuscaOrganizVentas}
              />
              <Mc_Material
                showMcMaterial={ShowMaterial}
                setShowMcMaterial={setShowMaterial}
                setMcMaterial={setMaterial}
                McMaterial={Material}
                setMcBuscaMaterial={setBuscaMaterial}
              />
              <Mc_Lote
                showMcLote={ShowLote}
                setShowMcLote={setShowLote}
                setMcLote={setLote}
                McLote={Lote}
                setMcBuscaLote={setBuscaLote}
              />
              {/* <Mc_Sector showMcSector={ShowSector} setShowMcSector={setShowSector} setMcSector={setSector} McSector={Sector} />
                        <Mc_Tipo_Material showMcTipoMaterial={ShowTipoMaterial} setShowMcTipoMaterial={setShowTipoMaterial} setMcTipoMaterial={setTipoMaterial} McTipoMaterial={TipoMaterial} />
                        <Mc_Grupo_Articulo showMcGrupoArticulo={ShowGrupoArticulo} setShowMcGrupoArticulo={setShowGrupoArticulo} setMcGrupoArticulo={setGrupoArticulo} McGrupoArticulo={GrupoArticulo} /> */}

              <div className="title-section">
                <div>
                  <label> Reportes / Consulta de Stock </label>
                  <label> Tipo cambio : 4.10 </label>
                </div>
                <hr />
              </div>
              <section>
                <div style={{ margin: "10px" }} className="row">
                  <div className="col-sm-3 d-flex align-items-center">
                    <label>Centro</label>
                  </div>
                  <div className="col-sm-3">
                    <InputForm
                      attribute={{
                        name: "centro",
                        type: "text",
                        value: Centro,
                        disabled: false,
                        checked: false,
                        matchcode: true,
                        maxlength:4
                      }}
                      handleChange={handleChange}
                      onClick={() => mcCentro()}
                    />
                  </div>

                  <div className="col-sm-3 d-flex align-items-center">
                    <label>Organiz. ventas</label>
                  </div>
                  <div className="col-sm-3">
                    <InputForm
                      attribute={{
                        name: "organizVentas",
                        type: "text",
                        value: OrganizVentas,
                        disabled: false,
                        checked: false,
                        matchcode: true,
                        maxlength:4
                      }}
                      handleChange={handleChange}
                      onClick={() => mcOrganizVentas()}
                    />
                  </div>

                  <div className="col-sm-3 d-flex align-items-center">
                    <label>Material</label>
                  </div>
                  <div className="col-sm-3">
                    <InputForm
                      attribute={{
                        name: "material",
                        type: "text",
                        value: Material,
                        disabled: false,
                        checked: false,
                        matchcode: true,
                        maxlength:18
                      }}
                      handleChange={handleChange}
                      onClick={() => mcMaterial()}
                    />
                  </div>

                  <div className="col-sm-3 d-flex align-items-center">
                    <label>Lote</label>
                  </div>
                  <div className="col-sm-3">
                    <InputForm
                      attribute={{
                        name: "lote",
                        type: "text",
                        value: Lote,
                        disabled: false,
                        checked: false,
                        matchcode: true,
                        maxlength:10
                      }}
                      handleChange={handleChange}
                      onClick={() => mcLote()}
                    />
                  </div>

                  <div className="col-sm-3 d-flex align-items-center">
                    <label>Almacén</label>
                  </div>
                  <div className="col-sm-3">
                    <InputForm
                      attribute={{
                        name: "almacen",
                        type: "text",
                        value: Almacen,
                        disabled: true,
                        checked: false,
                        matchcode: false,
                      }}
                    />
                  </div>

                  {/* <div className="container-input">
                                    <label>Sector</label>
                                    <div className="col-2">
                                        <InputForm attribute={{name:'sector',type:'text',value:Sector,disabled:false,checked:false,matchcode:true}} handleChange={handleChange} onClick={()=>mcSector()}/>
                                    </div>
                                </div>

                                <div className="container-input">
                                    <label>Tipo de Material</label>
                                    <div className="col-2">
                                        <InputForm attribute={{name:'tipoMaterial',type:'text',value:TipoMaterial,disabled:false,checked:false,matchcode:true}} handleChange={handleChange} onClick={()=>mcTipoMaterial()} />
                                    </div>
                                </div>

                                <div className="container-input">
                                    <label>Grupo Articulo</label>
                                    <div className="col-2">
                                        <InputForm attribute={{name:'grupoArticulo',type:'text',value:GrupoArticulo,disabled:false,checked:false,matchcode:true}} handleChange={handleChange} onClick={()=>mcGrupoArticulo()} />
                                    </div>
                                </div> */}
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
                      attribute={{ name: "Limpiar Campos", classNamebtn: "btn_search" }}
                      onClick={() => Clear()}
                    />
                  </div>
                  {/* <div>
                                <BtnSearch attribute={{name:'Exportar', classNamebtn:'btn_export'}} onClick={()=>Exportar()}/>
                            </div> */}
                  <div className="col-sm-12 col-md-2 p-1">
                    {arraycheckbox_export[0].data.length > 0 ? (
                      <ExcelFile
                        filename="Consulta de Stock"
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
                        filename="Consulta de Stock"
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
                  {
                    response_consulta.length ? (
                    <div className="col-sm-12 col-md-2 p-1">
                      <BtnSearch
                        attribute={{
                          name: text_btn_filtro,
                          classNamebtn: "btn_search",
                        }}
                        onClick={() => ModalFiltro()}
                      />
                    </div>
                    ): null
                  }
              </section>
              <section>
                <div className="container-table">
                  <div className="container-table-sm">
                    <table className="content-table">
                      <thead>
                        <tr>
                          
                          {mostrar_filtro_fila == true ? <th></th> :null}
                          <th>
                            Ce. |{" "}
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
                            Material |{" "}
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
                          <th style={{textAlign:"initial"}}>
                            Texto breve material |{" "}
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
                          <th style={{textAlign:"end"}}>
                            Libre utiliz. |{" "}
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
                          <th style={{textAlign:"end"}}>
                            Stock/Lote |{" "}
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
                            UMB |{" "}
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
                            Lote |{" "}
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
                            Fecha vencimiento |{" "}
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
                            TpMt. |{" "}
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
                        </tr>
                      </thead>
                      <tbody>
                        {
                          mostrar_filtro_fila == true ?
                          <tr>
                            <td>
                            <button
                                className="btn_search_filter"
                                onClick={() => buscar_filtro_icono_btn()}
                              >
                                <i className="fas fa-filter"></i>
                              </button>
                            </td>
                            <td><input type="text" name="f_werksField" maxLength="4" onChange={(e) =>handleChangeFiltro(e.target.name, e.target.value)} onKeyUp={(e) => buscar_filtro_enter(e)}/></td>
                            <td><input type="text" name="f_matnrField" maxLength="18" onChange={(e) =>handleChangeFiltro(e.target.name, e.target.value)} onKeyUp={(e) => buscar_filtro_enter(e)}/></td>
                            <td><input type="text" name="f_maktxField" maxLength="40" onChange={(e) =>handleChangeFiltro(e.target.name, e.target.value)} onKeyUp={(e) => buscar_filtro_enter(e)}/></td>
                            <td><input type="text" name="f_labstField" maxLength="13" onChange={(e) =>handleChangeFiltro(e.target.name, e.target.value)} onKeyUp={(e) => buscar_filtro_enter(e)}/></td>
                            <td><input type="text" name="f_meinsField" maxLength="3" onChange={(e) =>handleChangeFiltro(e.target.name, e.target.value)} onKeyUp={(e) => buscar_filtro_enter(e)}/></td>
                            <td><input type="text" name="f_chargField" maxLength="10" onChange={(e) =>handleChangeFiltro(e.target.name, e.target.value)} onKeyUp={(e) => buscar_filtro_enter(e)}/></td>
                            <td><input type="text" name="f_clabsField" maxLength="13" onChange={(e) =>handleChangeFiltro(e.target.name, e.target.value)} onKeyUp={(e) => buscar_filtro_enter(e)}/></td>
                            <td><input type="date" name="f_fvencField" onChange={(e) =>handleChangeFiltro(e.target.name, e.target.value)} onKeyUp={(e) => buscar_filtro_enter(e)}/></td>
                            <td><input type="text" name="f_mtartField" maxLength="4" onChange={(e) =>handleChangeFiltro(e.target.name, e.target.value)} onKeyUp={(e) => buscar_filtro_enter(e)}/></td>
                        </tr>
                        : null
                        }
                        
                        {response_consulta != null &&
                        response_consulta.length > 0
                          ? response_consulta.map((response, key) => {
                              return (
                                <tr key={key}>
                                  {mostrar_filtro_fila == true ? <th></th> : null}
                                  
                                  {/* <th>
                                                            <input type="checkbox" id={`checkbox-body-`+response.werksField} onChange={(e)=>{
                                                                setresponse_consulta(
                                                                    response_consulta.map(d=>{
                                                                        if(d.werksField == response.werksField){
                                                                            d.select = e.target.checked;
                                                                            if(e.target.checked == true){
                                                                                setarraycheckbox([...arraycheckbox,{werksField:d.werksField}])                                                                            
                                                                                    arraycheckbox_export[0].data.push([
                                                                                        {value: d.werksField, style: {font:{sz: "14"}}},
                                                                                        {value: d.matnrField, style: {font:{sz: "14"}}},
                                                                                        {value: d.maktxField, style: {font:{sz: "14"}}},
                                                                                        {value: convertDecimal(d.labstField,2), style: {font:{sz: "14"}}},
                                                                                        {value: d.meinsField, style: {font:{sz: "14"}}},
                                                                                        {value: d.chargField, style: {font:{sz: "14"}}},
                                                                                        {value: convertDecimal(d.clabsField,2), style: {font:{sz: "14"}}},
                                                                                        {value: d.fvencField, style: {font:{sz: "14"}}},
                                                                                        {value: d.mtartField, style: {font:{sz: "14"}}}
                                                                                    ])
                                                                                
                                                                            }else if(e.target.checked == false){
                                                                                for (let i = 0; i < arraycheckbox.length; i++) {
                                                                                    if(d.werksField == arraycheckbox[i].werksField){
                                                                                        arraycheckbox.splice(i,1)
                                                                                        arraycheckbox_export[0].data.splice(i,1);
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                        return d;
                                                                    })
                                                                );                                                        
                                                            }}/>
                                                        </th> */}
                                  <th style={{textAlign:'center'}}>{response.werksField}</th>
                                  <th style={{textAlign:'center'}}>{parseInt(response.matnrField)}</th>
                                  <th style={{textAlign:'initial'}}>{response.maktxField}</th>
                                  <th style={{textAlign:'end'}}>
                                    {convertDecimal(response.labstField, 2)}
                                  </th>
                                  <th style={{textAlign:'end'}}>
                                    {convertDecimal(response.clabsField, 2)}
                                  </th>
                                  <th style={{textAlign:'center'}}>{response.meinsField}</th>
                                  
                                  <th style={{textAlign:'center'}}>{response.chargField}</th>
                                  
                                  <th style={{textAlign:'center'}}>{formatDate(response.fvencField)}</th>
                                  <th style={{textAlign:'center'}}>{response.mtartField}</th>
                                </tr>
                              );
                            })
                          : null}
                      </tbody>
                    </table>
                  </div>
                  {response_consulta == 0 && spinner == false ? (
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
        </>
      )}
    </>
  );
};

export default Consulta;
