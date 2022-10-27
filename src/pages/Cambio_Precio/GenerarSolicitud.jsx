import React, { useRef, useState } from "react";
import InputForm from "../../components/InputForm";
import "./CambioPrecio.css";
import BtnAddMaterial from "../../components/BtnAddMaterial";
import ModalAddMaterial from "./Modals/ModalAddMaterial";
import ModalEditMaterial from "./Modals/ModalEditMaterial";
import McOrgVentas from "./Modals/McOrgVentas";
import McCliente from "./Modals/McCliente";
import Dialog from "./Dialog";

const GenerarSolicitud = () => {
  const [showModalMaterial, setShowModalMaterial] = useState(false);
  const [showModalEditMaterial, setShowModalEditMaterial] = useState(false);
  const [idMaterial, setIdMaterial] = useState();

  // ORG VENTAS
  const [orgVentasValue, setOrgVentasValue] = useState("AGRO");
  const [orgVentas, setOrgVentas] = useState([
    { Sign: "I", Option: "EQ", Low: "", High: "" },
  ]);
  const [showOrgVentas, setShowOrgVentas] = useState(false);

  // CLIENTE
  const [IsCliente, setIsCliente] = useState("");
  const [showMcCliente, setShowMcCliente] = useState(false);

  const openAddMaterial = () => {
    setShowModalMaterial((prev) => !prev);
  };

  const openEditMaterial = (id_material) => {
    setIdMaterial(id_material);
    setShowModalEditMaterial((prev) => !prev);
  };

  const openMcOrgVentas = () => {
    setShowOrgVentas((prev) => !prev);
  };

  const openMcCliente = () => {
    setShowMcCliente((prev) => !prev);
  };

  // DELETE --------------
  //You can put all product information into diaglog
  const [dialog, setDialog] = useState({
    message: "",
    isLoading: false,
    //Update
    nameProduct: "",
  });
  const idProductRef = useRef();
  const handleDialog = (message, isLoading, nameProduct) => {
    setDialog({
      message,
      isLoading,
      //Update
      nameProduct,
    });
  };

  const handleDelete = (id) => {
    //Update
    // const index = data.findIndex((p) => p.id === id);

    handleDialog("¿Seguro de eliminar el registro?", true, "");
    idProductRef.current = id;
  };

  const areUSureDelete = (choose) => {
    console.log(choose);
    if (choose) {
      // SE PASA A ELIMINAR REGISTRO
      //   setProducts(products.filter((p) => p.id !== idProductRef.current));
      handleDialog("", false);
    } else {
      handleDialog("", false);
    }
  };

  // ---------------------

  return (
    <React.Fragment>
      <div className="container-view">
        <ModalAddMaterial
          showModalMaterial={showModalMaterial}
          setShowModalMaterial={setShowModalMaterial}
        />
        <ModalEditMaterial
          showModalEditMaterial={showModalEditMaterial}
          setShowModalEditMaterial={setShowModalEditMaterial}
          idMaterial={idMaterial}
        />
        <McOrgVentas
          orgVentasValue={orgVentasValue}
          setOrgVentas={setOrgVentas}
          setOrgVentasValue={setOrgVentasValue}
          setShowOrgVentas={setShowOrgVentas}
          showOrgVentas={showOrgVentas}
        />
        <McCliente
          IsCliente={IsCliente}
          setIsCliente={setIsCliente}
          setShowMcCliente={setShowMcCliente}
          showMcCliente={showMcCliente}
        />

        <div className="title-section">
          <label> Generar Solicitud </label>
          <hr />
        </div>
        <div className="container-form2">
          <div className="container-form1" style={{ width: "90%" }}>
            <div>
              <div className="col-sm-2 d-flex align-items-center">
                <label>Organización de ventas : </label>
              </div>
              <div>
                <InputForm
                  attribute={{
                    name: "org_ventas",
                    type: "text",
                    value: orgVentasValue,
                    disabled: false,
                    checked: false,
                    matchcode: true,
                    maxlength: 4,
                  }}
                  handleChange={""}
                  onClick={() => openMcOrgVentas()}
                />
              </div>
              <div className="align-items-center">
                <label>Descripción de organización de ventas.</label>
              </div>
            </div>
            <div>
              <div className="col-sm-2 d-flex align-items-center">
                <label>Cliente : </label>
              </div>
              <div>
                <InputForm
                  attribute={{
                    name: "cliente",
                    type: "text",
                    value: "1005141",
                    disabled: false,
                    checked: false,
                    matchcode: true,
                    maxlength: 4,
                  }}
                  handleChange={""}
                  onClick={() => openMcCliente()}
                />
              </div>
              <div className="align-items-center">
                <label>Descripción de cliente.</label>
              </div>
            </div>
          </div>
          <div
            style={{
              flex: 1,
              marginBlock: 10,
            }}
          >
            <BtnAddMaterial
              attribute={{
                name: "Agregar Material",
                classNamebtn: "btn_material",
              }}
              onClick={() => openAddMaterial()}
            />
          </div>
        </div>
        <section>
          <div className="container-table">
            <div className="container-table-sm">
              <table className="content-table">
                <thead>
                  <tr>
                    <th style={{ textAlign: "left" }}>MATERIAL</th>
                    <th style={{ textAlign: "left" }}>DENOMINACIÓN</th>
                    <th style={{ textAlign: "left" }}>MONEDA</th>
                    <th style={{ textAlign: "left" }}>PRECIO ACTUAL</th>
                    <th style={{ textAlign: "left" }}>PRECIO SUGERIDO</th>
                    <th style={{ textAlign: "left" }}>FECHA INICIO</th>
                    <th style={{ textAlign: "left" }}>FECHA FIN</th>
                    <th style={{ textAlign: "left" }}>ACCION</th>
                  </tr>
                </thead>
                <tbody>
                  {/* {dataAuditoria.length >= 1
                    ? dataAuditoria.map((item, key) => ( */}
                  <tr key={1}>
                    <th>1001061</th>
                    <th>CIPERMEX SUPER 10 EC X 1 L</th>
                    <th>USD</th>
                    <th>45.00</th>
                    <th>50.00</th>
                    <th>27-10-2022</th>
                    <th>27-10-2030</th>
                    <th>
                      <i
                        style={{ cursor: "pointer", margin: "2px" }}
                        title="Editar material"
                        className="fas fa-edit"
                        onClick={() => openEditMaterial(1)}
                      ></i>
                      <i
                        style={{ cursor: "pointer", margin: "2px" }}
                        title="Eliminar material"
                        className="fas fa-trash-alt"
                        onClick={() => handleDelete(1)}
                      ></i>
                    </th>
                  </tr>
                  {/* ))
                    : null} */}
                </tbody>
              </table>
              {/* {spinner==false && dataAuditoria.length == 0 ? (
                    <div
                      style={{
                        margin: "10px",
                        textAlign: "center",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      No se encontraron resultados.
                    </div>
                  ) : null}
              {spinner && <Spinner />} */}
            </div>
          </div>
        </section>
        {dialog.isLoading && (
          <Dialog
            //Update
            nameProduct={dialog.nameProduct}
            onDialog={areUSureDelete}
            message={dialog.message}
          />
        )}
      </div>
    </React.Fragment>
  );
};

export default GenerarSolicitud;
