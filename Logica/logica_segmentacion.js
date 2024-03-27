const RAM = 16777216;

let segmento = 8; // Dato a preguntar
let offset = Math.pow(2, 24 - segmento);

// Objeto para almacenar el último número de segmento asignado a cada proceso
let contadorSegmentos = {};

// nombre-proceso | inicio_mem | final_mem | número_segmento
let tabla = [];
let procesos_cargados = [];

let sistema_operativo = 1048575;

// Calcular la cantidad de segmentos necesarios para el SO
let cantidad_segmentos = Math.ceil((sistema_operativo + 1) / offset);

// Crear segmentos completos para el SO
let inicio = 0;
for (let i = 0; i < cantidad_segmentos; i++) {
    let fin = inicio + offset - 1;
    tabla.push(['SO', inicio, fin]);
    inicio = fin + 1;
}

// Agregar segmento para el resto de la memoria
let remaining = RAM - 1 - inicio + 1;
if (remaining > 0) {
    tabla.push([undefined, inicio, RAM - 1]);
}

//Se define el algoritmo de segmentación
//Se define el algoritmo de segmentación
function segmentacion(programa) {
    let proceso = Object.keys(programa);

    // Asignamos los segmentos de memoria de los procesos
    for (let i = 0; i < proceso.length; i++) {
        let nombre = proceso[i];
        let programaInfo = programa[nombre];
        let id = programaInfo.id;
        let text = programaInfo.text;
        let data = programaInfo.data;
        let bss = programaInfo.bss;
        let stack = programaInfo.stack;
        let heap = programaInfo.heap;

        // Asignamos los segmentos a la tabla de memoria
        asignarSegmento(nombre, id, text, 'text');
        asignarSegmento(nombre, id, data, 'data');
        asignarSegmento(nombre, id, bss, 'bss');
        asignarSegmento(nombre, id, heap, 'heap');
        asignarSegmento(nombre, id, stack, 'stack');
    }

    // Recalcular espacio restante al eliminar el segmento 'undefined'
    let indexUndefined = tabla.findIndex(seg => seg[0] === undefined);
    if (indexUndefined !== -1) {
        tabla.splice(indexUndefined, 1);
        let finUltimoSegmento = tabla[tabla.length - 1][2];
        tabla.push([undefined, finUltimoSegmento + 1, RAM - 1]);
    }

    function asignarSegmento(nombre, id, tamaño, tipo) {
        if (contadorSegmentos[nombre] === undefined) {
            contadorSegmentos[nombre] = {}; // Inicializar el objeto del contador si es la primera vez para este proceso
        }

        if (contadorSegmentos[nombre][id] === undefined) {
            contadorSegmentos[nombre][id] = 1; // Inicializar el contador si es la primera vez para este ID del proceso
        }

        let cantidadSegmentos = Math.ceil(tamaño / offset);
        let inicio = asignarInicioSegmento(nombre, id);
        let fin = inicio + tamaño - 1;

        for (let i = 0; i < cantidadSegmentos; i++) {
            let tamañoSegmento = Math.min(offset, tamaño - i * offset);
            fin = inicio + tamañoSegmento - 1;
            tabla.push([`${nombre}(${id})(${tipo})`, inicio, fin, contadorSegmentos[nombre][id]]); // Incrementar el número de segmento
            inicio = fin + 1;
            contadorSegmentos[nombre][id]++; // Incrementar el contador para el siguiente segmento con el mismo ID
        }
    }
    function asignarInicioSegmento() {
        let ultimoSegmento = tabla.slice().reverse().find(seg => seg[0]);
        let inicio = 0;
        if (ultimoSegmento) {
            inicio = ultimoSegmento[2] + 1;
        }
        return inicio;
    }
    

    return tabla;
}


//Test

let a = { 'p2': { 'id': 0, 'bss': 1123, 'text': 115000, 'data': 123470, 'stack': 65536, 'heap': 131072 } }
let b = { 'p1': { 'id': 0, 'bss': 1000, 'text': 349000, 'data': 2150000, 'stack': 65536, 'heap': 131072 } }
let c = { 'p2': { 'id': 1, 'bss': 1123, 'text': 115000, 'data': 123470, 'stack': 65536, 'heap': 131072 } }
let e = { 'p3': { 'id': 0, 'bss': 11233, 'text': 11500, 'data': 12347, 'stack': 65536, 'heap': 131072 } }

segmentacion(a);
segmentacion(b);
segmentacion(c);
segmentacion(e);

console.log(tabla);


