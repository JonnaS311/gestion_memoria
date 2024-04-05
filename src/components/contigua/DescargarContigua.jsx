import { useProceso,useTablaContigua } from "./TipoContigua";
import '../../styles/Cargador.css';

const DescargarContigua = ({descarga, ajuste}) => {
    const { proceso, setProceso } = useProceso()
    const { Tablacon, setTabla} = useTablaContigua()

    const eliminarProceso = (element) => {
        let obj = proceso
        let eliminado = obj.splice(element,1)
        let test = descarga(eliminado[0])
        if(ajuste !== undefined){
            setTabla(Array.from(test))
        }else{
            setTabla(Array.from(test[0]))
        }
        
        setProceso(Array.from(obj))
    }

    return (
        <div className="procesos">
            {proceso.map((child,index) => {
                return (
                    <div key={index} className="elemento">
                        <p>{Object.keys(child)}</p>
                        <button type="button" onClick={() => { eliminarProceso(index) }}>eliminar proceso</button>
                    </div>
                )
            })}
        </div>
    );
};

export default DescargarContigua;