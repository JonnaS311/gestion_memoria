import { useEffect, useState } from "react";
import '../styles/Cargador.css';
import { useProceso } from "./TipoGestion";
//import { useProceso } from './Esfija'

let data = [
  {
      'nombre': 'p1',
      "text": 19524,
      "data": 12352,
      "bss": 1165
  },
  {
    'nombre': 'p2',
      "text": 77539,
      "data": 32680,
      "bss": 4100
  
  },
  {
    'nombre': 'p3',
      "text": 99542,
      "data": 24245,
      "bss": 7557
  },
  {
    'nombre': 'p4',
      "text": 115000,
      "data": 123470,
      "bss": 1123
  },
  {
    'nombre': 'p5',
      "text": 12342,
      "data": 1256,
      "bss": 1756
    
  },
]

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