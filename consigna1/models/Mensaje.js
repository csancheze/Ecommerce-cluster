import mongoose  from 'mongoose';

const { Schema } = mongoose;

const mensajeSchema = new Schema(
    {
    author: {
        id: {
            type: String,
            required: true
        },
        nombre: {
            type: String,
            required:true
        },
        apellido: {
            type: String,
            required:true
        },
        edad: {
            type: Number,
            required:true
        },
        alias: {
            type: String,
            required:true
        },
        avatar: {
            type: String,
            required:true
        }
    },
    text: {
        type:String,
        required:true
        }
    },
    {timestamps: true});

const Mensaje = mongoose.model('Mensajes', mensajeSchema);

export default Mensaje



