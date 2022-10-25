import React,{useRef,useEffect,useCallback,useState} from 'react';
import Spinner from '../../../components/Spinner';
import InputFormMd from '../../../components/InputFormModal'
import SelectFormMd from '../../../components/SelectFormModal'
import BtnSave from '../../../components/BtnSave'
import BtnCancel from '../../../components/BtnCancel'

import { updatePasswordUser } from '../../../Services/ServiceUser';
import jwt from 'jwt-decode';
const ModalEditPassUser = ({ShowMdEditPassUser, setShowMdEditPassUser, MdItemEdit}) => {

    const [Name, setName] = useState('')
    const [Username, setUsername] = useState('')
    const [Password, setPassword] = useState('')
    const [Confirm_password, setConfirm_password] = useState('')

    const [spinner, setSpinner] = useState(false)
    const [Messages, setMessages] = useState({ msgPassword:'' })
    const [MsgGeneral, setMsgGeneral] = useState('')

    const modalRef = useRef()
    const closeModal = e => {
        if (modalRef.current === e.target) {
            setShowMdEditPassUser(false)
        }
    }

    const keyPress = useCallback(
        e => {
            if (e.key === 'Escape' && ShowMdEditPassUser) {
                setShowMdEditPassUser(false)
            }
        },
        [setShowMdEditPassUser, ShowMdEditPassUser]
    )

    useEffect(
        () => {
            setName('')
            setUsername('')
            setPassword('')
            setConfirm_password('')
            setName(MdItemEdit.name + ' ' + MdItemEdit.ape_pat + ' ' + MdItemEdit.ape_mat)
            setUsername(MdItemEdit.username)
            setMessages({ msgPassword:'' })
            setMsgGeneral('')

            document.addEventListener('keydown', keyPress);
            return () => document.removeEventListener('keydown', keyPress);    
        },
        [keyPress, ShowMdEditPassUser]
    )

    const handleChange = (name, value) => {
        switch (name) {
            case 'password':
                setPassword(value)
                break;
            case 'confirm_password':
                setConfirm_password(value)
                break;
            default:
                break;
        }
    }

    const guardar = () => {
        setSpinner(true)
        let mgPassword;
        let countMsg = false;
        let request = { password: Password,status_password:"1" }
        
        if (request.password === '' || Confirm_password === '') {
            mgPassword = 'Ingrese la constraseña'
            countMsg = true
        } else if (request.password !== Confirm_password) {
            mgPassword = 'Las contraseñas no coinciden.'
            countMsg = true
        }
        if(countMsg) {
            setMessages({ msgPassword:mgPassword })
            setSpinner(false)
        } else {
            let classMsg =  document.getElementById("msg-general")
            classMsg.classList.remove('msg-success')
            classMsg.classList.remove('msg-error')
            updatePasswordUser(request, MdItemEdit.id).then((result) => {
                if (result.indicator === 1) {
                    setMessages({  msgPassword:'' })
                    setMsgGeneral(result.message)
                    setShowMdEditPassUser(false)
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
        setShowMdEditPassUser(false)
    }
    
    return(
        <>
            {
                ShowMdEditPassUser ? (
                    <div className='container-modal-background' onClick={closeModal} ref={modalRef} >
                        <div className='modal-wrapper modal-wrapper-sm' >
                            <div className='modal-header'>
                                <div className='modal-title'>
                                    <h5>Cambiar Contraseña</h5>
                                </div>
                                <div className='close-modal-button' onClick={()=>setShowMdEditPassUser(prev => !prev)}>
                                    <i className="fas fa-times"></i> 
                                </div>
                            </div>
                            <div className='modal-body'>
                                <div id="msg-general" className="row-message ">
                                    <span>{MsgGeneral}</span>
                                </div>
                                <div className="row-md">
                                    <div className="col-md col-md-6">
                                        <label htmlFor="">Nombres:</label>
                                        <InputFormMd attribute={{type:'text', name:'name', value:Name, className:'inputModal', disabled:true, cheched:false}} handleChange={handleChange}></InputFormMd>
                                    </div>
                                    <div className="col-md col-md-6">
                                        <label htmlFor="">Usuario:</label>
                                        <InputFormMd attribute={{type:'text', name:'username', value:Username, className:'inputModal', disabled:true, cheched:false}} handleChange={handleChange}></InputFormMd>
                                    </div>
                                </div>                              
                                <div className="row-md">
                                    <div className="col-md col-md-6">
                                        <label htmlFor="">Contraseña:</label>
                                        <InputFormMd attribute={{type:'password', name:'password', value:Password, className:'inputModal', disabled:false, cheched:false}} handleChange={handleChange}></InputFormMd>
                                        <span className="errorInput">{Messages.msgPassword}</span>
                                    </div>
                                    <div className="col-md col-md-6">
                                        <label htmlFor="">Confirmar Contraseña:</label>
                                        <InputFormMd attribute={{type:'password', name:'confirm_password', value:Confirm_password, className:'inputModal', disabled:false, cheched:false}} handleChange={handleChange}></InputFormMd>
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

export default ModalEditPassUser;