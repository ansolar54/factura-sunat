import React, { useRef, useEffect, useCallback, useState } from "react";
import { Cliente } from "../../../Services/ServiceCliente";
import Spinner from "../../../components/Spinner";
import Pagination from "../../../components/Pagination";
import InputForm from "../../../components/InputForm";
import BtnSearch from "../../../components/BtnSearch";
import jwt from "jwt-decode";
import "./Mc_Cliente_hasta.css";

const Mc_Cliente_hasta = ({
  showcliente,
  setshowcliente,
  setcliente_hasta,
  cliente_hasta,
  cliente_desde,
  setcliente,
}) => {
  const [IsRegxpag] = useState(15); // cantidad de datos por página

  const [ItKunnr, setItKunnr] = useState([
    { Sign: "", Option: "", Low: "", High: "" },
  ]);
  const [ItKunnr_desde, setItKunnr_desde] = useState("");
  const [ItKunnr_hasta, setItKunnr_hasta] = useState("");

  const [ItName1, setItName1] = useState([
    { Sign: "", Option: "", Low: "", High: "" },
  ]);
  const [ItName1_desde, setItName1_desde] = useState("");
  const [ItName1_hasta, setItName1_hasta] = useState("");

  const [ItStcd1, setItStcd1] = useState([
    { Sign: "", Option: "", Low: "", High: "" },
  ]);
  const [ItStcd1_desde, setItStcd1_desde] = useState("");
  const [ItStcd1_hasta, setItStcd1_hasta] = useState("");

  const [ViewInfo, setViewInfo] = useState(false);
  const [responseCliente, setresponseCliente] = useState({
    etClientesField: [],
  });
  //NUMERO TOTAL DE DATOS
  const [TotalData, setTotalData] = useState();
  //ACTIVAR SECCION DE PAGINADO
  const [valuepagination, setvaluepagination] = useState(false);
  const modalRef = useRef();

  const closeModal = (e) => {
    if (modalRef.current === e.target) {
      setshowcliente(false);
    }
  };

  const keyPress = useCallback(
    (e) => {
      if (e.key === "Escape" && showcliente) {
        setshowcliente(false);
      }
    },
    [setshowcliente, showcliente]
  );

  useEffect(() => {
    setItKunnr_desde("");
    setItKunnr_hasta("");

    setItName1_desde("");
    setItName1_hasta("");

    setItStcd1_desde("");
    setItStcd1_hasta("");
    setTotalData();
  }, [showcliente]);
  useEffect(() => {
    setItKunnr([{ Sign: "", Option: "", Low: "", High: "" }]);

    setItKunnr_desde("");
    setItKunnr_hasta("");

    setItName1_desde("");
    setItName1_hasta("");

    setItStcd1_desde("");
    setItStcd1_hasta("");

    setresponseCliente({ etClientesField: [] });
    // SearchCliente(1);
    setViewInfo(true);
    //--------------------- para actualizar valor org_ventas
    if (cliente_hasta != "") {
      if (cliente_desde == "") {
        setcliente([{ Sign: "I", Option: "EQ", Low: "", High: cliente_hasta }]);
      } else {
        setcliente([
          { Sign: "I", Option: "BT", Low: cliente_desde, High: cliente_hasta },
        ]);
      }
    } else {
      if (cliente_desde != "") {
        setcliente([{ Sign: "I", Option: "EQ", Low: cliente_desde, High: "" }]);
      } else {
        setcliente([{ Sign: "", Option: "", Low: "", High: "" }]);
      }
    }

    //---------------------
    document.addEventListener("keydown", keyPress);
    return () => document.removeEventListener("keydown", keyPress);
  }, [keyPress]);

  // seleccionar pagina
  function changePage(pageNumber) {
    SearchCliente(pageNumber);
  }
  // siguiente pagina
  function prevPage(value) {
    SearchCliente(value - 1);
  }
  //pagina anterior
  function nextPage(value) {
    SearchCliente(value + 1);
  }

  function SearchCliente(page) {
    setTotalData();
    let EstructuraCliente = {
      IsNpag: page,
      IsRegxpag: IsRegxpag,
      IsUser: jwt(localStorage.getItem("_token")).username,
      ItKunnr: ItKunnr,
      ItName1: ItName1,
      ItStcd1: ItStcd1,
    };

    if (showcliente == true) {
      setViewInfo(false);
      Cliente(EstructuraCliente).then((result) => {
        setresponseCliente(result);
        setTotalData(result.esRegtotField);
        setViewInfo(true);
        setvaluepagination(true);
      });
    }
  }

  function clickcelda(kunnrField) {
    setcliente_hasta(kunnrField.toUpperCase());
    setshowcliente((prev) => !prev);
  }

  function handleChange(name, value) {
    switch (name) {
      case "mc_ItKunnr":
        setItKunnr([{ Sign: "I", Option: "EQ", Low: "", High: "" }]);
        break;
      case "mc_ItKunnr_desde":
        setItKunnr_desde(value);
        if (value.trim() != "") {
          if (ItKunnr_hasta == "") {
            setItKunnr([
              { Sign: "I", Option: "EQ", Low: value, High: "" },
            ]);
          } else {
            setItKunnr([
              {
                Sign: "I",
                Option: "BT",
                Low: value,
                High: ItKunnr_hasta,
              },
            ]);
          }
        } else {
          if (ItKunnr_hasta != "") {
            setItKunnr([
              { Sign: "I", Option: "EQ", Low: "", High: ItKunnr_hasta },
            ]);
          } else {
            setItKunnr([{ Sign: "", Option: "", Low: "", High: "" }]);
          }
        }
        break;
      case "mc_ItKunnr_hasta":
        setItKunnr_hasta(value);
        if (value.trim() != "") {
          if (ItKunnr_desde == "") {
            setItKunnr([
              { Sign: "I", Option: "EQ", Low: "", High: value },
            ]);
          } else {
            setItKunnr([
              {
                Sign: "I",
                Option: "BT",
                Low: ItKunnr_desde,
                High: value,
              },
            ]);
          }
        } else {
          if (ItKunnr_desde != "") {
            setItKunnr([
              { Sign: "I", Option: "EQ", Low: ItKunnr_desde, High: "" },
            ]);
          } else {
            setItKunnr([{ Sign: "", Option: "", Low: "", High: "" }]);
          }
        }
        break;
      case "mc_ItName1":
        setItName1([{ Sign: "I", Option: "EQ", Low: "", High: "" }]);
        break;
      case "mc_ItName1_desde":
        setItName1_desde(value);
        if (value.trim() != "") {
          if (ItName1_hasta == "") {
            setItName1([
              {
                Sign: "I",
                Option: "CP",
                Low: value,
                High: "",
              },
            ]);
          } else {
            setItName1([
              {
                Sign: "I",
                Option: "BT",
                Low: value,
                High: ItName1_hasta,
              },
            ]);
          }
        } else {
          if (ItName1_hasta != "") {
            setItName1([
              { Sign: "I", Option: "CP", Low: "", High: ItName1_hasta },
            ]);
          } else {
            setItName1([{ Sign: "", Option: "", Low: "", High: "" }]);
          }
        }
        break;
      case "mc_ItName1_hasta":
        setItName1_hasta(value);
        if (value.trim() != "") {
          if (ItName1_desde == "") {
            setItName1([
              {
                Sign: "I",
                Option: "CP",
                Low: "",
                High: value,
              },
            ]);
          } else {
            setItName1([
              {
                Sign: "I",
                Option: "BT",
                Low: ItName1_desde,
                High: value,
              },
            ]);
          }
        } else {
          if (ItName1_desde != "") {
            setItName1([
              { Sign: "I", Option: "CP", Low: ItName1_desde, High: "" },
            ]);
          } else {
            setItName1([{ Sign: "", Option: "", Low: "", High: "" }]);
          }
        }
        break;
      case "mc_ItStcd1":
        setItStcd1([{ Sign: "I", Option: "EQ", Low: "", High: "" }]);
        break;
      case "mc_ItStcd1_desde":
        setItStcd1_desde(value);
        if (value.trim() != "") {
          if (ItStcd1_hasta == "") {
            setItStcd1([
              { Sign: "I", Option: "EQ", Low: value, High: "" },
            ]);
          } else {
            setItStcd1([
              {
                Sign: "I",
                Option: "BT",
                Low: value,
                High: ItStcd1_hasta,
              },
            ]);
          }
        } else {
          if (ItKunnr_hasta != "") {
            setItStcd1([
              { Sign: "I", Option: "EQ", Low: "", High: ItStcd1_hasta },
            ]);
          } else {
            setItStcd1([{ Sign: "", Option: "", Low: "", High: "" }]);
          }
        }
        break;
      case "mc_ItStcd1_hasta":
        setItStcd1_hasta(value);
        if (value.trim() != "") {
          if (ItStcd1_desde == "") {
            setItStcd1([
              { Sign: "I", Option: "EQ", Low: "", High: value },
            ]);
          } else {
            setItStcd1([
              {
                Sign: "I",
                Option: "BT",
                Low: ItStcd1_desde,
                High: value,
              },
            ]);
          }
        } else {
          if (ItStcd1_desde != "") {
            setItStcd1([
              { Sign: "I", Option: "EQ", Low: ItStcd1_desde, High: "" },
            ]);
          } else {
            setItStcd1([{ Sign: "", Option: "", Low: "", High: "" }]);
          }
        }
        break;
      default:
        break;
    }
  }

  function Clear() {
    handleChange("mc_ItKunnr", "");
    setItKunnr_desde("");
    setItKunnr_hasta("");
    handleChange("mc_ItName1", "");
    setItName1_desde("");
    setItName1_hasta("");
    handleChange("mc_ItStcd1", "");
    setItStcd1_desde("");
    setItStcd1_hasta("");
  }

  return (
    <>
      {showcliente ? (
        <div
          className="container-modal-background"
          onClick={closeModal}
          ref={modalRef}
        >
          <div className="modal-wrapper modal-wrapper-bg">
            {ViewInfo ? (
              <>
                <section
                  className="row"
                  style={{ margin: "auto", paddingTop: "50px" }}
                >
                  <div className="col-sm-4 d-flex align-items-center">
                    <label>Cod. Cliente</label>
                  </div>
                  <div className="col-sm-4">
                    <InputForm
                      attribute={{
                        name: "mc_ItKunnr_desde",
                        type: "text",
                        value: ItKunnr_desde,
                        disabled: false,
                        checked: false,
                        matchcode: false,
                        maxlength:10
                      }}
                      handleChange={handleChange}
                    />
                  </div>
                  <div className="col-sm-4">
                    <InputForm
                      attribute={{
                        name: "mc_ItKunnr_hasta",
                        type: "text",
                        value: ItKunnr_hasta,
                        disabled: false,
                        checked: false,
                        matchcode: false,
                        maxlength:10
                      }}
                      handleChange={handleChange}
                    />
                  </div>

                  <div className="col-sm-4 d-flex align-items-center">
                    <label>Nombre Cliente</label>
                  </div>
                  <div className="col-sm-4">
                    <InputForm
                      attribute={{
                        name: "mc_ItName1_desde",
                        type: "text",
                        value: ItName1_desde,
                        disabled: false,
                        checked: false,
                        matchcode: false,
                        maxlength:35
                      }}
                      handleChange={handleChange}
                    />
                  </div>
                  <div className="col-sm-4">
                    <InputForm
                      attribute={{
                        name: "mc_ItName1_hasta",
                        type: "text",
                        value: ItName1_hasta,
                        disabled: false,
                        checked: false,
                        matchcode: false,
                        maxlength:35
                      }}
                      handleChange={handleChange}
                    />
                  </div>

                  <div className="col-sm-4 d-flex align-items-center">
                    <label>RUC</label>
                  </div>
                  <div className="col-sm-4">
                    <InputForm
                      attribute={{
                        name: "mc_ItStcd1_desde",
                        type: "text",
                        value: ItStcd1_desde,
                        disabled: false,
                        checked: false,
                        matchcode: false,
                        maxlength:16
                      }}
                      handleChange={handleChange}
                    />
                  </div>
                  <div className="col-sm-4">
                    <InputForm
                      attribute={{
                        name: "mc_ItStcd1_hasta",
                        type: "text",
                        value: ItStcd1_hasta,
                        disabled: false,
                        checked: false,
                        matchcode: false,
                        maxlength:16
                      }}
                      handleChange={handleChange}
                    />
                  </div>
                </section>
                <section>
                  <div style={{ margin: "10px" }}>
                    <BtnSearch
                      attribute={{ name: "Buscar", classNamebtn: "btn_search" }}
                      onClick={() => SearchCliente(1)}
                    />
                  </div>
                  <div style={{ margin: "10px" }}>
                    <BtnSearch
                      attribute={{
                        name: "Limpiar Campos",
                        classNamebtn: "btn_search",
                      }}
                      onClick={() => Clear()}
                    />
                  </div>
                </section>
                <section className="section-table-modal">
                  <div className="container-table responsive-table-all">
                    <table className="content-table ">
                      <thead>
                        <tr>
                          <th>Cod. Cliente</th>
                          <th>Nombre Cliente</th>
                          <th>N° ident. fiscal</th>
                          <th>Calle</th>
                          <th>País</th>
                        </tr>
                      </thead>
                      <tbody>
                        {responseCliente.etClientesField.map(
                          (response, key) => (
                            <tr
                              key={key}
                              onClick={() => clickcelda(response.kunnrField)}
                            >
                              <th>{response.kunnrField}</th>
                              <th style={{ textAlign: "left" }}>
                                {response.name1Field}
                              </th>
                              <th>{response.stcd1Field}</th>
                              <th style={{ textAlign: "left" }}>
                                {response.strasField}
                              </th>
                              <th style={{ textAlign: "left" }}>
                                {response.land1Field}
                              </th>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </section>
              </>
            ) : (
              <div>
                <Spinner />
              </div>
            )}

            <div>
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

export default Mc_Cliente_hasta;
