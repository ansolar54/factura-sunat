import React, { useCallback, useEffect, useRef, useState } from "react";
import InputForm from "../../../components/InputForm";
import Spinner from "../../../components/Spinner";
import { GetDetalleSolicitud } from "../../../Services/ServiceCambioPrecio";

const ModalDetailSolicitud = ({
  showModalDetail,
  setShowModalDetail,
  idSolicitud,
  extraeFecha,
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
        setDetalle(result);
        setViewInfo(true);
      });
    }
    document.addEventListener("keydown", keyPress);
    return () => document.removeEventListener("keydown", keyPress);
  }, [keyPress]);

  const [ViewInfo, setViewInfo] = useState(false);

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

  return (
    <>
      {showModalDetail ? (
        <div
          className="container-modal-background"
          onClick={closeModal}
          ref={modalRef}
        >
          <div className="modal-wrapper modal-wrapper-sm">
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
                            <th>Código</th>
                            <th>Material</th>
                            <th>Precio actual</th>
                            <th>Precio sugerido</th>
                            <th>Fecha inicio</th>
                            <th>Fecha fin</th>
                          </tr>
                        </thead>
                        <tbody>
                          {detalle.data.map((response, key) => (
                            <tr
                              key={key}
                              // onClick={() => clickcelda(response)}
                            >
                              <th>{response.material}</th>
                              <th>{response.material_name}</th>
                              <th style={{ textAlign: "center" }}>
                                {convertDecimal(response.actual_price)}
                              </th>
                              <th style={{ textAlign: "center" }}>
                                {convertDecimal(response.suggested_price)}
                              </th>
                              <th>{extraeFecha(response.start_date)}</th>
                              <th>{extraeFecha(response.end_date)}</th>
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
