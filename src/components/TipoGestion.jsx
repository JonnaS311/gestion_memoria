import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import '../styles/Esfija.css';
import Cargador from './Cargador';
import Tabla from './Tabla';
import { options, data, dataset } from '../utils/stack_bar'
import { estaticas_fija } from '../utils/logica_estatica_fija'
import { useState, createContext, useContext, useEffect } from 'react';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const ProcesoContext = createContext();

export const useProceso = () => {
    return useContext(ProcesoContext);
};

const TablaContext = createContext();

export const useTabla = () => {
    return useContext(TablaContext);
};

const TipoGestion = ({algoritmo}) => {

    const [proceso, setProceso] = useState({})
    const [tabla, setTabla] = useState(undefined)
    const [a, setA] = useState(0)
    
    useEffect(() => {
        setTabla(estaticas_fija(proceso))
        setA(a => a+1)
    }, [proceso])
    
    return (
        <div className='fija'>
            <div className='info'>
                <ProcesoContext.Provider value={{ proceso, setProceso }}>
                    <Cargador></Cargador>
                </ProcesoContext.Provider>
                <TablaContext.Provider value={{tabla}}>
                <Tabla></Tabla>
                </TablaContext.Provider>
            </div>
            <div className='bar'>
                <Bar options={options} data={data} />
            </div>
        </div>
    );
};

export default TipoGestion;