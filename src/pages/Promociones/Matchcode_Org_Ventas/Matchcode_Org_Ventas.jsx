import React, { useCallback, useEffect, useRef, useState } from "react";
import Spinner from "../../../components/Spinner";
import { MatchcodePromociones } from "../../../Services/ServicePromociones";
import jwt from "jwt-decode";

const Matchcode_Org_Ventas = ({showOrgVentas, setShowOrgVentas, setFiltroInicial,filtroInicial,setDescFiltroInicial,descFiltroInicial}) => {

    const [ViewInfo, setViewInfo] = useState(false);
    const [response, setresponse] = useState({etOrgVentasField:[]});
    const modalRef = useRef();
    const closeModal = e => {
        if (modalRef.current === e.target) {
            setShowOrgVentas(false);
        }
    };
    const keyPress = useCallback(
        e => {
            if (e.key === 'Escape' && showOrgVentas) {
                setShowOrgVentas(false);
            }
        },
        [setShowOrgVentas, showOrgVentas]
    );
    useEffect(() => {
        if(showOrgVentas==true){
            setViewInfo(false);

            let model={
                IsParametro:"VKORG",
                PVkbur:"",
                PVkorg:"",
                IsUser:jwt(localStorage.getItem("_token")).username
            }
            MatchcodePromociones(model).then((result)=>{
                setresponse(result)
                setViewInfo(true);
            });
        }
    }, [keyPress]);

    function clickcelda(response) {
        setFiltroInicial({...filtroInicial, org_ventas:[{ Sign: "I", Option: "EQ", Low: response.vkorgField, High: "" }]});
        setDescFiltroInicial({...descFiltroInicial,org_ventas:response.vtextField});
        setShowOrgVentas(prev => !prev)
    }

    return(
        <React.Fragment>
            {
            showOrgVentas ? (
            <div className='container-modal-background' onClick={closeModal} ref={modalRef}>
                <div className='modal-wrapper modal-wrapper-sm' >
                    <div className='modal-content'>
                        {
                            ViewInfo ? (
                                <div>
                                    <section className="section-table-modal">
                                        <div className="container-table responsive-table-all">
                                            <table className="content-table ">
                                                <thead>
                                                    <tr>
                                                        <th>Organiz. ventas</th>
                                                        <th>Denominación</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        response.etOrgVentasField.map((response,key)=>(
                                                            <tr key={key} onClick={()=>clickcelda(response)}>
                                                                <th style={{textAlign:'center'}}>{response.vkorgField}</th>
                                                                <th style={{textAlign:'center'}}>{response.vtextField}</th>
                                                            </tr>
                                                        ))
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                    </section>
                                </div>
                            ):  <div>
                                    <Spinner/>
                                </div>
                        }
                    </div>
                    <div className='close-modal-button' onClick={() => setShowOrgVentas(prev => !prev)}>
                        <i className="fas fa-times"></i> 
                    </div>
                </div>
            </div>
            ) : null}
        </React.Fragment>
    )
}

export default Matchcode_Org_Ventas;