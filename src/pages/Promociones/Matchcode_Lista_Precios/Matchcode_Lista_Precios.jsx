import React, { useCallback, useEffect, useRef, useState } from "react";
import Spinner from "../../../components/Spinner";
import { MatchcodePromociones } from "../../../Services/ServicePromociones";

const Matchcode_Lista_Precios = ({showListaPrecios, setShowListaPrecios, setFiltroInicial,filtroInicial,setDescFiltroInicial,descFiltroInicial}) => {

    const [ViewInfo, setViewInfo] = useState(false);
    const [response, setresponse] = useState({etTipoPreciosField:[]});
    const modalRef = useRef();
    const closeModal = e => {
        if (modalRef.current === e.target) {
            setShowListaPrecios(false);
        }
    };
    const keyPress = useCallback(
        e => {
            if (e.key === 'Escape' && showListaPrecios) {
                setShowListaPrecios(false);
            }
        },
        [setShowListaPrecios, showListaPrecios]
    );
    useEffect(() => {
        if(showListaPrecios==true){
            setViewInfo(false);

            let model={
                IsParametro:"PLTYP"
            }
            MatchcodePromociones(model).then((result)=>{
                setresponse(result)
                setViewInfo(true);
            });
        }
    }, [keyPress]);

    function clickcelda(response) {
        setFiltroInicial({...filtroInicial, lista_precios:[{ Sign: "I", Option: "EQ", Low: response.vkorgField, High: "" }]});
        setDescFiltroInicial({...descFiltroInicial,lista_precios:response.ptextField});
        setShowListaPrecios(prev => !prev)
    }

    return(
        <React.Fragment>
            {
            showListaPrecios ? (
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
                                                        <th>vkorg</th>
                                                        <th>ptext</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        response.etTipoPreciosField.map((response,key)=>(
                                                            <tr key={key} onClick={()=>clickcelda(response)}>
                                                                <th style={{textAlign:'center'}}>{response.vkorgField}</th>
                                                                <th style={{textAlign:'center'}}>{response.ptextField}</th>
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
                    <div className='close-modal-button' onClick={() => setShowListaPrecios(prev => !prev)}>
                        <i className="fas fa-times"></i> 
                    </div>
                </div>
            </div>
            ) : null}
        </React.Fragment>
    )
}

export default Matchcode_Lista_Precios;