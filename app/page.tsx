"use client";
import { useState } from "react";

export default function Juego() {
  const [puntos, setPuntos] = useState(0);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Juego de clics 🎮</h1>
      <p>Puntos: {puntos}</p>

      <button
        onClick={() => setPuntos(puntos + 1)}
        style={{ padding: "20px", fontSize: "20px" }}
      >
        Haz clic
      </button>
    </div>
  );
}