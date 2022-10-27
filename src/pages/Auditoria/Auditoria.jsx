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

const Auditoria = () => {
  //FILTRO
  const [filtro, setFiltro] = useState({
    id_rol: 0,
    search: "",
    id_event: 0,
    created_at: "",
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
  const [eventos, setEventos] = useState([]);
  //LISTA DE ROLES
  const [roles, setRoles] = useState([]);
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
        }
      ],
      data: [],
    },
  ]);

  useEffect(() => {
    listarAuditoria(0, "", 0, "", 1,0,0);
    listarEventos();
    listarRoles();
  }, []);

  const listarRoles = () => {
    getRoleState().then((res) => {
      setRoles(res.data);
    });
  }

  const listarEventos = () => {
    exportar();
    ConsultarEventos().then((res) => {
      setEventos(res.data);
    });
  };
  //listar auditoría
  const listarAuditoria = (id_rol, search, id_event, created_at, offset,exp,ind) => {
    setspinner(true);
    setdataAuditoria([]);
    if(ind==0){
      arraycheckbox_export[0].data = [];
      ConsultarAuditoria(id_rol, search, id_event, created_at, Limit, offset,exp,0)
      .then((result) => {
        setdataAuditoria(result.data.map((d)=>{
          return {
            select: false,
            id: d.id,
            name_user:d.name_user,
            ape_pat:d.ape_pat,
            ape_mat:d.ape_mat,
            username:d.username,
            email:d.email,
            name_role:d.name_role,
            name_event:d.name_event,
            created_at:d.created_at
          }
        }));
        setTotalData(result.totalItems);
        setspinner(false);
        setvaluepagination(true);
      })
      .catch((err) => console.log(err));
    }else{
      ConsultarAuditoria(id_rol, search, id_event, created_at, Limit, offset,1,0)
      .then((result) => {
        if (stateChecboxHeader === true) {
          setdataAuditoria(result.data.map((d)=>{
            return {
              select: true,
              id: d.id,
              name_user:d.name_user,
              ape_pat:d.ape_pat,
              ape_mat:d.ape_mat,
              username:d.username,
              email:d.email,
              name_role:d.name_role,
              name_event:d.name_event,
              created_at:d.created_at
            }
          }));

          for (let i = 0; i < result.data.length; i++) {
            document.getElementById(
              "checkbox-body-" + result.data[i].id
            ).checked = true;
          }
        } else {
          setdataAuditoria(result.data.map((d)=>{
            return {
              select: false,
              id: d.id,
              name_user:d.name_user,
              ape_pat:d.ape_pat,
              ape_mat:d.ape_mat,
              username:d.username,
              email:d.email,
              name_role:d.name_role,
              name_event:d.name_event,
              created_at:d.created_at
            }
          }));
          for (let i = 0; i < result.data.length; i++) {
            document.getElementById(
              "checkbox-body-" + result.data[i].id
            ).checked = false;
          }
        }

        for (let y = 0; y < result.data.length; y++) {
          if (arraycheckbox.length > 0) {
            for (let i = 0; i < arraycheckbox.length; i++) {
              if (
                result.data[y].id ==
                arraycheckbox[i].id
              ) {
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
    setDataSet([{columns:[], data:[]}]);
    ConsultarAuditoria(
      filtro.id_rol,
      filtro.search,
      filtro.id_event,
      filtro.created_at,
      1,Limit,1)
      .then((result) => {
        console.log(result)
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
              }
            ],
            data: result.data.map((data) => {
              return [
                { value: data.name_user, style: { font: { sz: "14" } } },
                { value: data.ape_pat + " " + data.ape_mat, style: { font: { sz: "14" } } },
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
                { value: formatDate(data.created_at), style: { font: { sz: "14" } } },
                { value: formatTime(data.created_at), style: { font: { sz: "14" } } },
              ];
            }),
          },
        ]);
      })
      .catch((err) => console.log(err));
  }

  function ordenamiento(d) {
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
      }
    ]);
    arraycheckbox_export[0].data.sort(function (a, b) {
      return a[0].value - b[0].value;
    });
  }

  // seleccionar pagina
  const changePage = (pageNumber) => {
    listarAuditoria(
      filtro.id_rol,
      filtro.search,
      filtro.id_event,
      filtro.created_at,
      pageNumber,0,0
    );
  };
  // siguiente pagina
  const prevPage = (value) => {
    listarAuditoria(
      filtro.id_rol,
      filtro.search,
      filtro.id_event,
      filtro.created_at,
      value - 1,0,0
    );
  };
  //pagina anterior
  const nextPage = (value) => {
    listarAuditoria(
      filtro.id_rol,
      filtro.search,
      filtro.id_event,
      filtro.created_at,
      value + 1,0,0
    );
  };

  const handleChange = (e) => {
    setFiltro({ ...filtro, [e.target.name]: e.target.value });
  };

  const onClickSearch = () => {
    exportar();
    listarAuditoria(
      filtro.id_rol,
      filtro.search,
      filtro.id_event,
      filtro.created_at,
      1,0,0
    );
  };

  //formateo de la hora
  function formatTime(value) {
    var datePart = value.match(/\d+/g),
      h=datePart[3],
      m=datePart[4],
      s=datePart[5];
    return h+":"+m+":"+s;
  }
  //formateo de la fecha
  function formatDate(value) {
    var datePart = value.match(/\d+/g),
      year = datePart[0],
      month = datePart[1],
      day = datePart[2];
    return day + "-" + month + "-" + year ;
  }

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
          <div className="input-box col-md-2">
            <label className="label-input">Rol</label>
            <select name="id_rol" onChange={(e) => handleChange(e)}>
              <option value="0">TODOS</option>
              {roles.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <div className="input-box col-md-2">
            <label className="label-input">Evento</label>
            <select name="id_event" onChange={(e) => handleChange(e)}>
              <option value="0">TODOS</option>
              {eventos.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <div className="input-box col-md-2">
            <label className="label-input">Fecha</label>
            <input
              type="date"
              name="created_at"
              onChange={(e) => handleChange(e)}
            />
          </div>
          <div className="col-md-6 p-1">
            <BtnAcept
              attribute={{ name: "Buscar", classNamebtn: "btn_signin" }}
              onClick={onClickSearch}
            />
          </div>
          <div className="col-sm-6 col-md-6 p-1">
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
                      <ExcelSheet
                        dataSet={arraycheckbox_export}
                        name="exportacion"
                      />
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
        </div>
        <section>
          <div className="container-table">
            <div className="container-table-sm">
              <table className="content-table">
                <thead>
                  <tr>
                    <th></th>
                    <th style={{textAlign:"left"}}>NOMBRES</th>
                    <th style={{textAlign:"left"}}>APELLIDOS</th>
                    <th style={{textAlign:"left"}}>USUARIO</th>
                    <th style={{textAlign:"left"}}>CORREO</th>
                    <th style={{textAlign:"left"}}>ROL</th>
                    <th style={{textAlign:"left"}}>EVENTO</th>
                    <th style={{textAlign:"center"}}>FECHA</th>
                    <th style={{textAlign:"center"}}>HORA</th>
                  </tr>
                </thead>
                <tbody>
                  {dataAuditoria.length >= 1
                    ? dataAuditoria.map((item, key) => (
                        <tr key={key}>
                          <th>
                                    <input
                                      type="checkbox"
                                      id={
                                        `checkbox-body-` + item.id
                                      }
                                      onChange={(e) => {
                                        setdataAuditoria(
                                          dataAuditoria.map((d) => {
                                            if (
                                              d.id ==
                                              item.id
                                            ) {
                                              d.select = e.target.checked;
                                              if (e.target.checked == true) {
                                                setarraycheckbox([
                                                  ...arraycheckbox,
                                                  { id: d.id },
                                                ]);
                                                ordenamiento(d);
                                              } else if (
                                                e.target.checked == false
                                              ) {
                                                for (
                                                  let i = 0;
                                                  i < arraycheckbox.length;
                                                  i++
                                                ) {
                                                  if (
                                                    d.id ==
                                                    arraycheckbox[i].id
                                                  ) {
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
                          <th style={{textAlign:"center"}}>{formatDate(item.created_at)}</th>
                          <th style={{textAlign:"center"}}>{formatTime(item.created_at)}</th>
                        </tr>
                      ))
                    : null}
                </tbody>
              </table>
                {spinner==false && dataAuditoria.length == 0 ? (
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
