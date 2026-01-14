import './App.css'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Autism from './Difficulties/Autism';
import Hearing from './Difficulties/Hearing/Hearing';
import MiniGame from './Difficulties/Hearing/Minigame';
import Vision from './Difficulties/Vision/Vision';
import Dyslexia from './Difficulties/Dyslexia/Dyslexia';
import Emotion from './Difficulties/Emotion/Emotion';
import Movement from './Difficulties/Movement';
import Kviz from './Difficulties/Hearing/Kviz';
import DyslexiaExamples from './Difficulties/Dyslexia/DyslexiaExamples';
import DyslexiaQuiz from './Difficulties/Dyslexia/DyslexiaQuiz';

function App() {
    const navigate = useNavigate();

    const buttons = [
        { label: "Autizam", path: "/autizam" },
        { label: "Slabovidnost", path: "/slabovidnost" },
        { label: "Slušni problemi", path: "/sluh" },
        { label: "Disleksija", path: "/disleksija" },
        { label: "Pokret i tijelo", path: "/pokret" },
        { label: "Emocije i prijateljstvo", path: "/emocije" },
    ];

    return (
        <div className="app-container">
            {/* Oblaci u pozadini */}
            <div className="cloud cloud-1"></div>
            <div className="cloud cloud-2"></div>
            <div className="cloud cloud-3"></div>

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

            <div className="footer-message">
                💡 Izaberite temu da saznate kako možete pomoći svojim prijateljima!
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
                 <Route path="/sluh/minigame" element={<MiniGame />} />
                 <Route path="/sluh/kviz" element={<Kviz />} />
                <Route path="/disleksija" element={<Dyslexia />} />
                <Route path="/disleksija/primjeri" element={<DyslexiaExamples onBack={function (): void {
                    throw new Error('Function not implemented.');
                } } />} />
                <Route path="/disleksija/kviz" element={<DyslexiaQuiz />} />
                <Route path="/pokret" element={<Movement />} />
                <Route path="/emocije" element={<Emotion />} />

            </Routes>
        </Router>
    );
}