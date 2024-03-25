import React, { useState } from 'react';
import TipoGestion from './TipoGestion';
import { dinamica } from '../utils/logica_dinamica'

const SelectorAjuste = () => {
    const [ajuste, setAjuste] = useState('primer')
    const [vista, setVista] = useState(true)

    const cambio = (e) => {
        setAjuste(e.target.value)
    }

    const aplicar = () => {
        setVista(!vista)
    }

    return (
        <div>
            {vista && (
                <div>
                    <span>ajuste actual: {ajuste}</span>
                    <select name="ajuste" onChange={cambio}>
                        <option value="primer" selected>Primer ajuste</option>
                        <option value="mejor">Mejor ajuste</option>
                        <option value="peor">Peor ajuste</option>
                    </select>
                    <button onClick={aplicar}>Usar Ajuste</button>
                </div>
            )}
            {!vista && (
                <TipoGestion algoritmo={dinamica} ajuste={ajuste}></TipoGestion>
            )}
        </div>
    );
};

export default SelectorAjuste;