

const socketClient = io();

socketClient.on("messageFromServer",(data)=>{
    console.log(data)
})


let user;

const email = document.getElementById("email");
const nombre = document.getElementById("nombre");
const apellido = document.getElementById("apellido");
const edad = document.getElementById("edad");
const alias = document.getElementById("alias");
const avatar = document.getElementById("avatar");


socketClient.on("messages", (mensajes)=>{
    console.log(mensajes)
})

const campo = document.getElementById("messageField")

campo.addEventListener("keydown",(evt)=>{
    user = email.value
    if (alias.value && user && nombre.value && apellido.value && edad.value && avatar.value && user.includes("@")) {
    if(evt.key === "Enter"){
        socketClient.emit("message",{
            author: {
                id: user,
                nombre : nombre.value,
                apellido: apellido.value,
                edad: edad.value,
                alias: alias.value,
                avatar: avatar.value},
            text:campo.value
        })

    }
} else {
    alert("Necesitas ingresar tus datos para chatear")
    campo.innerHTML = ""
}
})

const messageContainer = document.getElementById("messageContainer");

const authorSchema = new normalizr.schema.Entity("authors",{}, {idAttribute:"email"});
const messageSchema = new normalizr.schema.Entity("messages", {author: authorSchema});
const chatSchema = new normalizr.schema.Entity("chat", {
    messages:[messageSchema]
}, {idAttribute:"id"});

socketClient.on ("historico", async (data)=>{

   
    let elementos="";

    let normalData = await normalizr.denormalize(data.result,chatSchema,data.entities);

    console.log(normalData)

    elementos =   `<h1>Porcentaje de compresión: ${(100 - 100 * JSON.stringify(normalData).length / JSON.stringify(data).length).toFixed(2)} </h1>` 

    normalData.messages.forEach(item=>{
        item = item._doc
        let date = new Date(item.createdAt).toLocaleString().replace(",", "")

        elementos = elementos + `<p><strong style="color: blue">${item.author.alias}</strong> <spam style ="color: brown">[${date}] </spam>: <i style="color: green">${item.text}</i><img style="display: inline-block" height=25px src=${item.author.avatar}></img></p> `;
    });
    messageContainer.innerHTML = elementos;
})

const form = document.getElementById("form")

form.addEventListener("submit", (e)=> {
    e.preventDefault()
    socketClient.emit("form",{
        title:e.target[0].value,
        price:e.target[1].value,
        thumbnail:e.target[2].value,
    })
})

const table = document.getElementById("tabla");

socketClient.on("productos", (data)=>{
    console.log(data)
    let elementos=""
    data.forEach(item=>{
        
        elementos = elementos + `<tr>
        <th scope="row">${item._id}</th>
        <td>${item.title}</td>
        <td>${item.price}</td>
        <td><img style="height: 50px" src="${item.thumbnail}"></td>
    </tr>`
    });
    table.innerHTML = elementos;
})

const logout = document.getElementById("logout")

logout.addEventListener("click", async (e) =>{
    e.preventDefault()
    window.location.replace("/logout")
})

