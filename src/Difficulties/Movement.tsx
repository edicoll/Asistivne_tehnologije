import { useNavigate } from "react-router-dom";

function Movement() {
    const navigate = useNavigate();
    return (
        <div className="page-container">
            <h2>Stranica: Pokret</h2>
            <p>Ovdje možeš dodati sadržaj vezan uz pokrete.</p>
            <button className="back-button" onClick={() => navigate("/")}>
                ⬅ Povratak
            </button>
        </div>
    );
}

export default Movement;