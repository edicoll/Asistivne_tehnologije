import { useNavigate } from "react-router-dom";

function Emotions() {
    const navigate = useNavigate();
    return (
        <div className="page-container">
            <h2>Stranica: Emocije</h2>
            <p>Ovdje možeš dodati sadržaj vezan uz emocije.</p>
            <button className="back-button" onClick={() => navigate("/")}>
                ⬅ Povratak
            </button>
        </div>
    );
}

export default Emotions;