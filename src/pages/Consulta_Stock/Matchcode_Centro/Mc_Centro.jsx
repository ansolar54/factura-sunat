import React,{useRef,useEffect,useCallback,useState} from 'react';
import { ConsultarCentros } from '../../../Services/ServiceCentro';
import Spinner from '../../../components/Spinner';

const Mc_Organiz_Ventas = ({showMcCentro, setShowMcCentro, setMcCentro, McCentro, setMcBuscaCentro}) => {

    const [ViewInfo, setViewInfo] = useState(false);
    const [responseCentro, setresponseCentro] = useState({etCentroField:[]});

    const modalRef = useRef();
    const closeModal = e => {
        if (modalRef.current === e.target) {
            setShowMcCentro(false);
        }
    };

    const keyPress = useCallback(
        e => {
            if (e.key === 'Escape' && showMcCentro) {
                setShowMcCentro(false);
            }
        },
        [setShowMcCentro, showMcCentro]
    );

    useEffect(
        () => {
            if(showMcCentro==true){
                setViewInfo(false);
                ConsultarCentros().then((result)=>{
                    setresponseCentro(result);
                    setViewInfo(true);
                });
            }

            //--------------------- para actualizar valor org_ventas
            if(McCentro != ''){
                setMcBuscaCentro([{Sign:"I",Option:"EQ",Low:McCentro,High:""}])
            }else{
                setMcBuscaCentro([{Sign:"",Option:"",Low:"",High:""}])
            }
            //---------------------
            document.addEventListener('keydown', keyPress);
            return () => document.removeEventListener('keydown', keyPress);    
        },
        [keyPress]
    )

    function clickcelda(vkorgField) {
        setMcCentro(vkorgField);
        setShowMcCentro(prev => !prev)
    }

    return(
        <>
            {
                showMcCentro ? (
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
                                                            <th>Centro</th>
                                                            <th>Nombre</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            responseCentro.etCentroField.map((response,key)=>(
                                                                <tr key={key} onClick={()=>clickcelda(response.werksField)}>
                                                                    <th style={{textAlign:"center"}}>{response.werksField}</th>
                                                                    <th style={{textAlign:"center"}}>{response.name1Field}</th>
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
                            <div className='close-modal-button' onClick={() => setShowMcCentro(prev => !prev)}>
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