import React, { useState, useEffect, useRef } from "react";
import InputSearch from "../../components/InputSearch";
import BtnNew from "../../components/BtnNew";
import {
  getUsers,
  getUser,
  updateStateUser,
  deleteUser,
} from "../../Services/ServiceUser";
import { getRoleState } from "../../Services/ServiceRol";
import ModalNewUser from "./Modals/ModalNewUser";
import ModalEditUser from "./Modals/ModalEditUser";
import ModalEditPassUser from "./Modals/ModalEditPassUser";
import Spinner from "../../components/Spinner";
import Pagination from "../../components/Pagination";
import { ValidarRuta } from "../../Services/ServiceValidaUsuario";
// import './Usuario.css'
import jwt from "jwt-decode";
import ChangeStatusPassword from "../../components/ChangeStatusPassword/ChangeStatusPassword";
import Dialog from "../Cambio_Precio/Dialog";

const Usuario = () => {
  //@MC
  //para el cambio de contraseña
  const [show_status_password, setshow_status_password] = useState(false);
  const [Limit] = useState(10); // cantidad de datos por página
  // INPUT BUSCAR
  const [Texto, setTexto] = useState("");

  //RESPONSE CONSULTA PEDIDO
  const [ListarItems, setListarItems] = useState([]);
  const [ItemEdit, setItemEdit] = useState([]);
  const [ItemsRoles, setItemsRoles] = useState([]);

  //CARGA DE SPINNER
  const [spinner, setspinner] = useState(false);
  //NUMERO TOTAL DE DATOS
  const [TotalData, setTotalData] = useState();
  //ACTIVAR SECCION DE PAGINADO
  const [valuepagination, setvaluepagination] = useState(false);
  const [ShowUser, setShowUser] = useState(false);
  const [ShowEditUser, setShowEditUser] = useState(false);
  const [ShowEditPassUser, setShowEditPassUser] = useState(false);
  //PARA ACCESO A RUTA
  const [accesoruta, setaccesoruta] = useState(false);
  //CARGA DE SPINNER DE ACCESO DE RUTA
  const [spinnerroute, setspinnerroute] = useState(false);
  //INDICADOR SI YA VALIDO RUTA
  const [indicadorruta, setindicadorruta] = useState(false);
  useEffect(() => {
    //valida para el nuevo cambio de contraseña
    // getUser(jwt(localStorage.getItem("_token")).nameid).then((result) => {
    //     if (result.data[0].status_password === "1") {
    //       setshow_status_password(true);
    //     } else {
    //       setshow_status_password(false);
    //     }
    //   });
    //valida acceso a ruta
    if (indicadorruta == false) {
      setspinnerroute(true);
      ValidarRuta("01").then((result) => {
        if (result.admin == 1) {
          setspinnerroute(false);
          setaccesoruta(true);
          setindicadorruta(true);
          listar(1);
        } else {
          setspinnerroute(false);
          setaccesoruta(false);
          setindicadorruta(true);
        }
      });
    } else {
      listar(1);
    }
  }, [ShowUser, ShowEditUser]);

  //BÚSQUEDA
  const search = (name, value) => {
    setTexto(value);
    listar(1);
  };

  const listar = (Offset) => {
    setspinner(true);
    setListarItems([]);
    getUsers(Texto, Limit, Offset).then((result) => {
      setListarItems(result.data);
      setTotalData(result.totalItems);
      setspinner(false);
      setvaluepagination(true);
    });
  };

  // seleccionar pagina
  function changePage(pageNumber) {
    listar(pageNumber);
  }
  // siguiente pagina
  function prevPage(value) {
    listar(value - 1);
  }
  //pagina anterior
  function nextPage(value) {
    listar(value + 1);
  }

  const cambiarEstado = (Id, Estado) => {
    let request = { state: Estado == 1 ? 0 : 1 };
    updateStateUser(Id, request).then((result) => {
      listar(1);
    });
  };

  const nuevo = () => {
    getRoleState().then((rRoles) => {
      setItemsRoles(rRoles.data);
      setShowUser((prev) => !prev);
    });
  };

  const editar = (Id) => {
    getUser(Id).then((result) => {
      setItemEdit(result.data[0]);
      getRoleState().then((rRoles) => {
        setItemsRoles(rRoles.data);
        setShowEditUser((prev) => !prev);
      });
    });
  };

  const cambiarPassword = (Id) => {
    getUser(Id).then((result) => {
      setItemEdit(result.data[0]);
      setShowEditPassUser((prev) => !prev);
    });
  };

  const EliminarUsuario = (id) => {
    deleteUser(id).then((result) => {
      listar(1);
    });
  };

  ///////////////

  const [dialog, setDialog] = useState({
    message: "",
    isLoading: false,
    //Update
    nameProduct: "",
  });
  const itemRef = useRef();
  const handleDialog = (message, isLoading, nameProduct) => {
    setDialog({
      message,
      isLoading,
      //Update
      nameProduct,
    });
  };
  const handleDelete = (item) => {
    //Update
    // const index = data.findIndex((p) => p.id === id);

    handleDialog("¿Seguro de eliminar el usuario?", true, "");
    itemRef.current = item;
  };
  const areUSureDelete = (choose) => {
    console.log(choose);
    if (choose) {
      deleteUser(itemRef.current).then((result) => {
        listar(1);
      });
      // updateStateRequest(3, itemRef.current)
      //anularSolicitud(4, itemRef.current)
      handleDialog("", false);
    } else {
      handleDialog("", false);
    }
  };

  return (
    <>
      {/* {show_status_password ? (
        <ChangeStatusPassword
          setshow_status_password={setshow_status_password}
        />
      ) : null} */}
      {spinnerroute ? (
        <Spinner />
      ) : (
        <>
          {accesoruta ? (
            <div className="container-view">
              {/* MODALES  */}
              <ModalNewUser
                showMdUser={ShowUser}
                setShowMdUser={setShowUser}
                MdItemsRoles={ItemsRoles}
              />
              <ModalEditUser
                ShowMdEditUser={ShowEditUser}
                setShowMdEditUser={setShowEditUser}
                MdItemEdit={ItemEdit}
                MdItemsRoles={ItemsRoles}
              />
              <ModalEditPassUser
                ShowMdEditPassUser={ShowEditPassUser}
                setShowMdEditPassUser={setShowEditPassUser}
                MdItemEdit={ItemEdit}
              />

              <div className="title-section">
                <label> Administración / Usuario </label>
                <hr />
              </div>
              <div>
                <div className="search-new">
                  <div className="col-md-6">
                    <InputSearch
                      attribute={{
                        name: "texto",
                        placeholder: "Busqueda de usuarios...",
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
                        value: "Nuevo usuario",
                        classNamebtn: "btn_new",
                      }}
                      onClick={() => nuevo()}
                    />
                  </div>
                </div>
              </div>

              <section>
                <div className="container-table">
                  <div className="container-table-sm">
                    <table className="content-table">
                      <thead>
                        <tr>
                          <th style={{ textAlign: "left" }}>ID</th>
                          <th style={{ textAlign: "left" }}>NOMBRES</th>
                          <th style={{ textAlign: "left" }}>USER</th>
                          <th style={{ textAlign: "left" }}>ROLE</th>
                          <th style={{ textAlign: "left" }}>EMAIL</th>
                          <th style={{ textAlign: "left" }}>ESTADO</th>
                          <th style={{ textAlign: "left" }}>ACCION</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ListarItems.map((item, key) => (
                          <tr key={key}>
                            <th>{item.id}</th>
                            <td>
                              {item.name +
                                " " +
                                item.ape_pat +
                                " " +
                                item.ape_mat}
                            </td>
                            <td>{item.username}</td>
                            <td>{item.role}</td>
                            <td>{item.email}</td>
                            {item.state == 1 ? (
                              <td>
                                {jwt(localStorage.getItem("_token")).nameid !==
                                  item.id.toString() ? (
                                  <label className="switch">
                                    <input
                                      type="checkbox"
                                      onChange={() =>
                                        cambiarEstado(item.id, item.state)
                                      }
                                      defaultChecked
                                    />
                                    <span className="slider round"></span>
                                  </label>
                                ) : (
                                  <label className="switch">
                                    <input
                                      type="checkbox"
                                      disabled
                                      defaultChecked
                                    />
                                    <span className="blockcheck round"></span>
                                  </label>
                                )}
                              </td>
                            ) : (
                              <td>
                                <label className="switch">
                                  <input
                                    type="checkbox"
                                    onChange={() =>
                                      cambiarEstado(item.id, item.state)
                                    }
                                  />
                                  <span className="slider round"></span>
                                </label>
                              </td>
                            )}
                            <td>
                              <i
                                style={{ cursor: "pointer", margin: "6px" }}
                                title="Editar usuario"
                                className="fas fa-edit fa-lg"
                                onClick={() => editar(item.id)}
                              ></i>
                              <i
                                style={{ cursor: "pointer", margin: "6px" }}
                                title="Cambiar contraseña"
                                className="fas fa-unlock-alt fa-lg"
                                onClick={() => cambiarPassword(item.id)}
                              ></i>
                              {jwt(localStorage.getItem("_token")).nameid !==
                                item.id.toString() ? (
                                <i
                                  style={{ cursor: "pointer", margin: "6px" }}
                                  className="fas fa-trash-alt fa-lg"
                                  // onClick={() => EliminarUsuario(item.id)}
                                  onClick={() => handleDelete(item.id)}
                                ></i>
                              ) : null}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {spinner && <Spinner />}
                  </div>
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
                {dialog.isLoading && (
                  <Dialog
                    //Update
                    nameProduct={dialog.nameProduct}
                    onDialog={areUSureDelete}
                    message={dialog.message}
                  />
                )}
              </div>
            </div>
          ) : (
            <div className="access-route">NO TIENE ACCESO Al MÓDULO DE USUARIOS</div>
          )}
        </>
      )}
    </>
  );
};

export default Usuario;
