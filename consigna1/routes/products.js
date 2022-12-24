import express from "express"
import ProductsService from "../utils/productsService.js"
import {faker} from "@faker-js/faker";
const  products = express.Router();
const {commerce, image} = faker;
faker.locale = "es";
import {UsuarioModel} from "../models/Usuario.js";
import {fork} from "child_process";

const app = express();

const getUser=  async (id) => {
    const user = await UsuarioModel.findById(id)
    console.log(user)
    return user
}


const checkLogin = (request,response,next)=>{
    console.log("authOk", request.isAuthenticated())
    if(request.isAuthenticated()){
        next();
    } else{
        response.redirect("/login");
    }
}

products.get("/", checkLogin, async (request, response)=>{
    let user = {name: ""}
    let userDB = await getUser(request.session.passport.user)
    user.name = userDB.name
    console.log(user)
    response.render("form", {user})
})

products.post("/productos", checkLogin, async(request,response)=>{
    const newProduct = request.body;
    const productos = await ProductsService.agregarProducto(newProduct);
    console.log(productos)
    response.redirect("/")
})

products.get("/api/productos-test", checkLogin, async (request, response)=>{
    let user = {name: ""}
    let userDB = await getUser(request.session.passport.user)
    user.name = userDB.name
    console.log(user)
    let productos=[];
    for(let i=0;i<5;i++){
        
        productos.push(
            {
                title: commerce.productName(),
                thumbnail: image.imageUrl(100,100,"product",true),
                price: commerce.price()
            }
        )
    }
   response.render("test", {productos,user})
})

products.get("/info", (request, response)=>{
    console.log(process)
    let path = "path: " + process.cwd()
    let id = "id: " + process.pid
    let version = "version: " + process.version
    let title = "title: " + process.title
    let system= "system: " + process.platform
    let memory = "memory rss: " + JSON.stringify(process.memoryUsage().rss)
    let args = "argumentos: " + process.argv.slice(2)
    let execpath = "Exec path: " + process.execPath

   response.send(`<div> <h1> INFO </h1><ul><li> ${path} </li> <li> ${id} </li> <li> ${version} </li> <li> ${title} </li> <li> ${system} </li> <li> ${memory} </li> <li> ${args} </li> <li> ${execpath} </li> </ul> </div>`)
})

products.get("/random", (request, response)=>{
    let cant = request.query.cant
    const child = fork("./utils/random.js");
    child.on("message",(childMsg)=>{
        if(childMsg === "listo"){
            child.send(cant.toString())
        } else {
            response.json({resultado:childMsg})
        }
    });
})
    
    

export default products