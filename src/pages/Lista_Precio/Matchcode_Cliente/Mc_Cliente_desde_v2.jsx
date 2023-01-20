import React, { useRef, useEffect, useCallback, useState } from "react";
import { ClienteListaPrecio } from "../../../Services/ServiceCliente";
import Pagination from "../../../components/Pagination";
import InputForm from "../../../components/InputForm";
import BtnSearch from "../../../components/BtnSearch";
import Spinner from "../../../components/Spinner";
import jwt from "jwt-decode";
const Mc_Cliente_desde_v2 = ({
  showcliente,
  setshowcliente,
  setcliente_desde,
  cliente_desde,
  cliente_hasta,
  setcliente,
  org_ventas,
   ofi_ventas,
   lista_precio,
  setclienteName
}) => {
    console.log(org_ventas)
  //  console.log(ofi_ventas)
  //  console.log(lista_precio)
  const [IsRegxpag] = useState(15); // cantidad de datos por página

  const [PKunnr, setPKunnr] = useState("");
  const [IsName1, setIsName1] = useState("");
  const [IsStcd1, setIsStcd1] = useState("");

  //INPUT Organización ventas
  // const [org_ventas, setorg_ventas] = useState([
  //   { Sign: "I", Option: "EQ", Low: "", High: "" },
  // ]);
  //const [org_ventas_desde, setorg_ventas_desde] = useState("");



  //CARGA DE SPINNER
  const [spinner, setspinner] = useState(false);
  const [responseCliente, setresponseCliente] = useState({
    esRegtotField: "",
    etClientesField: [],
  });
  //NUMERO TOTAL DE DATOS
  const [TotalData, setTotalData] = useState();
  //ACTIVAR SECCION DE PAGINADO
  const [valuepagination, setvaluepagination] = useState(false);

  const modalRef = useRef();

  const keyPress = useCallback(
    (e) => {
      if (e.key === "Escape" && showcliente) {
        setshowcliente(false);
      }
    },
    [setshowcliente, showcliente]
  );

  useEffect(() => {
    if (showcliente == true) {
      setPKunnr("");
      setIsName1("");
      setIsStcd1("");
      setshowcliente({ etClientesField: [] });
    }

  }, [showcliente]);

  useEffect(() => {
    // setItKunnr([{ Sign: "", Option: "", Low: "", High: "" }]);

    setPKunnr("");

    setIsName1("");

    setIsStcd1("");
    setTotalData();

    setresponseCliente({ etClientesField: [] });
    // setViewInfo(true);
    // SearchCliente(1);
    //--------------------- para actualizar valor org_ventas

    if(cliente_desde != ''){
      setcliente(cliente_desde);
    }
    else{
      setcliente(cliente_desde)
    }
    // if (cliente_desde != "") {
    //   if (cliente_hasta == "") {
    //     setcliente([
    //       {
    //         Sign: "I",
    //         Option: "EQ",
    //         Low: cliente_desde,
    //         High: "",
    //       },
    //     ]);
    //   } else {
    //     setcliente([
    //       {
    //         Sign: "I",
    //         Option: "BT",
    //         Low: cliente_desde,
    //         High: cliente_hasta,
    //       },
    //     ]);
    //   }
    // } else {
    //   if (cliente_hasta != "") {
    //     setcliente([{ Sign: "I", Option: "EQ", Low: "", High: cliente_hasta }]);
    //   } else {
    //     setcliente([{ Sign: "", Option: "", Low: "", High: "" }]);
    //   }
    // }
    //---------------------
    document.addEventListener("keydown", keyPress);
    return () => document.removeEventListener("keydown", keyPress);
  }, [keyPress]);




  const closeModal = (e) => {
    if (modalRef.current === e.target) {
      setshowcliente(false);
    }
  };
  function handleChange(name, value) {
    switch (name) {
      case "codigo_cliente_mc":
        setPKunnr(value);
        break;
      case "razon_social_mc":
        setIsName1(value);
        break;
      case "ruc_mc":
        setIsStcd1(value);
        break;
      default:
        break;
    }
  }

  function Clear() {
    setcliente("");
    setPKunnr("")
    setIsName1("");
    setIsStcd1("");
  }

  function Search_mc_Cliente(page) {
    setspinner(true);
    // setresponse_mc_cliente([]);
    // setTotalData();
    let modal_mc_infocliente_cliente = {
      IsKunnr: PKunnr,
      IsName1: IsName1,
      IsStcd1: IsStcd1,
      IsUser: jwt(localStorage.getItem("_token")).username,
      IsNpag: page,
      IsRegxpag: IsRegxpag,
      IsVkorg: org_ventas,
      IsVkbur: ofi_ventas,
      IsPltyp: lista_precio,
      // IsDuplicate: ''
    };
    console.log("MATCH CODE BUSCAR CLIENTE", modal_mc_infocliente_cliente)

    ClienteListaPrecio(modal_mc_infocliente_cliente).then((result) => {
      setresponseCliente(result);

      setTotalData(result.esRegtotField);
      setspinner(false);
      setvaluepagination(true);
    });
  }

  function clickcelda(value) {
    // setPKunnr(value.kunnrField);
    setcliente_desde(value.kunnrField);
    setclienteName(value.name1Field)
    // setetClientesField(value);
    setshowcliente((prev) => !prev);
  }

  // seleccionar pagina
  function changePage(pageNumber) {
    Search_mc_Cliente(pageNumber);
  }
  // siguiente pagina
  function prevPage(value) {
    Search_mc_Cliente(value - 1);
  }
  //pagina anterior
  function nextPage(value) {
    Search_mc_Cliente(value + 1);
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
  return (
    <>

      {showcliente ? (

        <div
          className="container-modal-background"
          onClick={closeModal}
          ref={modalRef}
        >
          {/* <Mc_Org_Ventas_desde
            setorg_ventas_desde={setorg_ventas_desde}
            org_ventas_desde={org_ventas_desde}
            setorg_ventas={setorg_ventas}

          /> */}
          <div className="modal-wrapper modal-wrapper-bg">
            <section
              className="row"
              style={{ margin: "auto", paddingTop: "50px" }}
            >
              <div className="col-sm-4 d-flex align-items-center">
                <label>Cod. Cliente</label>
              </div>
              <div className="col-sm-8">
                <InputForm
                  attribute={{
                    name: "codigo_cliente_mc",
                    type: "text",
                    value: PKunnr,
                    disabled: false,
                    checked: false,
                    matchcode: false,
                    maxlength: 10
                  }}
                  handleChange={handleChange}
                />
              </div>

              <div className="col-sm-4 d-flex align-items-center">
                <label>Nombre Cliente</label>
              </div>
              <div className="col-sm-8">
                <InputForm
                  attribute={{
                    name: "razon_social_mc",
                    type: "text",
                    value: IsName1,
                    disabled: false,
                    checked: false,
                    matchcode: false,
                    maxlength: 35
                  }}
                  handleChange={handleChange}
                />
              </div>

              <div className="col-sm-4 d-flex align-items-center">
                <label>RUC</label>
              </div>
              <div className="col-sm-8">
                <InputForm
                  attribute={{
                    name: "ruc_mc",
                    type: "text",
                    value: IsStcd1,
                    disabled: false,
                    checked: false,
                    matchcode: false,
                    maxlength: 16
                  }}
                  handleChange={handleChange}
                />
              </div>
            </section>
            <section className="col-md-12">
              <div style={{ margin: "10px" }}>
                <BtnSearch
                  attribute={{ name: "Buscar", classNamebtn: "btn_search" }}
                  onClick={() => Search_mc_Cliente(1)}
                />
              </div>
              <div style={{ margin: "10px" }}>
                <BtnSearch
                  attribute={{ name: "Limpiar Campos", classNamebtn: "btn_search" }}
                  onClick={() => Clear()}
                />
              </div>
            </section>
            <section className="section-table-modal">
              <div className="container-table responsive-table-all">
                {spinner && <Spinner />}
                <table className="content-table ">
                  <thead>
                    <tr>
                      <th>Cliente</th>
                      <th>Nombre Cliente</th>
                      <th>Ciudad del Cliente</th>
                      <th>Identificación</th>
                      <th>Org. Ventas</th>
                      <th>Centro</th>
                      <th>Oficina de Ventas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                       responseCliente.etClientesField.length >= 1 ?
                        responseCliente.etClientesField.map(
                          (response, key) => (
                            <tr key={key} onClick={() => clickcelda(response)}>
                              <th style={{ textAlign: "center" }}>{response.kunnrField}</th>
                              <th style={{ textAlign: "center" }}>{response.name1Field}</th>
                              <th style={{ textAlign: "center" }}>{response.zonaField}</th>
                              <th style={{ textAlign: "center" }}>{response.stcd1Field}</th>
                              <th style={{ textAlign: "center" }}>{response.vkorgField}</th>
                              <th style={{ textAlign: "center" }}>{response.spartField}</th>
                              <th style={{ textAlign: "center" }}>{response.vkburField}</th>
                              {/* <th style={{textAlign:"center"}}>{response.vtwegField}</th> */}
                              {/* <th style={{textAlign:"center"}}>{response.spartField}</th> */}
                              {/* <th style={{ textAlign: "end" }}>{convertDecimal(response.klimkField)}</th> */}
                              {/* <th style={{textAlign:"center"}}>{response.docValField}</th> */}
                            </tr>
                          )
                        ) : null
                    }
                  </tbody>
                </table>

              </div>
            </section>

            <div className="content-pagination">
              {valuepagination && (
                <Pagination
                  postsPerPage={IsRegxpag}
                  totalPosts={TotalData}
                  changePage={changePage}
                  prevPage={prevPage}
                  nextPage={nextPage}
                />
              )}
            </div>

            <div
              className="close-modal-button"
              onClick={() => setshowcliente((prev) => !prev)}
            >
              <i className="fas fa-times"></i>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Mc_Cliente_desde_v2;
