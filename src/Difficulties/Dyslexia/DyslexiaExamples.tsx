
import { useState } from "react";
import "./DyslexiaExamples.css";
import { useNavigate } from "react-router-dom";

interface DyslexiaExamplesProps {
    onBack: () => void;
}

function DyslexiaExamples({}: DyslexiaExamplesProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const navigate = useNavigate();
    const examples = [
        { src: "../src/assets/dyslexia/dyslexia1.webp", text: "Zamućenje i razmazivanje teksta" },
        { src: "../src/assets/dyslexia/dyslexia2.webp", text: "Zasjenjivanje i gubljenje teksta" },
        { src: "../src/assets/dyslexia/dyslexia3.webp", text: "Tekst koji izgleda kao da se trese ili vibrira" },
        { src: "../src/assets/dyslexia/dyslexia4.webp", text: "Riječi koje se stapaju jedna u drugu" },
        { src: "../src/assets/dyslexia/dyslexia5.webp", text: "Nepravilan razmak između rečenica" },
        { src: "../src/assets/dyslexia/dyslexia6.webp", text: "Dijelovi slova mogu nedostajati" },
    ];

    const handleNext = () => {
        if (currentIndex < examples.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            navigate("/disleksija");
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    return (
        <div className="dyslexia-examples-container">
            <header className="dyslexia-examples-header">
                <div className="dyslexia-examples-header-content">
                    <h1 className="dyslexia-examples-title">KROZ OČI DISLEKSIJE</h1>
                    <p className="dyslexia-examples-subtitle">
                        Pogledaj kako se tekst prikazuje osobama s disleksijom
                    </p>
                    <div className="dyslexia-examples-decoration">
                        <span className="dyslexia-examples-decoration-item">👁️</span>
                        <span className="dyslexia-examples-decoration-item">🔤</span>
                        <span className="dyslexia-examples-decoration-item">📖</span>
                        <span className="dyslexia-examples-decoration-item">🧠</span>
                    </div>
                </div>
            </header>

            <main className="dyslexia-examples-content">
                <div className="dyslexia-examples-section-container">
                    <div className="dyslexia-example-card">
                        <div className="dyslexia-example-progress">
                            <div className="dyslexia-example-progress-bar">
                                <div
                                    className="dyslexia-example-progress-fill"
                                    style={{ width: `${((currentIndex + 1) / examples.length) * 100}%` }}
                                ></div>
                            </div>
                            <div className="dyslexia-example-progress-info">
                                <span className="dyslexia-example-counter">
                                    Primjer {currentIndex + 1} od {examples.length}
                                </span>
                            </div>
                        </div>

                        <div className="dyslexia-example-image-wrapper">
                            <img
                                src={examples[currentIndex].src}
                                alt="Primjer disleksije"
                                className="dyslexia-example-image"
                            />
                        </div>

                        <div className="dyslexia-example-description">
                            <div className="dyslexia-example-description-icon">💡</div>
                            <p className="dyslexia-example-text">{examples[currentIndex].text}</p>
                        </div>

                        <div className="dyslexia-example-navigation">
                            <button
                                className="dyslexia-example-prev-button dyslexia-purple-btn-outline"
                                onClick={handlePrevious}
                                disabled={currentIndex === 0}
                            >
                                <span className="dyslexia-example-button-icon">←</span>
                                Prethodni
                            </button>

                            <button
                                className="dyslexia-example-next-button dyslexia-purple-btn"
                                onClick={handleNext}
                            >
                                <span className="dyslexia-example-button-icon">
                                    {currentIndex < examples.length - 1 ? "→" : "🏁"}
                                </span>
                                {currentIndex < examples.length - 1 ? "Sljedeći" : "Završi"}
                            </button>
                        </div>
                    </div>

                </div>
            </main>

            <footer className="dyslexia-examples-footer">
                <div className="dyslexia-examples-section-container">
                    <button className="dyslexia-examples-back-button dyslexia-purple-back-btn" onClick={() => navigate("/disleksija")}>
                        <span className="dyslexia-back-arrow">←</span>
                        Povratak na SVIJET DISLEKSIJE
                    </button>

                </div>
            </footer>
        </div>
    );
}

export default DyslexiaExamples;