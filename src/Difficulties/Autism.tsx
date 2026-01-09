import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./Autism.css";

type Tab = "upoznaj" | "igraj" | "razmisli" | "alati" | "postavke";

type ScheduleItem = { id: string; time: string; title: string; done: boolean };
type AacCard = { id: string; label: string; speak: string };

const LS_KEYS = {
  schedule: "assistive:autism:schedule:v2",
  settings: "assistive:autism:settings:v2",
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
  const [tab, setTab] = useState<Tab>("upoznaj");

  // Apply light-blue theme to the WHOLE page while on /autizam
  useEffect(() => {
    document.body.classList.add("autism-theme");
    return () => document.body.classList.remove("autism-theme");
  }, []);

  const [settings, setSettings] = useState(() =>
    safeJsonParse(localStorage.getItem(LS_KEYS.settings), {
      largeText: false,
      reducedMotion: true,
      highContrast: false,
      enableSpeech: false,
      enableBeep: false,
    })
  );

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("autism-largeText", !!settings.largeText);
    root.classList.toggle("autism-reducedMotion", !!settings.reducedMotion);
    root.classList.toggle("autism-highContrast", !!settings.highContrast);
  }, [settings]);

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
     UPOZNAJ (story + facts)
  ========================== */
  const story =
    "Ja sam Luka. Volim kad znam što slijedi i kad je mirnije. Kad je preglasno ili ima previše stvari odjednom, moj mozak se brzo umori. Pomaže mi kad mi netko kaže plan, govori jasno i daje mi vrijeme za pauzu.";

  const facts = [
    "Autizam je spektar – ljudi mogu imati različite snage i izazove.",
    "Neki ljudi su osjetljiviji na zvuk, svjetlo ili dodir (senzorna osjetljivost).",
    "Jasne upute, rutine i predvidljivost često pomažu.",
    "Najbolje je pitati osobu što joj odgovara – ne pretpostavljati.",
  ];

  /* =========================
     IGRAJ I OTKRIJ
     - “Moj dan drugačijim osjetilima”
  ========================== */
  const [noise, setNoise] = useState<0 | 1 | 2>(2); // 0 tiho, 2 glasno
  const [motion, setMotion] = useState<0 | 1 | 2>(2); // 0 mirno, 2 puno pokreta
  const [overloaded, setOverloaded] = useState(true);
  const [helpQ, setHelpQ] = useState<null | "A" | "B" | "C">(null);

  const stress = useMemo(() => {
    // jednostavna metrika: buka + pokret
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
     RAZMISLI I RAZGOVARAJ (refleksija)
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
     ALATI (zadržano iz ranije verzije)
     - vizualni raspored
     - timer za tranziciju
     - AAC kartice
     - smirivanje
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

  // Transition timer
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
        try { beepRef.current?.play(); } catch {}
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
    if (leftSec === 5 * 60) { setAnnounce("Još 5 minuta."); speak("Još 5 minuta."); }
    if (leftSec === 60) { setAnnounce("Još 1 minuta."); speak("Još 1 minuta."); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leftSec, running]);

  function startTimer() {
    setLeftSec(presetMin * 60);
    setRunning(true);
    setAnnounce(null);
  }
  function stopTimer() { setRunning(false); }
  function resetTimer() { setRunning(false); setLeftSec(0); setAnnounce(null); }

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
          if (breathPhase === "IN") { setBreathPhase("HOLD"); return 4; }
          if (breathPhase === "HOLD") { setBreathPhase("OUT"); return 6; }
          setBreathPhase("IN"); return 4;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearTimeout(t);
  }, [breathRunning, breathLeft, breathPhase]);

  const breathLabel = breathPhase === "IN" ? "Udah" : breathPhase === "HOLD" ? "Zadrži" : "Izdah";

  return (
    <div className="autism-page">
      <div className="autism-top">
        <h1>
          🧩 Autizam (ASD)
          <span className="autism-badge">svjetloplava tema • predvidljivost • komunikacija</span>
        </h1>
        <p className="autism-sub">
          Učimo razumjeti senzornu osjetljivost i različite načine komunikacije — bez sažaljenja, kroz istraživanje.
        </p>

        <div className="autism-tabs" role="tablist" aria-label="Autizam sadržaj">
          <button className={tab === "upoznaj" ? "active" : ""} onClick={() => setTab("upoznaj")}>Upoznaj</button>
          <button className={tab === "igraj" ? "active" : ""} onClick={() => setTab("igraj")}>Igraj i otkrij</button>
          <button className={tab === "razmisli" ? "active" : ""} onClick={() => setTab("razmisli")}>Razmisli i razgovaraj</button>
          <button className={tab === "alati" ? "active" : ""} onClick={() => setTab("alati")}>Alati</button>
          <button className={tab === "postavke" ? "active" : ""} onClick={() => setTab("postavke")}>Postavke</button>
        </div>
      </div>

      {tab === "upoznaj" && (
        <section className="autism-card">
          <h2>🟢 Upoznaj</h2>

          <div className="autism-grid2">
            <div className="autism-panel">
              <h3>Kratka priča</h3>
              <p>{story}</p>
              <div className="autism-row wrap">
                <button className="autism-secondary" onClick={() => speak(story)}>
                  🔊 Pročitaj priču (ako je uključen govor)
                </button>
              </div>
              <div className="autism-note">
                <b>Poruka:</b> svi možemo učiti zajedno kad se prilagodimo jedni drugima.
              </div>
            </div>

            <div className="autism-panel">
              <h3>Jesi li znao da…</h3>
              <ul className="autism-list">
                {facts.map((f) => <li key={f}>{f}</li>)}
              </ul>
              <div className="autism-actions">
                <button className="autism-primary" onClick={() => setTab("igraj")}>Idemo igrati</button>
                <Link className="autism-back" to="/">Povratak</Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {tab === "igraj" && (
        <section className="autism-card">
          <h2>🟡 Igraj i otkrij</h2>
          <p className="autism-muted">
            Mini-igra: <b>“Moj dan drugačijim osjetilima”</b> — razumij što znači senzorno preopterećenje i što pomaže.
          </p>

          <div className="autism-grid2">
            <div className="autism-panel autism-sim">
              <h3>Simulacija učionice</h3>

              <div className="autism-row wrap">
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

                <button className="autism-primary" onClick={pressTooMuch}>
                  Previše!
                </button>

                <button
                  className="autism-secondary"
                  onClick={() => { setOverloaded(true); setNoise(2); setMotion(2); setHelpQ(null); }}
                >
                  Reset
                </button>
              </div>

              <div className="autism-classroom" aria-label="Učionica simulacija">
                {/* floating icons (visual “movement”) */}
                {motion > 0 && (
                  <>
                    <span className={`autism-float ${motion === 2 ? "fast" : ""}`} style={{ top: 22, left: 18 }}>✏️</span>
                    <span className={`autism-float slow`} style={{ top: 58, left: 120 }}>📚</span>
                    <span className={`autism-float ${motion === 2 ? "fast" : ""}`} style={{ top: 26, right: 38 }}>🧑‍🤝‍🧑</span>
                    <span className={`autism-float slow`} style={{ bottom: 26, right: 58 }}>🔔</span>
                  </>
                )}

                <div className="autism-simHint">
                  Stres (procjena): <b>{stress}/100</b>
                </div>
                <div className="autism-noiseBar" aria-label="Razina buke">
                  <div className="autism-noiseFill" style={{ width: `${noise * 50}%` }} />
                </div>

                {overloaded ? (
                  <div className="autism-note">
                    <b>Osjećaj:</b> “Ima previše informacija odjednom…”
                  </div>
                ) : (
                  <div className="autism-note">
                    <b>Poruka:</b> “Ponekad je teško kad ima previše informacija. Što bi pomoglo?”
                  </div>
                )}
              </div>

              <h3>Što bi pomoglo?</h3>
              <div className="autism-row wrap">
                <button className="autism-secondary" onClick={() => pickHelp("A")}>A) Smanji buku</button>
                <button className="autism-secondary" onClick={() => pickHelp("B")}>B) Pusti vrijeme za odmor</button>
                <button className="autism-secondary" onClick={() => pickHelp("C")}>C) Još glasnije pričaj</button>
              </div>

              {helpFeedback && <div className="autism-note">{helpFeedback}</div>}
            </div>

            <div className="autism-panel">
              <h3>Zašto je ovo važno?</h3>
              <ul className="autism-list">
                <li>Manje podražaja = lakša koncentracija.</li>
                <li>Tranzicije (promjene) su lakše kad imamo najavu i plan.</li>
                <li>Najbolja pomoć je prilagodba okoline + dogovor, ne “spašavanje”.</li>
              </ul>

              <div className="autism-actions">
                <button className="autism-primary" onClick={() => setTab("razmisli")}>Razmisli i razgovaraj</button>
              </div>
            </div>
          </div>
        </section>
      )}

      {tab === "razmisli" && (
        <section className="autism-card">
          <h2>🔵 Razmisli i razgovaraj</h2>
          <p className="autism-muted">
            Ovo su pitanja iz “razmisli” dijela — možeš upisati odgovore i spremit će se lokalno.
          </p>

          <div className="autism-panel">
            <div className="autism-row">
              <label className="grow">
                1) Što bi tebi pomoglo da se osjećaš bolje u školi?
                <textarea
                  rows={3}
                  value={reflections.q1}
                  onChange={(e) => setReflections((r: any) => ({ ...r, q1: e.target.value }))}
                  placeholder="npr. mirnije mjesto, jasniji plan, pauza..."
                />
              </label>
            </div>

            <div className="autism-row">
              <label className="grow">
                2) Što možeš pitati prijatelja umjesto da pretpostaviš?
                <textarea
                  rows={3}
                  value={reflections.q2}
                  onChange={(e) => setReflections((r: any) => ({ ...r, q2: e.target.value }))}
                  placeholder='npr. "Želiš li pauzu?" "Što ti pomaže?"'
                />
              </label>
            </div>

            <div className="autism-row">
              <label className="grow">
                3) Koje 2 prilagodbe iz igre bi pomogle “svima”, ne samo autistima?
                <textarea
                  rows={3}
                  value={reflections.q3}
                  onChange={(e) => setReflections((r: any) => ({ ...r, q3: e.target.value }))}
                  placeholder="npr. manje buke, jasnije upute..."
                />
              </label>
            </div>

            <div className="autism-actions">
              <button className="autism-secondary" onClick={() => setReflections({ q1: "", q2: "", q3: "" })}>
                Očisti odgovore
              </button>
              <Link className="autism-back" to="/">Povratak</Link>
            </div>
          </div>
        </section>
      )}

      {tab === "alati" && (
        <section className="autism-card">
          <h2>🧰 Alati</h2>
          <p className="autism-muted">Ovo su praktični alati (raspored, tranzicije, komunikacija, smirivanje).</p>

          <div className="autism-grid2">
            <div className="autism-panel">
              <h3>Vizualni raspored</h3>

              <div className="autism-row">
                <label>
                  Vrijeme
                  <input type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} />
                </label>
                <label className="grow">
                  Aktivnost
                  <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="npr. Zadaća" />
                </label>
                <button className="autism-primary" onClick={addScheduleItem}>Dodaj</button>
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

              <div className="autism-actions">
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

            <div className="autism-panel">
              <h3>Timer za tranziciju</h3>
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
                {announce && <div className="autism-announce" role="status" aria-live="polite">{announce}</div>}
              </div>

              <h3 style={{ marginTop: 14 }}>AAC kartice</h3>
              <div className="autism-aacMessage" aria-live="polite">{aacMessage}</div>
              <div className="autism-aacGrid">
                {aacCards.map((c) => (
                  <button key={c.id} className="autism-aacCard" onClick={() => handleCard(c)}>
                    {c.label}
                  </button>
                ))}
              </div>

              <h3 style={{ marginTop: 14 }}>Smiri se</h3>
              <div className="autism-breath">
                <div><b>{breathLabel}</b></div>
                <div>{breathLeft}s</div>
              </div>
              <div className="autism-row wrap" style={{ marginTop: 10 }}>
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
            </div>
          </div>
        </section>
      )}

      {tab === "postavke" && (
        <section className="autism-card">
          <h2>⚙️ Postavke (low-stim)</h2>

          <div className="autism-panel">
            <label className="autism-row wrap">
              <input
                type="checkbox"
                checked={settings.largeText}
                onChange={(e) => setSettings((s: any) => ({ ...s, largeText: e.target.checked }))}
              />
              Veći tekst
            </label>

            <label className="autism-row wrap">
              <input
                type="checkbox"
                checked={settings.reducedMotion}
                onChange={(e) => setSettings((s: any) => ({ ...s, reducedMotion: e.target.checked }))}
              />
              Reduced motion (manje animacija)
            </label>

            <label className="autism-row wrap">
              <input
                type="checkbox"
                checked={settings.highContrast}
                onChange={(e) => setSettings((s: any) => ({ ...s, highContrast: e.target.checked }))}
              />
              Visoki kontrast
            </label>

            <hr className="autism-hr" />

            <label className="autism-row wrap">
              <input
                type="checkbox"
                checked={settings.enableSpeech}
                onChange={(e) => setSettings((s: any) => ({ ...s, enableSpeech: e.target.checked }))}
              />
              Uključi govor (SpeechSynthesis)
            </label>

            <label className="autism-row wrap">
              <input
                type="checkbox"
                checked={settings.enableBeep}
                onChange={(e) => setSettings((s: any) => ({ ...s, enableBeep: e.target.checked }))}
              />
              Uključi beep na kraju timera
            </label>

            <p className="autism-muted">
              Preporuka: govor/beep ostavi isključeno ako smetaju stimulacijom.
            </p>

            <div className="autism-actions">
              <Link className="autism-back" to="/">Povratak</Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
