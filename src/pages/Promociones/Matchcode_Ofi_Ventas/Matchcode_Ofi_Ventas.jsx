import React, { useCallback, useEffect, useRef, useState } from "react";
import Spinner from "../../../components/Spinner";
import { MatchcodePromociones } from "../../../Services/ServicePromociones";
import jwt from "jwt-decode";

const Matchcode_Ofi_Ventas = ({showOfiVentas, setShowOfiVentas, setFiltroInicial,filtroInicial,setDescFiltroInicial,descFiltroInicial}) => {

    const [ViewInfo, setViewInfo] = useState(false);
    const [response, setresponse] = useState({etOfiVentasField:[]});
    const modalRef = useRef();
    const closeModal = e => {
        if (modalRef.current === e.target) {
            setShowOfiVentas(false);
        }
    };
    const keyPress = useCallback(
        e => {
            if (e.key === 'Escape' && showOfiVentas) {
                setShowOfiVentas(false);
            }
        },
        [setShowOfiVentas, showOfiVentas]
    );
    useEffect(() => {
        if(showOfiVentas==true){
            setViewInfo(false);

            let model={
                IsParametro:"VKBUR",
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
        setFiltroInicial({...filtroInicial, ofi_ventas:[{ Sign: "I", Option: "EQ", Low: response.vkburField, High: "" }]});
        setDescFiltroInicial({...descFiltroInicial,ofi_ventas:response.bezeiField});
        setShowOfiVentas(prev => !prev)
    }

    return(
        <React.Fragment>
            {
            showOfiVentas ? (
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
                                                        <th>Ofi. ventas</th>
                                                        <th>Denominación</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        response.etOfiVentasField.map((response,key)=>(
                                                            <tr key={key} onClick={()=>clickcelda(response)}>
                                                                <th style={{textAlign:'center'}}>{response.vkburField}</th>
                                                                <th style={{textAlign:'center'}}>{response.bezeiField}</th>
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
                    <div className='close-modal-button' onClick={() => setShowOfiVentas(prev => !prev)}>
                        <i className="fas fa-times"></i> 
                    </div>
                </div>
            </div>
            ) : null}
        </React.Fragment>
    )
}

export default Matchcode_Ofi_Ventas;