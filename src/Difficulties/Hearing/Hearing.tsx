import { useNavigate } from "react-router-dom";
import "./Hearing.css";

function Hearing() {
    const navigate = useNavigate();
    
    const goToAnimation = () => {
        navigate("/sluh/kviz");
    };
    
    const goToMiniGame = () => {
        navigate("/sluh/minigame");
    };
    
    return (
        <div className="hearing-container">
            <header className="hearing-header">
                <div className="header-content">
                    <div className="header-characters">
                        <div className="character character-left">👧</div>
                        <div className="character character-right">👦</div>
                    </div>
                    <h1>SLUŠNI SVIJET</h1>
                    <p className="subtitle">Otkrij kako komunicirati s prijateljima koji drugačije čuju!</p>
                    <div className="header-decoration">
                        <span className="decoration-item">👂</span>
                        <span className="decoration-item">🤟</span>
                        <span className="decoration-item">📝</span>
                        <span className="decoration-item">💬</span>
                    </div>
                </div>
            </header>
            
            <main className="hearing-content">
                <section className="intro-section full-width-section">
                    <div className="section-container">
                        <div className="section-header">
                            <div className="section-icon">🔊</div>
                            <h2>Što znači imati problem sa sluhom?</h2>
                        </div>
                        
                        <div className="kid-friendly-content">
                            <div className="info-card yellow-card">
                                <div className="card-icon">👂</div>
                                <div className="card-text">
                                    <h3>Drugačije čujemo</h3>
                                    <p>
                                        Neki ljudi ne čuju isto kao ti. To znači da im je teže čuti što govoriš, 
                                        osobito ako ima buke oko vas ili ako ne gledaju u tvoje lice.
                                    </p>
                                </div>
                            </div>
                            
                            <div className="info-card yellow-card">
                                <div className="card-icon">🤟</div>
                                <div className="card-text">
                                    <h3>Znakovni jezik</h3>
                                    <p>
                                        Mnogi ljudi s problemima sluha koriste <strong>znakovni jezik</strong> - 
                                        to je jezik ruku, gesta i izraza lica! To je potpuno pravi jezik, 
                                        kao i govor.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="communication-section">
                        <div className="section-container">
                            <h3 className="communication-title">Kako možemo komunicirati?</h3>
                            <div className="methods-grid">
                                <div className="method">
                                    <div className="method-icon">🤟</div>
                                    <div className="method-content">
                                        <h4>Znakovni jezik</h4>
                                        <p>Razgovor pomoću ruku i gesta</p>
                                    </div>
                                </div>
                                <div className="method">
                                    <div className="method-icon">👄</div>
                                    <div className="method-content">
                                        <h4>Čitanje s usana</h4>
                                        <p>Gledanje kako se usne pomiču</p>
                                    </div>
                                </div>
                                <div className="method">
                                    <div className="method-icon">📝</div>
                                    <div className="method-content">
                                        <h4>Pisanje poruka</h4>
                                        <p>Slanje poruka na papiru ili mobitelu</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                
                <section className="activities-section full-width-section">
                    <div className="section-container">
                        <div className="section-header">
                            <div className="section-icon">🎯</div>
                            <h2>Igraj se i uči!</h2>
                        </div>
                        
                        <p className="section-description">
                            Odaberi jednu od ovih zabavnih aktivnosti i nauči kako biti super prijatelj!
                        </p>
                        
                        <div className="activities-grid">
                            <div className="activity-card">
                                <div className="activity-icon" style={{backgroundColor: "#FFD166"}}>🎭</div>
                                <div className="activity-badge">NOVO!</div>
                                <h3>Kviz: "Čujem na svoj način"</h3>
                                <p>
                                    Pomozi Ani i Marku da se bolje razumiju! Jedan govori, 
                                    drugi koristi znakovni jezik.
                                </p>
                                <button className="activity-button yellow-btn" onClick={goToAnimation}>
                                    <span className="button-icon">▶</span>
                                    Pokreni kviz
                                </button>
                                <div className="activity-hint">
                                    <span className="hint-icon">💡</span>
                                    Naučit ćeš ispravno komunicirati s ljudima sa slušnim poteškoćama
                                </div>
                            </div>
                            
                            <div className="activity-card">
                                <div className="activity-icon" style={{backgroundColor: "#FFD166"}}>🎮</div>
                                <div className="activity-badge">ZABAVNO!</div>
                                <h3>Mini-igra: Nauči znakove</h3>
                                <p>
                                    Nauči 3 jednostavna znaka: "bok", "hvala" i "prijatelj". 
                                    Savršeno za početnike!
                                </p>
                                <button className="activity-button yellow-btn" onClick={goToMiniGame}>
                                    <span className="button-icon">🎮</span>
                                    Pokreni igru
                                </button>
                                <div className="activity-hint">
                                    <span className="hint-icon">⭐</span>
                                    Naučit ćeš novu vrstu komunikacije
                                </div>
                            </div>
                        </div>
                        
                        <div className="quiz-preview">
                            <h3>Primjer iz kviza:</h3>
                            <div className="quiz-question">
                                <p><strong>Ana želi reći Marku da je dobila peticu. Marko ne čuje dobro. Što bi Ana trebala učiniti?</strong></p>
                                <div className="quiz-options">
                                    <div className="quiz-option wrong">
                                        <span className="option-marker">❌</span>
                                        <span>Okrenuti se i vikati</span>
                                    </div>
                                    <div className="quiz-option correct">
                                        <span className="option-marker">✅</span>
                                        <span>Pokazati znak za "peticu" i nasmiješiti se</span>
                                    </div>
                                    <div className="quiz-option maybe">
                                        <span className="option-marker">📝</span>
                                        <span>Napisati na papirić</span>
                                    </div>
                                </div>
                            </div>
                            <div className="quiz-feedback">
                                <div className="feedback-icon">💬</div>
                                <p>"Komunikacija je uspješna kad se prilagodimo jedni drugima!"</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="tips-section full-width-section">
                    <div className="section-container">
                        <div className="section-header">
                            <div className="section-icon">🌟</div>
                            <h2>Kako biti super prijatelj?</h2>
                        </div>
                        
                        <div className="tips-grid">
                            <div className="tip-card">
                                <div className="tip-emoji">👁️</div>
                                <h4>Gledaj u lice</h4>
                                <p>Uvijek se obrati prijatelju direktno i gledaj ga u lice dok pričaš.</p>
                            </div>
                            
                            <div className="tip-card">
                                <div className="tip-emoji">👐</div>
                                <h4>Koristi ruke</h4>
                                <p>Pokazuj gestama i koristi jednostavne znakove ako ih znaš.</p>
                            </div>
                            
                            <div className="tip-card">
                                <div className="tip-emoji">😊</div>
                                <h4>Budi strpljiv</h4>
                                <p>Ponekad treba malo više vremena da se razumijemo, i to je u redu!</p>
                            </div>
                            
                            <div className="tip-card">
                                <div className="tip-emoji">📝</div>
                                <h4>Piši ili crtaj</h4>
                                <p>Ako ne ide, napiši ili nacrtaj što želiš reći.</p>
                            </div>
                        </div>
                        
                        <div className="super-friend">
                            <div className="super-icon">🦸</div>
                            <div className="super-text">
                                <h3>Ti si superheroj komunikacije!</h3>
                                <p>Svaki put kad se potrudiš da te netko razumije, činiš svijet boljim mjestom.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="hearing-footer full-width-section">
                <div className="section-container">
                    <button className="back-button yellow-back-btn" onClick={() => navigate("/")}>

                        Početna
                    </button>
                    <div className="footer-decoration">
                        <span className="footer-emoji">👂</span>
                        <span className="footer-emoji">🤟</span>
                        <span className="footer-emoji">💛</span>
                        <span className="footer-emoji">👫</span>
                        <span className="footer-emoji">👂</span>
                    </div>
                    <p className="footer-note">
                        Ova stranica pomoći će ti bolje razumjeti prijatelje koji drugačije čuju.
                    </p>
                </div>
            </footer>
        </div>
    );
}

export default Hearing;