import React, { useCallback, useEffect, useRef, useState } from "react";
import InputForm from "../../../../components/InputForm";
import Spinner from "../../../../components/Spinner";
import { GetDetalleSolicitud } from "../../../../Services/ServiceCambioPrecio";
import ModalEditMaterial from "./ModalEditMaterial";

const ModalDetailSolicitud = ({
  showModalDetail,
  setShowModalDetail,
  idSolicitud,
  extraeFecha,
  stateSolicitud,
  orgVentas,
  orgVentasDesc,
}) => {
  const modalRef = useRef();
  const closeModal = (e) => {
    if (modalRef.current === e.target) {
      setShowModalDetail(false);
    }
  };

  const keyPress = useCallback(
    (e) => {
      if (e.key === "Escape" && showModalDetail) {
        setShowModalDetail(false);
      }
    },
    [setShowModalDetail, showModalDetail]
  );

  const [detalle, setDetalle] = useState([]);

  useEffect(() => {
    if (showModalDetail == true) {
      setViewInfo(false);
      GetDetalleSolicitud(idSolicitud).then((result) => {
        console.log(result);
        setDetalle(result.data);
        setViewInfo(true);
      });
    }
    document.addEventListener("keydown", keyPress);
    return () => document.removeEventListener("keydown", keyPress);
  }, [keyPress]);

  const [ViewInfo, setViewInfo] = useState(false);

  const [showModalEditMaterial, setShowModalEditMaterial] = useState(false);
  const [material, setMaterial] = useState({
    actual_price: 0.0,
    currency: "",
    end_date: "",
    id: 0,
    id_request: 0,
    lower_limit: 0.0,
    margin: 0.0,
    material: "",
    material_name: "",
    start_date: "",
    suggested_price: 0.0,
    upper_limit: 0.0,
    center: "",
  });

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
          // num.toString().split(".")[1].padStart(2, "0")
          num.toString().split(".")[1].padEnd(2, "0")
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

  const openEditMaterial = (item) => {
    // console.log(item);
    setMaterial(item);
    setShowModalEditMaterial((prev) => !prev);
  };

  return (
    <>
      {showModalDetail ? (
        <div
          className="container-modal-background"
          onClick={closeModal}
          ref={modalRef}
        >
          <ModalEditMaterial
            showModalEditMaterial={showModalEditMaterial}
            setShowModalEditMaterial={setShowModalEditMaterial}
            dataMaterial={material}
            setDetalle={setDetalle}
            orgVentas={orgVentas}
            orgVentasDesc={orgVentasDesc}
          />
          <div className="modal-wrapper modal-wrapper-bg">
            {/* <div className="modal-header">
              <div className="modal-title">
                <h5>Detalle solicitud</h5>
              </div>
              <div
                className="close-modal-button"
                onClick={() => setShowModalDetail((prev) => !prev)}
              >
                <i className="fas fa-times"></i>
              </div>
            </div> */}

            <div
              className="close-modal-button"
              onClick={() => setShowModalDetail((prev) => !prev)}
            >
              <i className="fas fa-times"></i>
            </div>

            <div className="modal-content">
              {ViewInfo ? (
                <div>
                  <section className="section-table-modal">
                    <div className="container-table responsive-table-all">
                      <table className="content-table ">
                        <thead>
                          <tr>
                            <th style={{ textAlign: "center" }}>CODIGO</th>
                            <th style={{ textAlign: "center" }}>MATERIAL</th>
                            <th style={{ textAlign: "center" }}>
                              MONEDA
                            </th> 
                            <th style={{ textAlign: "center" }}>
                              PRECIO ACTUAL
                            </th>
                            {(stateSolicitud == "1") && (
                              <th style={{ textAlign: "center" }}>PRECIO APROBADO</th>
                            )} 
                            {(stateSolicitud != "1") && (
                              <th style={{ textAlign: "center" }}>LIMITE INFERIOR</th>
                            )} 
                            {(stateSolicitud != "1") && (
                              <th style={{ textAlign: "center" }}>PRECIO SUGERIDO</th>
                            )}
                            {/* <th style={{ textAlign: "center" }}>
                              LIMITE SUPERIOR
                            </th> */}
                            {/* <th style={{ textAlign: "center" }}>MARGEN</th> */}
                            <th style={{ textAlign: "center" }}>
                              FECHA INICIO
                            </th>
                            <th style={{ textAlign: "center" }}>FECHA FIN</th>
                            {(stateSolicitud == "2") && (
                              <th style={{ textAlign: "center" }}>ACCION</th>
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {detalle.map((response, key) => (
                            <tr
                              key={key}
                              // onClick={() => clickcelda(response)}
                            >
                              <th style={{ textAlign: "center" }}>
                                {response.material}
                              </th>
                              <th>{response.material_name}</th>
                              <th style={{ textAlign: "center" }}>
                                {(response.currency)}
                              </th>
                              <th style={{ textAlign: "center" }}>
                                {convertDecimal(response.actual_price)}
                              </th>
                              <th style={{ textAlign: "center" }}>
                                {convertDecimal(response.lower_limit)}
                              </th>
                              {(stateSolicitud != "1") && (
                              <th style={{ textAlign: "center" }}>
                                {convertDecimal(response.suggested_price)}
                              </th>)}
                              {/* <th style={{ textAlign: "right" }}>
                                {convertDecimal(response.upper_limit)}
                              </th> */}
                              {/* <th style={{ textAlign: "right" }}>
                                {convertDecimal(response.margin*100)} %
                              </th> */}
                              <th style={{ textAlign: "center" }}>
                                {extraeFecha(response.start_date)}
                              </th>
                              <th style={{ textAlign: "center" }}>
                                {extraeFecha(response.end_date)}
                              </th>
                              {(stateSolicitud == "2") && (
                                <th style={{ textAlign: "center" }}>
                                  <i
                                    style={{
                                      cursor: "pointer",
                                      margin: "6px",
                                    }}
                                    title="Editar material"
                                    className="fas fa-edit fa-lg"
                                    onClick={() => openEditMaterial(response)}
                                  ></i>
                                  {/* <i
                                    style={{
                                      cursor: "pointer",
                                      margin: "2px",
                                    }}
                                    title="Eliminar material"
                                    className="fas fa-trash-alt"
                                    onClick={() => {}}
                                  ></i> */}
                                </th>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>
                </div>
              ) : (
                <div>
                  <Spinner />
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default ModalDetailSolicitud;
