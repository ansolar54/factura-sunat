import React,{useRef,useEffect,useCallback,useState} from 'react';
import Spinner from '../../../components/Spinner';
import InputFormMd from '../../../components/InputFormModal'
import BtnSave from '../../../components/BtnSave'
import BtnCancel from '../../../components/BtnCancel'

import { getsModules } from '../../../Services/ServiceModule'
import { getsOperations } from '../../../Services/ServiceOperation'


const ModalAsignarAcciones = ({ShowMdAsignarAcciones, setShowMdAsignarAcciones, MdItemEdit, McItemsModules}) => {

    const [Name, setName] = useState('')

    const [ItemsModules, setItemsModules] = useState([]);

    const [spinner, setSpinner] = useState(false)
    const [Messages, setMessages] = useState({ msgName: '' })
    const [MsgGeneral, setMsgGeneral] = useState('')

    const modalRef = useRef()
    const closeModal = e => {
        if (modalRef.current === e.target) {
            setShowMdAsignarAcciones(false)
        }
    }

    const keyPress = useCallback(
        e => {
            if (e.key === 'Escape' && ShowMdAsignarAcciones) {
                setShowMdAsignarAcciones(false)
            }
        },
        [setShowMdAsignarAcciones, ShowMdAsignarAcciones]
    )

    useEffect(
        () => {

            setName('')            
            setName(MdItemEdit.name)
            setMessages({ msgName: '' })
            setMsgGeneral('')

            document.addEventListener('keydown', keyPress);
            return () => document.removeEventListener('keydown', keyPress);    
        },
        [keyPress]
    )

    // const mostrarModules = () => {
    //     getsModules().then((rModules) => {
    //         let dataModule = [];
    //         rModules.data.map((item, key) => (
    //             getsOperations(item.id).then((rOperations) => {
    //                 dataModule.push({'id_module': item.id, 'module': item.name, 'operations':rOperations.data})
    //                 if (key == (rModules.data.length-1) ) {
    //                     setItemsModules(dataModule)
    //                 }
    //             })
    //         ))
    //     })
    // }

    const handleChange = (name, value) => {
        let check = document.getElementById(name)
        if (check.checked ) {
            // let inputs = check.getElementsByClassName('checkModal')            
            //     for (let i = 0; i<=inputs.length; i++) {
            //         inputs[i].checked = true
            //     }
        }

    }

    const guardar = () => {
        // setSpinner(true)
        // let mgName;
        // let countMsg = false;
        // let request = { name: Name }
        // if (request.name === '') {
        //     mgName = 'Ingrese el nombre'
        //     countMsg = true
        // }
        // if(countMsg) {
        //     setMessages({ msgName: mgName })
        //     setSpinner(false)
        // } else {
        //     let classMsg =  document.getElementById("msg-general")
        //     classMsg.classList.remove('msg-success')
        //     classMsg.classList.remove('msg-error')
        //     updateRol(request, MdItemEdit.id).then((result) => {
        //         if (result.indicator === 1) {
        //             setMessages({ msgName: '' })
        //             setMsgGeneral(result.message)
        //             setShowMdAsignarAcciones(false)
        //             classMsg.classList.add('msg-success')
        //         } else {
        //             setMsgGeneral(result.message)
        //             classMsg.classList.add('msg-error')
        //         }
        //         setSpinner(false)
        //     })
        // }
    }

    const cancelar = () => {
        setShowMdAsignarAcciones(false)
    }
    
    return(
        <>
            {
                ShowMdAsignarAcciones ? (
                    <div className='container-modal-background' onClick={closeModal} ref={modalRef} >
                        <div className='modal-wrapper modal-wrapper-sm' >
                            <div className='modal-header'>
                                <div className='modal-title'>
                                    <h2>ASIGNAR ACCIONES A ROL | {Name}</h2>
                                </div>
                                <div className='close-modal-button' onClick={()=>setShowMdAsignarAcciones(prev => !prev)}>
                                    <i className="fas fa-times"></i> 
                                </div>
                            </div>
                            <div className='modal-body'>
                                <div id="msg-general" className="row-message ">
                                    <span>{MsgGeneral}</span>
                                </div>
                                <div className="row-md">
                                    <div className="col-md col-md-6">
                                        {
                                            McItemsModules.map((item, key) => (
                                                <ul>
                                                    <li key={key}><InputFormMd attribute={{type:'checkbox', id:item.id_module, name:item.id_module, value:item.id_module, className:'checkModal', disabled:false, cheched:false}} handleChange={handleChange}></InputFormMd>
                                                        <label htmlFor={item.id_module}> {item.module}</label>
                                                        <ul>
                                                            {
                                                                item.operations.map((row, key2) => (
                                                                    <li key={key2}><InputFormMd attribute={{type:'checkbox', id:item.id_module+'_'+row.id, name:item.id_module+'_'+row.id, value:row.id, className:'checkModal', disabled:false, cheched:false}} handleChange={handleChange}></InputFormMd>
                                                                        <label htmlFor={item.id_module+'_'+row.id}> {row.name}</label>
                                                                    </li>
                                                                ))
                                                            }
                                                        </ul>
                                                    </li>
                                                    
                                                </ul>
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>
                            {
                                spinner &&
                                <Spinner/>
                            }
                            <div className='modal-footer'>
                                <BtnCancel attribute={{name:'btnCancelar', value:'Cancelar', classNamebtn:'btn_cancel'}} onClick={()=>cancelar()} />
                                <BtnSave attribute={{name:'btnGuardar', value:'Guardar', classNamebtn:'btn_save'}} onClick={()=>guardar()} />
                            </div>                          
                        </div>
                    </div> 
                ):null
                  
            }
        </>
    )

}

export default ModalAsignarAcciones;