import React, { useRef, useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import McCliente from "../Modals_General/McCliente";
import McOrgVentas from "../Modals_General/McOrgVentas";
import BtnSearch from "../../../components/BtnSearch";
import InputForm from "../../../components/InputForm";
import Spinner from "../../../components/Spinner";
import Pagination from "../../../components/Pagination";
import jwt from "jwt-decode";
import jwtDecode from "jwt-decode";
import {
    ListadoSolicitudes,
    ModificarStateRequest,
    GetDetalleSolicitud,
    EnviarCorreoAprob,
    UsuarioNotifi,
    ListadoReporteSolicitud,
} from "../../../Services/ServiceCambioPrecio";
import {
    getDistinctUser,
    getUser,
    getUsers,
} from "../../../Services/ServiceUser";

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
    const [idUser, setIdUser] = useState(0);

    // CLIENTE
    //const [IsCliente, setIsCliente] = useState("");
    const [isClientName, setIsClientName] = useState("");
    const [showMcCliente, setShowMcCliente] = useState(false);

    // FILTRO ESTADO COMBO: 1=APROBADO, 2=PENDIENTE, 3=RECHAZADO
    //const [estado, setState] = useState("");

    // PAGINATION
    const [limit, setLimit] = useState(5);
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
    const [fechSolicitud, setFechaSolicitud] = useState('');
    const [codiCliente, setCodiCliente] = useState('');
    const [estado1, setEstado1] = useState('');
    const [idAprobador, setIdAprobador] = useState(0);
    const [fechAprob, setFechaAprob] = useState('');

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

    const getUsersGerente = () => {
        getDistinctUser(jwtDecode(localStorage.getItem("_token")).nameid, 3).then(
            (result) => {
                console.log("LISTADO GERENTE", result);
                setUsersG(result.data);
            }
        );
    };

    const openMcOrgVentas = () => {
        setShowOrgVentas((prev) => !prev);
    };

    const openMcCliente = () => {
        setShowMcCliente((prev) => !prev);
    };

    const selectedFiltro1 = (e) => {
        // console.log(typeof e.target.value);
        if (e.target.value == "0") {
            // console.log("zero");
            setEstado1.name("TODOS");
        } else {
            // console.log(e.target.value);
            setEstado1(e.target.value);
        }
    };

    function clear(e) {
        setIdSolicitante(0);
        setOrgVentas1("");
        setNroSolicitud(0);
        setFechaSolicitud("");
        setCodiCliente("");
        
        setIdAprobador(0);
        setFechaAprob("");
        setEstado1("")

        if (setEstado1 == ("")) {
           document.getElementById('id_estado');
        } 
    
    }

    const listadoReporteSolicitudes = (page) => {
        // console.log("probando reporte", item);
        let model = {
            id_solicitante: idSolicitante,
            org_ventas: orgVentas1,
            nro_solicitud: nroSolicitud,
            fecha_solicitud: fechSolicitud,
            codi_cliente: codiCliente,
            estado: estado1,
            id_aprobador: idAprobador,
            fecha_aprob: fechAprob
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
            document.getElementById('fecha_aprob').disabled = false
        }else if(e.target.value == "2"){
            document.getElementById('id_aprobador').disabled = true
            document.getElementById('fecha_aprob').disabled = true
            setEstado1(e.target.value);
        }else if(e.target.value == "4"){
            document.getElementById('id_aprobador').disabled = true
            document.getElementById('fecha_aprob').disabled = true
            setEstado1(e.target.value);
        }
        else if(e.target.value != "2"){
            document.getElementById('id_aprobador').disabled = false
            document.getElementById('fecha_aprob').disabled = false
            setEstado1(e.target.value);
        }else if(e.target.value != "4"){
            document.getElementById('id_aprobador').disabled = false
            document.getElementById('fecha_aprob').disabled = false
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

    function handleChange(name, value) {
        console.log(name, value);
        switch (name) {
            case "org_ventas":
                setOrgVentasValue(value);
                break;
            case "cliente":
                setCodiCliente(value);
                break;
            case "nroSolicitud":
                setNroSolicitud(Number(value));
                break;
            case "fecha_solicitud":
                setFechaSolicitud(value);
                break;
            case "fecha_aprob":
                setFechaAprob(value);
                break;
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
                // setIdUser(0);
                setIdSolicitante(0);
            } else {
                // console.log(e.target.value);
                setIdUser(e.target.value);
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

                <div className="container-form2">
                    <div className="container-form" style={{ width: "100%" }}>
                        <div className="input-box col-md-4">
                            <label className="label-input">Solicitante : </label>
                            <div className="input-box2">
                                <select name="id_solicitante" className="inputform" onChange={(e) => selectedItem(e)}>
                                    <option value="0">Seleccione...</option>
                                    {users.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.name + " " + item.ape_pat + " " + item.ape_mat}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="input-box col-md-3">
                            <label className="label-input">Organización de ventas :</label>
                            <div>
                                <InputForm
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
                        </div>
                        <div className="input-box col-md-4">
                            <label className="label-input">Org. Ventas - Descripción :</label>
                            <div className="input-box2">
                                <input
                                    className="inputform"
                                    type="search"
                                    name="orgventasdesc"
                                    value={orgVentas1 != "" ? orgVentasName : ""}
                                    readOnly="disabled"
                                    placeholder="--"


                                    onChange={(e) => handleChange(e)}
                                />
                            </div>
                        </div>
                        <div className="input-box col-md-4">
                            <label className="label-input">N° Solicitud :</label>
                            <div className="input-box2">
                                <InputForm
                                    attribute={{
                                        name: "nroSolicitud",
                                        type: "text",
                                        value: nroSolicitud,
                                        disabled: false,
                                        checked: false,

                                    }}
                                    handleChange={handleChange}
                                    onChange={(e) => handleChange(e)}
                                />
                            </div>

                        </div>
                        <div className="input-box col-md-3 mt-1 pt-2">
                            <label className="label-input">Aprobador : </label>
                            <div className="">
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
                        <div className="input-box col-md-4">
                            <label className="label-input">Fecha Solicitud : </label>
                            <InputForm
                                attribute={{
                                    name: "fecha_solicitud",
                                    type: "date",
                                    value: fechSolicitud,
                                    disabled: false,
                                    checked: false,

                                }}
                                handleChange={handleChange}
                                onChange={(e) => handleChange(e)}
                            />
                        </div>
                        <div className="input-box col-md-4">
                            <label className="label-input">Cliente : </label>
                            <div className="">
                                <InputForm
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
                        </div>
                        <div className="input-box col-md-5">
                            <label className="label-input">Cliente - Descripción :</label>
                            <div className=""><InputForm
                                attribute={{
                                    name: "codigocliente",
                                    type: "search",
                                    value: codiCliente != "" ? isClientName : "",
                                    disabled: true,
                                    checked: false,
                                    placeholder: "--"
                                }}
                                handleChange={handleChange}
                                onClick={() => openMcCliente()}
                            />
                            </div>
                        </div>
                        <div className="input-box col-md-2 mt-1 pt-2">
                            <label className="label-input">Estado : </label>
                            <div className="">
                                <select id="id_estado" name="id_estado" className="inputform" onChange={(e) => selectedFiltro(e)}>
                                    <option value="0" selected="selected">TODOS</option>
                                    <option value="1">APROBADO</option>
                                    <option value="2">PENDIENTE</option>
                                    <option value="3">RECHAZADO</option>
                                    <option value="4">ANULADO</option>

                                </select>
                            </div>
                        </div>
                        
                        <div className="input-box col-md-4">
                            <label className="label-input">Fecha Aprob / Rechazo / Modi : </label>
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
                                onChange={(e) => handleChange(e)}
                            />
                        </div>
                        <div className="input-box2 mt-4 col-md-3"
                            style={{
                                flex: 1,
                                alignSelf: "center",
                            }}
                        >
                            <BtnSearch
                                attribute={{
                                    name: "Limpiar",
                                    classNamebtn: "btn_search",
                                }}
                                onClick={(e) => clear(e)}
                            />
                        </div>
                        <div className="input-box2 mt-4 col-md-3"
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
                                onClick={() => listadoReporteSolicitudes(1)}
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
                                        <th style={{ textAlign: "center" }}>FECHA (APROBACIÓN/RECHAZO/ANULACIÓN)</th>
                                        <th style={{ textAlign: "center" }}>FECHA (FIN)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {solicitudes.length >= 1
                                        ? solicitudes.map((item, key) => (
                                            <tr key={key}>
                                                <th style={{ textAlign: "center" }}>{item.solicitante}</th>
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
                                                <th style={{ textAlign: "center" }}>
                                                    {item.cliente}
                                                </th>
                                                <th style={{ textAlign: "center" }}>
                                                    {item.producto}
                                                </th>
                                                <th style={{ textAlign: "center" }}>
                                                    {item.moneda}
                                                </th>
                                                <th style={{ textAlign: "center" }}>
                                                    {item.precio}
                                                </th>
                                                <th style={{ textAlign: "center" }}>
                                                    {(item.margen) * 100} %
                                                </th>
                                                <th style={{ textAlign: "center" }}>
                                                    {item.estado}
                                                </th>
                                                <th style={{ textAlign: "center" }}>
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