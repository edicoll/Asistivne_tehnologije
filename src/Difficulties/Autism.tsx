import { useNavigate } from "react-router-dom";
import './Dyslexia.css'

function Autism() {
    const navigate = useNavigate();
    return (
        <div className="page-container">
            <h2>Stranica: Autizam</h2>
            <p>Ovdje možeš dodati sadržaj vezan uz autizam.</p>
            <h3>Pogledajmo s kojim poteškoćama se susreću osobe s autizmom</h3>
            <button className="back-button" onClick={() => navigate("/")}>
                ⬅ Povratak
            </button>
        </div>
    );
}

export default Autism;