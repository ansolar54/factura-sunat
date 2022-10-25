import jwt from 'jwt-decode';
import {getUser} from './ServiceUser';


//SERVICIO VALIDAR USUARIO DE SAP PARA MODULOS
export function ValidarUsuarioSAP(req){
    const base=process.env.REACT_APP_BASE_URL_SAP;
    let BaseUrl = base + 'ValidacionUsuario/valudacion_usuario_sap';

    return new Promise((resolve,reject)=>{
        fetch(BaseUrl,{
            method:'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(req)
        })
        .then((response)=>response.json())
        .then((responseJson)=>{
            resolve(responseJson);
        })
        .catch((error)=>{
            reject(error);
        });
    });
};


//validar ruta para autorizada 
export function ValidarRuta(cod_modulo){
    let admin = 0;
    return new Promise((resolve,reject)=>{
        getUser(jwt(localStorage.getItem("_token")).nameid).then((result)=>{
            let model_sap ={
                IsUsuario : result.data[0].username
            }

            // rol 1 -- adminsitrador
            // rol 2 -- supervisor
            if(result.data[0].id_role == 1){
                admin = 1;
            }
            
            ValidarUsuarioSAP(model_sap).then((result_sap)=>{
                for (let index = 0; index < result_sap.etValidaViewField.length; index++) {
                    if(result_sap.etValidaViewField[index].reporteField == '01'  && cod_modulo == "01"){
                        if(result_sap.etValidaViewField[index].validoField == "1"){
                            return resolve({reporte:1,admin:admin});
                        }else{
                            return resolve({reporte:0,admin:admin});
                        }
                    }
                    else if(result_sap.etValidaViewField[index].reporteField == '02'  && cod_modulo == "02"){
                        if(result_sap.etValidaViewField[index].validoField == "1"){
                            return resolve({reporte:1,admin:admin});
                        }else{
                            return resolve({reporte:0,admin:admin});
                        }
                    }
                    else if(result_sap.etValidaViewField[index].reporteField == '03'  && cod_modulo == "03"){
                        if(result_sap.etValidaViewField[index].validoField == "1"){
                            return resolve({reporte:1,admin:admin});
                        }else{
                            return resolve({reporte:0,admin:admin});
                        }
                    }
                    else if(result_sap.etValidaViewField[index].reporteField == '04'  && cod_modulo == "04"){
                        if(result_sap.etValidaViewField[index].validoField == "1"){
                            return resolve({reporte:1,admin:admin});
                        }else{
                            return resolve({reporte:0,admin:admin});
                        }
                    }
                    else if(result_sap.etValidaViewField[index].reporteField == '05'  && cod_modulo == "05"){
                        if(result_sap.etValidaViewField[index].validoField == "1"){
                            return resolve({reporte:1,admin:admin});
                        }else{
                            return resolve({reporte:0,admin:admin});
                        }
                    }
                }
            })
        });
        
    });

}