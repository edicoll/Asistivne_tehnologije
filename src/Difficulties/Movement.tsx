import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Movement.css";

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

const tools: Tool[] = [
  {
    id: "ramp",
    name: "Rampa",
    emoji: "♿",
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
  // Game state
  const [placed, setPlaced] = useState<Record<ZoneId, ToolId | null>>({
    entranceStairs: null,
    mainDoor: null,
    stairsHall: null,
  });

  const [selectedTool, setSelectedTool] = useState<ToolId | null>(null);
  const [points, setPoints] = useState(0);
  const [feedback, setFeedback] = useState<string>(
      "Odaberi značajku i povuci ju na odgovarajuće mjesto."
  );

  // State za animacije
  const [animateHeader, setAnimateHeader] = useState(false);
  const [animateFacts, setAnimateFacts] = useState(false);

  useEffect(() => {
    // Interval za prve dvije ikone (lice i kolica) - svakih 3 sekunde
    const headerInterval = setInterval(() => {
      setAnimateHeader(true);
      setTimeout(() => setAnimateHeader(false), 1000);
    }, 3000);

    // Interval za druge 4 ikone - svakih 3.5 sekunde
    const factsInterval = setInterval(() => {
      setAnimateFacts(true);
      setTimeout(() => setAnimateFacts(false), 1000);
    }, 3500);

    return () => {
      clearInterval(headerInterval);
      clearInterval(factsInterval);
    };
  }, []);

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
    setFeedback("Odaberi značajku i povuci ju na odgovarajuće mjesto.");
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
    setFeedback(`Odabrana značajka: ${t.name} ${t.emoji}. Klikni mjesto na tlocrta da ga postaviš.`);
  }

  function onZoneClick(zoneId: ZoneId) {
    if (!selectedTool) {
      setFeedback("Prvo odaberi značajku iz kutije (desno).");
      return;
    }
    setToolOnZone(zoneId, selectedTool);
  }


  const facts = [
    { emoji: "♿️", title: "Pristupačnost je za sve", text: "Rampa i šira vrata pomažu i roditeljima s kolicima za bebe, ljudima s ozljedama i starijima." },
    { emoji: "🧠", title: "Samostalnost gradi samopouzdanje", text: "Kad okolina nije prepreka, djeca se mogu fokusirati na učenje i druženje." },
    { emoji: "🏫", title: "Škola kao siguran prostor", text: "Rukohvati, jasni prolazi i pristupačni ulazi čine školu sigurnijom za sve." },
    { emoji: "🤝", title: "Pitamo, ne pretpostavljamo", text: "Najbolje je pitati osobu što joj stvarno pomaže – svi imaju različite potrebe." },
  ];

  return (
      <div className="movement-container-pokret">
        <header className="movement-header-pokret">
          <div className="movement-header-content-pokret">
            <button className="movement-back-btn-pokret" onClick={() => navigate("/")}>
              ⬅ Povratak
            </button>
            <div className={`movement-header-characters-pokret ${animateHeader ? 'movement-bounce' : ''}`}>
              <div className="movement-character-left-pokret">🧑‍🦽</div>
              <div className="movement-character-right-pokret">🧒</div>
            </div>

            <h1 className="movement-title-pokret">
              ♿️ POKRET I TIJELO
            </h1>
            <p className="movement-subtitle-pokret">Učimo kako škola može biti pristupačna svima — kroz igru "Uređujemo školu".</p>

            {/* Prve dvije ikone s animacijom */}

            {/* Druge 4 ikone s animacijom */}
            <div className={`movement-header-decoration-pokret ${animateFacts ? 'movement-bounce' : ''}`}>
              <span className="movement-decoration-item-pokret">♿</span>
              <span className="movement-decoration-item-pokret">🚪</span>
              <span className="movement-decoration-item-pokret">🤚</span>
              <span className="movement-decoration-item-pokret">🏫</span>
            </div>
          </div>
        </header>

        <main className="movement-content-pokret">
          {/* UPOZNAJ SEKCIJA */}
          <section className="movement-intro-section-pokret movement-full-width-section-pokret">
            <div className="movement-section-container-pokret">

              <div className="movement-facts-section-pokret">
                <div className="movement-section-header-pokret">
                  <div className="movement-section-icon-pokret">✨</div>
                  <h2 className="movement-section-title-pokret">Upoznaj</h2>
                </div>

                <div className="movement-facts-grid-pokret">
                  {facts.map((f) => (
                      <div key={f.title} className="movement-info-card-pokret">
                        <div className="movement-card-icon-pokret">{f.emoji}</div>
                        <h3 className="movement-card-title-pokret">{f.title}</h3>
                        <p className="movement-card-text-pokret">{f.text}</p>
                      </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* IGRAJ SEKCIJA */}
          <section className="movement-game-section-pokret movement-full-width-section-pokret">
            <div className="movement-section-container-pokret">
              <div className="movement-section-header-pokret">
                <div className="movement-section-icon-pokret">🧩</div>
                <h2 className="movement-section-title-pokret">Igraj i otkrij</h2>
              </div>

              <div className="movement-game-container-pokret">
                <div className="movement-game-header-pokret">
                  <div className="movement-score-pill-pokret">Bodovi: <b>{points}</b></div>
                  <div className="movement-score-pill-pokret">Riješeno: <b>{completedCount}/{zones.length}</b></div>
                  <button className="movement-secondary-btn-pokret movement-reset-btn-pokret" onClick={resetGame}>Resetiraj igru</button>
                </div>

                <div className="movement-feedback-pokret" role="status" aria-live="polite">
                  {feedback}
                </div>

                <div className="movement-game-content-pokret">
                  <div className="movement-game-map-pokret">
                    <div className="movement-school-map-pokret" aria-label="Tlocrt škole s preprekama">
                      {zones.map((z) => {
                        const placedTool = placed[z.id];
                        const isCorrect = placedTool === z.correctTool;

                        return (
                            <button
                                key={z.id}
                                type="button"
                                className={`movement-map-zone-pokret ${isCorrect ? "movement-correct-pokret" : placedTool ? "movement-wrong-pokret" : ""}`}
                                onDrop={(e) => onDrop(e, z.id)}
                                onDragOver={onDragOver}
                                onClick={() => onZoneClick(z.id)}
                                aria-label={`${z.title}: ${z.obstacle}. ${placedTool ? `Postavljeno: ${toolById(placedTool).name}` : "Nije postavljeno."}`}
                            >
                              <div className="movement-zone-header-pokret">
                                <span className="movement-zone-title-pokret">{z.title}</span>
                                <span className="movement-zone-obstacle-pokret">{z.obstacleEmoji}</span>
                              </div>
                              <div className="movement-zone-body-pokret">
                                <div className="movement-zone-obstacle-text-pokret">{z.obstacle}</div>

                                <div className="movement-zone-slot-pokret">
                                  {placedTool ? (
                                      <span className="movement-placed-tool-pokret">
                                  {toolById(placedTool).emoji} {toolById(placedTool).name}
                                </span>
                                  ) : (
                                      <span className="movement-slot-hint-pokret">⬇ Ovdje postavi rješenje</span>
                                  )}
                                </div>
                              </div>
                            </button>
                        );
                      })}
                    </div>

                    {badgeText && (
                        <div className="movement-badge-pokret" aria-live="polite">
                          {badgeText} • odličan posao! 🎉
                        </div>
                    )}
                  </div>

                  <div className="movement-game-tools-pokret">
                    <h3 className="movement-tools-title-pokret">Značajke</h3>

                    <div className="movement-tools-grid-pokret">
                      {tools.map((t) => {
                        const active = selectedTool === t.id;
                        return (
                            <div
                                key={t.id}
                                className={`movement-tool-pokret ${active ? "movement-tool-active-pokret" : ""}`}
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
                              <div className="movement-tool-emoji-pokret">{t.emoji}</div>
                              <div className="movement-tool-text-pokret">
                                <div className="movement-tool-name-pokret">{t.name}</div>
                                <div className="movement-tool-desc-pokret">{t.description}</div>
                              </div>
                            </div>
                        );
                      })}
                    </div>

                    <div className="movement-tip-card-pokret">
                      <div className="movement-tip-title-pokret">💡 Mikro-cilj</div>
                      <div className="movement-tip-text-pokret">
                        Danas otkrivaš kako male promjene u prostoru mogu omogućiti veliku samostalnost.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SAVJETI SEKCIJA */}
          <section className="movement-tips-section-pokret movement-full-width-section-pokret">
            <div className="movement-section-container-pokret">
              <div className="movement-section-header-pokret">
                <div className="movement-section-icon-pokret">🤝</div>
                <h2 className="movement-section-title-pokret">Savjeti za razred</h2>
              </div>

              <div className="movement-tips-grid-pokret">
                <div className="movement-tip-card-pokret movement-tip-card-big-pokret">
                  <div className="movement-tip-title-pokret">✅ Pitaj i slušaj</div>
                  <div className="movement-tip-text-pokret">
                    Umjesto pretpostavke, pitaj: "Što ti olakšava kretanje?" ili "Kako ti mogu pomoći?"
                  </div>
                </div>
                <div className="movement-tip-card-pokret movement-tip-card-big-pokret">
                  <div className="movement-tip-title-pokret">✅ Ne diraj pomagala bez pitanja</div>
                  <div className="movement-tip-text-pokret">
                    Invalidska kolica, štap ili hodalica su dio osobnog prostora – uvijek prvo pitaj.
                  </div>
                </div>
                <div className="movement-tip-card-pokret movement-tip-card-big-pokret">
                  <div className="movement-tip-title-pokret">✅ Prostor bez prepreka</div>
                  <div className="movement-tip-text-pokret">
                    Držite prolaze prohodnima, ruksake maknite sa stepenica i hodnika.
                  </div>
                </div>
                <div className="movement-tip-card-pokret movement-tip-card-big-pokret">
                  <div className="movement-tip-title-pokret">✅ Pristupačnost pomaže svima</div>
                  <div className="movement-tip-text-pokret">
                    Kad je škola pristupačna, lakše je kretanje svima — i kad je netko ozlijeđen ili nosi teške stvari.
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        <footer className="movement-footer-pokret movement-full-width-section-pokret">
          <div className="movement-section-container-pokret">
            <p className="movement-footer-text-pokret">💬 Poruka: razumijevanje znači prilagoditi prostor i ponašanje — bez sažaljenja, uz poštovanje.</p>
          </div>
        </footer>
      </div>
  );
}

export default Movement;