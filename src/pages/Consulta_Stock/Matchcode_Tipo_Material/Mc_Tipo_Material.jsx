import React,{useRef,useEffect,useCallback,useState} from 'react';
import { OrgVentas } from '../../../Services/ServiceOrgVentas';
import Spinner from '../../../components/Spinner';

const Mc_Organiz_Ventas = ({showMcTipoMaterial, setShowMcTipoMaterial, setMcTipoMaterial, McTipoMaterial}) => {

    const [ViewInfo, setViewInfo] = useState(false);
    const [responseTipoMaterial, setresponseTipoMaterial] = useState({etOrgVentasField:[]});

    const modalRef = useRef();
    const closeModal = e => {
        if (modalRef.current === e.target) {
            setShowMcTipoMaterial(false);
        }
    };

    const keyPress = useCallback(
        e => {
            if (e.key === 'Escape' && showMcTipoMaterial) {
                setShowMcTipoMaterial(false);
            }
        },
        [setShowMcTipoMaterial, showMcTipoMaterial]
    );

    useEffect(
        () => {
            if(showMcTipoMaterial==true){
                setViewInfo(false);
                OrgVentas().then((result)=>{
                    setresponseTipoMaterial(result);
                    setViewInfo(true);
                });
            }
            document.addEventListener('keydown', keyPress);
            return () => document.removeEventListener('keydown', keyPress);    
        },
        [keyPress]
    )

    function clickcelda(vkorgField) {
        setMcTipoMaterial(vkorgField);
        setShowMcTipoMaterial(prev => !prev)
    }

    return(
        <>
            {
                showMcTipoMaterial ? (
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
                                                            responseTipoMaterial.etOrgVentasField.map((response,key)=>(
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
                            <div className='close-modal-button' onClick={() => setShowMcTipoMaterial(prev => !prev)}>
                                <i className="fas fa-times"></i> 
                            </div>
                        </div>
                    </div> 
                ):null
                  
            }
        </>
    )

}

export default Mc_Organiz_Ventas;