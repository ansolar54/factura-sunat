import React, { useState, useEffect, useRef } from "react";
import jwt from "jwt-decode";
import ChangeStatusPassword from "../../components/ChangeStatusPassword/ChangeStatusPassword";
import Spinner from "../../components/Spinner";
import toast, { Toaster } from "react-hot-toast";
import BusquedaMult from "../../components/BusquedaMultiple/BusquedaMult";
import Mc_Org_Ventas_desde from "./Matchcode_Organ_Ventas/Mc_Org_Ventas_desde";
import Mc_Ofi_Ventas_desde from "./Matchcode_Ofi_Ventas/Mc_Ofi_Ventas_desde";
import Mc_Lista_Precio_desde from "./Matchcode_Lista_Precios/Mc_Lista_Precio_desde";
import Mc_Material_desde from "./Matchcode_Material_v2/Mc_Material_desde";
import Mc_Material_hasta from "./Matchcode_Material_v2/Mc_Material_hasta";
import Mc_Cliente_desde_v2 from "./Matchcode_Cliente/Mc_Cliente_desde_v2";
import Mc_Cliente_hasta_v2 from "./Matchcode_Cliente/Mc_Cliente_hasta_v2";
import InputForm from "../../components/InputForm";
import BtnSearch from "../../components/BtnSearch";
import Pagination from "../../components/Pagination";



const Lista_Precio = () => {
    var n = new Date();
    //Año
    var y = n.getFullYear();
    //Mes
    var m = ("0" + (n.getMonth() + 1)).slice(-2);
    //Día
    var d = ("0" + n.getDate()).slice(-2);

    const [filtroInicial, setFiltroInicial] = useState({
        valido_el: [
            { Sign: "I", Option: "EQ", Low: y + "-" + m + "-" + d, High: "" },
        ],
    });

    const [mostrar_filtro_fila, setmostrar_filtro_fila] = useState(false);
    const [ind_pagina, setind_pagina] = useState(1);

    const [type_input, settype_input] = useState("text");
    const [response_reporte_despacho, setresponse_reporte_despacho] = useState([]);

    //NUMERO TOTAL DE DATOS
    const [TotalData, setTotalData] = useState();

    //ACTIVAR SECCION DE PAGINADO
    const [valuepagination, setvaluepagination] = useState(false);
    const [IsRegxpag, setIsRegxpag] = useState(10); // cantidad de datos por página
    const [pageNumber, setpageNumber] = useState(1);
    const [indicadorfiltro, setindicadorfiltro] = useState(false);
    const [model_filtro, setmodel_filtro] = useState({});

    const [col_1, setcol_1] = useState(0);
    const [col_2, setcol_2] = useState(0);
    const [col_3, setcol_3] = useState(0);
    const [col_4, setcol_4] = useState(0);
    const [col_5, setcol_5] = useState(0);
    const [col_6, setcol_6] = useState(0);
    const [col_7, setcol_7] = useState(0);
    const [col_8, setcol_8] = useState(0);
    const [col_9, setcol_9] = useState(0);
    const [col_10, setcol_10] = useState(0);
    const [col_11, setcol_11] = useState(0);
    const [col_12, setcol_12] = useState(0);
    const [col_13, setcol_13] = useState(0);
    const [col_14, setcol_14] = useState(0);
    const [col_15, setcol_15] = useState(0);

    //CARGA DE SPINNER
    const [spinner, setspinner] = useState(false);
    //CARGA DE SPINNER DE ACCESO DE RUTA
    const [spinnerroute, setspinnerroute] = useState(false);
    //para el cambio de contraseña
    const [show_status_password, setshow_status_password] = useState(false);

    const [IsCampo, setIsCampo] = useState("");
    const [IsOrden, setIsOrden] = useState("");
    // usestate de rangos
    const [rangos, setrangos] = useState([
        { Sign: "I", Option: "EQ", Low: "", High: "" },
    ]);
    const [ind_rang, setind_rang] = useState({ num: 1, bool: false });
    //MODAL para rango (busqueda multiple)
    const [showBusMult, setshowBusMult] = useState(false);

    //ACTIVAR MODAL MATCHCODE ORGANIZACIÓN DE VENTAS
    const [showorgventa_desde, setshoworgventa_desde] = useState(false);

    //ACTIVAR MODAL MATCHCODE OFICINA DE VENTAS
    const [showofiventa_desde, setshowofiventa_desde] = useState(false);

    //ACTIVAR MODAL MATCHCODE LISTA DE PRECIOS
    const [showlistaprecio_desde, setshowlistaprecio_desde] = useState(false);

    //ACTIVAR MODAL MATCHCODE MATERIAL
    const [showmaterial_desde, setshowmaterial_desde] = useState(false);
    const [showmaterial_hasta, setshowmaterial_hasta] = useState(false);

    //ACTIVAR MODAL MATCHCODE CLIENTE
    const [showcliente_desde, setshowcliente_desde] = useState(false);
    const [showcliente_hasta, setshowcliente_hasta] = useState(false);

    //INPUT Organización ventas
    const [org_ventas, setorg_ventas] = useState([
        { Sign: "I", Option: "EQ", Low: "", High: "" },
    ]);
    const [org_ventas_desde, setorg_ventas_desde] = useState("");
    const [org_ventas_hasta, setorg_ventas_hasta] = useState("");
    const [orgVentasName, setOrgVentasName] = useState("");

    //INPUT Oficina de ventas
    const [ofi_ventas, setofi_ventas] = useState([
        { Sign: "I", Option: "EQ", Low: "", High: "" },
    ]);
    const [ofi_ventas_desde, setofi_ventas_desde] = useState("");
    const [ofi_ventas_hasta, setofi_ventas_hasta] = useState("");
    const [ofiVentasName, setofi_ventas_name] = useState("");

    //INPUT Lista de Precios
    const [lista_precio, setlista_precio] = useState([
        { Sign: "I", Option: "EQ", Low: "", High: "" },
    ]);
    const [lista_precio_desde, setlista_precio_desde] = useState("");
    const [lista_precio_hasta, setlista_precio_hasta] = useState("");
    const [listaPrecioName, setlista_precio_name] = useState("");

    //INPUT Material
    const [material, setmaterial] = useState([
        { Sign: "I", Option: "EQ", Low: "", High: "" },
    ]);
    const [material_desde, setmaterial_desde] = useState("");
    const [material_hasta, setmaterial_hasta] = useState("");

    //INPUT Cliente
    const [cliente, setcliente] = useState([
        { Sign: "I", Option: "EQ", Low: "", High: "" },
    ]);
    const [cliente_desde, setcliente_desde] = useState("");
    const [cliente_hasta, setcliente_hasta] = useState("");


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

    const formatFecha = (fecha) => {
        // console.log(fecha);
        let newDate = "";
        if (fecha != null || fecha != undefined || fecha != "") {
            if (fecha.length == 10) {
                newDate = fecha.split("-");
                return newDate[2] + "-" + newDate[1] + "-" + newDate[0];
            } else {
                return (
                    fecha.substr(6, 2) +
                    "-" +
                    fecha.substr(4, 2) +
                    "-" +
                    fecha.substr(0, 4)
                );
            }
        }
    };

    // seleccionar pagina
    function changePage(pageNumber) {
        setresponse_reporte_despacho([]);
        if (indicadorfiltro == false) {
            Search(pageNumber, 1, IsCampo, IsOrden);
        } else {
            setpageNumber(pageNumber);
            buscar_filtro_fila(pageNumber, IsCampo, IsOrden);
            // SearchFiltro();
        }
    }
    // siguiente pagina
    function prevPage(value) {
        setresponse_reporte_despacho([]);

        if (indicadorfiltro == false) {
            Search(value - 1, 1, IsCampo, IsOrden);
        } else {
            setmodel_filtro({ ...model_filtro, IsNpag: value - 1 });
            // SearchFiltro();
            buscar_filtro_fila(value - 1, IsCampo, IsOrden);
        }
    }
    //pagina anterior
    function nextPage(value) {
        setresponse_reporte_despacho([]);

        if (indicadorfiltro == false) {
            Search(value + 1, 1, IsCampo, IsOrden);
        } else {
            setmodel_filtro({ ...model_filtro, IsNpag: value + 1 });
            // SearchFiltro();
            buscar_filtro_fila(value + 1, IsCampo, IsOrden);
        }
    }

    function Search(page, ind, IsCampo, IsOrden) { }

    function buscar_filtro_fila(pageNumber, IsCampo, IsOrden) { }

    function handleChangeColumna(num_col) { }

    function Clear() {

    }

    // function buscar_filtro_icono_btn() {
    //     buscar_filtro_fila(1, "", "");
    // }

    const ValidacionSearch = () => { }

    function handleChange(name, value) {

    }

    function handleChangeFiltro(name, value) { }

    function buscar_filtro_enter(event) { }

    //INPUT organización de ventas
    function mc_org_ventas_desde() {
        setshoworgventa_desde((prev) => !prev);
    }

    //INPUT oficina de ventas
    function mc_ofi_ventas_desde() {
        setshowofiventa_desde((prev) => !prev);
    }

    //INPUT lista de precios
    function mc_lista_precio_desde() {
        setshowlistaprecio_desde((prev) => !prev);
    }

    //INPUT material
    function mc_material_desde() {
        setshowmaterial_desde((prev) => !prev);
    }
    function mc_material_hasta() {
        setshowmaterial_hasta((prev) => !prev);
    }

    //INPUT cliente
    function mc_cliente_desde() {
        if (org_ventas_desde != "" && ofi_ventas_desde != "" && lista_precio_desde != "") {
            setshowcliente_desde((prev) => !prev);
        }
        else if (org_ventas_desde == "" && lista_precio_desde == "" && ofi_ventas_desde == "") {
            toast.error("Debe seleccionar una \"Org. Ventas\", \"Oficina de Ventas\" y \"Lista de Precios\".", {
                position: "top-center",
                autoClose: 1000,
                style: {
                    backgroundColor: "#212121",
                    color: "#fff",
                }
            })
        }
        else if (lista_precio_desde == "" && ofi_ventas_desde == "") {
            toast.error("Debe seleccionar una \"Oficina de Ventas\" y \"Lista de Precios\".", {
                position: "top-center",
                autoClose: 1000,
                style: {
                    backgroundColor: "#212121",
                    color: "#fff",
                }
            })
        }
        else if (org_ventas_desde == "" && lista_precio_desde == "") {
            toast.error("Debe seleccionar una \"Org. Ventas\" y \"Lista de Precios\".", {
                position: "top-center",
                autoClose: 1000,
                style: {
                    backgroundColor: "#212121",
                    color: "#fff",
                }
            })
        }
        else if (org_ventas_desde == "" && ofi_ventas_desde == "") {
            toast.error("Debe seleccionar una \"Org. Ventas\" y \"Oficina de Ventas\".", {
                position: "top-center",
                autoClose: 1000,
                style: {
                    backgroundColor: "#212121",
                    color: "#fff",
                }
            })
        }
        else if (org_ventas_desde == "") {
            toast.error("Debe seleccionar una Org. Ventas.", {
                position: "top-center",
                autoClose: 1000,
                style: {
                    backgroundColor: "#212121",
                    color: "#fff",
                }
            })
        }
        else if (ofi_ventas_desde == "") {
            toast.error("Debe seleccionar una Oficina Ventas.", {
                position: "top-center",
                autoClose: 1000,
                style: {
                    backgroundColor: "#212121",
                    color: "#fff",
                }
            })
        }
        else if (lista_precio_desde == "") {
            toast.error("Debe seleccionar una Lista de Precios.", {
                position: "top-center",
                autoClose: 1000,
                style: {
                    backgroundColor: "#212121",
                    color: "#fff",
                }
            })
        }


    }
    function mc_cliente_hasta() {
        if (org_ventas_desde != "" && ofi_ventas_desde != "" && lista_precio_desde != "") {
            setshowcliente_hasta((prev) => !prev);
        }
        else if (org_ventas_desde == "" && lista_precio_desde == "" && ofi_ventas_desde == "") {
            toast.error("Debe seleccionar una \"Org. Ventas\", \"Oficina de Ventas\" y \"Lista de Precios\".", {
                position: "top-center",
                autoClose: 1000,
                style: {
                    backgroundColor: "#212121",
                    color: "#fff",
                }
            })
        }
        else if (lista_precio_desde == "" && ofi_ventas_desde == "") {
            toast.error("Debe seleccionar una \"Oficina de Ventas\" y \"Lista de Precios\".", {
                position: "top-center",
                autoClose: 1000,
                style: {
                    backgroundColor: "#212121",
                    color: "#fff",
                }
            })
        }
        else if (org_ventas_desde == "" && lista_precio_desde == "") {
            toast.error("Debe seleccionar una \"Org. Ventas\" y \"Lista de Precios\".", {
                position: "top-center",
                autoClose: 1000,
                style: {
                    backgroundColor: "#212121",
                    color: "#fff",
                }
            })
        }
        else if (org_ventas_desde == "" && ofi_ventas_desde == "") {
            toast.error("Debe seleccionar una \"Org. Ventas\" y \"Oficina de Ventas\".", {
                position: "top-center",
                autoClose: 1000,
                style: {
                    backgroundColor: "#212121",
                    color: "#fff",
                }
            })
        }
        else if (org_ventas_desde == "") {
            toast.error("Debe seleccionar una Org. Ventas.", {
                position: "top-center",
                autoClose: 1000,
                style: {
                    backgroundColor: "#212121",
                    color: "#fff",
                }
            })
        }
        else if (ofi_ventas_desde == "") {
            toast.error("Debe seleccionar una Oficina Ventas.", {
                position: "top-center",
                autoClose: 1000,
                style: {
                    backgroundColor: "#212121",
                    color: "#fff",
                }
            })
        }
        else if (lista_precio_desde == "") {
            toast.error("Debe seleccionar una Lista de Precios.", {
                position: "top-center",
                autoClose: 1000,
                style: {
                    backgroundColor: "#212121",
                    color: "#fff",
                }
            })
        }
        
    }

    return (
        <React.Fragment>
            {/* {showModalPagina ? (
                // <React.Fragment>
                //     <div
                //         className="container-modal-background"
                //         //onClick={closeModal}
                //         ref={modalRef}
                //     >
                //         <div className="modal-wrapper modal-wrapper-paginate p-5">
                //             <div className="col-sm-12 d-flex align-items-center">
                //                 <label>Número de datos por página</label>
                //             </div>
                //             <div className="col-sm-12">
                //                 <SelectFormMd
                //                     attribute={{ name: "id_role", disabled: false, default: 0 }}
                //                     values={ItemsNumberDates}
                //                     handleChange={handleChange}
                //                 ></SelectFormMd>
                //             </div>
                //             <div
                //                 className="close-modal-button"
                //                 onClick={() => {
                //                     setshowModalPagina((prev) => !prev);
                //                     setDatosxpagina(IsRegxpag);
                //                 }}
                //             >
                //                 <i className="fas fa-times"></i>
                //             </div>
                //         </div>
                //     </div>
                // </React.Fragment>
            ) : null} */}
            {show_status_password ? (
                <ChangeStatusPassword
                    setshow_status_password={setshow_status_password}
                />
            ) : null}
            {spinnerroute ? (
                <Spinner />
            ) : (
                <React.Fragment>
                    {/* {accesoruta ? ( */}
                    <div className="container-view">
                        {/* MODAL DE RANGO */}
                        <BusquedaMult
                            showBusMult={showBusMult}
                            setshowBusMult={setshowBusMult}
                            rangos={rangos}
                            setrangos={setrangos}
                            ind_rangos={ind_rang}
                            setind_rangos={setind_rang}
                            type_input={type_input}
                            settype_input={settype_input}
                        />
                        {/* MODAL MATCHCODE ORGANIZACION DE VENTAS */}
                        <Mc_Org_Ventas_desde
                            showorgventa={showorgventa_desde}
                            setshoworgventa={setshoworgventa_desde}
                            setorg_ventas_desde={setorg_ventas_desde}
                            org_ventas_desde={org_ventas_desde}
                            org_ventas_hasta={org_ventas_hasta}
                            setorg_ventas={setorg_ventas}
                            setOrgVentasName={setOrgVentasName}
                        />
                        {/* MODAL MATCHCODE OFICINA DE VENTAS */}
                        <Mc_Ofi_Ventas_desde
                            showofiventa={showofiventa_desde}
                            setshowofiventa={setshowofiventa_desde}
                            setofi_ventas_desde={setofi_ventas_desde}
                            ofi_ventas_desde={ofi_ventas_desde}
                            ofi_ventas_hasta={ofi_ventas_hasta}
                            setofi_ventas={setofi_ventas}
                            setofi_ventas_name={setofi_ventas_name}
                        />
                        {/* MODAL MATCHCODE LISTA DE PRECIOS */}
                        <Mc_Lista_Precio_desde
                            showlistaprecio={showlistaprecio_desde}
                            setshowlistaprecio={setshowlistaprecio_desde}
                            setlista_precio_desde={setlista_precio_desde}
                            lista_precio_desde={lista_precio_desde}
                            lista_precio_hasta={lista_precio_hasta}
                            setlista_precio={setlista_precio}
                            setlista_precio_name={setlista_precio_name}
                        />
                        {/* MODAL MATCHCODE MATERIAL */}
                        <Mc_Material_desde
                            showmaterial={showmaterial_desde}
                            setshowmaterial={setshowmaterial_desde}
                            setmaterial_desde={setmaterial_desde}
                            material_desde={material_desde}
                            material_hasta={material_hasta}
                            setmaterial={setmaterial}
                        />
                        <Mc_Material_hasta
                            showmaterial={showmaterial_hasta}
                            setshowmaterial={setshowmaterial_hasta}
                            setmaterial_hasta={setmaterial_hasta}
                            material_hasta={material_hasta}
                            material_desde={material_desde}
                            setmaterial={setmaterial}
                        />

                        {/* MODAL MATCHCODE CLIENTE */}
                        <Mc_Cliente_desde_v2
                            showcliente={showcliente_desde}
                            setshowcliente={setshowcliente_desde}
                            setcliente_desde={setcliente_desde}
                            cliente_desde={cliente_desde}
                            cliente_hasta={cliente_hasta}
                            setcliente={setcliente}
                            org_ventas={org_ventas_desde}
                            ofi_ventas={ofi_ventas_desde}
                            lista_precio={lista_precio_desde}
                        />
                        <Mc_Cliente_hasta_v2
                            showcliente={showcliente_hasta}
                            setshowcliente={setshowcliente_hasta}
                            setcliente_hasta={setcliente_hasta}
                            cliente_hasta={cliente_hasta}
                            cliente_desde={cliente_desde}
                            setcliente={setcliente}
                            org_ventas={org_ventas_desde}
                            ofi_ventas={ofi_ventas_desde}
                            lista_precio={lista_precio_desde}
                        />
                        <Toaster />

                        <div className="title-section">
                            <div>
                                <label> Reportes / Lista de Precios </label>
                                <label>
                                    {" "}
                                    Tipo de cambio :{" "}
                                    <i style={{ color: "#008040" }} class="fas fa-dollar-sign"></i>{" "}
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
                        <section>
                            <div style={{ margin: "10px" }} className="row">

                                {/* Org. Ventas */}
                                <div className="col-sm-4 d-flex align-items-center">
                                    <label>
                                        <label>Organización Ventas</label>{" "}
                                        <label style={{ color: "red" }}>(*)</label>
                                    </label>
                                </div>
                                <div className="col-sm-3">
                                    <InputForm
                                        attribute={{
                                            name: "org_ventas_desde",
                                            type: "text",
                                            value: org_ventas_desde,
                                            disabled: true,
                                            checked: false,
                                            matchcode: true,
                                            maxlength: 4,
                                        }}
                                        handleChange={handleChange}
                                        onClick={() => mc_org_ventas_desde()}
                                    />
                                </div>
                                <div className="col-sm-3">
                                    <label className="py-2">
                                        {org_ventas_desde != "" ? orgVentasName : ""}
                                    </label>
                                </div>

                                {/* Oficina de Ventas */}
                                <div className="col-sm-4 d-flex align-items-center">
                                    <label>
                                        <label>Oficina de Ventas</label>{" "}
                                        <label style={{ color: "red" }}>(*)</label>
                                    </label>
                                </div>
                                <div className="col-sm-3">
                                    <InputForm
                                        attribute={{
                                            name: "ofi_ventas_desde",
                                            type: "text",
                                            value: ofi_ventas_desde,
                                            disabled: true,
                                            checked: false,
                                            matchcode: true,
                                            maxlength: 4,
                                        }}
                                        handleChange={handleChange}
                                        onClick={() => mc_ofi_ventas_desde()}
                                    />
                                </div>
                                <div className="col-sm-3">

                                    <label className="py-2">
                                        {ofi_ventas_desde != "" ? ofiVentasName : ""}
                                    </label>
                                </div>

                                {/* Lista de Precios */}
                                <div className="col-sm-4 d-flex align-items-center">
                                    <label>
                                        <label>Lista de Precios</label>{" "}
                                        <label style={{ color: "red" }}>(*)</label>
                                    </label>
                                </div>
                                <div className="col-sm-3">
                                    <InputForm
                                        attribute={{
                                            name: "lista_precio_desde",
                                            type: "text",
                                            value: lista_precio_desde,
                                            disabled: true,
                                            checked: false,
                                            matchcode: true,
                                            maxlength: 4,
                                        }}
                                        handleChange={handleChange}
                                        onClick={() => mc_lista_precio_desde()}
                                    />
                                </div>
                                <div className="col-sm-3">
                                    <label className="py-2">
                                        {lista_precio_desde != "" ? listaPrecioName : ""}
                                    </label>
                                </div>

                                {/* MATERIAL */}
                                <div className="col-sm-4 d-flex align-items-center">
                                    <label>Material</label>
                                </div>
                                <div className="col-sm-3">
                                    <InputForm
                                        attribute={{
                                            name: "material_desde",
                                            type: "text",
                                            value: material_desde,
                                            disabled: true,
                                            checked: false,
                                            matchcode: true,
                                            maxlength: 10,
                                        }}
                                        handleChange={handleChange}
                                        onClick={() => mc_material_desde()}
                                    />
                                </div>
                                <div className="col-sm-3">
                                    <InputForm
                                        attribute={{
                                            name: "material_hasta",
                                            type: "text",
                                            value: material_hasta,
                                            disabled: true,
                                            checked: false,
                                            matchcode: true,
                                            maxlength: 10,
                                        }}
                                        handleChange={handleChange}
                                        onClick={() => mc_material_hasta()}
                                    />
                                </div>
                                <div className="col-sm-2 d-flex align-items-center">
                                    <i
                                        className="fas fa-file-export icon-matchcode-2"
                                    //onClick={ChangeBusquedaMult_Cliente}
                                    ></i>
                                </div>

                                {/* CLIENTE */}
                                <div className="col-sm-4 d-flex align-items-center">
                                    <label>Cliente</label>
                                </div>
                                <div className="col-sm-3">
                                    <InputForm
                                        attribute={{
                                            name: "cliente_desde",
                                            type: "text",
                                            value: cliente_desde,
                                            disabled: true,
                                            checked: false,
                                            matchcode: true,
                                            maxlength: 10,
                                        }}
                                        handleChange={handleChange}
                                        onClick={() => mc_cliente_desde()}
                                    />
                                </div>
                                <div className="col-sm-3">
                                    <InputForm
                                        attribute={{
                                            name: "cliente_hasta",
                                            type: "text",
                                            value: cliente_hasta,
                                            disabled: true,
                                            checked: false,
                                            matchcode: true,
                                            maxlength: 10,
                                        }}
                                        handleChange={handleChange}
                                        onClick={() => mc_cliente_hasta()}
                                    />
                                </div>
                                <div className="col-sm-2 d-flex align-items-center">
                                    <i
                                        className="fas fa-file-export icon-matchcode-2"
                                    //onClick={ChangeBusquedaMult_Cliente}
                                    ></i>
                                </div>

                                {/* FECHA VALIDO EL */}
                                <div className="col-sm-4 d-flex align-items-center">
                                    <label>Valido el</label>
                                </div>
                                <div className="col-sm-3">
                                    <InputForm
                                        attribute={{
                                            name: "valido_el",
                                            type: "date",
                                            value: filtroInicial.valido_el[0].Low,
                                            disabled: true,
                                            checked: false,
                                            matchcode: false,
                                            //maxlength: 10,
                                        }}
                                        handleChange={handleChange}
                                    //onClick={() => mc_cliente_desde()}
                                    />
                                </div>
                                <div className="col-sm-3">
                                    {/* <InputForm
                                        attribute={{
                                            name: "cliente_hasta",
                                            type: "text",
                                            value: cliente_hasta,
                                            disabled: true,
                                            checked: false,
                                            matchcode: true,
                                            maxlength: 10,
                                        }}
                                        handleChange={handleChange}
                                        onClick={() => mc_cliente_hasta()}
                                    /> */}
                                </div>
                                <div className="col-sm-2 d-flex align-items-center">
                                    {/* <i
                                        className="fas fa-file-export icon-matchcode-2"
                                    //onClick={ChangeBusquedaMult_Cliente}
                                    ></i> */}
                                </div>


                            </div>
                        </section>
                        <section>
                            <div className="col-sm-12 col-md-2 p-1">
                                <BtnSearch
                                    attribute={{ name: "Buscar", classNamebtn: "btn_search" }}
                                    onClick={() => ValidacionSearch()}
                                //Search(1, 0, "", "")}
                                />
                            </div>
                            <div className="col-sm-12 col-md-2 p-1">
                                <BtnSearch
                                    attribute={{
                                        name: "Limpiar Campos",
                                        classNamebtn: "btn_search",
                                    }}
                                    onClick={() => Clear()}
                                />
                            </div>
                            {/* <div className="col-sm-12 col-md-2 p-1">
                                {arraycheckbox_export[0].data.length > 0 ? (
                                    <ExcelFile
                                        filename="Reporte de Despachos"
                                        element={
                                            <BtnExportar
                                                attribute={{
                                                    name: "Descargar Excel",
                                                    classNamebtn: "btn_export",
                                                    disabled: false,
                                                }}
                                            />
                                        }
                                    >
                                        <ExcelSheet
                                            dataSet={arraycheckbox_export}
                                            name="exportacion"
                                        />
                                    </ExcelFile>
                                ) : (
                                    <ExcelFile
                                        filename="Reporte de Despachos"
                                        element={
                                            <BtnExportar
                                                attribute={{
                                                    name: "Descargar Excel",
                                                    classNamebtn: "btn_export",
                                                    disabled: false,
                                                }}
                                            />
                                        }
                                    >
                                        <ExcelSheet dataSet={DataSet} name="exportacion" />
                                    </ExcelFile>
                                )}
                            </div> */}
                            {/* <div className="col-sm-12 col-md-2 p-1">
                                <BtnSearch
                                    attribute={{
                                        name: "Cantidad de documentos",
                                        classNamebtn: "btn_search",
                                    }}
                                    onClick={() => openDatosPagina()}
                                />
                            </div> */}
                            {/* {response_reporte_despacho.length ? (
                                <div className="col-sm-12 col-md-2 p-1">
                                    <BtnSearch
                                        attribute={{
                                            name: text_btn_filtro,
                                            classNamebtn: "btn_search",
                                        }}
                                        onClick={() => ModalFiltro()}
                                    />
                                </div>
                            ) : null} */}
                        </section>
                        <section>
                            <div className="container-table">
                                <div className="container-table-sm">
                                    <table className="content-table">
                                        <thead>
                                            <tr>
                                                {/* <th>
                                                    <input
                                                        type="checkbox"
                                                        onClick={(e) => {
                                                            onClickHeaderCheckbox(e);
                                                        }}
                                                    />
                                                </th> */}
                                                <th></th>
                                                <th>
                                                    Org. Venta |{" "}
                                                    {col_1 === 0 ? (
                                                        <i
                                                            className="fas fa-arrows-alt-v"
                                                            style={{ cursor: "pointer" }}
                                                            onClick={() => handleChangeColumna(1)}
                                                        ></i>
                                                    ) : null}
                                                    {col_1 === 1 ? (
                                                        <i
                                                            className="fas fa-sort-amount-up"
                                                            style={{ cursor: "pointer" }}
                                                            onClick={() => handleChangeColumna(1)}
                                                        ></i>
                                                    ) : null}
                                                    {col_1 === 2 ? (
                                                        <i
                                                            className="fas fa-sort-amount-down-alt"
                                                            style={{ cursor: "pointer" }}
                                                            onClick={() => handleChangeColumna(1)}
                                                        ></i>
                                                    ) : null}
                                                </th>
                                                <th>
                                                    Cod. Mat |{" "}
                                                    {col_2 === 0 ? (
                                                        <i
                                                            className="fas fa-arrows-alt-v"
                                                            style={{ cursor: "pointer" }}
                                                            onClick={() => handleChangeColumna(2)}
                                                        ></i>
                                                    ) : null}
                                                    {col_2 === 1 ? (
                                                        <i
                                                            className="fas fa-sort-amount-up"
                                                            style={{ cursor: "pointer" }}
                                                            onClick={() => handleChangeColumna(2)}
                                                        ></i>
                                                    ) : null}
                                                    {col_2 === 2 ? (
                                                        <i
                                                            className="fas fa-sort-amount-down-alt"
                                                            style={{ cursor: "pointer" }}
                                                            onClick={() => handleChangeColumna(2)}
                                                        ></i>
                                                    ) : null}
                                                </th>
                                                <th>
                                                    Material |{" "}
                                                    {col_3 === 0 ? (
                                                        <i
                                                            className="fas fa-arrows-alt-v"
                                                            style={{ cursor: "pointer" }}
                                                            onClick={() => handleChangeColumna(3)}
                                                        ></i>
                                                    ) : null}
                                                    {col_3 === 1 ? (
                                                        <i
                                                            className="fas fa-sort-amount-up"
                                                            style={{ cursor: "pointer" }}
                                                            onClick={() => handleChangeColumna(3)}
                                                        ></i>
                                                    ) : null}
                                                    {col_3 === 2 ? (
                                                        <i
                                                            className="fas fa-sort-amount-down-alt"
                                                            style={{ cursor: "pointer" }}
                                                            onClick={() => handleChangeColumna(3)}
                                                        ></i>
                                                    ) : null}
                                                </th>
                                                <th>
                                                    Precio LP |{" "}
                                                    {col_4 === 0 ? (
                                                        <i
                                                            className="fas fa-arrows-alt-v"
                                                            style={{ cursor: "pointer" }}
                                                            onClick={() => handleChangeColumna(4)}
                                                        ></i>
                                                    ) : null}
                                                    {col_4 === 1 ? (
                                                        <i
                                                            className="fas fa-sort-amount-up"
                                                            style={{ cursor: "pointer" }}
                                                            onClick={() => handleChangeColumna(4)}
                                                        ></i>
                                                    ) : null}
                                                    {col_4 === 2 ? (
                                                        <i
                                                            className="fas fa-sort-amount-down-alt"
                                                            style={{ cursor: "pointer" }}
                                                            onClick={() => handleChangeColumna(4)}
                                                        ></i>
                                                    ) : null}
                                                </th>
                                                <th style={{ textAlign: "center" }}>
                                                    Mon. |{" "}
                                                    {col_5 === 0 ? (
                                                        <i
                                                            className="fas fa-arrows-alt-v"
                                                            style={{ cursor: "pointer" }}
                                                            onClick={() => handleChangeColumna(5)}
                                                        ></i>
                                                    ) : null}
                                                    {col_5 === 1 ? (
                                                        <i
                                                            className="fas fa-sort-amount-up"
                                                            style={{ cursor: "pointer" }}
                                                            onClick={() => handleChangeColumna(5)}
                                                        ></i>
                                                    ) : null}
                                                    {col_5 === 2 ? (
                                                        <i
                                                            className="fas fa-sort-amount-down-alt"
                                                            style={{ cursor: "pointer" }}
                                                            onClick={() => handleChangeColumna(5)}
                                                        ></i>
                                                    ) : null}
                                                </th>
                                                <th style={{ textAlign: "center" }}>
                                                    Precio Min. |{" "}
                                                    {col_6 === 0 ? (
                                                        <i
                                                            className="fas fa-arrows-alt-v"
                                                            style={{ cursor: "pointer" }}
                                                            onClick={() => handleChangeColumna(6)}
                                                        ></i>
                                                    ) : null}
                                                    {col_6 === 1 ? (
                                                        <i
                                                            className="fas fa-sort-amount-up"
                                                            style={{ cursor: "pointer" }}
                                                            onClick={() => handleChangeColumna(6)}
                                                        ></i>
                                                    ) : null}
                                                    {col_6 === 2 ? (
                                                        <i
                                                            className="fas fa-sort-amount-down-alt"
                                                            style={{ cursor: "pointer" }}
                                                            onClick={() => handleChangeColumna(6)}
                                                        ></i>
                                                    ) : null}
                                                </th>
                                                <th>
                                                    Mon. |{" "}
                                                    {col_7 === 0 ? (
                                                        <i
                                                            className="fas fa-arrows-alt-v"
                                                            style={{ cursor: "pointer" }}
                                                            onClick={() => handleChangeColumna(7)}
                                                        ></i>
                                                    ) : null}
                                                    {col_7 === 1 ? (
                                                        <i
                                                            className="fas fa-sort-amount-up"
                                                            style={{ cursor: "pointer" }}
                                                            onClick={() => handleChangeColumna(7)}
                                                        ></i>
                                                    ) : null}
                                                    {col_7 === 2 ? (
                                                        <i
                                                            className="fas fa-sort-amount-down-alt"
                                                            style={{ cursor: "pointer" }}
                                                            onClick={() => handleChangeColumna(7)}
                                                        ></i>
                                                    ) : null}
                                                </th>
                                                <th>
                                                    Fecha Inicio |{" "}
                                                    {col_8 === 0 ? (
                                                        <i
                                                            className="fas fa-arrows-alt-v"
                                                            style={{ cursor: "pointer" }}
                                                            onClick={() => handleChangeColumna(8)}
                                                        ></i>
                                                    ) : null}
                                                    {col_8 === 1 ? (
                                                        <i
                                                            className="fas fa-sort-amount-up"
                                                            style={{ cursor: "pointer" }}
                                                            onClick={() => handleChangeColumna(8)}
                                                        ></i>
                                                    ) : null}
                                                    {col_8 === 2 ? (
                                                        <i
                                                            className="fas fa-sort-amount-down-alt"
                                                            style={{ cursor: "pointer" }}
                                                            onClick={() => handleChangeColumna(8)}
                                                        ></i>
                                                    ) : null}
                                                </th>
                                                <th>
                                                    Fecha Fin |{" "}
                                                    {col_9 === 0 ? (
                                                        <i
                                                            className="fas fa-arrows-alt-v"
                                                            style={{ cursor: "pointer" }}
                                                            onClick={() => handleChangeColumna(9)}
                                                        ></i>
                                                    ) : null}
                                                    {col_9 === 1 ? (
                                                        <i
                                                            className="fas fa-sort-amount-up"
                                                            style={{ cursor: "pointer" }}
                                                            onClick={() => handleChangeColumna(9)}
                                                        ></i>
                                                    ) : null}
                                                    {col_9 === 2 ? (
                                                        <i
                                                            className="fas fa-sort-amount-down-alt"
                                                            style={{ cursor: "pointer" }}
                                                            onClick={() => handleChangeColumna(9)}
                                                        ></i>
                                                    ) : null}
                                                </th>
                                                {/* <th>Acción</th> */}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {mostrar_filtro_fila == true ? (
                                                <tr>
                                                    <th>
                                                        <button
                                                            className="btn_search_filter"
                                                        //onClick={() => buscar_filtro_icono_btn()}
                                                        >
                                                            <i className="fas fa-filter"></i>
                                                        </button>
                                                    </th>
                                                    <th>
                                                        <input
                                                            type="text"
                                                            onKeyUp={(e) => buscar_filtro_enter(e)}
                                                            id="f_name1Field"
                                                            name="f_name1Field"
                                                            maxLength="30"
                                                            onChange={(e) =>
                                                                handleChangeFiltro(
                                                                    e.target.name,
                                                                    e.target.value
                                                                )
                                                            }
                                                        />
                                                    </th>
                                                    <th>
                                                        <input
                                                            type="text"
                                                            onKeyUp={(e) => buscar_filtro_enter(e)}
                                                            name="f_bstkdField"
                                                            maxLength="30"
                                                            onChange={(e) =>
                                                                handleChangeFiltro(
                                                                    e.target.name,
                                                                    e.target.value
                                                                )
                                                            }
                                                        />
                                                    </th>
                                                    <th>
                                                        <input
                                                            type="date"
                                                            onKeyUp={(e) => buscar_filtro_enter(e)}
                                                            name="f_erdatField"
                                                            style={{ paddingTop: "1.5px", paddingBottom: "1px" }} className="px-2"
                                                            onChange={(e) =>
                                                                handleChangeFiltro(
                                                                    e.target.name,
                                                                    e.target.value
                                                                )
                                                            }
                                                        />
                                                    </th>
                                                    <th>
                                                        <input
                                                            type="text"
                                                            onKeyUp={(e) => buscar_filtro_enter(e)}
                                                            name="f_aubelField"
                                                            maxLength="20"
                                                            onChange={(e) =>
                                                                handleChangeFiltro(
                                                                    e.target.name,
                                                                    e.target.value
                                                                )
                                                            }
                                                        />
                                                    </th>
                                                    <th>
                                                        <input
                                                            type="text"
                                                            onKeyUp={(e) => buscar_filtro_enter(e)}
                                                            name="f_xblnrField"
                                                            maxLength="30"
                                                            onChange={(e) =>
                                                                handleChangeFiltro(
                                                                    e.target.name,
                                                                    e.target.value
                                                                )
                                                            }
                                                        />
                                                    </th>
                                                    <th>
                                                        <input
                                                            type="text"
                                                            onKeyUp={(e) => buscar_filtro_enter(e)}
                                                            name="f_xblnr1Field"
                                                            maxLength="15"
                                                            onChange={(e) =>
                                                                handleChangeFiltro(
                                                                    e.target.name,
                                                                    e.target.value
                                                                )
                                                            }
                                                        />
                                                    </th>
                                                    <th>
                                                        <input
                                                            type="text"
                                                            onKeyUp={(e) => buscar_filtro_enter(e)}
                                                            name="f_ntransField"
                                                            maxLength="50"
                                                            onChange={(e) =>
                                                                handleChangeFiltro(
                                                                    e.target.name,
                                                                    e.target.value
                                                                )
                                                            }
                                                        />
                                                    </th>
                                                    <th style={{ textAlign: "center" }}>
                                                        <div >
                                                            <select style={{ paddingTop: "4px", paddingBottom: "3px" }} className="px-2" name="f_vkorgField"
                                                                onKeyUp={(e) => buscar_filtro_enter(e)}
                                                                //onChange={(e) => selectedFiltro(e)}
                                                                onChange={(e) =>
                                                                    handleChangeFiltro(
                                                                        e.target.name,
                                                                        e.target.value
                                                                    )
                                                                }
                                                            >
                                                                <option value="">TODOS</option>
                                                                <option value="AGRO">AGRO</option>
                                                                <option value="ESPE">ESPE</option>
                                                                <option value="SALU">SALU</option>
                                                                <option value="SEMI">SEMI</option>
                                                            </select>
                                                        </div>
                                                    </th>
                                                    <th>
                                                        <input
                                                            type="text"
                                                            onKeyUp={(e) => buscar_filtro_enter(e)}
                                                            name="f_arktxField"
                                                            maxLength="50"
                                                            onChange={(e) =>
                                                                handleChangeFiltro(
                                                                    e.target.name,
                                                                    e.target.value
                                                                )
                                                            }
                                                        />
                                                    </th>
                                                    <th>
                                                        <input
                                                            type="text"
                                                            onKeyUp={(e) => buscar_filtro_enter(e)}
                                                            name="f_werksField"
                                                            maxLength="10"
                                                            onChange={(e) =>
                                                                handleChangeFiltro(
                                                                    e.target.name,
                                                                    e.target.value
                                                                )
                                                            }
                                                        />
                                                    </th>
                                                    <th>
                                                        <input
                                                            type="text"
                                                            onKeyUp={(e) => buscar_filtro_enter(e)}
                                                            name="f_chargField"
                                                            maxLength="20"
                                                            onChange={(e) =>
                                                                handleChangeFiltro(
                                                                    e.target.name,
                                                                    e.target.value
                                                                )
                                                            }
                                                        />
                                                    </th>
                                                    <th>
                                                        <input
                                                            type="text"
                                                            onKeyUp={(e) => buscar_filtro_enter(e)}
                                                            name="f_lfimgField"
                                                            maxLength="20"
                                                            onChange={(e) =>
                                                                handleChangeFiltro(
                                                                    e.target.name,
                                                                    e.target.value
                                                                )
                                                            }
                                                        />
                                                    </th>
                                                    <th>
                                                        <input
                                                            type="text"
                                                            onKeyUp={(e) => buscar_filtro_enter(e)}
                                                            name="f_vkburbezeiField"
                                                            maxLength="30"
                                                            onChange={(e) =>
                                                                handleChangeFiltro(
                                                                    e.target.name,
                                                                    e.target.value
                                                                )
                                                            }
                                                        />
                                                    </th>
                                                    <th>
                                                        <input
                                                            type="text"
                                                            onKeyUp={(e) => buscar_filtro_enter(e)}
                                                            name="f_vkgrpbezeiField"
                                                            maxLength="25"
                                                            onChange={(e) =>
                                                                handleChangeFiltro(
                                                                    e.target.name,
                                                                    e.target.value
                                                                )
                                                            }
                                                        />
                                                    </th>
                                                    <th>
                                                        <input
                                                            type="text"
                                                            onKeyUp={(e) => buscar_filtro_enter(e)}
                                                            name="f_snameField"
                                                            maxLength="40"
                                                            onChange={(e) =>
                                                                handleChangeFiltro(
                                                                    e.target.name,
                                                                    e.target.value
                                                                )
                                                            }
                                                        />
                                                    </th>
                                                </tr>
                                            ) : null}

                                            {response_reporte_despacho != null &&
                                                response_reporte_despacho.length > 0
                                                ? response_reporte_despacho.map((response, key) => {
                                                    return (
                                                        <tr key={key}>
                                                            {/* <th>
                                                                 <input
                                                                    type="checkbox"
                                                                    id={`checkbox-body-` + response.name1Field}
                                                                    onChange={(e) => {
                                                                        setresponse_reporte_despacho(
                                                                            response_reporte_despacho.map((d) => {
                                                                                if (
                                                                                    d.name1Field == response.name1Field
                                                                                ) {
                                                                                    d.select = e.target.checked;
                                                                                    if (e.target.checked == true) {
                                                                                        if (stateChecboxHeader == true) {
                                                                                            // DataSet[0].data

                                                                                            // setDataSet([
                                                                                            //   ...DataSet,
                                                                                            //   DataSet[0].data = [
                                                                                            //     { value: d.vbelnField, style: { font: { sz: "14" } } },
                                                                                            //     { value: d.vkorgField, style: { font: { sz: "14" } } },
                                                                                            //     {
                                                                                            //       value: formatDate(d.erdatField),
                                                                                            //       style: { font: { sz: "14" } },
                                                                                            //     },
                                                                                            //     { value: d.kunnrField, style: { font: { sz: "14" } } },
                                                                                            //     { value: d.name1Field, style: { font: { sz: "14" } } },
                                                                                            //     {
                                                                                            //       value: convertDecimal(d.netwrField, 2),
                                                                                            //       style: { font: { sz: "14" } },
                                                                                            //     },
                                                                                            //     { value: d.waerkField, style: { font: { sz: "14" } } },
                                                                                            //     { value: d.text1Field, style: { font: { sz: "14" } } },
                                                                                            //     { value: d.statusField, style: { font: { sz: "14" } } },
                                                                                            //     { value: d.motivoField, style: { font: { sz: "14" } } },
                                                                                            //   ]

                                                                                            // ]);
                                                                                            DataSet[0].data.push([
                                                                                                {
                                                                                                    value: d.name1Field,
                                                                                                    style: {
                                                                                                        font: { sz: "14" },
                                                                                                    },
                                                                                                },
                                                                                                // { value: d.bezeiField, style: { font: { sz: "14" } } },
                                                                                                {
                                                                                                    value: d.bstkdField,
                                                                                                    style: {
                                                                                                        font: { sz: "14" },
                                                                                                    },
                                                                                                },
                                                                                                {
                                                                                                    value: formatDate(
                                                                                                        d.erdatField
                                                                                                    ),
                                                                                                    style: {
                                                                                                        font: { sz: "14" },
                                                                                                    },
                                                                                                },
                                                                                                {
                                                                                                    value: d.aubelField,
                                                                                                    style: {
                                                                                                        font: { sz: "14" },
                                                                                                    },
                                                                                                },
                                                                                                {
                                                                                                    value: d.xblnrField,
                                                                                                    style: {
                                                                                                        font: { sz: "14" },
                                                                                                    },
                                                                                                },
                                                                                                {
                                                                                                    value: d.xblnr1Field,
                                                                                                    style: {
                                                                                                        font: { sz: "14" },
                                                                                                    },
                                                                                                },
                                                                                                {
                                                                                                    value: d.ntransField,
                                                                                                    style: {
                                                                                                        font: { sz: "14" },
                                                                                                    },
                                                                                                },
                                                                                                {
                                                                                                    value: d.vkorgField,
                                                                                                    style: {
                                                                                                        font: { sz: "14" },
                                                                                                    },
                                                                                                },
                                                                                                {
                                                                                                    value: d.arktxField,
                                                                                                    style: {
                                                                                                        font: { sz: "14" },
                                                                                                    },
                                                                                                },
                                                                                                {
                                                                                                    value: d.werksField,
                                                                                                    style: {
                                                                                                        font: { sz: "14" },
                                                                                                    },
                                                                                                },
                                                                                                {
                                                                                                    value: d.chargField,
                                                                                                    style: {
                                                                                                        font: { sz: "14" },
                                                                                                    },
                                                                                                },
                                                                                                {
                                                                                                    value: convertDecimal(
                                                                                                        d.lfimgField,
                                                                                                        2
                                                                                                    ),
                                                                                                    style: {
                                                                                                        font: { sz: "14" },
                                                                                                    },
                                                                                                },
                                                                                                {
                                                                                                    value: d.vkburbezeiField,
                                                                                                    style: {
                                                                                                        font: { sz: "14" },
                                                                                                    },
                                                                                                },
                                                                                                {
                                                                                                    value: d.vkgrpbezeiField,
                                                                                                    style: {
                                                                                                        font: { sz: "14" },
                                                                                                    },
                                                                                                },
                                                                                                {
                                                                                                    value: d.snameField,
                                                                                                    style: {
                                                                                                        font: { sz: "14" },
                                                                                                    },
                                                                                                },
                                                                                            ]);
                                                                                            console.log(DataSet);
                                                                                        } else {
                                                                                            setarraycheckbox([
                                                                                                ...arraycheckbox,
                                                                                                {
                                                                                                    name1Field: d.name1Field,
                                                                                                },
                                                                                            ]);
                                                                                            ordenamiento(d);
                                                                                        }
                                                                                    } else if (
                                                                                        e.target.checked == false
                                                                                    ) {
                                                                                        // console.log("false")
                                                                                        // setDataSet([{columns:[], data:[]}]);
                                                                                        // // console.log(arraycheckbox_export)
                                                                                        // console.log(arraycheckbox)

                                                                                        for (
                                                                                            let i = 0;
                                                                                            i < arraycheckbox.length;
                                                                                            i++
                                                                                        ) {
                                                                                            if (
                                                                                                d.name1Field ==
                                                                                                arraycheckbox[i].name1Field
                                                                                            ) {
                                                                                                arraycheckbox.splice(i, 1);
                                                                                                arraycheckbox_export[0].data.splice(
                                                                                                    i,
                                                                                                    1
                                                                                                );
                                                                                            } else {
                                                                                                setarraycheckbox([
                                                                                                    ...arraycheckbox,
                                                                                                    {
                                                                                                        name1Field:
                                                                                                            arraycheckbox[i]
                                                                                                                .name1Field,
                                                                                                    },
                                                                                                ]);
                                                                                                ordenamiento(d);
                                                                                                // console.log(arraycheckbox)
                                                                                            }
                                                                                        }
                                                                                        for (
                                                                                            let y = 0;
                                                                                            y < DataSet[0].data.length;
                                                                                            y++
                                                                                        ) {
                                                                                            if (
                                                                                                d.name1Field ==
                                                                                                DataSet[0].data[y][0].value
                                                                                            ) {
                                                                                                //  console.log(DataSet[0].data[y])
                                                                                                arraycheckbox_export[0].data =
                                                                                                    [];
                                                                                                DataSet[0].data.splice(y, 1);
                                                                                            }
                                                                                            // console.log(DataSet);
                                                                                            // console.log(arraycheckbox_export[0].data)
                                                                                        }
                                                                                    }
                                                                                }
                                                                                return d;
                                                                            })
                                                                        );
                                                                    }}
                                                                /> 
                                                            </th> */}
                                                            <th></th>
                                                            <th style={{ textAlign: "left" }}>
                                                                {response.name1Field}
                                                            </th>
                                                            <th style={{ textAlign: "center" }}>
                                                                {response.bstkdField}
                                                            </th>
                                                            <th style={{ textAlign: "center" }}>
                                                                {formatFecha(response.erdatField)}
                                                            </th>
                                                            <th style={{ textAlign: "center" }}>
                                                                {response.aubelField}
                                                            </th>
                                                            <th
                                                                style={{ textAlign: "center" }}
                                                            >
                                                                {response.xblnrField}
                                                            </th>
                                                            <th
                                                                style={{ textAlign: "center" }}
                                                            >
                                                                {response.xblnr1Field}
                                                            </th>
                                                            <th style={{ textAlign: "left" }}>
                                                                {response.ntransField}
                                                            </th>
                                                            <th
                                                                style={{ textAlign: "center" }}
                                                            >
                                                                {response.vkorgField}
                                                            </th>
                                                            <th style={{ textAlign: "left" }}>
                                                                {response.arktxField}
                                                            </th>
                                                            <th style={{ textAlign: "center" }}>
                                                                {response.werksField}
                                                            </th>
                                                            <th style={{ textAlign: "center" }}>
                                                                {response.chargField}
                                                            </th>
                                                            <th style={{ textAlign: "center" }}>
                                                                {response.lfimgField}
                                                            </th>
                                                            <th style={{ textAlign: "center" }}>
                                                                {response.vkburbezeiField}
                                                            </th>
                                                            <th style={{ textAlign: "center" }}>
                                                                {response.vkgrpbezeiField}
                                                            </th>
                                                            <th style={{ textAlign: "left" }}>
                                                                {response.snameField}
                                                            </th>
                                                            {/* <th
                                                            //onClick={() => verPedido(response.vbelnField)}
                                                            >
                                                                <i
                                                                    className="fas fa-clipboard-list"
                                                                    title="Ver pedido"
                                                                ></i>
                                                            </th> */}
                                                        </tr>
                                                    );
                                                })
                                                : null}
                                        </tbody>
                                    </table>
                                </div>
                                {response_reporte_despacho == 0 && spinner == false ? (
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
                        </section>
                        <div>
                            {valuepagination && (
                                <Pagination
                                    postsPerPage={IsRegxpag}
                                    totalPosts={TotalData}
                                    changePage={changePage}
                                    prevPage={prevPage}
                                    nextPage={nextPage}
                                    ind={ind_pagina}
                                />
                            )}
                        </div>
                    </div>
                    {/* ) : (
                <div className="access-route">NO TIENE ACCESO A ESTE REPORTE</div>
              )} */}
                </React.Fragment>
            )}
        </React.Fragment>
    );

};
export default Lista_Precio;