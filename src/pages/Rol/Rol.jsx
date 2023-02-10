import React, { useState, useEffect } from "react";
import InputSearch from "../../components/InputSearch";
import BtnNew from "../../components/BtnNew";
import { getsRoles, getRol, updateStateRol } from "../../Services/ServiceRol";
import ModalNewRol from "./Modals/ModalNewRol";
import ModalEditRol from "./Modals/ModalEditRol";
import ModalAsignarAcciones from "./Modals/ModalAsignarAcciones";
import Spinner from "../../components/Spinner";
import Pagination from "../../components/Pagination";

import { getsModules } from "../../Services/ServiceModule";
import { getsOperations } from "../../Services/ServiceOperation";
import ModalAsignarPerfiles from "./Modals/ModalAsignarPerfiles";
import { ConfiPerfiles } from "../../Services/ServiceCambioPrecio";

import toast, { Toaster } from "react-hot-toast";

// import './Usuario.css'

const Rol = () => {
  //@MC
  const [Limit] = useState(5); // cantidad de datos por página
  // INPUT BUSCAR
  const [Texto, setTexto] = useState("");

  //RESPONSE CONSULTA PEDIDO
  const [ListarItems, setListarItems] = useState([]);
  const [ItemsModules, setItemsModules] = useState([]);
  const [ItemEdit, setItemEdit] = useState([]);

  //CARGA DE SPINNER
  const [spinner, setspinner] = useState(false);
  //NUMERO TOTAL DE DATOS
  const [TotalData, setTotalData] = useState();
  //ACTIVAR SECCION DE PAGINADO
  const [valuepagination, setvaluepagination] = useState(false);
  const [ShowRol, setShowRol] = useState(false);
  const [ShowEditRol, setShowEditRol] = useState(false);
  const [ShowAsignarAcciones, setShowAsignarAcciones] = useState(false);
  // MODAL ASIGNAR PERFILES
  const [showModalAsignarPerfil, setShowModalAsignarPerfil] = useState(false);
  // DATA PERFILES FOR MODAL
  const [perfiles, setPerfiles] = useState([]);
  const [idRol, setIdRol] = useState("");

  // let page_indicator = 1;
  const [pageIndicator, setPageIndicator] = useState(1);

  useEffect(() => {
    listar(1);
  }, [ShowRol, ShowEditRol]);

  //BÚSQUEDA
  const search = (name, value) => {
    setTexto(value);
    listar(1);
  };

  const listar = (Offset) => {
    setspinner(true);
    setListarItems([]);
    getsRoles(Texto, Limit, Offset).then((result) => {
      setListarItems(result.data);
      setTotalData(result.totalItems);
      setspinner(false);
      setvaluepagination(true);
    });
  };

  // seleccionar pagina
  function changePage(pageNumber) {
    setPageIndicator(pageNumber);
    listar(pageNumber);
  }
  // siguiente pagina
  function prevPage(value) {
    setPageIndicator(value - 1);
    listar(value - 1);
  }
  //pagina anterior
  function nextPage(value) {
    setPageIndicator(value + 1);
    listar(value + 1);
  }

  const cambiarEstado = (Id, Estado) => {
    let request = { state: Estado == 1 ? 0 : 1 };
    updateStateRol(request, Id).then((result) => {
      console.log(pageIndicator);
      listar(pageIndicator);
    });
  };

  const nuevo = () => {
    setShowRol((prev) => !prev);
  };

  const editar = (Id) => {
    getRol(Id).then((result) => {
      setItemEdit(result.data[0]);
      setShowEditRol((prev) => !prev);
    });
  };

  const eliminar = (id) => {
    let request = {
      state: 0,
    };
    updateStateRol(request, id).then((result) => {
      console.log(result);
    });
  };

  const asignarAcciones = (Id) => {
    getRol(Id).then((result) => {
      setItemEdit(result.data[0]);
      getsModules().then((rModules) => {
        let dataModule = [];
        rModules.data.map((item, key) =>
          getsOperations(item.id).then((rOperations) => {
            dataModule.push({
              id_module: item.id,
              module: item.name,
              operations: rOperations.data,
            });
            if (key == rModules.data.length - 1) {
              setItemsModules(dataModule);
              setShowAsignarAcciones((prev) => !prev);
            }
          })
        );
      });
    });
  };

  const openModalPerfiles = (item) => {
    setIdRol(item.id.toString());
    let model = {
      IsOpcion: "L",
      IsRol: item.id.toString(), // id de rol
      IsUser: "",
      ItPerfil: [],
    };
    // console.log(model);
    ConfiPerfiles(model).then((result) => {
      // console.log(result.etPerfilField);
      let data = [];
      if (result.etPerfilField.length > 0) {
        for (let i = 0; i < result.etPerfilField.length; i++) {
          const element = result.etPerfilField[i];
          let model_perfil = {
            idModuloField: element.idModuloField,
            activeField: element.activeField,
            grupoField: element.grupoField,
          };
          data.push(model_perfil);
        }
        setPerfiles(data);
        setShowModalAsignarPerfil((prev) => !prev);
      }
      else {
        toast.error("Falta agregar rol en SAP.", {
          position: "top-center",
          autoClose: 1000,
          style: {
            backgroundColor: "#212121",
            color: "#fff",
          }
        })
      }
    });
    // setShowModalAsignarPerfil((prev) => !prev);
  };

  //formateo de la fecha
  function formatDate(value) {
    var datePart = value.match(/\d+/g),
      year = datePart[0],
      month = datePart[1],
      day = datePart[2];
    return day + "-" + month + "-" + year;
  }

  return (
    <div className="container-view">
      {/* MODALES  */}
      <ModalNewRol showMdRol={ShowRol} setShowMdRol={setShowRol} />
      <ModalEditRol
        ShowMdEditRol={ShowEditRol}
        setShowMdEditRol={setShowEditRol}
        MdItemEdit={ItemEdit}
      />
      <ModalAsignarAcciones
        ShowMdAsignarAcciones={ShowAsignarAcciones}
        setShowMdAsignarAcciones={setShowAsignarAcciones}
        MdItemEdit={ItemEdit}
        McItemsModules={ItemsModules}
      />
      <ModalAsignarPerfiles
        setShowModalAsignarPerfil={setShowModalAsignarPerfil}
        showModalAsignarPerfil={showModalAsignarPerfil}
        setPerfiles={setPerfiles}
        perfiles={perfiles}
        idRol={idRol}
      />

      <Toaster />

      <div className="title-section">
        <label> Administración / Rol </label>
        <hr />
      </div>
      <div>
        <div className="search-new">
          <div className="col-md-6">
            <InputSearch
              attribute={{
                name: "texto",
                placeholder: "Busqueda de roles...",
                type: "search",
                value: Texto,
                disabled: false,
              }}
              search={search}
            />
          </div>
          <div className="col-md-2"></div>
          <div className="col-md-4">
            <BtnNew
              attribute={{
                name: "btnNuevo",
                value: "Nuevo rol",
                classNamebtn: "btn_new",
              }}
              onClick={() => nuevo()}
            />
          </div>
        </div>
      </div>

      <section>
        <div className="container-table">
          <table className="content-table">
            <thead>
              <tr>
                <th style={{ textAlign: "left" }}>ID</th>
                <th style={{ textAlign: "left" }}>ROL</th>
                <th style={{ textAlign: "left" }}>F. CREACION</th>
                <th style={{ textAlign: "left" }}>ESTADO</th>
                <th style={{ textAlign: "left" }}>ACCION</th>
              </tr>
            </thead>
            <tbody>
              {ListarItems.map((item, key) => (
                <tr key={key}>
                  <th>{item.id}</th>
                  <td>{item.name}</td>
                  <td>{formatDate(item.created_at)}</td>
                  {item.state == 1 ? (
                    <td>
                      <label className="switch">
                        <input
                          type="checkbox"
                          onChange={() => cambiarEstado(item.id, item.state)}
                          defaultChecked
                        />
                        <span className="slider round"></span>
                      </label>
                    </td>
                  ) : (
                    <td>
                      <label className="switch">
                        <input
                          type="checkbox"
                          onChange={() => cambiarEstado(item.id, item.state)}
                        />
                        <span className="slider round"></span>
                      </label>
                    </td>
                  )}
                  <td>
                    <i
                      style={{ cursor: "pointer" }}
                      title="Editar rol"
                      className="fas fa-edit fa-lg"
                      onClick={() => editar(item.id)}
                    ></i>
                    {/* <i style={{ cursor: "pointer", margin: "2px" }} title="Eliminar rol"  className="fas fa-trash-alt" onClick={() => eliminar(item.id)}></i> */}
                    <i
                      style={{ cursor: "pointer", marginLeft: "10px" }}
                      title="Asignar perfiles"
                      className="fas fa-bacon fa-lg"
                      onClick={() => openModalPerfiles(item)}
                    ></i>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {spinner && <Spinner />}
        </div>
      </section>
      <div>
        {valuepagination && (
          <Pagination
            postsPerPage={Limit}
            totalPosts={TotalData}
            changePage={changePage}
            prevPage={prevPage}
            nextPage={nextPage}
          />
        )}
      </div>
    </div>
  );
};

export default Rol;
