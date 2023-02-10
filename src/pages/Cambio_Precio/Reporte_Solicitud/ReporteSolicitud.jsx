import React, { useRef, useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import McCliente from "../Modals_General/McCliente";
import McOrgVentas from "../Modals_General/McOrgVentas";
import BtnSearch from "../../../components/BtnSearch";
import InputForm from "../../../components/InputForm";
import InputForm1 from "../../../components/InputForm1";
import Spinner from "../../../components/Spinner";
import Pagination from "../../../components/Pagination";
import jwt from "jwt-decode";
import jwtDecode from "jwt-decode";
import {
    ListadoReporteSolicitud,
} from "../../../Services/ServiceCambioPrecio";
import {
    getDistinctUser,
    getUser,
    getUsers,
} from "../../../Services/ServiceUser";
import "./ReporteSolicitud.css"

import {
    getOficinaVentasSAP,
    RegistrarAuditoria,
} from "../../../Services/ServiceAuditoria";
import SelectFormMd from "../../../components/SelectFormModal";

const ReporteSolicitud = () => {
    // ORG VENTAS
    const [orgVentasValue, setOrgVentasValue] = useState("");
    const [orgVentasName, setOrgVentasName] = useState("");
    const [orgVentas, setOrgVentas] = useState([
        { Sign: "I", Option: "EQ", Low: "", High: "" },
    ]);
    const [showOrgVentas, setShowOrgVentas] = useState(false);

    // USERS
    const [users, setUsers] = useState([]);
    const [usersG, setUsersG] = useState([]);

    // CLIENTE
    //const [IsCliente, setIsCliente] = useState("");
    const [isClientName, setIsClientName] = useState("");
    const [showMcCliente, setShowMcCliente] = useState(false);

    // FILTRO ESTADO COMBO: 1=APROBADO, 2=PENDIENTE, 3=RECHAZADO
    //const [estado, setState] = useState("");

    // PAGINATION
    const [datosxpagina, setDatosxpagina] = useState(10); // para el input
    const [limit, setLimit] = useState(10);
    const [offset, setOffset] = useState(1);

    // SOLICITUDES OBJECT
    const [solicitudes, setSolicitudes] = useState([]);

    //CARGA DE SPINNER
    const [spinner, setspinner] = useState(false);
    //ACTIVAR SECCION DE PAGINADO
    const [valuepagination, setvaluepagination] = useState(false);
    //NUMERO TOTAL DE DATOS
    const [TotalData, setTotalData] = useState();

    // PARA OBTENER CANAL DE DIST. DE MATCH CLIENTE
    const [canalDistValue, setCanalDistValue] = useState("");
    const [canalDistDescValue, setCanalDistDescValue] = useState("");

    // OBTENER OFICINA DE VENTAS PARA REGISTRAR EN TB_REQUEST
    const [ofiVentas, setOfiVentas] = useState("");

    // PARAMETROS FILTRO REPORTE
    const [idSolicitante, setIdSolicitante] = useState(0);
    const [orgVentas1, setOrgVentas1] = useState('');
    const [nroSolicitud, setNroSolicitud] = useState(0);
    //const [fechSolicitud, setFechaSolicitud] = useState('');
    const [codiCliente, setCodiCliente] = useState('');
    const [estado1, setEstado1] = useState('');
    const [idAprobador, setIdAprobador] = useState(0);
    //const [fechAprob, setFechaAprob] = useState('');

    const [filtro, setFiltro] = useState({
        fechSolicitud: "",
        fechAprob: ""
    });

    useEffect(() => {
        getUsers();
        getUsersGerente();
        listadoReporteSolicitudes(1);
    }, []);

    const getUsers = () => {
        getDistinctUser(jwtDecode(localStorage.getItem("_token")).nameid, 2).then(
            (result) => {
                console.log("USUARIO NORMAL", result);
                setUsers(result.data);
            }
        );
    };

    //console.log("PRUEBITA", users)

    const getUsersGerente = () => {
        getDistinctUser(jwtDecode(localStorage.getItem("_token")).nameid, 3).then(
            (result) => {
                console.log("LISTADO GERENTE", result);
                setUsersG(result.data);
            }
        );
    };

    // console.log("PRUEBITA 2", usersG)

    const openMcOrgVentas = () => {
        setShowOrgVentas((prev) => !prev);
    };

    const openMcCliente = () => {
        setShowMcCliente((prev) => !prev);
    };

    function clear() {
        setFiltro({
            fechSolicitud: '',
            fechAprob: ''
        })
        setOrgVentas1("");
        setNroSolicitud(0);
        //setFechaSolicitud("");
        setCodiCliente("");
        //setFechaAprob("");
        setEstado1("")
        document.hola = document.getElementById('id_estado').value = "0";
        setIdSolicitante(0);
        document.hola = document.getElementById('id_solicitante').value = "0";
        setIdAprobador(0);
        document.hola = document.getElementById('id_aprobador').value = '0';
        document.getElementById('id_aprobador').disabled = false
        document.getElementById('fechAprob').disabled = false

        let model = {
            id_solicitante: 0,
            org_ventas: '',
            nro_solicitud: 0,
            fecha_solicitud: '',
            codi_cliente: '',
            estado: '',
            id_aprobador: 0,
            fecha_aprob: ''
        };
        // setspinner(true);
        // console.log('MODEL LIMPIAR', model)
        ListadoReporteSolicitud(
            model,
            limit,
            1
        ).then(result => {
            console.log('RESULTADO', result);
            setSolicitudes(result.data);
            setTotalData(result.totalItems);
            setspinner(false);
            setvaluepagination(true);
            // console.log("Filtrado Reporte", result);
        })
    }

    const [showModalPagina, setshowModalPagina] = useState(false);
    const modalRef = useRef();
    const [ItemsNumberDates, setItemsNumberDates] = useState([
        { id: 10, name: 10 },
        { id: 20, name: 20 },
        { id: 50, name: 50 },
        { id: 100, name: 100 },
    ]);

    const closeModal = (e) => {
        if (modalRef.current === e.target) {
            setDatosxpagina(limit);
            setshowModalPagina(false);
        }
    };

    function openDatosPagina() {
        // showModalPagina == true
        setshowModalPagina((prev) => !prev);
    }

    function Search_02(page, numdatos) {
        let model = {
            id_solicitante: idSolicitante,
            org_ventas: orgVentas1,
            nro_solicitud: nroSolicitud,
            fecha_solicitud: filtro.fechSolicitud,
            codi_cliente: codiCliente,
            estado: estado1,
            id_aprobador: idAprobador,
            fecha_aprob: filtro.fechAprob
        };
        setspinner(true);
        console.log('MODEL', model)
        console.log(limit, ' ', offset)
        ListadoReporteSolicitud(
            model,
            numdatos,
            page
        ).then(result => {
            console.log('RESULTADO', result);
            setSolicitudes(result.data);
            setTotalData(result.totalItems);
            setspinner(false);
            setvaluepagination(true);
            // console.log("Filtrado Reporte", result);
        })
    }

    const Search = () => {
        listadoReporteSolicitudes(1);
        // OBTENER OFICINA DE VENTAS DE USUARIO DESDE SAP
        let ofi_ventas = "";
        getOficinaVentasSAP({
            IsUser: jwt(localStorage.getItem("_token")).username,
        }).then((result) => {
            if (result.etOfiVentasField.length) {
                ofi_ventas =
                    result.etOfiVentasField[0].codOfventaField +
                    " - " +
                    result.etOfiVentasField[0].descripcionField;
                //REGISTRO DE AUDITORÍA
                RegistrarAuditoria({
                    id_user: Number(jwt(localStorage.getItem("_token")).nameid),
                    id_event: 9,
                    sales_ofi: ofi_ventas,
                    indicator: "WEB",
                });
            }
        });
    }

    const listadoReporteSolicitudes = (page) => {
        // console.log("probando reporte", item);
        let model = {
            id_solicitante: idSolicitante,
            org_ventas: orgVentas1,
            nro_solicitud: nroSolicitud,
            fecha_solicitud: filtro.fechSolicitud,
            codi_cliente: codiCliente,
            estado: estado1,
            id_aprobador: idAprobador,
            fecha_aprob: filtro.fechAprob
        };
        setspinner(true);
        console.log('MODEL', model)
        console.log(limit, ' ', offset)
        ListadoReporteSolicitud(
            model,
            limit,
            page
        ).then(result => {
            console.log('RESULTADO', result);
            setSolicitudes(result.data);
            setTotalData(result.totalItems);
            setspinner(false);
            setvaluepagination(true);
            // console.log("Filtrado Reporte", result);
        })
    }

    const selectedFiltro = (e) => {
        // console.log(typeof e.target.value);
        if (e.target.value == "0") {
            // console.log("zero");
            setEstado1("");
            document.getElementById('id_aprobador').disabled = false
            document.getElementById('fechAprob').disabled = false
        } else if (e.target.value == "2") {
            document.getElementById('id_aprobador').disabled = true
            document.getElementById('fechAprob').disabled = true
            document.hola = document.getElementById('id_aprobador').value = "0";
            setIdAprobador(0);
            setFiltro({
                fechAprob: ''
            })
            setEstado1(e.target.value);
        } else if (e.target.value == "4") {
            document.getElementById('id_aprobador').disabled = true
            document.getElementById('fechAprob').disabled = true
            document.hola = document.getElementById('id_aprobador').value = "0";
            setIdAprobador(0);
            setFiltro({
                fechAprob: ''
            })
            setEstado1(e.target.value);
        }
        else if (e.target.value != "2") {
            document.getElementById('id_aprobador').disabled = false
            document.getElementById('fechAprob').disabled = false
            setEstado1(e.target.value);
        } else if (e.target.value != "4") {
            document.getElementById('id_aprobador').disabled = false
            document.getElementById('fechAprob').disabled = false
            setEstado1(e.target.value);
        }
        else {
            // console.log(e.target.value);
            setEstado1(e.target.value);
        }
    };

    const formatFecha = (fecha) => {
        let newDate = "";
        if (fecha != null || fecha != undefined || fecha != "") {
            newDate = fecha.split("-");
        }
        return newDate[2] + "-" + newDate[1] + "-" + newDate[0];
    };

    const extraeFecha = (fecha) => {
        if (fecha.includes("T")) {
            let parts = fecha.split("T");
            return formatFecha(parts[0]);
        } else {
            return formatFecha(fecha);
        }
    };

    /*const validateState = (estado) => {
        if (estado == "1") {
            return "APROBADO";
        } else if (estado == "2") {
            return "PENDIENTE";
        } else if (estado == "3") {
            return "RECHAZADO";
        } else {
            return "ANULADO";
        }
    };*/

    const handleChange1 = (e) => {
        setFiltro({ ...filtro, [e.target.name]: e.target.value });
    };

    function handleChange(name, value) {
        console.log(name, value);
        switch (name) {
            case "id_ndatos":
                setLimit(value);
                Search_02(1, value);
                setshowModalPagina((prev) => !prev);
                break;
            case "num_datos_pagina":
                setDatosxpagina(value);
                break;
            case "org_ventas":
                setOrgVentasValue(value);
                break;
            case "cliente":
                setCodiCliente(value);
                break;
            case "nroSolicitud":
                setNroSolicitud(Number(value));
                break;
            // case "fecha_solicitud":
            //     setFechaSolicitud(value);
            //     break;
            // case "fecha_aprob":
            //     setFechaAprob(value);
            //     break;
            case "id_aprobador":
                setIdAprobador(value);
                break;
            default:
                setIdSolicitante(value);
                break;
        }
    }


    // PAGINATION
    const changePage = (pageNumber) => {
        console.log('page', pageNumber)
        setOffset(pageNumber);
        listadoReporteSolicitudes(pageNumber);
    };
    // siguiente pagina
    const prevPage = (value) => {
        setOffset(value - 1);
        listadoReporteSolicitudes(value - 1);
    };
    //pagina anterior
    const nextPage = (value) => {
        setOffset(value + 1);
        listadoReporteSolicitudes(value + 1);
    };

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

    const selectedItem = (e) => {
        // console.log(e.target.name, " - ", e.target.value);
        if (e.target.name == "id_solicitante") {
            if (e.target.value == "0") {
                // console.log("zero");
                setIdSolicitante(0);
            } else {
                // console.log(e.target.value);

                setIdSolicitante(Number(e.target.value));
            }
        } else if (e.target.name == "id_aprobador") {
            if (e.target.value == "0") {
                // console.log("zero");
                setIdAprobador(0);
            }
            else {
                // console.log(e.target.value);

                setIdAprobador(Number(e.target.value));
            }
        }
    };

    const getDateAct = () => {
        let date = new Date();

        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();

        if (month < 10) {
            return `${day}/0${month}/${year}`;
            // console.log(`${day}-0${month}-${year}`);
        } else {
            return `${day}/${month}/${year}`;
            // console.log(`${day}-${month}-${year}`);
        }
    };

    return (
        <React.Fragment>
            <div className="container-view">
                <Toaster />
                <McOrgVentas
                    orgVentasValue={orgVentas1}
                    setOrgVentas={setOrgVentas}
                    setOrgVentasValue={setOrgVentas1}
                    setShowOrgVentas={setShowOrgVentas}
                    showOrgVentas={showOrgVentas}
                    setOrgVentasName={setOrgVentasName}
                />
                <McCliente
                    IsCliente={codiCliente}
                    setIsCliente={setCodiCliente}
                    setShowMcCliente={setShowMcCliente}
                    showMcCliente={showMcCliente}
                    setIsClientName={setIsClientName}
                    orgVentasValue={orgVentasValue}
                    setCanalDistValue={setCanalDistValue}
                    setCanalDistDescValue={setCanalDistDescValue}
                    setOfiVentas={setOfiVentas}
                />

                {showModalPagina ? (
                    <React.Fragment>
                        <div
                            className="container-modal-background"
                            onClick={closeModal}
                            ref={modalRef}
                        >
                            <div className="modal-wrapper modal-wrapper-paginate p-5">
                                <div className="col-sm-12 d-flex align-items-center">
                                    <label>Número de filas por página</label>
                                </div>
                                <div className="col-sm-12">
                                    <SelectFormMd
                                        attribute={{ name: "id_ndatos", disabled: false, default: 0 }}
                                        values={ItemsNumberDates}
                                        handleChange={handleChange}
                                    ></SelectFormMd>
                                </div>
                                <div
                                    className="close-modal-button"
                                    onClick={() => {
                                        setshowModalPagina((prev) => !prev);
                                        setDatosxpagina(limit);
                                    }}
                                >
                                    <i className="fas fa-times"></i>
                                </div>
                            </div>
                        </div>
                    </React.Fragment>
                ) : null}
                <div className="title-section">
                    <div>
                        <label>Cambio Precio / Reporte de Solicitud </label>
                        <label>
                            {" "}
                            Tipo de cambio :{" "}
                            <i style={{ color: "#008040" }} className="fas fa-dollar-sign"></i>{" "}
                            <label style={{ color: "#008040", fontSize: "17px" }}>
                                {localStorage.getItem("_tipoCambio")}
                            </label>{" "}
                        </label>
                    </div>
                    <div style={{ justifyContent: "flex-end", display: "flex" }} className="col-md-12">
                        <label>
                            {" "}
                            Fecha :{" "}
                            {/* <i class="fas fa-dollar-sign"></i> {" "}:{" "} */}
                            <label style={{ color: "#008040" }}>
                                {getDateAct()}
                            </label>{" "}
                        </label>
                    </div>


                    <hr />
                </div>

                {/* MIS APROBACIONESSSSS */}

                <div className="container-form2">
                    <div className="container-form1" style={{ width: "90%" }}>
                        {/* 1RA FILA */}
                        <div>
                            <div className="col-sm-2 d-flex align-items-center">
                                <label>N° Solicitud :</label>
                            </div>
                            <div style={{ marginRight: "40px" }}>
                                <InputForm1
                                    attribute={{
                                        name: "nroSolicitud",
                                        type: "text",
                                        value: nroSolicitud,
                                        disabled: false,
                                        checked: false,
                                        matchcode: false,
                                    }}
                                    handleChange={handleChange}
                                    onChange={(e) => handleChange(e)}
                                />
                            </div>
                            <div className="col-sm-2 d-flex align-items-center">
                                <label>Estado : </label>
                            </div>
                            <div className="input-box1">
                                <select id="id_estado" name="id_estado" className="inputform" onChange={(e) => selectedFiltro(e)}>
                                    <option value="0" selected="selected">TODOS</option>
                                    <option value="1">APROBADO</option>
                                    <option value="2">PENDIENTE</option>
                                    <option value="3">RECHAZADO</option>
                                    <option value="4">ANULADO</option>

                                </select>
                            </div>
                        </div>
                        {/* 2DA FILA */}
                        <div >
                            <div className="col-sm-2 d-flex align-items-center">
                                <label>Solicitante : </label>
                            </div>
                            <div className="input-box1" style={{ marginRight: "45px" }}>
                                <select id="id_solicitante" name="id_solicitante" className="inputform" onChange={(e) => selectedItem(e)}>
                                    <option value="0">Seleccione...</option>
                                    {users.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.name + " " + item.ape_pat + " " + item.ape_mat}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-sm-2 d-flex align-items-center">
                                <label>Aprobador : </label>
                            </div>
                            <div className="input-box1">
                                <select id="id_aprobador" className="inputform" name="id_aprobador" onChange={(e) => selectedItem(e)}>
                                    <option value="0">Seleccione...</option>
                                    {usersG.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.name + " " + item.ape_pat + " " + item.ape_mat}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        {/* 3RA FILA */}
                        <div>
                            <div className="col-sm-2 d-flex align-items-center">
                                <label>Org. de ventas : </label>
                            </div>
                            <div style={{ marginRight: "40px" }}>
                                <InputForm1
                                    attribute={{
                                        name: "org_ventas",
                                        type: "text",
                                        value: orgVentas1,
                                        disabled: true,
                                        checked: false,
                                        matchcode: true,
                                        maxlength: 4,
                                    }}
                                    handleChange={handleChange}
                                    onClick={() => openMcOrgVentas()}
                                />
                            </div>
                            <div className="align-items-center" >
                                <label>{orgVentas1 != "" ? orgVentasName : ""}</label>
                            </div>
                        </div>
                        {/* 4TA FILA */}
                        <div>
                            <div className="col-sm-2 d-flex align-items-center">
                                <label>Cliente : </label>
                            </div>
                            <div style={{ marginRight: "40px" }}>
                                <InputForm1
                                    attribute={{
                                        name: "cliente",
                                        type: "text",
                                        value: codiCliente,
                                        disabled: true,
                                        checked: false,
                                        matchcode: true,
                                        maxlength: 4,
                                    }}
                                    handleChange={handleChange}
                                    onClick={() => openMcCliente()}
                                />
                            </div>
                            <div className="align-items-center">
                                <label>{codiCliente != "" ? isClientName : ""}</label>
                            </div>
                        </div>
                        {/* 5TA FILA */}
                        <div className="">
                            <div className="col-sm-2 d-flex align-items-center">
                                <label>Fecha Solicitud : </label>
                            </div>
                            <div className="input-box1" style={{ marginRight: "48px" }}>
                                <input style={{ width: "200px" }}
                                    className="inputcustom"
                                    type="date"
                                    name="fechSolicitud"
                                    value={filtro.fechSolicitud}
                                    onChange={(e) => handleChange1(e)}
                                />
                            </div>
                            {/* <div className="">
                                <InputFormDate
                                    attribute={{
                                        name: "fechSolicitud",
                                        type: "date",
                                        value: filtro.fechSolicitud,
                                        disabled: false,
                                        checked: false,
                                        matchcode: false,

                                    }}
                                    handleChange={handleChange1}
                                    onChange={(e) => handleChange1(e)}
                                />
                            </div> */}

                            <div className="col-sm-2 d-flex align-items-center">
                                <label>Fecha Aprob / Rech :</label>
                            </div>
                            <div className="input-box1">
                                <input style={{ width: "215px" }}
                                    className="inputcustom"
                                    type="date"
                                    id="fechAprob"
                                    name="fechAprob"
                                    value={filtro.fechAprob}
                                    onChange={(e) => handleChange1(e)}
                                />
                            </div>
                            {/* <div>
                                <InputForm
                                    attribute={{
                                        id: "fecha_aprob",
                                        name: "fecha_aprob",
                                        type: "date",
                                        value: fechAprob,
                                        disabled: false,
                                        checked: false,

                                    }}
                                    handleChange={handleChange}
                                    //onChange={(e) => handleChange(e)}
                                />
                            </div> */}
                        </div>
                    </div>
                    <div className="mt-2">
                        <div
                            className="input-box1 mt-4 col-md-3"
                            style={{
                                flex: 1,
                                alignSelf: "center",
                            }}
                        >
                            <BtnSearch
                                attribute={{
                                    name: "Buscar",
                                    classNamebtn: "btn_search",
                                }}
                                onClick={() => Search()}
                            />
                        </div>
                        <div
                            className="input-box1 mt-4 col-md-3"
                            style={{
                                flex: 1,
                                alignSelf: "center",
                            }}
                        >
                            <BtnSearch
                                attribute={{
                                    name: "Limpiar Campos",
                                    classNamebtn: "btn_search",
                                }}
                                onClick={() => clear()}
                            />
                        </div>
                        <div
                            className="input-box1 mt-4 col-md-3"
                            style={{
                                flex: 1,
                                alignSelf: "center",
                            }}
                        >
                            <BtnSearch
                                attribute={{
                                    name: "Cantidad de Filas",
                                    classNamebtn: "btn_search",
                                }}
                                onClick={() => openDatosPagina()}
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
                                        <th style={{ textAlign: "center" }}>SOLICITANTE</th>
                                        <th style={{ textAlign: "center" }}>ORG. VENTAS</th>
                                        <th style={{ textAlign: "center" }}>N° SOLICITUD</th>
                                        <th style={{ textAlign: "center" }}>FECHA SOLICITUD</th>
                                        <th style={{ textAlign: "center" }}>CANAL DE VENTAS</th>
                                        <th style={{ textAlign: "center" }}>CLIENTE</th>
                                        <th style={{ textAlign: "center" }}>PRODUCTO</th>
                                        <th style={{ textAlign: "center" }}>MONEDA</th>
                                        <th style={{ textAlign: "center" }}>PRECIO (SUGERIDO/APROBADO)</th>
                                        <th style={{ textAlign: "center" }}>MARGEN %</th>
                                        <th style={{ textAlign: "center" }}>ESTADO</th>
                                        <th style={{ textAlign: "center" }}>APROBADOR</th>
                                        <th style={{ textAlign: "center" }}>FECHA (APROBACIÓN/RECHAZO)</th>
                                        <th style={{ textAlign: "center" }}>FECHA (FIN)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {solicitudes.length >= 1
                                        ? solicitudes.map((item, key) => (
                                            <tr key={key}>
                                                <th style={{ textAlign: "left" }}>{item.solicitante}</th>
                                                <th style={{ textAlign: "center" }}>
                                                    {item.org_ventas}
                                                </th>
                                                <th style={{ textAlign: "center" }}>
                                                    {item.nro_solicitud}
                                                </th>
                                                <th style={{ textAlign: "center" }}>
                                                    {item.fecha_solicitud}
                                                </th>
                                                <th style={{ textAlign: "center" }}>
                                                    {item.canal_ventas}
                                                </th>
                                                <th style={{ textAlign: "left" }}>
                                                    {item.cliente}
                                                </th>
                                                <th style={{ textAlign: "left" }}>
                                                    {item.producto}
                                                </th>
                                                <th style={{ textAlign: "center" }}>
                                                    {item.moneda}
                                                </th>
                                                <th style={{ textAlign: "center" }}>
                                                    {convertDecimal(item.precio)}
                                                </th>
                                                <th style={{ textAlign: "center" }}>
                                                    {(item.margen) * 100} %
                                                </th>
                                                <th style={{ textAlign: "center", color: item.estado == "ANULADO" ? "red" : "", }}>
                                                    {item.estado}
                                                </th>
                                                <th style={{ textAlign: "left" }}>
                                                    {item.aprobador}
                                                </th>
                                                <th style={{ textAlign: "center" }}>
                                                    {item.fecha_aprob}
                                                </th>
                                                <th style={{ textAlign: "center" }}>
                                                    {item.fecha_fin}
                                                </th>

                                            </tr>
                                        ))
                                        : null}
                                </tbody>
                            </table>
                            {spinner == false && solicitudes.length == 0 ? (
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
                            {spinner && <Spinner />}
                        </div>
                    </div>
                </section>
                <div>
                    {valuepagination && (
                        <Pagination
                            postsPerPage={limit}
                            totalPosts={TotalData}
                            changePage={changePage}
                            prevPage={prevPage}
                            nextPage={nextPage}
                        />
                    )}
                </div>
            </div>
            ;
        </React.Fragment>
    );

};


export default ReporteSolicitud;