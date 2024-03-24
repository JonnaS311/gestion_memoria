// Asignamos una memoria total de 16MiB
const RAM = 16777216

let paginas = 8 // Dato a preguntar
var offset = Math.pow(2,24-paginas)

// Tabla gráfica: nombre-proceso-segmento | inicio_mem | final_mem | Marco
let tabla = []
let procesos_cargados = []

// Tabla de marcos: Marco | PDI ---> Donde el PID: -1 - libre / 0 - SO / > 0 - Ocupado
let tablaMarcos = []

// Tabla de páginas: array {'nombre_proceso': {'pagina': x, 'marco': x}}
let tablaPaginas = {}

// cargamos el sistema operativo en la RAM
let sistema_operativo = 1048575
tabla.push(['SO',0, sistema_operativo])

// cargamos las particiones en la tabla
for (let i = 0; i < parseInt((RAM - 1048576)/offset); i++) {
    tabla.push([undefined,tabla[i][2]+1,tabla[i][2]+offset])
}

//Entrada: Array de objetos {'p1':{'id':0, 'bss':100, 'text':100, 'data':8383, 'stack':444, 'heap':6666}}

function estaticas_fija(programas) {
    let nombres_procesos = Object.keys(programas)
    let aux_procesos_car = procesos_cargados.slice()
    //verificamos si el proceso ya no está cargado
    for(k = 0; k < procesos_cargados.length;k++){
        if(!nombres_procesos.includes(procesos_cargados[k])){
                let proceso_eliminar = procesos_cargados[k]
                for(i = 0; i<tabla.length;i++){
                    if(tabla[i][0] == proceso_eliminar){
                        // eliminamos el proceso de la tabla y de la lista de procesos cargados
                        tabla[i][0] = undefined
                        aux_procesos_car = aux_procesos_car.filter((element) => element !== proceso_eliminar);
                        break
                    }
                }
               
            }
    }
    procesos_cargados = aux_procesos_car

    //cargar procesos
    for(i = 0; i< nombres_procesos.length; i++){
            // validamos que el proceso no ocupe más memoria de la permitida por la partición
            // validamos que el proceso no este ya cargado en memoria
            if(programas[nombres_procesos[i]]<= offset && !procesos_cargados.includes(nombres_procesos[i])){
                for(j = 0; j<tabla.length; j++){
                    /*
                        Recorremos cada elemento de la tabla para buscar si hay alguna partición disponible
                        en caso de que no lo haya se registra en una nueva posición de la tabla
                    */
                    let posicion_inicial = tabla[j][2] + 1
                    // añadimos el proceso en un espacio vacio
                    if (tabla[j][0] === undefined){
                        tabla[j][0] = nombres_procesos[i]
                        procesos_cargados.push(nombres_procesos[i])
                        break
                    }
                }
            }
       
    }
    return tabla, tablaMarcos, tablaPaginas
}


// Test

let a = {'p2':{'bss':100,'text':100,'id':0}}

