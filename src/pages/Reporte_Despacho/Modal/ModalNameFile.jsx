import React, { useRef, useEffect, useCallback, useState } from 'react';
import Spinner from '../../../components/Spinner';
import InputFormMd from '../../../components/InputFormModal'
import SelectFormMd from '../../../components/SelectFormModal'
import BtnSave from '../../../components/BtnSave'
import BtnCancel from '../../../components/BtnCancel'
import ReactExport from "react-data-export";

import { NewEvento } from '../../../Services/ServiceEvent'
import BtnExportar from "../../../components/BtnExport";
import BtnExport1 from '../../../components/BtnExport1';
import { toast } from 'react-hot-toast';


const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

const ModalNameFile = ({ showMdRol, setShowMdRol, arraycheckbox_export, DataSet }) => {

    console.log("DataSet", DataSet);
    console.log("arraycheckbox_export", arraycheckbox_export);

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
    const [NombreFile, setNombreFile] = useState("Reporte de Despacho");

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

            setNombreFile("Reporte de Despacho")

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
                setNombreFile(value)
                break;
            default:
                break;
        }
    }


    const validar = () => {
        if (NombreFile == "") {
            toast.error("Debe escribir un \"Nombre\" para el archivo de Excel.", {
                position: "top-center",
                autoClose: 6000,
                style: {
                    backgroundColor: "#212121",
                    color: "#fff",
                },
            });
        }
    }

    const guardar = () => {
        setNombreFile(NombreFile)
        setShowMdRol(false)
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
                                    <h5>Archivo Excel</h5>
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
                                        <label style={{ fontSize: "15px" }} htmlFor="">Nombre:</label>
                                        <InputFormMd attribute={{ type: 'text', name: 'name', value: NombreFile, className: 'inputModal', disabled: false, cheched: false }} handleChange={handleChange}></InputFormMd>
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

                                {
                                    NombreFile == "" ? (
                                        <BtnSave attribute={{ name: 'btnGuardar', value: 'Guardar', classNamebtn: 'btn_save' }} onClick={() => validar()} />
                                    ) :
                                        arraycheckbox_export[0].data.length > 0 ?
                                            (
                                                <ExcelFile
                                                    filename={NombreFile}
                                                    element={
                                                        <BtnExport1
                                                            attribute={{
                                                                name: "Guardar",
                                                                classNamebtn: "btn_export1",
                                                                disabled: false,
                                                            }}
                                                            onClick={() => guardar()}
                                                        />
                                                    }
                                                >
                                                    <ExcelSheet
                                                        dataSet={arraycheckbox_export}
                                                        name="exportacion"
                                                    />
                                                </ExcelFile>
                                            ) :
                                            (
                                                <ExcelFile
                                                    filename={NombreFile}
                                                    element={
                                                        <BtnExport1
                                                            attribute={{
                                                                name: "Guardar",
                                                                classNamebtn: "btn_export1",
                                                                disabled: false,
                                                            }}
                                                            onClick={() => guardar()}
                                                        />
                                                    }
                                                >
                                                    <ExcelSheet dataSet={DataSet}
                                                        name="exportacion" />
                                                </ExcelFile>
                                            )
                                }

                            </div>
                        </div>
                    </div>
                ) : null

            }
        </>
    )

}

export default ModalNameFile;