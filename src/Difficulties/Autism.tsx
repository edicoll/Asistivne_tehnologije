import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Autism.css";

type Tab = "uvod" | "igra" | "alati" | "razmisli";

type ScheduleItem = { id: string; time: string; title: string; done: boolean };
type AacCard = { id: string; label: string; speak: string };

const LS_KEYS = {
  schedule: "assistive:autism:schedule:v2",
  settings: "assistive:autism:settings:v3", // bump to avoid conflicts with older theme toggles
  reflections: "assistive:autism:reflections:v1",
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
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("uvod");

  const [settings, setSettings] = useState(() =>
    safeJsonParse(localStorage.getItem(LS_KEYS.settings), {
      largeText: false,
      reducedMotion: true,
      highContrast: false, // "visoki kontrast" ali i dalje crna slova (svijetla podloga)
      enableSpeech: false,
      enableBeep: false,
    })
  );

  useEffect(() => {
    localStorage.setItem(LS_KEYS.settings, JSON.stringify(settings));
  }, [settings]);

  function speak(text: string) {
    if (!settings.enableSpeech) return;
    if (!("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "hr-HR";
      window.speechSynthesis.speak(u);
    } catch {}
  }

  /* =========================
     U V O D
  ========================== */
  const story =
    "Ja sam Luka. Volim kad znam što slijedi i kad je mirnije. Kad je preglasno ili ima previše stvari odjednom, moj mozak se brzo umori. Pomaže mi kad mi netko kaže plan, govori jasno i daje mi vrijeme za pauzu.";

  const factCards = [
    {
      emoji: "🧩",
      title: "Autizam je spektar",
      text: "Ljudi imaju različite snage i izazove — ne postoji “jedan tip” autizma.",
    },
    {
      emoji: "🔊",
      title: "Senzorna osjetljivost",
      text: "Zvuk, svjetlo ili dodir nekima mogu biti preintenzivni ili neugodni.",
    },
    {
      emoji: "🗓️",
      title: "Predvidljivost pomaže",
      text: "Jasne upute i rutina često smanjuju stres i povećavaju sigurnost.",
    },
    {
      emoji: "🤝",
      title: "Najbolje je pitati",
      text: "Umjesto pretpostavki — pitaj osobu što joj odgovara.",
    },
  ];

  const friendTips = [
    "Govori jasno i kratko (jedna uputa u jednom trenutku).",
    "Najavi promjene (“Za 5 minuta idemo…”).",
    "Ponudi pauzu ili tiše mjesto ako je previše podražaja.",
    "Ne forsiraj kontakt očima — slušanje ne izgleda isto kod svih.",
  ];

  /* =========================
     I G R A  (mini-simulacija)
  ========================== */
  const [noise, setNoise] = useState<0 | 1 | 2>(2); // 0 tiho, 2 glasno
  const [motion, setMotion] = useState<0 | 1 | 2>(2); // 0 mirno, 2 puno pokreta
  const [overloaded, setOverloaded] = useState(true);
  const [helpQ, setHelpQ] = useState<null | "A" | "B" | "C">(null);

  const stress = useMemo(() => {
    const base = noise * 25 + motion * 25; // 0..100
    return overloaded ? Math.min(100, base + 20) : Math.max(10, base);
  }, [noise, motion, overloaded]);

  function pressTooMuch() {
    setNoise(0);
    setMotion(0);
    setOverloaded(false);
    speak("Ponekad je teško kad ima previše informacija. Što bi pomoglo?");
  }

  function pickHelp(ans: "A" | "B" | "C") {
    setHelpQ(ans);
  }

  const helpFeedback = useMemo(() => {
    if (!helpQ) return null;
    if (helpQ === "A") return "✅ Bravo! Smanjivanje buke može jako pomoći kad je preglasno.";
    if (helpQ === "B") return "✅ Bravo! Pauza pomaže mozgu da se odmori i vrati fokus.";
    return "❌ To obično ne pomaže. Kad je već previše, još više buke može povećati stres.";
  }, [helpQ]);

  /* =========================
     R A Z M I S L I  (refleksija)
  ========================== */
  const [reflections, setReflections] = useState(() =>
    safeJsonParse(localStorage.getItem(LS_KEYS.reflections), {
      q1: "",
      q2: "",
      q3: "",
    })
  );

  useEffect(() => {
    localStorage.setItem(LS_KEYS.reflections, JSON.stringify(reflections));
  }, [reflections]);

  /* =========================
     A L A T I
  ========================== */
  const [schedule, setSchedule] = useState<ScheduleItem[]>(() => {
    const seeded: ScheduleItem[] = [
      { id: uid(), time: "07:30", title: "Jutarnja rutina", done: false },
      { id: uid(), time: "08:00", title: "Doručak", done: false },
      { id: uid(), time: "10:30", title: "Pauza (tiho mjesto)", done: false },
      { id: uid(), time: "12:00", title: "Ručak", done: false },
      { id: uid(), time: "16:00", title: "Slobodno vrijeme", done: false },
    ];
    const stored = safeJsonParse<ScheduleItem[]>(localStorage.getItem(LS_KEYS.schedule), []);
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
    setSchedule((prev) => [...prev, { id: uid(), time: newTime, title: t, done: false }]);
    setNewTitle("");
  }
  function toggleScheduleDone(id: string) {
    setSchedule((prev) => prev.map((x) => (x.id === id ? { ...x, done: !x.done } : x)));
  }
  function removeScheduleItem(id: string) {
    setSchedule((prev) => prev.filter((x) => x.id !== id));
  }

  // Transition timer (resume behaviour)
  const presets = [1, 3, 5, 10];
  const [presetMin, setPresetMin] = useState(5);
  const [leftSec, setLeftSec] = useState(0);
  const [running, setRunning] = useState(false);
  const [announce, setAnnounce] = useState<string | null>(null);

  const beepRef = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
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
      speak("Vrijeme je.");
      return;
    }

    const t = setTimeout(() => setLeftSec((s) => s - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, leftSec]);

  useEffect(() => {
    if (!running) return;
    if (leftSec === 5 * 60) {
      setAnnounce("Još 5 minuta.");
      speak("Još 5 minuta.");
    }
    if (leftSec === 60) {
      setAnnounce("Još 1 minuta.");
      speak("Još 1 minuta.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leftSec, running]);

  function startTimer() {
    // Resume ako je pauzirano
    if (leftSec > 0) {
      setRunning(true);
      return;
    }
    // Inače kreni od preseta
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

  // AAC
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
  const [aacMessage, setAacMessage] = useState("Klikni karticu");
  function handleCard(card: AacCard) {
    setAacMessage(card.speak);
    speak(card.speak);
  }

  // Calm breathing
  const [breathRunning, setBreathRunning] = useState(false);
  const [breathPhase, setBreathPhase] = useState<"IN" | "HOLD" | "OUT">("IN");
  const [breathLeft, setBreathLeft] = useState(4);

  useEffect(() => {
    if (!breathRunning) return;
    const t = setTimeout(() => {
      setBreathLeft((s) => {
        if (s <= 1) {
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

  const breathLabel = breathPhase === "IN" ? "Udah" : breathPhase === "HOLD" ? "Zadrži" : "Izdah";

  const containerClass = [
    "autism-main-container",
    settings.largeText ? "autism-largeText" : "",
    settings.reducedMotion ? "autism-reducedMotion" : "",
    settings.highContrast ? "autism-highContrast" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={containerClass}>
      {/* Floating back button (kao i druge cjeline) */}
      <button className="autism-float-back-button" onClick={() => navigate("/")}>
        <span className="autism-float-back-arrow">←</span>
        <span className="autism-float-back-text">Početna</span>
      </button>

      <header className="autism-main-header">
        <div className="autism-header-content">
          <div className="autism-header-characters">
            <div className="autism-character autism-character-left">👧</div>
            <div className="autism-character autism-character-right">👦</div>
          </div>

          <h1>SVIJET AUTIZMA</h1>
          <p className="autism-subtitle">Učimo razumjeti senzornu osjetljivost i različite načine komunikacije.</p>

          <div className="autism-header-decoration" aria-hidden="true">
            <span className="autism-decoration-item">🧩</span>
            <span className="autism-decoration-item">🌿</span>
            <span className="autism-decoration-item">💚</span>
            <span className="autism-decoration-item">🗣️</span>
            <span className="autism-decoration-item">🎧</span>
          </div>
        </div>
      </header>

      <nav className="autism-navigation" aria-label="Navigacija autizam">
        <button className={`autism-nav-btn ${activeTab === "uvod" ? "active" : ""}`} onClick={() => setActiveTab("uvod")}>
          Uvod
        </button>
        <button className={`autism-nav-btn ${activeTab === "igra" ? "active" : ""}`} onClick={() => setActiveTab("igra")}>
          Igra i otkrij
        </button>
        <button className={`autism-nav-btn ${activeTab === "razmisli" ? "active" : ""}`} onClick={() => setActiveTab("razmisli")}>
          Razmisli
        </button>
        <button className={`autism-nav-btn ${activeTab === "alati" ? "active" : ""}`} onClick={() => setActiveTab("alati")}>
          Alati
        </button>
      </nav>

      <main className="autism-main-content">
        {activeTab === "uvod" && (
          <>
            <section className="autism-section">
              <div className="autism-section-container">
                <div className="autism-section-header">
                  <div className="autism-section-icon">🟢</div>
                  <h2>Upoznaj</h2>
                </div>

                <div className="autism-grid-two">
                  <div className="autism-content-card">
                    <h3>Kratka priča</h3>
                    <p className="autism-story">{story}</p>
                    <div className="autism-actions-row">
                      <button className="autism-secondary-btn" onClick={() => speak(story)}>
                        🔊 Pročitaj priču
                      </button>
                      <button className="autism-primary-btn" onClick={() => setActiveTab("igra")}>
                        Idemo na igru →
                      </button>
                    </div>
                    <p className="autism-hint">
                      Savjet: svi učimo zajedno kad se prilagodimo jedni drugima — bez predrasuda.
                    </p>
                  </div>

                  <div className="autism-content-card">
                    <h3>Jesi li znao da…</h3>
                    <div className="autism-facts-grid">
                      {factCards.map((f) => (
                        <div key={f.title} className="autism-fact-card">
                          <div className="autism-fact-emoji">{f.emoji}</div>
                          <div className="autism-fact-title">{f.title}</div>
                          <div className="autism-fact-text">{f.text}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="autism-section autism-section-alt">
              <div className="autism-section-container">
                <div className="autism-section-header">
                  <div className="autism-section-icon">🤝</div>
                  <h2>Kako biti dobar prijatelj</h2>
                </div>

                <div className="autism-content-card">
                  <ul className="autism-bullets">
                    {friendTips.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                  <div className="autism-actions-row">
                    <button className="autism-primary-btn" onClick={() => setActiveTab("razmisli")}>
                      Razmisli i razgovaraj →
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {activeTab === "igra" && (
          <section className="autism-section">
            <div className="autism-section-container">
              <div className="autism-section-header">
                <div className="autism-section-icon">🟡</div>
                <h2>Igraj i otkrij</h2>
              </div>

              <div className="autism-grid-two">
                <div className="autism-content-card">
                  <h3>Mini-simulacija: “Moj dan drugačijim osjetilima”</h3>

                  <div className="autism-controls">
                    <label>
                      Buka
                      <select value={noise} onChange={(e) => setNoise(Number(e.target.value) as 0 | 1 | 2)}>
                        <option value={0}>tiho</option>
                        <option value={1}>srednje</option>
                        <option value={2}>glasno</option>
                      </select>
                    </label>

                    <label>
                      Pokreti
                      <select value={motion} onChange={(e) => setMotion(Number(e.target.value) as 0 | 1 | 2)}>
                        <option value={0}>mirno</option>
                        <option value={1}>srednje</option>
                        <option value={2}>puno</option>
                      </select>
                    </label>

                    <button className="autism-primary-btn" onClick={pressTooMuch}>
                      Previše!
                    </button>

                    <button
                      className="autism-secondary-btn"
                      onClick={() => {
                        setOverloaded(true);
                        setNoise(2);
                        setMotion(2);
                        setHelpQ(null);
                      }}
                    >
                      Reset
                    </button>
                  </div>

                  <div className="autism-classroom" aria-label="Učionica simulacija">
                    {motion > 0 && (
                      <>
                        <span className={`autism-float ${motion === 2 ? "fast" : ""}`} style={{ top: 22, left: 18 }}>
                          ✏️
                        </span>
                        <span className="autism-float slow" style={{ top: 58, left: 120 }}>
                          📚
                        </span>
                        <span className={`autism-float ${motion === 2 ? "fast" : ""}`} style={{ top: 26, right: 38 }}>
                          🧑‍🤝‍🧑
                        </span>
                        <span className="autism-float slow" style={{ bottom: 26, right: 58 }}>
                          🔔
                        </span>
                      </>
                    )}

                    <div className="autism-stress">
                      Stres (procjena): <b>{stress}/100</b>
                    </div>

                    <div className="autism-noiseBar" aria-label="Razina buke">
                      <div className="autism-noiseFill" style={{ width: `${noise * 50}%` }} />
                    </div>

                    {overloaded ? (
                      <div className="autism-message">
                        <b>Osjećaj:</b> “Ima previše informacija odjednom…”
                      </div>
                    ) : (
                      <div className="autism-message">
                        <b>Poruka:</b> “Ponekad je teško kad ima previše informacija. Što bi pomoglo?”
                      </div>
                    )}
                  </div>

                  <div className="autism-quiz">
                    <h4>Što bi pomoglo?</h4>
                    <div className="autism-quiz-row">
                      <button className="autism-secondary-btn" onClick={() => pickHelp("A")}>
                        A) Smanji buku
                      </button>
                      <button className="autism-secondary-btn" onClick={() => pickHelp("B")}>
                        B) Pusti pauzu
                      </button>
                      <button className="autism-secondary-btn" onClick={() => pickHelp("C")}>
                        C) Još glasnije
                      </button>
                    </div>
                    {helpFeedback && <div className="autism-feedback">{helpFeedback}</div>}
                  </div>
                </div>

                <div className="autism-content-card">
                  <h3>Zašto je ovo važno?</h3>
                  <ul className="autism-bullets">
                    <li>Manje podražaja = lakša koncentracija.</li>
                    <li>Tranzicije su lakše kad imamo najavu i plan.</li>
                    <li>Najbolja pomoć je prilagodba okoline + dogovor.</li>
                  </ul>

                  <div className="autism-content-card autism-mini-card">
                    <h4>Brzi “cheat sheet”</h4>
                    <p className="autism-hint">
                      Kad vidiš da je prijatelju previše: <b>smanji buku</b>, <b>daj vrijeme</b> i <b>ponudi pauzu</b>.
                    </p>
                    <div className="autism-actions-row">
                      <button className="autism-primary-btn" onClick={() => setActiveTab("alati")}>
                        Pogledaj alate →
                      </button>
                    </div>
                  </div>

                  <div className="autism-actions-row">
                    <button className="autism-secondary-btn" onClick={() => setActiveTab("uvod")}>
                      ← Natrag na uvod
                    </button>
                    <button className="autism-primary-btn" onClick={() => setActiveTab("razmisli")}>
                      Razmisli →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {activeTab === "razmisli" && (
          <section className="autism-section autism-section-alt">
            <div className="autism-section-container">
              <div className="autism-section-header">
                <div className="autism-section-icon">🔵</div>
                <h2>Razmisli i razgovaraj</h2>
              </div>

              <div className="autism-grid-two">
                <div className="autism-content-card">
                  <h3>Pitanja za razmišljanje</h3>

                  <div className="autism-form">
                    <label>
                      1) Što bi tebi pomoglo da se osjećaš bolje u školi?
                      <textarea
                        rows={3}
                        value={reflections.q1}
                        onChange={(e) => setReflections((r: any) => ({ ...r, q1: e.target.value }))}
                        placeholder="npr. mirnije mjesto, jasniji plan, pauza..."
                      />
                    </label>

                    <label>
                      2) Što možeš pitati prijatelja umjesto da pretpostaviš?
                      <textarea
                        rows={3}
                        value={reflections.q2}
                        onChange={(e) => setReflections((r: any) => ({ ...r, q2: e.target.value }))}
                        placeholder='npr. "Želiš li pauzu?" "Što ti pomaže?"'
                      />
                    </label>

                    <label>
                      3) Koje 2 prilagodbe iz igre bi pomogle “svima”, ne samo autistima?
                      <textarea
                        rows={3}
                        value={reflections.q3}
                        onChange={(e) => setReflections((r: any) => ({ ...r, q3: e.target.value }))}
                        placeholder="npr. manje buke, jasnije upute..."
                      />
                    </label>
                  </div>

                  <div className="autism-actions-row">
                    <button className="autism-secondary-btn" onClick={() => setReflections({ q1: "", q2: "", q3: "" })}>
                      Očisti odgovore
                    </button>
                    <button className="autism-primary-btn" onClick={() => setActiveTab("alati")}>
                      Otvori alate →
                    </button>
                  </div>

                  <p className="autism-hint">
                    (Odgovori se spremaju lokalno u pregledniku — neće se slati nigdje.)
                  </p>
                </div>

                <div className="autism-content-card">
                  <h3>Dogovor za komunikaciju</h3>
                  <p className="autism-hint">
                    Ponekad pomaže unaprijed dogovoriti “signal” koji znači: <b>trebam pauzu</b>.
                  </p>
                  <ul className="autism-bullets">
                    <li>Signal: podignuta ruka / kartica / riječ “pauza”</li>
                    <li>Gdje? tiho mjesto (hodnik, knjižnica…)</li>
                    <li>Koliko? 2–5 minuta (ili po dogovoru)</li>
                  </ul>

                  <div className="autism-content-card autism-mini-card">
                    <h4>Brzi alat</h4>
                    <p className="autism-hint">
                      U “Alati” imaš <b>AAC kartice</b> koje mogu pomoći kad je teško govoriti.
                    </p>
                  </div>

                  <div className="autism-actions-row">
                    <button className="autism-secondary-btn" onClick={() => setActiveTab("igra")}>
                      ← Natrag na igru
                    </button>
                    <button className="autism-primary-btn" onClick={() => setActiveTab("uvod")}>
                      Uvod →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {activeTab === "alati" && (
          <section className="autism-section">
            <div className="autism-section-container">
              <div className="autism-section-header">
                <div className="autism-section-icon">🧰</div>
                <h2>Alati</h2>
              </div>

              <div className="autism-grid-two">
                <div className="autism-content-card">
                  <h3>Vizualni raspored</h3>

                  <div className="autism-controls">
                    <label>
                      Vrijeme
                      <input type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} />
                    </label>

                    <label className="autism-grow">
                      Aktivnost
                      <input
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="npr. Zadaća"
                      />
                    </label>

                    <button className="autism-primary-btn" onClick={addScheduleItem}>
                      Dodaj
                    </button>
                  </div>

                  <div className="autism-schedule">
                    {scheduleSorted.map((it) => (
                      <div key={it.id} className={`autism-item ${it.done ? "done" : ""}`}>
                        <button className="autism-itemMain" onClick={() => toggleScheduleDone(it.id)} aria-pressed={it.done}>
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

                  <div className="autism-actions-row">
                    <button
                      className="autism-secondary-btn"
                      onClick={() => {
                        localStorage.removeItem(LS_KEYS.schedule);
                        window.location.reload();
                      }}
                    >
                      Reset rasporeda (seed)
                    </button>
                  </div>
                </div>

                <div className="autism-content-card">
                  <h3>Timer za tranziciju</h3>

                  <div className="autism-controls wrap">
                    {presets.map((m) => (
                      <button
                        key={m}
                        className={presetMin === m ? "autism-primary-btn" : "autism-secondary-btn"}
                        onClick={() => setPresetMin(m)}
                      >
                        {m} min
                      </button>
                    ))}
                  </div>

                  <div className="autism-timer">
                    <div className="autism-timer-big">{leftSec > 0 ? formatMMSS(leftSec) : `${presetMin}:00`}</div>
                    <div className="autism-controls wrap">
                      {!running ? (
                        <button className="autism-primary-btn" onClick={startTimer}>
                          {leftSec > 0 ? "Nastavi" : "Start"}
                        </button>
                      ) : (
                        <button className="autism-secondary-btn" onClick={stopTimer}>
                          Stop
                        </button>
                      )}
                      <button className="autism-secondary-btn" onClick={resetTimer}>
                        Reset
                      </button>
                    </div>
                    {announce && (
                      <div className="autism-announce" role="status" aria-live="polite">
                        {announce}
                      </div>
                    )}
                  </div>

                  <div className="autism-divider" />

                  <h3>AAC kartice</h3>
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

                  <div className="autism-divider" />

                  <h3>Smiri se (disanje)</h3>
                  <div className="autism-breath">
                    <div>
                      <b>{breathLabel}</b>
                    </div>
                    <div>{breathLeft}s</div>
                  </div>
                  <div className="autism-controls wrap">
                    <button
                      className={breathRunning ? "autism-secondary-btn" : "autism-primary-btn"}
                      onClick={() => setBreathRunning((r) => !r)}
                    >
                      {breathRunning ? "Stop" : "Start"}
                    </button>
                    <button
                      className="autism-secondary-btn"
                      onClick={() => {
                        setBreathRunning(false);
                        setBreathPhase("IN");
                        setBreathLeft(4);
                      }}
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>

              <div className="autism-section-spacer" />

              <div className="autism-section-header">
                <div className="autism-section-icon">⚙️</div>
                <h2>Postavke</h2>
              </div>

              <div className="autism-grid-two">
                <div className="autism-content-card">
                  <h3>Low-stim postavke (samo za ovu stranicu)</h3>

                  <div className="autism-switches">
                    <label className="autism-switch">
                      <input
                        type="checkbox"
                        checked={settings.largeText}
                        onChange={(e) => setSettings((s: any) => ({ ...s, largeText: e.target.checked }))}
                      />
                      Veći tekst
                    </label>

                    <label className="autism-switch">
                      <input
                        type="checkbox"
                        checked={settings.reducedMotion}
                        onChange={(e) => setSettings((s: any) => ({ ...s, reducedMotion: e.target.checked }))}
                      />
                      Reduced motion (manje animacija)
                    </label>

                    <label className="autism-switch">
                      <input
                        type="checkbox"
                        checked={settings.highContrast}
                        onChange={(e) => setSettings((s: any) => ({ ...s, highContrast: e.target.checked }))}
                      />
                      Visoki kontrast (crna slova)
                    </label>
                  </div>

                  <p className="autism-hint">
                    Visoki kontrast pojačava rubove i pozadinu, ali zadržava crna slova (lakše čitanje).
                  </p>
                </div>

                <div className="autism-content-card">
                  <h3>Zvuk i govor</h3>

                  <div className="autism-switches">
                    <label className="autism-switch">
                      <input
                        type="checkbox"
                        checked={settings.enableSpeech}
                        onChange={(e) => setSettings((s: any) => ({ ...s, enableSpeech: e.target.checked }))}
                      />
                      Uključi govor (SpeechSynthesis)
                    </label>

                    <label className="autism-switch">
                      <input
                        type="checkbox"
                        checked={settings.enableBeep}
                        onChange={(e) => setSettings((s: any) => ({ ...s, enableBeep: e.target.checked }))}
                      />
                      Uključi beep na kraju timera
                    </label>
                  </div>

                  <div className="autism-actions-row">
                    <button className="autism-secondary-btn" onClick={() => speak("Pomozimo jedni drugima.")}>
                      Testiraj govor
                    </button>
                    <button className="autism-primary-btn" onClick={() => setActiveTab("uvod")}>
                      Natrag na uvod →
                    </button>
                  </div>

                  <p className="autism-hint">
                    Preporuka: govor i beep ostavi isključeno ako smetaju stimulacijom.
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
