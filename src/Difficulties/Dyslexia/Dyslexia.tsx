import { useNavigate } from "react-router-dom";
import "./Dyslexia.css";

function Dyslexia() {
    const navigate = useNavigate();

    const dyslexiaFacts = [
        {
            emoji: "🧠",
            title: "Neurobiološko stanje",
            description: "Disleksija proizlazi iz načina na koji je mozak povezan, a ne iz nedostatka inteligencije ili truda."
        },
        {
            emoji: "🔤",
            title: "Drugačija obrada jezika",
            description: "Osobe s disleksijom obrađuju jezik drugačije od neurotipičnih čitatelja."
        },
        {
            emoji: "🌟",
            title: "Snage i talenti",
            description: "Osobe s disleksijom često imaju izvanredne kreativne, vizualne i prostorne sposobnosti."
        },
        {
            emoji: "👥",
            title: "Svuda oko nas",
            description: "Oko 10% ljudi ima disleksiju - to su vrlo vjerojatno i tvoji prijatelji ili kolege!"
        }
    ];

    const startDyslexiaExperience = () => {
        navigate("/disleksija/primjeri");
    };

    const startDyslexiaQuiz = () => {
        navigate("/disleksija/kviz");
    };

    return (
        <div className="dyslexia-main-container">
            {/* DODAN FLOAT BACK BUTTON GORE LIJEVO */}
            <button className="dyslexia-float-back-button" onClick={() => navigate("/")}>
                <span className="dyslexia-float-back-arrow">←</span>
                <span className="dyslexia-float-back-text">Početna</span>
            </button>

            <header className="dyslexia-main-header">
                <div className="dyslexia-header-content">
                    <div className="dyslexia-header-characters">
                        <div className="dyslexia-character dyslexia-character-left">👧</div>
                        <div className="dyslexia-character dyslexia-character-right">👦</div>
                    </div>
                    <h1>SVIJET DISLEKSIJE</h1>
                    <p className="dyslexia-subtitle">Otkrij kako je drukčije čitati i kako pomoći prijateljima s disleksijom!</p>
                    <div className="dyslexia-header-decoration">
                        <span className="dyslexia-header-decoration-item">🔤</span>
                        <span className="dyslexia-header-decoration-item">📖</span>
                        <span className="dyslexia-header-decoration-item">🧠</span>
                        <span className="dyslexia-header-decoration-item">🌟</span>
                    </div>
                </div>
            </header>

            <main className="dyslexia-main-content">
                <section className="dyslexia-intro-section dyslexia-full-width-section">
                    <div className="dyslexia-section-container">
                        <div className="dyslexia-section-header">
                            <div className="dyslexia-section-icon">🧠</div>
                            <h2>Što je disleksija?</h2>
                        </div>

                        <div className="dyslexia-facts-section">
                            <div className="dyslexia-section-container">
                                <div className="dyslexia-facts-grid">
                                    {dyslexiaFacts.map((fact, index) => (
                                        <div className="dyslexia-fact-card" key={index}>
                                            <div className="dyslexia-fact-icon">{fact.emoji}</div>
                                            <div className="dyslexia-fact-content">
                                                <h4>{fact.title}</h4>
                                                <p>{fact.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="dyslexia-experience-section">
                        <div className="dyslexia-section-container">
                            <div className="dyslexia-section-header">
                                <div className="dyslexia-section-icon">👁️</div>
                                <h3>Pogledaj svijet kroz oči osobe s disleksijom</h3>
                            </div>

                            <button className="dyslexia-experience-button dyslexia-purple-btn1" onClick={startDyslexiaExperience}>
                                Pogledaj primjere tekstova s disleksijom
                            </button>
                        </div>
                    </div>
                </section>

                <section className="dyslexia-activities-section dyslexia-full-width-section">
                    <div className="dyslexia-section-container">
                        <div className="dyslexia-section-header">
                            <div className="dyslexia-section-icon">🎯</div>
                            <h2>Igraj se i uči!</h2>
                        </div>

                        <div className="dyslexia-activities-grid">
                            <div className="dyslexia-activity-card">
                                <div className="dyslexia-activity-badge" style={{backgroundColor: "#7B1FA2"}}>KVIZ!</div>
                                <h3>🔤Kviz: "Pročitaj kroz disleksiju"</h3>
                                <p>
                                    Pogodi što piše na zamućenim tekstovima! Ispitaj svoje čitalačke vještine
                                    i razumijevanje izazova disleksije.
                                </p>

                                <button className="dyslexia-activity-button dyslexia-purple-btn2" onClick={startDyslexiaQuiz}>
                                    <span className="dyslexia-button-icon">▶</span>
                                    Pokreni kviz
                                </button>

                                <div className="dyslexia-activity-hint">
                                    <span className="dyslexia-hint-icon">💡</span>
                                    Naučit ćeš razumjeti izazove s kojima se susreću osobe s disleksijom
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="dyslexia-tips-section dyslexia-full-width-section">
                    <div className="dyslexia-section-container">
                        <div className="dyslexia-section-header">
                            <div className="dyslexia-section-icon">🌟</div>
                            <h2>Kako biti super prijatelj?</h2>
                        </div>

                        <div className="dyslexia-tips-grid">
                            <div className="dyslexia-tip-card">
                                <div className="dyslexia-tip-emoji">🗣️</div>
                                <h4>Čitaj naglas</h4>
                                <p>Ponekad pročitaj tekst naglas dok prijatelj prati očima - to jako pomaže!</p>
                            </div>

                            <div className="dyslexia-tip-card">
                                <div className="dyslexia-tip-emoji">⏱️</div>
                                <h4>Daj vremena</h4>
                                <p>Nemoj žuriti prijatelja dok čita - svakome treba svoje vrijeme.</p>
                            </div>

                            <div className="dyslexia-tip-card">
                                <div className="dyslexia-tip-emoji">📝</div>
                                <h4>Piši jasno</h4>
                                <p>Kad pišeš poruku prijatelju, koristi čitljiv rukopis i dobar razmak.</p>
                            </div>

                            <div className="dyslexia-tip-card">
                                <div className="dyslexia-tip-emoji">👍</div>
                                <h4>Hvali napredak</h4>
                                <p>Svaki napredak u čitanje je velika stvar - priznaj to!</p>
                            </div>
                        </div>

                        <div className="dyslexia-super-friend">
                            <div className="dyslexia-super-icon">🦸</div>
                            <div className="dyslexia-super-text">
                                <h3>Ti si superheroj razumijevanja!</h3>
                                <p>Kad pomažeš prijatelju s disleksijom, činiš svijet inkluzivnijim i ljepšim mjestom.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="dyslexia-famous-section dyslexia-full-width-section">
                    <div className="dyslexia-section-container">
                        <div className="dyslexia-section-header">
                            <div className="dyslexia-section-icon">⭐</div>
                            <h2>Poznate osobe s disleksijom</h2>
                        </div>

                        <div className="dyslexia-famous-grid">
                            <div className="dyslexia-famous-person">
                                <div className="dyslexia-person-emoji">🎬</div>
                                <h4>Steven Spielberg</h4>
                                <p>Poznati filmski redatelj</p>
                            </div>
                            <div className="dyslexia-famous-person">
                                <div className="dyslexia-person-emoji">🧪</div>
                                <h4>Albert Einstein</h4>
                                <p>Genijalni fizičar</p>
                            </div>
                            <div className="dyslexia-famous-person">
                                <div className="dyslexia-person-emoji">🎨</div>
                                <h4>Pablo Picasso</h4>
                                <p>Slavni slikar</p>
                            </div>
                            <div className="dyslexia-famous-person">
                                <div className="dyslexia-person-emoji">💼</div>
                                <h4>Richard Branson</h4>
                                <p>Uspješni poduzetnik</p>
                            </div>
                        </div>

                        <div className="dyslexia-famous-quote">
                            <div className="dyslexia-quote-icon">💬</div>
                            <p className="dyslexia-quote-text">
                                "Disleksija nije hendikep, već dar. Omogućuje vam da vidite svijet drugačije."
                            </p>
                            <p className="dyslexia-quote-author">- Salma Hayek</p>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="dyslexia-main-footer dyslexia-full-width-section">
                <div className="dyslexia-section-container">
                    {/* UKLONJEN OLD BACK BUTTON - sada je float gore */}
                    <p className="dyslexia-footer-note">
                        Ova stranica pomoći će ti bolje razumjeti prijatelje koji drugačije čitaju.
                    </p>
                </div>
            </footer>
        </div>
    );
}

export default Dyslexia;