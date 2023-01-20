import React,{useRef,useEffect,useCallback,useState} from 'react';
import { ClasePedido } from '../../../Services/ServiceClasePedido';
import Spinner from '../../../components/Spinner';
import './Mc_Clase_Pedido_desde.css';

const Mc_Clase_Pedido_desde = ({
    showclasepedido, setshowclasepedido,
     setclase_pedido_desde, clase_pedido_desde,
    clase_pedido_hasta,setclase_pedido}) => {

    const [ViewInfo, setViewInfo] = useState(false);
    const [responseClasePedido, setresponseClasePedido] = useState({etClasePedidoField:[]});

    const modalRef = useRef();
    const closeModal = e => {
        if (modalRef.current === e.target) {
            setshowclasepedido(false);
        }
    };

    const keyPress = useCallback(
        e => {
            if (e.key === 'Escape' && showclasepedido) {
                setshowclasepedido(false);
            }
        },
        [setshowclasepedido, showclasepedido]
    );

    useEffect(
        () => {
            if(showclasepedido==true){
                setViewInfo(false);
                ClasePedido().then((result)=>{
                    setresponseClasePedido(result);
                    setViewInfo(true);
                });
            }
            //--------------------- para actualizar valor org_ventas
            if(clase_pedido_desde != ''){
                if(clase_pedido_hasta==''){
                    setclase_pedido([{Sign:"I",Option:"EQ",Low:clase_pedido_desde,High:""}]);
                }else{
                    setclase_pedido([{Sign:"I",Option:"BT",Low:clase_pedido_desde,High:clase_pedido_hasta}]);
                }
            }else{
                if(clase_pedido_hasta!=''){
                    setclase_pedido([{Sign:"I",Option:"EQ",Low:"",High:clase_pedido_hasta}]);
                }else{
                    setclase_pedido([{Sign:"",Option:"",Low:"",High:""}]);
                }
            }
            //---------------------
            document.addEventListener('keydown', keyPress);
            return () => document.removeEventListener('keydown', keyPress);    
        },
        [keyPress]
    )

    function clickcelda(auartField) {
        setclase_pedido_desde(auartField);
        setshowclasepedido(prev => !prev)
    }

    return(
        <>
            {
                showclasepedido ? (
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
                                                            <th>Clase de Pedido</th>
                                                            <th>Descripción</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            responseClasePedido.etClasePedidoField.map((response,key)=>(
                                                                <tr key={key} onClick={()=>clickcelda(response.auartField)}>
                                                                    <th>{response.auartField}</th>
                                                                    <th>{response.bezeiField}</th>
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
                            <div className='close-modal-button' onClick={() => setshowclasepedido(prev => !prev)}>
                                <i className="fas fa-times"></i> 
                            </div>
                        </div>
                    </div> 
                ):null
                  
            }
        </>
    )

}

export default Mc_Clase_Pedido_desde;