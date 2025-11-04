import { useNavigate } from "react-router-dom";

function Hearing() {
    const navigate = useNavigate();
    return (
        <div className="page-container">
            <h2>Stranica: Sluh</h2>
            <p>Ovdje možeš dodati sadržaj vezan uz sluh.</p>
            <button className="back-button" onClick={() => navigate("/")}>
                ⬅ Povratak
            </button>
        </div>
    );
}

export default Hearing;