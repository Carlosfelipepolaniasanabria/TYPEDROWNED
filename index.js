/*console.log("Mi primer script");

alert("Mi primer alerta");

const usuario = prompt("¿Como te llamas?");

if(usuario){
    console.log(`El vistante se llama: ${usuario}`)
}else{
    alert("No quisiste decirme tu nombre :(");
}

let edad = prompt("Ingresa tu edad")

const quiereVer = confirm("¿Quieres ver el contenido completo?")
if(quiereVer) {
    console.log("El usuario aceptó ver el contenido");
    alert(`!Hola \n ${usuario} tu edad es ${edad}`);
}else{
    console.log("El usuario rechazó ver el contenido");
}


for(let i=0; i < edad; i++){
    console.log(`iteracion${i}`)
}

let ramdon = ["limon", 5, "casa"]

console.log(ramdon[2]);

ramdon.push(172)
ramdon.pop();
ramdon.unshift("Guanabana");
ramdon.shift(""); 
*/
function Validarformulario() {
        const nombre = document.querySelector('#nombre');
        const apellido = document.querySelector('#apellido');

                if(nombre.value.trim() === ''){
                    nombre.setAttribute('class','invalido');
                } else {
                    nombre.setAttribute('class','valido');
                    alert('Validacion exitosa')
                }

                if(apellido.value.trim() === ''){
                    apellido.setAttribute('class','invalido');
                } else {
                    apellido.setAttribute('class','valido');
                    alert('Validacion exitosa')
                }
        }

const btnChange = document.querySelector(".boton");

//btnChange.onclick = function(){
//    alert("Soy un listener online");
//}

function mouseClicked(){
    alert("Soy un listener.");
}

function clickedTwice(){
    alert("Me clickeo dos veces.");
}

function cambiarcosas(){
    const auxbtn = document.querySelector('.boton')
    auxbtn.setAttribute('disable','true');
}

//btnChange.addEventListener("click", mouseClicked);
btnChange.addEventListener("dblclick", clickedTwice);

const para = document.createElement("button");
const node = document.createTextNode("this is new:");

para.appendChild(node);
const element = document.querySelector("#miFormulario"); 
element.appendChild(para);

const elements = document.getElementsByClassName("item");
console.log(elements);
console.log(elements[0]);

const aux =document.querySelector(".container .sandbox .item");
const aux1 =document.querySelectorAll(".container .sandbox .item"); 

const Persona = {
    edad: 38,
    nombre: "Pepito",
    apellido: "Perez",
    hobbies: ["futbol", "VJ", "Dormir"],
    hijos: [{ edad: 8,
        nombre: "Ana",
        apellido: "Perez",
        hobbies: ["Muñecas"],
        hijos: []
    }]
}

const jsonpersona = json.strigify(Persona);
console.log(jsonpersona);

const auxpersona = json
