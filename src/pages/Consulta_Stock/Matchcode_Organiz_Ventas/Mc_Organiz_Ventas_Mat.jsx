import React,{useRef,useEffect,useCallback,useState} from 'react';
import { ConsultarStockOrgVentas } from '../../../Services/ServiceOrgVentas';
import Spinner from '../../../components/Spinner';
import jwt from "jwt-decode";

const Mc_Organiz_Ventas_Mat = ({showMcOrganizVentasMat, setShowMcOrganizVentasMat, setMcOrganizVentasMat, McOrganizVentasMat }) => {
   
    const [ViewInfo, setViewInfo] = useState(false);
    const [responseOrgVentas, setresponseOrgVentas] = useState({etOrgVentasField:[]});

    const modalRef = useRef();
    const closeModal = e => {
        if (modalRef.current === e.target) {
            setShowMcOrganizVentasMat(false);
        }
    };

    const keyPress = useCallback(
        e => {
            if (e.key === 'Escape' && showMcOrganizVentasMat) {
                setShowMcOrganizVentasMat(false);
            }
        },
        [setShowMcOrganizVentasMat, showMcOrganizVentasMat]
    );

    useEffect(
        () => {
            if(showMcOrganizVentasMat==true){
                setViewInfo(false);
                var model={
                    IsUser:jwt(localStorage.getItem("_token")).username
                }
                ConsultarStockOrgVentas(model).then((result)=>{
                    setresponseOrgVentas(result);
                    setViewInfo(true);
                });
            }

            document.addEventListener('keydown', keyPress);
            return () => document.removeEventListener('keydown', keyPress);    
        },
        [keyPress]
    )

    function clickcelda(vkorgField) {
        setMcOrganizVentasMat(vkorgField);
        setShowMcOrganizVentasMat(prev => !prev)
    }

    return(
        <>
            {
                showMcOrganizVentasMat ? (
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
                                                                    <th style={{textAlign:"center"}}>{response.vkorgField}</th>
                                                                    <th style={{textAlign:"center"}}>{response.vtextField}</th>
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
                            <div className='close-modal-button' onClick={() => setShowMcOrganizVentasMat(prev => !prev)}>
                                <i className="fas fa-times"></i> 
                            </div>
                        </div>
                    </div> 
                ):null
                  
            }
        </>
    )

}

export default Mc_Organiz_Ventas_Mat;