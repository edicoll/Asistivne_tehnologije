import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Movement.css";

type Tab = "intro" | "game" | "reflect" | "tips";

type ToolId = "ramp" | "wideDoor" | "handrail";

type ZoneId = "entranceStairs" | "mainDoor" | "stairsHall";

type Tool = {
  id: ToolId;
  name: string;
  emoji: string;
  description: string;
};

type Zone = {
  id: ZoneId;
  title: string;
  obstacleEmoji: string;
  obstacle: string;
  correctTool: ToolId;
};

const LS_REFLECTION = "assistive:movement:reflection:v1";

const tools: Tool[] = [
  {
    id: "ramp",
    name: "Rampa",
    emoji: "🛝",
    description: "Pomaže kad postoje stepenice – omogućuje pristupačan ulaz.",
  },
  {
    id: "wideDoor",
    name: "Šira vrata",
    emoji: "🚪",
    description: "Olakšava prolaz kolicima, hodalicama i svima s većim torbama.",
  },
  {
    id: "handrail",
    name: "Rukohvat",
    emoji: "🤚",
    description: "Pruža oslonac na stepenicama i u hodnicima – sigurnije kretanje.",
  },
];

const zones: Zone[] = [
  {
    id: "entranceStairs",
    title: "Ulaz škole",
    obstacleEmoji: "🧱",
    obstacle: "Stepenice na ulazu",
    correctTool: "ramp",
  },
  {
    id: "mainDoor",
    title: "Glavni ulaz",
    obstacleEmoji: "🚪",
    obstacle: "Uska vrata",
    correctTool: "wideDoor",
  },
  {
    id: "stairsHall",
    title: "Stubište",
    obstacleEmoji: "🪜",
    obstacle: "Stepenice bez rukohvata",
    correctTool: "handrail",
  },
];

function Movement() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("intro");
  // Game state
  const [placed, setPlaced] = useState<Record<ZoneId, ToolId | null>>({
    entranceStairs: null,
    mainDoor: null,
    stairsHall: null,
  });

  const [selectedTool, setSelectedTool] = useState<ToolId | null>(null);
  const [points, setPoints] = useState(0);
  const [feedback, setFeedback] = useState<string>(
    "Odaberi alat i postavi ga na pravo mjesto (drag&drop ili klikom)."
  );

  const [reflection, setReflection] = useState(() => {
    try {
      const raw = localStorage.getItem(LS_REFLECTION);
      return raw ? (JSON.parse(raw) as { q1: string; q2: string }) : { q1: "", q2: "" };
    } catch {
      return { q1: "", q2: "" };
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(LS_REFLECTION, JSON.stringify(reflection));
    } catch {
      // ignore
    }
  }, [reflection]);

  const completedCount = useMemo(() => {
    return zones.filter((z) => placed[z.id] === z.correctTool).length;
  }, [placed]);

  const isDone = completedCount === zones.length;

  const badgeText = useMemo(() => {
    if (!isDone) return null;
    return points >= 25 ? "🏅 Značka: Arhitekt pristupačnosti" : "🏅 Značka: Prijatelj pristupačnosti";
  }, [isDone, points]);

  function toolById(id: ToolId) {
    return tools.find((t) => t.id === id)!;
  }

  function setToolOnZone(zoneId: ZoneId, toolId: ToolId) {
    const zone = zones.find((z) => z.id === zoneId)!;

    // If already correctly placed, don't penalize; allow change only if not correct
    if (placed[zoneId] === zone.correctTool) {
      setFeedback("✅ Ovo je već odlično postavljeno. Probaj riješiti i ostala mjesta.");
      return;
    }

    setPlaced((prev) => ({ ...prev, [zoneId]: toolId }));

    if (toolId === zone.correctTool) {
      setPoints((p) => p + 10);
      setFeedback(`✅ Bravo! ${toolById(toolId).name} pomaže za: ${zone.obstacle.toLowerCase()}.`);
    } else {
      setPoints((p) => Math.max(0, p - 5));
      const hintTool = toolById(zone.correctTool);
      setFeedback(
        `➖ To nije najbolje rješenje za "${zone.obstacle}". Pokušaj s: ${hintTool.name} ${hintTool.emoji}`
      );
    }
  }

  function resetGame() {
    setPlaced({ entranceStairs: null, mainDoor: null, stairsHall: null });
    setSelectedTool(null);
    setPoints(0);
    setFeedback("Odaberi alat i postavi ga na pravo mjesto (drag&drop ili klikom).");
  }

  // Drag & Drop handlers
  function onDragStart(e: React.DragEvent, toolId: ToolId) {
    e.dataTransfer.setData("text/plain", toolId);
    e.dataTransfer.effectAllowed = "move";
  }

  function onDrop(e: React.DragEvent, zoneId: ZoneId) {
    e.preventDefault();
    const toolId = e.dataTransfer.getData("text/plain") as ToolId;
    if (!toolId) return;
    setToolOnZone(zoneId, toolId);
  }

  function onDragOver(e: React.DragEvent) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }

  // Click placement alternative (keyboard-friendly)
  function onToolClick(toolId: ToolId) {
    setSelectedTool((prev) => (prev === toolId ? null : toolId));
    const t = toolById(toolId);
    setFeedback(`Odabran alat: ${t.name} ${t.emoji}. Klikni mjesto na tlocrta da ga postaviš.`);
  }

  function onZoneClick(zoneId: ZoneId) {
    if (!selectedTool) {
      setFeedback("Prvo odaberi alat iz kutije (desno).");
      return;
    }
    setToolOnZone(zoneId, selectedTool);
  }

  // Intro content
  const story =
    "Ja sam Petra i koristim invalidska kolica. Kad dođem do škole, ponekad ne mogu ući jer su stepenice visoke ili su vrata preuska. Najviše mi pomaže kad je prostor prilagođen – tada mogu biti samostalna kao i ostali.";

  const facts = [
    { emoji: "♿️", title: "Pristupačnost je za sve", text: "Rampa i šira vrata pomažu i roditeljima s kolicima za bebe, ljudima s ozljedama i starijima." },
    { emoji: "🧠", title: "Samostalnost gradi samopouzdanje", text: "Kad okolina nije prepreka, djeca se mogu fokusirati na učenje i druženje." },
    { emoji: "🏫", title: "Škola kao siguran prostor", text: "Rukohvati, jasni prolazi i pristupačni ulazi čine školu sigurnijom za sve." },
    { emoji: "🤝", title: "Pitamo, ne pretpostavljamo", text: "Najbolje je pitati osobu što joj stvarno pomaže – svi imaju različite potrebe." },
  ];

  return (
    <div className="movement-container">
      <header className="movement-header">
        <div className="header-content">
          <div className="header-characters">
            <div className="character character-left">🧑‍🦽</div>
            <div className="character character-right">🧒</div>
          </div>
          <h1>
            ♿️ POKRET I TIJELO
          </h1>
          <p className="subtitle">Učimo kako škola može biti pristupačna svima — kroz igru “Uređujemo školu”.</p>
          <div className="header-decoration">
            <span className="decoration-item">🛝</span>
            <span className="decoration-item">🚪</span>
            <span className="decoration-item">🤚</span>
            <span className="decoration-item">🏫</span>
          </div>
        </div>
      </header>

      <nav className="movement-navigation" aria-label="Navigacija po modulu Pokret i tijelo">
        <button
          className={`movement-nav-btn ${tab === "intro" ? "active" : ""}`}
          onClick={() => setTab("intro")}
        >
          Upoznaj
        </button>
        <button
          className={`movement-nav-btn ${tab === "game" ? "active" : ""}`}
          onClick={() => setTab("game")}
        >
          Igraj i otkrij
        </button>
        <button
          className={`movement-nav-btn ${tab === "reflect" ? "active" : ""}`}
          onClick={() => setTab("reflect")}
        >
          Razmisli
        </button>
        <button
          className={`movement-nav-btn ${tab === "tips" ? "active" : ""}`}
          onClick={() => setTab("tips")}
        >
          Savjeti
        </button>
        <button className="movement-nav-btn ghost" onClick={() => navigate("/")}>
          ⬅ Povratak
        </button>
      </nav>

      <main className="movement-content">
        {tab === "intro" && (
          <>
            <section className="intro-section full-width-section">
              <div className="section-container">
                <div className="section-header">
                  <div className="section-icon">📖</div>
                  <h2>Kratka priča</h2>
                </div>
                <div className="story-card">
                  <p className="story-text">{story}</p>
                  <div className="story-actions">
                    <button className="primary-btn" onClick={() => setTab("game")}>Kreni u igru</button>
                  </div>
                </div>
              </div>
            </section>

            <section className="facts-section full-width-section">
              <div className="section-container">
                <div className="section-header">
                  <div className="section-icon">✨</div>
                  <h2>Jesi li znao da…</h2>
                </div>

                <div className="facts-grid">
                  {facts.map((f) => (
                    <div key={f.title} className="info-card red-card">
                      <div className="card-icon">{f.emoji}</div>
                      <h3>{f.title}</h3>
                      <p>{f.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}

        {tab === "game" && (
          <section className="game-section full-width-section">
            <div className="section-container">
              <div className="section-header">
                <div className="section-icon">🧩</div>
                <h2>Igra: Uređujemo školu</h2>
              </div>

              <p className="section-description">
                Cilj: prepoznaj prepreke i postavi prava rješenja. Možeš koristiti <b>drag&drop</b> ili <b>klikni alat → klikni mjesto</b>.
              </p>

              <div className="game-layout">
                <div className="map-card">
                  <div className="map-top">
                    <div className="score-pill">Bodovi: <b>{points}</b></div>
                    <div className="score-pill">Riješeno: <b>{completedCount}/{zones.length}</b></div>
                  </div>

                  <div className="feedback" role="status" aria-live="polite">
                    {feedback}
                  </div>

                  <div className="school-map" aria-label="Tlocrt škole s preprekama">
                    {zones.map((z) => {
                      const placedTool = placed[z.id];
                      const isCorrect = placedTool === z.correctTool;

                      return (
                        <button
                          key={z.id}
                          type="button"
                          className={`map-zone ${isCorrect ? "correct" : placedTool ? "wrong" : ""}`}
                          onDrop={(e) => onDrop(e, z.id)}
                          onDragOver={onDragOver}
                          onClick={() => onZoneClick(z.id)}
                          aria-label={`${z.title}: ${z.obstacle}. ${placedTool ? `Postavljeno: ${toolById(placedTool).name}` : "Nije postavljeno."}`}
                        >
                          <div className="zone-header">
                            <span className="zone-title">{z.title}</span>
                            <span className="zone-obstacle">{z.obstacleEmoji}</span>
                          </div>
                          <div className="zone-body">
                            <div className="zone-obstacle-text">{z.obstacle}</div>

                            <div className="zone-slot">
                              {placedTool ? (
                                <span className="placed-tool">
                                  {toolById(placedTool).emoji} {toolById(placedTool).name}
                                </span>
                              ) : (
                                <span className="slot-hint">⬇ Ovdje postavi rješenje</span>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="game-actions">
                    <button className="secondary-btn" onClick={resetGame}>Reset</button>
                    <button className="primary-btn" onClick={() => setTab("reflect")} disabled={!isDone}>
                      {isDone ? "Završi i razmisli" : "Završi (prvo riješi sve)"}
                    </button>
                  </div>

                  {badgeText && (
                    <div className="badge" aria-live="polite">
                      {badgeText} • odličan posao! 🎉
                    </div>
                  )}
                </div>

                <aside className="toolbox-card" aria-label="Kutija s alatima">
                  <h3>Alati</h3>
                  <p className="small">
                    Odaberi alat i povuci ga na tlocrt ili klikni alat pa mjesto na tlocrtu.
                  </p>

                  <div className="tools-grid">
                    {tools.map((t) => {
                      const active = selectedTool === t.id;
                      return (
                        <div
                          key={t.id}
                          className={`tool ${active ? "active" : ""}`}
                          draggable
                          onDragStart={(e) => onDragStart(e, t.id)}
                          onClick={() => onToolClick(t.id)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              onToolClick(t.id);
                            }
                          }}
                          aria-label={`${t.name}. ${t.description}`}
                        >
                          <div className="tool-emoji">{t.emoji}</div>
                          <div className="tool-text">
                            <div className="tool-name">{t.name}</div>
                            <div className="tool-desc">{t.description}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="tip-card">
                    <div className="tip-title">💡 Mikro-cilj</div>
                    <div className="tip-text">
                      Danas otkrivaš kako male promjene u prostoru mogu omogućiti veliku samostalnost.
                    </div>
                  </div>
                </aside>
              </div>
            </div>
          </section>
        )}

        {tab === "reflect" && (
          <section className="reflect-section full-width-section">
            <div className="section-container">
              <div className="section-header">
                <div className="section-icon">🗣️</div>
                <h2>Razmisli i razgovaraj</h2>
              </div>

              <p className="section-description">
                Ovdje nema “točno/krivo”. Poanta je razumjeti i predložiti dobra rješenja.
              </p>

              <div className="reflection-card">
                <label className="field">
                  <span>1) Što bi tebi pomoglo kad bi u školi postojale prepreke (stepenice, uska vrata)?</span>
                  <textarea
                    value={reflection.q1}
                    onChange={(e) => setReflection((r) => ({ ...r, q1: e.target.value }))}
                    rows={4}
                    placeholder="npr. rampa, lift, šira vrata, pomoć pri nošenju stvari..."
                  />
                </label>

                <label className="field">
                  <span>2) Koju bi jednu promjenu u svojoj školi predložio da bude pristupačnija svima?</span>
                  <textarea
                    value={reflection.q2}
                    onChange={(e) => setReflection((r) => ({ ...r, q2: e.target.value }))}
                    rows={4}
                    placeholder="npr. rukohvati, jasne staze, klupe s više mjesta..."
                  />
                </label>

                <div className="reflection-actions">
                  <button
                    className="secondary-btn"
                    onClick={() => setReflection({ q1: "", q2: "" })}
                  >
                    Očisti
                  </button>
                  <button className="primary-btn" onClick={() => setTab("tips")}>
                    Pogledaj savjete
                  </button>
                </div>

                <div className="small">
                  (Odgovori se spremaju samo na ovom uređaju.)
                </div>
              </div>
            </div>
          </section>
        )}

        {tab === "tips" && (
          <section className="tips-section full-width-section">
            <div className="section-container">
              <div className="section-header">
                <div className="section-icon">🤝</div>
                <h2>Savjeti za razred</h2>
              </div>

              <div className="tips-grid">
                <div className="tip-card big">
                  <div className="tip-title">✅ Pitaj i slušaj</div>
                  <div className="tip-text">
                    Umjesto pretpostavke, pitaj: “Što ti olakšava kretanje?” ili “Kako ti mogu pomoći?”
                  </div>
                </div>
                <div className="tip-card big">
                  <div className="tip-title">✅ Ne diraj pomagala bez pitanja</div>
                  <div className="tip-text">
                    Invalidska kolica, štap ili hodalica su dio osobnog prostora – uvijek prvo pitaj.
                  </div>
                </div>
                <div className="tip-card big">
                  <div className="tip-title">✅ Prostor bez prepreka</div>
                  <div className="tip-text">
                    Držite prolaze prohodnima, ruksake maknite sa stepenica i hodnika.
                  </div>
                </div>
                <div className="tip-card big">
                  <div className="tip-title">✅ Pristupačnost pomaže svima</div>
                  <div className="tip-text">
                    Kad je škola pristupačna, lakše je kretanje svima — i kad je netko ozlijeđen ili nosi teške stvari.
                  </div>
                </div>
              </div>

              <div className="cta-row">
                <button className="primary-btn" onClick={() => setTab("game")}>Ponovi igru</button>
                <button className="secondary-btn" onClick={() => navigate("/")}>Na početnu</button>
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className="movement-footer full-width-section">
        <div className="section-container">
          <p>💬 Poruka: razumijevanje znači prilagoditi prostor i ponašanje — bez sažaljenja, uz poštovanje.</p>
        </div>
      </footer>
    </div>
  );
}

export default Movement;
