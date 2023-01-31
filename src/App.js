import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useHistory,
} from "react-router-dom";

import "./App.css";
import Slidebar from "./components/Slidebar";
import Dashboard from "./pages/Dashboard";
import Consulta from "./pages/Consulta_Pedido/Consulta";
import ConsultaStock from "./pages/Consulta_Stock/Consulta";
import Info_Cliente from "./pages/Informacion_Cliente/Info_Cliente";
import Deuda_Cliente from "./pages/Deuda_Cliente/Deuda_Cliente";
import Usuario from "./pages/Usuario/Usuario";
import NotFound from "./pages/NotFound/NotFound";

import SignIn from "./pages/SignIn";
import Auditoria from "./pages/Auditoria/Auditoria";
import Configuracion from "./pages/Configuracion/Configuracion";
import ChangeStatusPassword from "./components/ChangeStatusPassword/ChangeStatusPassword";
import jwt from "jwt-decode";
import { getUser } from "./Services/ServiceUser";
import Promociones from "./pages/Promociones/Promociones";
import Reporte_Despacho from "./pages/Reporte_Despacho/Reporte_Despacho";
import Lista_Precio from "./pages/Lista_Precio/Lista_Precio"
import { ActualizarPasswordStatus } from "./Services/ServiceConfiguracion";
import Rol from "./pages/Rol/Rol";
import GenerarSolicitud from "./pages/Cambio_Precio/Generar_Solicitud/GenerarSolicitud";
import MisSolicitudes from "./pages/Cambio_Precio/Mis_Solicitudes/MisSolicitudes";
import MisAprobaciones from "./pages/Cambio_Precio/Mis_Aprobaciones/MisAprobaciones";
import ReporteSolicitud from "./pages/Cambio_Precio/Reporte_Solicitud/ReporteSolicitud";
import Evento from "./pages/Evento/Evento";

const App = () => {
  const history = useHistory();
  //para el cambio de contraseña
  const [show_status_password, setshow_status_password] = useState(false);
  useEffect(() => {
    console.log("APP JS");
    try {
      var model = {
        id: "1",
      };
      ActualizarPasswordStatus(
        model,
        jwt(localStorage.getItem("_token")).nameid
      ).then((res) => {
        if (res.indicator == 1) {
          //valida para el nuevo cambio de contraseña
          getUser(jwt(localStorage.getItem("_token")).nameid)
            .then((result) => {
              console.log(
                "Estado de password es:",
                result.data[0].status_password
              );
              if (result.data[0].status_password === "1") {
                setshow_status_password(true);
              } else {
                setshow_status_password(false);
              }
            })
            .catch((err) => console.log("ocurrio un error: ", err));
        }
      });
    } catch (error) {
      // history.push("/signin");
      localStorage.clear();
    }
  }, [history]);
  return (
    <React.Fragment>
      {show_status_password ? (
        <ChangeStatusPassword
          setshow_status_password={setshow_status_password}
        />
      ) : (
        <Router>
          <div className="App">
            <Switch>
              <Route exact strict path="/signin" component={SignIn}>
                <SignIn />
              </Route>
              <Route exact strict path="/" component={Dashboard}>
                <Slidebar />
                <Dashboard />
              </Route>
              <Route exact strict path="/dashboard" component={Dashboard}>
                <Slidebar />
                <Dashboard />
              </Route>
              <Route exact strict path="/users" component={Usuario}>
                <Slidebar />
                <Usuario />
              </Route>
              <Route exact strict path="/roles" component={Rol}>
                <Slidebar />
                <Rol />
              </Route>
              <Route exact strict path="/auditoria" component={Auditoria}>
                <Slidebar />
                <Auditoria />
              </Route>
              <Route
                exact
                strict
                path="/configuracion"
                component={Configuracion}
              >
                <Slidebar />
                <Configuracion />
              </Route>
              <Route exact strict path="/evento" component={Evento}>
                <Slidebar />
                <Evento />
              </Route>

              {/* MODULO DE REPORTES */}

              <Route exact strict path="/consulta_pedido" component={Consulta}>
                <Slidebar />
                <Consulta />
              </Route>

              <Route
                exact
                strict
                path="/informacion_cliente"
                component={Info_Cliente}
              >
                <Slidebar />
                <Info_Cliente />
              </Route>

              <Route
                exact
                strict
                path="/consulta_stock"
                component={ConsultaStock}
              >
                <Slidebar />
                <ConsultaStock />
              </Route>

              <Route
                exact
                strict
                path="/estado_cuenta"
                component={Deuda_Cliente}
              >
                <Slidebar />
                <Deuda_Cliente />
              </Route>

              <Route
                exact
                strict
                path="/reporte_despacho"
                component={Reporte_Despacho}
              >
                <Slidebar />
                <Reporte_Despacho />
              </Route>

              <Route
                exact
                strict
                path="/lista_precio"
                component={Lista_Precio}
              >
                <Slidebar />
                <Lista_Precio/>
              </Route>

              <Route exact strict path="/promociones" component={Promociones}>
                <Slidebar />
                <Promociones />
              </Route>

              {/* MODULO: cambio precio */}
              <Route
                exact
                strict
                path="/generar_solicitud"
                component={GenerarSolicitud}
              >
                <Slidebar />
                <GenerarSolicitud />
              </Route>
              <Route
                exact
                strict
                path="/mis_solicitudes"
                component={MisSolicitudes}
              >
                <Slidebar />
                <MisSolicitudes />
              </Route>
              <Route
                exact
                strict
                path="/mis_aprobaciones"
                component={MisAprobaciones}
              >
                <Slidebar />
                <MisAprobaciones />
              </Route>
              <Route
                exact
                strict
                path="/reporte_solicitud"
                component={ReporteSolicitud}
              >
                <Slidebar />
                <ReporteSolicitud />
              </Route>
              <Route path="*">
                <NotFound />
              </Route>
            </Switch>
          </div>
        </Router>
      )}
    </React.Fragment>
  );
};

export default App;
