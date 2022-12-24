import Contenedor from "./dbOps.js"

const MessagesService = {

    async agregarMensaje (obj) {
        let resultado = await Mensajes.save(obj)
        return resultado
    },

    async todosLosMensajes () {
        let arreglo = await Mensajes.getAll()
        // console.log("mensajes", arreglo)
        return arreglo
    }

}

const Mensajes = new Contenedor("mensaje")

export default MessagesService
