import React, { useRef, useEffect, useCallback, useState } from "react";
import { MatchcodeClienteRDespacho } from "../../../Services/ServiceReporteDespacho";
import Pagination from "../../../components/Pagination";
import InputForm from "../../../components/InputForm";
import BtnSearch from "../../../components/BtnSearch";
import Spinner from "../../../components/Spinner";
import jwt from "jwt-decode";

import toast, { Toaster } from "react-hot-toast";

const Mc_Cliente_desde_v2 = ({
  showcliente,
  setshowcliente,
  setcliente_desde,
  cliente_desde,
  cliente_hasta,
  setcliente,
  org_ventas_desde,
  org_ventas_hasta
}) => {
  const [IsRegxpag] = useState(15); // cantidad de datos por página

  const [PKunnr, setPKunnr] = useState("");
  const [IsName1, setIsName1] = useState("");
  const [IsStcd1, setIsStcd1] = useState("");
  //CARGA DE SPINNER
  const [spinner, setspinner] = useState(false);
  const [responseCliente, setresponseCliente] = useState([]);
  //NUMERO TOTAL DE DATOS
  const [TotalData, setTotalData] = useState();
  //ACTIVAR SECCION DE PAGINADO
  const [valuepagination, setvaluepagination] = useState(false);

  const modalRef = useRef();

  /////////////////////  CHECKBOX /////////

  const [arraycheckbox, setarraycheckbox] = useState([]);
  const [arraycheckbox_search, setarraycheckbox_search] = useState([
    { data: [] }
  ])

  //PARA ALMACENAR LOS DATOS A EXPORTAR
  const [DataSet, setDataSet] = useState([{ data: [] }]);

  //para check de cabecera
  const [stateChecboxHeader, setstateChecboxHeader] = useState(false);

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

    setresponseCliente([]);

    setstateChecboxHeader(false);
    // setViewInfo(true);
    // SearchCliente(1);
    //--------------------- para actualizar valor org_ventas
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
    setIsName1("");
    setIsStcd1("");
  }

  function CheckAll() {
    let modal_mc_infocliente_cliente = {
      IsKunnr: PKunnr,
      IsName1: IsName1,
      IsNpag: "",
      IsRegxpag: "",
      IsStcd1: IsStcd1,
      IsUser: jwt(localStorage.getItem("_token")).username,
      ItVkorg: org_ventas_desde != "" ? (org_ventas_hasta == "" ?
        [{ Sign: "I", Option: "EQ", Low: org_ventas_desde, High: "" }] :
        [{ Sign: "I", Option: "BT", Low: org_ventas_desde, High: org_ventas_hasta }]) :
        [{ Sign: "I", Option: "EQ", Low: "", High: org_ventas_hasta }]
    };

    if (PKunnr.trim() != "" ||
      IsName1.trim() != "" ||
      IsStcd1.trim() != "") {
      MatchcodeClienteRDespacho(modal_mc_infocliente_cliente)
        .then((result) => {
          setDataSet([
            {
              data: result.etClientesField.map((data) => {
                return [
                  { value: data.kunnrField }
                ]
              })
            }
          ])
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  function Search_mc_Cliente(ind, page) {
    setspinner(true);
    // setresponse_mc_cliente([]);
    // setTotalData();
    let modal_mc_infocliente_cliente = {
      IsKunnr: PKunnr,
      IsName1: IsName1,
      IsNpag: "",
      IsRegxpag: "",
      IsStcd1: IsStcd1,
      IsUser: jwt(localStorage.getItem("_token")).username,
      ItVkorg: org_ventas_desde != "" ? (org_ventas_hasta == "" ?
        [{ Sign: "I", Option: "EQ", Low: org_ventas_desde, High: "" }] :
        [{ Sign: "I", Option: "BT", Low: org_ventas_desde, High: org_ventas_hasta }]) :
        [{ Sign: "I", Option: "EQ", Low: "", High: org_ventas_hasta }]
    };
    //////////////CHECKBOX/////////
    if (ind == 0) {
      CheckAll();
      arraycheckbox_search[0].data = [];
      setresponseCliente([]);

      MatchcodeClienteRDespacho(modal_mc_infocliente_cliente).then((result) => {
        setresponseCliente(result.etClientesField.map((d) => {
          return {
            select: false,
            kunnrField: d.kunnrField,
            name1Field: d.name1Field,
            zonaField: d.zonaField,
            stcd1Field: d.stcd1Field
          };
        }));

        setTotalData(result.esRegtotField);
        setspinner(false);
        setvaluepagination(true);
      });
    }
    else {
      MatchcodeClienteRDespacho(modal_mc_infocliente_cliente).then((result) => {
        if (stateChecboxHeader === true) {
          setresponseCliente(result.etClientesField.map((d) => {
            return {
              select: true,
              kunnrField: d.kunnrField,
              name1Field: d.name1Field,
              zonaField: d.zonaField,
              stcd1Field: d.stcd1Field
            };
          }));
          for (let i = 0; i < result.etClientesField.length; i++) {
            document.getElementById(
              "checkbox-body-" + result.etClientesField[i].kunnrField
            ).checked = true;
          }
        }
        else {
          setresponseCliente(result.etClientesField.map((d) => {
            return {
              select: false,
              kunnrField: d.kunnrField,
              name1Field: d.name1Field,
              zonaField: d.zonaField,
              stcd1Field: d.stcd1Field
            };
          }));
          for (let i = 0; i < result.etClientesField.length; i++) {
            document.getElementById(
              "checkbox-body-" + result.etClientesField[i].kunnrField
            ).checked = false;
          }
        }

        for (let y = 0; y < result.etClientesField.length; y++) {
          if (arraycheckbox.length > 0) {
            for (let i = 0; i < arraycheckbox.length; i++) {
              if (
                result.etClientesField[y].kunnrField ==
                arraycheckbox[i].kunnrField
              ) {
                document.getElementById(
                  "checkbox-body-" + result.etClientesField[y].kunnrField
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

  // HAY QUE CREAR OTRO BOTONCITO 

  // function clickcelda(value) {
  //   // setPKunnr(value.kunnrField);
  //   setcliente_desde(value.kunnrField);
  //   // setetClientesField(value);
  //   setshowcliente((prev) => !prev);
  // }

  // // seleccionar pagina
  // function changePage(pageNumber) {
  //   Search_mc_Cliente(1, pageNumber);
  // }
  // // siguiente pagina
  // function prevPage(value) {
  //   Search_mc_Cliente(1, value - 1);
  // }
  // //pagina anterior
  // function nextPage(value) {
  //   Search_mc_Cliente(1, value + 1);
  // }
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

  ////////// CHECK BOX

  function ordenamiento(d) {
    arraycheckbox_search[0].data.push([
      {
        value: d.kunnrField
      }
    ]);
    arraycheckbox_search[0].data.sort(function (a, b) {
      return a[0].value - b[0].value;
    });
  }

  function onClickHeaderCheckbox(e) {
    // console.log("check", e.target.checked);
    setstateChecboxHeader(e.target.checked);
    if (e.target.checked === true) {
      for (let i = 0; i < responseCliente.length; i++) {
        document.getElementById(
          "checkbox-body-" + responseCliente[i].kunnrField
        ).checked = true;
        arraycheckbox_search[0].data = [];
      }
    } else {
      for (let i = 0; i < responseCliente.length; i++) {
        document.getElementById(
          "checkbox-body-" + responseCliente[i].kunnrField
        ).checked = false;
      }
    }
  }

  function SendCheckbox() {
    // console.log(arraycheckbox_search); // DATA INDIVIDUAL
    // console.log(DataSet); // TODA LA DATA
    console.log('TODOS: ', stateChecboxHeader);
    // 
    if(responseCliente.length == 0){
      toast.error("Debe \"buscar\" un cliente.", {
        position: "top-center",
        autoClose: 1000,
        style: {
          backgroundColor: "#212121",
          color: "#fff",
        }
      })
    }
    else if ( stateChecboxHeader == true || arraycheckbox_search[0].data.length != 0) {
      // console.log('DATA_SELECTED', data)



      // console.log('DATA_ALL', data1)
      // dataItKunnr.length = 0; // LIMPIAR data

      // setcliente(data1);
      // setcliente_desde(data1[0].Low)
      if (stateChecboxHeader) {
        let data1 = []
        for (let i = 0; i < DataSet[0].data.length; i++) {
          const element = DataSet[0].data[i];
          //console.log(element[0].value)
          data1.push(
            {
              Sign: "I",
              Option: "EQ",
              Low: element[0].value,
              High: ""
            }
          )
        }
        // console.log("VACIO")
        setcliente(data1);
        // setarraycheckbox_search([{ data: [] }])
        // console.log("PRIMER NÚMERO",DataSet[0].data[0][0].value)
        setcliente_desde(DataSet[0].data[0][0].value)
      }
      else {
        let data = []
        for (let i = 0; i < arraycheckbox_search[0].data.length; i++) {
          const element = arraycheckbox_search[0].data[i];
          //console.log(element[0].value)
          data.push(
            {
              Sign: "I",
              Option: "EQ",
              Low: element[0].value,
              High: ""
            }
          )
        }
        console.log("LLENO")
        setcliente(data);
        // setDataSet([{ data: [] }])
        setcliente_desde(arraycheckbox_search[0].data[0][0].value)

      }
      // setcliente_desde(data[0].Low)
      setshowcliente((prev) => !prev);
    }

    // console.log(DataSet)
    else {
      toast.error("Debe \"seleccionar\" un cliente.", {
        position: "top-center",
        autoClose: 1000,
        style: {
          backgroundColor: "#212121",
          color: "#fff",
        }
      })
    }

  }
  return (
    <>
      <Toaster />
      {showcliente ? (
        <div
          className="container-modal-background"
          onClick={closeModal}
          ref={modalRef}
        >
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
                  onClick={() => Search_mc_Cliente(0, 1)}
                />
              </div>
              <div style={{ margin: "10px" }}>
                <BtnSearch
                  attribute={{ name: "Limpiar Campos", classNamebtn: "btn_search" }}
                  onClick={() => Clear()}
                />
              </div>
              <div style={{ margin: "10px" }}>
                <BtnSearch
                  attribute={{ name: "Aceptar", classNamebtn: "btn_search" }}
                  onClick={() => SendCheckbox()}
                />
              </div>
            </section>
            <section className="section-table-modal">
              <div className="container-table responsive-table-all">

                <table className="content-table ">
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
                      <th>Cod. Cliente</th>
                      <th>Nombre Cliente</th>
                      <th>Zona del Cliente</th>
                      <th>RUC</th>

                      {/* <th>Canal distrib.</th> */}
                      {/* <th>Sector</th> */}
                      {/* <th>USD Línea Cred. Disp</th> */}
                      {/* <th>Tiene Doc. vencidos</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {responseCliente != null &&
                      responseCliente.length > 0 ?
                      responseCliente.map(
                        (response, key) => (
                          // <tr key={key} onClick={() => clickcelda(response)}>
                          <tr key={key}>
                            <th style={{ textAlign: "center" }}>
                              <input
                                type="checkbox"
                                id={`checkbox-body-` + response.kunnrField}
                                onChange={(e) => {
                                  setresponseCliente(
                                    responseCliente.map((d) => {
                                      if (
                                        d.kunnrField == response.kunnrField
                                      ) {
                                        // PONER SELECT EN BUSCAR
                                        d.select = e.target.checked;
                                        if (e.target.checked == true) {
                                          if (stateChecboxHeader == true) {
                                            DataSet[0].data.push([
                                              {
                                                value: d.kunnrField
                                              }
                                            ]);
                                            //console.log(DataSet)
                                          } else {
                                            setarraycheckbox([
                                              ...arraycheckbox,
                                              {
                                                kunnrField: d.kunnrField,
                                              },
                                            ]);
                                            ordenamiento(d)
                                          }
                                        }
                                        else if (e.target.checked == false) {
                                          for (
                                            let i = 0;
                                            i < arraycheckbox.length;
                                            i++
                                          ) {
                                            if (
                                              d.kunnrField ==
                                              arraycheckbox[i].kunnrField
                                            ) {
                                              arraycheckbox.splice(i, 1);
                                              arraycheckbox_search[0].data.splice(
                                                i,
                                                1
                                              );
                                            } else {
                                              setarraycheckbox([
                                                ...arraycheckbox,
                                                {
                                                  kunnrField:
                                                    arraycheckbox[i]
                                                      .kunnrField,
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
                                              d.kunnrField ==
                                              DataSet[0].data[y][0].value
                                            ) {
                                              //  console.log(DataSet[0].data[y])
                                              arraycheckbox_search[0].data =
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
                            <th style={{ textAlign: "center" }}>{response.kunnrField}</th>
                            <th style={{ textAlign: "center" }}>{response.name1Field}</th>
                            <th style={{ textAlign: "center" }}>{response.zonaField}</th>
                            <th style={{ textAlign: "center" }}>{response.stcd1Field}</th>
                            {/* <th style={{textAlign:"center"}}>{response.vtwegField}</th> */}
                            {/* <th style={{textAlign:"center"}}>{response.spartField}</th> */}
                            {/* <th style={{textAlign:"end"}}>{convertDecimal(response.klimkField)}</th> */}
                            {/* <th style={{textAlign:"center"}}>{response.docValField}</th> */}
                          </tr>
                        )
                      ) : null
                    }
                  </tbody>
                </table>
                {responseCliente.length == 0 && spinner == false ? (
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

            {/* <div className="content-pagination">
              {valuepagination && (
                <Pagination
                  postsPerPage={IsRegxpag}
                  totalPosts={TotalData}
                  changePage={changePage}
                  prevPage={prevPage}
                  nextPage={nextPage}
                />
              )}
            </div> */}

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
