import { useState } from "react";
import '../styles/Cargador.css';
import { useProceso } from "./TipoGestion";
import {data} from '../utils/data'

const Cargador = () => {
  const [datos] = useState(data)
  const {proceso, setProceso} = useProceso()

  // definimos las funciones
  const info = (value, e) => {
    alert(`text: ${value['text']} | data: ${value['data']} | bss: ${value['bss']}`)
  }

  function add(index) {
    let name = data[index].nombre 
    let val = data[index].text + data[index].data + data[index].bss + 65536 + 131072

    const nuevo = {
      ...proceso,
    }
    nuevo[name] = val
    setProceso(nuevo)
  }

  return (
    <div className="procesos">
      {datos.map((child,index) => {
        return (
          <div key={child.nombre} className="elemento">
            <p>{`${child.nombre}: ${child.text + child.data + child.bss + 65536 + 131072}B`}</p>
            <div className="column">
              <button type="button" onClick={(e) => { info(child, e) }}>Info</button>
              <button onClick={()=>{add(index)}}>Agregar</button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Cargador;