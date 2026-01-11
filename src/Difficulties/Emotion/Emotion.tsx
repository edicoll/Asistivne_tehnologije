import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Emotion.css';

const Emotion: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'intro' | 'situations' | 'quiz'>('intro');
  const [selectedResponses, setSelectedResponses] = useState<{[key: number]: number}>({});
  const [showFeedback, setShowFeedback] = useState<{[key: number]: boolean}>({});

  // Podaci za situacije iz image.png
  const situations = [
    {
      id: 1,
      title: "Dijete plače",
      description: "Vidiš svog prijatelja kako sjedi sam i tiho plače.",
      icon: "😢",
      question: "Što tvoj prijatelj osjeća i kako možeš pomoći?",
      responses: [
        "Ignorirati ga - možda želi biti sam",
        "Pitati ga: 'Jesi li u redu? Želiš li pričati o tome?'",
        "Reći mu: 'Prestani plakati, nije tako strašno'",
        "Samo sjediti pored njega u tišini"
      ],
      correctResponse: 1,
      feedback: "Odlično! Kada netko plače, važno je pokazati da ti je stalo. Pitaj ih kako se osjećaju i pokaži razumijevanje."
    },
    {
      id: 2,
      title: "Dijete se smije",
      description: "Tvoj prijatelj se smije i skače od sreće.",
      icon: "😄",
      question: "Što tvoj prijatelj osjeća i kako možeš podijeliti tu radost?",
      responses: [
        "Pitati ga: 'Čemu se toliko smiješ? Podijeli sa mnom!'",
        "Samo ga gledati i ništa ne reći",
        "Reći mu: 'Ti se uvijek nečemu smiješ'",
        "Početi se smijati s njim"
      ],
      correctResponse: 0,
      feedback: "Tako je! Kada se netko smije, lijepo je pitati što ga veseli. Tako dijelite radost i jačate prijateljstvo."
    },
    {
      id: 3,
      title: "Dijete je ljuto",
      description: "Tvoj prijatelj je crven u licu, stisnute su šake i udara nogom o pod.",
      icon: "😠",
      question: "Što tvoj prijatelj osjeća i kako možeš pomoći?",
      responses: [
        "Viknuti na njega da se smiri",
        "Pitati ga: 'Vidim da si ljut. Želiš li mi reći što se dogodilo?'",
        "Otići od njega dok se ne smiri",
        "Ismijavati ga jer je ljut"
      ],
      correctResponse: 1,
      feedback: "Sjajno! Kada je netko ljut, važno je priznati njegove osjećaje i dati mu prostor da ih izrazi. Pitaj ga što ga muči."
    },
    {
      id: 4,
      title: "Dijete je uplašeno",
      description: "Tvoj prijatelj drhti, gleda u pod i ne govori ništa.",
      icon: "😨",
      question: "Što tvoj prijatelj osjeća i kako možeš pomoći?",
      responses: [
        "Reći mu: 'Nemoj biti kukavica!'",
        "Pitati ga tiho: 'Bojim se da si prestrašen. Mogu li ti pomoći?'",
        "Natjerati ga da priča o tome",
        "Ignorirati ga jer se samo pravi"
      ],
      correctResponse: 1,
      feedback: "Odličan izbor! Kada je netko uplašen, treba mu tiha podrška i strpljenje. Ponudi pomoć, ali nemoj ga pritiskati."
    }
  ];

  // Podaci za kviz
  const quizQuestions = [
    {
      id: 1,
      question: "Zašto je važno pitati prijatelja kako se osjeća, umjesto da pretpostavljamo?",
      options: [
        "Jer možemo pogriješiti u procjeni",
        "Jer svatko osjeća drugačije",
        "Jer prijatelj može imati razlog za svoje osjećaje",
        "Svi odgovori su točni"
      ],
      correctAnswer: 3
    },
    {
      id: 2,
      question: "Što je EMPATIJA?",
      options: [
        "Osjećaj tuge kada je drugima loše",
        "Sposobnost razumijevanja osjećaja drugih ljudi",
        "Osjećaj sreće kada se drugi smiju",
        "Ljutnja kada netko drugi dobije poklon"
      ],
      correctAnswer: 1
    },
    {
      id: 3,
      question: "Kako se osjećaš kada tvoj prijatelj prepozna tvoje osjećaje?",
      options: [
        "Ljutim se",
        "Samo mi je svejedno",
        "Osjećam se razumijevano i važno",
        "Zbunjeno"
      ],
      correctAnswer: 2
    },
    {
      id: 4,
      question: "Što možemo reći kada ne znamo kako pomoći prijatelju koji je tužan?",
      options: [
        "Ništa - bolje je šutjeti",
        "'Žao mi je što ti je teško. Tu sam za tebe.'",
        "'Svi imamo probleme, navikni se.'",
        "'Idemo se igrati da zaboraviš.'"
      ],
      correctAnswer: 1
    }
  ];

  const [quizAnswers, setQuizAnswers] = useState<{[key: number]: number}>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Rukovanje odgovorima na kviz
  const handleAnswerSelect = (questionId: number, answerIndex: number) => {
    setQuizAnswers({
      ...quizAnswers,
      [questionId]: answerIndex
    });
  };

  // Rukovanje odgovorima na situacije
  const handleSituationResponse = (situationId: number, responseIndex: number) => {
    setSelectedResponses({
      ...selectedResponses,
      [situationId]: responseIndex
    });
    
    setShowFeedback({
      ...showFeedback,
      [situationId]: true
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

  // Povratak na početni izbornik
  const handleBackToMenu = () => {
    navigate('/');
  };

  return (
    <div className="emotion-main-container">
      {/* Float back button - gore lijevo */}
      <button onClick={handleBackToMenu} className="emotion-float-back-button">
        <span className="emotion-float-back-arrow">←</span>
        <span className="emotion-float-back-text">Početna</span>
      </button>

      <header className="emotion-main-header">
        <div className="emotion-header-content">
          <div className="emotion-characters">
            <div className="emotion-character emotion-character-left">😊</div>
            <div className="emotion-character emotion-character-right">🤗</div>
          </div>
          <h1>EMOCIJE I PRIJATELJSTVO</h1>
          <p className="emotion-subtitle">Kviz: "Što moj prijatelj osjeća?"</p>
          <div className="emotion-header-decoration">
            <div className="emotion-decoration-item">❤️</div>
            <div className="emotion-decoration-item">😢</div>
            <div className="emotion-decoration-item">😄</div>
            <div className="emotion-decoration-item">😠</div>
            <div className="emotion-decoration-item">🤝</div>
          </div>
        </div>
      </header>

      <nav className="emotion-navigation">
        <button 
          className={`emotion-nav-btn ${activeTab === 'intro' ? 'active' : ''}`}
          onClick={() => setActiveTab('intro')}
        >
          Uvod
        </button>
        <button 
          className={`emotion-nav-btn ${activeTab === 'situations' ? 'active' : ''}`}
          onClick={() => setActiveTab('situations')}
        >
          Situacije
        </button>
        <button 
          className={`emotion-nav-btn ${activeTab === 'quiz' ? 'active' : ''}`}
          onClick={() => setActiveTab('quiz')}
        >
          Kviz
        </button>
      </nav>

      <main className="emotion-main-content">
        {activeTab === 'intro' && (
          <section className="emotion-intro-section emotion-full-width-section">
            <div className="emotion-section-container">
              <div className="emotion-section-header">
                <div className="emotion-section-icon">❤️</div>
                <h2>Razvijamo emocionalno prepoznavanje</h2>
              </div>
              
              <div className="emotion-kid-friendly-content">
                <div className="emotion-orange-card">
                  <div className="emotion-card-icon">🎯</div>
                  <div className="emotion-card-text">
                    <h3>Cilj</h3>
                    <p>
                      Razviti emocionalno prepoznavanje i međusobno razumijevanje.
                      Naučiti prepoznavati osjećaje prijatelja i znati kako reagirati.
                    </p>
                  </div>
                </div>
                
                <div className="emotion-orange-card">
                  <div className="emotion-card-icon">📝</div>
                  <div className="emotion-card-text">
                    <h3>Opis aktivnosti</h3>
                    <p>
                      Prikaz situacija u kojima se djeca susreću s različitim emocijama.
                      Učenje kako prepoznati i odgovoriti na osjećaje drugih.
                    </p>
                  </div>
                </div>
                
                <div className="emotion-orange-card">
                  <div className="emotion-card-icon">💬</div>
                  <div className="emotion-card-text">
                    <h3>Kako sudjelovati?</h3>
                    <p>
                      Za svaku situaciju odaberi kako se prijatelj osjeća i predloži što možeš 
                      reći ili učiniti da pomogneš. Ne pretpostavljaj - pitaj i pokaži da ti je stalo!
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="emotion-fun-fact">
                <h3>Važna poruka</h3>
                <p>
                  "Svatko ima emocije – važno je da ih primijetimo i pitamo, a ne pretpostavljamo."
                  Naš ton je otvoren i humanistički, s naglaskom na zajedničkim iskustvima.
                </p>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'situations' && (
          <section className="emotion-situations-section emotion-full-width-section">
            <div className="emotion-section-container">
              <div className="emotion-section-header">
                <div className="emotion-section-icon">🤔</div>
                <h2>Prepoznaj emocije svog prijatelja</h2>
              </div>
              
              <p className="emotion-section-description">
                Za svaku situaciju odaberi kako se prijatelj osjeća i predloži što možeš reći ili učiniti.
              </p>
              
              <div className="emotion-situations-grid">
                {situations.map((situation) => (
                  <div key={situation.id} className="emotion-situation-card">
                    <div className="emotion-situation-icon">{situation.icon}</div>
                    <h3>{situation.title}</h3>
                    <p className="emotion-situation-description">{situation.description}</p>
                    
                    <div className="emotion-situation-description">
                      <strong>{situation.question}</strong>
                    </div>
                    
                    <div className="emotion-response-options">
                      {situation.responses.map((response, index) => (
                        <button
                          key={index}
                          className={`emotion-response-btn ${
                            selectedResponses[situation.id] === index ? 'selected' : ''
                          }`}
                          onClick={() => handleSituationResponse(situation.id, index)}
                        >
                          {response}
                        </button>
                      ))}
                    </div>
                    
                    <div className={`emotion-feedback ${showFeedback[situation.id] ? 'show' : ''}`}>
                      <p>
                        {selectedResponses[situation.id] === situation.correctResponse 
                          ? situation.feedback
                          : "Razmisli još malo. Što bi pomoglo tvom prijatelju da se osjeća razumijevano?"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="emotion-fun-fact">
                <h3>Savjet za prijateljstvo</h3>
                <p>
                  Kada ne znaš kako pomoći prijatelju, najbolje je jednostavno reći:
                  "Tu sam za tebe" ili "Žao mi je što ti je teško". 
                  Ponekad je prisutnost najveća pomoć.
                </p>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'quiz' && (
          <section className="emotion-quiz-section emotion-full-width-section">
            <div className="emotion-section-container">
              <div className="emotion-section-header">
                <div className="emotion-section-icon">🏆</div>
                <h2>Provjeri svoje znanje o emocijama!</h2>
              </div>
              
              <p className="emotion-section-description">
                Odgovori na pitanja i provjeri koliko razumiješ emocije i kako podržati prijatelje.
              </p>
              
              <div className="emotion-quiz-container">
                {quizQuestions.map((question, index) => (
                  <div key={question.id} className="emotion-quiz-question">
                    <h3>Pitanje {index + 1}: {question.question}</h3>
                    <div className="emotion-quiz-options">
                      {question.options.map((option, optionIndex) => (
                        <div 
                          key={optionIndex} 
                          className={`emotion-quiz-option ${
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
                          <span className="emotion-option-marker">{String.fromCharCode(65 + optionIndex)}.</span>
                          {option}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                
                {!quizSubmitted ? (
                  <button 
                    className="emotion-submit-btn" 
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
                  <div className="emotion-quiz-results">
                    <h3>🎉 Rezultat: {calculateQuizScore()} od {quizQuestions.length} točno</h3>
                    <p>
                      {calculateQuizScore() === quizQuestions.length 
                        ? "Odlično! Ti si pravi prijatelj koji razumije emocije!" 
                        : calculateQuizScore() >= quizQuestions.length / 2 
                        ? "Dobar pokušaj! Već dobro razumiješ emocije prijatelja!" 
                        : "Probaj ponovno proći kroz situacije i pokušati kviz ponovno!"}
                    </p>
                    <button 
                      className="emotion-retry-btn" 
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

      <footer className="emotion-main-footer">
        <div className="emotion-section-container">
          <div className="emotion-footer-decoration">
            <div className="emotion-footer-emoji">❤️</div>
            <div className="emotion-footer-emoji">🤗</div>
            <div className="emotion-footer-emoji">😊</div>
            <div className="emotion-footer-emoji">🤝</div>
            <div className="emotion-footer-emoji">🌟</div>
          </div>
          <p className="emotion-footer-note">
            Ova stranica je napravljena kako bi pomogla djeci da razviju empatiju i nauče prepoznavati emocije svojih prijatelja.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Emotion;