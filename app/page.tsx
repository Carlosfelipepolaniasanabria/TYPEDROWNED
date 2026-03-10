"use client";
import { useState, useEffect } from "react";

export default function Juego() {

  const frases = [
    "La programacion es poderosa",
    "Aprender a escribir rapido es util",
    "Next js permite crear apps modernas"
  ];

  const [frase, setFrase] = useState(frases[0]);
  const [input, setInput] = useState("");
  const [tiempo, setTiempo] = useState(10);
  const [agua, setAgua] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTiempo((t) => t - 1);
      setAgua((a) => a + 5);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  function escribir(e) {
    const texto = e.target.value;
    setInput(texto);

    if (texto === frase) {
      setInput("");
      setTiempo(10);
      setAgua(0);

      const nueva = frases[Math.floor(Math.random() * frases.length)];
      setFrase(nueva);
    }
  }

  return (
    <div style={{textAlign:"center", marginTop:"50px"}}>

      <h1>Type Drowned ⌨️💧</h1>

      <h2>{frase}</h2>

      <input
        value={input}
        onChange={escribir}
        style={{fontSize:"20px", padding:"10px", width:"400px"}}
      />

      <h3>Tiempo: {tiempo}</h3>

      <div style={{
        width:"200px",
        height:"200px",
        border:"2px solid black",
        margin:"20px auto",
        position:"relative"
      }}>

        <div style={{
          position:"absolute",
          bottom:0,
          width:"100%",
          height:`${agua}%`,
          background:"blue"
        }}></div>

        <div style={{
          position:"absolute",
          top:"10px",
          width:"100%",
          textAlign:"center",
          fontSize:"40px"
        }}>
          😨
        </div>

      </div>

    </div>
  );
}