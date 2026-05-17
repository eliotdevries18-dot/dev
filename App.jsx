import { useState, useEffect, useRef } from "react";

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,700;0,900;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --fire: #C4441A;
    --jungle: #1A6B5A;
    --sun: #F0B429;
    --cream: #FBF7F0;
    --dark: #1C1917;
    --muted: #6B6560;
    --card: #FFFFFF;
    --border: #E8E0D5;
  }

  body { background: var(--cream); font-family: 'DM Sans', sans-serif; color: var(--dark); }

  .app { max-width: 430px; margin: 0 auto; min-height: 100vh; display: flex; flex-direction: column; position: relative; background: var(--cream); }

  /* TOP BAR */
  .topbar {
    background: var(--dark);
    color: white;
    padding: 16px 20px 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    z-index: 100;
  }
  .topbar-title { font-family: 'Fraunces', serif; font-size: 22px; font-weight: 900; letter-spacing: -0.5px; }
  .topbar-title span { color: var(--sun); }
  .streak-badge {
    background: var(--fire);
    color: white;
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  /* NAV */
  .nav {
    background: var(--dark);
    display: flex;
    padding: 0 8px 8px;
    gap: 4px;
  }
  .nav-btn {
    flex: 1;
    background: transparent;
    border: none;
    color: #888;
    padding: 8px 4px;
    cursor: pointer;
    border-radius: 8px;
    font-size: 11px;
    font-family: 'DM Sans', sans-serif;
    font-weight: 500;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
    transition: all 0.2s;
  }
  .nav-btn.active { background: var(--fire); color: white; }
  .nav-btn:hover:not(.active) { color: #ccc; }
  .nav-icon { font-size: 18px; }

  /* CONTENT */
  .content { flex: 1; overflow-y: auto; padding: 0 0 20px; }

  /* SECTION HEADERS */
  .section-label {
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    color: var(--muted);
    padding: 20px 20px 8px;
  }

  /* HERO CARD */
  .hero {
    margin: 16px;
    background: var(--jungle);
    border-radius: 20px;
    padding: 24px;
    color: white;
    position: relative;
    overflow: hidden;
  }
  .hero::before {
    content: '';
    position: absolute;
    top: -30px; right: -30px;
    width: 160px; height: 160px;
    background: rgba(255,255,255,0.05);
    border-radius: 50%;
  }
  .hero::after {
    content: '';
    position: absolute;
    bottom: -50px; right: 20px;
    width: 120px; height: 120px;
    background: rgba(240,180,41,0.15);
    border-radius: 50%;
  }
  .hero-greeting { font-size: 13px; opacity: 0.7; margin-bottom: 4px; }
  .hero-title { font-family: 'Fraunces', serif; font-size: 28px; font-weight: 900; line-height: 1.1; margin-bottom: 16px; }
  .hero-title em { color: var(--sun); font-style: italic; }
  .progress-row { display: flex; align-items: center; gap: 10px; }
  .progress-bar-bg { flex: 1; height: 6px; background: rgba(255,255,255,0.2); border-radius: 3px; }
  .progress-bar-fill { height: 100%; background: var(--sun); border-radius: 3px; transition: width 0.5s ease; }
  .progress-label { font-size: 12px; font-weight: 600; white-space: nowrap; }

  /* STAT PILLS */
  .stats-row { display: flex; gap: 10px; padding: 4px 16px 8px; }
  .stat-pill {
    flex: 1;
    background: white;
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 12px 8px;
    text-align: center;
  }
  .stat-num { font-family: 'Fraunces', serif; font-size: 24px; font-weight: 700; color: var(--fire); }
  .stat-lbl { font-size: 10px; color: var(--muted); font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; }

  /* LESSON CARDS */
  .lessons-grid { display: flex; flex-direction: column; gap: 10px; padding: 0 16px; }
  .lesson-card {
    background: white;
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 16px;
    display: flex;
    align-items: center;
    gap: 14px;
    cursor: pointer;
    transition: all 0.2s;
    position: relative;
    overflow: hidden;
  }
  .lesson-card:hover { transform: translateY(-1px); box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
  .lesson-card.locked { opacity: 0.5; cursor: not-allowed; }
  .lesson-card.completed { border-color: var(--jungle); }
  .lesson-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 22px; flex-shrink: 0; }
  .lesson-info { flex: 1; }
  .lesson-name { font-weight: 600; font-size: 15px; margin-bottom: 2px; }
  .lesson-desc { font-size: 12px; color: var(--muted); }
  .lesson-badge {
    font-size: 11px;
    padding: 3px 8px;
    border-radius: 8px;
    font-weight: 600;
  }
  .badge-new { background: #FEF3C7; color: #92400E; }
  .badge-done { background: #D1FAE5; color: #065F46; }
  .badge-locked { background: #F3F4F6; color: #9CA3AF; }

  /* FLASHCARD VIEW */
  .flashcard-container { padding: 16px; }
  .fc-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
  .fc-counter { font-size: 13px; color: var(--muted); font-weight: 500; }
  .fc-category { font-size: 12px; background: var(--fire); color: white; padding: 4px 10px; border-radius: 20px; font-weight: 600; }

  .flashcard {
    background: var(--dark);
    border-radius: 24px;
    padding: 40px 24px;
    text-align: center;
    min-height: 260px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: transform 0.15s;
    position: relative;
    overflow: hidden;
  }
  .flashcard::before {
    content: '';
    position: absolute;
    top: -40px; left: -40px;
    width: 180px; height: 180px;
    background: radial-gradient(circle, rgba(196,68,26,0.3) 0%, transparent 70%);
  }
  .flashcard:active { transform: scale(0.98); }
  .fc-spanish { font-family: 'Fraunces', serif; font-size: 36px; font-weight: 900; color: white; margin-bottom: 8px; }
  .fc-phonetic { font-size: 13px; color: #888; margin-bottom: 16px; font-style: italic; }
  .fc-english { font-size: 18px; color: var(--sun); font-weight: 500; }
  .fc-tap-hint { font-size: 12px; color: #555; margin-top: 20px; }
  .fc-context { font-size: 13px; color: #aaa; margin-top: 12px; line-height: 1.5; }

  .fc-actions { display: flex; gap: 10px; margin-top: 16px; }
  .fc-btn {
    flex: 1;
    padding: 14px;
    border: none;
    border-radius: 14px;
    font-family: 'DM Sans', sans-serif;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    transition: opacity 0.2s;
  }
  .fc-btn:hover { opacity: 0.85; }
  .fc-btn.wrong { background: #FEE2E2; color: #B91C1C; }
  .fc-btn.hard { background: #FEF3C7; color: #92400E; }
  .fc-btn.easy { background: #D1FAE5; color: #065F46; }

  /* LESSON DETAIL */
  .lesson-detail { padding: 16px; }
  .back-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    background: none;
    border: none;
    color: var(--fire);
    font-family: 'DM Sans', sans-serif;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    margin-bottom: 16px;
    padding: 0;
  }
  .lesson-hero {
    background: var(--fire);
    border-radius: 20px;
    padding: 24px;
    color: white;
    margin-bottom: 20px;
    text-align: center;
  }
  .lesson-hero-icon { font-size: 40px; margin-bottom: 8px; }
  .lesson-hero-title { font-family: 'Fraunces', serif; font-size: 26px; font-weight: 900; margin-bottom: 4px; }
  .lesson-hero-sub { font-size: 13px; opacity: 0.8; }

  .vocab-item {
    background: white;
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 14px 16px;
    margin-bottom: 10px;
  }
  .vocab-row { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 4px; }
  .vocab-word { font-family: 'Fraunces', serif; font-size: 20px; font-weight: 700; color: var(--fire); }
  .vocab-tag { font-size: 10px; background: var(--sun); color: var(--dark); padding: 2px 8px; border-radius: 8px; font-weight: 700; }
  .vocab-en { font-size: 14px; font-weight: 500; margin-bottom: 4px; }
  .vocab-example { font-size: 12px; color: var(--muted); font-style: italic; }

  .grammar-block {
    background: white;
    border: 1px solid var(--border);
    border-left: 4px solid var(--jungle);
    border-radius: 14px;
    padding: 16px;
    margin-bottom: 12px;
  }
  .grammar-title { font-weight: 700; font-size: 15px; margin-bottom: 6px; color: var(--jungle); }
  .grammar-rule { font-size: 13px; line-height: 1.6; color: var(--dark); }
  .grammar-example { font-size: 13px; color: var(--muted); font-style: italic; margin-top: 8px; }

  /* QUIZ */
  .quiz-container { padding: 16px; }
  .quiz-q { font-family: 'Fraunces', serif; font-size: 22px; font-weight: 700; margin-bottom: 6px; }
  .quiz-sub { font-size: 13px; color: var(--muted); margin-bottom: 24px; }
  .quiz-options { display: flex; flex-direction: column; gap: 10px; }
  .quiz-option {
    background: white;
    border: 2px solid var(--border);
    border-radius: 14px;
    padding: 16px;
    cursor: pointer;
    font-size: 15px;
    font-family: 'DM Sans', sans-serif;
    text-align: left;
    transition: all 0.15s;
  }
  .quiz-option:hover { border-color: var(--fire); }
  .quiz-option.correct { border-color: var(--jungle); background: #D1FAE5; }
  .quiz-option.wrong { border-color: #EF4444; background: #FEE2E2; }
  .quiz-feedback {
    margin-top: 16px;
    padding: 16px;
    border-radius: 14px;
    font-size: 14px;
    line-height: 1.5;
  }
  .quiz-feedback.correct { background: #D1FAE5; color: #065F46; }
  .quiz-feedback.wrong { background: #FEE2E2; color: #B91C1C; }
  .next-btn {
    width: 100%;
    margin-top: 12px;
    padding: 16px;
    background: var(--dark);
    color: white;
    border: none;
    border-radius: 14px;
    font-family: 'DM Sans', sans-serif;
    font-weight: 600;
    font-size: 15px;
    cursor: pointer;
  }

  /* AI CHAT */
  .chat-container { display: flex; flex-direction: column; height: calc(100vh - 130px); }
  .chat-header { padding: 16px; background: white; border-bottom: 1px solid var(--border); }
  .chat-persona { display: flex; align-items: center; gap: 12px; }
  .chat-avatar { width: 44px; height: 44px; background: var(--fire); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px; }
  .chat-name { font-weight: 700; font-size: 15px; }
  .chat-status { font-size: 12px; color: var(--jungle); font-weight: 500; }
  .chat-desc { font-size: 11px; color: var(--muted); margin-top: 2px; }

  .chat-messages { flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 12px; }
  .msg { max-width: 80%; }
  .msg.user { align-self: flex-end; }
  .msg.ai { align-self: flex-start; }
  .msg-bubble {
    padding: 12px 16px;
    border-radius: 18px;
    font-size: 14px;
    line-height: 1.5;
  }
  .msg.user .msg-bubble { background: var(--fire); color: white; border-bottom-right-radius: 4px; }
  .msg.ai .msg-bubble { background: white; border: 1px solid var(--border); border-bottom-left-radius: 4px; }
  .msg-time { font-size: 10px; color: var(--muted); margin-top: 4px; text-align: right; }
  .msg.ai .msg-time { text-align: left; }

  .chat-input-row { padding: 12px 16px; background: white; border-top: 1px solid var(--border); display: flex; gap: 8px; }
  .chat-input {
    flex: 1;
    padding: 12px 16px;
    border: 1px solid var(--border);
    border-radius: 24px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    outline: none;
    background: var(--cream);
  }
  .chat-input:focus { border-color: var(--fire); }
  .send-btn {
    width: 44px;
    height: 44px;
    background: var(--fire);
    border: none;
    border-radius: 50%;
    color: white;
    font-size: 18px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .send-btn:disabled { opacity: 0.5; }
  .typing-indicator { display: flex; gap: 4px; align-items: center; padding: 8px 4px; }
  .typing-dot { width: 6px; height: 6px; background: var(--muted); border-radius: 50%; animation: bounce 1.2s infinite; }
  .typing-dot:nth-child(2) { animation-delay: 0.2s; }
  .typing-dot:nth-child(3) { animation-delay: 0.4s; }
  @keyframes bounce { 0%, 80%, 100% { transform: scale(0.6); } 40% { transform: scale(1); } }

  .suggestion-chips { display: flex; gap: 8px; overflow-x: auto; padding: 8px 16px 0; scrollbar-width: none; }
  .suggestion-chips::-webkit-scrollbar { display: none; }
  .chip {
    white-space: nowrap;
    background: var(--cream);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 6px 12px;
    font-size: 12px;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    font-weight: 500;
    transition: all 0.15s;
    flex-shrink: 0;
  }
  .chip:hover { border-color: var(--fire); color: var(--fire); }

  /* PROGRESS */
  .progress-view { padding: 16px; }
  .level-card {
    background: var(--dark);
    color: white;
    border-radius: 20px;
    padding: 24px;
    margin-bottom: 16px;
    text-align: center;
  }
  .level-badge { font-size: 48px; margin-bottom: 8px; }
  .level-name { font-family: 'Fraunces', serif; font-size: 24px; font-weight: 900; }
  .level-sub { font-size: 13px; opacity: 0.6; margin-top: 4px; }
  .xp-bar-bg { background: rgba(255,255,255,0.15); border-radius: 4px; height: 8px; margin-top: 16px; }
  .xp-bar-fill { background: var(--sun); height: 100%; border-radius: 4px; }
  .xp-label { display: flex; justify-content: space-between; font-size: 11px; margin-top: 4px; opacity: 0.7; }

  .achievements-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 16px; }
  .achievement {
    background: white;
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 14px;
    text-align: center;
  }
  .achievement.unlocked { border-color: var(--sun); background: #FFFBEB; }
  .ach-icon { font-size: 28px; margin-bottom: 6px; }
  .ach-name { font-size: 12px; font-weight: 600; margin-bottom: 2px; }
  .ach-desc { font-size: 10px; color: var(--muted); }
  .ach-locked { opacity: 0.35; }

  .milestones { display: flex; flex-direction: column; gap: 0; }
  .milestone {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 12px 0;
    border-bottom: 1px solid var(--border);
  }
  .milestone:last-child { border-bottom: none; }
  .ms-dot {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    flex-shrink: 0;
    margin-top: 2px;
  }
  .ms-dot.done { background: var(--jungle); color: white; }
  .ms-dot.current { background: var(--fire); color: white; }
  .ms-dot.future { background: var(--border); color: var(--muted); }
  .ms-title { font-weight: 600; font-size: 14px; }
  .ms-date { font-size: 12px; color: var(--muted); }
`;

// ─── DATA ───────────────────────────────────────────────────────────────────

const LESSONS = [
  {
    id: 1,
    icon: "🇨🇱",
    color: "#C4441A",
    bg: "#FEF0EB",
    name: "Chilean Slang Essentials",
    desc: "Sound like a local from day one",
    badge: "new",
    vocab: [
      { word: "¿Cachai?", en: "You get it? / You know?", tag: "🔥 Must Know", example: "Hay que llegar temprano, ¿cachai?" },
      { word: "Al tiro", en: "Right away / Immediately", tag: "🔥 Must Know", example: "Voy al tiro — I'm going right away" },
      { word: "Bacán", en: "Cool / Awesome / Great", tag: "Common", example: "¡Qué bacán! — How cool!" },
      { word: "Huacho/a", en: "Orphan / Lonely / Alone (casual)", tag: "Common", example: "Me quedé huacho en la fiesta" },
      { word: "La micro", en: "The bus", tag: "Essential", example: "¿Viene la micro?" },
      { word: "Fome", en: "Boring / Lame", tag: "Common", example: "Esa película es muy fome" },
      { word: "Pololo/a", en: "Boyfriend / Girlfriend", tag: "🔥 Must Know", example: "Mi polola es chilena" },
      { word: "Carrete", en: "Party / Going out", tag: "Social", example: "¿Vamos al carrete esta noche?" },
    ],
    grammar: [
      { title: "Dropping the 's' in conversation", rule: "Chileans often drop or soften the 's' sound, especially at the end of syllables. 'Más o menos' becomes 'mah o menoh'. Don't be alarmed — it's not wrong, it's Chilean!", example: "Estás bien → Ehtáh bien" },
      { title: "¿Cachai? — The universal tag", rule: "Chileans add '¿cachai?' (from 'cachar' = to get/understand) at the end of sentences like English speakers say 'you know?' or 'right?'. Use it freely.", example: "El partido fue increíble, ¿cachai?" },
    ],
    quiz: [
      { q: "What does 'al tiro' mean?", opts: ["Later tonight", "Right away", "To the party", "Turn around"], ans: 1, explain: "¡Exacto! 'Al tiro' means right away or immediately. Very Chilean!" },
      { q: "How do you say 'girlfriend' in Chilean slang?", opts: ["Novia", "Polola", "Chica", "Amiga"], ans: 1, explain: "In Chile, 'polola' is the word for girlfriend and 'pololo' for boyfriend. 'Novia' is more formal." },
      { q: "If something is 'fome', it's...", opts: ["Delicious", "Exciting", "Boring", "Expensive"], ans: 2, explain: "¡Correcto! 'Fome' means boring or lame in Chilean Spanish." },
    ]
  },
  {
    id: 2,
    icon: "☕",
    color: "#1A6B5A",
    bg: "#ECFDF5",
    name: "Everyday Survival Phrases",
    desc: "Order food, ask directions, shop",
    badge: "new",
    vocab: [
      { word: "¿Me da...?", en: "Can I have...? (polite order)", tag: "Essential", example: "¿Me da un café, por favor?" },
      { word: "¿Cuánto sale?", en: "How much does it cost? (Chilean)", tag: "🔥 Must Know", example: "¿Cuánto sale esto?" },
      { word: "La cuenta", en: "The bill", tag: "Essential", example: "¿Me trae la cuenta?" },
      { word: "¿Está bueno?", en: "Is it good?", tag: "Common", example: "¿Está bueno el churrasco?" },
      { word: "Más despacio", en: "More slowly", tag: "Learner Essential", example: "Habla más despacio, por favor" },
      { word: "No entiendo", en: "I don't understand", tag: "Learner Essential", example: "No entiendo — puedes repetir?" },
      { word: "Estoy aprendiendo", en: "I'm learning (Spanish)", tag: "Opener", example: "Estoy aprendiendo español — ten paciencia!" },
    ],
    grammar: [
      { title: "'Cuánto vale' vs 'Cuánto sale'", rule: "In Chile, you ask '¿Cuánto sale?' to ask the price. Most of South America says '¿Cuánto cuesta?' or '¿Cuánto vale?'. Use 'sale' in Chile — locals will smile.", example: "¿Cuánto sale el kilo de tomates?" },
      { title: "Usted vs Tú", rule: "Chileans use both 'usted' (formal) and 'tú' (informal). Use 'usted' with older people, shop owners you don't know, and official settings. Switch to 'tú' once rapport is built.", example: "¿Cómo está usted? → ¿Cómo estás?" },
    ],
    quiz: [
      { q: "How do Chileans ask 'How much does it cost?'", opts: ["¿Cuánto cuesta?", "¿Cuánto vale?", "¿Cuánto sale?", "¿Qué precio tiene?"], ans: 2, explain: "'¿Cuánto sale?' is the Chilean way! You'll impress locals by using this instead of 'cuánto cuesta'." },
      { q: "To order politely in a Chilean restaurant, you say:", opts: ["Dame un café", "Quiero café", "¿Me da un café?", "Necesito café"], ans: 2, explain: "'¿Me da...?' is the polite, natural way to order in Chile. 'Dame' sounds a bit rude, '¿me da?' is perfect." },
    ]
  },
  {
    id: 3,
    icon: "🌎",
    color: "#7C3AED",
    bg: "#F5F3FF",
    name: "South American Differences",
    desc: "Argentina, Peru, Colombia variations",
    badge: "new",
    vocab: [
      { word: "Che (AR)", en: "Hey / Mate (Argentine filler)", tag: "Argentina", example: "Che, ¿cómo andás?" },
      { word: "Vos (AR/UY)", en: "You (informal — replaces tú)", tag: "Argentina/Uruguay", example: "¿Vos hablás español?" },
      { word: "¿Cómo andás?", en: "How are you going? (AR)", tag: "Argentina", example: "¡Che, cómo andás!" },
      { word: "Pisco (CL/PE)", en: "The national spirit — debated!", tag: "Culture ⚠️", example: "¿Quieres un pisco sour?" },
      { word: "Listo", en: "Ready / Done / OK (all SA)", tag: "Universal", example: "¿Listo? ¡Vámonos!" },
      { word: "Buena onda", en: "Good vibe / Cool person (all SA)", tag: "Universal", example: "Él es muy buena onda" },
    ],
    grammar: [
      { title: "Voseo — The Argentine/Uruguayan 'you'", rule: "Argentina and Uruguay use 'vos' instead of 'tú', with different verb endings. 'Tú hablas' becomes 'vos hablás'. 'Tú eres' becomes 'vos sos'. It sounds musical once you get it.", example: "Tú tienes → Vos tenés | Tú puedes → Vos podés" },
      { title: "LL and Y pronunciation", rule: "In Argentina and Uruguay, 'll' and 'y' are pronounced like 'sh' or 'zh'. 'Yo' sounds like 'sho'. 'Calle' sounds like 'cashe'. In Chile and most other countries it sounds like 'y'.", example: "Yo → 'sho' (AR) vs 'yo' (CL)" },
    ],
    quiz: [
      { q: "In Argentina, 'vos hablás' is equivalent to:", opts: ["Él habla", "Tú hablas", "Nosotros hablamos", "Ustedes hablan"], ans: 1, explain: "'Vos' replaces 'tú' in Argentina and Uruguay, but the verb ending changes — 'hablás' instead of 'hablas'." },
      { q: "'Che' in Argentine Spanish is used to:", opts: ["Say goodbye", "Get someone's attention / address a friend", "Ask for the bill", "Express surprise only"], ans: 1, explain: "'Che' is a versatile Argentine filler — like 'hey' or 'mate'. Che Guevara got his nickname from this!" },
    ]
  },
  {
    id: 4,
    icon: "🕐",
    color: "#D97706",
    bg: "#FFFBEB",
    name: "Past & Present Tenses",
    desc: "Talk about what happened & what's happening",
    badge: "new",
    vocab: [
      { word: "Estaba", en: "I was / It was (ongoing past)", tag: "Grammar", example: "Estaba cansado ayer" },
      { word: "Fui", en: "I went / I was (completed past)", tag: "Grammar", example: "Fui al mercado esta mañana" },
      { word: "Estoy", en: "I am (temporary state)", tag: "Grammar", example: "Estoy aprendiendo español" },
      { word: "Soy", en: "I am (permanent identity)", tag: "Grammar", example: "Soy australiano" },
      { word: "Ayer", en: "Yesterday", tag: "Time", example: "Ayer fui a Santiago" },
      { word: "Ahora mismo", en: "Right now", tag: "Time", example: "Estoy comiendo ahora mismo" },
    ],
    grammar: [
      { title: "Ser vs Estar (the big one)", rule: "SER = permanent or identity: nationality, profession, personality. ESTAR = temporary or state: feelings, location, conditions. This distinction is critical and takes time to feel natural.", example: "Soy cansado (I'm a tired person) vs Estoy cansado (I feel tired now)" },
      { title: "Pretérito vs Imperfecto", rule: "Use pretérito (fui, comí) for completed, specific events. Use imperfecto (iba, comía) for ongoing, repeated, or descriptive past. Think: pretérito = a snapshot, imperfecto = a film.", example: "Ayer fui al mercado (snapshot) vs De niño iba al mercado (ongoing habit)" },
    ],
    quiz: [
      { q: "Which is correct? 'I am Australian'", opts: ["Estoy australiano", "Soy australiano", "Estoy de Australia", "Tengo australiano"], ans: 1, explain: "Nationality = SER. 'Soy australiano' — permanent identity, never changes!" },
      { q: "'Estoy cansado' means:", opts: ["I am always a tired person", "I feel tired right now", "I was tired yesterday", "Being tired"], ans: 1, explain: "ESTAR for temporary states. You're tired now — but won't be forever. ¡Perfecto!" },
    ]
  },
  {
    id: 5,
    icon: "🍖",
    color: "#BE185D",
    bg: "#FDF2F8",
    name: "Food & Social Life",
    desc: "Asados, markets, restaurants",
    badge: "locked",
    vocab: [],
    grammar: [],
    quiz: []
  },
  {
    id: 6,
    icon: "🚌",
    color: "#0369A1",
    bg: "#EFF6FF",
    name: "Getting Around",
    desc: "Transport, directions, maps",
    badge: "locked",
    vocab: [],
    grammar: [],
    quiz: []
  },
];

const FLASHCARD_DECK = [
  { es: "¿Cachai?", en: "You get it? / Right?", phonetic: "ka-CHAI", context: "Chilean tag question — use constantly!" },
  { es: "Al tiro", en: "Right away", phonetic: "al TEE-ro", context: "\"Voy al tiro\" = I'll go right away" },
  { es: "Bacán", en: "Cool / Awesome", phonetic: "ba-KAN", context: "\"¡Qué bacán!\" = How cool!" },
  { es: "Polola/o", en: "Girlfriend / Boyfriend", phonetic: "po-LO-la", context: "Chilean-specific — use instead of 'novia'" },
  { es: "Fome", en: "Boring / Lame", phonetic: "FO-meh", context: "\"Esa peli fue muy fome\"" },
  { es: "¿Cuánto sale?", en: "How much does it cost?", phonetic: "KWAN-to SAH-leh", context: "Chilean way to ask the price" },
  { es: "La micro", en: "The bus", phonetic: "la MEE-kro", context: "Public bus in Chilean cities" },
  { es: "Buena onda", en: "Good vibe / Cool person", phonetic: "BWE-na ON-da", context: "\"Él es muy buena onda\" = He's a great guy" },
  { es: "Carrete", en: "Party / Night out", phonetic: "ka-REH-teh", context: "\"¿Vamos al carrete?\" = Wanna go out?" },
  { es: "Vos hablás", en: "You speak (Argentine)", phonetic: "bos ah-BLAS", context: "Argentine 'you' — replaces tú hablás" },
  { es: "Che", en: "Hey / Mate (Argentine)", phonetic: "cheh", context: "Argentine attention-getter — like 'hey'" },
  { es: "Estoy aprendiendo", en: "I'm learning", phonetic: "es-TOY a-pren-DYEN-do", context: "Tell locals you're learning Spanish!" },
];

// ─── COMPONENTS ─────────────────────────────────────────────────────────────

function HomeView({ onLessonSelect, stats }) {
  const progress = Math.min((stats.lessonsCompleted / LESSONS.length) * 100, 100);
  return (
    <div className="content">
      <div className="hero">
        <div className="hero-greeting">Hola! Ready to practice?</div>
        <div className="hero-title">Your South American<br /><em>Spanish Journey</em></div>
        <div className="progress-row">
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
          </div>
          <div className="progress-label">{Math.round(progress)}% to B1</div>
        </div>
      </div>

      <div className="stats-row">
        <div className="stat-pill">
          <div className="stat-num">{stats.streak}</div>
          <div className="stat-lbl">Day Streak</div>
        </div>
        <div className="stat-pill">
          <div className="stat-num">{stats.wordsLearned}</div>
          <div className="stat-lbl">Words</div>
        </div>
        <div className="stat-pill">
          <div className="stat-num">{stats.xp}</div>
          <div className="stat-lbl">XP</div>
        </div>
      </div>

      <div className="section-label">Your Lessons</div>
      <div className="lessons-grid">
        {LESSONS.map(l => (
          <div
            key={l.id}
            className={`lesson-card${l.badge === "locked" ? " locked" : ""}${l.badge === "done" ? " completed" : ""}`}
            onClick={() => l.badge !== "locked" && onLessonSelect(l)}
          >
            <div className="lesson-icon" style={{ background: l.bg }}>
              {l.icon}
            </div>
            <div className="lesson-info">
              <div className="lesson-name">{l.name}</div>
              <div className="lesson-desc">{l.desc}</div>
            </div>
            <div className={`lesson-badge badge-${l.badge}`}>
              {l.badge === "new" ? "Start" : l.badge === "done" ? "✓ Done" : "🔒"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FlashcardsView({ onXP }) {
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [score, setScore] = useState({ easy: 0, hard: 0, wrong: 0 });
  const [done, setDone] = useState(false);

  const card = FLASHCARD_DECK[idx];

  const handleAnswer = (type) => {
    const newScore = { ...score, [type]: score[type] + 1 };
    setScore(newScore);
    if (idx + 1 >= FLASHCARD_DECK.length) {
      onXP(newScore.easy * 10 + newScore.hard * 5);
      setDone(true);
    } else {
      setIdx(idx + 1);
      setFlipped(false);
    }
  };

  const restart = () => { setIdx(0); setFlipped(false); setScore({ easy: 0, hard: 0, wrong: 0 }); setDone(false); };

  if (done) return (
    <div className="content" style={{ padding: 16 }}>
      <div style={{ textAlign: "center", padding: "40px 0" }}>
        <div style={{ fontSize: 60, marginBottom: 16 }}>🎉</div>
        <div style={{ fontFamily: "Fraunces, serif", fontSize: 28, fontWeight: 900, marginBottom: 8 }}>¡Muy bien!</div>
        <div style={{ color: "var(--muted)", marginBottom: 24 }}>Deck complete</div>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 32 }}>
          <div style={{ textAlign: "center" }}><div style={{ fontSize: 24, fontWeight: 700, color: "var(--jungle)" }}>{score.easy}</div><div style={{ fontSize: 11, color: "var(--muted)" }}>Easy</div></div>
          <div style={{ textAlign: "center" }}><div style={{ fontSize: 24, fontWeight: 700, color: "var(--sun)" }}>{score.hard}</div><div style={{ fontSize: 11, color: "var(--muted)" }}>Hard</div></div>
          <div style={{ textAlign: "center" }}><div style={{ fontSize: 24, fontWeight: 700, color: "var(--fire)" }}>{score.wrong}</div><div style={{ fontSize: 11, color: "var(--muted)" }}>Wrong</div></div>
        </div>
        <button className="next-btn" onClick={restart}>Review Again</button>
      </div>
    </div>
  );

  return (
    <div className="content">
      <div className="flashcard-container">
        <div className="fc-header">
          <span className="fc-counter">{idx + 1} / {FLASHCARD_DECK.length}</span>
          <span className="fc-category">🇨🇱 Chilean Spanish</span>
        </div>
        <div style={{ background: "#eee", borderRadius: 4, height: 4, marginBottom: 20 }}>
          <div style={{ background: "var(--fire)", height: 4, borderRadius: 4, width: `${((idx + 1) / FLASHCARD_DECK.length) * 100}%`, transition: "width 0.3s" }} />
        </div>

        <div className="flashcard" onClick={() => setFlipped(!flipped)}>
          <div className="fc-spanish">{card.es}</div>
          {card.phonetic && <div className="fc-phonetic">/{card.phonetic}/</div>}
          {!flipped && <div className="fc-tap-hint">Tap to reveal translation</div>}
          {flipped && (
            <>
              <div className="fc-english">{card.en}</div>
              <div className="fc-context">{card.context}</div>
            </>
          )}
        </div>

        {flipped && (
          <div className="fc-actions">
            <button className="fc-btn wrong" onClick={() => handleAnswer("wrong")}>✗ Didn't Know</button>
            <button className="fc-btn hard" onClick={() => handleAnswer("hard")}>~ Hard</button>
            <button className="fc-btn easy" onClick={() => handleAnswer("easy")}>✓ Easy</button>
          </div>
        )}
        {!flipped && (
          <button style={{ width: "100%", marginTop: 16, padding: 14, background: "var(--dark)", color: "white", border: "none", borderRadius: 14, fontFamily: "DM Sans, sans-serif", fontWeight: 600, fontSize: 15, cursor: "pointer" }} onClick={() => setFlipped(true)}>
            Reveal Answer
          </button>
        )}
      </div>
    </div>
  );
}

function LessonDetailView({ lesson, onBack, onComplete }) {
  const [tab, setTab] = useState("vocab");
  const [quizIdx, setQuizIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [quizDone, setQuizDone] = useState(false);

  const handleAnswer = (i) => {
    if (selected !== null) return;
    setSelected(i);
  };
  const nextQuestion = () => {
    if (quizIdx + 1 >= lesson.quiz.length) { setQuizDone(true); onComplete(lesson.id); }
    else { setQuizIdx(quizIdx + 1); setSelected(null); }
  };

  const q = lesson.quiz[quizIdx];

  return (
    <div className="lesson-detail">
      <button className="back-btn" onClick={onBack}>← Back</button>
      <div className="lesson-hero" style={{ background: lesson.color }}>
        <div className="lesson-hero-icon">{lesson.icon}</div>
        <div className="lesson-hero-title">{lesson.name}</div>
        <div className="lesson-hero-sub">{lesson.desc}</div>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {["vocab", "grammar", "quiz"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: "10px 4px", border: "none", borderRadius: 10, fontFamily: "DM Sans, sans-serif", fontWeight: 600, fontSize: 13, cursor: "pointer", background: tab === t ? lesson.color : "white", color: tab === t ? "white" : "var(--muted)", borderBottom: tab === t ? "none" : "1px solid var(--border)" }}>
            {t === "vocab" ? "📚 Vocab" : t === "grammar" ? "📖 Grammar" : "🧠 Quiz"}
          </button>
        ))}
      </div>

      {tab === "vocab" && lesson.vocab.map((v, i) => (
        <div key={i} className="vocab-item">
          <div className="vocab-row">
            <div className="vocab-word">{v.word}</div>
            <div className="vocab-tag">{v.tag}</div>
          </div>
          <div className="vocab-en">{v.en}</div>
          <div className="vocab-example">"{v.example}"</div>
        </div>
      ))}

      {tab === "grammar" && lesson.grammar.map((g, i) => (
        <div key={i} className="grammar-block">
          <div className="grammar-title">{g.title}</div>
          <div className="grammar-rule">{g.rule}</div>
          <div className="grammar-example">e.g. {g.example}</div>
        </div>
      ))}

      {tab === "quiz" && !quizDone && q && (
        <div className="quiz-container" style={{ padding: 0 }}>
          <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 8, fontWeight: 600 }}>QUESTION {quizIdx + 1} OF {lesson.quiz.length}</div>
          <div className="quiz-q">{q.q}</div>
          <div className="quiz-options">
            {q.opts.map((opt, i) => (
              <button key={i} className={`quiz-option${selected === i ? (i === q.ans ? " correct" : " wrong") : selected !== null && i === q.ans ? " correct" : ""}`} onClick={() => handleAnswer(i)}>
                {opt}
              </button>
            ))}
          </div>
          {selected !== null && (
            <>
              <div className={`quiz-feedback ${selected === q.ans ? "correct" : "wrong"}`}>
                {selected === q.ans ? "✓ " : "✗ "}{q.explain}
              </div>
              <button className="next-btn" onClick={nextQuestion}>
                {quizIdx + 1 >= lesson.quiz.length ? "Complete Lesson 🎉" : "Next Question →"}
              </button>
            </>
          )}
        </div>
      )}

      {tab === "quiz" && quizDone && (
        <div style={{ textAlign: "center", padding: "32px 0" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🏆</div>
          <div style={{ fontFamily: "Fraunces, serif", fontSize: 24, fontWeight: 900, marginBottom: 6 }}>¡Lección Completada!</div>
          <div style={{ color: "var(--muted)", marginBottom: 20 }}>+50 XP earned</div>
          <button className="next-btn" onClick={onBack}>Back to Lessons</button>
        </div>
      )}
    </div>
  );
}

function ChatView() {
  const [messages, setMessages] = useState([
    { role: "ai", text: "¡Hola! Soy Valentina, tu tutora de español latinoamericano 🇨🇱\n\nI'm your Chilean Spanish tutor. We can chat in English, Spanish, or a mix — you decide. I'll help you sound natural in Chile and South America.\n\n¿Cómo estás hoy? What would you like to practice?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  const SUGGESTIONS = ["Teach me a Chilean phrase", "Correct my Spanish", "How do I order food?", "What's 'cool' in Chilean?", "Practice conversation"];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text) => {
    const userText = text || input.trim();
    if (!userText || loading) return;
    setInput("");

    const newMessages = [...messages, { role: "user", text: userText }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const history = newMessages.map(m => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.text
      }));

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: `You are Valentina, a warm and encouraging Chilean Spanish tutor. You specialize in Chilean and South American Spanish as spoken in everyday life — including Chilean slang (cachai, al tiro, bacán, pololo/a, carrete, fome, la micro), Argentine voseo, and regional differences across South America.

Your personality: friendly, patient, uses humor, occasionally slips in Spanish phrases naturally. You always:
- Correct the user's Spanish gently and explain WHY
- Teach Chilean/South American slang and pronunciation naturally
- Give real-life context (e.g., "In Santiago you'd say..." or "In Argentina they prefer...")
- Use emojis occasionally
- Keep responses mobile-friendly and concise (3-5 short paragraphs max)
- Celebrate progress warmly

When the user writes Spanish, you always: (1) correct any errors kindly, (2) explain the correction, (3) give the Chilean/regional version. Never be discouraging.`,
          messages: history
        })
      });

      const data = await res.json();
      const reply = data.content?.find(b => b.type === "text")?.text || "Lo siento, algo salió mal. Try again!";
      setMessages([...newMessages, { role: "ai", text: reply }]);
    } catch {
      setMessages([...newMessages, { role: "ai", text: "Oops, connection issue! Check your internet and try again. ¡Lo siento!" }]);
    }
    setLoading(false);
  };

  const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="chat-persona">
          <div className="chat-avatar">👩🏽</div>
          <div>
            <div className="chat-name">Valentina</div>
            <div className="chat-status">● Online — Chilean Spanish Tutor</div>
            <div className="chat-desc">Native Chilean • Teaches SA Spanish & slang</div>
          </div>
        </div>
      </div>

      <div className="suggestion-chips">
        {SUGGESTIONS.map((s, i) => (
          <button key={i} className="chip" onClick={() => send(s)}>{s}</button>
        ))}
      </div>

      <div className="chat-messages">
        {messages.map((m, i) => (
          <div key={i} className={`msg ${m.role}`}>
            <div className="msg-bubble" style={{ whiteSpace: "pre-wrap" }}>{m.text}</div>
            <div className="msg-time">{now}</div>
          </div>
        ))}
        {loading && (
          <div className="msg ai">
            <div className="msg-bubble">
              <div className="typing-indicator">
                <div className="typing-dot" /><div className="typing-dot" /><div className="typing-dot" />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="chat-input-row">
        <input
          className="chat-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && send()}
          placeholder="Type in English or Spanish..."
        />
        <button className="send-btn" onClick={() => send()} disabled={loading || !input.trim()}>➤</button>
      </div>
    </div>
  );
}

function ProgressView({ stats }) {
  const xpToNext = 500;
  const achievements = [
    { icon: "🔥", name: "First Streak", desc: "Complete 1 day", unlocked: stats.streak >= 1 },
    { icon: "📚", name: "Word Collector", desc: "Learn 20 words", unlocked: stats.wordsLearned >= 20 },
    { icon: "🧠", name: "Quiz Master", desc: "Complete a quiz", unlocked: stats.lessonsCompleted >= 1 },
    { icon: "💬", name: "First Convo", desc: "Chat with Valentina", unlocked: false },
    { icon: "🇨🇱", name: "Chilean Slang", desc: "Finish lesson 1", unlocked: stats.lessonsCompleted >= 1 },
    { icon: "🌎", name: "SA Explorer", desc: "Finish 3 lessons", unlocked: stats.lessonsCompleted >= 3 },
  ];

  const milestones = [
    { label: "Start journey", date: "May 2026", status: "done" },
    { label: "A2 — Basic conversations", date: "Jul 2026", status: "current" },
    { label: "B1 — Comfortable in Chile", date: "Sep 2026", status: "future" },
    { label: "B2 — Almost fluent", date: "Jan 2027", status: "future" },
  ];

  return (
    <div className="progress-view">
      <div className="level-card">
        <div className="level-badge">🌱</div>
        <div className="level-name">Principiante</div>
        <div className="level-sub">A1 → A2 in progress</div>
        <div className="xp-bar-bg">
          <div className="xp-bar-fill" style={{ width: `${Math.min((stats.xp / xpToNext) * 100, 100)}%` }} />
        </div>
        <div className="xp-label">
          <span>{stats.xp} XP</span>
          <span>{xpToNext} XP to A2</span>
        </div>
      </div>

      <div className="section-label">Achievements</div>
      <div className="achievements-grid">
        {achievements.map((a, i) => (
          <div key={i} className={`achievement${a.unlocked ? " unlocked" : " ach-locked"}`}>
            <div className="ach-icon">{a.icon}</div>
            <div className="ach-name">{a.name}</div>
            <div className="ach-desc">{a.desc}</div>
          </div>
        ))}
      </div>

      <div className="section-label">Your Roadmap to January 2027</div>
      <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: 16, padding: "8px 16px", marginBottom: 20 }}>
        <div className="milestones">
          {milestones.map((m, i) => (
            <div key={i} className="milestone">
              <div className={`ms-dot ${m.status}`}>
                {m.status === "done" ? "✓" : m.status === "current" ? "→" : "○"}
              </div>
              <div>
                <div className="ms-title">{m.label}</div>
                <div className="ms-date">{m.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ────────────────────────────────────────────────────────────────

export default function App() {
  const [tab, setTab] = useState("home");
  const [activeLesson, setActiveLesson] = useState(null);
  const [stats, setStats] = useState({ streak: 1, wordsLearned: 0, xp: 0, lessonsCompleted: 0 });

  useEffect(() => {
    (async () => {
      try {
        const r = await window.storage.get("cl-es-stats");
        if (r) setStats(JSON.parse(r.value));
      } catch {}
    })();
  }, []);

  const saveStats = async (s) => {
    setStats(s);
    try { await window.storage.set("cl-es-stats", JSON.stringify(s)); } catch {}
  };

  const addXP = (amount) => saveStats({ ...stats, xp: stats.xp + amount });

  const completeLesson = (id) => {
    const s = { ...stats, lessonsCompleted: Math.max(stats.lessonsCompleted, id), wordsLearned: stats.wordsLearned + 7, xp: stats.xp + 50 };
    saveStats(s);
  };

  const NAV = [
    { id: "home", icon: "🏠", label: "Home" },
    { id: "flash", icon: "🃏", label: "Cards" },
    { id: "chat", icon: "💬", label: "Tutor" },
    { id: "progress", icon: "📈", label: "Progress" },
  ];

  const getTitle = () => {
    if (activeLesson) return activeLesson.name;
    if (tab === "home") return "Español";
    if (tab === "flash") return "Flashcards";
    if (tab === "chat") return "AI Tutor";
    if (tab === "progress") return "Mi Progreso";
  };

  return (
    <>
      <style>{style}</style>
      <div className="app">
        <div className="topbar">
          <div className="topbar-title">Habla<span>SA</span></div>
          <div className="streak-badge">🔥 {stats.streak} day{stats.streak !== 1 ? "s" : ""}</div>
        </div>

        <div className="nav">
          {NAV.map(n => (
            <button key={n.id} className={`nav-btn${tab === n.id && !activeLesson ? " active" : ""}`} onClick={() => { setTab(n.id); setActiveLesson(null); }}>
              <span className="nav-icon">{n.icon}</span>
              {n.label}
            </button>
          ))}
        </div>

        {activeLesson ? (
          <div className="content">
            <LessonDetailView lesson={activeLesson} onBack={() => setActiveLesson(null)} onComplete={completeLesson} />
          </div>
        ) : (
          <>
            {tab === "home" && <HomeView onLessonSelect={setActiveLesson} stats={stats} />}
            {tab === "flash" && <FlashcardsView onXP={addXP} />}
            {tab === "chat" && <ChatView />}
            {tab === "progress" && <ProgressView stats={stats} />}
          </>
        )}
      </div>
    </>
  );
}