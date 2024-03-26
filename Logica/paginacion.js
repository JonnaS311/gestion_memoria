// Asignamos una memoria total de 16MiB
const RAM = 16777216

let paginas = 8 // Dato a preguntar
var offset = Math.pow(2, 24 - paginas)

// Tabla gráfica: nombre-proceso-segmento | inicio_mem | final_mem | Marco
let tabla = []

// Tabla de marcos: Marco | PDI ---> Donde el PID: -1 - libre / 0 - SO / > 0 - Ocupado
let tablaMarcos = []

// Tabla de páginas: array {'nombre_proceso': {'pagina': x, 'marco': x}}
let tablaPaginas = {}

// cargamos el sistema operativo en la RAM
let sistema_operativo = 1048575

// inicialización de la tabla
tabla.push([undefined, 0, offset - 1, 0]);

// cargamos las particiones en la tabla
for (let i = 0; i < parseInt((RAM) / offset); i++) {
    tabla.push([undefined, tabla[i][2] + 1, tabla[i][2] + offset, i + 1])
}

// cargamos el sistema operativo a la tabla
const segmentosSO = Math.ceil(sistema_operativo / offset);

// Llenar los segmentos necesarios con el sistema operativo
for (let i = 0; i < segmentosSO; i++) {
    const inicio = i * offset
    const fin = Math.min((i + 1) * offset - 1, sistema_operativo)
    tabla[i] = ['SO', inicio, fin, i]

    // Si hay fragmentación interna
    if (fin < (i + 1) * offset - 1) {
        const inicioUndefined = fin + 1;
        const finUndefined = (i + 1) * offset - 1;
        tabla.splice(i + 1, 0, ["fraginterna", inicioUndefined, finUndefined, -1]);
    }
}

// Entrada: Array de objetos {'p1':{'id':0, 'bss':100, 'text':100, 'data':8383, 'stack':444, 'heap':6666}}

function paginacion(programa) {
    let proceso = Object.keys(programa)
    let id
    let text
    let data
    let bss
    let stack
    let heap
    let segmentos = []

    // obtenermos los atributos del programa
    for (i = 0; i < proceso.length; i++) {
        let programaInfo = programa[proceso[i]];

        id = programaInfo.id
        text = programaInfo.text
        data = programaInfo.data
        bss = programaInfo.bss
        heap = programaInfo.heap
        stack = programaInfo.stack
        segmentos = [text, data, bss, heap, stack]
    }

    // Se recorren todos los segmentos del programa
    for (i = 0; i < segmentos.length; i++) {
        // cargamos el segmentos del programa a la tabla
        let cadaSegmentos = Math.ceil(segmentos[i] / offset)
        let nombre

        if (i == 0) { nombre = proceso + "(" + id + ")" + "(.text)" }
        if (i == 1) { nombre = proceso + "(" + id + ")" + "(.data)" }
        if (i == 2) { nombre = proceso + "(" + id + ")" + "(.bss)" }
        if (i == 3) { nombre = proceso + "(" + id + ")" + "(.heap)" }
        if (i == 4) { nombre = proceso + "(" + id + ")" + "(.stack)" }

        // Recorrer cada sub-segmento en que se puede dividir al segmento, según el tamaño del marco
        for (k = 0; k < cadaSegmentos; k++) {

            // Se cargan los segmentos en los marcos
            for (j = 0; j < tabla.length; j++) {
                /*
                    Recorremos cada elemento de la tabla para buscar si hay alguna partición disponible
                    en caso de que no lo haya se registra en una nueva posición de la tabla
                */
                if (tabla[j][0] === undefined) {
                    const inicio = tabla[j][3] * offset
                    const fin = Math.min((tabla[j][3] + 1) * offset - 1, inicio + (segmentos[i] - offset * k))
                    tabla[j] = [nombre, inicio, fin, tabla[j][3]]

                    // Si hay fragmentación interna
                    if (fin < (tabla[j][3] + 1) * offset - 1) {
                        const inicioUndefined = fin + 1;
                        const finUndefined = (tabla[j][3] + 1) * offset - 1;
                        tabla.splice(j + 1, 0, ["fraginterna", inicioUndefined, finUndefined, -1]);
                    }
                    break
                }
            }
        }
    }
    return tabla, tablaMarcos, tablaPaginas
}

function eliminar_proceso_paginacion(programa) {
    let proceso = Object.keys(programa)
    let id
    let text
    let data
    let bss
    let stack
    let heap
    let segmentos = []

    // obtenermos los atributos del programa
    for (i = 0; i < proceso.length; i++) {
        let programaInfo = programa[proceso[i]];

        id = programaInfo.id
        text = programaInfo.text
        data = programaInfo.data
        bss = programaInfo.bss
        heap = programaInfo.heap
        stack = programaInfo.stack
        segmentos = [text, data, bss, heap, stack]
    }

    // Se recorren todos los segmentos del programa
    for (i = 0; i < segmentos.length; i++) {
        // cargamos el segmentos del programa a la tabla
        let cadaSegmentos = Math.ceil(segmentos[i] / offset)
        let nombre

        if (i == 0) { nombre = proceso + "(" + id + ")" + "(.text)" }
        if (i == 1) { nombre = proceso + "(" + id + ")" + "(.data)" }
        if (i == 2) { nombre = proceso + "(" + id + ")" + "(.bss)" }
        if (i == 3) { nombre = proceso + "(" + id + ")" + "(.heap)" }
        if (i == 4) { nombre = proceso + "(" + id + ")" + "(.stack)" }

        // Recorrer cada sub-segmento en que se puede dividir al segmento, según el tamaño del marco
        for (k = 0; k < cadaSegmentos; k++) {

            // Se cargan los segmentos en los marcos
            for (j = 0; j < tabla.length; j++) {
                /*
                    Recorremos cada elemento de la tabla para buscar si hay alguna partición disponible
                    en caso de que no lo haya se registra en una nueva posición de la tabla
                */
                if (tabla[j][0] === nombre) {
                    tabla[j][0] = undefined
                    // Eliminar la fragmentación interna (¿Qué hago con la fragmentación interna?)
                    if (tabla[j+1][0] === "fraginterna"){
                        tabla.splice(j+1, 1)
                    }
                    break
                }
            }
        }
    }
    return tabla, tablaMarcos, tablaPaginas
}


// Test

let a = { 'p2': { 'id': 0, 'bss': 1123, 'text': 115000, 'data': 123470, 'stack': 65536, 'heap': 131072 } }
let b = { 'p1': { 'id': 0, 'bss': 1000, 'text': 349000, 'data': 2150000, 'stack': 65536, 'heap': 131072 } }
let c = { 'p2': { 'id': 1, 'bss': 1123, 'text': 115000, 'data': 123470, 'stack': 65536, 'heap': 131072 } }
let d = { 'p2': { 'id': 0, 'bss': 1123, 'text': 115000, 'data': 123470, 'stack': 65536, 'heap': 131072 } }
paginacion(a)
paginacion(b)
eliminar_proceso_paginacion(a)
paginacion(c)
console.log(tabla)

