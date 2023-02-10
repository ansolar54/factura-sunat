import React,{useRef,useEffect,useCallback,useState} from 'react';
import { OfiVentas } from '../../../Services/ServiceOfiVentas';
import Spinner from '../../../components/Spinner';
import jwt from "jwt-decode";
import './Mc_Ofi_Ventas_hasta.css';

const Mc_Org_Ventas_desde = ({showofiventa, setshowofiventa, setofi_ventas_hasta,ofi_ventas_hasta,ofi_ventas_desde,setofi_ventas}) => {

    const [ViewInfo, setViewInfo] = useState(false);
    const [responseOfiVentas, setresponseOfiVentas] = useState({etOfiVentasField:[]});

    const modalRef = useRef();
    const closeModal = e => {
        if (modalRef.current === e.target) {
            setshowofiventa(false);
        }
    };

    const keyPress = useCallback(
        e => {
            if (e.key === 'Escape' && showofiventa) {
                setshowofiventa(false);
            }
        },
        [setshowofiventa, showofiventa]
    );

    useEffect(
        () => {
            if(showofiventa==true){
                setViewInfo(false);
                var model={
                    IsUser:jwt(localStorage.getItem("_token")).username
                }
                OfiVentas(model).then((result)=>{
                    setresponseOfiVentas(result);
                    setViewInfo(true);
                });
            }
            //--------------------- para actualizar valor org_ventas
            if(ofi_ventas_hasta != ''){
                if(ofi_ventas_desde==''){
                    setofi_ventas([{Sign:"I",Option:"EQ",Low:"",High:ofi_ventas_hasta}]);
                }else{
                    setofi_ventas([{Sign:"I",Option:"BT",Low:ofi_ventas_desde,High:ofi_ventas_hasta}]);
                }
            }else{
                if(ofi_ventas_desde!=''){
                    setofi_ventas([{Sign:"I",Option:"EQ",Low:ofi_ventas_desde,High:""}]);
                }else{
                    setofi_ventas([{Sign:"",Option:"",Low:"",High:""}]);
                }
            }
            //---------------------
            document.addEventListener('keydown', keyPress);
            return () => document.removeEventListener('keydown', keyPress);    
        },
        [keyPress]
    )

    function clickcelda(vkorgField) {
        setofi_ventas_hasta(vkorgField);
        setshowofiventa(prev => !prev)
    }

    return(
        <>
            {
                showofiventa ? (
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
                                                            <th>Oficina de ventas</th>
                                                            <th>Denominación</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            responseOfiVentas.etOfiVentasField.map((response,key)=>(
                                                                <tr key={key} onClick={()=>clickcelda(response.vkburField)}>
                                                                    <th style={{textAlign: 'center'}}>{response.vkburField}</th>
                                                                    <th style={{textAlign: 'center'}}>{response.bezeiField}</th>
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
                            <div className='close-modal-button' onClick={() => setshowofiventa(prev => !prev)}>
                                <i className="fas fa-times"></i> 
                            </div>
                        </div>
                    </div> 
                ):null
                  
            }
        </>
    )

}

export default Mc_Org_Ventas_desde;