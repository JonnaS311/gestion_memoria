let RAM = 16777216;
let segmento = 8; // Dato a preguntar
let offset = Math.pow(2, 24 - segmento);

let contadorSegmentos = {};
let tabla = [];

//Segmentos | Segmentos Bin | Inicio Decimal [2] | Inicio Hex [2] | Limite [Fin - Inicio] | Permisos [text(RX); el resto (RW)]
// Inicio | Fin | Fin - Inicio

let sistema_operativo = 1048575;

let cantidad_segmentos = Math.ceil((sistema_operativo + 1) / offset);

let inicio = 0;
for (let i = 0; i < cantidad_segmentos; i++) {
    let fin = inicio + offset - 1;
    tabla.push(['SO', inicio, fin, i]);
    inicio = fin + 1;
}

let remaining = RAM - 1 - inicio + 1;
if (remaining > 0) {
    tabla.push([undefined, inicio, RAM - 1]);
}


export function setter(value) {
    RAM = 16777216;
    segmento = value; // Dato a preguntar
    offset = Math.pow(2, 24 - segmento);

    contadorSegmentos = {};
    tabla = [];

    //Segmentos | Segmentos Bin | Inicio Decimal [2] | Inicio Hex [2] | Limite [Fin - Inicio] | Permisos [text(RX); el resto (RW)]
    // Inicio | Fin | Fin - Inicio

    cantidad_segmentos = Math.ceil((sistema_operativo + 1) / offset);

    inicio = 0;
    for (let i = 0; i < cantidad_segmentos; i++) {
        let fin = inicio + offset - 1;
        tabla.push(['SO', inicio, fin, i]);
        inicio = fin + 1;
    }

    remaining = RAM - 1 - inicio + 1;
    if (remaining > 0) {
        tabla.push([undefined, inicio, RAM - 1]);
    }

    return tabla
}


function espacio_mayor(tabla, tamaño_min) {
    let posicion_mayor = 0
    let tamaño_bloque = 0
    for (let i = 1; i < tabla.length; i++) {
        if (tabla[i][0] === undefined && tamaño_min <= tabla[i][2] - tabla[i][1] && tamaño_bloque < tabla[i][2] - tabla[i][1]) {
            tamaño_bloque = tabla[i][2] - tabla[i][1]
            posicion_mayor = i
        }
    }
    if (posicion_mayor !== 0) {
        return posicion_mayor
    } else {
        return -1
    }
}

function espacio_ajustado(tabla, tamaño_min) {
    let posicion_mayor = 0
    let tamaño_bloque = 0
    let mejor_ajuste = null
    for (let i = 1; i < tabla.length; i++) {
        if (tabla[i][0] === undefined && tamaño_min <= tabla[i][2] - tabla[i][1]) {
            if (mejor_ajuste === null || tamaño_bloque > tabla[i][2] - tabla[i][1]) {
                mejor_ajuste = 1
                tamaño_bloque = tabla[i][2] - tabla[i][1]
                posicion_mayor = i
            }
        }
    }
    if (posicion_mayor !== 0) {
        return posicion_mayor
    } else {
        return -1
    }
}

export function segmentacion(programa, ajuste) {
    let proceso = Object.keys(programa);

    if (ajuste === 'primer') {
        for (let i = 0; i < proceso.length; i++) {
            let nombre = proceso[i];
            let programaInfo = programa[nombre];
            let id = programaInfo.id;
            let text = programaInfo.text;
            let data = programaInfo.data;
            let bss = programaInfo.bss;
            let stack = programaInfo.stack;
            let heap = programaInfo.heap;

            asignarSegmento(nombre, id, text, 'text');
            asignarSegmento(nombre, id, data, 'data');
            asignarSegmento(nombre, id, bss, 'bss');
            asignarSegmento(nombre, id, heap, 'heap');
            asignarSegmento(nombre, id, stack, 'stack');
        }
        function asignarSegmento(nombre, id, tamaño, tipo) {
            if (contadorSegmentos[nombre] === undefined) {
                contadorSegmentos[nombre] = {};
            }

            if (contadorSegmentos[nombre][id] === undefined) {
                contadorSegmentos[nombre][id] = 0;
            }

            let cantidadSegmentos = Math.ceil(tamaño / offset);

            // Buscar el primer segmento undefined que sea lo suficientemente grande
            let indexUndefined = tabla.findIndex(seg => seg[0] === undefined && (seg[2] - seg[1] + 1) >= tamaño);
            if (indexUndefined === -1) {
                eliminarProceso(programa)
                return;
            }

            let inicio = tabla[indexUndefined][1];
            let fin = inicio + tamaño;

            for (let i = 0; i < cantidadSegmentos; i++) {
                let tamañoSegmento = Math.min(offset, tamaño - i * offset);
                fin = inicio + tamañoSegmento;
                tabla.push([`${nombre}(${id})(${tipo})`, inicio, fin, contadorSegmentos[nombre][id]]);
                inicio = fin + 1;
                contadorSegmentos[nombre][id]++;
            }

            // Actualizar el segmento undefined
            if (inicio <= tabla[indexUndefined][2]) {
                tabla[indexUndefined][1] = inicio;
            } else {
                tabla.splice(indexUndefined, 1);
            }

            // Si el segmento no se asignó completamente, actualizar el tamaño restante en el segmento undefined
            if (inicio <= fin) {
                tabla.splice(indexUndefined, 0, [undefined, inicio, fin]);
            }

            // Mover el segmento undefined al final de la tabla
            let undefinedSegment = tabla.splice(indexUndefined, 1)[0];
            tabla.push(undefinedSegment);

            // Reordenar la tabla por inicio de segmento
            tabla.sort((a, b) => a[1] - b[1]);
        }
    } else if (ajuste === 'peor') {
        for (let i = 0; i < proceso.length; i++) {
            let nombre = proceso[i];
            let programaInfo = programa[nombre];
            let id = programaInfo.id;
            let text = programaInfo.text;
            let data = programaInfo.data;
            let bss = programaInfo.bss;
            let stack = programaInfo.stack;
            let heap = programaInfo.heap;

            asignarSegmento(nombre, id, text, 'text');
            asignarSegmento(nombre, id, data, 'data');
            asignarSegmento(nombre, id, bss, 'bss');
            asignarSegmento(nombre, id, heap, 'heap');
            asignarSegmento(nombre, id, stack, 'stack');
        }
        function asignarSegmento(nombre, id, tamaño, tipo) {
            if (contadorSegmentos[nombre] === undefined) {
                contadorSegmentos[nombre] = {};
            }

            if (contadorSegmentos[nombre][id] === undefined) {
                contadorSegmentos[nombre][id] = 0;
            }

            let cantidadSegmentos = Math.ceil(tamaño / offset);

            // Buscar el primer segmento undefined que sea lo suficientemente grande
            let indexUndefined = espacio_mayor(tabla, tamaño);
            if (indexUndefined === -1) {
                eliminarProceso(programa)
                return;
            }

            let inicio = tabla[indexUndefined][1];
            let fin = inicio + tamaño;

            for (let i = 0; i < cantidadSegmentos; i++) {
                let tamañoSegmento = Math.min(offset, tamaño - i * offset);
                fin = inicio + tamañoSegmento;
                tabla.push([`${nombre}(${id})(${tipo})`, inicio, fin, contadorSegmentos[nombre][id]]);
                inicio = fin + 1;
                contadorSegmentos[nombre][id]++;
            }

            // Actualizar el segmento undefined
            if (inicio <= tabla[indexUndefined][2]) {
                tabla[indexUndefined][1] = inicio;
            } else {
                tabla.splice(indexUndefined, 1);
            }

            // Si el segmento no se asignó completamente, actualizar el tamaño restante en el segmento undefined
            if (inicio <= fin) {
                tabla.splice(indexUndefined, 0, [undefined, inicio, fin]);
            }

            // Mover el segmento undefined al final de la tabla
            let undefinedSegment = tabla.splice(indexUndefined, 1)[0];
            tabla.push(undefinedSegment);

            // Reordenar la tabla por inicio de segmento
            tabla.sort((a, b) => a[1] - b[1]);
        }
    } else if (ajuste === 'mejor') {
        for (let i = 0; i < proceso.length; i++) {
            let nombre = proceso[i];
            let programaInfo = programa[nombre];
            let id = programaInfo.id;
            let text = programaInfo.text;
            let data = programaInfo.data;
            let bss = programaInfo.bss;
            let stack = programaInfo.stack;
            let heap = programaInfo.heap;

            asignarSegmento(nombre, id, text, 'text');
            asignarSegmento(nombre, id, data, 'data');
            asignarSegmento(nombre, id, bss, 'bss');
            asignarSegmento(nombre, id, heap, 'heap');
            asignarSegmento(nombre, id, stack, 'stack');
        }
        function asignarSegmento(nombre, id, tamaño, tipo) {
            if (contadorSegmentos[nombre] === undefined) {
                contadorSegmentos[nombre] = {};
            }

            if (contadorSegmentos[nombre][id] === undefined) {
                contadorSegmentos[nombre][id] = 0;
            }

            let cantidadSegmentos = Math.ceil(tamaño / offset);

            // Buscar el primer segmento undefined que sea lo suficientemente grande
            let indexUndefined = espacio_ajustado(tabla, tamaño);
            if (indexUndefined === -1) {
                eliminarProceso(programa)
                return;
            }

            let inicio = tabla[indexUndefined][1];
            let fin = inicio + tamaño;

            for (let i = 0; i < cantidadSegmentos; i++) {
                let tamañoSegmento = Math.min(offset, tamaño - i * offset);
                fin = inicio + tamañoSegmento;
                tabla.push([`${nombre}(${id})(${tipo})`, inicio, fin, contadorSegmentos[nombre][id]]);
                inicio = fin + 1;
                contadorSegmentos[nombre][id]++;
            }

            // Actualizar el segmento undefined
            if (inicio <= tabla[indexUndefined][2]) {
                tabla[indexUndefined][1] = inicio;
            } else {
                tabla.splice(indexUndefined, 1);
            }

            // Si el segmento no se asignó completamente, actualizar el tamaño restante en el segmento undefined
            if (inicio <= fin) {
                tabla.splice(indexUndefined, 0, [undefined, inicio, fin]);
            }

            // Mover el segmento undefined al final de la tabla
            let undefinedSegment = tabla.splice(indexUndefined, 1)[0];
            tabla.push(undefinedSegment);

            // Reordenar la tabla por inicio de segmento
            tabla.sort((a, b) => a[1] - b[1]);
        }
    } else {
        console.log('Ajuste no reconocido');
        return;
    }

    return tabla;
}



export function eliminarProceso(programa) {
    let procesosEliminados = {};

    Object.keys(programa).forEach(nombreProceso => {
        let idProceso = programa[nombreProceso].id;
        let segmentosEliminados = [];

        for (let i = 0; i < tabla.length; i++) {
            let seg = tabla[i];
            if (seg[0] && seg[0].startsWith(`${nombreProceso}(${idProceso})`)) {
                segmentosEliminados.push(seg);
                tabla.splice(i, 1);
                i--;
            }
        }

        procesosEliminados[nombreProceso] = segmentosEliminados;
    });

    Object.values(procesosEliminados).forEach(segmentosEliminados => {
        segmentosEliminados.forEach(segEliminado => {
            let index = tabla.findIndex(seg => seg[0] === undefined && seg[1] === segEliminado[1] - 1);
            if (index !== -1) {
                tabla[index][2] = segEliminado[2];
            } else {
                tabla.push([undefined, segEliminado[1], segEliminado[2]]);
            }
        });
    });

    tabla.sort((a, b) => a[1] - b[1]);

    // Unir segmentos undefined contiguos
    for (let i = 0; i < tabla.length - 1; i++) {
        if (tabla[i][0] === undefined && tabla[i + 1][0] === undefined) {
            tabla[i][2] = tabla[i + 1][2];
            tabla.splice(i + 1, 1);
            i--;
        }
    }

    return tabla;
}

// Test
let a = { 'p1': { 'id': 0, 'bss': 1123, 'text': 115000, 'data': 123470, 'stack': 65536, 'heap': 131072 } };
let b = { 'p2': { 'id': 0, 'bss': 1000, 'text': 349000, 'data': 2150000, 'stack': 65536, 'heap': 131072 } };
let c = { 'p3': { 'id': 1, 'bss': 1123, 'text': 115000, 'data': 123470, 'stack': 65536, 'heap': 131072 } };
let d = { 'p3': { 'id': 2, 'bss': 1123, 'text': 115000, 'data': 123470, 'stack': 65536, 'heap': 131072 } };
let e = { 'p3': { 'id': 3, 'bss': 1123, 'text': 115000, 'data': 123470, 'stack': 65536, 'heap': 131072 } };
let f = { 'p3': { 'id': 4, 'bss': 1123, 'text': 115000, 'data': 123470, 'stack': 65536, 'heap': 131072 } };
let g = { 'p3': { 'id': 5, 'bss': 1123, 'text': 115000, 'data': 123470, 'stack': 65536, 'heap': 131072 } };

segmentacion(a, 'mejor');
segmentacion(b, 'mejor');
segmentacion(c, 'mejor');
segmentacion(d, 'mejor');
segmentacion(e, 'mejor');
segmentacion(f, 'mejor');

eliminarProceso(b)
eliminarProceso(d)

segmentacion(g, 'mejor');



console.log(tabla);
