import React, { useEffect, useState } from "react";
import ExcelFile from "react-data-export/dist/ExcelPlugin/components/ExcelFile";
import BtnAcept from "../../components/BtnAcept";
import Pagination from "../../components/Pagination";
import BtnExportar from "../../components/BtnExport";
import Spinner from "../../components/Spinner";
import { ConsultarAuditoria } from "../../Services/ServiceAuditoria";
import { ConsultarEventos } from "../../Services/ServiceEvent";
import "./Auditoria.css";
import ExcelSheet from "react-data-export/dist/ExcelPlugin/elements/ExcelSheet";
import { getRoleState } from "../../Services/ServiceRol";
import { MultiSelect } from "react-multi-select-component";
import BtnSearch from "../../components/BtnSearch";
const Auditoria = () => {

  const [selected, setSelected] = useState([]);
  const [selected1, setSelected1] = useState([]);

  //FILTRO
  const [filtro, setFiltro] = useState({
    search: "",
    created_at: "",
    created_up: "",
  });
  //DATOS DE AUDITORÍA
  const [dataAuditoria, setdataAuditoria] = useState([]);
  //NUMERO TOTAL DE DATOS
  const [TotalData, setTotalData] = useState();
  //CANTIDAD DE DATOS POR PÁGINA
  const Limit = 15;
  //CARGA DE SPINNER
  const [spinner, setspinner] = useState(false);
  //ACTIVAR SECCION DE PAGINADO
  const [valuepagination, setvaluepagination] = useState(false);
  //LISTA DE EVENTOS
  const [events, setEventos] = useState([]);
  //LISTA DE ROLES
  const [roles, setRoles] = useState([]);
  const [options2, setOptions2] = useState([])
  const [options3, setOptions3] = useState([])

  //para check de cabecera
  const [stateChecboxHeader, setstateChecboxHeader] = useState(false);
  //ALMACENA CHECKBOX MARCADOS INDIVIDUALMENTE PARA COMPARARLOS POR PAGINA BUSCADA Y MARCARLOS CON CHECK
  const [arraycheckbox, setarraycheckbox] = useState([]);
  //PARA ALMACENAR LOS DATOS A EXPORTAR
  const [DataSet, setDataSet] = useState([{ columns: [], data: [] }]);
  const [arraycheckbox_export, setarraycheckbox_export] = useState([
    {
      columns: [
        {
          title: "NOMBRES",
          style: { font: { sz: "18", bold: true } },
          width: { wpx: 125 },
        },
        {
          title: "APELLIDOS",
          style: { font: { sz: "18", bold: true } },
          width: { wpx: 125 },
        },
        {
          title: "USUARIO",
          style: { font: { sz: "18", bold: true } },
          width: { wpx: 125 },
        },
        {
          title: "CORREO",
          style: { font: { sz: "18", bold: true } },
          width: { wpx: 125 },
        },
        {
          title: "ROL",
          style: { font: { sz: "18", bold: true } },
          width: { wpx: 125 },
        },
        {
          title: "EVENTO",
          style: { font: { sz: "18", bold: true } },
          width: { wpx: 125 },
        },
        {
          title: "FECHA",
          style: { font: { sz: "18", bold: true } },
          width: { wpx: 125 },
        },
        {
          title: "HORA",
          style: { font: { sz: "18", bold: true } },
          width: { wpx: 125 },
        },
        {
          title: "OFI. VENTAS",
          style: { font: { sz: "18", bold: true } },
          width: { wpx: 125 },
        },
        {
          title: "ORI. INGRESO",
          style: { font: { sz: "18", bold: true } },
          width: { wpx: 125 },
        },
      ],
      data: [],
    },
  ]);

  useEffect(() => {
    listarAuditoria("", "", "", 1, 0, 0);
    listarEventos();
    listarRoles();
  }, []);

  const listarRoles = () => {
    getRoleState().then((res) => {
      setRoles(res.data);

      console.log("LISTAR ROLES", res.data);

      let data = []
      res.data.map(e => {
        data.push(
          {
            label: e.name,
            value: e.id
          }
        )
      })
      setOptions2(data)
      console.log("OPTION 2",options2);
    });
    
  };

  const listarEventos = () => {
    exportar();
    ConsultarEventos().then((res) => {
      setEventos(res.data);
      // console.log("LISTAR EVENTOS", res.data);
      // console.log(exportar)

      let data = []
      res.data.map(e => {
        data.push(
          {
            label: e.name,
            value: e.id
          }
        )
      })
      setOptions3(data)
      //console.log("OPTION 3",options3);
    });
  };


  const filtroRolEvento = () => {
    let roles = []

    if (selected.length == 0) {
      roles.push({
        id_role: 0
      })
    }
    else {
      selected.map(s => {
        roles.push({
          id_role: s.value
        })
      })
    }

    let events = []
    if (selected1.length == 0) {
      events.push({
        id_event: 0
      })
    } else {
      selected1.map(s => {
        events.push({
          id_event: s.value
        })
      })
    }
    const modelAuditoria = {
      roles: roles,
      events: events
    }

    return modelAuditoria;
  }

  //listar auditoría
  const listarAuditoria = (
    search,
    created_at,
    created_up,
    offset,
    exp,
    ind
  ) => {
    let model_auditoria = filtroRolEvento();
    //console.log('first')
    setspinner(true);
    setdataAuditoria([]);
    //console.log(Limit, ' ', offset);
    if (ind == 0) {
      // console.log('MODEL_AUDITORIA', model_auditoria)
      arraycheckbox_export[0].data = [];
      ConsultarAuditoria(
        model_auditoria,
        search,
        created_at,
        created_up,
        Limit,
        offset,
        exp,
        0
      )
        .then((result) => {
          //console.log("DATA TABLA", result);
          setdataAuditoria(
            result.data.map((d) => {
              return {
                select: false,
                id: d.id,
                name_user: d.name_user,
                ape_pat: d.ape_pat,
                ape_mat: d.ape_mat,
                username: d.username,
                email: d.email,
                name_role: d.name_role,
                name_event: d.name_event,
                created_at: d.created_at,
                sales_ofi: d.sales_ofi,
                indicator: d.indicator,
              };
            })
          );
          setTotalData(result.totalItems);
          setspinner(false);
          setvaluepagination(true);
        })
        .catch((err) => console.log(err));
    } else {
      ConsultarAuditoria(
        model_auditoria,
        search,
        created_at,
        created_up,
        Limit,
        offset,
        exp,
        0
      )
        .then((result) => {
          console.log(result);
          if (stateChecboxHeader === true) {
            setdataAuditoria(
              result.data.map((d) => {
                return {
                  select: true,
                  id: d.id,
                  name_user: d.name_user,
                  ape_pat: d.ape_pat,
                  ape_mat: d.ape_mat,
                  username: d.username,
                  email: d.email,
                  name_role: d.name_role,
                  name_event: d.name_event,
                  created_at: d.created_at,
                  sales_ofi: d.sales_ofi,
                  indicator: d.indicator,
                };
              })
            );

            for (let i = 0; i < result.data.length; i++) {
              document.getElementById(
                "checkbox-body-" + result.data[i].id
              ).checked = true;
            }
          } else {
            setdataAuditoria(
              result.data.map((d) => {
                return {
                  select: false,
                  id: d.id,
                  name_user: d.name_user,
                  ape_pat: d.ape_pat,
                  ape_mat: d.ape_mat,
                  username: d.username,
                  email: d.email,
                  name_role: d.name_role,
                  name_event: d.name_event,
                  created_at: d.created_at,
                  sales_ofi: d.sales_ofi,
                  indicator: d.indicator,
                };
              })
            );
            for (let i = 0; i < result.data.length; i++) {
              document.getElementById(
                "checkbox-body-" + result.data[i].id
              ).checked = false;
            }
          }

          for (let y = 0; y < result.data.length; y++) {
            if (arraycheckbox.length > 0) {
              for (let i = 0; i < arraycheckbox.length; i++) {
                if (result.data[y].id == arraycheckbox[i].id) {
                  document.getElementById(
                    "checkbox-body-" + result.data[y].id
                  ).checked = true;
                }
              }
            }
          }

          setTotalData(result.totalItems);
          setspinner(false);
          setvaluepagination(true);
        })
        .catch((err) => console.log(err));
    }
  };

  const exportar = () => {
    //console.log("exportar")
    // let hola;
    setDataSet([{ columns: [], data: [] }]);
    let model_auditoria = filtroRolEvento();
    let model_auditoria1 = { events: [{ id_event: 0 }], roles: [{ id_role: 0 }] };
    
    
    ConsultarAuditoria(
      // selected == [] && selected1 == []
      // ? model_auditoria1 : model_auditoria,
      model_auditoria,
      filtro.search,
      filtro.created_at,
      filtro.created_up,
      1,
      Limit,
      1)
      .then((result) => {
        console.log("EXPORTAR", result);
        setDataSet([
          {
            columns: [
              {
                title: "NOMBRES",
                style: { font: { sz: "18", bold: true } },
                width: { wpx: 125 },
              },
              {
                title: "APELLIDOS",
                style: { font: { sz: "18", bold: true } },
                width: { wpx: 150 },
              },
              {
                title: "USUARIO",
                style: { font: { sz: "18", bold: true } },
                width: { wpx: 125 },
              },
              {
                title: "CORREO",
                style: { font: { sz: "18", bold: true } },
                width: { wpx: 150 },
              },
              {
                title: "ROL",
                style: { font: { sz: "18", bold: true } },
                width: { wpx: 130 },
              },
              {
                title: "EVENTO",
                style: { font: { sz: "18", bold: true } },
                width: { wpx: 135 },
              },
              {
                title: "FECHA",
                style: { font: { sz: "18", bold: true } },
                width: { wpx: 125 },
              },
              {
                title: "HORA",
                style: { font: { sz: "18", bold: true } },
                width: { wpx: 125 },
              },
              {
                title: "OFI. VENTAS",
                style: { font: { sz: "18", bold: true } },
                width: { wpx: 125 },
              },
              {
                title: "ORI. INGRESO",
                style: { font: { sz: "18", bold: true } },
                width: { wpx: 125 },
              },
            ],
            data: result.data.map((data) => {
              //console.log("VER DATA QUE TRAE",data.sales_ofi)
              if(data.sales_ofi === null || data.sales_ofi === ''){
                data.sales_ofi = ''
              }else{
                data.sales_ofi = data.sales_ofi
              }
              if(data.indicator === null || data.indicator === ''){
                data.indicator = ''
              }else{
                data.indicator = data.indicator
              }
              //console.log("VER DATA QUE TRAE 2.0 ",data.sales_ofi)
              return [
                { value: data.name_user, style: { font: { sz: "14" } } },
                {
                  value: data.ape_pat + " " + data.ape_mat,
                  style: { font: { sz: "14" } },
                },
                {
                  value: data.username,
                  style: { font: { sz: "14" } },
                },
                { value: data.email, style: { font: { sz: "14" } } },
                { value: data.name_role, style: { font: { sz: "14" } } },
                {
                  value: data.name_event,
                  style: { font: { sz: "14" } },
                },
                {
                  value: formatDate(data.created_at),
                  style: { font: { sz: "14" } },
                },
                {
                  value: formatTime(data.created_at),
                  style: { font: { sz: "14" } },
                },
                
                {
                  value: data.sales_ofi,
                  style: { font: { sz: "14" } },
                },
                {
                  value: data.indicator,
                  style: { font: { sz: "14" } },
                },
              ];
            }),
          },
        ]);
      })
      .catch((err) => console.log(err));
  };

  function ordenamiento(d) {
    if(d.sales_ofi === null || d.sales_ofi === ''){
      d.sales_ofi = ''
    }else{
      d.sales_ofi = d.sales_ofi
    }
    if(d.indicator === null || d.indicator === ''){
      d.indicator = ''
    }else{
      d.indicator = d.indicator
    }
    arraycheckbox_export[0].data.push([
      {
        value: d.name_user,
        style: {
          font: { sz: "14" },
        },
      },
      {
        value: d.ape_pat + " " + d.ape_mat,
        style: {
          font: { sz: "14" },
        },
      },
      {
        value: d.username,
        style: {
          font: { sz: "14" },
        },
      },
      {
        value: d.email,
        style: {
          font: { sz: "14" },
        },
      },
      {
        value: d.name_role,
        style: {
          font: { sz: "14" },
        },
      },
      {
        value: d.name_event,
        style: {
          font: { sz: "14" },
        },
      },
      {
        value: formatDate(d.created_at),
        style: {
          font: { sz: "14" },
        },
      },
      {
        value: formatTime(d.created_at),
        style: {
          font: { sz: "14" },
        },
      },
      {
        value: d.sales_ofi,
        style: {
          font: { sz: "14" },
        },
      },
      {
        value: d.indicator,
        style: {
          font: { sz: "14" },
        },
      },
    ]);
    arraycheckbox_export[0].data.sort(function (a, b) {
      return a[0].value - b[0].value;
    });
  }

  // seleccionar pagina
  const changePage = (pageNumber) => {
    listarAuditoria(
      filtro.search,
      filtro.created_at,
      filtro.created_up,
      pageNumber,
      0,
      0
    );
  };
  // siguiente pagina
  const prevPage = (value) => {
    listarAuditoria(
      filtro.search,
      filtro.created_at,
      filtro.created_up,
      value - 1,
      0,
      0
    );
  };
  //pagina anterior
  const nextPage = (value) => {
    listarAuditoria(
      filtro.search,
      filtro.created_at,
      filtro.created_up,
      value + 1,
      0,
      0
    );
  };

  const handleChange = (e) => {
    setFiltro({ ...filtro, [e.target.name]: e.target.value });
  };

  /* const handleChangeCustom = (e) => {
   console.log(e);
   let roles=[]
   e.map(s=>{      
     roles.push({
       id_rol: e.value
     })
   })

   setFiltro({ ...filtro, "id_rol": roles });

   console.log(
     filtro.id_rol
   );

 }*/

  const filtrosRoles = () => {
    let roles = []
    selected.map(s => {
      roles.push({
        id_role: s.value
      })
    })

    setFiltro({ ...filtro, "roles": roles });

    //  console.log(
    //    "HOLA ROLES",filtro.roles
    //  );
  }

  const filtrosEventos = () => {
    let events = []
    selected1.map(s => {
      events.push({
        id_event: s.value
      })
    })

    setFiltro({ ...filtro, "events": events });

    //  console.log(
    //    "HOLA EVENTOS",filtro.events
    //  );
  }

  const onClickSearch = () => {
    exportar();
    listarAuditoria(
      filtro.search,
      filtro.created_at,
      filtro.created_up,
      1,
      0,
      0
    );
    filtrosRoles();
    filtrosEventos();
    //console.log("FILTRO", filtro);
  };

  //formateo de la hora
  function formatTime(value) {
    var datePart = value.match(/\d+/g),
      h = datePart[3],
      m = datePart[4],
      s = datePart[5];
    return h + ":" + m + ":" + s;
  }
  //formateo de la fecha
  function formatDate(value) {
    var datePart = value.match(/\d+/g),
      year = datePart[0],
      month = datePart[1],
      day = datePart[2];
    return day + "-" + month + "-" + year;
  }

  const customValueRendererRol = (selected, _options) => {
    return selected.length
      ? selected.map(({ label }) => "✔️ " + label)
      : "Seleccionar Rol(es)...";
  };
  const customValueRendererEvento = (selected1, _options) => {
    return selected1.length
      ? selected1.map(({ label }) => "✔️ " + label)
      : "Seleccionar Evento(s)...";
  };

  function Clear() {
      setFiltro({
        search: '',
        created_at: '',
        created_up: '',
      })
      setSelected([]);
      setSelected1([]);
    
    let model_auditoria = { events: [{ id_event: 0 }], roles: [{ id_role: 0 }] };
    console.log("MODEL AUDTIROIA LIMPIAR", model_auditoria)
    // EXPORTAR LO QUE SE MOSTRARÁ EN LA TABLA
    ConsultarAuditoria(
      model_auditoria,
      '',
      '',
      '',
      1,
      Limit,
      1)
      .then((result)=>{
        setDataSet([
          {
            columns: [
              {
                title: "NOMBRES",
                style: { font: { sz: "18", bold: true } },
                width: { wpx: 125 },
              },
              {
                title: "APELLIDOS",
                style: { font: { sz: "18", bold: true } },
                width: { wpx: 150 },
              },
              {
                title: "USUARIO",
                style: { font: { sz: "18", bold: true } },
                width: { wpx: 125 },
              },
              {
                title: "CORREO",
                style: { font: { sz: "18", bold: true } },
                width: { wpx: 150 },
              },
              {
                title: "ROL",
                style: { font: { sz: "18", bold: true } },
                width: { wpx: 130 },
              },
              {
                title: "EVENTO",
                style: { font: { sz: "18", bold: true } },
                width: { wpx: 135 },
              },
              {
                title: "FECHA",
                style: { font: { sz: "18", bold: true } },
                width: { wpx: 125 },
              },
              {
                title: "HORA",
                style: { font: { sz: "18", bold: true } },
                width: { wpx: 125 },
              },
              {
                title: "OFI. VENTAS",
                style: { font: { sz: "18", bold: true } },
                width: { wpx: 125 },
              },
              {
                title: "ORI. INGRESO",
                style: { font: { sz: "18", bold: true } },
                width: { wpx: 125 },
              },
            ],
            data: result.data.map((data) => {
              //console.log("VER DATA QUE TRAE",data.sales_ofi)
              if(data.sales_ofi === null || data.sales_ofi === ''){
                data.sales_ofi = ''
              }else{
                data.sales_ofi = data.sales_ofi
              }
              if(data.indicator === null || data.indicator === ''){
                data.indicator = ''
              }else{
                data.indicator = data.indicator
              }
              //console.log("VER DATA QUE TRAE 2.0 ",data.sales_ofi)
              return [
                { value: data.name_user, style: { font: { sz: "14" } } },
                {
                  value: data.ape_pat + " " + data.ape_mat,
                  style: { font: { sz: "14" } },
                },
                {
                  value: data.username,
                  style: { font: { sz: "14" } },
                },
                { value: data.email, style: { font: { sz: "14" } } },
                { value: data.name_role, style: { font: { sz: "14" } } },
                {
                  value: data.name_event,
                  style: { font: { sz: "14" } },
                },
                {
                  value: formatDate(data.created_at),
                  style: { font: { sz: "14" } },
                },
                {
                  value: formatTime(data.created_at),
                  style: { font: { sz: "14" } },
                },
                
                {
                  value: data.sales_ofi,
                  style: { font: { sz: "14" } },
                },
                {
                  value: data.indicator,
                  style: { font: { sz: "14" } },
                },
              ];
            }),
          },
        ]);
      })
      // REINICIAR LA TABLA ESTADO INICIAL
    ConsultarAuditoria(
      model_auditoria,
      '',
      '',
      '',
      Limit,
      1,
      0
    ).then((result) => {
      setvaluepagination(true);
      setdataAuditoria(result.data);
      setTotalData(result.totalItems);
      setspinner(false);
    })
    
     .catch((err) => console.log(err));
  };

  return (
    <React.Fragment>
      <div className="container-view">
        <div className="title-section">
          <label> Administración / Auditoría </label>
          <hr />
        </div>
        <div className="container-form">
          <div className="input-box col-md-4">
            <label className="label-input">Buscar</label>
            <input
              className="inputcustom"
              type="search"
              name="search"
              placeholder="Buscar por nombres, apellidos o usuario ..."
              value={filtro.search}
              onChange={(e) => handleChange(e)}
            />
          </div>
          {/* <div className="input-box col-md-2">
            <label className="label-input">Rol</label>
            <select name="id_rol" onChange={(e) => handleChange(e)}>
              <option value="0">TODOS</option>
              <option value="1">ADMINISTRADOR</option>
              <option value="2">COMERCIAL</option>
            </select>
          </div> */}
          {/* <div className="input-box col-md-3">
            <label className="label-input">Rol</label>
            <select name="id_rol" onChange={(e) => handleChange(e)}>
              <option value="0">TODOS</option>
              {roles.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div> */}
          {/* <div className="input-box col-md-2">
            <label className="label-input">Evento</label>
            <select name="id_event" onChange={(e) => handleChange(e)}>
              <option value="0">TODOS</option>
              {eventos.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div> */}

          <div className="input-box col-md-3">
            <label className="label-input">Fecha (Desde)</label>
            <input
              className="inputcustom"
              type="date"
              name="created_at"
              value={filtro.created_at}
              onChange={(e) => handleChange(e)}
            />
          </div>
          <div className="input-box col-md-3">
            <label className="label-input">Fecha (Hasta)</label>
            <input
              className="inputcustom"
              type="date"
              name="created_up"
              value={filtro.created_up}
              onChange={(e) => handleChange(e)}
            />
          </div>

          <div className="input-box col-md-5">
            {/* <pre>{JSON.stringify(selected)}</pre> */}
            <label className="label-input">Rol</label>
            <MultiSelect
              options={options2}
              value={selected}
              onChange={setSelected}
              labelledBy="Seleccionar Rol"
              valueRenderer={customValueRendererRol}
              overrideStrings={{
                selectSomeItems: "Seleccionar Rol...",
                allItemsAreSelected: "Seleccionó todos los roles",
                selectAll: "SELECCIONAR TODO",
                selectAllFiltered: "SELECCIONAR TODO (FILTRADO)",
                search: "Buscar",
                noOptions: "No encontrado",
              }}
              disableSearch="false"
            />
          </div>

          <div className="input-box col-md-5">
            {/* <pre>{JSON.stringify(selected1)}</pre> */}
            <label className="label-input">Evento</label>
            <MultiSelect
              options={options3}
              value={selected1}
              onChange={setSelected1}
              labelledBy="Seleccionar Evento"
              valueRenderer={customValueRendererEvento}
              overrideStrings={{
                selectSomeItems: "Seleccionar Evento...",
                allItemsAreSelected: "Seleccionó todos los eventos",
                selectAll: "SELECCIONAR TODO",
                selectAllFiltered: "SELECCIONAR TODO (FILTRADO)",
                search: "Buscar",
                noOptions: "No encontrado",
              }}
              disableSearch="true"
            />
          </div>





        </div>
        <section>
          <section>
            <div className="col-sm-12 col-md-2 p-1">
              <BtnSearch
                attribute={{ name: "Buscar", classNamebtn: "btn_signin" }}
                onClick={onClickSearch}
              />
            </div>
            <div className="col-sm-12 col-md-2 p-1">
              <BtnSearch
                attribute={{ name: "Limpiar Campos", classNamebtn: "btn_signin" }}
                onClick={() => Clear()}
              />
            </div>
            <div className="col-sm-12 col-md-2 p-1">
              {arraycheckbox_export[0].data.length > 0 ? (
                <ExcelFile
                  filename="Data exportada"
                  element={
                    <BtnExportar
                      attribute={{
                        name: "Exportar",
                        classNamebtn: "btn_export",
                        disabled: false,
                      }}
                    />
                  }
                >
                  <ExcelSheet dataSet={arraycheckbox_export} name="exportacion" />
                </ExcelFile>
              ) : (
                <ExcelFile
                  filename="Data exportada"
                  element={
                    <BtnExportar
                      attribute={{
                        name: "Exportar",
                        classNamebtn: "btn_export",
                        disabled: false,
                      }}
                    />
                  }
                >
                  <ExcelSheet dataSet={DataSet} name="exportacion" />
                </ExcelFile>
              )}
            </div>
          </section>
          <div className="container-table">
            <div className="container-table-sm">
              <table className="content-table">
                <thead>
                  <tr>
                    <th></th>
                    <th style={{ textAlign: "center" }}>NOMBRES</th>
                    <th style={{ textAlign: "center" }}>APELLIDOS</th>
                    <th style={{ textAlign: "center" }}>USUARIO</th>
                    <th style={{ textAlign: "center" }}>CORREO</th>
                    <th style={{ textAlign: "center" }}>ROL</th>
                    <th style={{ textAlign: "center" }}>EVENTO</th>
                    <th style={{ textAlign: "center" }}>FECHA</th>
                    <th style={{ textAlign: "center" }}>HORA</th>
                    <th style={{ textAlign: "center" }}>OFI. VENTAS</th>
                    <th style={{ textAlign: "center" }}>ORI. INGRESO</th>
                  </tr>
                </thead>
                <tbody>
                  {dataAuditoria.length >= 1
                    ? dataAuditoria.map((item, key) => (
                      <tr key={key}>
                        <th>
                          <input
                            type="checkbox"
                            id={`checkbox-body-` + item.id}
                            onChange={(e) => {
                              setdataAuditoria(
                                dataAuditoria.map((d) => {
                                  if (d.id == item.id) {
                                    d.select = e.target.checked;
                                    if (e.target.checked == true) {
                                      setarraycheckbox([
                                        ...arraycheckbox,
                                        { id: d.id },
                                      ]);
                                      ordenamiento(d);
                                    } else if (e.target.checked == false) {
                                      for (
                                        let i = 0;
                                        i < arraycheckbox.length;
                                        i++
                                      ) {
                                        if (d.id == arraycheckbox[i].id) {
                                          arraycheckbox.splice(i, 1);
                                          arraycheckbox_export[0].data.splice(
                                            i,
                                            1
                                          );
                                        }
                                      }
                                    }
                                  }
                                  return d;
                                })
                              );
                            }}
                          />
                        </th>
                        <th>{item.name_user}</th>
                        <th>
                          {item.ape_pat} {item.ape_mat}
                        </th>
                        <th>{item.username}</th>
                        <th>{item.email}</th>
                        <th>{item.name_role}</th>
                        <th>{item.name_event}</th>
                        <th style={{ textAlign: "center" }}>
                          {formatDate(item.created_at)}
                        </th>
                        <th style={{ textAlign: "center" }}>
                          {formatTime(item.created_at)}
                        </th>
                        <th>{item.sales_ofi}</th>
                        <th style={{ textAlign: "center" }}>
                          {item.indicator}
                        </th>
                      </tr>
                    ))
                    : null}
                </tbody>
              </table>
              {spinner == false && dataAuditoria.length == 0 ? (
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
              postsPerPage={Limit}
              totalPosts={TotalData}
              changePage={changePage}
              prevPage={prevPage}
              nextPage={nextPage}
            />
          )}
        </div>
      </div>
    </React.Fragment>
  );
};

export default Auditoria;
