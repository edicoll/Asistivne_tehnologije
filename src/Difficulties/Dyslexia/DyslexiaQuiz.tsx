import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./DyslexiaQuiz.css";

function DyslexiaQuiz() {
    const navigate = useNavigate();
    const [quizIndex, setQuizIndex] = useState(0);
    const [answer, setAnswer] = useState("");
    const [feedback, setFeedback] = useState("");
    const [score, setScore] = useState(0);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [showHint, setShowHint] = useState(false); // Novi state za hint
    const [hintButtonClicked, setHintButtonClicked] = useState(false); // Da pratimo je li hint button kliknut

    const quizExamples = [
        {
            src: "../src/assets/dyslexia/quiz1.png",
            correctAnswer: "Ovo je primjer teksta",
            hint: "Prva riječ ima 3 slova, druga 2, treća 7..."
        },
        {
            src: "../src/assets/dyslexia/quiz2.png",
            correctAnswer: "Disleksija otežava čitanje",
            hint: "Počinje sa 'Disle...', ima 8 slova"
        },
        {
            src: "../src/assets/dyslexia/quiz3.png",
            correctAnswer: "Moramo razumijeti problem",
            hint: "Prva riječ: 'Mora...', ima 6 slova"
        },
    ];

    const handleQuizSubmit = () => {
        if (answer.trim().toLowerCase() === quizExamples[quizIndex].correctAnswer.toLowerCase()) {
            setFeedback("✅ Točno! Odlično si pročitao/la!");
            setScore(prev => prev + 1);
            setShowHint(false); // Sakrij hint nakon točnog odgovora
            setHintButtonClicked(false); // Resetiraj hint button status

            setTimeout(() => {
                if (quizIndex < quizExamples.length - 1) {
                    setQuizIndex(quizIndex + 1);
                    setAnswer("");
                    setFeedback("");
                    setShowHint(false);
                    setHintButtonClicked(false);
                } else {
                    setQuizCompleted(true);
                }
            }, 3500);
        } else {
            setFeedback(`❌ Netočno. Pokušaj ponovo!`);
        }
    };

    const handleShowHint = () => {
        setShowHint(true);
        setHintButtonClicked(true);
        // Ako želiš da se hint odmah pokaže u feedbacku:
        // setFeedback(`💡 Hint: ${quizExamples[quizIndex].hint}`);
    };

    const handleRestartQuiz = () => {
        setQuizIndex(0);
        setAnswer("");
        setFeedback("");
        setScore(0);
        setQuizCompleted(false);
        setShowHint(false);
        setHintButtonClicked(false);
    };

    const handleFinishQuiz = () => {
        navigate("/disleksija");
    };

    return (
        <div className="dyslexia-quiz-container">
            <header className="dyslexia-quiz-header">
                <div className="dyslexia-quiz-header-content">
                    <h1>KVIZ: PROČITAJ KROZ DISLEKSIJU</h1>
                </div>
            </header>

            <main className="dyslexia-quiz-content">
                {quizCompleted ? (
                    <div className="dyslexia-quiz-completed">
                        <div className="dyslexia-quiz-trophy">{score === quizExamples.length ? "🏆" : "⭐"}</div>
                        <h2>{score === quizExamples.length ? "BRAVO! SAVRŠENO! 🎉" : "ODLIČNO! NASTAVI TAKO! ✨"}</h2>

                        <div className="dyslexia-quiz-score-results">
                            <div className="dyslexia-quiz-score-circle">
                                <span className="dyslexia-quiz-score-number">{score}</span>
                                <span className="dyslexia-quiz-score-total">/{quizExamples.length}</span>
                            </div>
                            <p className="dyslexia-quiz-score-message">
                                {score === quizExamples.length
                                    ? "Savršeno! Odlično razumiješ izazove disleksije!"
                                    : score >= 2
                                        ? "Odlično! Već dobro razumiješ kako je čitati s disleksijom!"
                                        : "Može to bolje! Vježbaj i bit ćeš savršen/a!"
                                }
                            </p>
                        </div>

                        <div className="dyslexia-quiz-celebration">
                            {score === quizExamples.length && (
                                <>
                                    <span className="dyslexia-celebrate-emoji">🎉</span>
                                    <span className="dyslexia-celebrate-emoji">✨</span>
                                    <span className="dyslexia-celebrate-emoji">🌟</span>
                                    <span className="dyslexia-celebrate-emoji">🥳</span>
                                    <span className="dyslexia-celebrate-emoji">🎊</span>
                                </>
                            )}
                        </div>

                        <div className="dyslexia-quiz-summary">
                            <h3>Što si naučio/la:</h3>
                            <ul className="dyslexia-quiz-learned-list">
                                <li>✓ Tekstovi s disleksijom mogu biti zamućeni i teški za čitanje</li>
                                <li>✓ Strpljenje je ključ pri čitanju s disleksijom</li>
                                <li>✓ Veći font i razmak pomažu u čitanju</li>
                                <li>✓ Svaka osoba čita na svoj način</li>
                                <li>✓ Razumijevanje je prvi korak ka pomoći</li>
                            </ul>
                        </div>

                        <div className="dyslexia-quiz-actions">
                            <button className="dyslexia-restart-quiz-button dyslexia-purple-btn" onClick={handleRestartQuiz}>
                                <span className="dyslexia-button-icon">🔄</span>
                                Igraj kviz ponovno
                            </button>
                            <button className="dyslexia-back-to-dyslexia dyslexia-purple-back-btn" onClick={handleFinishQuiz}>
                                <span className="dyslexia-back-arrow">←</span>
                                Povratak na SVIJET DISLEKSIJE
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="dyslexia-quiz-section-container">
                        <div className="dyslexia-quiz-progress">
                            <div className="dyslexia-quiz-progress-bar">
                                <div
                                    className="dyslexia-quiz-progress-fill"
                                    style={{ width: `${((quizIndex + 1) / quizExamples.length) * 100}%` }}
                                ></div>
                            </div>
                            <div className="dyslexia-quiz-progress-info">
                                <span className="dyslexia-quiz-counter">Pitanje {quizIndex + 1} od {quizExamples.length}</span>
                                <span className="dyslexia-quiz-score">Bodovi: {score}</span>
                            </div>
                        </div>

                        <div className="dyslexia-quiz-question-card">
                            <div className="dyslexia-quiz-question-header">
                                <h2>🔤 Što piše na ovoj slici?</h2>
                            </div>

                            <div className="dyslexia-quiz-image-container">
                                <img
                                    src={quizExamples[quizIndex].src}
                                    alt="Kviz disleksija"
                                    className="dyslexia-quiz-image"
                                />
                            </div>

                            <div className="dyslexia-quiz-input-section">
                                <input
                                    type="text"
                                    value={answer}
                                    onChange={(e) => setAnswer(e.target.value)}
                                    placeholder="Upiši svoj odgovor ovdje..."
                                    className="dyslexia-quiz-input"
                                />

                                {/* PROMIJENJEN DIO - Buttoni na suprotnim stranama */}
                                <div className="dyslexia-quiz-action-buttons">
                                    <button
                                        className={`dyslexia-quiz-hint-button ${hintButtonClicked ? 'dyslexia-quiz-hint-button-active' : 'dyslexia-quiz-purple-btn-outline'}`}
                                        onClick={handleShowHint}
                                        disabled={hintButtonClicked}
                                    >
                                        <span className="dyslexia-quiz-hint-icon">💡</span>
                                        {hintButtonClicked ? "Hint prikazan" : "Pokaži hint"}
                                    </button>

                                    <button
                                        className="dyslexia-quiz-submit-button dyslexia-quiz-purple-btn"
                                        onClick={handleQuizSubmit}
                                        disabled={!answer.trim()}
                                    >
                                        <span className="dyslexia-quiz-submit-icon">✓</span>
                                        Provjeri odgovor
                                    </button>
                                </div>

                                {/* Hint poruka koja se pojavi ispod buttona */}
                                {showHint && (
                                    <div className="dyslexia-quiz-hint-message">
                                        <div className="dyslexia-quiz-hint-message-icon">💡</div>
                                        <div className="dyslexia-quiz-hint-message-content">
                                            <p className="dyslexia-quiz-hint-message-text">
                                                <strong>Hint:</strong> {quizExamples[quizIndex].hint}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Feedback sekcija */}
                                {feedback && (
                                    <div className={`dyslexia-quiz-feedback ${feedback.startsWith("✅") ? "dyslexia-quiz-correct" : "dyslexia-quiz-incorrect"}`}>
                                        <div className="dyslexia-quiz-feedback-content">
                                            <div className="dyslexia-quiz-feedback-icon">
                                                {feedback.startsWith("✅") ? "🎉" : "🤔"}
                                            </div>
                                            <div className="dyslexia-quiz-feedback-text">
                                                <p>{feedback}</p>
                                                {feedback.startsWith("✅") && quizIndex < quizExamples.length - 1 && (
                                                    <p className="dyslexia-quiz-next-info">Sljedeće pitanje za 3 sekunde...</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {feedback && feedback.startsWith("✅") && quizIndex < quizExamples.length - 1 && (
                                    <div className="dyslexia-quiz-auto-next">
                                        <div className="dyslexia-quiz-loading">
                                            <span className="dyslexia-quiz-loading-dot">.</span>
                                            <span className="dyslexia-quiz-loading-dot">.</span>
                                            <span className="dyslexia-quiz-loading-dot">.</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="dyslexia-quiz-help">
                                <div className="dyslexia-quiz-help-card">
                                    <div className="dyslexia-quiz-help-icon">💬</div>
                                    <div className="dyslexia-quiz-help-text">
                                        <strong>"Razumijevanje izazova je prvi korak ka pomoći!"</strong>
                                        <p>Ovo je kako tekst može izgledati osobi s disleksijom. Pokušaj pročitati što piše!</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <footer className="dyslexia-quiz-footer">
                <div className="dyslexia-section-container">
                    <button className="dyslexia-examples-back-button dyslexia-purple-back-btn" onClick={() => navigate("/disleksija")}>
                        <span className="dyslexia-back-arrow">←</span>
                        Povratak na SVIJET DISLEKSIJE
                    </button>
                    <p className="dyslexia-footer-note">
                        Vježbanjem razumijevanja disleksije postaješ bolji prijatelj i saveznik!
                    </p>
                </div>
            </footer>
        </div>
    );
}

export default DyslexiaQuiz;