import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ImageDyslexia from "../assets/dyslexia/Dyslexia.webp";

function Dyslexia() {
    const navigate = useNavigate();
    const [quizStarted, setQuizStarted] = useState(false);

    const examples = [
        { src: "../src/assets/dyslexia/dyslexia1.webp", text: "Zamućenje i razmazivanje teksta" },
        { src: "../src/assets/dyslexia/dyslexia2.webp", text: "Zasjenjivanje i gubljenje testa" },
        { src: "../src/assets/dyslexia/dyslexia3.webp", text: "Tekst koji izgleda kao da se trese ili vibrira" },
        { src: "../src/assets/dyslexia/dyslexia4.webp", text: "Riječi koje se stapaju jedna u drugu" },
        { src: "../src/assets/dyslexia/dyslexia5.webp", text: "Nepravilan razmak između rečenica" },
        { src: "../src/assets/dyslexia/dyslexia6.webp", text: "Dijelovi slova moglu nedostajati" },
    ];

    const quizExamples = [
        { src: "../src/assets/dyslexia/quiz1.png", correctAnswer: "Ovo je primjer teksta" },
        { src: "../src/assets/dyslexia/quiz2.png", correctAnswer: "Disleksija otežava čitanje" },
        { src: "../src/assets/dyslexia/quiz3.png", correctAnswer: "Moramo razumijeti problem" },
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [started, setStarted] = useState(false);
    const [quizIndex, setQuizIndex] = useState(0);
    const [answer, setAnswer] = useState("");
    const [feedback, setFeedback] = useState("");

    const handleNext = () => {
        if (currentIndex < examples.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            setStarted(false);
        }
    };

    const handleQuizSubmit = () => {
        if (answer.trim().toLowerCase() === quizExamples[quizIndex].correctAnswer.toLowerCase()) {
            setFeedback("✅ Točno!");
        } else {
            setFeedback(`❌ Netočno. Točan odgovor: "${quizExamples[quizIndex].correctAnswer}"`);
        }
    };

    const handleNextQuiz = () => {
        if (quizIndex < quizExamples.length - 1) {
            setQuizIndex(quizIndex + 1);
            setAnswer("");
            setFeedback("");
        }
    };

    const handleFinishQuiz = () => {
        setQuizStarted(false);
        setQuizIndex(0);
        setAnswer("");
        setFeedback("");
    };

    return (
        <div className="page-container">
            <h2>Disleksija</h2>
            <p>
                Disleksija je neurobiološko stanje, što znači da proizlazi iz načina na koji je mozak povezan,
                a ne iz nedostatka inteligencije ili truda. Istraživanja koja koriste snimanje mozga pokazala su
                da osobe s disleksijom obrađuju jezik drugačije od neurotipičnih čitatelja.
            </p>

            {!started && !quizStarted && (
                <img
                    src={ImageDyslexia}
                    alt="Ilustracija disleksije"
                    className="intro-image"
                />
            )}

            {/* Dio s primjerima */}
            {!started && !quizStarted ? (
                <h3
                    className="start-button"
                    onClick={() => {
                        setCurrentIndex(0);  // reset na početak
                        setStarted(true);
                    }}
                >
                    👉 Pogledajmo s kojim se poteškoćama susreću osobe s disleksijom
                </h3>
            ) : null}

            {started && (
                <div className="example-container">
                    <img
                        src={examples[currentIndex].src}
                        alt="Primjer disleksije"
                        className="dyslexia-image"
                    />
                    <p className="description">{examples[currentIndex].text}</p>
                    <button className="next-button" onClick={handleNext}>
                        {currentIndex < examples.length - 1 ? "Sljedeći primjer ➡" : "Završi"}
                    </button>
                </div>
            )}

            {/* Gumb za kviz koji se pojavljuje nakon primjera */}
            {!started && !quizStarted && (
                <h3 className="quiz-button" onClick={() => setQuizStarted(true)}>
                    🧩 Krenimo s kvizom!
                </h3>
            )}

            {/* Kviz */}
            {quizStarted && (
                <div className="quiz-container">
                    <img
                        src={quizExamples[quizIndex].src}
                        alt="Kviz disleksija"
                        className="dyslexia-image"
                    />
                    <p className="description">Što misliš da piše na slici?</p>
                    <input
                        type="text"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder="Upiši odgovor..."
                        className="quiz-input"
                    />
                    <button className="next-button" onClick={handleQuizSubmit}>
                        Provjeri
                    </button>
                    {feedback && <p className="feedback">{feedback}</p>}

                    {/* Sljedeće pitanje ili gumb završi kviz */}
                    {feedback && quizIndex < quizExamples.length - 1 && (
                        <button className="next-button" onClick={handleNextQuiz}>
                            Sljedeća ➡
                        </button>
                    )}

                    {feedback && quizIndex === quizExamples.length - 1 && (
                        <button className="next-button finish-button" onClick={handleFinishQuiz}>
                            ✅ Završi kviz
                        </button>
                    )}
                </div>
            )}

            <button className="back-button" onClick={() => navigate("/")}>
                ⬅ Povratak
            </button>
        </div>
    );
}

export default Dyslexia;
