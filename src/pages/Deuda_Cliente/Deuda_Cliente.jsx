import React, { useState, useEffect } from "react";
import InputForm from "../../components/InputForm";
import BtnSearch from "../../components/BtnSearch";
import { DeuCli_Buscar } from "../../Services/ServiceCliente";
import Spinner from "../../components/Spinner";
import MatchcodeCliente from "./Matchcode_Cliente/Mc_DeuCli_Cliente";
import Envio_Correo from "./Envio_Correo/Envio_Correo";
import { ValidarRuta } from "../../Services/ServiceValidaUsuario";
import jwt from "jwt-decode";
import {
  getOficinaVentasSAP,
  RegistrarAuditoria,
} from "../../Services/ServiceAuditoria";

const Deuda_Cliente = () => {
  const [listaCorreo, setListaCorreo] = useState([]);
  //CODIGO DE CLIENTE
  const [IsCliente, setIsCliente] = useState("");
  //RESSULTADO DE LA BUSQUEDA
  const [respuesta_DeuCliBuscar, setrespuesta_DeuCliBuscar] = useState({
    etCabeceraField: [{ rucField: "", direccionField: "" }],
    etDetalleField: [],
    etCorreosField: [],
    etResumenField: [],
  });
  // RESULTADO DE CLIENTE ELEGIDO EN MATCHCODE
  // const [ResponseCliente] = useState("");
  //CARGA DE SPINNER
  const [spinner, setspinner] = useState(false);
  //PARA HABILITAR  POPUP MATCHCODE
  const [showMcCliente, setshowMcCliente] = useState(false);
  const [showEnvCorreo, setshowEnvCorreo] = useState(false);

  //PARA ACCESO A RUTA
  const [accesoruta, setaccesoruta] = useState(false);
  //CARGA DE SPINNER DE ACCESO DE RUTA
  const [spinnerroute, setspinnerroute] = useState(false);
  //INDICADOR SI YA VALIDO RUTA
  const [indicadorruta, setindicadorruta] = useState(false);

  //VALIDAR QUE TENGA CÓDIGO BUSCADO
  const [validateIscliente, setvalidateIscliente] = useState(false);

  const [f_TIPO_DOC, setf_TIPO_DOC] = useState("");
  const [f_NRO_DOC, setf_NRO_DOC] = useState("");
  const [f_FECHA_EMISION, setf_FECHA_EMISION] = useState("");
  const [f_FECHA_VENCI, setf_FECHA_VENCI] = useState("");
  const [f_MONEDA, setf_MONEDA] = useState("");
  const [f_DEUDA, setf_DEUDA] = useState("");
  const [f_A_FAVOR, setf_A_FAVOR] = useState("");
  const [f_BANCO, setf_BANCO] = useState("");
  const [f_NRO_UNICO, setf_NRO_UNICO] = useState("");
  const [f_DOC_ORIGEN, setf_DOC_ORIGEN] = useState("");

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

  const [mostrar_filtro_fila, setmostrar_filtro_fila] = useState(false);
  const [text_btn_filtro, settext_btn_filtro] = useState("Filtrar");

  const [IsCampo, setIsCampo] = useState("");
  const [IsOrden, setIsOrden] = useState("");

  useEffect(() => {
    // if (indicadorruta == false) {
    //   setspinnerroute(true);
    //   ValidarRuta("04").then((result) => {
    //     if (result.reporte == 1) {
    //       setspinnerroute(false);
    //       setaccesoruta(true);
    //       setindicadorruta(true);
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
          id_event: 4,
          sales_ofi: ofi_ventas,
          indicator: "WEB",
        });
      }
    });
  }, []);

  function handleChangeFiltro(name, value) {
    switch (name) {
      case "f_TIPO_DOC":
        setf_TIPO_DOC(value);
        break;
      case "f_NRO_DOC":
        setf_NRO_DOC(value);
        break;
      case "f_FECHA_EMISION":
        setf_FECHA_EMISION(value);
        break;
      case "f_FECHA_VENCI":
        setf_FECHA_VENCI(value);
        break;
      case "f_MONEDA":
        setf_MONEDA(value);
        break;
      case "f_DEUDA":
        setf_DEUDA(value);
        break;
      case "f_A_FAVOR":
        setf_A_FAVOR(value);
        break;
      case "f_BANCO":
        setf_BANCO(value);
        break;
      case "f_NRO_UNICO":
        setf_NRO_UNICO(value);
        break;
      case "f_DOC_ORIGEN":
        setf_DOC_ORIGEN(value);
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
      case 9:
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
    switch (num_col) {
      // 1: ascendente
      // 0: descendente
      case 1:
        clearColumnsIcon(1);
        if (col_1 === 0) {
          setcol_1(col_1 + 1);
          setIsCampo("TIPO_DOC");
          setIsOrden("0");
          SearchDeuCliDetalle("TIPO_DOC", "0");
        } else if (col_1 === 1) {
          setcol_1(col_1 + 1);
          setIsCampo("TIPO_DOC");
          setIsOrden("1");
          SearchDeuCliDetalle("TIPO_DOC", "1");
        } else {
          setcol_1(0);
          setIsCampo("");
          setIsOrden("");
          SearchDeuCliDetalle("", "");
        }
        break;
      case 2:
        clearColumnsIcon(2);
        if (col_2 === 0) {
          setcol_2(col_2 + 1);
          setIsCampo("NRO_DOC");
          setIsOrden("0");
          SearchDeuCliDetalle("NRO_DOC", "0");
        } else if (col_2 === 1) {
          setcol_2(col_2 + 1);
          setIsCampo("NRO_DOC");
          setIsOrden("1");
          SearchDeuCliDetalle("NRO_DOC", "1");
        } else {
          setcol_2(0);
          setIsCampo("");
          setIsOrden("");
          SearchDeuCliDetalle("", "");
        }
        break;
      case 3:
        clearColumnsIcon(3);
        if (col_3 === 0) {
          setcol_3(col_3 + 1);
          setIsCampo("FEMISION");
          setIsOrden("0");
          SearchDeuCliDetalle("FEMISION", "0");
        } else if (col_3 === 1) {
          setcol_3(col_3 + 1);
          setIsCampo("FEMISION");
          setIsOrden("1");
          SearchDeuCliDetalle("FEMISION", "1");
        } else {
          setcol_3(0);
          setIsCampo("");
          setIsOrden("");
          SearchDeuCliDetalle("", "");
        }
        break;
      case 4:
        clearColumnsIcon(4);
        if (col_4 === 0) {
          setcol_4(col_4 + 1);
          setIsCampo("FVENCI");
          setIsOrden("0");
          SearchDeuCliDetalle("FVENCI", "0");
        } else if (col_4 === 1) {
          setcol_4(col_4 + 1);
          setIsCampo("FVENCI");
          setIsOrden("1");
          SearchDeuCliDetalle("FVENCI", "1");
        } else {
          setcol_4(0);
          setIsCampo("");
          setIsOrden("");
          SearchDeuCliDetalle("", "");
        }
        break;
      case 5:
        clearColumnsIcon(5);
        if (col_5 === 0) {
          setcol_5(col_5 + 1);
          setIsCampo("MONEDA");
          setIsOrden("0");
          SearchDeuCliDetalle("MONEDA", "0");
        } else if (col_5 === 1) {
          setcol_5(col_5 + 1);
          setIsCampo("MONEDA");
          setIsOrden("1");
          SearchDeuCliDetalle("MONEDA", "1");
        } else {
          setcol_5(0);
          setIsCampo("");
          setIsOrden("");
          SearchDeuCliDetalle("", "");
        }
        break;
      case 6:
        clearColumnsIcon(6);
        if (col_6 === 0) {
          setcol_6(col_6 + 1);
          setIsCampo("DEUDA");
          setIsOrden("0");
          SearchDeuCliDetalle("DEUDA", "0");
        } else if (col_6 === 1) {
          setcol_6(col_6 + 1);
          setIsCampo("DEUDA");
          setIsOrden("1");
          SearchDeuCliDetalle("DEUDA", "1");
        } else {
          setcol_6(0);
          setIsCampo("");
          setIsOrden("");
          SearchDeuCliDetalle("", "");
        }
        break;
      case 7:
        clearColumnsIcon(7);
        if (col_7 === 0) {
          setcol_7(col_7 + 1);
          setIsCampo("A_FAVOR");
          setIsOrden("0");
          SearchDeuCliDetalle("A_FAVOR", "0");
        } else if (col_7 === 1) {
          setcol_7(col_7 + 1);
          setIsCampo("A_FAVOR");
          setIsOrden("1");
          SearchDeuCliDetalle("A_FAVOR", "1");
        } else {
          setcol_7(0);
          setIsCampo("");
          setIsOrden("");
          SearchDeuCliDetalle("", "");
        }
        break;
      case 8:
        clearColumnsIcon(8);
        if (col_8 === 0) {
          setcol_8(col_8 + 1);
          setIsCampo("BANCO");
          setIsOrden("0");
          SearchDeuCliDetalle("BANCO", "0");
        } else if (col_8 === 1) {
          setcol_8(col_8 + 1);
          setIsCampo("BANCO");
          setIsOrden("1");
          SearchDeuCliDetalle("BANCO", "1");
        } else {
          setcol_8(0);
          setIsCampo("");
          setIsOrden("");
          SearchDeuCliDetalle("", "");
        }
        break;
      case 9:
        clearColumnsIcon(9);
        if (col_9 === 0) {
          setcol_9(col_9 + 1);
          setIsCampo("NRO_UNICO");
          setIsOrden("0");
          SearchDeuCliDetalle("NRO_UNICO", "0");
        } else if (col_9 === 1) {
          setcol_9(col_9 + 1);
          setIsCampo("NRO_UNICO");
          setIsOrden("1");
          SearchDeuCliDetalle("NRO_UNICO", "1");
        } else {
          setcol_9(0);
          setIsCampo("");
          setIsOrden("");
          SearchDeuCliDetalle("", "");
        }
        break;
      case 10:
        clearColumnsIcon(10);
        if (col_10 === 0) {
          setcol_10(col_10 + 1);
          setIsCampo("DOC_ORIGEN");
          setIsOrden("0");
          SearchDeuCliDetalle("DOC_ORIGEN", "0");
        } else if (col_10 === 1) {
          setcol_10(col_10 + 1);
          setIsCampo("DOC_ORIGEN");
          setIsOrden("1");
          SearchDeuCliDetalle("DOC_ORIGEN", "1");
        } else {
          setcol_10(0);
          setIsCampo("");
          setIsOrden("");
          SearchDeuCliDetalle("", "");
        }
        break;
    }
  }
  function SearchDeuCliDetalle(IsCampo, IsOrden) {
    setListaCorreo([]);

    let model = {
      IsCampoAct: IsCampo,
      IsOrdenAct: IsOrden,
      IsCliente: IsCliente,
      IsChkCab: "",
      IsUser: jwt(localStorage.getItem("_token")).username,
      ItFilter: [
        {
          TIPO_DOC: f_TIPO_DOC,
          NRO_DOC: f_NRO_DOC,
          FECHA_EMISION: f_FECHA_EMISION,
          FECHA_VENCI: f_FECHA_VENCI,
          MONEDA: f_MONEDA,
          DEUDA: f_DEUDA.replace(",", ""),
          A_FAVOR: f_A_FAVOR,
          BANCO: f_BANCO,
          NRO_UNICO: f_NRO_UNICO,
          DOC_ORIGEN: f_DOC_ORIGEN,
        },
      ],
    };
    setspinner(true);
    setrespuesta_DeuCliBuscar({
      etCabeceraField: [
        { rucField: "", direccionField: "", razonSocField: "" },
      ],
      etDetalleField: [],
      etCorreosField: [],
      etResumenField: [],
    });

    DeuCli_Buscar(model).then((result) => {
      if (result.etCabeceraField.length >= 1) {
        setvalidateIscliente(true);
        setrespuesta_DeuCliBuscar(result);

        for (let i = 0; i < result.etCorreosField.length; i++) {
          // setListaCorreo([... listaCorreo, {
          //   num: i,
          //   correoField:result.etCorreosField[i].correoField
          // }])
          setListaCorreo((listaCorreo) => [
            ...listaCorreo,
            {
              num: i,
              correoField: result.etCorreosField[i].correoField,
            },
          ]);
          console.log(i);
          console.log(listaCorreo);
        }
        // setListaCorreo(result.etCorreosField);
      }
      setspinner(false);
    });
  }

  function SearchDeuCli(IsCampo, IsOrden) {
    setListaCorreo([]);
    clear_filtro_fila();
    settext_btn_filtro("Filtrar");
    setmostrar_filtro_fila(false);

    let model = {
      IsCampoAct: IsCampo,
      IsOrdenAct: IsOrden,
      IsCliente: IsCliente,
      IsChkCab: "",
      IsUser: jwt(localStorage.getItem("_token")).username,
      ItFilter: [
        {
          TIPO_DOC: "",
          NRO_DOC: "",
          FECHA_EMISION: "",
          FECHA_VENCI: "",
          MONEDA: "",
          DEUDA: "",
          A_FAVOR: "",
          BANCO: "",
          NRO_UNICO: "",
          DOC_ORIGEN: "",
        },
      ],
    };
    setspinner(true);
    setrespuesta_DeuCliBuscar({
      etCabeceraField: [
        { rucField: "", direccionField: "", razonSocField: "" },
      ],
      etCorreosField: [],
      etDetalleField: [],
      etResumenField: [],
    });
    console.log(model);
    DeuCli_Buscar(model).then((result) => {
      if (result.etCabeceraField.length >= 1) {
        setvalidateIscliente(true);
        setrespuesta_DeuCliBuscar(result);
        console.log(result);
        for (let i = 0; i < result.etCorreosField.length; i++) {
          // setListaCorreo([... listaCorreo, {
          //   num: i,
          //   correoField:result.etCorreosField[i].correoField
          // }])
          setListaCorreo((listaCorreo) => [
            ...listaCorreo,
            {
              num: i,
              correoField: result.etCorreosField[i].correoField,
            },
          ]);
          console.log(result.etCorreosField[i].correoField);
          console.log(listaCorreo);
        }
        // setListaCorreo(result.etCorreosField);
      }
      setspinner(false);
    });
  }

  function handleChange(name, value) {
    switch (name) {
      case "deucli_cliente":
        setIsCliente(value);
        if (value.trim() == "") {
          setvalidateIscliente(false);
        }
        break;
      case "deucli_direccion":
        setIsCliente(value);
        break;
      default:
        break;
    }
  }

  function Clear() {
    setvalidateIscliente(false);
    setrespuesta_DeuCliBuscar({
      etCabeceraField: [
        { rucField: "", direccionField: "", razonSocField: "" },
      ],
      etDetalleField: [],
      etCorreosField: [],
      etResumenField: [],
    });
    setIsCliente("");
  }

  function mc_Cliente() {
    setshowMcCliente((prev) => !prev);
  }

  function Exportar_pdf() {
    setshowEnvCorreo((prev) => !prev);
  }

  function clear_filtro_fila() {
    setf_TIPO_DOC("");
    setf_NRO_DOC("");
    setf_FECHA_EMISION("");
    setf_FECHA_VENCI("");
    setf_MONEDA("");
    setf_DEUDA("");
    setf_A_FAVOR("");
    setf_BANCO("");
    setf_NRO_UNICO("");
    setf_DOC_ORIGEN("");
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
    // setindicadorfiltro(true);
  }

  function buscar_filtro_icono_btn() {
    SearchDeuCliDetalle("", "");
  }

  function buscar_filtro_enter(event) {
    var keycode = event.keyCode;
    if (keycode == "13") {
      SearchDeuCliDetalle("", "");
    }
  }

  //formateo de la fecha para visualizar
  function formatDate(value) {
    console.log(value);
    if (value !== "    -  -  ") {
      console.log(value);
      var datePart = value.match(/\d+/g),
        year = datePart[0],
        month = datePart[1],
        day = datePart[2];

      return day + "-" + month + "-" + year;
    }
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
    <>
      {spinnerroute ? (
        <Spinner />
      ) : (
        <>
          {/* {accesoruta ? ( */}
          <div className="container-view">
            <MatchcodeCliente
              showMcCliente={showMcCliente}
              setShowMcCliente={setshowMcCliente}
              IsCliente={IsCliente}
              setIsCliente={setIsCliente}
            />
            <Envio_Correo
              showEnvcorreo={showEnvCorreo}
              setshowEnvcorreo={setshowEnvCorreo}
              IsCliente={IsCliente}
              listaCorreo={listaCorreo}
            />
            <div className="title-section">
              <div>
                <label> Reportes / Estado de Cuenta </label>
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
                <div className="col-sm-2 d-flex align-items-center">
                  <label>Cod. Cliente</label>
                </div>
                <div className="col-sm-10">
                  <InputForm
                    attribute={{
                      name: "deucli_cliente",
                      type: "text",
                      value: IsCliente,
                      disabled: false,
                      checked: false,
                      matchcode: true,
                      maxlength: 10,
                    }}
                    handleChange={handleChange}
                    onClick={() => mc_Cliente()}
                  />
                </div>
              </div>
            </section>
            <section className="col-md-12 row">
              <div className="col-md-6 p-2">
                <BtnSearch
                  attribute={{ name: "Buscar", classNamebtn: "btn_search" }}
                  onClick={() => SearchDeuCli("", "")}
                />
              </div>
              <div className="col-md-6 p-2">
                <BtnSearch
                  attribute={{
                    name: "Limpiar Campos",
                    classNamebtn: "btn_search",
                  }}
                  onClick={() => Clear()}
                />
              </div>
              {validateIscliente && (
                <div className="col-md-12 p-2">
                  <BtnSearch
                    attribute={{
                      name: "Enviar PDF",
                      classNamebtn: "btn_search",
                    }}
                    onClick={() => Exportar_pdf()}
                  />
                </div>
              )}
            </section>
            <section>
              <div style={{ margin: "10px" }} className="row">
                <div className="col-sm-2 d-flex align-items-center">
                  <label>Nombre Cliente</label>
                </div>
                <div className="col-sm-10">
                  <InputForm
                    attribute={{
                      name: "deucli_razonsocial",
                      type: "text",
                      value:
                        respuesta_DeuCliBuscar.etCabeceraField[0].razonSocField,
                      disabled: true,
                      checked: false,
                      matchcode: false,
                    }}
                    handleChange={handleChange}
                  />
                </div>

                <div className="col-sm-2 d-flex align-items-center">
                  <label></label>
                </div>
                <div
                  className="col-sm-10 d-flex align-items-center"
                  style={{ paddingLeft: "18px" }}
                >
                  <input
                    type="checkbox"
                    name="2"
                    className="checkbox_detalle_2"
                    disabled
                    checked={
                      respuesta_DeuCliBuscar.etCabeceraField[0].chkField == "X"
                        ? true
                        : false
                    }
                  />
                  <label
                    style={{
                      margin: "10px",
                      textTransform: "uppercase",
                      fontWeight: "bold",
                    }}
                  >
                    {respuesta_DeuCliBuscar.etCabeceraField[0].chkDescField}
                  </label>
                </div>
              </div>
            </section>

            <section style={{ marginBottom: "47px" }}>
              <div style={{ margin: "10px" }} className="row">
                <div className="col-sm-2 d-flex align-items-center">
                  <label>RUC</label>
                </div>
                <div className="col-sm-10">
                  <InputForm
                    attribute={{
                      name: "deucli_ruc",
                      type: "text",
                      value: respuesta_DeuCliBuscar.etCabeceraField[0].rucField,
                      disabled: true,
                      checked: false,
                      matchcode: false,
                    }}
                    handleChange={handleChange}
                  />
                </div>

                <div className="col-sm-2 d-flex align-items-center">
                  <label>Dirección</label>
                </div>
                <div className="col-sm-10">
                  <InputForm
                    attribute={{
                      name: "deucli_direccion",
                      type: "text",
                      value:
                        respuesta_DeuCliBuscar.etCabeceraField[0]
                          .direccionField,
                      disabled: true,
                      checked: false,
                      matchcode: false,
                    }}
                    handleChange={handleChange}
                  />
                </div>
              </div>
            </section>
            <section>
              <div className="container-table" style={{ margin: "15px" }}>
                <div
                  style={{
                    fontSize: "18px",
                    margin: "8px",
                    fontWeight: "bold",
                  }}
                >
                  <label> Resumen </label>
                  <hr />
                </div>
                <div className="container-table-600">
                  <table className="content-table">
                    <thead>
                      <tr>
                        <th>Tipo de Doc.</th>
                        <th>Soles</th>
                        <th>Dólares</th>
                      </tr>
                    </thead>
                    <tbody>
                      {respuesta_DeuCliBuscar.etResumenField.map(
                        (response, key) => (
                          <>
                            {respuesta_DeuCliBuscar.etResumenField.length ==
                              key + 1 ? (
                              <tr
                                key={key}
                                style={{
                                  backgroundColor: "#b5ecca",
                                  fontSize: "16px",
                                }}
                              >
                                <th
                                  style={{
                                    textAlign: "left",
                                    textTransform: "uppercase",
                                    fontWeight: "bold",
                                  }}
                                  align={"left"}
                                >
                                  {response.tipoDocField}
                                </th>
                                <th
                                  style={{ textAlign: "right" }}
                                  align={"right"}
                                >
                                  {/* {convertDecimal(response.montoSolesField)} */}
                                  {response.montoSolesField}
                                </th>

                                <th
                                  style={{ textAlign: "right" }}
                                  align={"right"}
                                >
                                  {/* {convertDecimal(response.montoDolaresField)} */}
                                  {response.montoDolaresField}
                                </th>
                              </tr>
                            ) : (
                              <tr key={key}>
                                <th
                                  style={{
                                    textAlign: "left",
                                    textTransform: "uppercase",
                                    fontWeight: "bold",
                                    fontSize: "16px",
                                  }}
                                  align={"left"}
                                >
                                  {response.tipoDocField}
                                </th>
                                <th
                                  style={{ textAlign: "right" }}
                                  align={"right"}
                                >
                                  {/* {convertDecimal(response.montoSolesField)} */}
                                  {response.montoSolesField}
                                </th>

                                <th
                                  style={{ textAlign: "right" }}
                                  align={"right"}
                                >
                                  {/* {convertDecimal(response.montoDolaresField)} */}
                                  {response.montoDolaresField}
                                </th>
                              </tr>
                            )}
                          </>
                        )
                      )}
                    </tbody>
                  </table>
                  {spinner && <Spinner />}
                </div>
              </div>
            </section>

            <section>
              <div className="container-table" style={{ margin: "15px" }}>
                <div
                  style={{
                    fontSize: "18px",
                    margin: "8px",
                    fontWeight: "bold",
                  }}
                >
                  <label> Detalle </label>
                  <hr />
                  {respuesta_DeuCliBuscar.etDetalleField.length ? (
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
                </div>
                <div className="container-table-600">
                  <table className="content-table">
                    <thead>
                      <tr>
                        {mostrar_filtro_fila == true ? <th></th> : null}
                        <th>
                          Tipo de Doc. |{" "}
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
                          Nro. Doc. |{" "}
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
                          Emisión |{" "}
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
                          Vcmto |{" "}
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
                        <th>
                          Deuda |{" "}
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
                          A favor |{" "}
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
                          Banco |{" "}
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
                          Nro. Único |{" "}
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
                          Doc. Ori |{" "}
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
                              name="f_TIPO_DOC"
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
                              name="f_NRO_DOC"
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
                              type="date"
                              onKeyUp={(e) => buscar_filtro_enter(e)}
                              name="f_FECHA_EMISION"
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
                              type="date"
                              onKeyUp={(e) => buscar_filtro_enter(e)}
                              name="f_FECHA_VENCI"
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
                              name="f_MONEDA"
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
                              name="f_DEUDA"
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
                              name="f_A_FAVOR"
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
                              name="f_BANCO"
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
                              name="f_NRO_UNICO"
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
                              name="f_DOC_ORIGEN"
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
                      {respuesta_DeuCliBuscar.etDetalleField.map(
                        (response, key) => (
                          <tr key={key}>
                            {mostrar_filtro_fila == true ? <th></th> : null}
                            <th style={{ textAlign: "left" }}>
                              {response.tipoDocField}
                            </th>
                            <th style={{ textAlign: "center" }}>
                              {response.nroDocField}
                            </th>
                            <th style={{ textAlign: "center" }}>
                              {/* {formatDate(response.fechaEmisionField)} */}
                              {response.fechaEmisionField}
                            </th>
                            <th style={{ textAlign: "center" }}>
                              {/* {formatDate(response.fechaVenciField)} */}
                              {response.fechaVenciField}
                            </th>
                            <th style={{ textAlign: "center" }}>
                              {response.monedaField}
                            </th>
                            <th style={{ textAlign: "right" }}>
                              {convertDecimal(response.deudaField)}
                            </th>
                            <th style={{ textAlign: "center" }}>
                              {response.aFavorField}
                            </th>
                            <th style={{ textAlign: "center" }}>
                              {response.bancoField}
                            </th>
                            <th style={{ textAlign: "center" }}>
                              {response.nroUnicoField}
                            </th>
                            <th style={{ textAlign: "center" }}>
                              {response.docOrigenField}
                            </th>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                  {spinner && <Spinner />}
                </div>
              </div>
            </section>
          </div>
          {/* ) : (
            <div className="access-route">NO TIENE ACCESO A ESTE REPORTE</div>
          )} */}
        </>
      )}
    </>
  );
};

export default Deuda_Cliente;
