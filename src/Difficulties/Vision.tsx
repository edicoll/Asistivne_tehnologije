import { useNavigate } from "react-router-dom";

function Vision() {
    const navigate = useNavigate();
    return (
        <div className="page-container">
            <h2>Stranica: Vid</h2>
            <p>Ovdje možeš dodati sadržaj vezan uz vid.</p>
            <button className="back-button" onClick={() => navigate("/")}>
                ⬅ Povratak
            </button>
        </div>
    );
}

export default Vision;