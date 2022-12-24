const redirect = async () => {
    let url = window.location.href
    let data = {}
    await axios.post(url, data);
    window.location.assign("/login")
}

setTimeout(redirect, 2000);


