import { useEffect, useState } from "react";
import '../../styles/Cargador.css';
import { useInformacion, useProceso, useTablaContigua } from "./TipoContigua";
import { llamarLocalStorage } from "../../utils/data";
import Swal from 'sweetalert2'
import { GenerarTablas } from "../../utils/logica_segmentacion";

const CargadorContigua = ({ carga, ajuste, nombreT, nombreTa }) => {
  const itemExistente = localStorage.getItem('data');

  if (itemExistente === null) {
    llamarLocalStorage()
  }
  const data = JSON.parse(localStorage.getItem('data'))
  const [datos] = useState(data)
  const { proceso, setProceso } = useProceso()
  const { Tablacon, setTabla } = useTablaContigua()
  const { informacion, setInformacion } = useInformacion()

  // definimos las funciones
  const info = (value, e) => {
    Swal.fire({
      title: `Información (${value['nombre']})`,
      text: `.text: ${value['text']} | .data: ${value['data']} | .bss: ${value['bss']}`,
      icon: "question",
      confirmButtonColor: "#333",
      buttonsStyling: false,
      iconColor: "#a52a2a",
      footer: "Recuerde que el stack es de: <strong>65536 Bytes</strong>,<br> mientras que el heap es de: <strong>131072 Bytes</strong>."
    });
  }

  function add(index) {
    data[index].id += 1
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
    localStorage.setItem('data', JSON.stringify(data));
    let valorNombre = `${data[index].nombre}(${data[index].id})`
    let objetoCon = {
      [valorNombre]: {
        'text': data[index].text,
        'bss': data[index].bss,
        'data': data[index].data,
        'id': data[index].id,
        'heap': 131072,
        'stack': 65536,
      }
    }
    proceso.push(objetoCon)
    if (ajuste !== undefined) {
      let test = carga(objeto, ajuste)
      setTabla(Array.from(test))
      console.log(GenerarTablas())
      setInformacion(GenerarTablas())
    } else {
      let test = carga(objeto)
      setTabla(Array.from(test[0]))
      test.splice(0,1)
      setInformacion(test)
    }
    setProceso(Array.from(proceso))
  }

  const vista1 = () => {
    if (informacion.length > 0) {
      let matrizString = nombreT[1]
      matrizString += informacion[0].map(subArray => subArray.join(' | ')).join('<br>')
      Swal.fire({
        title: nombreT[0],
        width: 700,
        html: matrizString,
        icon: "question",
        confirmButtonColor: "#333",
        buttonsStyling: false,
        iconColor: "#a52a2a",
      });
    }else{
      Swal.fire({
        title: nombreT[0],
        text: 'carga al menos un proceso para ver las tabla',
        icon: "question",
        confirmButtonColor: "#333",
        buttonsStyling: false,
        iconColor: "#a52a2a",
      });
    }
  }

  const vista2 = () => {
    if (informacion.length > 0) {
      let matrizString =  nombreTa[1]
      matrizString += informacion[1].map(subArray => subArray.join(' | ')).join('<br>');
      console.log(matrizString)
      Swal.fire({
        title: nombreTa[0],
        html: matrizString,
        icon: "question",
        confirmButtonColor: "#333",
        buttonsStyling: false,
        iconColor: "#a52a2a",
      });
    }else{
      Swal.fire({
        title: nombreT[0],
        text: 'carga al menos un proceso para ver las tabla',
        icon: "question",
        confirmButtonColor: "#333",
        buttonsStyling: false,
        iconColor: "#a52a2a",
      });
    }
  }


  return (
    <div>
      <div className="flex-boton">
        <button onClick={vista1}>{nombreT[0]}</button>
        {nombreTa !== undefined && (<button onClick={vista2}>{nombreTa[0]}</button>)}
      </div>
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
    </div>

  );
};

export default CargadorContigua;