import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Minigame.css";

interface Sign {
  id: number;
  name: string;
  meaning: string;
  emoji: string;
  description: string;
  signEmoji: string; 
}

function MiniGame() {
  const navigate = useNavigate();
  const [currentSign, setCurrentSign] = useState<Sign | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);

  const signs: Sign[] = [
    {
      id: 1,
      name: "Bok",
      meaning: "bok",
      emoji: "👋",
      signEmoji: "🤚→👋", 
      description: "Ruku podižemo u visinu ramena i lagano mahnemo dlanom lijevo-desno."
    },
    {
      id: 2,
      name: "Hvala",
      meaning: "hvala",
      emoji: "🙏",
      signEmoji: "✋→🤲", 
      description: "Desnu ruku stavimo blizu usta, a zatim je pomaknemo prema naprijed i dolje."
    },
    {
      id: 3,
      name: "Prijatelj",
      meaning: "prijatelj",
      emoji: "🤝",
      signEmoji: "🤜🤛", 
      description: "Ruke prekrižimo na prsima, a zatim ih spustimo i spojimo dlanove."
    }
  ];
  

  useEffect(() => {
    startNewRound();
  }, []);
  
  const startNewRound = () => {

    const randomSign = signs[Math.floor(Math.random() * signs.length)];
    setCurrentSign(randomSign);
    

    const allMeanings = signs.map(sign => sign.meaning);
    const wrongOptions = allMeanings.filter(meaning => meaning !== randomSign.meaning);
    const shuffledWrong = wrongOptions.sort(() => Math.random() - 0.5).slice(0, 2);
    const allOptions = [randomSign.meaning, ...shuffledWrong];
    

    const shuffledOptions = allOptions.sort(() => Math.random() - 0.5);
    setOptions(shuffledOptions);
    

    setSelectedOption(null);
    setIsCorrect(null);
  };
  
  const handleAnswer = (option: string) => {
    if (selectedOption) return;
    
    setSelectedOption(option);
    const correct = option === currentSign?.meaning;
    setIsCorrect(correct);
    setTotalQuestions(prev => prev + 1);
    
    if (correct) {
      setCorrectAnswers(prev => prev + 1);
      

      if (totalQuestions + 1 >= 3) {
        setTimeout(() => {
          setGameCompleted(true);
        }, 1500);
      } else {

        setTimeout(() => {
          startNewRound();
        }, 1500);
      }
    }
  };
  
  const handleRestart = () => {
    setCorrectAnswers(0);
    setTotalQuestions(0);
    setGameCompleted(false);
    startNewRound();
  };

  const renderSignDisplay = () => {
    if (!currentSign) return "🤔";

    return (
      <div className="sign-visual-display">
        <div className="sign-animation">
            {currentSign.emoji}
        </div>
      </div>
    );
  };
  
  return (
    <div className="minigame-container">

      <header className="minigame-header">
        <div className="header-content">
          <div className="header-characters">
            <div className="character character-left">👧</div>
            <div className="character character-right">👦</div>
          </div>
          <h1>MINI IGRA: NAUČI ZNAKOVE</h1>
          <p className="subtitle">Pogodi što znači svaki znak!</p>
          <div className="header-decoration">
            <span className="decoration-item">🤟</span>
            <span className="decoration-item">👋</span>
            <span className="decoration-item">🙏</span>
            <span className="decoration-item">🤝</span>
          </div>
        </div>
      </header>
      
      <main className="minigame-content">
        {gameCompleted ? (
          <div className="game-completed">
            <div className="trophy">🏆</div>
            <h2>{correctAnswers === 3 ? "Bravo! Uspio/la si! 🎉" : "Probaj ponovo! 💪"}</h2>
            <p className="final-score">
              Pogodio/la si <strong>{correctAnswers} od 3</strong> znaka!
            </p>
            
            {correctAnswers === 3 ? (
              <div className="success-message">
                <p>Odlično! Sada znaš tri važna znaka u znakovnom jeziku!</p>
                <div className="celebration">
                  <span>🎉</span>
                  <span>✨</span>
                  <span>🌟</span>
                </div>
              </div>
            ) : (
              <div className="try-again-message">
                <p>Vježba čini majstora! Pokušaj ponovo i sigurno ćeš uspjeti!</p>
              </div>
            )}
            
            <div className="learned-signs">
              <h3>Što si naučio/la:</h3>
              <div className="signs-summary">
                {signs.map(sign => (
                  <div key={sign.id} className="learned-sign">
                    <div className="sign-emoji-large">{sign.signEmoji}</div>
                    <div className="sign-info">
                      <h4>{sign.name} {sign.emoji}</h4>
                      <p>{sign.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="game-actions">
              <button className="restart-button yellow-btn" onClick={handleRestart}>
                <span className="button-icon">🔄</span>
                {correctAnswers === 3 ? "Igraj ponovno" : "Probaj ponovo"}
              </button>
              <button className="back-button yellow-back-btn" onClick={() => navigate("/sluh")}>
                <span className="back-arrow">←</span>
                Povratak na SLUŠNI SVIJET
              </button>
            </div>
          </div>
        ) : (

          <>
            <div className="sign-to-guess">
              <div className="sign-emoji-display">
                <div className="sign-image">
                  {currentSign ? renderSignDisplay() : "🤔"}
                </div>
                <div className="sign-question">Što predstavlja ovaj znak?</div>
              </div>
            </div>
            
            <div className="options-container">
              <div className="options-grid">
                {options.map((option, index) => {
                  const isSelected = selectedOption === option;
                  const isCorrectOption = option === currentSign?.meaning;
                  let optionClass = "option-button";
                  
                  if (isSelected) {
                    optionClass += isCorrectOption ? " correct" : " incorrect";
                  }
                  
                  return (
                    <button
                      key={index}
                      className={optionClass}
                      onClick={() => handleAnswer(option)}
                      disabled={selectedOption !== null}
                    >
                      <span className="option-text">{option.toUpperCase()}</span>
                      
                      {isSelected && (
                        <span className="option-feedback">
                          {isCorrectOption ? "✅ Točno!" : "❌ Netočno"}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
            
            {selectedOption && currentSign && (
              <div className={`feedback ${isCorrect ? "positive" : "negative"}`}>
                <div className="feedback-content">
                  <div className="feedback-icon">
                    {isCorrect ? "🎉" : "💡"}
                  </div>
                  <div className="feedback-text">
                    <h4>{isCorrect ? "Odlično!" : "Uči dalje!"}</h4>
                    <p>
                      {isCorrect 
                        ? `Točno! Znak "${currentSign.signEmoji}" znači "${currentSign.name}" ${currentSign.emoji}`
                        : `Znak "${currentSign.signEmoji}" znači "${currentSign.name}" ${currentSign.emoji}. ${currentSign.description}`
                      }
                    </p>
                  </div>
                </div>

                {!isCorrect && (
                <div className="try-again-section">
                    <button 
                    className="try-again-button yellow-btn" 
                    onClick={handleRestart}
                    >
                    <span className="button-icon">🔄</span>
                    Pokušaj ponovo
                    </button>
                </div>
                )}
              </div>
            )}
            
            <div className="progress-section">
              <div className="progress-text">
                <span>Pogodio/la si {correctAnswers} od 3 znaka</span>
              </div>
            </div>
          </>
        )}
      </main>

      <footer className="minigame-footer">
        <div className="section-container">
          <div className="footer-decoration">
            <span className="footer-emoji">🤟</span>
            <span className="footer-emoji">👂</span>
            <span className="footer-emoji">💛</span>
            <span className="footer-emoji">👫</span>
            <span className="footer-emoji">🤟</span>
          </div>
          <p className="footer-note">
            Učenjem znakovnog jezika otvaraš vrata novim prijateljstvima!
          </p>
        </div>
      </footer>
    </div>
  );
}

export default MiniGame;