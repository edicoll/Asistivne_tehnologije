import { useNavigate } from "react-router-dom";

function Vision() {
    const navigate = useNavigate();
    return (
        <div className="page-container">
            <h2>Stranica: Vid</h2>
            <p>Ovdje možeš dodati sadržaj vezan uz vid.</p>
            <h3>Pogledajmo s kojim se poteškoćama susreću osobe s slabovidnošću</h3>
            <h3>Započinom kviz</h3>
            <button className="back-button" onClick={() => navigate("/")}>
                ⬅ Povratak
            </button>
        </div>
    );
}

export default Vision;