import React, {useState,useEffect} from 'react'
import InputSearch from '../../components/InputSearch'
import BtnNew from '../../components/BtnNew'
import { getsRoles, getRol, updateStateRol } from '../../Services/ServiceRol'
import ModalNewRol from './Modals/ModalNewRol'
import ModalEditRol from './Modals/ModalEditRol'
import ModalAsignarAcciones from './Modals/ModalAsignarAcciones'
import Spinner from '../../components/Spinner'
import Pagination from '../../components/Pagination'

import { getsModules } from '../../Services/ServiceModule'
import { getsOperations } from '../../Services/ServiceOperation'

// import './Usuario.css'

const Rol = () => {
    
    //@MC
    const [Limit] = useState(5); // cantidad de datos por página
    // INPUT BUSCAR 
    const [Texto, setTexto] = useState('')
    
    //RESPONSE CONSULTA PEDIDO
    const [ListarItems, setListarItems] = useState([])
    const [ItemsModules, setItemsModules] = useState([])
    const [ItemEdit, setItemEdit] = useState([])

    //CARGA DE SPINNER
    const [spinner, setspinner] = useState(false)
    //NUMERO TOTAL DE DATOS 
    const [TotalData,setTotalData] = useState()
    //ACTIVAR SECCION DE PAGINADO
    const [valuepagination, setvaluepagination]=useState(false)
    const [ShowRol, setShowRol] = useState(false)
    const [ShowEditRol, setShowEditRol] = useState(false)
    const [ShowAsignarAcciones, setShowAsignarAcciones] = useState(false)

    useEffect(()=>{
        listar(1)
    },[ShowRol, ShowEditRol]);

    //BÚSQUEDA
    const search = (name, value) => {
        setTexto(value);
        listar(1);
    }

    const listar = (Offset) => {
        setspinner(true);
        setListarItems([])
        getsRoles(Texto, Limit, Offset).then((result)=>{
            setListarItems(result.data);
            setTotalData(result.totalItems);
            setspinner(false);
            setvaluepagination(true);
        });
    }

    // seleccionar pagina
    function changePage(pageNumber) {
        listar(pageNumber);
    };
    // siguiente pagina
    function prevPage(value){
        listar(value-1);
    }
    //pagina anterior
    function nextPage(value){
        listar(value+1);
    }

    const cambiarEstado = (Id, Estado) => {
        let request = {state: Estado==1?0:1 }
        updateStateRol(request, Id).then((result) => {
            console.log(result)
            listar(1)
        })
    }

    const nuevo = () => {
        setShowRol(prev => !prev);
    }

    const editar = (Id) => {
        getRol(Id).then((result) => {
            setItemEdit(result.data[0])
            setShowEditRol(prev => !prev);
        })
    }

    const asignarAcciones = (Id) => {
        getRol(Id).then((result) => {
            setItemEdit(result.data[0])
            getsModules().then((rModules) => {
                let dataModule = [];
                rModules.data.map((item, key) => (
                    getsOperations(item.id).then((rOperations) => {
                        dataModule.push({'id_module': item.id, 'module': item.name, 'operations':rOperations.data})
                        if (key == (rModules.data.length-1) ) {
                            setItemsModules(dataModule)
                            setShowAsignarAcciones(prev => !prev)
                        }
                    })
                ))
            })
        })
    }

    return(
        <div className="container-view">
            {/* MODALES  */}
            <ModalNewRol showMdRol={ShowRol} setShowMdRol={setShowRol} />
            <ModalEditRol ShowMdEditRol={ShowEditRol} setShowMdEditRol={setShowEditRol} MdItemEdit={ItemEdit}  />
            <ModalAsignarAcciones ShowMdAsignarAcciones={ShowAsignarAcciones} setShowMdAsignarAcciones={setShowAsignarAcciones} MdItemEdit={ItemEdit} McItemsModules={ItemsModules}  />
   
            <div className="title-section">
                <label> Mantenimiento / Rol </label>
                <hr/>
            </div>
            <div> 
                <div className='search-new'>
                    <div className='col-md-6'>
                        <InputSearch attribute={{name:'texto',placeholder:'Busqueda de roles...',type:'search',value:Texto,disabled:false}} search={search} />
                    </div>
                    <div className='col-md-2'></div>
                    <div className='col-md-4'>
                        <BtnNew attribute={{name:'btnNuevo', value:'Nuevo rol', classNamebtn:'btn_new'}} onClick={()=>nuevo()}/>
                    </div>
                </div>
            </div>

            <section>
                <div className="container-table">
                    <table className="content-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>ROL</th>
                                <th>F. CREACION</th>
                                <th>ESTADO</th>
                                <th>ACCION</th>
                            </tr>
                        </thead>
                        <tbody>
                            { 
                                ListarItems.map((item,key)=>(
                                    <tr key={key} >
                                        <th>{item.id}</th>
                                        <td>{item.name}</td>
                                        <td>{item.created_at}</td>
                                        {item.state == 1 ? 
                                        <td>
                                            <label className="switch">
                                                <input type="checkbox" onChange={()=>cambiarEstado(item.id, item.state)}  defaultChecked />
                                                <span className="slider round" ></span>
                                            </label>
                                        </td>
                                        : 
                                        <td>
                                            <label className="switch">
                                                <input type="checkbox" onChange={()=>cambiarEstado(item.id, item.state)} />
                                                <span className="slider round" ></span>
                                            </label>
                                        </td> 
                                        }
                                        <td>
                                            <i style={{cursor:'pointer'}} title="Editar rol" className="fas fa-edit" onClick={()=>editar(item.id)}></i>
                                            <i style={{cursor:'pointer', marginLeft:'10px'}} title="Asignar acciones" className="fas fa-bacon" onClick={()=>asignarAcciones(item.id)}></i>
                                        </td>
                                    </tr>
                                ))
                            }
                            
                        </tbody>
                    </table>
                    {
                        spinner &&
                        <Spinner/>
                    }
                </div>
            </section>
            <div>
                {
                    valuepagination &&
                    <Pagination postsPerPage={Limit}
                    totalPosts={TotalData}
                    changePage={changePage}
                    prevPage={prevPage}
                    nextPage={nextPage}/>
                }
            </div>
            
        </div>
    )
}

export default Rol;