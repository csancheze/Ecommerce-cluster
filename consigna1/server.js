import express from 'express'
import products from './routes/products.js'
import handlebars from 'express-handlebars'
import  path from 'path'
import { Server } from "socket.io"
import MessagesService from './utils/messagesService.js'
import ProductsService from './utils/productsService.js'
import mongoose from 'mongoose';
import * as dotenv from 'dotenv' 
import { normalize, schema, denormalize } from "normalizr";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import {fileURLToPath} from "url";
import passport from "passport";
import {Strategy as LocalStrategy} from "passport-local"; 
import bcrypt from "bcrypt"; 
import {UsuarioModel} from "./models/Usuario.js";
import {Strategy as TwitterStrategy} from "passport-twitter";
import parsedArgs from "minimist";
import cluster from "cluster";
import os from "os";

dotenv.config()

const options = {default:{p:8080, m:"FORK"}, alias:{p:"port", m: "mode"}}

const objArguments = parsedArgs(process.argv.slice(2), options);

const PORT = objArguments.port
const MODE = objArguments.mode

const database = process.env.DATABASE || "mongodb"

if (database == "mongodb") {
    let uri = 'mongodb://localhost:27017/ecommerce2'
    if (process.env.MONGO_PASS) {
        uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.8aaoc.mongodb.net/ecommerce2?`
    }
    mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    }, error=>{
        if(error) throw new Error(`connection failed ${error}`);
        console.log("conexion exitosa")
    });
}
const app = express();

app.use(cookieParser());

app.use(session({
    store: MongoStore.create({
        mongoUrl: `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.8aaoc.mongodb.net/sessionsDB?retryWrites=true&w=majority`
    }),
    secret:process.env.CLAVE_SECRETA,
    resave:false,
    saveUninitialized: false,
    rolling: true,
    cookie:{
        maxAge:10 * 60 * 1000
    }
}));


app.use(passport.initialize()); 
app.use(passport.session());

passport.serializeUser((user,done)=>{
    done(null, user.id)
});

passport.deserializeUser((id,done)=>{

    UsuarioModel.findById(id,(err, userFound)=>{
        return done(err, userFound)
    })
});

const createHash = (password)=>{
    const hash = bcrypt.hashSync(password,bcrypt.genSaltSync(10));
    return hash;
}

passport.use("signupStrategy", new LocalStrategy(
    {
        passReqToCallback:true,
        usernameField: "email"
    },
    (req,username,password,done)=>{
        UsuarioModel.findOne({username:username},(error,userFound)=>{
            if(error) return done(error,null,{message:"Hubo un error"});
            if (req.path=="/signup"){
                if(userFound) return done(null,null,{message:"El usuario ya existe"});
            }
            if (req.path == "/login"){
                if(bcrypt.compareSync(password,userFound.password)){
                    req.session.username = userFound.name
                    console.log(req.session)
                    return done(null,userFound)
                } else {
                    return done(null,null,{message:"Contraseña erronea"})
                }
            }
            const newUser={
                name:req.body.name,
                username:username,
                password:createHash(password)
            };
            UsuarioModel.create(newUser,(error,userCreated)=>{
                if(error) return done(error, null, {message:"Hubo un error al registrar el usuario"})
                req.session.username = username
                console.log(req.session)
                return done(null,userCreated);
            })
        })
    }
));



const authorSchema = new schema.Entity("authors",{}, {idAttribute:"email"});
const messageSchema = new schema.Entity("messages", {author: authorSchema});
const chatSchema = new schema.Entity("chat", {
    messages:[messageSchema]
}, {idAttribute:"id"});

const normalizeData = (data)=>{
    const normalizeData = normalize({id:"chatHistory", messages:data}, chatSchema);
    return normalizeData;
};

const normalizeMensajes = async()=>{
    const results = await MessagesService.todosLosMensajes();;
    const messagesNormalized = normalizeData(results);
    return messagesNormalized;
}


const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename)


if(MODE === "CLUSTER" && cluster.isPrimary) {
    console.log("modo cluster")
    const numCPUS = os.cpus().length;
    for(let i=0; i<numCPUS;i++){
        cluster.fork(); 
    }

    cluster.on("exit",(worker)=>{
        console.log(`El subproceso ${worker.process.pid} falló`);
        cluster.fork();
    });

} else{

    const server = app.listen(PORT, ()=>console.log(`listening on port ${PORT}`));

    const io = new Server(server);

    io.on("connection",async (socket)=>{
        console.log("nuevo socket o cliente conectado", socket.id);
        socket.emit("messageFromServer","se ha conectado exitosamente")

        const products = await ProductsService.buscarTodos();
        socket.emit("productos",products)
        socket.emit("historico", await normalizeMensajes())
        socket.on("message",async data=>{
                console.log(data);
                console.log("hola", normalizeMensajes())
                await MessagesService.agregarMensaje(data);
                io.sockets.emit("historico", await normalizeMensajes());
            })
        socket.on("form",async data =>{
            console.log(data);
            const productos = await ProductsService.agregarProducto(data)
            io.sockets.emit("productos",productos)
        })
        
        
    })

}


app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.engine("handlebars",handlebars.engine());

app.use(express.static(path.join(__dirname, 'public')))

app.set("views", path.join(__dirname, "views"));

app.set("view engine", "handlebars");

const getUser=  async (id) => {
    const user = await UsuarioModel.findById(id)
    console.log(user)
    return user
}

app.get("/registro",(req,res)=>{
    const errorMessage = req.session.messages ? req.session.messages[0] : '';
    res.render("signup", {error:errorMessage});
    req.session.messages = [];
});

app.post("/signup",passport.authenticate("signupStrategy",{
    failureRedirect:"/registro",
    failureMessage: true //req.sessions.messages.
}),(req,res)=>{
    res.redirect("/",)
});

app.get("/login", (request, response) => {
    response.render("login")
})

app.post("/login", passport.authenticate('signupStrategy', { failureRedirect: '/login', failureMessage: true }),(req,res) => {
    res.redirect("/")
})

app.get("/logout", async (request, response) => {
    let user = {name: ""}
    let userDB = await getUser(request.session.passport.user)
    user.name = userDB.name
    console.log(user)
    response.render("logout", {user})
})

app.post("/logout", (request, response) => {
    request.session.destroy();
    response.redirect("/login")
})


app.use("/", products) 

