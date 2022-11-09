import React, { useRef, useEffect, useCallback, useState } from "react";
import { OrgVentas } from "../../../Services/ServiceOrgVentas";
import Spinner from "../../../components/Spinner";

const McOrgVentas = ({
  showOrgVentas,
  setShowOrgVentas,
  setOrgVentas,
  orgVentasValue,
  setOrgVentasValue,
  setOrgVentasName,
}) => {
  const [ViewInfo, setViewInfo] = useState(false);
  const [responseOrgVentas, setresponseOrgVentas] = useState({
    etOrgVentasField: [],
  });

  const modalRef = useRef();
  const closeModal = (e) => {
    if (modalRef.current === e.target) {
      setShowOrgVentas(false);
    }
  };

  const keyPress = useCallback(
    (e) => {
      if (e.key === "Escape" && showOrgVentas) {
        setShowOrgVentas(false);
      }
    },
    [setShowOrgVentas, showOrgVentas]
  );

  useEffect(() => {
    if (showOrgVentas == true) {
      setViewInfo(false);
      OrgVentas().then((result) => {
        setresponseOrgVentas(result);
        setViewInfo(true);
      });
    }
    //--------------------- para actualizar valor org_ventas
    setOrgVentas([{ Sign: "I", Option: "EQ", Low: orgVentasValue, High: "" }]);
    //---------------------
    document.addEventListener("keydown", keyPress);
    return () => document.removeEventListener("keydown", keyPress);
  }, [keyPress]);

  function clickcelda(param) {
    setOrgVentasValue(param.vkorgField);
    setOrgVentasName(param.vtextField);
    setShowOrgVentas((prev) => !prev);
  }

  return (
    <>
      {showOrgVentas ? (
        <div
          className="container-modal-background"
          onClick={closeModal}
          ref={modalRef}
        >
          <div className="modal-wrapper modal-wrapper-sm">
            <div className="modal-content">
              {ViewInfo ? (
                <div>
                  <section className="section-table-modal">
                    <div className="container-table responsive-table-all">
                      <table className="content-table ">
                        <thead>
                          <tr>
                            <th>Organiz. ventas</th>
                            <th>Denominación</th>
                          </tr>
                        </thead>
                        <tbody>
                          {responseOrgVentas.etOrgVentasField.map(
                            (response, key) => (
                              <tr
                                key={key}
                                onClick={() => clickcelda(response)}
                              >
                                <th>{response.vkorgField}</th>
                                <th>{response.vtextField}</th>
                              </tr>
                            )
                          )}
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
            <div
              className="close-modal-button"
              onClick={() => setShowOrgVentas((prev) => !prev)}
            >
              <i className="fas fa-times"></i>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default McOrgVentas;
