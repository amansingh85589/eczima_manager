import React, { useEffect, useState } from "react";
import { KEY, TASKS, SHOP, SAY, OPEN_BEFORE, day, load, pick, nowMin, status, levelOf } from "./data";
import { Pet, Shell, Bubbles, Drops, Memory } from "./components";

const fmt = (m) => { const h = Math.floor(m / 60), mm = m % 60; return `${h % 12 || 12}:${String(mm).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`; };
const cnt = (o) => (o ? Object.values(o).filter(Boolean).length : 0);
const inText = (d) => (d <= 0 ? "right now!" : d < 60 ? `in ${d} min` : `in ${Math.floor(d / 60)}h ${d % 60}m`);
const TAG = { locked: "🔒 later", soon: "⏳ soon", now: "⏰ NOW", late: "late · +2🪙" };
const BITS = ["🎉", "💗", "✨", "🐾", "🫧", "⭐", "🌸"];
const PRAISE = ["Look at you go, Didi!", "Oreo is zooming with joy!", "Chiku is fainting from pride.", "Glow level rising ✨", "Tiny step, big win!"];

export default function App() {
  const [data, setData] = useState(load);
  const [view, setView] = useState("home");
  const [say, setSay] = useState({ oreo: pick(SAY.oreo), chiku: pick(SAY.chiku) });
  const [now, setNow] = useState(nowMin());
  const [msg, setMsg] = useState("");
  const [fx, setFx] = useState([]);
  const [hop, setHop] = useState(0);
  const [ping, setPing] = useState(null);
  const today = day();
  const doneToday = data.done[today] || {};
  const count = cnt(doneToday);
  const pct = Math.round((count / TASKS.length) * 100);
  const total = Object.values(data.done).reduce((n, o) => n + cnt(o), 0);
  const lvl = levelOf(total);
  const streak = (() => {
    let n = 0, d = new Date();
    if (cnt(data.done[day()]) < 4) d.setDate(d.getDate() - 1);
    for (;;) { const k = new Date(d.getTime() - d.getTimezoneOffset() * 6e4).toISOString().slice(0, 10); if (cnt(data.done[k]) < 4) break; n++; d.setDate(d.getDate() - 1); }
    return n;
  })();

  useEffect(() => localStorage.setItem(KEY, JSON.stringify(data)), [data]);
  useEffect(() => { const i = setInterval(() => setNow(nowMin()), 15000); return () => clearInterval(i); }, []);
  useEffect(() => {
    const due = TASKS.find((t) => t.at === now && !doneToday[t.id]);
    if (due) { setPing(due); navigator.vibrate?.([200, 100, 200]); }
  }, [now]);

  const flash = (m) => { setMsg(m); setTimeout(() => setMsg(""), 2600); };
  const boom = () => { setFx(Array.from({ length: 16 }, (_, i) => ({ id: Math.random(), e: pick(BITS), x: 10 + Math.random() * 80, dx: (Math.random() - 0.5) * 160, dl: i * 0.03 }))); setTimeout(() => setFx([]), 1600); };
  const chat = () => { setSay({ oreo: pick(SAY.oreo), chiku: pick(SAY.chiku) }); setHop((h) => h + 1); };
  const earn = (n) => setData((p) => ({ ...p, coins: p.coins + n }));

  const tick = (t) => {
    const was = doneToday[t.id], st = status(t, now);
    if (was) { const back = typeof was === "number" ? was : 5; setData((p) => ({ ...p, coins: Math.max(0, p.coins - back), done: { ...p.done, [today]: { ...doneToday, [t.id]: false } } })); return; }
    if (st === "locked") { flash(`🔒 Opens at ${fmt(t.at - OPEN_BEFORE)}. Oreo says wait!`); return; }
    const c = st === "late" ? 2 : 5;
    setData((p) => ({ ...p, coins: p.coins + c, done: { ...p.done, [today]: { ...doneToday, [t.id]: c } } }));
    setPing(null); chat(); boom(); flash(`+${c} 🪙 ${pick(PRAISE)}`);
  };
  const buy = (it) => setData((p) => p.owned.includes(it.id) ? { ...p, worn: { ...p.worn, [it.for]: p.worn[it.for] === it.id ? null : it.id } } : p.coins >= it.price ? { ...p, coins: p.coins - it.price, owned: [...p.owned, it.id], worn: { ...p.worn, [it.for]: it.id } } : p);

  const me = SHOP.find((s) => s.id === data.worn.me);
  const hour = new Date().getHours();
  const hello = hour < 12 ? "Good morning" : hour < 17 ? "Hey" : "Good evening";
  const undone = TASKS.filter((t) => !doneToday[t.id]);
  const next = undone.find((t) => status(t, now) !== "late") || undone[0];

  if (view === "bubbles") return <Shell title="Bubble Pop" emoji="🫧" Game={Bubbles} onFinish={(s) => earn(s * 2)} onBack={() => setView("games")} />;
  if (view === "memory") return <Shell title="Pup Match" emoji="🐾" Game={Memory} onFinish={(s) => earn(s * 2)} onBack={() => setView("games")} />;
  if (view === "drops") return <Shell title="Catch the Drops" emoji="💧" Game={Drops} onFinish={(s) => earn(s * 2)} onBack={() => setView("games")} />;

  return (
    <div className="app">
      {ping && <div className="ping" onClick={() => setPing(null)}><span>⏰</span><div><b>Time for: {ping.title}!</b><small>Oreo is waiting, Didi. Tap to close.</small></div></div>}
      {msg && <div className="toast">{msg}</div>}
      <div className="fx">{fx.map((f) => <span key={f.id} style={{ left: f.x + "%", "--dx": f.dx + "px", animationDelay: f.dl + "s" }}>{f.e}</span>)}</div>
      <div className="screen">
        {view === "home" && <>
          <header className="top">
            <div className="me"><img src="chhavi.jpg" alt="Chhavi" />{me && <span className="worn me-worn">{me.icon}</span>}</div>
            <div className="hello"><small>{hello}</small><h1>Chhavi 💗</h1><span className="lvl">Lv {lvl.lv} · {lvl.name}</span></div>
            <div className="chips"><span className="chip">🪙 {data.coins}</span><span className="chip">🔥 {streak}</span></div>
          </header>
          <div className="pets" key={hop}><Pet who="oreo" data={data} say={say.oreo} /><Pet who="chiku" data={data} say={say.chiku} /></div>
          <div className="card hero">
            {next ? <>
              <small>UP NEXT</small>
              <h3>{next.icon} {next.title}</h3>
              <p>{next.time} · {status(next, now) === "locked" ? `opens ${inText(next.at - OPEN_BEFORE - now)}` : inText(next.at - now)}</p>
              <div className="herobtns">
                {status(next, now) !== "locked" && <button className="big" onClick={() => tick(next)}>✓ Done it!</button>}
                {next.game && <button className="play" onClick={() => setView(next.game)}>▶ Play</button>}
              </div>
            </> : <><small>ALL DONE</small><h3>🎉 You did it all today!</h3><p>Oreo and Chiku are so proud. Go play a game!</p></>}
          </div>
          <div className="card prog"><div className="row"><b>Today's glow</b><span>{count}/{TASKS.length}</span></div><div className="bar"><i style={{ width: pct + "%" }} /></div><p className="muted lvtxt">{lvl.left ? `${lvl.left} more tasks to level up ⭐` : "Max level! You're a legend 👑"}</p></div>
          {TASKS.map((t) => { const st = status(t, now), d = !!doneToday[t.id]; return (
            <div key={t.id} className={`task ${d ? "done" : st}`}>
              <button className="check" aria-label="tick" onClick={() => tick(t)}>{d ? "✓" : st === "locked" ? "🔒" : t.icon}</button>
              <div className="tinfo"><small>{t.time}{!d && <em className={`tag ${st}`}>{TAG[st]}</em>}</small><b>{t.title}</b><span>{st === "locked" && !d ? `Opens at ${fmt(t.at - OPEN_BEFORE)}` : t.sub}</span></div>
              {t.game && <button className="play" onClick={() => setView(t.game)}>▶ Play</button>}
            </div>
          ); })}
        </>}
        {view === "games" && <>
          <h2>🎮 Game Room</h2>
          <button className="card gcard" onClick={() => setView("bubbles")}><span>🫧</span><div><b>Bubble Pop</b><small>Pop bubbles. 🐾 bubbles are worth 3!</small></div></button>
          <button className="card gcard" onClick={() => setView("drops")}><span>💧</span><div><b>Catch the Drops</b><small>Catch water, dodge Oreo's socks</small></div></button>
          <button className="card gcard" onClick={() => setView("memory")}><span>🐾</span><div><b>Pup Match</b><small>Find all 6 pairs. Bonus for finishing!</small></div></button>
        </>}
        {view === "shop" && <>
          <h2>🛍️ Dress-up Shop</h2><p className="muted">You have 🪙 {data.coins}. Tap to buy, tap again to wear or remove.</p>
          <div className="shop">{SHOP.map((it) => { const own = data.owned.includes(it.id), on = data.worn[it.for] === it.id; return (
            <button key={it.id} className={`card item ${on ? "on" : ""}`} onClick={() => buy(it)}><span>{it.icon}</span><b>{it.name}</b><small>for {it.for === "me" ? "Didi" : it.for === "oreo" ? "Oreo" : "Chiku"}</small><em>{on ? "Wearing ✓" : own ? "Wear" : "🪙 " + it.price}</em></button>
          ); })}</div>
        </>}
      </div>
      <nav className="tabs">{[["home", "🏠", "Today"], ["games", "🎮", "Games"], ["shop", "🛍️", "Shop"]].map(([k, i, l]) => <button key={k} className={view === k ? "on" : ""} onClick={() => setView(k)}><span>{i}</span>{l}</button>)}</nav>
    </div>
  );
}