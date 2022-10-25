import React,{useRef,useEffect,useCallback,useState} from 'react';
import { ConsultarLotes } from '../../../Services/ServiceLote';
import Spinner from '../../../components/Spinner';
import Pagination from '../../../components/Pagination';

const Mc_Organiz_Ventas = ({showMcLote, setShowMcLote, setMcLote, McLote, setMcBuscaLote}) => {

    const [ViewInfo, setViewInfo] = useState(false);
    const [responseLote, setresponseLote] = useState({etLoteField:[]});

    const [IsRegxpag] = useState(15); // cantidad de datos por página
    //NUMERO TOTAL DE DATOS 
    const [TotalData,setTotalData] = useState();
    //ACTIVAR SECCION DE PAGINADO
    const [valuepagination, setvaluepagination]=useState(false);

    const modalRef = useRef();

    const closeModal = e => {
        if (modalRef.current === e.target) {
            setShowMcLote(false);
        }
    };

    const keyPress = useCallback(
        e => {
            if (e.key === 'Escape' && showMcLote) {
                setShowMcLote(false);
            }
        },
        [setShowMcLote, showMcLote]
    );

    useEffect(
        () => {
            if(showMcLote==true){
                setViewInfo(false);
                SearchLote(1);
            }

            if(McLote != ''){
                setMcBuscaLote([{Sign:"I",Option:"EQ",Low:McLote,High:""}])
            }else{
                setMcBuscaLote([{Sign:"",Option:"",Low:"",High:""}])
            }

            document.addEventListener('keydown', keyPress);
            return () => document.removeEventListener('keydown', keyPress);    
        },
        [keyPress]
    )
    
    function SearchLote(nro_page) {
        let model_lote={
            IsNpag: nro_page,
            IsRegxpag: IsRegxpag
        }
        ConsultarLotes(model_lote).then((result)=>{
            setresponseLote(result);
            setTotalData(result.esRegtotField);
            setViewInfo(true);
            setvaluepagination(true);
        });
    }

    // seleccionar pagina
    function changePage(pageNumber) {
        SearchLote(pageNumber);
    };
    // siguiente pagina
    function prevPage(value){
        SearchLote(value-1);
    }
    //pagina anterior
    function nextPage(value){
        SearchLote(value+1);
    }

    function clickcelda(vkorgField) {
        setMcLote(vkorgField);
        setShowMcLote(prev => !prev)
    }

    return(
        <>
            {
                showMcLote ? (
                    <div className='container-modal-background' onClick={closeModal} ref={modalRef} >
                        <div className='modal-wrapper modal-wrapper-sm' >
                            <div className='modal-content'>
                                {ViewInfo ?(
                                    <div className='modal-body'>
                                        <section className="section-table-modal">
                                            <div className="container-table responsive-table-all">
                                                <table className="content-table ">
                                                    <thead>
                                                        <tr>
                                                            <th>Material</th>
                                                            <th>Centro</th>
                                                            <th>Lote</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            responseLote.etLoteField.map((response,key)=>(
                                                                <tr key={key} onClick={()=>clickcelda(response.chargField)}>
                                                                    <th style={{textAlign:"center"}}>{parseInt(response.matnrField)}</th>
                                                                    <th style={{textAlign:"center"}}>{response.werksField}</th>
                                                                    <th style={{textAlign:"center"}}>{response.chargField}</th>
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
                                <div>
                                {
                                    valuepagination &&
                                    <Pagination postsPerPage={IsRegxpag}
                                    totalPosts={TotalData}
                                    changePage={changePage}
                                    prevPage={prevPage}
                                    nextPage={nextPage}/>
                                }
                                </div>
                            </div>
                            <div className='close-modal-button' onClick={() => setShowMcLote(prev => !prev)}>
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