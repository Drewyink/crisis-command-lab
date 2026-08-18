// ARCLINE GLOBAL 2035 - Crisis Command Lab
// Echolink Solutions live simulation server.

const path = require('path');
const http = require('http');
const express = require('express');
const { WebSocketServer } = require('ws');
const { COMPANY, START, EVENTS, AUTONOMY, DEBRIEF } = require('./scenario');

const PORT = process.env.PORT || 3000;
const INSTRUCTOR_KEY = process.env.INSTRUCTOR_KEY || 'echolink2035';

const app = express();
app.use(express.static(path.join(__dirname, 'public'), { extensions: ['html'] }));

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// ---------------------------------------------------------------- state

const session = {
  running: false,
  durationSec: 60 * 60,
  remaining: 60 * 60,
  revealed: false,
  broadcast: null,
  log: []
};

/** key = lowercased name */
const participants = new Map();
const sockets = new Set();

const eventById = id => EVENTS.find(e => e.id === id);
const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
const now = () => Date.now();

function newParticipant(name) {
  return {
    name,
    joinedAt: now(),
    k: { ...START },
    autonomy: 1,
    pending: {},          // eventId -> { deadline, firedAt }
    decisions: [],        // { eventId, title, optionId, optionLabel, seconds, feedback, d }
    feed: [],             // { at, sev, text }
    online: false
  };
}

function composite(p) {
  const k = p.k;
  const mktPct = clamp(k.mkt, 0, 140) / 1.4;
  const cashPct = clamp(k.cash, 0, 300) / 3;
  const base =
    0.28 * mktPct + 0.24 * clamp(k.trust, 0, 100) + 0.2 * clamp(k.reg, 0, 100) +
    0.2 * clamp(k.ops, 0, 100) + 0.08 * cashPct;
  return Math.round(clamp(base, 0, 100));
}

function bandFor(score) {
  return DEBRIEF.find(b => score >= b.min) || DEBRIEF[DEBRIEF.length - 1];
}

function pushFeed(p, sev, text) {
  p.feed.unshift({ at: now(), sev, text });
  if (p.feed.length > 40) p.feed.pop();
}

function applyDeltas(p, d, tag, autonomyModifier) {
  const mod = tag === 'ai' && autonomyModifier
    ? AUTONOMY[p.autonomy].aiRisk
    : 0;
  for (const key of ['mkt', 'trust', 'reg', 'ops', 'cash']) {
    let v = d[key] || 0;
    // Higher autonomy amplifies AI losses and slightly amplifies AI gains
    if (mod && v < 0) v = v * (1 + mod);
    if (mod && v > 0) v = v * (1 - mod * 0.4);
    p.k[key] = key === 'cash'
      ? clamp(Math.round(p.k[key] + v), 0, 300)
      : clamp(Math.round((p.k[key] + v) * 10) / 10, 0, key === 'mkt' ? 140 : 100);
  }
}

function fireEvent(eventId) {
  const ev = eventById(eventId);
  if (!ev) return;
  const firedAt = now();
  const deadline = firedAt + ev.seconds * 1000;
  session.log.unshift({ at: firedAt, text: `Fired ${ev.id}: ${ev.title}` });
  for (const p of participants.values()) {
    p.pending[ev.id] = { deadline, firedAt };
    pushFeed(p, ev.sev, `SEV-${ev.sev} ${ev.title}`);
  }
  broadcastAll();
}

function resolve(p, eventId, optionId, timedOut) {
  const ev = eventById(eventId);
  const pend = p.pending[eventId];
  if (!ev || !pend) return;
  const opt = timedOut ? null : ev.options.find(o => o.id === optionId);
  const outcome = opt || ev.none;
  const before = { ...p.k };
  applyDeltas(p, outcome.d, ev.tag, true);
  const applied = {};
  for (const key of ['mkt', 'trust', 'reg', 'ops', 'cash']) {
    applied[key] = Math.round((p.k[key] - before[key]) * 10) / 10;
  }
  const secs = Math.round((now() - pend.firedAt) / 1000);
  p.decisions.push({
    eventId, title: ev.title, sev: ev.sev,
    optionId: opt ? opt.id : 'none',
    optionLabel: opt ? opt.label : 'No decision',
    seconds: secs,
    feedback: outcome.fb,
    d: applied
  });
  pushFeed(p, opt ? 3 : ev.sev, `${ev.id} resolved: ${opt ? opt.label : 'no decision recorded'}`);
  delete p.pending[eventId];
  send(p, { t: 'resolved', eventId, feedback: outcome.fb, d: applied, timedOut: !opt });
}

// ------------------------------------------------------------ transport

function send(target, msg) {
  const payload = JSON.stringify(msg);
  for (const ws of sockets) {
    if (ws.readyState !== 1) continue;
    if (target === 'instructor' && ws.role !== 'instructor' && ws.role !== 'screen') continue;
    if (target === 'all') { ws.send(payload); continue; }
    if (typeof target === 'object' && ws.pkey === target.name.toLowerCase()) ws.send(payload);
  }
}

function participantView(p) {
  const pend = Object.entries(p.pending).map(([id, meta]) => {
    const ev = eventById(id);
    return {
      id, sev: ev.sev, tag: ev.tag, title: ev.title, body: ev.body,
      options: ev.options.map(o => ({ id: o.id, label: o.label, detail: o.detail })),
      remaining: Math.max(0, Math.round((meta.deadline - now()) / 1000)),
      window: ev.seconds
    };
  }).sort((a, b) => a.remaining - b.remaining);
  return {
    t: 'state',
    role: 'participant',
    company: COMPANY,
    clock: session.remaining,
    running: session.running,
    revealed: session.revealed,
    broadcast: session.broadcast,
    name: p.name,
    k: p.k,
    autonomy: p.autonomy,
    autonomyLevels: AUTONOMY,
    score: composite(p),
    pending: pend,
    feed: p.feed.slice(0, 12),
    decisions: p.decisions,
    band: session.revealed ? bandFor(composite(p)) : null,
    rank: session.revealed ? rankOf(p) : null,
    fieldSize: participants.size
  };
}

function roster() {
  return [...participants.values()]
    .map(p => ({
      name: p.name,
      score: composite(p),
      k: p.k,
      autonomy: p.autonomy,
      answered: p.decisions.filter(d => d.optionId !== 'none').length,
      missed: p.decisions.filter(d => d.optionId === 'none').length,
      openCount: Object.keys(p.pending).length,
      online: p.online
    }))
    .sort((a, b) => b.score - a.score);
}

function rankOf(p) {
  const r = roster();
  return r.findIndex(x => x.name === p.name) + 1;
}

function instructorView() {
  const r = roster();
  const avg = r.length ? Math.round(r.reduce((s, x) => s + x.score, 0) / r.length) : 0;
  const open = [...participants.values()].reduce((s, p) => s + Object.keys(p.pending).length, 0);
  return {
    t: 'state',
    role: 'instructor',
    company: COMPANY,
    clock: session.remaining,
    running: session.running,
    revealed: session.revealed,
    broadcast: session.broadcast,
    catalog: EVENTS.map(e => ({ id: e.id, button: e.button, sev: e.sev, tag: e.tag, title: e.title, seconds: e.seconds })),
    roster: r,
    avgScore: avg,
    openDecisions: open,
    count: r.length,
    onlineCount: r.filter(x => x.online).length,
    log: session.log.slice(0, 25)
  };
}

function broadcastAll() {
  for (const ws of sockets) {
    if (ws.readyState !== 1) continue;
    if (ws.role === 'instructor' || ws.role === 'screen') ws.send(JSON.stringify(instructorView()));
    else {
      const p = participants.get(ws.pkey);
      if (p) ws.send(JSON.stringify(participantView(p)));
    }
  }
}

// ---------------------------------------------------------------- loop

let driftCounter = 0;
setInterval(() => {
  if (session.running && session.remaining > 0) {
    session.remaining -= 1;
    if (session.remaining === 0) session.running = false;
  }
  // deadline sweep
  let changed = false;
  for (const p of participants.values()) {
    for (const [id, meta] of Object.entries(p.pending)) {
      if (now() >= meta.deadline) { resolve(p, id, null, true); changed = true; }
    }
  }
  // ambient drift while incidents sit open
  driftCounter++;
  if (session.running && driftCounter % 15 === 0) {
    for (const p of participants.values()) {
      const open = Object.keys(p.pending).length;
      if (!open) continue;
      const risk = 1 + AUTONOMY[p.autonomy].aiRisk;
      applyDeltas(p, { mkt: -0.6 * open * risk, trust: -0.3 * open, cash: -0.4 * open }, null, false);
      changed = true;
    }
  }
  if (changed || session.remaining % 2 === 0) broadcastAll();
  else send('instructor', instructorView());
}, 1000);

// ------------------------------------------------------------- sockets

wss.on('connection', ws => {
  sockets.add(ws);
  ws.isAlive = true;
  ws.on('pong', () => { ws.isAlive = true; });

  ws.on('message', raw => {
    let m;
    try { m = JSON.parse(raw); } catch { return; }

    if (m.t === 'join') {
      if (m.role === 'instructor' || m.role === 'screen') {
        if (m.key !== INSTRUCTOR_KEY) { ws.send(JSON.stringify({ t: 'denied' })); return; }
        ws.role = m.role;
        ws.send(JSON.stringify(instructorView()));
        return;
      }
      const name = String(m.name || '').trim().slice(0, 28);
      if (!name) return;
      const key = name.toLowerCase();
      if (!participants.has(key)) {
        const p = newParticipant(name);
        pushFeed(p, 3, 'Command deck online. You have the seat.');
        participants.set(key, p);
      }
      const p = participants.get(key);
      p.online = true;
      ws.role = 'participant';
      ws.pkey = key;
      ws.send(JSON.stringify(participantView(p)));
      send('instructor', instructorView());
      return;
    }

    if (ws.role === 'participant') {
      const p = participants.get(ws.pkey);
      if (!p) return;
      if (m.t === 'decide') { resolve(p, m.eventId, m.optionId, false); broadcastAll(); }
      if (m.t === 'autonomy') {
        const lvl = clamp(parseInt(m.level, 10) || 0, 0, 3);
        p.autonomy = lvl;
        applyDeltas(p, { ops: AUTONOMY[lvl].ops }, null, false);
        pushFeed(p, 3, `Autonomy set to level ${lvl}: ${AUTONOMY[lvl].name}`);
        ws.send(JSON.stringify(participantView(p)));
        send('instructor', instructorView());
      }
      return;
    }

    if (ws.role !== 'instructor') return;

    switch (m.t) {
      case 'fire': fireEvent(m.eventId); break;
      case 'start': session.running = true; session.log.unshift({ at: now(), text: 'Clock started' }); break;
      case 'pause': session.running = false; session.log.unshift({ at: now(), text: 'Clock paused' }); break;
      case 'setclock':
        session.durationSec = clamp(parseInt(m.minutes, 10) || 60, 5, 180) * 60;
        session.remaining = session.durationSec;
        break;
      case 'broadcast':
        session.broadcast = { text: String(m.text || '').slice(0, 240), at: now() };
        session.log.unshift({ at: now(), text: `Broadcast: ${session.broadcast.text}` });
        break;
      case 'clearbroadcast': session.broadcast = null; break;
      case 'reveal': session.revealed = true; session.log.unshift({ at: now(), text: 'Results revealed' }); break;
      case 'hide': session.revealed = false; break;
      case 'reset':
        participants.clear();
        session.running = false;
        session.remaining = session.durationSec;
        session.revealed = false;
        session.broadcast = null;
        session.log = [{ at: now(), text: 'Session reset' }];
        break;
    }
    broadcastAll();
  });

  ws.on('close', () => {
    sockets.delete(ws);
    if (ws.role === 'participant') {
      const p = participants.get(ws.pkey);
      if (p) p.online = false;
    }
  });
});

setInterval(() => {
  for (const ws of sockets) {
    if (ws.isAlive === false) { ws.terminate(); sockets.delete(ws); continue; }
    ws.isAlive = false;
    try { ws.ping(); } catch {}
  }
}, 30000);

// ---------------------------------------------------------------- export

app.get('/export.csv', (req, res) => {
  if (req.query.key !== INSTRUCTOR_KEY) return res.status(403).send('Key required');
  const rows = [['Name', 'Score', 'Band', 'Market', 'Trust', 'Regulator', 'Ops', 'CashDays', 'Autonomy', 'Answered', 'Missed', 'AvgSeconds']];
  for (const p of participants.values()) {
    const s = composite(p);
    const answered = p.decisions.filter(d => d.optionId !== 'none');
    const avg = answered.length ? Math.round(answered.reduce((a, d) => a + d.seconds, 0) / answered.length) : '';
    rows.push([p.name, s, bandFor(s).band, p.k.mkt, p.k.trust, p.k.reg, p.k.ops, p.k.cash,
      AUTONOMY[p.autonomy].name, answered.length, p.decisions.length - answered.length, avg]);
  }
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="arcline-lab-results.csv"');
  res.send(rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n'));
});

app.get('/health', (_, res) => res.json({ ok: true, players: participants.size }));

server.listen(PORT, () => {
  console.log(`Arcline Crisis Command Lab on :${PORT}`);
  console.log(`Instructor key: ${INSTRUCTOR_KEY}`);
});
