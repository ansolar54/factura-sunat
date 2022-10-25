import React, { useRef, useEffect, useCallback, useState } from "react";
import { Mc_InfoCliente_Cliente } from "../../../Services/ServiceCliente";
import Pagination from "../../../components/Pagination";
import InputForm from "../../../components/InputForm";
import BtnSearch from "../../../components/BtnSearch";
import Spinner from "../../../components/Spinner";
import jwt from "jwt-decode";

const Matchcode_InfoCliente = ({
  showmc_infocliente,
  setshowmc_infocliente,
  setPKunnr,
  PKunnr,
  setetClientesField,
}) => {
  const [IsRegxpag] = useState(15); // cantidad de datos por página

  // const [PKunnr, setPKunnr] = useState("");
  const [IsName1, setIsName1] = useState("");
  const [IsStcd1, setIsStcd1] = useState("");
//CARGA DE SPINNER
const [spinner, setspinner] = useState(false);
  const [response_mc_cliente, setresponse_mc_cliente] = useState({
    esRegtotField: "",
    etClientesField: [],
  });
  //NUMERO TOTAL DE DATOS
  const [TotalData, setTotalData] = useState();
  //ACTIVAR SECCION DE PAGINADO
  const [valuepagination, setvaluepagination] = useState(false);

  const modalRef = useRef();

  useEffect(()=>{
    if(showmc_infocliente==true){
      setPKunnr("");
      setIsName1("");
      setIsStcd1("");
      setresponse_mc_cliente({etClientesField:[]});
    }
    
  },[showmc_infocliente]);

  const closeModal = (e) => {
    if (modalRef.current === e.target) {
      setshowmc_infocliente(false);
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
    setPKunnr("");
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
      IsNpag: page,
      IsRegxpag: IsRegxpag,
      IsStcd1: IsStcd1,
      IsUser: jwt(localStorage.getItem("_token")).username,
      IsDuplicate:''
    };

    Mc_InfoCliente_Cliente(modal_mc_infocliente_cliente).then((result) => {
      setresponse_mc_cliente(result);
    
      setTotalData(result.esRegtotField);
      setspinner(false);
      setvaluepagination(true);
    });
  }

  function clickcelda(value) {
    setPKunnr(value.kunnrField);
    setetClientesField(value);
    setshowmc_infocliente((prev) => !prev);
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
      {showmc_infocliente ? (
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
                    maxlength:10
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
                    maxlength:35
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
                    maxlength:16
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
                      <th>Cod. Cliente</th>
                      <th>Nombre Cliente</th>
                      <th>Zona del Cliente</th>
                      <th>RUC</th>

                      {/* <th>Canal distrib.</th> */}
                      {/* <th>Sector</th> */}
                      <th>USD Línea Cred. Disp</th>
                      {/* <th>Tiene Doc. vencidos</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {
                      response_mc_cliente.etClientesField.length>=1 ?
                    response_mc_cliente.etClientesField.map(
                      (response, key) => (
                        <tr key={key} onClick={() => clickcelda(response)}>
                          <th style={{textAlign:"center"}}>{response.kunnrField}</th>
                          <th style={{textAlign:"center"}}>{response.name1Field}</th>
                          <th style={{textAlign:"center"}}>{response.zonaField}</th>
                          <th style={{textAlign:"center"}}>{response.stcd1Field}</th>
                          {/* <th style={{textAlign:"center"}}>{response.vtwegField}</th> */}
                          {/* <th style={{textAlign:"center"}}>{response.spartField}</th> */}
                          <th style={{textAlign:"end"}}>{convertDecimal(response.klimkField)}</th>
                          {/* <th style={{textAlign:"center"}}>{response.docValField}</th> */}
                        </tr>
                      )
                    ):null
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
              onClick={() => setshowmc_infocliente((prev) => !prev)}
            >
              <i className="fas fa-times"></i>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Matchcode_InfoCliente;
