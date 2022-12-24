const login = document.getElementById("login")
const userName = document.getElementById("username")

login.addEventListener("click", async (e) =>{
    e.preventDefault()
    if(userName.value == "") {
        alert("Ingresa un nombre de usuario")
    } else {
        let url = window.location.href
        console.log(url)
        let data = {username: userName.value}
        await axios.post(url, data)
        window.location.assign("/")

    }
})