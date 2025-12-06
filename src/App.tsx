import './App.css'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Autism from './Difficulties/Autism';
import Hearing from './Difficulties/Hearing/Hearing';
import Vision from './Difficulties/Vision';
import Dyslexia from './Difficulties/Dyslexia';
import Emotions from './Difficulties/Emotions';
import Movement from './Difficulties/Movement';

function App() {
    const navigate = useNavigate();


    const buttons = [
        { label: "🧠 Autizam", path: "/autizam" },
        { label: "👀 Slabovidnost", path: "/slabovidnost" },
        { label: "💬 Slušni problemi", path: "/sluh" },
        { label: "🔤 Disleksija", path: "/disleksija" },
        { label: "🦽 Pokret i tijelo", path: "/pokret" },
        { label: "🤝 Emocije i prijateljstvo", path: "/emocije" },
    ];

    return (
        <div className="app-container">
            <h1 className="app-title">Moj posebni prijatelj → svi učimo zajedno</h1>
            <h2 className="description">Svi smo različiti, ali učimo jedni o drugima – nema predrasuda, samo suranja i razumijevanje.</h2>
            <div className="button-grid">
                {buttons.map((btn) => (
                    <button
                        key={btn.label}
                        className="app-button"
                        onClick={() => navigate(btn.path)}
                    >
                        {btn.label}
                    </button>
                ))}
            </div>
        </div>
    );
}

// Da bi `useNavigate()` radilo, treba Router omotavanje
export default function RootApp() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/autizam" element={<Autism />} />
                <Route path="/slabovidnost" element={<Vision />} />
                <Route path="/sluh" element={<Hearing />} />
                <Route path="/disleksija" element={<Dyslexia />} />
                <Route path="/pokret" element={<Movement />} />
                <Route path="/emocije" element={<Emotions />} />

            </Routes>
        </Router>
    );
}