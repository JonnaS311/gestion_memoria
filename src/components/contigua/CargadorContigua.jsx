import { useState } from "react";
import '../../styles/Cargador.css';
import { useProceso, useTablaContigua } from "./TipoContigua";
import { llamarLocalStorage } from "../../utils/data";
import Swal from 'sweetalert2'

const CargadorContigua = ({carga, ajuste}) => {
  const itemExistente = localStorage.getItem('data');

  if (itemExistente === null) {
    llamarLocalStorage()
  }
  const data = JSON.parse(localStorage.getItem('data'))
  const [datos] = useState(data)
  const { proceso, setProceso } = useProceso()
  const { Tablacon, setTabla} = useTablaContigua()

  // definimos las funciones
  const info = (value, e) => {
    Swal.fire({
      title: `Información (${value['nombre']})`,
      text: `.text: ${value['text']} | .data: ${value['data']} | .bss: ${value['bss']}`,
      icon: "question",
      confirmButtonColor: "#333",
      buttonsStyling: false,
      iconColor: "#a52a2a",
      footer: "Recuerde que el heap es de: <strong>65536 Bytes</strong>,<br> mientras que el stack es de: <strong>131072 Bytes</strong>."
    });
  }

  function add(index) {
    let objeto = {
      [data[index].nombre]: {
        'text': data[index].text,
        'bss': data[index].bss,
        'data': data[index].data,
        'id': data[index].id,
        'heap': 131072,
        'stack': 65536,
      }
    }
    proceso.push(objeto)
    debugger
    if(ajuste !== undefined){
      let test = carga(objeto,ajuste)
      setTabla(Array.from(test))
    }else{
      let test = carga(objeto)
      setTabla(Array.from(test[0]))
    }
    setProceso(Array.from(proceso))
  }

  return (
    <div className="procesos">
      {datos.map((child, index) => {
        return (
          <div key={child.nombre} className="elemento">
            <p>{`${child.nombre}: ${child.text + child.data + child.bss + 65536 + 131072}B`}</p>
            <div className="column">
              <button type="button" onClick={(e) => { info(child, e) }}>Info</button>
              <button onClick={() => { add(index) }}>Agregar</button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CargadorContigua;