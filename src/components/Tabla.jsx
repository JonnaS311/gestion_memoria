import { useEffect } from 'react';
import '../styles/Tabla.css';
import { useTabla } from "./TipoGestion";

const Tabla = () => {
    const {tabla} = useTabla()

   
    return (
        <div className='tabla'>
            <table>
                <tr>
                    <th>PID</th>
                    <th>inicio</th>
                    <th>final</th>
                </tr>
                {tabla && tabla.map((child, index) => (
                    <tr key={index}>
                        <td>{child[0]}</td>
                        <td>{child[1]}</td>
                        <td>{child[2]}</td>
                    </tr>
                ))}
            </table>
        </div>
    );
};

export default Tabla;