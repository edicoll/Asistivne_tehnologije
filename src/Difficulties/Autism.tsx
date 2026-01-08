import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./Autism.css";

type AacCard = {
  id: string;
  label: string;
  speak: string;
};

type ScheduleItem = {
  id: string;
  time: string; // "08:00"
  title: string;
  done: boolean;
};

const LS_KEYS = {
  schedule: "assistive:autism:schedule:v1",
  settings: "assistive:autism:settings:v1",
};

function uid() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

function safeJsonParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function minutesFromTime(t: string) {
  const [h, m] = t.split(":").map((n) => Number(n));
  return h * 60 + m;
}

function formatMMSS(totalSec: number) {
  const mm = String(Math.floor(totalSec / 60)).padStart(2, "0");
  const ss = String(totalSec % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

export default function Autism() {
  const [tab, setTab] = useState<
    "intro" | "schedule" | "transition" | "aac" | "calm" | "quiz" | "settings"
  >("intro");

  const [settings, setSettings] = useState(() =>
    safeJsonParse(localStorage.getItem(LS_KEYS.settings), {
      largeText: false,
      reducedMotion: true,
      highContrast: false,
      enableSpeech: false,
      enableBeep: false,
    })
  );

  // apply low-stim classes
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("autism-largeText", !!settings.largeText);
    root.classList.toggle("autism-reducedMotion", !!settings.reducedMotion);
    root.classList.toggle("autism-highContrast", !!settings.highContrast);
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(LS_KEYS.settings, JSON.stringify(settings));
  }, [settings]);

  // --------- Schedule ----------
  const [schedule, setSchedule] = useState<ScheduleItem[]>(() => {
    const seeded: ScheduleItem[] = [
      { id: uid(), time: "07:30", title: "Jutarnja rutina", done: false },
      { id: uid(), time: "08:00", title: "Doručak", done: false },
      { id: uid(), time: "10:30", title: "Pauza (tiho mjesto)", done: false },
      { id: uid(), time: "12:00", title: "Ručak", done: false },
      { id: uid(), time: "16:00", title: "Slobodno vrijeme", done: false },
    ];
    const stored = safeJsonParse<ScheduleItem[]>(
      localStorage.getItem(LS_KEYS.schedule),
      []
    );
    return stored.length ? stored : seeded;
  });

  useEffect(() => {
    localStorage.setItem(LS_KEYS.schedule, JSON.stringify(schedule));
  }, [schedule]);

  const scheduleSorted = useMemo(() => {
    return [...schedule].sort((a, b) => minutesFromTime(a.time) - minutesFromTime(b.time));
  }, [schedule]);

  const [newTime, setNewTime] = useState("09:00");
  const [newTitle, setNewTitle] = useState("");

  function addScheduleItem() {
    const t = newTitle.trim();
    if (!t) return;
    setSchedule((prev) => [
      ...prev,
      { id: uid(), time: newTime, title: t, done: false },
    ]);
    setNewTitle("");
  }

  function toggleScheduleDone(id: string) {
    setSchedule((prev) => prev.map((x) => (x.id === id ? { ...x, done: !x.done } : x)));
  }

  function removeScheduleItem(id: string) {
    setSchedule((prev) => prev.filter((x) => x.id !== id));
  }

  // --------- Transition Timer ----------
  const presets = [1, 3, 5, 10];
  const [presetMin, setPresetMin] = useState(5);
  const [leftSec, setLeftSec] = useState(0);
  const [running, setRunning] = useState(false);
  const [announce, setAnnounce] = useState<string | null>(null);

  const beepRef = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    // simple beep using data URI (tiny wav-like tone) fallback: no beep if blocked
    // (we keep it optional because of sensory sensitivity)
    beepRef.current = new Audio(
      "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YQAAAAA="
    );
  }, []);

  useEffect(() => {
    if (!running) return;
    if (leftSec <= 0) {
      setRunning(false);
      setAnnounce("Vrijeme je!");
      if (settings.enableBeep) {
        try {
          beepRef.current?.play();
        } catch {}
      }
      if (settings.enableSpeech) {
        speak("Vrijeme je.");
      }
      return;
    }

    const t = setTimeout(() => setLeftSec((s) => s - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, leftSec]);

  useEffect(() => {
    if (!running) return;

    // announce at 5 min and 1 min if applicable
    if (leftSec === 5 * 60) {
      setAnnounce("Još 5 minuta.");
      if (settings.enableSpeech) speak("Još 5 minuta.");
    }
    if (leftSec === 60) {
      setAnnounce("Još 1 minuta.");
      if (settings.enableSpeech) speak("Još 1 minuta.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leftSec, running]);

  function startTimer() {
    setLeftSec(presetMin * 60);
    setRunning(true);
    setAnnounce(null);
  }

  function stopTimer() {
    setRunning(false);
  }

  function resetTimer() {
    setRunning(false);
    setLeftSec(0);
    setAnnounce(null);
  }

  function speak(text: string) {
    if (!("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "hr-HR";
      window.speechSynthesis.speak(u);
    } catch {}
  }

  // --------- AAC ----------
  const aacCards: AacCard[] = [
    { id: "c1", label: "Trebam pauzu", speak: "Trebam pauzu." },
    { id: "c2", label: "Previše je glasno", speak: "Previše je glasno." },
    { id: "c3", label: "Ne razumijem", speak: "Ne razumijem." },
    { id: "c4", label: "Možeš ponoviti?", speak: "Možeš ponoviti?" },
    { id: "c5", label: "Želim mir", speak: "Želim mir." },
    { id: "c6", label: "Može raspored?", speak: "Može raspored?" },
    { id: "c7", label: "Molim vodu", speak: "Molim vodu." },
    { id: "c8", label: "Hvala", speak: "Hvala." },
  ];

  const [aacMessage, setAacMessage] = useState<string>("Klikni karticu");

  function handleCard(card: AacCard) {
    setAacMessage(card.speak);
    if (settings.enableSpeech) speak(card.speak);
  }

  // --------- Calm / Breathing ----------
  const [breathRunning, setBreathRunning] = useState(false);
  const [breathPhase, setBreathPhase] = useState<"IN" | "HOLD" | "OUT">("IN");
  const [breathLeft, setBreathLeft] = useState(4);

  useEffect(() => {
    if (!breathRunning) return;
    const t = setTimeout(() => {
      setBreathLeft((s) => {
        if (s <= 1) {
          // switch phase
          if (breathPhase === "IN") {
            setBreathPhase("HOLD");
            return 4;
          }
          if (breathPhase === "HOLD") {
            setBreathPhase("OUT");
            return 6;
          }
          setBreathPhase("IN");
          return 4;
        }
        return s - 1;
      });
    }, 1000);

    return () => clearTimeout(t);
  }, [breathRunning, breathLeft, breathPhase]);

  const breathLabel =
    breathPhase === "IN" ? "Udah" : breathPhase === "HOLD" ? "Zadrži" : "Izdah";

  // --------- Quiz ----------
  const quiz = [
    {
      q: "Prijatelj je uznemiren jer se plan promijenio. Što je najbolje?",
      a: [
        "Reći: “Nije ništa” i ignorirati",
        "Pitati: “Želiš pauzu ili novi plan?”",
        "Smijati se jer je nervozan",
      ],
      correct: 1,
      hint: "Ponudi izbor i podršku (pauza / novi plan).",
    },
    {
      q: "U učionici je preglasno. Koja opcija je najprikladnija?",
      a: ["Pojačati zvuk", "Trebam pauzu / tiše mjesto", "Ostati bez riječi i trpjeti"],
      correct: 1,
      hint: "Jasna poruka + izlazna strategija.",
    },
    {
      q: "Netko govori prebrzo. Što možeš reći?",
      a: ["Možeš ponoviti sporije?", "Ne zanima me", "Šutjeti"],
      correct: 0,
      hint: "Traži ponavljanje sporije.",
    },
  ];

  const [qi, setQi] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  function pickAnswer(i: number) {
    if (picked !== null) return;
    setPicked(i);
    if (i === quiz[qi].correct) setScore((s) => s + 1);
  }

  function nextQ() {
    setPicked(null);
    setQi((x) => x + 1);
  }

  function resetQuiz() {
    setQi(0);
    setPicked(null);
    setScore(0);
  }

  return (
    <div className="autism-page">
      <div className="autism-top">
        <h1>Autizam (ASD) – asistivni alati</h1>
        <p className="autism-sub">
          Fokus: predvidljivost, tranzicije, jasna komunikacija i samoregulacija (low-stim).
        </p>

        <div className="autism-tabs" role="tablist" aria-label="Autizam moduli">
          <button className={tab === "intro" ? "active" : ""} onClick={() => setTab("intro")}>Upoznaj</button>
          <button className={tab === "schedule" ? "active" : ""} onClick={() => setTab("schedule")}>Raspored</button>
          <button className={tab === "transition" ? "active" : ""} onClick={() => setTab("transition")}>Tranzicija</button>
          <button className={tab === "aac" ? "active" : ""} onClick={() => setTab("aac")}>Komunikacija</button>
          <button className={tab === "calm" ? "active" : ""} onClick={() => setTab("calm")}>Smiri se</button>
          <button className={tab === "quiz" ? "active" : ""} onClick={() => setTab("quiz")}>Kviz</button>
          <button className={tab === "settings" ? "active" : ""} onClick={() => setTab("settings")}>Postavke</button>
        </div>
      </div>

      {tab === "intro" && (
        <section className="autism-card">
          <h2>Što ovaj modul radi?</h2>
          <ul className="autism-list">
            <li><b>Vizualni raspored</b> s jasnim nazivima i označavanjem “gotovo”.</li>
            <li><b>Timer za tranziciju</b> (najave “još 5 min / još 1 min”).</li>
            <li><b>AAC kartice</b> za brzu komunikaciju (opcionalni govor).</li>
            <li><b>Smirivanje</b>: disanje 4-4-6 + brze “calm” kartice.</li>
            <li>Sve se sprema lokalno u pregledniku (localStorage).</li>
          </ul>

          <div className="autism-note">
            <b>Napomena:</b> ASD je širok spektar. Cilj je ponuditi nisko-stimulirajuće i predvidljive alate.
          </div>

          <div className="autism-actions">
            <Link className="autism-back" to="/">Povratak</Link>
            <button className="autism-primary" onClick={() => setTab("settings")}>
              Uključi low-stim postavke
            </button>
          </div>
        </section>
      )}

      {tab === "schedule" && (
        <section className="autism-card">
          <h2>Vizualni raspored</h2>
          <p className="autism-muted">Klikni aktivnost za “gotovo”. Dodaj svoje aktivnosti.</p>

          <div className="autism-grid2">
            <div className="autism-panel">
              <div className="autism-row">
                <label>
                  Vrijeme
                  <input type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} />
                </label>
                <label className="grow">
                  Aktivnost
                  <input
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="npr. Zadaća"
                  />
                </label>
                <button className="autism-primary" onClick={addScheduleItem}>Dodaj</button>
              </div>

              <div className="autism-schedule">
                {scheduleSorted.map((it) => (
                  <div key={it.id} className={`autism-item ${it.done ? "done" : ""}`}>
                    <button
                      className="autism-itemMain"
                      onClick={() => toggleScheduleDone(it.id)}
                      aria-pressed={it.done}
                    >
                      <span className="time">{it.time}</span>
                      <span className="title">{it.title}</span>
                      <span className="chip">{it.done ? "Gotovo" : "Aktivno"}</span>
                    </button>
                    <button className="autism-danger" onClick={() => removeScheduleItem(it.id)} aria-label="Obriši">
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="autism-panel">
              <h3>Savjeti</h3>
              <ul className="autism-list">
                <li>Kratki nazivi (1 radnja).</li>
                <li>Manje teksta = manje stresa.</li>
                <li>Dodaj pauze između zahtjevnih aktivnosti.</li>
              </ul>
              <button
                className="autism-secondary"
                onClick={() => {
                  localStorage.removeItem(LS_KEYS.schedule);
                  window.location.reload();
                }}
              >
                Reset rasporeda (seed)
              </button>
            </div>
          </div>
        </section>
      )}

      {tab === "transition" && (
        <section className="autism-card">
          <h2>Timer za tranziciju</h2>
          <p className="autism-muted">
            Koristi prije promjene aktivnosti. Podržava najave “još 5 min” i “još 1 min”.
          </p>

          <div className="autism-row wrap">
            {presets.map((m) => (
              <button
                key={m}
                className={presetMin === m ? "autism-primary" : "autism-secondary"}
                onClick={() => setPresetMin(m)}
              >
                {m} min
              </button>
            ))}
          </div>

          <div className="autism-timer">
            <div className="big">{leftSec > 0 ? formatMMSS(leftSec) : `${presetMin}:00`}</div>
            <div className="autism-row wrap">
              {!running ? (
                <button className="autism-primary" onClick={startTimer}>Start</button>
              ) : (
                <button className="autism-secondary" onClick={stopTimer}>Stop</button>
              )}
              <button className="autism-secondary" onClick={resetTimer}>Reset</button>
            </div>

            {announce && (
              <div className="autism-announce" role="status" aria-live="polite">
                {announce}
              </div>
            )}
          </div>

          <div className="autism-note">
            Tip: najava tranzicije pomaže smanjiti stres kad se aktivnost mijenja.
          </div>
        </section>
      )}

      {tab === "aac" && (
        <section className="autism-card">
          <h2>AAC – brza komunikacija</h2>
          <p className="autism-muted">
            Klikni karticu. Ako uključiš govor, kartica će se i izgovoriti.
          </p>

          <div className="autism-aacMessage" aria-live="polite">
            {aacMessage}
          </div>

          <div className="autism-aacGrid">
            {aacCards.map((c) => (
              <button key={c.id} className="autism-aacCard" onClick={() => handleCard(c)}>
                {c.label}
              </button>
            ))}
          </div>
        </section>
      )}

      {tab === "calm" && (
        <section className="autism-card">
          <h2>Smiri se</h2>
          <p className="autism-muted">Low-stim alati za samoregulaciju.</p>

          <div className="autism-grid2">
            <div className="autism-panel">
              <h3>Disanje 4-4-6</h3>
              <div className="autism-breath">
                <div className="phase">{breathLabel}</div>
                <div className="count">{breathLeft}s</div>
              </div>
              <div className="autism-row wrap">
                <button
                  className={breathRunning ? "autism-secondary" : "autism-primary"}
                  onClick={() => setBreathRunning((r) => !r)}
                >
                  {breathRunning ? "Stop" : "Start"}
                </button>
                <button
                  className="autism-secondary"
                  onClick={() => {
                    setBreathRunning(false);
                    setBreathPhase("IN");
                    setBreathLeft(4);
                  }}
                >
                  Reset
                </button>
              </div>
              <p className="autism-muted">Gledaj jednu točku i prati ritam.</p>
            </div>

            <div className="autism-panel">
              <h3>Brze “calm” kartice</h3>
              <div className="autism-calmGrid">
                <div className="autism-miniCard">
                  <b>Pauza 2 minute</b>
                  <div>Odmakni se i diši.</div>
                </div>
                <div className="autism-miniCard">
                  <b>Tiše / slušalice</b>
                  <div>Smanji stimulaciju.</div>
                </div>
                <div className="autism-miniCard">
                  <b>Voda</b>
                  <div>Mali gutljaji.</div>
                </div>
                <div className="autism-miniCard">
                  <b>Novi plan</b>
                  <div>Pitaj: “Što je sljedeće?”</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {tab === "quiz" && (
        <section className="autism-card">
          <h2>Mini-kviz (situacije)</h2>

          {qi >= quiz.length ? (
            <div className="autism-panel">
              <h3>Rezultat</h3>
              <p className="autism-bigText">
                Točno: <b>{score}</b> / {quiz.length}
              </p>
              <button className="autism-primary" onClick={resetQuiz}>Ponovi</button>
            </div>
          ) : (
            <div className="autism-panel">
              <div className="autism-muted">Pitanje {qi + 1} / {quiz.length}</div>
              <h3>{quiz[qi].q}</h3>

              <div className="autism-answers">
                {quiz[qi].a.map((txt, i) => {
                  const isPicked = picked === i;
                  const isCorrect = i === quiz[qi].correct;
                  const className =
                    picked === null
                      ? "autism-secondary"
                      : isPicked && isCorrect
                      ? "autism-primary"
                      : isPicked && !isCorrect
                      ? "autism-dangerBtn"
                      : "autism-secondary";

                  return (
                    <button key={txt} className={className} onClick={() => pickAnswer(i)}>
                      {txt}
                    </button>
                  );
                })}
              </div>

              {picked !== null && (
                <div className="autism-note">
                  {picked === quiz[qi].correct ? "✅ Točno!" : "❌ Nije točno."} {quiz[qi].hint}
                </div>
              )}

              <div className="autism-row wrap">
                <button
                  className="autism-primary"
                  onClick={nextQ}
                  disabled={picked === null}
                  aria-disabled={picked === null}
                >
                  Sljedeće
                </button>
              </div>
            </div>
          )}
        </section>
      )}

      {tab === "settings" && (
        <section className="autism-card">
          <h2>Postavke (low-stim)</h2>

          <div className="autism-panel">
            <label className="autism-check">
              <input
                type="checkbox"
                checked={settings.largeText}
                onChange={(e) => setSettings((s: any) => ({ ...s, largeText: e.target.checked }))}
              />
              Veći tekst
            </label>

            <label className="autism-check">
              <input
                type="checkbox"
                checked={settings.reducedMotion}
                onChange={(e) => setSettings((s: any) => ({ ...s, reducedMotion: e.target.checked }))}
              />
              Reduced motion (manje animacija)
            </label>

            <label className="autism-check">
              <input
                type="checkbox"
                checked={settings.highContrast}
                onChange={(e) => setSettings((s: any) => ({ ...s, highContrast: e.target.checked }))}
              />
              Visoki kontrast
            </label>

            <hr className="autism-hr" />

            <label className="autism-check">
              <input
                type="checkbox"
                checked={settings.enableSpeech}
                onChange={(e) => setSettings((s: any) => ({ ...s, enableSpeech: e.target.checked }))}
              />
              Uključi govor (SpeechSynthesis)
            </label>

            <label className="autism-check">
              <input
                type="checkbox"
                checked={settings.enableBeep}
                onChange={(e) => setSettings((s: any) => ({ ...s, enableBeep: e.target.checked }))}
              />
              Uključi beep na kraju timera
            </label>

            <p className="autism-muted">
              Preporuka: govor i beep ostavi isključeno ako smetaju stimulacijom.
            </p>
          </div>

          <div className="autism-actions">
            <Link className="autism-back" to="/">Povratak</Link>
          </div>
        </section>
      )}
    </div>
  );
}
