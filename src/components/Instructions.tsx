import { useNavigate } from 'react-router-dom';

const Instructions = () => {
  const navigate = useNavigate();
  
    return (
    <div className="p-6 max-w-2xl mx-auto bg-gray-500 shadow-md rounded">
      <h1 className="text-2xl font-bold mb-4">Instrucciones del juego</h1>
      <ol className="list-decimal pl-4 space-y-2">
        <li>
          Párate frente a la cámara y muestra tu jugada (Piedra, Papel o
          Tijera).
        </li>
        <li>Haz clic en "Empezar" y espera 3 segundos.</li>
        <li>La IA hará una jugada aleatoria y verás el resultado.</li>
        <li>¡Repite para seguir jugando!</li>
      </ol>
      <h2 className="text-xl font-semibold mt-6">Consejos:</h2>
      <ul className="list-disc pl-4 space-y-2">
        <li>Asegúrate de que tu mano esté bien iluminada y visible.</li>
        <li>Asegúrate de que tu mano esté colocada de forma vertical.</li>
        <li>Intenta hacer la jugada de forma clara y rápida.</li>
        <li>Si la IA no reconoce tu jugada, intenta nuevamente.</li>
        <li>Diviértete y experimenta con diferentes jugadas.</li>
      </ul>
      <div className="mt-6">
        <button onClick={() => navigate("/")} className="px-4 py-2 text-white rounded bg-lapislazuli cursor-pointer">
          Volver a la página principal
        </button>
      </div>
    </div>
  );
};

export default Instructions;
