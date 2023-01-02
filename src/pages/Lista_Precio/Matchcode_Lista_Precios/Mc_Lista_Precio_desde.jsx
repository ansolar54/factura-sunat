import React,{useRef,useEffect,useCallback,useState} from 'react';
import { ListaPrecios } from '../../../Services/ServiceListaPrecio';
import Spinner from '../../../components/Spinner';
import './Mc_Lista_Precio_desde.css';
import jwt from "jwt-decode";

const Mc_Lista_Precio_desde = ({showlistaprecio, setshowlistaprecio, setlista_precio_desde,setlista_precio_name,
    lista_precio_desde,lista_precio_hasta,setlista_precio}) => {

    const [ViewInfo, setViewInfo] = useState(false);
    const [responseListaPrecio, setresponseListaPrecio] = useState({etListaPreciosField:[]});

    const modalRef = useRef();
    const closeModal = e => {
        if (modalRef.current === e.target) {
            setshowlistaprecio(false);
        }
    };

    const keyPress = useCallback(
        e => {
            if (e.key === 'Escape' && showlistaprecio) {
                setshowlistaprecio(false);
            }
        },
        [setshowlistaprecio, showlistaprecio]
    );

    useEffect(
        () => {
            if(showlistaprecio==true){
                setViewInfo(false);
                var model={
                    IsUser:jwt(localStorage.getItem("_token")).username
                }
                ListaPrecios(model).then((result)=>{
                    setresponseListaPrecio(result);
                    setViewInfo(true);
                });
            }
            //--------------------- para actualizar valor org_ventas
            if(lista_precio_desde != ''){
                if(lista_precio_hasta==''){
                    setlista_precio([{Sign:"I",Option:"EQ",Low:lista_precio_desde,High:""}]);
                }else{
                    setlista_precio([{Sign:"I",Option:"BT",Low:lista_precio_desde,High:lista_precio_hasta}]);
                }
            }else{
                if(lista_precio_hasta!=''){
                    setlista_precio([{Sign:"I",Option:"EQ",Low:"",High:lista_precio_hasta}]);
                }else{
                    setlista_precio([{Sign:"",Option:"",Low:"",High:""}]);
                }
            }
            //---------------------
            document.addEventListener('keydown', keyPress);
            return () => document.removeEventListener('keydown', keyPress);    
        },
        [keyPress]
    )

    function clickcelda(param) {
        setlista_precio_desde(param.pltypField);
        setlista_precio_name(param.ptextField);
        setshowlistaprecio(prev => !prev)
    }

    return(
        <>
            {
                showlistaprecio ? (
                    <div className='container-modal-background' onClick={closeModal} ref={modalRef}>
                        <div className='modal-wrapper modal-wrapper-sm' >
                            <div className='modal-content'>
                                {ViewInfo ?(
                                    <div>
                                        <section className="section-table-modal">
                                            <div className="container-table responsive-table-all">
                                                <table className="content-table ">
                                                    <thead>
                                                        <tr>
                                                            <th>Lista de Precios</th>
                                                            <th>Denominación Lista Precios</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            responseListaPrecio.etListaPreciosField.map((response,key)=>(
                                                                <tr key={key} onClick={()=>clickcelda(response)}>
                                                                    <th>{response.pltypField}</th>
                                                                    <th>{response.ptextField}</th>
                                                                </tr>
                                                            ))   
                                                        }
                                                    </tbody>
                                                </table>
                                            </div>
                                        </section>
                                    </div>
                                ):<div>
                                    <Spinner/>
                                </div>}
                            </div>
                            <div className='close-modal-button' onClick={() => setshowlistaprecio(prev => !prev)}>
                                <i className="fas fa-times"></i> 
                            </div>
                        </div>
                    </div> 
                ):null
                  
            }
        </>
    )

}

export default Mc_Lista_Precio_desde;