var url_string = window.location.href
var url = new URL(url_string);

let N = url.searchParams.get("N")|| 300 //N
let s = url.searchParams.get("v")|| 5 // v
let R = url.searchParams.get("L")|| 25  // L
let η = url.searchParams.get("eta")|| 0.1 // η

const initialize = ()=>{

    document.getElementById("N").defaultValue = N
    document.getElementById("s").defaultValue = s
    document.getElementById("R").defaultValue = R
    document.getElementById("eta").defaultValue = η
    
    document.getElementById("NLable").innerHTML = 'No of Particles: '+ N
    document.getElementById("sLable").innerHTML = 'Speed: '+ s
    document.getElementById("RLable").innerHTML = 'Radius of perception: '+ R
    document.getElementById("etaLable").innerHTML = 'random Noise in direction of velocity: '+ η
}

console.log('success');

initialize()