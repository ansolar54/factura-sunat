import React,{useRef,useEffect,useCallback,useState} from 'react';
import Spinner from '../../../components/Spinner';
import InputFormMd from '../../../components/InputFormModal'
import InputForm from '../../../components/InputForm';
import SelectFormMd from '../../../components/SelectFormModal'
import BtnSave from '../../../components/BtnSave'
import BtnCancel from '../../../components/BtnCancel'

import { createUser } from '../../../Services/ServiceUser';
import { getRoleState } from '../../../Services/ServiceRol'
import { getRoles } from '@testing-library/dom';

const ModalNewUser = ({showMdUser, setShowMdUser, MdItemsRoles}) => {

    const [Name, setName] = useState('')
    const [Ape_pat, setApe_pat] = useState('')
    const [Ape_mat, setApe_mat] = useState('')
    const [Username, setUsername] = useState('')
    const [Email, setEmail] = useState('')
    const [Password, setPassword] = useState('')
    const [Confirm_password, setConfirm_password] = useState('')
    const [Id_role, setId_role] = useState(0)

    const [spinner, setSpinner] = useState(false)
    const [Messages, setMessages] = useState({ msgName: '', msgApe_pat: '', msgApe_mat:'', msgUsername:'', msgEmail:'', msgPassword:'', msgId_role:'' })
    const [MsgGeneral, setMsgGeneral] = useState('')

    const modalRef = useRef()
    const closeModal = e => {
        if (modalRef.current === e.target) {
            setShowMdUser(false)
        }
    }

    const keyPress = useCallback(
        e => {
            if (e.key === 'Escape' && showMdUser) {
                setShowMdUser(false)
            }
        },
        [setShowMdUser, showMdUser]
    )

    useEffect(
        () => {
        
            setName('')
            setApe_pat('')
            setApe_mat('')
            setUsername('')
            setPassword('')
            setConfirm_password('')
            setEmail('')
            setId_role(0)
            setMessages({ msgName: '', msgApe_pat: '', msgApe_mat:'', msgUsername:'', msgEmail:'', msgPassword:'', msgId_role:'' })
            setMsgGeneral('')

            document.addEventListener('keydown', keyPress);
            return () => document.removeEventListener('keydown', keyPress);    
        },
        [keyPress]
    )

    const handleChange = (name, value) => {
        switch (name) {
            case 'name':
                setName(value.toUpperCase())
                break;
            case 'ape_pat':
                setApe_pat(value.toUpperCase())
                break;
            case 'ape_mat':
                setApe_mat(value.toUpperCase())
                break;
            case 'username':
                setUsername(value.toUpperCase())
                break;
            case 'email':
                setEmail(value.toUpperCase())
                break;
            case 'password':
                setPassword(value)
                break;
            case 'confirm_password':
                setConfirm_password(value)
                break;
            case 'id_role':
                setId_role(value.toUpperCase())
                break;
            default:
                break;
        }
    }

    const guardar = () => {
        setSpinner(true)
        let mgName, mgApe_pat, mgApe_mat, mgUsername, mgPassword, mgEmail, mgId_role;
        let countMsg = false;
        let request = { name: Name, ape_pat: Ape_pat, ape_mat: Ape_mat, username: Username, password: Password, email: Email, id_role: parseInt(Id_role) }
        if (request.name === '') {
            mgName = 'Ingrese el nombre'
            countMsg = true
        }
        if (request.ape_pat === '') {
            mgApe_pat = 'Ingrese el apellido paterno'
            countMsg = true
        }
        // if (request.ape_mat === '') {
        //     mgApe_mat = 'Ingrese el apellido materno'
        //     countMsg = true
        // }
        if (request.username === '') {
            mgUsername = 'Ingrese el usuario'
            countMsg = true
        }
        if (request.password === '' || Confirm_password === '') {
            mgPassword = 'Ingrese la constraseña'
            countMsg = true
        } else if (request.password !== Confirm_password) {
            mgPassword = 'Las contraseñas no coinciden.'
            countMsg = true
        }
        if (request.email === '') {
            mgEmail = 'Ingrese su correo electronico'
            countMsg = true
        }
        if (request.id_role === 0) {
            mgId_role = 'Seleccione el rol del usuario'
            countMsg = true
        }
        if(countMsg) {
            setMessages({ msgName: mgName, msgApe_pat: mgApe_pat, msgApe_mat: mgApe_mat, msgUsername: mgUsername, msgEmail:mgEmail, msgPassword:mgPassword, msgId_role:mgId_role })
            setSpinner(false)
        } else {
            setMsgGeneral('')
            let classMsg =  document.getElementById("msg-general")
            classMsg.classList.remove('msg-success')
            classMsg.classList.remove('msg-error')
            createUser(request).then((result) => {                
                if (result.indicator === 1) {
                    setMessages({ msgName: '', msgApe_pat: '', msgApe_mat:'', msgUsername:'', msgEmail:'', msgPassword:'', msgId_role:'' })
                    setMsgGeneral(result.message)
                    setShowMdUser(false)
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
        setShowMdUser(false)
    }
    
    return(
        <>
            {
                showMdUser ? (
                    <div className='container-modal-background' onClick={closeModal} ref={modalRef} >
                        <div className='modal-wrapper modal-wrapper-sm-1' >
                            <div className='modal-header'>
                                <div className='modal-title'>
                                    <h5>Nuevo Usuario</h5>
                                </div>
                                <div className='close-modal-button' onClick={()=>setShowMdUser(prev => !prev)}>
                                    <i className="fas fa-times"></i> 
                                </div>
                            </div>
                            <div className='modal-body'>
                                <div id="msg-general" className="row-message ">
                                        <span>{MsgGeneral}</span>
                                </div>
                                <div className="row-md">
                                    <div className="col-md col-md-12">
                                        <label style={{fontSize: "15px"}} htmlFor="">Nombres:</label>
                                        <InputForm attribute={{type:'text', name:'name', value:Name, className:'inputModal', disabled:false, cheched:false}} handleChange={handleChange}></InputForm>
                                        <span className="errorInput">{Messages.msgName}</span>
                                    </div>
                                </div>
                                <div className="row-md">
                                    <div className="col-md col-md-6">
                                        <label style={{fontSize: "15px"}} htmlFor="">Apellido Paterno:</label>
                                        <InputForm attribute={{type:'text', name:'ape_pat', value:Ape_pat, className:'inputModal', disabled:false, cheched:false}} handleChange={handleChange}></InputForm>
                                        <span className="errorInput">{Messages.msgApe_pat}</span>
                                    </div>
                                    <div className="col-md col-md-6">
                                        <label style={{fontSize: "15px"}} htmlFor="">Apellido Materno:</label>
                                        <InputForm attribute={{type:'text', name:'ape_mat', value:Ape_mat, className:'inputModal', disabled:false, cheched:false}} handleChange={handleChange}></InputForm>
                                        <span className="errorInput">{Messages.msgApe_mat}</span>
                                    </div>
                                </div>
                                <div className="row-md">
                                    <div className="col-md col-md-6">
                                        <label style={{fontSize: "15px"}} htmlFor="">Correo electronico:</label>
                                        <InputForm attribute={{type:'email', name:'email', value:Email, className:'inputModal', disabled:false, cheched:false}} handleChange={handleChange}></InputForm>
                                        <span className="errorInput">{Messages.msgEmail}</span>
                                    </div>
                                    <div className="col-md col-md-6">
                                        <label style={{fontSize: "15px"}} htmlFor="">Usuario:</label>
                                        <InputForm attribute={{type:'text', name:'username', value:Username, className:'inputModal', disabled:false, cheched:false}} handleChange={handleChange}></InputForm>
                                        <span className="errorInput">{Messages.msgUsername}</span>
                                    </div>
                                </div>
                                
                                <div className="row-md">
                                    <div className="col-md col-md-6">
                                        <label style={{fontSize: "15px"}} htmlFor="">Contraseña:</label>
                                        <InputForm attribute={{type:'password', name:'password', value:Password, className:'inputModal', disabled:false, cheched:false}} handleChange={handleChange}></InputForm>
                                        <span className="errorInput">{Messages.msgPassword}</span>
                                    </div>
                                    <div className="col-md col-md-6">
                                        <label style={{fontSize: "15px"}} htmlFor="">Confirmar Contraseña:</label>
                                        <InputForm attribute={{type:'password', name:'confirm_password', value:Confirm_password, className:'inputModal', disabled:false, cheched:false}} handleChange={handleChange}></InputForm>
                                    </div>
                                </div>
                                <div className="row-md">
                                    <div className="col-md col-md-6">
                                        <label style={{fontSize: "15px"}} htmlFor="">Role:</label>
                                        <SelectFormMd attribute={{name:'id_role', disabled:false, default:0}} values={MdItemsRoles} handleChange={handleChange}></SelectFormMd>
                                        <span className="errorInput">{Messages.msgId_role}</span>
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

export default ModalNewUser;