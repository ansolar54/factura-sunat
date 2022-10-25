import React,{useEffect, useRef,useState} from 'react';
import InputForm from '../../../components/InputForm';
import BtnSearch from '../../../components/BtnSearch';
import Spinner from '../../../components/Spinner';
import {DeuCli_EnvCorreo} from '../../../Services/ServiceEnvioCorreo';
import './Envio_Correo.css';

const Envio_Correo = ({showEnvcorreo, setshowEnvcorreo, IsCliente, listaCorreo}) => {
    
    const [inputList, setInputList] = useState([]);
    const [input, setinput] = useState("");
    const [validatemessage, setvalidatemessage] = useState(false);
    const [messageEnvCorreo, setmessageEnvCorreo] = useState("");
    const [validatemessageenvcorreo, setvalidatemessageenvcorreo] = useState(false);

    useEffect(() => {
        // console.log(listaCorreo)
        setmessageEnvCorreo("");
        for (let index = 0; index < listaCorreo.length; index++) {
            for (let y = 0; y < inputList.length; y++) {
                if(listaCorreo[index].correoField != inputList[y].ItListaMail) {
                    setInputList(inputList => [...inputList, { ItListaMail:listaCorreo[index].correoField}]);
                }
                
            }
            if(inputList.length == 0){
                setInputList(inputList => [...inputList, { ItListaMail:listaCorreo[index].correoField}]);
                console.log(listaCorreo[index].correoField)
            }
        }

        if(showEnvcorreo==false){
            setInputList([]);
        }
        
    }, [showEnvcorreo])

    const modalRef = useRef();
    const closeModal = e => {
        if (modalRef.current === e.target) {
            setshowEnvcorreo(false);
        }
    };
    
    function handleChange(name,value) {
        if(name=="input"){
            setinput(value);
        }
    }   

    // quitar input
    const handleRemoveClick = index => {
        const list = [...inputList];
        list.splice(index, 1);
        setInputList(list);
    };

    //agregar correo
    const agregarcorreo = () =>{
        var reg = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var regOficial = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        if(reg.test(input.trim()) && regOficial.test(input.trim())){
            setInputList([...inputList, { ItListaMail:input}]);
            setinput("");
            setvalidatemessage(false);
        }else{
            setvalidatemessage(true);
        }   
    }

    function enviarcorreo(){
        setvalidatemessage(false);
        setvalidatemessageenvcorreo(false);

        let model = {
            IsCliente: IsCliente,
            ItListaMail: inputList
        }

        DeuCli_EnvCorreo(model).then((result)=>{
            setvalidatemessageenvcorreo(true);
            setmessageEnvCorreo(result.esMessageField);
            
        });
    }

    return(
        <>
            {
                showEnvcorreo ? (
                    <div className='container-modal-background' onClick={closeModal} ref={modalRef}>
                        <div className='modal-wrapper modal-wrapper-30'>
                            <div className='modal-content'>
                                
                                <section style={{padding:'10px'}}>
                                <InputForm  attribute={{name:'input',type:'text',value:input,disabled:false,checked:false,matchcode:false}} handleChange={handleChange}/>
                                <div className="p-2">
                                    <BtnSearch attribute={{name:'Agregar correo', classNamebtn:'btn_search'}} onClick={()=>agregarcorreo()}/>
                                </div>
                                <div className="p-2">
                                    <BtnSearch attribute={{name:'Enviar', classNamebtn:'btn_search'}} onClick={()=>enviarcorreo()}/>
                                </div>  
                                {
                                    validatemessage && 
                                    <label className="message">Inserte un correo válido.</label>
                                }
                                {
                                    validatemessageenvcorreo &&
                                    <label className="message-success">{messageEnvCorreo}</label> 
                                }  
                                <div className="container-table-600">
                                    <table className="content-table">
                                        <thead>
                                            <tr>
                                                <th>Correo</th>
                                                <th>Acción</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                inputList.map((response, key)=>{
                                                    return(
                                                        <tr key={key}>
                                                            <th>{response.ItListaMail.toUpperCase()}</th>
                                                            <th>
                                                                <i  className="fas fa-minus-circle hover-icon" onClick={() => handleRemoveClick(key)}></i>
                                                            </th>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </table>
                                </div>
                                   
                                
                                </section>
                            </div>
                            <div className='close-modal-button' onClick={() => setshowEnvcorreo(prev => !prev)}>
                                <i className="fas fa-times"></i> 
                            </div>
                        </div>
                    </div>
                ):null
            }
        </>
    );
}

export default Envio_Correo;