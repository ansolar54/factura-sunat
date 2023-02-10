import React, { useRef, useEffect, useCallback, useState } from "react";
import { ConsStockMaterial, Material } from "../../../Services/ServiceMaterial";
import Spinner from "../../../components/Spinner";
import Pagination from "../../../components/Pagination";
import InputForm from "../../../components/InputForm";
import BtnSearch from "../../../components/BtnSearch";
import "./Mc_Material_desde.css";
import Mc_Organiz_Ventas_Mat from "../../Consulta_Stock/Matchcode_Organiz_Ventas/Mc_Organiz_Ventas_Mat";
import jwt from "jwt-decode";

const Mc_Material_desde = ({
  showmaterial,
  setshowmaterial,
  setmaterial_desde,
  material_desde,
  material_hasta,
  setmaterial,
}) => {
  const [IsRegxpag] = useState(15); // cantidad de datos por página

  const [ItMatnr, setItMatnr] = useState([
    { Sign: "", Option: "", Low: "", High: "" },
  ]);
  const [ItMatnr_desde, setItMatnr_desde] = useState("");
  const [ItMatnr_hasta, setItMatnr_hasta] = useState("");

  const [ItMaktx, setItMaktx] = useState([
    { Sign: "", Option: "", Low: "", High: "" },
  ]);
  const [ItMaktx_desde, setItMaktx_desde] = useState("");
  const [ItMaktx_hasta, setItMaktx_hasta] = useState("");

  const [ViewInfo, setViewInfo] = useState(false);
  const [responseMaterial, setresponseMaterial] = useState({
    etMaterialesField: [],
  });
  //NUMERO TOTAL DE DATOS
  const [TotalData, setTotalData] = useState();
  //ACTIVAR SECCION DE PAGINADO
  const [valuepagination, setvaluepagination] = useState(false);
  const modalRef = useRef();
  //NUEVO----
  const [OrganizVentasMat, setOrganizVentasMat] = useState("");
  const [CodProductoMat, setCodProductoMat] = useState("");
  const [NomProductoMat, setNomProductoMat] = useState("");
  const [ShowOrganizVentasMat, setShowOrganizVentasMat] = useState(false);
  const [spinner, setspinner] = useState(false);
  //-------
  const closeModal = (e) => {
    if (modalRef.current === e.target) {
      setshowmaterial(false);
    }
  };

  const keyPress = useCallback(
    (e) => {
      if (e.key === "Escape" && showmaterial) {
        setshowmaterial(false);
      }
    },
    [setshowmaterial, showmaterial]
  );
  useEffect(() => {
    if(showmaterial==true){
      setOrganizVentasMat("");
      setCodProductoMat("");
      setNomProductoMat("");
    }
    
  }, [showmaterial])
  useEffect(() => {
    setItMatnr([{ Sign: "", Option: "", Low: "", High: "" }]);
    setItMatnr_desde("");
    setItMatnr_hasta("");
    setresponseMaterial({ etMaterialesField: [] });
    setTotalData();
    // searchMaterial(1);
    //--------------------- para actualizar valor org_ventas
    if (material_desde != "") {
      if (material_hasta == "") {
        setmaterial([
          {
            Sign: "I",
            Option: "EQ",
            Low: material_desde,
            High: "",
          },
        ]);
      } else {
        setmaterial([
          {
            Sign: "I",
            Option: "BT",
            Low: material_desde,
            High: material_hasta,
          },
        ]);
      }
    } else {
      if (material_hasta != "") {
        setmaterial([
          { Sign: "I", Option: "EQ", Low: "", High: material_hasta },
        ]);
      } else {
        setmaterial([{ Sign: "", Option: "", Low: "", High: "" }]);
      }
    }
    //---------------------
    document.addEventListener("keydown", keyPress);
    return () => document.removeEventListener("keydown", keyPress);
  }, [keyPress]);

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

  //   function Searchmaterial(page) {
  //     let EstructuraMaterial = {
  //       IsNpag: page,
  //       IsRegxpag: IsRegxpag,
  //       ItMaktx: ItMaktx,
  //       ItMatnr: ItMatnr,
  //     };

  //     if (showmaterial == true) {
  //       setViewInfo(false);
  //       Material(EstructuraMaterial).then((result) => {
  //         setresponseMaterial(result);
  //         setTotalData(result.esRegtotField);
  //         setViewInfo(true);
  //         setvaluepagination(true);
  //       });
  //     }
  //   }

  function searchMaterial(nro_pag) {
    setresponseMaterial({ etMaterialesField: [] });
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
    // setresponseMaterial({ etMaterialesField: [] });
    // setspinner(true);
    // let EstructuraMaterial = {
    //   IsNpag: nro_pag,
    //   IsRegxpag: IsRegxpag,
    //   ItMaktx: ItMaktx,
    //   ItMatnr: ItMatnr,
    // };

    // if (showmaterial == true) {
    //   setViewInfo(false);

    //   Material(EstructuraMaterial).then((result) => {
       
    //     setresponseMaterial(result);
    //     setTotalData(result.esRegtotField);
    //     setViewInfo(true);
    //     setspinner(false);
    //     setvaluepagination(true);
    //   });
    // }
  }

  function mcOrganizVentasMat() {
    setShowOrganizVentasMat((prev) => !prev);
  }

  function clickcelda(kunnrField) {
    setmaterial_desde(kunnrField);
    setshowmaterial((prev) => !prev);
  }

  function handleChange(name, value) {
    switch (name) {
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
      //   case "mc_ItMatnr_desde":
      //     setItMatnr_desde(value.trim());
      //     if (value.trim() != "") {
      //       if (ItMatnr_hasta == "") {
      //         setItMatnr([
      //           { Sign: "I", Option: "EQ", Low: value.trim(), High: "" },
      //         ]);
      //       } else {
      //         setItMatnr([
      //           {
      //             Sign: "I",
      //             Option: "BT",
      //             Low: value.trim(),
      //             High: ItMatnr_hasta,
      //           },
      //         ]);
      //       }
      //     } else {
      //       if (ItMatnr_hasta != "") {
      //         setItMatnr([
      //           { Sign: "I", Option: "EQ", Low: "", High: ItMatnr_hasta },
      //         ]);
      //       } else {
      //         setItMatnr([{ Sign: "", Option: "", Low: "", High: "" }]);
      //       }
      //     }
      //     break;
      //   case "mc_ItMatnr_hasta":
      //     setItMatnr_hasta(value.trim());
      //     if (value.trim() != "") {
      //       if (ItMatnr_desde == "") {
      //         setItMatnr([
      //           { Sign: "I", Option: "EQ", Low: "", High: value.trim() },
      //         ]);
      //       } else {
      //         setItMatnr([
      //           {
      //             Sign: "I",
      //             Option: "BT",
      //             Low: ItMatnr_desde,
      //             High: value.trim(),
      //           },
      //         ]);
      //       }
      //     } else {
      //       if (ItMatnr_desde != "") {
      //         setItMatnr([
      //           { Sign: "I", Option: "EQ", Low: ItMatnr_desde, High: "" },
      //         ]);
      //       } else {
      //         setItMatnr([{ Sign: "", Option: "", Low: "", High: "" }]);
      //       }
      //     }
      //     break;
      //   case "mc_ItMaktx_desde":
      //     setItMaktx_desde(value.trim());
      //     if (value.trim() != "") {
      //       if (ItMaktx_hasta == "") {
      //         setItMaktx([
      //           { Sign: "I", Option: "CP", Low: value.trim(), High: "" },
      //         ]);
      //       } else {
      //         setItMaktx([
      //           {
      //             Sign: "I",
      //             Option: "BT",
      //             Low: value.trim(),
      //             High: ItMaktx_hasta,
      //           },
      //         ]);
      //       }
      //     } else {
      //       if (ItMaktx_hasta != "") {
      //         setItMaktx([
      //           { Sign: "I", Option: "CP", Low: "", High: ItMaktx_hasta },
      //         ]);
      //       } else {
      //         setItMaktx([{ Sign: "", Option: "", Low: "", High: "" }]);
      //       }
      //     }
      //     break;
      //   case "mc_ItMaktx_hasta":
      //     setItMaktx_hasta(value.trim());
      //     if (value.trim() != "") {
      //       if (ItMaktx_desde == "") {
      //         setItMaktx([
      //           { Sign: "I", Option: "CP", Low: "", High: value.trim() },
      //         ]);
      //       } else {
      //         setItMaktx([
      //           {
      //             Sign: "I",
      //             Option: "BT",
      //             Low: ItMaktx_desde,
      //             High: value.trim(),
      //           },
      //         ]);
      //       }
      //     } else {
      //       if (ItMaktx_desde != "") {
      //         setItMaktx([
      //           { Sign: "I", Option: "CP", Low: ItMaktx_desde, High: "" },
      //         ]);
      //       } else {
      //         setItMaktx([{ Sign: "", Option: "", Low: "", High: "" }]);
      //       }
      //     }
      //     break;
      //   default:
      //     break;
    }
  }

  function Clear(){
    setOrganizVentasMat("");
    setCodProductoMat("");
    setNomProductoMat("");
  }

  return (
    <>
      {showmaterial ? (
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
            {/* {ViewInfo ? (
              <> */}
                <section
                  className="row"
                  style={{ margin: "auto", paddingTop: "50px" }}
                >
                  {/* <div className="col-sm-4 d-flex align-items-center">
                        <label>Cod. material</label>
                    </div>
                    
                    <div className="col-sm-4">
                        <InputForm attribute={{name:'mc_ItMatnr_desde',type:'text',value:ItMatnr_desde,disabled:false,checked:false,matchcode:false}} handleChange={handleChange} />
                    </div>
                    <div className="col-sm-4">
                        <InputForm attribute={{name:'mc_ItMatnr_hasta',type:'text',value:ItMatnr_hasta,disabled:false,checked:false,matchcode:false}} handleChange={handleChange} />
                    </div>
                
                    <div className="col-sm-4 d-flex align-items-center">
                    <label>Nombre</label>
                    </div>
                    <div className="col-sm-4">
                        <InputForm attribute={{name:'mc_ItMaktx_desde',type:'text',value:ItMaktx_desde,disabled:false,checked:false,matchcode:false}} handleChange={handleChange} />
                    </div>
                    <div className="col-sm-4">
                        <InputForm attribute={{name:'mc_ItMaktx_hasta',type:'text',value:ItMaktx_hasta,disabled:false,checked:false,matchcode:false}} handleChange={handleChange} />
                    </div> */}

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
                        maxlength:4
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
                        maxlength:18
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
                        maxlength:40
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
                      attribute={{ name: "Limpiar Campos", classNamebtn: "btn_search" }}
                      onClick={() => Clear()}
                    />
                  </div>
                </section>
                <section className="section-table-modal">
                  <div className="container-table responsive-table-all">
                    <table className="content-table ">
                      <thead>
                        <tr>
                          {/* <th>Material</th>
                          <th>Nombre Material</th>
                          <th>Tipo Material</th>
                          <th>Grupo Artículo</th>
                          <th>Centro</th> */}
                          <th style={{textAlign: 'left'}}>Código de Producto</th>
                          <th style={{textAlign: 'left'}}>Nombre de Producto</th>
                          {/* <th>Organiz. ventas</th> */}
                        </tr>
                      </thead>
                      <tbody>
                        {responseMaterial.etMaterialesField.map(
                          (response, key) => (
                            <tr
                              key={key}
                              onClick={() => clickcelda(response.matnrField)}
                            >
                              {/* <th>{response.matnrField}</th>
                              <th style={{ textAlign: "left" }}>
                                {response.maktxField}
                              </th>
                              <th style={{ textAlign: "left" }}>
                                {response.mtartField}
                              </th>
                              <th style={{ textAlign: "left" }}>
                                {response.matklField}
                              </th>
                              <th style={{ textAlign: "left" }}>
                                {response.spartField}
                              </th> */}
                              <th>{response.matnrField}</th>
                              <th align={"left"}>{response.maktxField}</th>
                              {/* <th>{response.vkorgField}</th> */}
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                    {spinner && <Spinner />}
                  </div>
                </section>
              {/* </>
            ) : (
              <div>
                <Spinner />
              </div>
            )} */}
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
              onClick={() => setshowmaterial((prev) => !prev)}
            >
              <i className="fas fa-times"></i>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Mc_Material_desde;
