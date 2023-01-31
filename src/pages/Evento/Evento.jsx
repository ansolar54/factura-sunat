import React, { useState, useEffect } from "react";
import { GetEventos, updateStateEvento } from "../../Services/ServiceEvent";
import BtnNew from "../../components/BtnNew";
import Spinner from "../../components/Spinner";
import Pagination from "../../components/Pagination";
import ModalNewEvento from "./Modals/ModalNewEvento";
import ModalEditEvento from "./Modals/ModalEditEvento";
import InputSearch from "../../components/InputSearch";
import InputForm from "../../components/InputForm";

const Evento = () => {
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

    // let page_indicator = 1;
    const [pageIndicator, setPageIndicator] = useState(1);

    useEffect(() => {
        search('Buscar',Texto);
        // listarEventos(1);
    }, [ShowRol, ShowEditRol]);

    const listarEventos = (Offset) => {
        setspinner(true);
        setListarItems([]);
        GetEventos(Texto == "" ? '' : Texto , 
            Limit, 
            Offset).then((result) => {
                console.log("PRUEBAAA",Texto, Limit)
            console.log(result)
            setListarItems(result.data);
            setTotalData(result.totalItems);
            setspinner(false);
            setvaluepagination(true);
        });
    };

    // seleccionar pagina
    function changePage(pageNumber) {
        setPageIndicator(pageNumber);
        listarEventos(pageNumber);
    }
    // siguiente pagina
    function prevPage(value) {
        setPageIndicator(value - 1);
        listarEventos(value - 1);
    }
    //pagina anterior
    function nextPage(value) {
        setPageIndicator(value + 1);
        listarEventos(value + 1);
    }

    const nuevo = () => {
        setShowRol((prev) => !prev);
    };

    const cambiarEstado = (Id, Estado) => {
        let request = { state: Estado == 1 ? 0 : 1 };
        updateStateEvento(request, Id).then((result) => {
            console.log(pageIndicator);
            listarEventos(pageIndicator);
        });
    };

    //formateo de la fecha
    function formatDate(value) {
        var datePart = value.match(/\d+/g),
            year = datePart[0],
            month = datePart[1],
            day = datePart[2];
        return day + "-" + month + "-" + year;
    }

    const editar = (param) => {
        setItemEdit(param);
        setShowEditRol((prev) => !prev);
    };

    // BÚSQUEDA
    const search = (name, value) => {   
        console.log('PRUEBA',value)        
                setTexto(value)
                 listarEventos(1);
               

    };

    // function handleChange(name, value) {
    //     // console.log(name, " : ", value);
    //     switch (name) {
    //         case "Buscar":
    //             setTexto(value)
    //             // listarEventos(1);
    //             break;
    //             default:
    //             break;
    //     }
    // }

    // let separador = document.getElementById('Buscar');

    // if (separador) {
    //     separador.addEventListener('keydown', (e) => {
    //         //  console.log("hola",e.target.value)
    //         // setTexto(e.target.value);
    //         listarEventos(1);
    //     }, false);
    // }

    return (
        <div className="container-view">
            {/* MODALES  */}
            <ModalNewEvento showMdRol={ShowRol} setShowMdRol={setShowRol} />
            <ModalEditEvento
                ShowMdEditRol={ShowEditRol}
                setShowMdEditRol={setShowEditRol}
                MdItemEdit={ItemEdit}
            />

            <div className="title-section">
                <label> Administración / Evento </label>
                <hr />
            </div>
            <div>
                <div className="search-new">
                    <div className="col-md-6">
                        <InputSearch
                            attribute={{
                                name: "Buscar",
                                id: "Buscar",
                                placeholder: "Búsqueda de eventos...",
                                type: "search",
                                value: Texto,
                                disabled: false,
                            }}
                            search={search}
                        // handleChange={handleChange}
                        />
                    </div>
                    <div className="col-md-2"></div>
                    <div className="col-md-4">
                        <BtnNew
                            attribute={{
                                name: "btnNuevo",
                                value: "Nuevo evento",
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
                                <th style={{ textAlign: "left" }}>EVENTO</th>
                                <th style={{ textAlign: "left" }}>F. CREACION</th>
                                <th style={{ textAlign: "left" }}>ESTADO</th>
                                <th style={{ textAlign: "left" }}>ACCION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ListarItems.map((item, key) => (
                                <tr key={key}>
                                    <th>{item.id}</th>
                                    <td style={{ textAlign: "LEFT" }}>{item.name}</td>
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
                                            className="fas fa-edit"
                                            onClick={() => editar(item)}
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
}

export default Evento;