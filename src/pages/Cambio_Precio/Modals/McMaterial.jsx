import React, { useCallback, useEffect, useRef } from "react";
import InputForm from "../../../components/InputForm";
import BtnSearch from "../../../components/BtnSearch";

const McMaterial = ({ showMcMaterial, setShowMcMaterial }) => {
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
    document.addEventListener("keydown", keyPress);
    return () => document.removeEventListener("keydown", keyPress);
  }, [keyPress]);
  return (
    <>
      {showMcMaterial ? (
        <div
          className="container-modal-background"
          onClick={closeModal}
          ref={modalRef}
        >
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
                    value: OrganizVentasMat,
                    disabled: false,
                    checked: false,
                    matchcode: true,
                    maxlength: 4,
                  }}
                  handleChange={handleChange}
                  onClick={() => mcOrganizVentasMat()}
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
                    value: "",
                    disabled: false,
                    checked: false,
                    matchcode: false,
                    maxlength: 18,
                  }}
                  handleChange={""}
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
                    value: "",
                    disabled: false,
                    checked: false,
                    matchcode: false,
                    maxlength: 15,
                  }}
                  handleChange={""}
                />
              </div>
            </section>
            <section>
              <div style={{ margin: "10px" }}>
                <BtnSearch
                  attribute={{ name: "Buscar", classNamebtn: "btn_search" }}
                  onClick={() => {}}
                />
              </div>
              <div style={{ margin: "10px" }}>
                <BtnSearch
                  attribute={{
                    name: "Limpiar Campos",
                    classNamebtn: "btn_search",
                  }}
                  onClick={() => {}}
                />
              </div>
            </section>
            <section className="section-table-modal">
              <div className="container-table responsive-table-all">
                <table className="content-table ">
                  <thead>
                    <tr>
                      <th>Cod. Producto</th>
                      <th>Nombre de Producto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* {responseMaterial.etMaterialesField.map((response, key) => ( */}
                    <tr key={1} onClick={() => {}}>
                      <th>1001061</th>
                      <th align={"left"}>CIPERMEX SUPER 10 EC X 1 L</th>
                    </tr>
                    {/* ))} */}
                  </tbody>
                </table>
                {/* {spinner && <Spinner />} */}
              </div>
            </section>
            {/* <div className="content-pagination">
              {valuepagination && (
                <Pagination
                  postsPerPage={IsRegxpag}
                  totalPosts={TotalData}
                  changePage={changePage}
                  prevPage={prevPage}
                  nextPage={nextPage}
                />
              )}
            </div> */}

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
