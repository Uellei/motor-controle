import MainLayout from "../layouts/MainLayout";

export default function Mathematic() {
    return (
      <MainLayout activePage="Mathematic">
        <div className="text-3xl p-2">Mathematic</div>
        <div className="border flex">
      <svg width="500">
        {/* Setpoint */}
        <text x="5" y="25" className="text-red-500 font-bold">Wref</text>
        <circle cx="30" cy="45" r="10" stroke="black" fill="white" />
        <line x1="40" y1="45" x2="60" y2="45" stroke="black" />

        {/* Controlador */}
        <rect x="60" y="20" width="140" height="50" fill="white" stroke="black" />
        <text x="65" y="50" className="text-black text-2xl font-semibold">K(s + 1/Ti)/s</text>

        {/* PWM */}
        <text x="205" y="35" className="text-red">PWM</text>
        <line x1="200" y1="45" x2="250" y2="45" stroke="black" />

        {/* Planta */}
        <rect x="250" y="20" width="180" height="50" fill="white" stroke="black" />
        <text x="255" y="50" className="text-black text-2xl font-semibold">K.e^(-Ls)/(Ts+1)</text>

        {/* Saída */}
        <line x1="430" y1="45" x2="470" y2="45" stroke="black" />
        <text x="450" y="35" className="text-red-500">Watual</text>

        {/* Feedback */}
        <line x1="470" y1="45" x2="470" y2="90" stroke="black" />
        <line x1="470" y1="90" x2="30" y2="90" stroke="black" />
        <line x1="30" y1="90" x2="30" y2="55" stroke="black" />
      </svg>
      
    </div>
      </MainLayout>
    );
}
