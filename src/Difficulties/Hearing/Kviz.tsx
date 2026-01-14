import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Kviz.css";

interface Question {
  id: number;
  question: string;
  options: Option[];
  correctAnswer: string;
  explanation: string;
}

interface Option {
  id: string;
  text: string;
  type: "correct" | "wrong" | "maybe";
  feedback?: string;
}

function Kviz() {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const questions: Question[] = [
    {
      id: 1,
      question: "Ana želi reći Marku da je dobila peticu. Marko ne čuje dobro. Što bi Ana trebala učiniti?",
      options: [
        {
          id: "a",
          text: "Okrenuti se i vikati",
          type: "wrong",
          feedback: "Vikanje ne pomaže ako netko ne čuje dobro!"
        },
        {
          id: "b",
          text: "Pokazati znak za 'peticu' i nasmiješiti se",
          type: "correct",
          feedback: "Odlično! Znakovni jezik je sjajan način komunikacije!"
        },
        {
          id: "c",
          text: "Napisati na papirić",
          type: "maybe",
          feedback: "Ovo također može biti dobro rješenje!"
        }
      ],
      correctAnswer: "b",
      explanation: "Kada pričamo s osobama koje slabo čuju, bitno je koristiti vizualne načine komunikacije. Znakovni jezik, pisanje ili pokazivanje prstima su odlični načini!"
    },
    {
      id: 2,
      question: "Mario ima slušni aparat. Kako biste mu se najbolje obratili?",
      options: [
        {
          id: "a",
          text: "Šapćući mu na uho",
          type: "wrong",
          feedback: "Šapćanje može biti teško za razumjeti!"
        },
        {
          id: "b",
          text: "Govorim normalno i gledam ga u lice",
          type: "correct",
          feedback: "Točno! Gledanje u lice pomaže čitanju s usana!"
        },
        {
          id: "c",
          text: "Govorim vrlo brzo",
          type: "wrong",
          feedback: "Brz govor je težak za pratiti!"
        },
        {
          id: "d",
          text: "Okrenem leđa dok pričam",
          type: "wrong",
          feedback: "Uvijek se obratite osobi direktno!"
        }
      ],
      correctAnswer: "b",
      explanation: "Osobe sa slušnim aparatima najbolje čuju kada govorimo jasno, umjerenom brzinom i gledamo ih u lice. Tako mogu i čitati s usana!"
    },
    {
      id: 3,
      question: "Ivana koristi znakovni jezik. Kako joj možete reći 'hvala' bez riječi?",
      options: [
        {
          id: "a",
          text: "Pomognem rukama iznad glave",
          type: "wrong",
          feedback: "To nije pravilan znak za hvala!"
        },
        {
          id: "b",
          text: "Stavim ruku na srce i kimnem glavom",
          type: "maybe",
          feedback: "Ovo je ljubazno, ali nije znakovni jezik!"
        },
        {
          id: "c",
          text: "Desnu ruku stavim blizu usta i pomaknem je prema naprijed",
          type: "correct",
          feedback: "Odlično! To je znak za 'hvala' u znakovnom jeziku!"
        }
      ],
      correctAnswer: "c",
      explanation: "U hrvatskom znakovnom jeziku, znak za 'hvala' se radi tako da se desna ruka stavi blizu usta, a zatim se pomakne prema naprijed i dolje. To je ljubazan i uvažavajući način komunikacije!"
    },
    {
      id: 4,
      question: "Kada ste u bučnoj učionici s prijateljem koji slabo čuje, što je najbolje učiniti?",
      options: [
        {
          id: "a",
          text: "Napisati poruku na komadić papira",
          type: "maybe",
          feedback: "Ovo je dobro rješenje!"
        },
        {
          id: "b",
          text: "Povući ga u tiši dio učionice i onda pričati",
          type: "correct",
          feedback: "Odlično! Manje buke znači bolje razumijevanje!"
        },
        {
          id: "c",
          text: "Višestruko ponavljati isto",
          type: "wrong",
          feedback: "Ponavljanje ne pomaže ako se buka ne smanji!"
        },
        {
          id: "d",
          text: "Pričati glasnije od svih drugih",
          type: "wrong",
          feedback: "Ovo može zbuniti i druge u učionici!"
        }
      ],
      correctAnswer: "b",
      explanation: "Buka je veliki problem za osobe s oštećenjem sluha. Pomicanje na tiše mjesto omogućuje bolju komunikaciju i pokazuje da vam je stalo do razumijevanja!"
    },
    {
      id: 5,
      question: "Što je najvažnije kada komunicirate s osobom koja koristi slušni aparat?",
      options: [
        {
          id: "a",
          text: "Biti strpljiv i razumijevajuć",
          type: "correct",
          feedback: "Točno! Strpljenje je ključ uspješne komunikacije!"
        },
        {
          id: "b",
          text: "Uvijek govoriti jako brzo",
          type: "wrong",
          feedback: "Brz govor otežava razumijevanje!"
        },
        {
          id: "c",
          text: "Izbjegavati direktan kontakt očima",
          type: "wrong",
          feedback: "Direktan kontakt očima je jako važan!"
        },
        {
          id: "d",
          text: "Pričati samo kada je potpuno tiho",
          type: "maybe",
          feedback: "Tišina pomaže, ali nije uvijek moguća!"
        }
      ],
      correctAnswer: "a",
      explanation: "Strpljenje, razumijevanje i poštovanje su najvažniji elementi u komunikaciji s osobama koje koriste slušne aparate. Svaka osoba je drugačija i ima svoje potrebe!"
    }
  ];

  const handleAnswer = (optionId: string) => {
    if (selectedOption) return;
    
    setSelectedOption(optionId);
    setShowExplanation(true);
    
    const isCorrect = optionId === questions[currentQuestion].correctAnswer;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedOption(null);
        setShowExplanation(false);
      } else {
        setQuizCompleted(true);
      }
    }, 3500);
  };

  const handleRestartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedOption(null);
    setScore(0);
    setQuizCompleted(false);
    setShowExplanation(false);
  };

  const currentQ = questions[currentQuestion];

  return (
    <div className="kviz-container">
      <header className="kviz-header">
        <div className="header-content">
          <div className="header-characters">
            <div className="character character-left">👧</div>
            <div className="character character-right">👦</div>
          </div>
          <h1>KVIZ: "ČUJEM NA SVOJ NAČIN"</h1>
          <p className="subtitle">Pomozi Ani i Marku da se bolje razumiju!</p>
          <div className="header-decoration">
            <span className="decoration-item">❓</span>
            <span className="decoration-item">💭</span>
            <span className="decoration-item">🤔</span>
            <span className="decoration-item">💡</span>
          </div>
        </div>
      </header>
      
      <main className="kviz-content">
        {quizCompleted ? (
          <div className="quiz-completed">
            <div className="trophy">{score === 5 ? "🏆" : "⭐"}</div>
            <h2>{score === 5 ? "BRAVO! SAVRŠENO! 🎉" : "NASTAVI VJEŽBATI! ✨"}</h2>
            
            <div className="score-results">
              <div className="score-circle">
                <span className="score-number">{score}</span>
                <span className="score-total">/5</span>
              </div>
              <p className="score-message">
                {score === 5 
                  ? "Savršeno! Ti si pravi prijatelj koji razumije sve!" 
                  : score >= 3 
                    ? "Odlično! Već si dobar prijatelj, malo vježbe i bit ćeš savršen!" 
                    : "Može to bolje! Vježbaj još i biti ćeš odličan prijatelj!"
                }
              </p>
            </div>
            
            <div className="celebration-animation">
              {score === 5 && (
                <>
                  <span className="celebrate-emoji">🎉</span>
                  <span className="celebrate-emoji">✨</span>
                  <span className="celebrate-emoji">🌟</span>
                  <span className="celebrate-emoji">🥳</span>
                  <span className="celebrate-emoji">🎊</span>
                </>
              )}
            </div>
            
            <div className="quiz-summary">
              <h3>Što si naučio/la:</h3>
              <ul className="learned-list">
                <li>✓ Komunikacija je ključ prijateljstva</li>
                <li>✓ Znakovni jezik je pravi jezik</li>
                <li>✓ Strpljenje je super-moć</li>
                <li>✓ Gledanje u lice pomaže razumijevanju</li>
                <li>✓ Svaki prijatelj je poseban i vrijedan</li>
              </ul>
            </div>
            
            <div className="quiz-actions">
              <button className="restart-quiz-button yellow-btn" onClick={handleRestartQuiz}>
                <span className="button-icon">🔄</span>
                Igraj kviz ponovno
              </button>
              <button className="back-to-hearing yellow-back-btn" onClick={() => navigate("/sluh")}>
                <span className="back-arrow">←</span>
                Povratak na SLUŠNI SVIJET
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="quiz-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                ></div>
              </div>
              <div className="progress-info">
                <span className="question-counter">Pitanje {currentQuestion + 1} od {questions.length}</span>
                <span className="score-counter">Bodovi: {score}</span>
              </div>
            </div>
            
            <div className="quiz-question-container">
              <div className="question-header">
                <div className="question-icon">❓</div>
                <h2>{currentQ.question}</h2>
              </div>
              
              <div className="options-container">
                <div className="options-grid">
                  {currentQ.options.map((option) => {
                    const isSelected = selectedOption === option.id;
                    const showColors = selectedOption !== null;
                    
                    return (
                      <button
                        key={option.id}
                        className={`option-card ${showColors ? option.type : ''} ${isSelected ? 'selected' : ''}`}
                        onClick={() => handleAnswer(option.id)}
                        disabled={selectedOption !== null}
                      >
                        <div className="option-marker">
                          {!showColors && "○"}
                          
                          {showColors && option.type === 'correct' && "✅"}
                          {showColors && option.type === 'wrong' && "❌"}
                          {showColors && option.type === 'maybe' && "💡"}
                        </div>
                        <div className="option-content">
                          <span className="option-text">{option.text}</span>
                          {isSelected && option.feedback && (
                            <span className="option-feedback">{option.feedback}</span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
              
              {showExplanation && (
                <div className="explanation-section">
                  <div className="explanation-header">
                    <div className="explanation-icon">💡</div>
                    <h4>Zašto je ovo važno:</h4>
                  </div>
                  <p className="explanation-text">{currentQ.explanation}</p>
                  <div className="next-question-indicator">
                    <span className="loading-text">
                      {currentQuestion < questions.length - 1 
                        ? "Sljedeće pitanje za 3 sekunde..." 
                        : "Rezultati za 3 sekunde..."
                      }
                    </span>
                    <div className="loading-dots">
                      <span>.</span>
                      <span>.</span>
                      <span>.</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="quiz-help">
                <div className="help-card">
                  <div className="help-icon">💬</div>
                  <div className="help-text">
                    <strong>"Komunikacija je uspješna kad se prilagodimo jedni drugima!"</strong>
                    <p>Odaberi najbolji odgovor i nauči kako biti super prijatelj!</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="quick-restart">
              <button className="small-restart-btn" onClick={handleRestartQuiz}>
                <span className="restart-icon">🔄</span>
                Počni kviz ispočetka
              </button>
            </div>
          </>
        )}
      </main>
      
      <footer className="kviz-footer">
        <div className="section-container">
          <div className="footer-decoration">
            <span className="footer-emoji">👂</span>
            <span className="footer-emoji">🤟</span>
            <span className="footer-emoji">💬</span>
            <span className="footer-emoji">👫</span>
            <span className="footer-emoji">👂</span>
          </div>
          <p className="footer-note">
            Ovaj kviz pomoći će ti bolje razumjeti prijatelje koji drugačije čuju.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Kviz;