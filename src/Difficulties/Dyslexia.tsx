import { useNavigate } from "react-router-dom";

function Dyslexia() {
    const navigate = useNavigate();
    return (
        <div className="page-container">
            <h2>Stranica: Dislekcija</h2>
            <p>Ovdje možeš dodati sadržaj vezan uz disleksiju.</p>
            <button className="back-button" onClick={() => navigate("/")}>
                ⬅ Povratak
            </button>
        </div>
    );
}

export default Dyslexia;