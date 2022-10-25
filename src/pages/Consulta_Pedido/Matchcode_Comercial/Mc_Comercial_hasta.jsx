import React, { useCallback, useEffect, useRef, useState } from "react";
import Pagination from "../../../components/Pagination";
import Spinner from "../../../components/Spinner";
import { Comercial } from "../../../Services/ServiceComercial";
import BtnSearch from "../../../components/BtnSearch";
import InputForm from "../../../components/InputForm";

const Mc_Comercial_hasta = ({
  showcomercial,
  setshowcomercial,
  setcomercial_hasta,
  comercial_hasta,
  comercial_desde,
  setcomercial,
  setcomercial_hasta_value
}) => {
  const [codigo_input, setcodigo_input] = useState("");
  const [descripcion_input, setdescripcion_input] = useState("");
  const [IsRegxpag] = useState(15); // cantidad de datos por página
  const [ViewInfo, setViewInfo] = useState(false);
  //NUMERO TOTAL DE DATOS
  const [TotalData, setTotalData] = useState();
  //ACTIVAR SECCION DE PAGINADO
  const [valuepagination, setvaluepagination] = useState(false);
  const modalRef = useRef();
  const [responseComercial, setresponseComercial] = useState({
    etComercialesField: [],
  });
  const closeModal = (e) => {
    if (modalRef.current === e.target) {
      setshowcomercial(false);
    }
  };
  const keyPress = useCallback(
    (e) => {
      if (e.key === "Escape" && showcomercial) {
        setshowcomercial(false);
      }
    },
    [setshowcomercial, showcomercial]
  );

  useEffect(() => {
    setresponseComercial({ etComercialesField: [] });
    setViewInfo(true);
    //--------------------- para actualizar valor org_ventas
    if (comercial_hasta != "") {
      if (comercial_desde == "") {
        setcomercial([
          {
            Sign: "I",
            Option: "EQ",
            Low: "",
            High: comercial_hasta,
          },
        ]);
      } else {
        setcomercial([
          {
            Sign: "I",
            Option: "BT",
            Low: comercial_desde,
            High: comercial_hasta,
          },
        ]);
      }
    } else {
      if (comercial_desde != "") {
        setcomercial([{ Sign: "I", Option: "EQ", Low: comercial_desde, High: "" }]);
      } else {
        setcomercial([{ Sign: "", Option: "", Low: "", High: "" }]);
      }
    }
    //---------------------
    document.addEventListener("keydown", keyPress);
    setcodigo_input("");
    setdescripcion_input("");
    return () => document.removeEventListener("keydown", keyPress);
  }, [keyPress]);

    useEffect(() => {
        setTotalData("");
        //SearchComercial(1);
    }, [showcomercial]);

    function clickcelda(pernrField, nameField) {
        setcomercial_hasta(pernrField);
        setcomercial_hasta_value(nameField)
        setshowcomercial((prev) => !prev);
      }

  function SearchComercial(page){
    setTotalData("");
    setresponseComercial({ etComercialesField: [] });
    let model = {
        IsNpag: page,
        IsRegxpag: IsRegxpag,
        IsPernr:"",
        IsName:""
    }
    if (showcomercial == true && (codigo_input!="" || descripcion_input!="")){
        setViewInfo(false);
        Comercial(model).then((result)=>{
            setresponseComercial(result);
            setTotalData(result.esRegtotField);
            setViewInfo(true);
            setvaluepagination(true);
        })
    }
  }

  // seleccionar pagina
  function changePage(pageNumber) {
    SearchComercial(pageNumber);
  }
  // siguiente pagina
  function prevPage(value) {
    SearchComercial(value - 1);
  }
  //pagina anterior
  function nextPage(value) {
    SearchComercial(value + 1);
  }
  function handleChange(name, value) {
    switch (name) {
      case "codigo_input":
        setcodigo_input(value);
        break;
      case "descripcion_input":
        setdescripcion_input(value);
        break;
      default:
        break;
    }
  }

  return (
    <React.Fragment>
      {showcomercial ? (
        <div
          className="container-modal-background"
          onClick={closeModal}
          ref={modalRef}
        >
          <div className="modal-wrapper modal-wrapper-bg">
            {ViewInfo ? (
              <React.Fragment>
                <section className="row"
                  style={{ margin: "auto", paddingTop: "50px" }}>
                  <div className="col-sm-4 d-flex align-items-center">
                    <label>Código</label>
                  </div>
                  <div className="col-sm-8">
                    <InputForm
                      attribute={{
                        name: "codigo_input",
                        type: "text",
                        value: codigo_input,
                        disabled: false,
                        checked: false,
                        matchcode: false,
                        maxlength:10
                      }}
                      handleChange={handleChange}
                    />
                  </div>

                  <div className="col-sm-4 d-flex align-items-center">
                    <label>Descripción</label>
                  </div>
                  <div className="col-sm-8">
                    <InputForm
                      attribute={{
                        name: "descripcion_input",
                        type: "text",
                        value: descripcion_input,
                        disabled: false,
                        checked: false,
                        matchcode: false,
                        maxlength:10
                      }}
                      handleChange={handleChange}
                    />
                  </div>
                </section>
                <section>
                  <div style={{ margin: "10px" }}>
                    <BtnSearch
                      attribute={{ name: "Buscar", classNamebtn: "btn_search" }}
                      onClick={() => SearchComercial(1)}
                    />
                  </div>
                </section>
                <section className="section-table-modal">
                    <div className="container-table responsive-table-all">
                        <table className="content-table ">
                            <thead>
                                <tr>
                                    <th style={{ textAlign: "left" }}>Código</th>
                                    <th style={{ textAlign: "left" }}>Denominación</th>
                                </tr>
                            </thead>
                            <tbody>
                            {responseComercial.etComercialesField.map(
                                (response, key) => (
                                    <tr
                                    key={key}
                                    onClick={() => clickcelda(response.pernrField, response.nameField)}
                                    >
                                        <th style={{ textAlign: "left" }}>{response.pernrField}</th>
                                        <th style={{ textAlign: "left" }}>
                                            {response.nameField}
                                        </th>
                                    </tr>
                                )
                            )}
                            </tbody>
                        </table>
                    </div>
                </section>
              </React.Fragment>
            ) : (
              <div>
                <Spinner />
              </div>
            )}
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
              onClick={() => setshowcomercial((prev) => !prev)}
            >
              <i className="fas fa-times"></i>
            </div>
          </div>
        </div>
      ) : null}
    </React.Fragment>
  );
};

export default Mc_Comercial_hasta;
