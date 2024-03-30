const RAM = 16777216;
let segmento = 8; // Dato a preguntar
let offset = Math.pow(2, 24 - segmento);

let contadorSegmentos = {};
let tabla = [];
let procesos_cargados = [];
let sistema_operativo = 1048575;

let cantidad_segmentos = Math.ceil((sistema_operativo + 1) / offset);

let inicio = 0;
for (let i = 0; i < cantidad_segmentos; i++) {
    let fin = inicio + offset - 1;
    tabla.push(['SO', inicio, fin, i + 1]);
    inicio = fin + 1;
}

let remaining = RAM - 1 - inicio + 1;
if (remaining > 0) {
    tabla.push([undefined, inicio, RAM - 1]);
}

function segmentacion(programa) {
    let proceso = Object.keys(programa);

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

    let indexUndefined = tabla.findIndex(seg => seg[0] === undefined);
    if (indexUndefined !== -1) {
        tabla.splice(indexUndefined, 1);
        let finUltimoSegmento = tabla[tabla.length - 1][2];
        tabla.push([undefined, finUltimoSegmento + 1, RAM - 1]);
    }

    function asignarSegmento(nombre, id, tamaño, tipo) {
        if (contadorSegmentos[nombre] === undefined) {
            contadorSegmentos[nombre] = {};
        }

        if (contadorSegmentos[nombre][id] === undefined) {
            contadorSegmentos[nombre][id] = 1;
        }

        let cantidadSegmentos = Math.ceil(tamaño / offset);
        let inicio = asignarInicioSegmento(nombre, id);
        let fin = inicio + tamaño - 1;

        for (let i = 0; i < cantidadSegmentos; i++) {
            let tamañoSegmento = Math.min(offset, tamaño - i * offset);
            fin = inicio + tamañoSegmento - 1;
            tabla.push([`${nombre}(${id})(${tipo})`, inicio, fin, contadorSegmentos[nombre][id]]);
            inicio = fin + 1;
            contadorSegmentos[nombre][id]++;
        }
    }

    function asignarInicioSegmento(nombre, id) {
        let ultimoSegmento = tabla.slice().reverse().find(seg => seg[0]);
        let inicio = 0;
        if (ultimoSegmento) {
            inicio = ultimoSegmento[2] + 1;
        }
        return inicio;
    }

    return tabla;
}

function eliminarProceso(programa) {
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




//Test
let a = { 'p2': { 'id': 0, 'bss': 1123, 'text': 115000, 'data': 123470, 'stack': 65536, 'heap': 131072 } }
let b = { 'p1': { 'id': 0, 'bss': 1000, 'text': 349000, 'data': 2150000, 'stack': 65536, 'heap': 131072 } }
let c = { 'p2': { 'id': 1, 'bss': 1123, 'text': 115000, 'data': 123470, 'stack': 65536, 'heap': 131072 } }
let d = { 'p3': { 'id': 0, 'bss': 11233, 'text': 11500, 'data': 12347, 'stack': 65536, 'heap': 131072 } }
let e= { 'p1': { 'id': 1, 'bss': 1000, 'text': 349000, 'data': 2150000, 'stack': 65536, 'heap': 131072 } }
let f= { 'p2': { 'id': 2, 'bss': 1123, 'text': 115000, 'data': 123470, 'stack': 65536, 'heap': 131072 } }


segmentacion(a);
segmentacion(b);
segmentacion(c);
segmentacion(d);
segmentacion(e)



eliminarProceso(a);


console.log(tabla);




