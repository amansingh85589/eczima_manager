export const KEY = "chhavi-glow-v1";
export const OPEN_BEFORE = 30; // minutes before a task's time that it unlocks
export const LATE_AFTER = 60; // minutes after which a tick counts as "late" (fewer coins)
export const TASKS = [
  { id: "moist1", at: 9 * 60 + 30, time: "9:30 AM", icon: "🧴", title: "Moisturizer on", sub: "Soft skin, happy Didi" },
  { id: "shower", at: 10 * 60, time: "10:00 AM", icon: "🫧", title: "Short lukewarm shower", sub: "Play Bubble Pop after!", game: "bubbles" },
  { id: "moist2", at: 10 * 60 + 20, time: "10:20 AM", icon: "🧴", title: "Moisturize right after shower", sub: "Within 3 minutes" },
  { id: "breakfast", at: 10 * 60 + 30, time: "10:30 AM", icon: "🥞", title: "Yummy breakfast", sub: "Then play Pup Match!", game: "memory" },
  { id: "water", at: 10 * 60 + 50, time: "10:50 AM", icon: "💧", title: "Water before the shop", sub: "Catch the drops game!", game: "drops" },
  { id: "water2", at: 15 * 60, time: "3:00 PM", icon: "🥤", title: "Water break", sub: "Sip sip sip" },
  { id: "night", at: 22 * 60 + 15, time: "10:15 PM", icon: "🌙", title: "Night moisturizer + soft pjs", sub: "Sleep tight, Didi" },
];
export const SHOP = [
  { id: "bow", icon: "🎀", name: "Pink bow", price: 20, for: "oreo" },
  { id: "shades", icon: "🕶️", name: "Cool shades", price: 30, for: "oreo" },
  { id: "hat", icon: "🎩", name: "Fancy hat", price: 40, for: "chiku" },
  { id: "crown", icon: "👑", name: "Drama crown", price: 50, for: "chiku" },
  { id: "flower", icon: "🌸", name: "Flower", price: 20, for: "me" },
  { id: "tiara", icon: "💎", name: "Tiara", price: 60, for: "me" },
  { id: "party", icon: "🥳", name: "Party hat", price: 35, for: "oreo" },
  { id: "scarf", icon: "🧣", name: "Cozy scarf", price: 35, for: "chiku" },
  { id: "star", icon: "⭐", name: "Star", price: 30, for: "me" },
  { id: "bunny", icon: "🐰", name: "Bunny ears", price: 45, for: "me" },
];
export const SAY = {
  oreo: ["DIDI! Do the thing! Then play with me!", "I knocked something over. Anyway, task time!", "Zoomies unlocked. You did it!!", "Give me coins. I mean... good job."],
  chiku: ["Didi... I may faint if you skip this. Dramatically.", "Okay fine, I'm proud of you. *sigh*", "I deserve a crown for watching you do this.", "You're glowing, Didi. I'm exhausted."],
};
export const day = () => new Date(Date.now() - new Date().getTimezoneOffset() * 6e4).toISOString().slice(0, 10);
export const load = () => { try { return { coins: 0, done: {}, owned: [], worn: {}, ...JSON.parse(localStorage.getItem(KEY)) }; } catch { return { coins: 0, done: {}, owned: [], worn: {} }; } };
export const pick = (a) => a[Math.floor(Math.random() * a.length)];


export const nowMin = () => { const t = new Date(); return t.getHours() * 60 + t.getMinutes(); };
export const status = (t, now) => now < t.at - OPEN_BEFORE ? "locked" : now < t.at ? "soon" : now <= t.at + LATE_AFTER ? "now" : "late";
export const levelOf = (n) => {
  const names = ["Glow Starter", "Puppy Pal", "Skin Star", "Glow Queen", "Didi Legend"];
  const i = Math.min(Math.floor(n / 10), 4);
  return { lv: i + 1, name: names[i], left: i < 4 ? (i + 1) * 10 - n : 0 };
};