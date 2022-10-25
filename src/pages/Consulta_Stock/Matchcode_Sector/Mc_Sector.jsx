import React,{useRef,useEffect,useCallback,useState} from 'react';
import { OrgVentas } from '../../../Services/ServiceOrgVentas';
import Spinner from '../../../components/Spinner';

const Mc_Organiz_Ventas = ({showMcSector, setShowMcSector, setMcSector, McSector}) => {

    const [ViewInfo, setViewInfo] = useState(false);
    const [responseSector, setresponseSector] = useState({etOrgVentasField:[]});

    const modalRef = useRef();
    const closeModal = e => {
        if (modalRef.current === e.target) {
            setShowMcSector(false);
        }
    };

    const keyPress = useCallback(
        e => {
            if (e.key === 'Escape' && showMcSector) {
                setShowMcSector(false);
            }
        },
        [setShowMcSector, showMcSector]
    );

    useEffect(
        () => {
            if(showMcSector==true){
                setViewInfo(false);
                OrgVentas().then((result)=>{
                    setresponseSector(result);
                    setViewInfo(true);
                });
            }
            document.addEventListener('keydown', keyPress);
            return () => document.removeEventListener('keydown', keyPress);    
        },
        [keyPress]
    )

    function clickcelda(vkorgField) {
        setMcSector(vkorgField);
        setShowMcSector(prev => !prev)
    }

    return(
        <>
            {
                showMcSector ? (
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
                                                            responseSector.etOrgVentasField.map((response,key)=>(
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
                            <div className='close-modal-button' onClick={() => setShowMcSector(prev => !prev)}>
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