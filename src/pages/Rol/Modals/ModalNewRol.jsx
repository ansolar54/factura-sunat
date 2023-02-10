import React, { useRef, useEffect, useCallback, useState } from 'react';
import Spinner from '../../../components/Spinner';
import InputFormMd from '../../../components/InputFormModal'
import SelectFormMd from '../../../components/SelectFormModal'
import BtnSave from '../../../components/BtnSave'
import BtnCancel from '../../../components/BtnCancel'

import { createRol } from '../../../Services/ServiceRol'
import { ConfiPerfiles, ConfiRolesSap } from '../../../Services/ServiceCambioPrecio';

const ModalNewRol = ({ showMdRol, setShowMdRol }) => {

    const [Name, setName] = useState('')

    const [spinner, setSpinner] = useState(false)
    const [Messages, setMessages] = useState({ msgName: '' })
    const [MsgGeneral, setMsgGeneral] = useState('')

    const modalRef = useRef()
    const closeModal = e => {
        if (modalRef.current === e.target) {
            setShowMdRol(false)
        }
    }

    const keyPress = useCallback(
        e => {
            if (e.key === 'Escape' && showMdRol) {
                setShowMdRol(false)
            }
        },
        [setShowMdRol, showMdRol]
    )

    useEffect(
        () => {

            if (showMdRol) {
                setName('')
                setMessages({ msgName: '' })
                setMsgGeneral('')
            }
            document.addEventListener('keydown', keyPress);
            return () => document.removeEventListener('keydown', keyPress);
        },
        [keyPress]
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

    const [response_data_id, setresponse_data_id] = useState("");

    const guardar = () => {
        setSpinner(true)
        let mgName;
        let countMsg = false;
        let request = { name: Name }
        let id_sap = "";
        if (request.name === '') {
            mgName = 'Ingrese el nombre'
            countMsg = true
        }
        if (countMsg) {
            setMessages({ msgName: mgName })
            setSpinner(false)
        } else {
            let classMsg = document.getElementById("msg-general")
            classMsg.classList.remove('msg-success')
            classMsg.classList.remove('msg-error')
            createRol(request).then((result) => {

                if (result.indicator === 1) {                
                    let role_id = result.data.id
                    console.log("response_data_id", role_id)

                    let model = {
                        IsOpcion: "C",
                        Isidrol: role_id,
                        Isnamerol: Name,
                      };
                      // console.log(model);
                      ConfiRolesSap(model).then((result) => {
                        console.log(result)
                      })

                    setMessages({ msgName: '' })
                    setMsgGeneral(result.message)
                    setShowMdRol(false)
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
        setShowMdRol(false)
    }

    return (
        <>
            {
                showMdRol ? (

                    <div className='container-modal-background' onClick={closeModal} ref={modalRef} >
                        <div className='modal-wrapper modal-wrapper-role' >
                            <div className='modal-header'>
                                <div className='modal-title'>
                                    <h5>Nuevo Rol</h5>
                                </div>
                                <div className='close-modal-button' onClick={() => setShowMdRol(prev => !prev)}>
                                    <i className="fas fa-times"></i>
                                </div>
                            </div>
                            <div className='modal-body'>
                                <div id="msg-general" className="row-message ">
                                    <span>{MsgGeneral}</span>
                                </div>
                                <div className="row-md">
                                    <div className="col-md col-md-12">
                                        <label style={{fontSize: "15px"}} htmlFor="">Nombre:</label>
                                        <InputFormMd attribute={{ maxLength: 40, type: 'text', name: 'name', value: Name.toUpperCase(), className: 'inputModal', disabled: false, cheched: false }} handleChange={handleChange}></InputFormMd>
                                        <span className="errorInput">{Messages.msgName}</span>
                                    </div>
                                </div>
                            </div>
                            {
                                spinner &&
                                <Spinner />
                            }
                            <div className='modal-footer'>
                                <BtnCancel attribute={{ name: 'btnCancelar', value: 'Cancelar', classNamebtn: 'btn_cancel' }} onClick={() => cancelar()} />
                                <BtnSave attribute={{ name: 'btnGuardar', value: 'Guardar', classNamebtn: 'btn_save' }} onClick={() => guardar()} />
                            </div>
                        </div>
                    </div>
                ) : null

            }
        </>
    )

}

export default ModalNewRol;