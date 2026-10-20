import React, { useEffect, useRef, useState } from "react";
import { SHOP } from "./data";

export function Pet({ who, data, say }) {
  const item = SHOP.find((s) => s.id === data.worn[who]);
  const [bad, setBad] = useState(false);
  return (
    <div className={`pet ${who}`}>
      <div className="pet-pic">
        {bad || who === "chiku" ? <span className="pet-emoji">🐩</span> : <img src={`${who}.jpg`} alt={who} onError={() => setBad(true)} />}
        {who === "chiku" && !bad && <img className="chiku-img" src="chiku.jpg" alt="chiku" onError={(e) => (e.target.style.display = "none")} />}
        {item && <span className="worn">{item.icon}</span>}
      </div>
      <b>{who === "oreo" ? "Oreo" : "Chiku"}</b>
      <p className="say">{say}</p>
    </div>
  );
}

export function Shell({ title, emoji, Game, onFinish, onBack }) {
  const [phase, setPhase] = useState("ready");
  const [score, setScore] = useState(0);
  return (
    <div className="screen">
      <button className="back" onClick={onBack}>← Back</button>
      <h2>{emoji} {title}</h2>
      {phase === "ready" && <div className="card center"><p>Ready, Didi? Let's go!</p><button className="big" onClick={() => setPhase("play")}>Start!</button></div>}
      {phase === "play" && <Game onEnd={(s) => { setScore(s); setPhase("over"); onFinish(s); }} />}
      {phase === "over" && <div className="card center"><h3>🎉 Score {score}</h3><p>You won {score * 2} coins!</p><button className="big" onClick={() => setPhase("ready")}>Play again</button></div>}
    </div>
  );
}

export function Bubbles({ onEnd }) {
  const [list, setList] = useState([]);
  const [score, setScore] = useState(0);
  const [left, setLeft] = useState(30);
  const sc = useRef(0);
  useEffect(() => {
    const sp = setInterval(() => setList((l) => [...l.slice(-14), { id: Math.random(), x: 5 + Math.random() * 80, s: 46 + Math.random() * 34, d: 3 + Math.random() * 2.5, star: Math.random() < 0.12 }]), 520);
    const tm = setInterval(() => setLeft((t) => { if (t <= 1) { clearInterval(tm); clearInterval(sp); setTimeout(() => onEnd(sc.current), 0); return 0; } return t - 1; }), 1000);
    return () => { clearInterval(sp); clearInterval(tm); };
  }, []);
  const pop = (b) => { sc.current += b.star ? 3 : 1; setScore(sc.current); setList((l) => l.filter((x) => x.id !== b.id)); };
  return (
    <div className="arena bub">
      <div className="hud"><span>⏱ {left}s</span><span>⭐ {score}</span></div>
      {list.map((b) => (
        <button key={b.id} className="bubble" style={{ left: b.x + "%", width: b.s, height: b.s, animationDuration: b.d + "s" }}
          onPointerDown={() => pop(b)} onAnimationEnd={() => setList((l) => l.filter((x) => x.id !== b.id))}>{b.star ? "🐾" : ""}</button>
      ))}
    </div>
  );
}

export function Drops({ onEnd }) {
  const [, tick] = useState(0);
  const s = useRef({ x: 50, drops: [], score: 0, t: 0, over: false });
  const box = useRef();
  useEffect(() => {
    let raf, last = performance.now(), spawn = 0;
    const loop = (now) => {
      const g = s.current, dt = Math.min((now - last) / 1000, 0.05); last = now;
      g.t += dt; spawn -= dt;
      if (spawn <= 0) { g.drops.push({ id: Math.random(), x: 8 + Math.random() * 84, y: -6, bad: Math.random() < 0.22 }); spawn = 0.65; }
      g.drops.forEach((d) => (d.y += dt * (32 + g.t)));
      g.drops = g.drops.filter((d) => { if (d.y > 82 && d.y < 96 && Math.abs(d.x - g.x) < 13) { g.score = Math.max(0, g.score + (d.bad ? -1 : 1)); return false; } return d.y < 105; });
      if (g.t >= 30) { g.over = true; onEnd(g.score); return; }
      tick((n) => n + 1); raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);
  const move = (e) => { const r = box.current.getBoundingClientRect(); s.current.x = Math.min(92, Math.max(8, ((e.clientX - r.left) / r.width) * 100)); };
  const g = s.current;
  return (
    <div className="arena drops" ref={box} onPointerMove={move} onPointerDown={move}>
      <div className="hud"><span>⏱ {Math.max(0, 30 - Math.floor(g.t))}s</span><span>💧 {g.score}</span></div>
      {g.drops.map((d) => <span key={d.id} className="drop" style={{ left: d.x + "%", top: d.y + "%" }}>{d.bad ? "🧦" : "💧"}</span>)}
      <span className="basket" style={{ left: g.x + "%" }}>🧺</span>
      <small className="tip">Drag to move. Catch 💧, dodge Oreo's stolen socks 🧦</small>
    </div>
  );
}


export function Memory({ onEnd }) {
  const [cards] = useState(() => ["🐶", "🦴", "🎾", "🐩", "🧴", "💗"].flatMap((e) => [e, e]).sort(() => Math.random() - 0.5));
  const [open, setOpen] = useState([]);
  const [matched, setMatched] = useState([]);
  const [left, setLeft] = useState(45);
  const lock = useRef(false);
  const ended = useRef(false);
  useEffect(() => { const t = setInterval(() => setLeft((x) => Math.max(0, x - 1)), 1000); return () => clearInterval(t); }, []);
  useEffect(() => {
    if (ended.current) return;
    if (left === 0 || matched.length === 12) { ended.current = true; onEnd(matched.length / 2 + (matched.length === 12 ? 2 : 0)); }
  }, [left, matched]);
  const flip = (i) => {
    if (lock.current || open.includes(i) || matched.includes(i)) return;
    const o = [...open, i]; setOpen(o);
    if (o.length === 2) { lock.current = true; setTimeout(() => { if (cards[o[0]] === cards[o[1]]) setMatched((m) => [...m, ...o]); setOpen([]); lock.current = false; }, 700); }
  };
  return (
    <div className="arena mem">
      <div className="hud"><span>⏱ {left}s</span><span>💗 {matched.length / 2}/6</span></div>
      <div className="memgrid">
        {cards.map((c, i) => { const up = open.includes(i) || matched.includes(i); return <button key={i} className={`mcard ${up ? "up" : ""} ${matched.includes(i) ? "ok" : ""}`} onClick={() => flip(i)}>{up ? c : "🐾"}</button>; })}
      </div>
    </div>
  );
}
