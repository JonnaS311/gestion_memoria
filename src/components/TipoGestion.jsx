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
import { options } from '../utils/stack_bar'
import { useState, createContext, useContext, useEffect } from 'react';
import Descargar from './Descargar';
import { color } from '../utils/color';
import { procesos_cargados } from '../utils/logica_estatica_fija';

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

const TipoGestion = (props) => {

    const generarDataset = () => {
        let objeto = []
        for (let index = 0; index < Object.keys(tabla).length; index++) {
            const element = tabla[Object.keys(tabla)[index]];
            if (element[0] !== undefined) {
                objeto.push({ label: element[0], data: [element[2] - element[1]], backgroundColor: color(index) })
            } else {
                objeto.push({ label: element[0], data: [element[2] - element[1]], backgroundColor: `rgba(255, 255, 255, 0)`, borderColor: `rgb(0,0,0,0.5)`, borderWidth: 1, })
            }
        }
        return objeto
    }

    const [proceso, setProceso] = useState({})
    const [tabla, setTabla] = useState([])
    const [operacion, setOperacion] = useState(true)
    const [chart, setChart] = useState({
        labels: ['Memoria 16 Mb'],
        datasets: []
    })

    const updateChartData = () => {
        // nuevos datos
        let datos = {
            ...chart,
            datasets: generarDataset()
        }
        setChart(datos);
    };

    const cambiarOperacion = () => {
        /*if (operacion) {
            if (JSON.stringify(procesos_cargados) !== JSON.stringify(Object.keys(proceso))) {
                for (let index = 0; index < procesos_cargados.length; index++) {

                }
            }
        }*/
        setOperacion(!operacion)
    }

    useEffect(() => {
        let auxTabla
        if (props.ajuste !== undefined) {
            auxTabla = props.algoritmo(proceso, props.ajuste)
        } else {
            auxTabla = props.algoritmo(proceso)
        }
        setTabla(auxTabla)
        updateChartData()
    }, [proceso])

    useEffect(() => {
        updateChartData()
    }, [tabla])

    return (
        <div className='fija'>
            <div className='info'>
                {operacion && <button className='cambio' onClick={cambiarOperacion}>Eliminar Procesos</button>}
                {!operacion && <button className='cambio' onClick={cambiarOperacion}>Añadir Procesos</button>}
                <ProcesoContext.Provider value={{ proceso, setProceso }}>
                    {operacion && <Cargador></Cargador>}
                    {!operacion && <Descargar></Descargar>}
                </ProcesoContext.Provider>
                <TablaContext.Provider value={{ tabla }}>
                    <Tabla></Tabla>
                </TablaContext.Provider>
            </div>
            <div className='bar'>
                <Bar options={options} data={chart} width={800} height={1000}/>
            </div>
        </div>
    );
};

export default TipoGestion;