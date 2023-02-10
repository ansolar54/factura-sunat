import React, { useRef, useEffect, useCallback, useState } from "react";
import { MatchPstoExpe} from "../../../Services/ServicePuntoExp";
import Spinner from "../../../components/Spinner";
import Pagination from "../../../components/Pagination";
import BtnSearch from "../../../components/BtnSearch";
import "./Mc_Punto_Exp_hasta.css";


const Mc_Punto_Exp_hasta = ({
  showpuntoexp,
  setshowpuntoexp,
  setpuntoexp_hasta,
  puntoexp_hasta,
  puntoexp_desde,
  setpuntoexp,
}) => {
  const [IsRegxpag] = useState(10); // cantidad de datos por página

  const [ViewInfo, setViewInfo] = useState(false);
  const [responsePuntoExp, setresponsePuntoExp] = useState({
    etPstoexpField: [],
  });
  //NUMERO TOTAL DE DATOS
  const [TotalData, setTotalData] = useState();
  //ACTIVAR SECCION DE PAGINADO
  const [valuepagination, setvaluepagination] = useState(false);
  const modalRef = useRef();
  //NUEVO----
  //const [OrganizVentasMat, setOrganizVentasMat] = useState("");
  //const [CodProductoMat, setCodProductoMat] = useState("");
  //const [NomProductoMat, setNomProductoMat] = useState("");
  //const [ShowOrganizVentasMat, setShowOrganizVentasMat] = useState(false);
  const [spinner, setspinner] = useState(false);
  //-------
  const closeModal = (e) => {
    if (modalRef.current === e.target) {
      setshowpuntoexp(false);
    }
  };

  const keyPress = useCallback(
    (e) => {
      if (e.key === "Escape" && showpuntoexp) {
        setshowpuntoexp(false);
      }
    },
    [setshowpuntoexp, showpuntoexp]
  );
  useEffect(() => {
    searchPuntoExp(1)
    if(showpuntoexp==true){
      //setOrganizVentasMat("");
      //setCodProductoMat("");
      //setNomProductoMat("");
    }
    
  }, [showpuntoexp])
  useEffect(() => {
    //setItMatnr([{ Sign: "", Option: "", Low: "", High: "" }]);
    //setItMatnr_desde("");
    //setItMatnr_hasta("");
    setresponsePuntoExp({ etPstoexpField: [] });
    setTotalData();
    // searchMaterial(1);
    //--------------------- para actualizar valor org_ventas
    if (puntoexp_hasta != "") {
      if (puntoexp_desde == "") {
        setpuntoexp([
          {
            Sign: "I",
            Option: "EQ",
            Low: "",
            High: puntoexp_hasta,
          },
        ]);
      } else {
        setpuntoexp([
          {
            Sign: "I",
            Option: "BT",
            Low: puntoexp_desde,
            High: puntoexp_hasta,
          },
        ]);
      }
    } else {
      if (puntoexp_desde != "") {
        setpuntoexp([
          { Sign: "I", Option: "EQ", Low: puntoexp_desde, High: ""},
        ]);
      } else {
        setpuntoexp([{ Sign: "", Option: "", Low: "", High: "" }]);
      }
    }
    //---------------------
    document.addEventListener("keydown", keyPress);
    return () => document.removeEventListener("keydown", keyPress);
  }, [keyPress]);

  // seleccionar pagina
  function changePage(pageNumber) {
    searchPuntoExp(pageNumber);
  }
  // siguiente pagina
  function prevPage(value) {
    searchPuntoExp(value - 1);
  }
  //pagina anterior
  function nextPage(value) {
    searchPuntoExp(value + 1);
  }

  function searchPuntoExp(nro_pag) {
    setresponsePuntoExp({ etPstoexpField: [] });
    setspinner(true);
    let model_puntoexp = {
      IsNpag: nro_pag,
      IsRegxpag: IsRegxpag,
    };

    MatchPstoExpe(model_puntoexp).then((result) => {
      setresponsePuntoExp(result);
      setTotalData(result.esRegtotField);
      setViewInfo(true);
      setspinner(false);
      setvaluepagination(true);
    });
  }

  // function mcOrganizVentasMat() {
  //   setShowOrganizVentasMat((prev) => !prev);
  // }

  function clickcelda(vstelField) {
    setpuntoexp_hasta(vstelField);
    setshowpuntoexp((prev) => !prev);
  }

  // function handleChange(name, value) {
  //   switch (name) {
  //     case "organizVentasMat":
  //       setOrganizVentasMat(value);
  //       break;
  //     case "codProductoMat":
  //       setCodProductoMat(value);
  //       break;
  //     case "nomProductoMat":
  //       setNomProductoMat(value);
  //       break;
  //     default:
  //       break;
      
  //   }
  // }

  // function Clear(){
  //   setOrganizVentasMat("");
  //   setCodProductoMat("");
  //   setNomProductoMat("");
  // }

  return (
    <>
      {showpuntoexp ? (
        <div
          className="container-modal-background"
          onClick={closeModal}
          ref={modalRef}
        >
          <div className="modal-wrapper modal-wrapper-sm">
            {/* {ViewInfo ? (
              <> */}
                <section
                  className="row"
                  style={{ margin: "auto", paddingTop: "15px" }}
                >
                </section>
                <section className="section-table-modal">
                  <div className="container-table responsive-table-all">
                    <table className="content-table ">
                      <thead>
                        <tr>
                          <th>Puesto de Expedición</th>
                          <th>Nombre de Puesto de Exp.</th>
                        </tr>
                      </thead>
                      <tbody>
                        {responsePuntoExp.etPstoexpField.map(
                          (response, key) => (
                            <tr
                              key={key}
                              onClick={() => clickcelda(response.vstelField)}
                            >
                              <th style={{ textAlign: "center" }}>{response.vstelField}</th>
                              <th style={{ textAlign: "center" }}>{response.vtextField}</th>
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
              onClick={() => setshowpuntoexp((prev) => !prev)}
            >
              <i className="fas fa-times"></i>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Mc_Punto_Exp_hasta;
