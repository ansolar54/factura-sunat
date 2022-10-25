import React, { useEffect, useState } from "react";
import BtnAcept from "../../components/BtnSearch";
import { GetConfiguracionPassword, PostConfiguracionPassword } from "../../Services/ServiceConfiguracion";

const Configuracion = () => {
    var n =  new Date();
    //Año
    var y = n.getFullYear();
    //Mes
    var m = n.getMonth() + 1;
    //Día
    var d = n.getDate();
    const [model_conf_password, setModel_conf_password] = useState({
        num: 0,
        date: y+"-"+m+"-"+d+" 00:00:00"
      });

      useEffect(() => {
        GetConfiguracionPassword(1).then((res)=>{
            setModel_conf_password({ ...model_conf_password, ["num"]: res.data[0].num });
        })
      }, [])

    function handleChange(e) {
        setModel_conf_password({ ...model_conf_password, [e.target.name]: e.target.value });
    }

    function Save(){

        PostConfiguracionPassword(model_conf_password,1).then((res)=>{
            console.log(res);
        })
    }

    return (
        <React.Fragment>
            <div className="container-view">
                <div className="title-section">
                    <label> Administración / Configuración </label>
                    <hr />
                </div>
                <div className="container-form">
                    <div className="container-view-sub">
                        <div className="title-section">
                            <label> Configuracion de cambio de contraseña </label>
                            <hr />
                        </div>
                        <input
                        type="number"
                        name="num"
                        placeholder="número de días"
                        value={model_conf_password.num}
                        onChange={(e) => handleChange(e)}
                        />
                        <div className="col-sm-12">
                            <BtnAcept
                            attribute={{ name: "Guardar", classNamebtn: "btn_signin" }}
                            onClick={Save}
                            />
                        </div>
                    </div>
                    
                </div>
            </div>
        </React.Fragment>
    )
}

export default Configuracion;