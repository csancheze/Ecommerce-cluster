import Contenedor from "./dbOps.js"

const ProductsService = {

   async buscarPorId (id) {
    
        let resultado = await Productos.getById(id)
            return resultado
    },
    
    async agregarProducto (obj) {
        let resultado = await Productos.save(obj)
        return resultado
    },
    
    async actualizarPorId (id, body) {
        let resultado = await Productos.updateById(id,body)
        return resultado
    },
        
    async buscarTodos (){
        let arreglo = await Productos.getAll()
        return arreglo
    },
        
    async borrarTodos () {
        await Productos.deleteAll()
    },
        
    async borrarPorId  (id) {
        await Productos.deleteById(id)
        return "Borrado"
    },
}

const Productos = new Contenedor("producto")



export default ProductsService
    



