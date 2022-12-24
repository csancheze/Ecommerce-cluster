import mongoose from 'mongoose';

const { Schema } = mongoose;

const productoSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  thumbnail: String,
  price: {
    type: Number,
    required: true
  }

});

 const Producto = mongoose.model('Productos', productoSchema);


 export default Producto
