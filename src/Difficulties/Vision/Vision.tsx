import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Vision.css';

const App: React.FC = () => {
  const navigate = useNavigate();
  // Stanje za kviz
  const [quizAnswers, setQuizAnswers] = useState<{[key: number]: number}>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState<'intro' | 'examples' | 'simulation' | 'quiz'>('intro');
  
  // Stanje za simulaciju
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [simulationType, setSimulationType] = useState<string>('normal');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Podaci za kviz
  const quizQuestions = [
    {
      id: 1,
      question: "Koji od sljedećih uvjeta uzrokuje gubitak perifernog vida (tunelski vid)?",
      options: [
        "Glaukom",
        "Katarakta",
        "Daltonizam",
        "Kratkovidost"
      ],
      correctAnswer: 0
    },
    {
      id: 2,
      question: "Što je Brajevo pismo?",
      options: [
        "Poseban font za lakše čitanje",
        "Sustav izbočenih točaka koje predstavljaju slova",
        "Povećana verzija standardnog teksta",
        "Posebno osvjetljenje za čitanje"
      ],
      correctAnswer: 1
    },
    {
      id: 3,
      question: "Kako se zove štap koji koriste slijepe osobe za kretanje?",
      options: [
        "Hodajći štap",
        "Vodički štap",
        "Bijeli štap",
        "Sigurnosni štap"
      ],
      correctAnswer: 2
    },
    {
      id: 4,
      question: "Koja je boja simbola za slabovidne osobe?",
      options: [
        "Crvena",
        "Plava",
        "Žuta",
        "Zelena"
      ],
      correctAnswer: 1
    }
  ];

  // Rukovanje odgovorima na kviz
  const handleAnswerSelect = (questionId: number, answerIndex: number) => {
    setQuizAnswers({
      ...quizAnswers,
      [questionId]: answerIndex
    });
  };

  // Provjera rezultata kviza
  const calculateQuizScore = () => {
    let score = 0;
    quizQuestions.forEach(question => {
      if (quizAnswers[question.id] === question.correctAnswer) {
        score++;
      }
    });
    return score;
  };

  // Rukovanje upload-om slike
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setUploadedImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Resetiranje uploadane slike
  const handleResetImage = () => {
    setUploadedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Povratak na početni izbornik
  const handleBackToMenu = () => {
    navigate('/');
  };

  // Simulacije različitih vrsti oštećenja vida
  const simulationTypes = [
    { id: 'normal', name: 'Normalan vid', description: 'Kako većina ljudi vidi' },
    { id: 'blur', name: 'Zamućenje', description: 'Kao kod katarakte ili visoke dioptrije' },
    { id: 'tunnel', name: 'Tunelski vid', description: 'Gubitak perifernog vida (glaukom)' },
    { id: 'central', name: 'Gubitak središnjeg vida', description: 'Macularna degeneracija' },
    { id: 'spots', name: 'Slijepe mrlje', description: 'Skotomi - mrlje u vidnom polju' },
    { id: 'lowvision', name: 'Smanjeni vid', description: 'Oštećenje vida koje se ne može korigirati' }
  ];

  // Renderiranje komponenti za simulaciju ovisno o odabranoj vrsti
  const renderSimulation = () => {
    const imageUrl = uploadedImage || 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
    
    return (
      <div className="simulation-container">
        <div className="image-preview-container">
          <div className={`image-wrapper ${simulationType}`}>
            <img 
              src={imageUrl} 
              alt="Primjer za simulaciju vida" 
              className="simulation-image"
            />
          </div>
          <div className="simulation-controls">
            <div className="upload-section">
              <p>Učitajte vlastitu sliku da vidite kako je vidite osobe s oštećenjem vida:</p>
              <input 
                type="file" 
                ref={fileInputRef}
                accept="image/*" 
                onChange={handleImageUpload}
                className="file-input"
              />
              <button onClick={handleResetImage} className="reset-btn">Resetiraj sliku</button>
            </div>
            
            <div className="simulation-types">
              <p>Odaberite vrstu simulacije:</p>
              <div className="type-buttons">
                {simulationTypes.map(type => (
                  <button
                    key={type.id}
                    onClick={() => setSimulationType(type.id)}
                    className={`type-btn ${simulationType === type.id ? 'active' : ''}`}
                  >
                    {type.name}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="simulation-description">
              <h3>{simulationTypes.find(t => t.id === simulationType)?.name}</h3>
              <p>{simulationTypes.find(t => t.id === simulationType)?.description}</p>
            </div>
          </div>
        </div>
        
        <div className="simulation-explanation">
          <h3>Što ovo znači u svakodnevnom životu?</h3>
          <ul>
            {simulationType === 'blur' && (
              <>
                <li>Čitanje teksta je teško bez povećala ili posebnih leća</li>
                <li>Prepoznavanje lica na daljinu je otežano</li>
                <li>Kretanje u nepoznatom okruženju može biti opasno</li>
              </>
            )}
            {simulationType === 'tunnel' && (
              <>
                <li>Osoba ne vidi što se događa s bočnih strana</li>
                <li>Lako se može naletjeti na predmete s strane</li>
                <li>Potrebna je posebna pažnja pri prelasku ulice</li>
              </>
            )}
            {simulationType === 'central' && (
              <>
                <li>Teško je čitati, pisati i prepoznavati lica</li>
                <li>Vid na rubovima može biti bolji nego u sredini</li>
                <li>Za čitanje se često koristi periferni vid</li>
              </>
            )}
            {simulationType === 'spots' && (
              <>
                <li>Dijelovi slike nedostaju ili su zamućeni</li>
                <li>Potrebno je pomicati glavu da bi se vidjeli dijelovi slike</li>
                <li>Čitanje je sporo jer se riječi "gube" u slijepim mrljama</li>
              </>
            )}
            {simulationType === 'lowvision' && (
              <>
                <li>Slike su mutne, nejasne i teško se prepoznaju detalji</li>
                <li>Potrebna je pomagala za povećanje ili poboljšanje kontrasta</li>
                <li>Svakodnevne aktivnosti zahtijevaju više vremena i truda</li>
              </>
            )}
            {simulationType === 'normal' && (
              <>
                <li>Ovo je kako većina ljudi vidi svijet</li>
                <li>Slike su oštre, boje živopisne i svi detalji su vidljivi</li>
                <li>Čitanje i prepoznavanje lica je jednostavno</li>
              </>
            )}
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div className="vision3-main-container">
      {/* Float back button - gore lijevo */}
      <button onClick={handleBackToMenu} className="vision3-float-back-button">
        <span className="vision3-float-back-arrow">←</span>
        <span className="vision3-float-back-text">Početna</span>
      </button>

      <header className="vision3-main-header">
        <div className="vision3-header-content">
          <div className="vision3-characters">
            <div className="vision3-character vision3-character-left">👁️</div>
            <div className="vision3-character vision3-character-right">👓</div>
          </div>
          <h1>Kako vide slijepe i slabovidne osobe?</h1>
          <p className="vision3-subtitle">Interaktivno učenje o vidu</p>
          <div className="vision3-header-decoration">
            <div className="vision3-decoration-item">🔍</div>
            <div className="vision3-decoration-item">👁️‍🗨️</div>
            <div className="vision3-decoration-item">🧑‍🦯</div>
            <div className="vision3-decoration-item">👓</div>
          </div>
        </div>
      </header>

      <nav className="vision3-navigation">
        <button 
          className={`vision3-nav-btn ${activeTab === 'intro' ? 'active' : ''}`}
          onClick={() => setActiveTab('intro')}
        >
          Uvod
        </button>
        <button 
          className={`vision3-nav-btn ${activeTab === 'examples' ? 'active' : ''}`}
          onClick={() => setActiveTab('examples')}
        >
          Primjeri
        </button>
        <button 
          className={`vision3-nav-btn ${activeTab === 'simulation' ? 'active' : ''}`}
          onClick={() => setActiveTab('simulation')}
        >
          Simulacija
        </button>
        <button 
          className={`vision3-nav-btn ${activeTab === 'quiz' ? 'active' : ''}`}
          onClick={() => setActiveTab('quiz')}
        >
          Kviz
        </button>
      </nav>

      <main className="vision3-main-content">
        {activeTab === 'intro' && (
          <section className="vision3-intro-section vision3-full-width-section">
            <div className="vision3-section-container">
              <div className="vision3-section-header">
                <div className="vision3-section-icon">👁️</div>
                <h2>Što znači biti slabovidan?</h2>
              </div>
              
              <div className="vision3-kid-friendly-content">
                <div className="vision3-blue-card">
                  <div className="vision3-card-icon">👓</div>
                  <div className="vision3-card-text">
                    <h3>Što je to?</h3>
                    <p>
                      Slabovidne osobe imaju oštećenje vida koje se ne može potpuno ispraviti naočalama, 
                      lećama ili operacijom. To znači da im je vid ograničen, ali ne i potpuno odsutan.
                    </p>
                  </div>
                </div>
                
                <div className="vision3-blue-card">
                  <div className="vision3-card-icon">🔄</div>
                  <div className="vision3-card-text">
                    <h3>Različiti oblici</h3>
                    <p>
                      Postoje različite vrste oštećenja vida: zamućenje vida, tunelski vid, 
                      slijepe mrlje i smanjeni vid. Svaki ima svoje specifičnosti.
                    </p>
                  </div>
                </div>
                
                <div className="vision3-blue-card">
                  <div className="vision3-card-icon">🧑‍🦯</div>
                  <div className="vision3-card-text">
                    <h3>Potpuna sljepoća</h3>
                    <p>
                      Kod slijepih osoba je osjetilo vida u potpunosti odsutno ili mogu razlikovati 
                      svjetlost i tamu. Koriste bijeli štap, pomoć druge osobe ili psa vodiča.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="vision3-fun-fact">
                <h3>Znaš li?</h3>
                <p>
                  Brajevo pismo je sustav izbočenih točaka koje predstavljaju slova i brojeve. 
                  Slijepe osobe ga čitaju dodirivanjem prstima!
                </p>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'examples' && (
          <section className="vision3-examples-section vision3-full-width-section">
            <div className="vision3-section-container">
              <div className="vision3-section-header">
                <div className="vision3-section-icon">🖼️</div>
                <h2>Kako izgleda svijet osobama s oštećenjem vida?</h2>
              </div>
              
              <p className="vision3-section-description">
                Ovdje možete vidjeti kako se ista scena prikazuje osobama s različitim vrstama oštećenja vida.
              </p>
              
              <div className="vision3-examples-grid">
                <div className="vision3-example-card">
                  <div className="vision3-example-badge">Normalno</div>
                  <div className="vision3-example-icon">👁️</div>
                  <h3>Normalan vid</h3>
                  <div className="vision3-example-image normal-vision">
                    <div className="vision3-image-placeholder">
                      <p>🖼️ SLIKA: Jasna slika ulice s ljudima, drvećem i zgradama</p>
                    </div>
                  </div>
                  <p>Jasna slika sa svim detaljima i bojama</p>
                </div>
                
                <div className="vision3-example-card">
                  <div className="vision3-example-badge">Zamućeno</div>
                  <div className="vision3-example-icon">🌫️</div>
                  <h3>Zamućenje vida (katarakta)</h3>
                  <div className="vision3-example-image blur-vision">
                    <div className="vision3-image-placeholder">
                      <p>🖼️ SLIKA: Ista slika, ali zamućena kao da je pod vodom</p>
                    </div>
                  </div>
                  <p>Sve je mutno i nejasno, teško je prepoznati detalje</p>
                </div>
                
                <div className="vision3-example-card">
                  <div className="vision3-example-badge">Tunelski</div>
                  <div className="vision3-example-icon">🚇</div>
                  <h3>Tunelski vid (glaukom)</h3>
                  <div className="vision3-example-image tunnel-vision">
                    <div className="vision3-image-placeholder">
                      <p>🖼️ SLIKA: Ista slika, ali tamna oko rubova, kao da gledate kroz tunel</p>
                    </div>
                  </div>
                  <p>Vidi se samo središnji dio, rubovi su tamni</p>
                </div>
                
                <div className="vision3-example-card">
                  <div className="vision3-example-badge">Mrlje</div>
                  <div className="vision3-example-icon">🔘</div>
                  <h3>Slijepe mrlje (skotomi)</h3>
                  <div className="vision3-example-image spots-vision">
                    <div className="vision3-image-placeholder">
                      <p>🖼️ SLIKA: Ista slika s tamnim mrljama na različitim mjestima</p>
                    </div>
                  </div>
                  <p>Dijelovi slike nedostaju ili su zamućeni</p>
                </div>
              </div>
              
              <div className="vision3-challenges">
                <h3>Izazovi s kojima se susreću slabovidne osobe</h3>
                <div className="vision3-challenges-grid">
                  <div className="vision3-challenge-card">
                    <h4>📖 Čitanje</h4>
                    <p>Običan tekst može biti premalen za čitanje. Rješenje: povećala, Brajevo pismo, audioknjige.</p>
                  </div>
                  <div className="vision3-challenge-card">
                    <h4>🚶 Kretanje</h4>
                    <p>Teško je vidjeti prepreke, stepenice, signalizaciju. Rješenje: bijeli štap, pas vodič, dobro osvjetljenje.</p>
                  </div>
                  <div className="vision3-challenge-card">
                    <h4>👥 Prepoznavanje lica</h4>
                    <p>Lica mogu biti mutna ili nejasna. Rješenje: prepoznavanje po glasu, oblačenju, hodu.</p>
                  </div>
                  <div className="vision3-challenge-card">
                    <h4>💻 Korištenje računala</h4>
                    <p>Tekst na ekranu može biti premalen. Rješenje: povećanje teksta, screen readers (programi koji čitaju tekst).</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'simulation' && (
          <section className="vision3-simulation-section vision3-full-width-section">
            <div className="vision3-section-container">
              {renderSimulation()}
            </div>
          </section>
        )}

        {activeTab === 'quiz' && (
          <section className="vision3-quiz-section vision3-full-width-section">
            <div className="vision3-section-container">
              <div className="vision3-section-header">
                <div className="vision3-section-icon">❓</div>
                <h2>Provjeri što si naučio!</h2>
              </div>
              
              <p className="vision3-section-description">
                Odgovori na pitanja i provjeri koliko znaš o vidu i načinima na koje slabovidne osobe vide svijet.
              </p>
              
              <div className="vision3-quiz-container">
                {quizQuestions.map((question, index) => (
                  <div key={question.id} className="vision3-quiz-question">
                    <h3>Pitanje {index + 1}: {question.question}</h3>
                    <div className="vision3-quiz-options">
                      {question.options.map((option, optionIndex) => (
                        <div 
                          key={optionIndex} 
                          className={`vision3-quiz-option ${
                            quizSubmitted 
                              ? optionIndex === question.correctAnswer 
                                ? 'correct' 
                                : quizAnswers[question.id] === optionIndex 
                                  ? 'incorrect' 
                                  : ''
                              : quizAnswers[question.id] === optionIndex
                                ? 'selected'
                                : ''
                          }`}
                          onClick={() => !quizSubmitted && handleAnswerSelect(question.id, optionIndex)}
                        >
                          <span className="vision3-option-marker">{String.fromCharCode(65 + optionIndex)}.</span>
                          {option}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                
                {!quizSubmitted ? (
                  <button 
                    className="vision3-submit-btn" 
                    onClick={() => {
                      if (Object.keys(quizAnswers).length === quizQuestions.length) {
                        setQuizSubmitted(true);
                      } else {
                        alert("Molimo odgovorite na sva pitanja prije nego što pošaljete kviz!");
                      }
                    }}
                  >
                    Pošalji odgovore
                  </button>
                ) : (
                  <div className="vision3-quiz-results">
                    <h3>🎉 Rezultat: {calculateQuizScore()} od {quizQuestions.length} točno</h3>
                    <p>
                      {calculateQuizScore() === quizQuestions.length 
                        ? "Odlično! Sada dobro razumiješ kako vide slabovidne osobe!" 
                        : calculateQuizScore() >= quizQuestions.length / 2 
                        ? "Dobar pokušaj! Još malo uči i bit ćeš stručnjak!" 
                        : "Probaj ponovno pročitati informacije i pokušati kviz ponovno!"}
                    </p>
                    <button 
                      className="vision3-retry-btn" 
                      onClick={() => {
                        setQuizAnswers({});
                        setQuizSubmitted(false);
                      }}
                    >
                      Pokušaj ponovno
                    </button>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className="vision3-main-footer">
        <div className="vision3-section-container">
          <div className="vision3-footer-decoration">
            <div className="vision3-footer-emoji">👁️</div>
            <div className="vision3-footer-emoji">🧑‍🦯</div>
            <div className="vision3-footer-emoji">👓</div>
            <div className="vision3-footer-emoji">🔍</div>
            <div className="vision3-footer-emoji">💡</div>
          </div>
          <p className="vision3-footer-note">
            Ova stranica je napravljena kako bi pomogla djeci da razumiju kako vide slabovidne osobe.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;