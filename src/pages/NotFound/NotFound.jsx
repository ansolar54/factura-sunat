import BtnAcept from '../../components/BtnAcept';
import './NotFound.css';

const NotFound = () => {
    const Redirect=()=>{
        window.location.pathname="/dashboard";
    }
    return (
        <div className="content">
                <h1>Error 404</h1>
                <label>Página no encontrada.</label>
                <button onClick={()=>Redirect()}>Volver a Inicio</button>
        </div>
    )
}

export default NotFound;