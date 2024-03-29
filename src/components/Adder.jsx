import React, { useState } from 'react';
import '../styles/Adder.css';
import { llamarLocalStorage } from '../utils/data'

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
            [name]: parseInt(value)
        });
    };

    const handleInputChangeString = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const submit = (e) => {
        const itemExistente = localStorage.getItem('data');

        if (itemExistente === null) {
            llamarLocalStorage()
        }

        if (formData.text !== "" && formData.data !== "" && formData.bss !== "" && formData.text > 0 && formData.data > 0 && formData.bss > 0) {
            const data = JSON.parse(localStorage.getItem('data'));
            const keys = []
            for (let index = 0; index < data.length; index++) {
                keys.push(data[index].nombre)
            }
            if (!keys.includes(formData.nombre) && formData.nombre !== 'SO') {
                data.push({
                    'nombre': formData.nombre,
                    'text': formData.text,
                    'data': formData.data,
                    'bss': formData.bss
                })
                localStorage.setItem('data', JSON.stringify(data));
            }
        }
    }

    return (
        <div className='container'>
            <h2>Añadir proceso nuevo</h2>
            <span>
                Recuerde que el heap es de: <strong>65536 Bytes</strong>, mientras que el stack es de: <strong>131072 Bytes</strong>.
            </span>
            <p>
                * Recuerde que el .text, .data y.bss son enteros positivos. 
            </p>
            <form className='formulario' onSubmit={submit}>
                <input type="text" value={formData.nombre} onChange={handleInputChangeString} name="nombre" placeholder='Nombre del proceso' />
                <input type="number" value={formData.text} onChange={handleInputChange} name="text" placeholder='.Text' />
                <input type="number" value={formData.data} onChange={handleInputChange} name="data" placeholder='.Data' />
                <input type="number" value={formData.bss} onChange={handleInputChange} name="bss" placeholder='.Bss' />
                <button type="submit">Añadir</button>
            </form>
        </div>
    );
};

export default Adder;