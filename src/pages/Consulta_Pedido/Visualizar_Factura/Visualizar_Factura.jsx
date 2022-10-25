import react from "react";
import { useEffect, useRef, useState } from "react";
import { ConsPedidoGetFactura } from "../../../Services/ServiceConsultaPedidoFacturas";

const Visualizar_Factura = ({showVerFactura, setshowVerFactura,nombFactField}) => {

    const modalRef = useRef();
    const closeModal = e => {
        if (modalRef.current === e.target) {
            setshowVerFactura(false);
        }
    };
    const [ind, setind] = useState(0);
    const [ruta, setruta] = useState("");
    useEffect(() => {
        // if(showVerFactura==true){
        //     ConsPedidoGetFactura(nombFactField).then((result)=>{
        //         console.log(result)
        //         if(result.indicator==0){
        //             // setshowVerFactura(false);
        //             setind(false);
        //         }
        //         else{
        //             setshowVerFactura(true);
        //             setind(true);
        //         }
        //     });
        //     console.log(showVerFactura)
        // }
        // console.log(showVerFactura)
        if(showVerFactura==true){
            setruta(process.env.REACT_APP_BASE_URL+"conspedidofactura/"+nombFactField+".pdf")
        }
    }, [showVerFactura])
    
    console.log(ruta);
    return(
        <>
        {
            showVerFactura ? (
                <div className='container-modal-background-correo' onClick={closeModal} ref={modalRef}>
                <div className='modal-wrapper modal-wrapper-bg'>
                    <div className='modal-content'>
                    <object style={{height:'100%'}} type="application/pdf" data={ruta}/>
                        {/* {
                            ind ? (
                                <react.Fragment>
                                    
                                </react.Fragment>
                            ):<div>
                                No se encontró Factura.
                            </div>
                        } */}
                    </div>  
                    <div className='close-modal-button' onClick={() => setshowVerFactura(prev => !prev)}>
                        <i className="fas fa-times"></i> 
                    </div> 
                </div>
                </div>
            ): null
        }
       </> 
    )
}

export default Visualizar_Factura;