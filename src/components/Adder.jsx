import React, { useState } from 'react';
import '../styles/Adder.css';
//import datos from '../utils/datos.json'

const Adder = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        text: '',
        data: '',
        bss: ''
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const submit = (e) =>{
        
    }
    return (
        <div className='container'>
            <h2>Añadir proceso nuevo</h2>
            <span>
                recuerde que el heap es de: <strong>65536 Bytes</strong>, mientras que el stack es de: <strong>131072 Bytes</strong>.
            </span>
            <p>
                * Recuerde que el nombre no debe contener valores númericos. ATT: la administración
            </p>
            <form className='formulario' onSubmit={submit}>
                <input type="text" value={formData.nombre} onChange={handleInputChange} name="nombre" placeholder='Nombre del proceso' />
                <input type="number" value={formData.text} onChange={handleInputChange} name="text" placeholder='.Text' />
                <input type="number" value={formData.data} onChange={handleInputChange} name="data" placeholder='.Data' />
                <input type="number" value={formData.bss} onChange={handleInputChange} name="bss" placeholder='.Bss' />
                <button type="submit">Añadir</button>
            </form>
        </div>
    );
};

export default Adder;