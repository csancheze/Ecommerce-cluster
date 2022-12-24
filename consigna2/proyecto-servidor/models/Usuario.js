import mongoose from "mongoose";

const { Schema } = mongoose;

const usuarioSchema = new Schema({
    name: String,
    username:{
        type:String,
        required: true
    },
    password:{
        type:String,
        required:true
    }
});

export const UsuarioModel = mongoose.model("Usuarios", usuarioSchema);