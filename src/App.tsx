import './App.css'

function App() {
    const buttons = [
        "Autizam",
        "Slabovisnost",
        "Slušni problemi",
        "Settings",
        "Notifications",
        "Logout",
    ];

    return (
        <div className="app-container">
            <h1 className="app-title">Naziv aplikacije</h1>
            <h2 className="description">Opis i odabir poteškoća</h2>
            <div className="button-grid">
                {buttons.map((label) => (
                    <button key={label} className="app-button">
                        {label}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default App
