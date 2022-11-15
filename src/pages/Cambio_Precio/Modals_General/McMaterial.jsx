import React, { useCallback, useEffect, useRef, useState } from "react";
import InputForm from "../../../components/InputForm";
import BtnSearch from "../../../components/BtnSearch";
import McOrgVentas from "./McOrgVentas";
import { ConsStockMaterial } from "../../../Services/ServiceMaterial";
import jwt from "jwt-decode";
import Spinner from "../../../components/Spinner";
import Pagination from "../../../components/Pagination";
import {
  DetalleMaterialSAP,
  MatchMaterial,
} from "../../../Services/ServiceCambioPrecio";

const McMaterial = ({
  showMcMaterial,
  setShowMcMaterial,
  setMaterial,
  orgVentas,
  cliente,
}) => {
  const [IsRegxpag] = useState(15); // cantidad de datos por página
  const [CodProductoMat, setCodProductoMat] = useState("");
  const [NomProductoMat, setNomProductoMat] = useState("");

  const [ViewInfo, setViewInfo] = useState(false);
  const [responseMaterial, setresponseMaterial] = useState({
    etMaterialesField: [],
  });

  //NUMERO TOTAL DE DATOS
  const [TotalData, setTotalData] = useState();
  //ACTIVAR SECCION DE PAGINADO
  const [valuepagination, setvaluepagination] = useState(false);
  const [spinner, setspinner] = useState(false);

  // ORG VENTAS
  // const [orgVentasValue, setOrgVentasValue] = useState(org_ventas);
  // const [orgVentas, setOrgVentas] = useState([
  //   { Sign: "I", Option: "EQ", Low: "", High: "" },
  // ]);
  // const [showOrgVentas, setShowOrgVentas] = useState(false);

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
      // setOrgVentasValue("");
      setCodProductoMat("");
      setNomProductoMat("");
    }
  }, [showMcMaterial]);

  useEffect(() => {
    setresponseMaterial({ etMaterialesField: [] });
    setTotalData();
    document.addEventListener("keydown", keyPress);
    return () => document.removeEventListener("keydown", keyPress);
  }, [keyPress]);

  // const openMcOrgVentas = () => {
  //   setShowOrgVentas((prev) => !prev);
  // };

  function searchMaterial(nro_pag) {
    setresponseMaterial({ etMaterialesField: [] });
    setspinner(true);
    let model_material = {
      IsNpag: nro_pag,
      IsRegxpag: IsRegxpag,
      IsNameMatnr: NomProductoMat,
      IsVkorg: orgVentas,
      IsMatnr: CodProductoMat,
      IsUser: jwt(localStorage.getItem("_token")).username,
    };
    console.log(model_material);
    MatchMaterial(model_material).then((result) => {
      // console.log(result);
      setresponseMaterial(result);
      setTotalData(result.esRegtotField);
      setViewInfo(true);
      setspinner(false);
      setvaluepagination(true);
    });
  }

  function Clear() {
    // setOrgVentasValue("");
    setCodProductoMat("");
    setNomProductoMat("");
  }

  function clickcelda(material) {
    setspinner(true);
    let model = {
      IsKunnr: cliente,
      IsVkorg: orgVentas,
      ItMatnr: [
        {
          Sign: "I",
          Option: "EQ",
          Low: CodProductoMat,
          High: "",
        },
      ],
    };
    console.log(model);
    DetalleMaterialSAP(model).then((result) => {
      console.log(result);
      setMaterial((prevState) => ({
        ...prevState,
        cod_mat: Number(material.matnrField).toString(),
        name_mat: material.maktxField,
        centro: material.werksField,
        moneda: result.etMaterialesField[0].konwaField,
        prec_act: result.etMaterialesField[0].kbetrField,
        fec_ini: result.etMaterialesField[0].databField,
        fec_fin: result.etMaterialesField[0].datbiField,
        lim_inf: result.etMaterialesField[0].kbetrField - 1,
        lim_sup: 999999999.99,
        margen: 0.0,
        uni_med: material.meinsField,
        cant_base: result.etMaterialesField[0].kpeinField,
      }));
      setspinner(false);
      setShowMcMaterial((prev) => !prev);
    });
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
      case "organizVentasMat":
        // setOrgVentasValue(value);
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

  return (
    <>
      {showMcMaterial ? (
        <div
          className="container-modal-background"
          onClick={closeModal}
          ref={modalRef}
        >
          {/* <McOrgVentas
            orgVentasValue={orgVentasValue}
            setOrgVentas={setOrgVentas}
            setOrgVentasValue={setOrgVentasValue}
            setShowOrgVentas={setShowOrgVentas}
            showOrgVentas={showOrgVentas}
          /> */}
          <div className="modal-wrapper modal-wrapper-sm">
            <section
              className="row"
              style={{ margin: "auto", paddingTop: "50px" }}
            >
              {/* <div className="col-sm-4 d-flex align-items-center">
                <label>Organiz. ventas</label>
              </div>
              <div className="col-sm-8">
                <InputForm
                  attribute={{
                    name: "organizVentasMat",
                    type: "text",
                    value: orgVentasValue,
                    disabled: false,
                    checked: false,
                    matchcode: true,
                    maxlength: 4,
                  }}
                  handleChange={handleChange}
                  onClick={() => openMcOrgVentas()}
                />
              </div> */}

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
                    maxlength: 18,
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
                    maxlength: 15,
                  }}
                  handleChange={handleChange}
                />
              </div>
            </section>
            <section>
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
            </section>
            <section className="section-table-modal">
              <div className="container-table responsive-table-all">
                <table className="content-table ">
                  <thead>
                    <tr>
                      <th>Cod. Producto</th>
                      <th>Centro</th>
                      <th>Nombre de Producto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {responseMaterial.etMaterialesField.map((response, key) => (
                      <tr
                        key={key}
                        onClick={() => {
                          clickcelda(response);
                        }}
                      >
                        <th style={{ textAlign: "center" }}>
                          {Number(response.matnrField)}
                        </th>
                        <th style={{ textAlign: "center" }}>
                          {response.werksField}
                        </th>
                        <th style={{ textAlign: "center" }}>
                          {response.maktxField}
                        </th>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {spinner && <Spinner />}
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

export default McMaterial;
