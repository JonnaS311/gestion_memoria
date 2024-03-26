import React, { useEffect, useState } from 'react';
import TipoGestion from './TipoGestion';
import { estatica_variable, RAM, setterParticiones } from '../utils/logica_estatica_variable'

const ParticionadorVar = () => {
    const [ajuste, setAjuste] = useState('primer')
    const [vista, setVista] = useState(true)
    const [tamanio, setTamanio] = useState(0)
    const [particiones, setParticiones] = useState([])
    const [total, setTotal] = useState(RAM)

    const cambio = (e) => {
        setAjuste(e.target.value)
    }
    const change = (e) => {
        setTamanio(e.target.value)
    }
    const aplicar = () => {
        setterParticiones(particiones)
        setVista(!vista)
    }

    const add = (e) => {
        if (tamanio <= total && parseInt(tamanio)>0) {
            let aux = particiones
            aux.push(parseInt(tamanio))
            setParticiones(aux)
            setTotal(total - tamanio)
            setTamanio(0)
        }
    }

    return (
        <div>
            {vista && (
                <div>
                    <span>memoria por asignar: {total}</span>
                    <span>ajuste actual: {ajuste}</span>
                    <select name="ajuste" onChange={cambio}>
                        <option value="primer" selected>Primer ajuste</option>
                        <option value="mejor">Mejor ajuste</option>
                        <option value="peor">Peor ajuste</option>
                    </select>
                    <div>
                        <input type="number" name='tamanio' onChange={change} value={tamanio} />
                        <button onClick={add}>Definir partición</button>
                    </div>
                    <button onClick={aplicar}>Simular</button>
                    <table>
                        <tr>
                            <th>Tamaño de la partición</th>
                        </tr>
                        {particiones.map((child, index) => {
                            return (
                                    <tr key={index}>
                                        <td>{child} Bytes</td>
                                    </tr>
                            )
                        })}
                    </table>
                </div>
            )}
            {!vista && (
                <TipoGestion algoritmo={estatica_variable} ajuste={ajuste}></TipoGestion>
            )}
        </div>
    );
};

export default ParticionadorVar;