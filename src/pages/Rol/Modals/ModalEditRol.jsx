import React,{useRef,useEffect,useCallback,useState} from 'react';
import Spinner from '../../../components/Spinner';
import InputFormMd from '../../../components/InputFormModal'
import BtnSave from '../../../components/BtnSave'
import BtnCancel from '../../../components/BtnCancel'

import { updateRol } from '../../../Services/ServiceRol';

const ModalEditRol = ({ShowMdEditRol, setShowMdEditRol, MdItemEdit}) => {

    const [Name, setName] = useState('')

    const [spinner, setSpinner] = useState(false)
    const [Messages, setMessages] = useState({ msgName: '' })
    const [MsgGeneral, setMsgGeneral] = useState('')

    const modalRef = useRef()
    const closeModal = e => {
        if (modalRef.current === e.target) {
            setShowMdEditRol(false)
        }
    }

    const keyPress = useCallback(
        e => {
            if (e.key === 'Escape' && ShowMdEditRol) {
                setShowMdEditRol(false)
            }
        },
        [setShowMdEditRol, ShowMdEditRol]
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
        [keyPress, ShowMdEditRol]
    )

    const handleChange = (name, value) => {
        switch (name) {
            case 'name':
                setName(value)
                break;
            default:
                break;
        }
    }

    const guardar = () => {
        setSpinner(true)
        let mgName;
        let countMsg = false;
        let request = { name: Name }
        if (request.name === '') {
            mgName = 'Ingrese el nombre'
            countMsg = true
        }
        if(countMsg) {
            setMessages({ msgName: mgName })
            setSpinner(false)
        } else {
            let classMsg =  document.getElementById("msg-general")
            classMsg.classList.remove('msg-success')
            classMsg.classList.remove('msg-error')
            updateRol(request, MdItemEdit.id).then((result) => {
                if (result.indicator === 1) {
                    setMessages({ msgName: '' })
                    setMsgGeneral(result.message)
                    setShowMdEditRol(false)
                    classMsg.classList.add('msg-success')
                } else {
                    setMsgGeneral(result.message)
                    classMsg.classList.add('msg-error')
                }
                setSpinner(false)
            })
        }
    }

    const cancelar = () => {
        setShowMdEditRol(false)
    }
    
    return(
        <>
            {
                ShowMdEditRol ? (
                    <div className='container-modal-background' onClick={closeModal} ref={modalRef} >
                        <div className='modal-wrapper modal-wrapper-role' >
                            <div className='modal-header'>
                                <div className='modal-title'>
                                    <h5>Editar Rol</h5>
                                </div>
                                <div className='close-modal-button' onClick={()=>setShowMdEditRol(prev => !prev)}>
                                    <i className="fas fa-times"></i> 
                                </div>
                            </div>
                            <div className='modal-body'>
                                <div id="msg-general" className="row-message ">
                                    <span>{MsgGeneral}</span>
                                </div>
                                <div className="row-md">
                                    <div className="col-md col-md-12">
                                        <label htmlFor="">Nombres:</label>
                                        <InputFormMd attribute={{type:'text', name:'name', value:Name, className:'inputModal', disabled:false, cheched:false}} handleChange={handleChange}></InputFormMd>
                                        <span className="errorInput">{Messages.msgName}</span>
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

export default ModalEditRol;