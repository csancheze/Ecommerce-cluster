import  Mensaje from '../models/Mensaje.js';
import  Producto from '../models/Producto.js';

export default class Contenedor {
    constructor(model) {
        if (model == "producto") {
            this.model = Producto;
            
        } else {
            this.model = Mensaje;
        }
        this.modelString= model
    }

    async save(element) {
        try {
            
            let result;

            await this.model.create(element);

            result = await this.model.find()
  
            console.log(result);

            return result

        } catch (error) {
            
            console.log('No se pudo guardar el elemento.' + error);
            
        }
    }

    async getById (id) {
        try {
            let result;

            result = await this.model.findById(id)
    
            console.log(result)
            return result

        } catch (error) {
            console.log('No se pudo encontrar el elemento.');
            
        }
    }

    async getAll () {
        try {
            let result;

            result = await this.model.find()

            console.log(result);

            return result

        } catch (error) {
            console.log('No se pudo guardar el elemento.' , error);
            
        }
    }

    
    async updateById (id, body) {
        try {

            let result = await this.model.findByIdAndUpdate(id, body)
            console.log(result)
            return result

        } catch (error) {
            console.log('No se pudo encontrar el elemento.');
            
        }
    }

    async deleteById (id) {
        try {

            let result = await this.model.deleteOne({_id: id})
            console.log(result)
            return result

        } catch (error) {
            console.log('No se pudo encontrar el elemento.');
        }
  
    }


    async deleteAll () {
        try {

            let result = await this.model.deleteMany()
            console.log(result)
            return result

        } catch (error) {
            console.log('No se pudo encontrar el elemento.');
        }
    }
}


