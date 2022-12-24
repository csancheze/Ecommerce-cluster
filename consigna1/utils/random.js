const random = (num) => {
    let max = parseInt(num) || 100000000 
    const resultados ={};
    for (let index = 0; index < max; index++) {
        const numeroAleatorio = parseInt(Math.random()*20+1);//18
        if(resultados[numeroAleatorio]){
            resultados[numeroAleatorio]++
        } else{
            resultados[numeroAleatorio] = 1;
        }
    }
    console.log(resultados)
    return resultados

}


process.send("listo");

process.on("message",(parentMsg)=>{

    if(parentMsg){
        const resultadoRandom = random(parentMsg);
        process.send(resultadoRandom);
    }
})