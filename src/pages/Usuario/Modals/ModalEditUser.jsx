import React,{useRef,useEffect,useCallback,useState} from 'react';
import Spinner from '../../../components/Spinner';
import InputFormMd from '../../../components/InputFormModal'
import SelectFormMd from '../../../components/SelectFormModal'
import BtnSave from '../../../components/BtnSave'
import BtnCancel from '../../../components/BtnCancel'

import { updateUser } from '../../../Services/ServiceUser';

const ModalEditUser = ({ShowMdEditUser, setShowMdEditUser, MdItemEdit, MdItemsRoles}) => {

    const [Name, setName] = useState('')
    const [Ape_pat, setApe_pat] = useState('')
    const [Ape_mat, setApe_mat] = useState('')
    const [Username, setUsername] = useState('')
    const [Email, setEmail] = useState('')
    const [Id_role, setId_role] = useState(0)

    const [spinner, setSpinner] = useState(false)
    const [Messages, setMessages] = useState({ msgName: '', msgApe_pat: '', msgApe_mat:'', msgUsername:'', msgEmail:'', msgId_role:'' })
    const [MsgGeneral, setMsgGeneral] = useState('')

    const modalRef = useRef()
    const closeModal = e => {
        if (modalRef.current === e.target) {
            setShowMdEditUser(false)
        }
    }

    const keyPress = useCallback(
        e => {
            if (e.key === 'Escape' && ShowMdEditUser) {
                setShowMdEditUser(false)
            }
        },
        [setShowMdEditUser, ShowMdEditUser]
    )

    useEffect(
        () => {
            setName('')
            setApe_pat('')
            setApe_mat('')
            setUsername('')
            setEmail('')
            setId_role(0)
            setName(MdItemEdit.name)
            setApe_pat(MdItemEdit.ape_pat)
            setApe_mat(MdItemEdit.ape_mat)
            setUsername(MdItemEdit.username)
            setEmail(MdItemEdit.email)
            setId_role(MdItemEdit.id_role)
            setMessages({ msgName: '', msgApe_pat: '', msgApe_mat:'', msgUsername:'', msgEmail:'', msgId_role:'' })
            setMsgGeneral('')

            document.addEventListener('keydown', keyPress);
            return () => document.removeEventListener('keydown', keyPress);    
        },
        [keyPress, ShowMdEditUser]
    )

    const handleChange = (name, value) => {
        switch (name) {
            case 'name':
                setName(value)
                break;
            case 'ape_pat':
                setApe_pat(value)
                break;
            case 'ape_mat':
                setApe_mat(value)
                break;
            case 'username':
                setUsername(value)
                break;
            case 'email':
                setEmail(value)
                break;
            case 'id_role':
                setId_role(value)
                break;
            default:
                break;
        }
    }

    const guardar = () => {
        setSpinner(true)
        let mgName, mgApe_pat, mgApe_mat, mgUsername, mgEmail, mgId_role;
        let countMsg = false;
        let request = { name: Name, ape_pat: Ape_pat, ape_mat: Ape_mat, username: Username, email: Email, id_role: parseInt(Id_role) }
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
        if (request.email === '') {
            mgEmail = 'Ingrese su correo electronico'
            countMsg = true
        }
        if (request.id_rol == 0) {
            mgId_role = 'Seleccione el role del usuario'
            countMsg = true
        }
        if(countMsg) {
            setMessages({ msgName: mgName, msgApe_pat: mgApe_pat, msgApe_mat: mgApe_mat, msgUsername: mgUsername, msgEmail:mgEmail, msgId_role:mgId_role })
            setSpinner(false)
        } else {
            setMsgGeneral('')
            let classMsg =  document.getElementById("msg-general")
            classMsg.classList.remove('msg-success')
            classMsg.classList.remove('msg-error')
            updateUser(request, MdItemEdit.id).then((result) => {
                if (result.indicator === 1) {
                    setMessages({ msgName: '', msgApe_pat: '', msgApe_mat:'', msgUsername:'', msgEmail:'', msgId_role:'' })
                    setMsgGeneral(result.message)
                    setShowMdEditUser(false)
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
        setShowMdEditUser(false)
    }
    
    return(
        <>
            {
                ShowMdEditUser ? (
                    <div className='container-modal-background' onClick={closeModal} ref={modalRef} >
                        <div className='modal-wrapper modal-wrapper-sm' >
                            <div className='modal-header'>
                                <div className='modal-title'>
                                    <h5>Editar Usuario</h5>
                                </div>
                                <div className='close-modal-button' onClick={()=>setShowMdEditUser(prev => !prev)}>
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
                                <div className="row-md">
                                    <div className="col-md col-md-6">
                                        <label htmlFor="">Apellido Paterno:</label>
                                        <InputFormMd attribute={{type:'text', name:'ape_pat', value:Ape_pat, className:'inputModal', disabled:false, cheched:false}} handleChange={handleChange}></InputFormMd>
                                        <span className="errorInput">{Messages.msgApe_pat}</span>
                                    </div>
                                    <div className="col-md col-md-6">
                                        <label htmlFor="">Apellido Materno:</label>
                                        <InputFormMd attribute={{type:'text', name:'ape_mat', value:Ape_mat, className:'inputModal', disabled:false, cheched:false}} handleChange={handleChange}></InputFormMd>
                                        <span className="errorInput">{Messages.msgApe_mat}</span>
                                    </div>
                                </div>
                                <div className="row-md">
                                    <div className="col-md col-md-6">
                                        <label htmlFor="">Correo electronico:</label>
                                        <InputFormMd attribute={{type:'email', name:'email', value:Email, className:'inputModal', disabled:false, cheched:false}} handleChange={handleChange}></InputFormMd>
                                        <span className="errorInput">{Messages.msgEmail}</span>
                                    </div>
                                    <div className="col-md col-md-6">
                                        <label htmlFor="">Usuario:</label>
                                        <InputFormMd attribute={{type:'text', name:'username', value:Username, className:'inputModal', disabled:false, cheched:false}} handleChange={handleChange}></InputFormMd>
                                        <span className="errorInput">{Messages.msgUsername}</span>
                                    </div>
                                </div>                                
                                <div className="row-md">
                                    <div className="col-md col-md-6">
                                        <label htmlFor="">Role:</label>
                                        <SelectFormMd attribute={{name:'id_role', disabled:false, default:Id_role}} values={MdItemsRoles} handleChange={handleChange}></SelectFormMd>
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

export default ModalEditUser;