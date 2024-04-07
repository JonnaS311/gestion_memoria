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
import '../../styles/Esfija.css';
import CargadorContigua from './CargadorContigua';
import TablaContigua from './TablaContigua';
import { options } from '../../utils/stack_bar'
import { useState, createContext, useContext, useEffect } from 'react';
import DescargarContigua from './DescargarContigua';
import { resetId } from '../../utils/data';

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

const InformacionContext = createContext();

export const useInformacion = () => {
    return useContext(InformacionContext);
};

const TablaContiguaContext = createContext();

export const useTablaContigua = () => {
    return useContext(TablaContiguaContext);
};

const TipoContigua = ({ carga, descarga, ajuste, nombre, inicio, nombreT, nombreTa }) => {
    const [proceso, setProceso] = useState([])
    const [Tablacon, setTabla] = useState([])
    const [informacion, setInformacion] = useState([])
    const [operacion, setOperacion] = useState(true)
    const [chart, setChart] = useState({
        labels: ['Memoria 16 Mb'],
        datasets: []
    })

    useEffect(() => {
        resetId()
        setTabla(inicio)
    }, [])

    const generarDataset = () => {
        let objeto = []
        for (let index = 0; index < Object.keys(Tablacon).length; index++) {
            const element = Tablacon[Object.keys(Tablacon)[index]];
            if (element[0] !== undefined && element[0] !== 'fraginterna') {
                objeto.push({ label: element[0], data: [element[2] - element[1]], backgroundColor: "rgb(255, 0, 0)", borderWidth: 2, borderColor: `rgb(255,0,0,0.3)` })
            } else if (element[0] === 'fraginterna') {
                objeto.push({ label: element[0], data: [element[2] - element[1]], backgroundColor: "rgba(255, 0, 0, 0.1)", borderWidth: 1 })
            }
            else {
                objeto.push({ label: element[0], data: [element[2] - element[1]], backgroundColor: `rgba(255, 255, 255, 0)`, borderColor: `rgb(0,0,0,0.5)`, borderWidth: 1 })
            }
        }
        return objeto
    }

    const cambiarOperacion = () => {
        setOperacion(!operacion)
    }

    useEffect(() => {
        // nuevos datos
        let datos = {
            ...chart,
            datasets: generarDataset()
        }
        setChart(datos);
    }, [Tablacon])

    return (
        <div className='fija'>
            <div className='info'>
                {operacion && (
                        <button className='cambio' onClick={cambiarOperacion}>Eliminar Procesos</button>
                )}
                {!operacion && (
                        <button className='cambio' onClick={cambiarOperacion}>Añadir Procesos</button>
                )}
                <InformacionContext.Provider value={{ informacion, setInformacion }}>
                <TablaContiguaContext.Provider value={{ Tablacon, setTabla }}>
                    <ProcesoContext.Provider value={{ proceso, setProceso }}>
                        {operacion && <CargadorContigua carga={carga} ajuste={ajuste} nombreT={nombreT} nombreTa={nombreTa}></CargadorContigua>}
                        {!operacion && <DescargarContigua descarga={descarga} ajuste={ajuste}></DescargarContigua>}
                    </ProcesoContext.Provider>

                    <TablaContigua nombre={nombre}></TablaContigua>
                </TablaContiguaContext.Provider>
                </InformacionContext.Provider>
            </div>
            <div className='bar'>
                <Bar options={options} data={chart} width={800} height={25000} />
            </div>
        </div>
    );
};

export default TipoContigua;