import React, { useState } from 'react';
import TipoGestion from './TipoGestion';
import { setter_particion, estaticas_fija } from '../utils/logica_estatica_fija'

const ParticionadorFijo = () => {
    const [particion, setParticion] = useState(false)
    const [tamanio, setTamanio] = useState(1048576)

    const change = (e) => {
        setTamanio(e.target.value)
    }

    const cambiar = (e) =>{
        setter_particion(tamanio)
        setParticion(!particion)
    }
    return (
        <div>
            {!particion && (
                <div>
                    <input type="number" name='tamanio' onChange={change} value={tamanio}/>
                    <button onClick={cambiar}>Definir partición</button>
                </div>
            )}
            {particion && (
                <TipoGestion algoritmo={estaticas_fija}></TipoGestion>
            )}
        </div>
    );
};

export default ParticionadorFijo;