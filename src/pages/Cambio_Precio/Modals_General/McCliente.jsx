import React, { useEffect, useRef, useState } from "react";
import InputForm from "../../../components/InputForm";
import BtnSearch from "../../../components/BtnSearch";
import Pagination from "../../../components/Pagination";
import Spinner from "../../../components/Spinner";
import jwt from "jwt-decode";
import { MatchCliente } from "../../../Services/ServiceCambioPrecio";

const McCliente = ({
  showMcCliente,
  setShowMcCliente,
  IsCliente,
  setIsCliente,
  setIsClientName,
  orgVentasValue,
  setCanalDistValue,
}) => {
  const [IsName1, setIsName1] = useState("");
  const [IsStcd1, setIsStcd1] = useState("");
  const [responsemcdeucli_cliente, setresponsemcdeucli_cliente] = useState({
    etClientesField: [],
  });
  //NUMERO TOTAL DE DATOS
  const [TotalData, setTotalData] = useState();
  //ACTIVAR SECCION DE PAGINADO
  const [valuepagination, setvaluepagination] = useState(false);
  const [IsRegxpag] = useState(15); // cantidad de datos por página
  //CARGA DE SPINNER
  const [spinner, setspinner] = useState(false);
  const modalRef = useRef();
  const closeModal = (e) => {
    if (modalRef.current === e.target) {
      setShowMcCliente(false);
    }
  };
  useEffect(() => {
    if (showMcCliente == true) {
      setIsCliente("");
      setIsName1("");
      setIsStcd1("");
      setresponsemcdeucli_cliente({ etClientesField: [] });
      setTotalData();
    }
  }, [showMcCliente]);

  function Search(nro_pag) {
    setspinner(true);
    setresponsemcdeucli_cliente({ etClientesField: [] });
    let model = {
      IsKunnr: IsCliente,
      IsName1: IsName1,
      IsNpag: nro_pag,
      IsRegxpag: IsRegxpag,
      IsStcd1: IsStcd1,
      IsUser: jwt(localStorage.getItem("_token")).username,
      IsVkorg: orgVentasValue,
    };
    console.log(model);
    MatchCliente(model).then((result) => {
      setTotalData(result.esRegtotField);
      setresponsemcdeucli_cliente(result);
      setspinner(false);
      setvaluepagination(true);
    });
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
  function handleChange(name, value) {
    switch (name) {
      case "mc_deucli_cliente":
        setIsCliente(value);
        break;
      case "mc_deucli_razonsocial":
        setIsName1(value);
        break;
      case "mc_deucli_ruc":
        setIsStcd1(value);
        break;
      default:
        break;
    }
  }

  function Clear() {
    setIsCliente("");
    setIsName1("");
    setIsStcd1("");
  }

  // seleccionar pagina
  function changePage(pageNumber) {
    Search(pageNumber);
  }
  // siguiente pagina
  function prevPage(value) {
    Search(value - 1);
  }
  //pagina anterior
  function nextPage(value) {
    Search(value + 1);
  }

  function clickcelda(item) {
    console.log(item);
    setIsCliente(item.kunnrField);
    setIsClientName(item.name1Field);
    setCanalDistValue(item.vtwegField);
    setShowMcCliente((prev) => !prev);
  }

  return (
    <>
      {showMcCliente ? (
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
              <div className="col-sm-3 d-flex align-items-center">
                <label>Cod. Cliente</label>
              </div>
              <div className="col-sm-9">
                <InputForm
                  attribute={{
                    name: "mc_deucli_cliente",
                    type: "text",
                    value: IsCliente,
                    disabled: false,
                    checked: false,
                    matchcode: false,
                    maxlength: 10,
                  }}
                  handleChange={handleChange}
                />
              </div>

              <div className="col-sm-3 d-flex align-items-center">
                <label>Nombre Cliente</label>
              </div>
              <div className="col-sm-9">
                <InputForm
                  attribute={{
                    name: "mc_deucli_razonsocial",
                    type: "text",
                    value: IsName1,
                    disabled: false,
                    checked: false,
                    matchcode: false,
                    maxlength: 35,
                  }}
                  handleChange={handleChange}
                />
              </div>

              <div className="col-sm-3 d-flex align-items-center">
                <label>RUC</label>
              </div>
              <div className="col-sm-9">
                <InputForm
                  attribute={{
                    name: "mc_deucli_ruc",
                    type: "text",
                    value: IsStcd1,
                    disabled: false,
                    checked: false,
                    matchcode: false,
                    maxlength: 16,
                  }}
                  handleChange={handleChange}
                />
              </div>
            </section>
            <section className="col-md-12">
              <div style={{ margin: "10px" }}>
                <BtnSearch
                  attribute={{ name: "Buscar", classNamebtn: "btn_search" }}
                  onClick={() => Search(1)}
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
            <div className="container-table-600" style={{ margin: "15px" }}>
              <table className="content-table">
                <thead>
                  <tr>
                    <th>Cod. Cliente</th>
                    <th>Nombre Cliente</th>
                    <th>Zona del Cliente</th>
                    <th>R.U.C.</th>

                    {/* <th>Canal distrib.</th> */}
                    {/* <th>Sector</th> */}
                    {/* <th>USD Línea Cred. Disp</th> */}
                    {/* <th>Tiene Doc. Vencidos</th> */}
                  </tr>
                </thead>
                <tbody>
                  {responsemcdeucli_cliente.etClientesField.map(
                    (response, key) => (
                      <tr key={key} onClick={() => clickcelda(response)}>
                        <th style={{ textAlign: "center" }}>
                          {response.kunnrField}
                        </th>
                        <th style={{ textAlign: "center" }}>
                          {response.name1Field}
                        </th>
                        <th style={{ textAlign: "center" }}>
                          {response.zonaField}
                        </th>
                        <th style={{ textAlign: "center" }}>
                          {response.stcd1Field}
                        </th>
                        {/* <th style={{textAlign:'center'}} align={"center"}>{response.vtwegField}</th> */}
                        {/* <th style={{textAlign:'center'}} align={"center"}>{response.spartField}</th> */}
                        {/* <th style={{ textAlign: "center" }}>
                          {convertDecimal(response.klimkField)}
                        </th> */}
                        {/* <th style={{textAlign:'left'}} align={"left"}>{response.docValField}</th> */}
                      </tr>
                    )
                  )}
                </tbody>
              </table>
              {spinner && <Spinner />}
            </div>
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
              onClick={() => setShowMcCliente((prev) => !prev)}
            >
              <i className="fas fa-times"></i>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default McCliente;
