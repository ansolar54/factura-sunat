import React,{useRef,useEffect,useCallback,useState} from 'react';
import { OrgVentas } from '../../../Services/ServiceOrgVentas';
import Spinner from '../../../components/Spinner';
import './Mc_Org_Ventas_hasta.css';

const Mc_Org_Ventas_desde = ({showorgventa, setshoworgventa, 
    setorg_ventas_hasta,org_ventas_hasta,
    org_ventas_desde,setorg_ventas}) => {

    const [ViewInfo, setViewInfo] = useState(false);
    const [responseOrgVentas, setresponseOrgVentas] = useState({etOrgVentasField:[]});

    const modalRef = useRef();
    
    const closeModal = e => {
        if (modalRef.current === e.target) {
            setshoworgventa(false);
        }
    };

    //Cuando presiona la tecla Esc cierra el modal
    const keyPress = useCallback(
        e => {
            if (e.key === 'Escape' && showorgventa) {
                setshoworgventa(false);
            }
        },
        [setshoworgventa, showorgventa]
    );

    useEffect(
        () => {
            if(showorgventa==true){
                setViewInfo(false);
                OrgVentas().then((result)=>{
                    setresponseOrgVentas(result);
                    setViewInfo(true);
                });
            }
            //--------------------- para actualizar valor org_ventas

            if(org_ventas_hasta != ''){
                if(org_ventas_desde==''){
                    setorg_ventas([{Sign:"I",Option:"EQ",Low:"",High:org_ventas_hasta}]);
                }else{
                    setorg_ventas([{Sign:"I",Option:"BT",Low:org_ventas_desde,High:org_ventas_hasta}]);
                }
            }else{
                if(org_ventas_desde!=''){
                    setorg_ventas([{Sign:"I",Option:"EQ",Low:org_ventas_desde,High:""}]);
                }else{
                    setorg_ventas([{Sign:"",Option:"",Low:"",High:""}]);
                }
            }


            //---------------------
            document.addEventListener('keydown', keyPress);
            return () => document.removeEventListener('keydown', keyPress);    
        },
        [keyPress]
    )

    function clickcelda(vkorgField) {
        setorg_ventas_hasta(vkorgField);
        setshoworgventa(prev => !prev)
    }

    return(
        <>
            {
                showorgventa ? (
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
                                                            <th>Organiz. ventas</th>
                                                            <th>Denominación</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            responseOrgVentas.etOrgVentasField.map((response,key)=>(
                                                                <tr key={key} onClick={()=>clickcelda(response.vkorgField)}>
                                                                    <th>{response.vkorgField}</th>
                                                                    <th>{response.vtextField}</th>
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
                            <div className='close-modal-button' onClick={() => setshoworgventa(prev => !prev)}>
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