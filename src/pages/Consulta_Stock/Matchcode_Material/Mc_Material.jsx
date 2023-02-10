import React, { useRef, useEffect, useCallback, useState } from "react";
import InputForm from "../../../components/InputForm";
import BtnSearch from "../../../components/BtnSearch";
import Pagination from "../../../components/Pagination";
import { ConsStockMaterial } from "../../../Services/ServiceMaterial";
import Spinner from "../../../components/Spinner";
import Mc_Organiz_Ventas_Mat from "../Matchcode_Organiz_Ventas/Mc_Organiz_Ventas_Mat";
import jwt from "jwt-decode";

const Mc_Organiz_Ventas = ({
  showMcMaterial,
  setShowMcMaterial,
  setMcMaterial,
  McMaterial,
  setMcBuscaMaterial,
}) => {
  const [valid_orgvent, setvalid_orgvent] = useState(false);
  const [ViewInfo, setViewInfo] = useState(false);
  const [responseMaterial, setresponseMaterial] = useState({
    etMaterialesField: [],
  });
  const [OrganizVentasMat, setOrganizVentasMat] = useState("");
  const [CodProductoMat, setCodProductoMat] = useState("");
  const [NomProductoMat, setNomProductoMat] = useState("");

  const [ShowOrganizVentasMat, setShowOrganizVentasMat] = useState(false);

  const [spinner, setspinner] = useState(false);

  const [IsRegxpag] = useState(15); // cantidad de datos por página
  //NUMERO TOTAL DE DATOS
  const [TotalData, setTotalData] = useState();
  //ACTIVAR SECCION DE PAGINADO
  const [valuepagination, setvaluepagination] = useState(false);

  const modalRef = useRef();

  const closeModal = (e) => {
    if (modalRef.current === e.target) {
      setShowMcMaterial(false);
    }
  };

  const keyPress = useCallback(
    (e) => {
      if (e.key === "Escape" && showMcMaterial) {
        setShowMcMaterial(false);
      }
    },
    [setShowMcMaterial, showMcMaterial]
  );

  useEffect(() => {
    if (showMcMaterial == true) {
      setViewInfo(false);
      setOrganizVentasMat("");
      setCodProductoMat("");
      setNomProductoMat("");
      setresponseMaterial({ etMaterialesField: [] });
      setTotalData();
      // searchMaterial(1)
    }

    //--------------------- para actualizar valor org_ventas
    if (McMaterial != "") {
      setMcBuscaMaterial([
        {
          Sign: "I",
          Option: "EQ",
          Low: McMaterial,
          High: "",
        },
      ]);
    } else {
      setMcBuscaMaterial([{ Sign: "", Option: "", Low: "", High: "" }]);
    }
    //---------------------

    document.addEventListener("keydown", keyPress);
    return () => document.removeEventListener("keydown", keyPress);
  }, [keyPress]);

  function searchMaterial(nro_pag) {
    setresponseMaterial({ etMaterialesField: [] });
    // if (OrganizVentasMat === "") {
    //   setvalid_orgvent(true);
    // } else {
      setvalid_orgvent(false);
      setspinner(true);
      let model_material = {
        IsNpag: nro_pag,
        IsRegxpag: IsRegxpag,
        IsNameProduct: NomProductoMat,
        IsOrgventas: OrganizVentasMat,
        IsProduct: CodProductoMat,
        IsUser: jwt(localStorage.getItem("_token")).username,
      };

      ConsStockMaterial(model_material).then((result) => {
        setresponseMaterial(result);
        setTotalData(result.esRegtotField);
        setViewInfo(true);
        setspinner(false);
        setvaluepagination(true);
      });
    // }
  }

  // seleccionar pagina
  function changePage(pageNumber) {
    searchMaterial(pageNumber);
  }
  // siguiente pagina
  function prevPage(value) {
    searchMaterial(value - 1);
  }
  //pagina anterior
  function nextPage(value) {
    searchMaterial(value + 1);
  }

  function handleChange(name, value) {
    switch (name) {
      //documento comercial
      case "organizVentasMat":
        setOrganizVentasMat(value);
        break;
      case "codProductoMat":
        setCodProductoMat(value);
        break;
      case "nomProductoMat":
        setNomProductoMat(value);
        break;
      default:
        break;
    }
  }

  function Clear() {
    setOrganizVentasMat("");
    setCodProductoMat("");
    setNomProductoMat("");
  }

  function mcOrganizVentasMat() {
    setShowOrganizVentasMat((prev) => !prev);
  }

  function clickcelda(vkorgField) {
    setMcMaterial(vkorgField);
    setShowMcMaterial((prev) => !prev);
  }

  return (
    <>
      {showMcMaterial ? (
        <div
          className="container-modal-background"
          onClick={closeModal}
          ref={modalRef}
        >
          <Mc_Organiz_Ventas_Mat
            showMcOrganizVentasMat={ShowOrganizVentasMat}
            setShowMcOrganizVentasMat={setShowOrganizVentasMat}
            setMcOrganizVentasMat={setOrganizVentasMat}
            McOrganizVentasMat={OrganizVentasMat}
          />

          <div className="modal-wrapper modal-wrapper-sm">
            <div>
              <section
                className="row"
                style={{ margin: "auto", paddingTop: "50px" }}
              >
                <div className="col-sm-4 d-flex align-items-center">
                  <label>Organiz. ventas</label>
                </div>
                <div className="col-sm-8">
                  <InputForm
                    attribute={{
                      name: "organizVentasMat",
                      type: "text",
                      value: OrganizVentasMat,
                      disabled: false,
                      checked: false,
                      matchcode: true,
                      maxlength: 4,
                    }}
                    handleChange={handleChange}
                    onClick={() => mcOrganizVentasMat()}
                  />
                </div>

                <div className="col-sm-4 d-flex align-items-center">
                  <label>Código Producto</label>
                </div>
                <div className="col-sm-8">
                  <InputForm
                    attribute={{
                      name: "codProductoMat",
                      type: "text",
                      value: CodProductoMat,
                      disabled: false,
                      checked: false,
                      matchcode: false,
                      maxlength: 30,
                    }}
                    handleChange={handleChange}
                  />
                </div>

                <div className="col-sm-4 d-flex align-items-center">
                  <label>Nombre Producto</label>
                </div>
                <div className="col-sm-8">
                  <InputForm
                    attribute={{
                      name: "nomProductoMat",
                      type: "text",
                      value: NomProductoMat,
                      disabled: false,
                      checked: false,
                      matchcode: false,
                      maxlength: 40,
                    }}
                    handleChange={handleChange}
                  />
                </div>
              </section>
              {valid_orgvent ? (
                <div style={{color:"red", textAlign:"center"}}>La Organización de ventas es obligatoria.</div>
              ) : null}

              <div style={{ margin: "10px" }}>
                <BtnSearch
                  attribute={{ name: "Buscar", classNamebtn: "btn_search" }}
                  onClick={() => searchMaterial(1)}
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
              <section className="section-table-modal">
                <div className="container-table responsive-table-all">
                  <table className="content-table ">
                    <thead>
                      <tr>
                        <th>Cod. Producto</th>
                        <th>Nombre de Producto</th>
                        {/* <th>Organiz. ventas</th> */}
                      </tr>
                    </thead>

                    <tbody>
                      <tr>
                        <td
                          colSpan="3"
                          style={
                            spinner === true
                              ? { display: "table-cell" }
                              : { display: "none" }
                          }
                        >
                          {spinner && <Spinner />}
                        </td>
                      </tr>
                      {responseMaterial.etMaterialesField.length >= 1
                        ? responseMaterial.etMaterialesField.map(
                            (response, key) => (
                              <tr
                                key={key}
                                onClick={() => clickcelda(response.matnrField)}
                              >
                                <th style={{textAlign:"center"}}>{response.matnrField}</th>
                                <th style={{textAlign:"center"}}>{response.maktxField}</th>
                                {/* <th>{response.vkorgField}</th> */}
                              </tr>
                            )
                          )
                        : null}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>

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
              onClick={() => setShowMcMaterial((prev) => !prev)}
            >
              <i className="fas fa-times"></i>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Mc_Organiz_Ventas;
