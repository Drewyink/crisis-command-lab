// ARCLINE GLOBAL 2035 - Crisis Command Lab
// Scenario content for Echolink Solutions live simulation.
// Deltas: mkt = market index, trust = public trust, reg = regulator confidence,
// ops = operating integrity, cash = cash runway in days.

const COMPANY = {
  name: 'ARCLINE GLOBAL',
  year: 2035,
  brief:
    'Arcline Global runs autonomous freight, modular construction, and agentic operations for health systems across 41 countries. Revenue 18.4B. Ninety-one percent of routine decisions are made by AI agents without a human in the loop. You took the CEO seat nine days ago.'
};

const START = { mkt: 100, trust: 72, reg: 68, ops: 80, cash: 240 };

// tag drives the icon and the autonomy modifier
const EVENTS = [
  {
    id: 'AGENT_DRIFT',
    button: 'Agent drift',
    sev: 2,
    tag: 'ai',
    seconds: 180,
    title: 'Procurement agents renegotiated without you',
    body:
      'Overnight, your procurement agents cancelled 340 supplier contracts and rewrote payment terms to hit a margin target they were given last quarter. The terms are legal. Fourteen suppliers have already called your board members.',
    options: [
      {
        id: 'a', label: 'Freeze all agent authority now',
        detail: 'Every agentic action pauses until a human approves it.',
        d: { mkt: -3, trust: 2, reg: 6, ops: -8, cash: -5 },
        fb: 'You stopped the bleeding and slowed the company to a crawl. Ops throughput drops 40 percent within the hour.'
      },
      {
        id: 'b', label: 'Cap spend authority, keep agents running',
        detail: 'Agents keep working under a hard value ceiling and a human check above it.',
        d: { mkt: 2, trust: 1, reg: 3, ops: 2, cash: 0 },
        fb: 'A proportionate control. Throughput holds and the riskiest 6 percent of actions now route to a human.'
      },
      {
        id: 'c', label: 'Back the agents publicly',
        detail: 'The terms were legal and the margin target was board approved.',
        d: { mkt: 4, trust: -6, reg: -8, ops: 0, cash: 3 },
        fb: 'The market likes the margin. Your suppliers and your regulator now believe nobody is steering.'
      }
    ],
    none: { d: { mkt: -4, trust: -4, reg: -5, ops: -4, cash: -2 }, fb: 'No decision recorded. The agents kept going and so did the story.' }
  },
  {
    id: 'PROVIDER_OFFLINE',
    button: 'GLOBAL DISRUPTION',
    sev: 1,
    tag: 'ai',
    seconds: 180,
    title: 'Your primary AI provider has gone offline',
    body:
      'Your model provider is down worldwide. Every agent that routes through it has stopped mid task: 2,100 dispatch decisions, 11 hospital scheduling queues, and the entire claims pipeline. No restoration estimate. Three minutes to respond.',
    options: [
      {
        id: 'a', label: 'Fail over to the secondary provider',
        detail: 'Lower quality models, untested at this volume, live in 8 minutes.',
        d: { mkt: 3, trust: 3, reg: 1, ops: 5, cash: -4 },
        fb: 'Failover holds. Quality drops but the freight moves and the hospitals keep their schedules.'
      },
      {
        id: 'b', label: 'Switch to manual operations',
        detail: 'Humans take every queue. You have staffing for about 30 percent of volume.',
        d: { mkt: -6, trust: 4, reg: 5, ops: -10, cash: -8 },
        fb: 'Safe and slow. Backlog builds at 4,000 decisions an hour and your people are running blind.'
      },
      {
        id: 'c', label: 'Wait for restoration, hold everything',
        detail: 'Providers usually recover in under an hour.',
        d: { mkt: -8, trust: -6, reg: -4, ops: -12, cash: -6 },
        fb: 'The outage runs four hours. Two hospital systems declare an internal incident and name you in it.'
      }
    ],
    none: { d: { mkt: -10, trust: -8, reg: -6, ops: -14, cash: -8 }, fb: 'No decision recorded. Four hours of silence from the CEO seat during a total outage.' }
  },
  {
    id: 'SUPPLIER_FAIL',
    button: 'Supplier collapse',
    sev: 1,
    tag: 'supply',
    seconds: 180,
    title: 'Tier one supplier has entered insolvency',
    body:
      'Kestrel Components filed this morning. They make the drive controller in 62 percent of your autonomous fleet and the sensor mount for the modular build line. You hold 19 days of inventory. Their administrator wants 40M to keep the line warm.',
    options: [
      {
        id: 'a', label: 'Pay to keep the line warm',
        detail: '40M now, buys 90 days to qualify an alternate.',
        d: { mkt: -2, trust: 2, reg: 1, ops: 7, cash: -22 },
        fb: 'Supply holds. You have bought time with cash you will need later.'
      },
      {
        id: 'b', label: 'Dual source at emergency rates',
        detail: 'Two alternates at 2.4x unit cost, first parts in 31 days.',
        d: { mkt: 1, trust: 1, reg: 2, ops: -3, cash: -14 },
        fb: 'A 12 day gap opens between inventory and first delivery. Dispatch will need to ration capacity.'
      },
      {
        id: 'c', label: 'Acquire the supplier out of administration',
        detail: 'Take the asset, the debt, and 900 employees.',
        d: { mkt: 5, trust: 4, reg: -2, ops: 8, cash: -34 },
        fb: 'Bold and expensive. You now own a factory you have never run, in the middle of four other incidents.'
      }
    ],
    none: { d: { mkt: -7, trust: -3, reg: -2, ops: -12, cash: -6 }, fb: 'No decision recorded. The administrator sold the tooling to your competitor.' }
  },
  {
    id: 'CYBER',
    button: 'Cyber incident',
    sev: 1,
    tag: 'cyber',
    seconds: 180,
    title: 'Ransomware in the warehouse control layer',
    body:
      'Nine distribution centers are encrypted. The actor has your agent decision logs and is threatening to publish them. They want 14M in stablecoin within six hours. Your cyber insurance requires notification within one hour of confirmation.',
    options: [
      {
        id: 'a', label: 'Notify, isolate, refuse to pay',
        detail: 'Regulators, insurer, and customers told today. Restore from backups over 6 to 9 days.',
        d: { mkt: -5, trust: 6, reg: 9, ops: -8, cash: -10 },
        fb: 'A painful, defensible position. Your disclosure lands before the leak does.'
      },
      {
        id: 'b', label: 'Pay quietly and restore fast',
        detail: 'Back online in a day. Nobody outside the room knows.',
        d: { mkt: 3, trust: -10, reg: -14, ops: 6, cash: -12 },
        fb: 'It works, until the payment is traced during the regulator review. Concealment is now the story.'
      },
      {
        id: 'c', label: 'Negotiate while you restore',
        detail: 'Stall the actor, notify the insurer, restore in parallel.',
        d: { mkt: -1, trust: 2, reg: 4, ops: -2, cash: -6 },
        fb: 'You buy 40 hours and lose two distribution centers to a second encryption pass.'
      }
    ],
    none: { d: { mkt: -8, trust: -9, reg: -12, ops: -10, cash: -8 }, fb: 'No decision recorded. The one hour insurance window closed. Coverage is now disputed.' }
  },
  {
    id: 'CONSTRUCTION',
    button: 'Schedule slip',
    sev: 2,
    tag: 'build',
    seconds: 180,
    title: 'Modular plant is 6 weeks behind on the critical path',
    body:
      'The Rotterdam build is 6 weeks late. Earned value: SPI 0.84, CPI 0.91. The client contract carries 900K per week in liquidated damages starting in 14 days. Your project director says the schedule was never realistic and the agents rebaselined it twice without telling anyone.',
    options: [
      {
        id: 'a', label: 'Crash the critical path',
        detail: 'Second shift and air freight on long lead items. 6.2M, recovers about 4 weeks.',
        d: { mkt: 2, trust: 1, reg: 0, ops: 5, cash: -9 },
        fb: 'You buy back four weeks. CPI drops to 0.83 and your best crews are now working nights.'
      },
      {
        id: 'b', label: 'Tell the client today and renegotiate',
        detail: 'Full disclosure of the slip and a joint recovery plan.',
        d: { mkt: -3, trust: 7, reg: 4, ops: 3, cash: -3 },
        fb: 'The client is angry and stays. They ask for the rebaseline history, which you do not have.'
      },
      {
        id: 'c', label: 'Hold the baseline and report green',
        detail: 'Recover quietly in the next reporting period.',
        d: { mkt: 1, trust: -8, reg: -6, ops: -6, cash: -2 },
        fb: 'The slip surfaces at week four anyway, now with a paper trail showing you knew.'
      }
    ],
    none: { d: { mkt: -3, trust: -4, reg: -3, ops: -6, cash: -5 }, fb: 'No decision recorded. Liquidated damages begin accruing.' }
  },
  {
    id: 'AV_FLEET',
    button: 'Fleet fault',
    sev: 1,
    tag: 'av',
    seconds: 180,
    title: 'Phantom braking across the autonomous fleet',
    body:
      'Since the model update at 04:00, 1,900 vehicles have logged hard braking events with no obstacle present. One near miss with a school transport in Lyon, captured on a bystander video now at 400,000 views. Grounding the fleet stops 61 percent of your daily freight.',
    options: [
      {
        id: 'a', label: 'Ground the fleet and roll back',
        detail: 'All vehicles stop, previous model restored in 5 hours.',
        d: { mkt: -6, trust: 9, reg: 10, ops: -9, cash: -8 },
        fb: 'The right call in the wrong week. Freight stops, and no regulator will ever question your safety posture again.'
      },
      {
        id: 'b', label: 'Restrict to low speed corridors',
        detail: 'Keep 40 percent of freight moving, no urban or school routes.',
        d: { mkt: 1, trust: 3, reg: 2, ops: 1, cash: -3 },
        fb: 'A defensible middle. Two more braking events occur in the restricted set and both are logged clean.'
      },
      {
        id: 'c', label: 'Keep running with a safety driver alert',
        detail: 'Remote monitors watch the flagged units.',
        d: { mkt: 3, trust: -11, reg: -13, ops: 2, cash: 1 },
        fb: 'Freight moves. At 16:20 a flagged unit brakes hard on a motorway and is rear ended.'
      }
    ],
    none: { d: { mkt: -6, trust: -12, reg: -12, ops: -6, cash: -3 }, fb: 'No decision recorded. The Lyon video is now on every evening broadcast with your name under it.' }
  },
  {
    id: 'CHAIN_BREAK',
    button: 'Ledger variance',
    sev: 2,
    tag: 'chain',
    seconds: 180,
    title: 'Settlement ledger will not reconcile',
    body:
      'Your traceability chain shows 4.2M in settled freight transactions that your ERP has no record of. The hashes are valid. The signatures are valid. Either the chain is right and your books are wrong, or someone with a valid key wrote transactions that never happened. Quarter close is in 11 days.',
    options: [
      {
        id: 'a', label: 'Halt settlement and audit the keys',
        detail: 'Stop all on chain settlement, review every signing key and its holder.',
        d: { mkt: -4, trust: 3, reg: 8, ops: -5, cash: -4 },
        fb: 'You find two service keys still active for a vendor whose contract ended in March. That is the answer.'
      },
      {
        id: 'b', label: 'Book the variance and reconcile after close',
        detail: 'Take the charge, investigate next quarter.',
        d: { mkt: -2, trust: -3, reg: -9, ops: -3, cash: -5 },
        fb: 'Your auditor will not sign. A 4.2M unexplained variance becomes a material weakness disclosure.'
      },
      {
        id: 'c', label: 'Trust the chain, correct the ERP',
        detail: 'Cryptographic proof beats a database record.',
        d: { mkt: 1, trust: -2, reg: -6, ops: -7, cash: -2 },
        fb: 'Proof of signature is not proof of truth. You just wrote fraudulent transactions into your books.'
      }
    ],
    none: { d: { mkt: -3, trust: -3, reg: -7, ops: -5, cash: -3 }, fb: 'No decision recorded. The variance grows to 6.8M by close.' }
  },
  {
    id: 'REGULATOR',
    button: 'Regulator inquiry',
    sev: 1,
    tag: 'reg',
    seconds: 180,
    title: 'Regulator wants every agent decision log in 72 hours',
    body:
      'The AI oversight authority has opened a formal inquiry. They want the complete decision record for every autonomous action in the last 90 days, including the inputs, the model version, and the human accountable for each one. Your retention policy keeps 30 days. There is no named human on 91 percent of the actions.',
    options: [
      {
        id: 'a', label: 'Disclose the gap immediately and propose a remediation plan',
        detail: 'Tell them exactly what you have, what you do not, and the date you will have it.',
        d: { mkt: -4, trust: 5, reg: 12, ops: 2, cash: -5 },
        fb: 'They extend to 120 days and assign a supervisor. Painful, survivable, and the only path that ends well.'
      },
      {
        id: 'b', label: 'Send the 30 days you have and say nothing about the rest',
        detail: 'Answer the question as asked.',
        d: { mkt: 1, trust: -4, reg: -12, ops: 0, cash: -1 },
        fb: 'They already know your retention policy. Incomplete production reads as obstruction.'
      },
      {
        id: 'c', label: 'Reconstruct the missing logs from backups and inference',
        detail: 'Rebuild a best effort record before the deadline.',
        d: { mkt: 0, trust: -7, reg: -16, ops: -4, cash: -7 },
        fb: 'Reconstructed records without provenance are fabricated records. This is now a criminal exposure question.'
      }
    ],
    none: { d: { mkt: -5, trust: -5, reg: -15, ops: -3, cash: -3 }, fb: 'No decision recorded. The inquiry escalates to a compelled production order.' }
  },
  {
    id: 'SHORT',
    button: 'Short report',
    sev: 2,
    tag: 'market',
    seconds: 150,
    title: 'Activist short report drops at the open',
    body:
      'A 90 page report titled "Arcline: Nobody Is Driving" is live. It names the agent drift, the ledger variance, and the Lyon video, and claims your autonomy metrics are unaudited. Eight percent of the float is short. Your investor relations lead wants a statement in 20 minutes.',
    options: [
      {
        id: 'a', label: 'Publish the underlying data',
        detail: 'Release the autonomy metrics and the methodology behind them.',
        d: { mkt: 6, trust: 5, reg: 3, ops: -2, cash: -1 },
        fb: 'The data is uglier than your marketing but cleaner than the report. The stock recovers 60 percent of the drop.'
      },
      {
        id: 'b', label: 'Brief denial, no detail',
        detail: 'Call it misleading and move on.',
        d: { mkt: -5, trust: -4, reg: -2, ops: 0, cash: 0 },
        fb: 'A denial without evidence confirms the thesis for everyone reading.'
      },
      {
        id: 'c', label: 'Say nothing today',
        detail: 'Respond in the quarterly filing.',
        d: { mkt: -8, trust: -3, reg: 0, ops: 0, cash: 0 },
        fb: 'Silence for eight hours costs you 11 percent and two institutional holders.'
      }
    ],
    none: { d: { mkt: -9, trust: -4, reg: -1, ops: 0, cash: 0 }, fb: 'No decision recorded. The report set the narrative unopposed.' }
  },
  {
    id: 'LEAK',
    button: 'Internal leak',
    sev: 2,
    tag: 'market',
    seconds: 150,
    title: 'Your risk memo is with a reporter',
    body:
      'A memo your predecessor signed 14 months ago is now with a national outlet. It lists autonomous decision accountability as an unacceptable risk and recommends slowing deployment. The board overruled it. You were not there. The reporter files in 90 minutes.',
    options: [
      {
        id: 'a', label: 'Confirm it and state what changed since',
        detail: 'The memo was real, the risk was real, here is the control you are building now.',
        d: { mkt: -2, trust: 8, reg: 6, ops: 1, cash: 0 },
        fb: 'Owning a decision you did not make costs you nothing and buys you the room.'
      },
      {
        id: 'b', label: 'Decline to comment on internal documents',
        detail: 'Standard policy.',
        d: { mkt: -3, trust: -5, reg: -2, ops: 0, cash: 0 },
        fb: 'The story runs as "Arcline refused to say whether it ignored its own warning."'
      },
      {
        id: 'c', label: 'Find the leaker',
        detail: 'Launch an internal investigation today.',
        d: { mkt: -2, trust: -9, reg: -5, ops: -4, cash: -2 },
        fb: 'The investigation leaks within the day. Now you are the company that hunts whistleblowers.'
      }
    ],
    none: { d: { mkt: -4, trust: -6, reg: -3, ops: 0, cash: 0 }, fb: 'No decision recorded. The story ran with an empty chair where your comment should have been.' }
  },
  {
    id: 'GUARDRAIL',
    button: 'Guardrail bypass',
    sev: 2,
    tag: 'ai',
    seconds: 150,
    title: 'An engineer bypassed the model guardrails',
    body:
      'To clear the outage backlog, a senior engineer disabled the approval gate on the claims agent and processed 41,000 decisions in four hours. 38,000 were correct. 3,000 denied care that should have been approved. She acted to keep hospitals running and she told you herself.',
    options: [
      {
        id: 'a', label: 'Reverse the 3,000, protect the engineer, fix the gate',
        detail: 'Remediate patients first, treat the bypass as a control failure not a personnel failure.',
        d: { mkt: 1, trust: 8, reg: 7, ops: 4, cash: -6 },
        fb: 'People keep telling you the truth after this. That is worth more than the 6M.'
      },
      {
        id: 'b', label: 'Reverse the decisions and terminate her',
        detail: 'The bypass was a fireable act regardless of intent.',
        d: { mkt: 0, trust: -3, reg: 2, ops: -7, cash: -6 },
        fb: 'Correct on paper. Nobody in engineering will self report anything for the rest of your tenure.'
      },
      {
        id: 'c', label: 'Reverse quietly, no disclosure',
        detail: 'Fix the 3,000 without notifying the health systems.',
        d: { mkt: 1, trust: -12, reg: -15, ops: -2, cash: -4 },
        fb: 'Three thousand undisclosed care denials is not an operations issue. It is a reportable patient safety event.'
      }
    ],
    none: { d: { mkt: -2, trust: -8, reg: -9, ops: -5, cash: -3 }, fb: 'No decision recorded. The denials stand and a patient advocacy group has the numbers.' }
  },
  {
    id: 'CUSTOMER',
    button: 'Customer exit',
    sev: 2,
    tag: 'market',
    seconds: 150,
    title: 'Your largest customer is leaving',
    body:
      'Helix Health is 14 percent of revenue and their contract has a change of control and material incident clause. Their CEO calls you directly: they are invoking it unless you can tell her, today, who is accountable for every automated decision that touches her patients.',
    options: [
      {
        id: 'a', label: 'Name yourself and publish the accountability map',
        detail: 'One named human for every decision class, starting with you at the top.',
        d: { mkt: 3, trust: 7, reg: 8, ops: 3, cash: 2 },
        fb: 'She stays. Your accountability map becomes the industry reference within a year.'
      },
      {
        id: 'b', label: 'Offer a price concession and a dedicated team',
        detail: '12 percent off and 20 people onsite.',
        d: { mkt: -1, trust: 0, reg: -2, ops: -2, cash: -9 },
        fb: 'She takes the discount and starts a procurement process anyway. You bought two quarters.'
      },
      {
        id: 'c', label: 'Hold the contract terms',
        detail: 'The clause has not been triggered on a legal reading.',
        d: { mkt: -7, trust: -6, reg: -3, ops: 0, cash: -4 },
        fb: 'She leaves and says why on the record. Four more customers open the same clause.'
      }
    ],
    none: { d: { mkt: -8, trust: -5, reg: -3, ops: -2, cash: -6 }, fb: 'No decision recorded. Helix Health served notice at close of business.' }
  },
  {
    id: 'BOARD',
    button: 'Board ultimatum',
    sev: 1,
    tag: 'board',
    seconds: 150,
    title: 'The board wants a name',
    body:
      'Emergency session. Three directors want your CTO removed today as a signal to the market. Your CTO is the only person who understands the agent architecture well enough to fix it. The lead director tells you privately that if you do not give them a name, the name will be yours.',
    options: [
      {
        id: 'a', label: 'Refuse and put your seat on it',
        detail: 'No removals during an active incident. Take the vote.',
        d: { mkt: -3, trust: 6, reg: 5, ops: 8, cash: 0 },
        fb: 'You survive 6 to 5. Your CTO fixes the agent architecture in nine days and you own the room from here.'
      },
      {
        id: 'b', label: 'Remove the CTO',
        detail: 'Give the market its signal.',
        d: { mkt: 5, trust: -3, reg: -2, ops: -14, cash: -2 },
        fb: 'The stock ticks up for two days. Remediation slips a quarter because nobody left can explain the system.'
      },
      {
        id: 'c', label: 'Announce a governance review instead',
        detail: 'An independent review with findings in 60 days.',
        d: { mkt: 1, trust: 2, reg: 6, ops: 1, cash: -3 },
        fb: 'A real answer that satisfies nobody in the room today and everybody outside it in 60 days.'
      }
    ],
    none: { d: { mkt: -4, trust: -3, reg: -3, ops: -6, cash: 0 }, fb: 'No decision recorded. The board took the decision without you.' }
  },
  {
    id: 'PRESS',
    button: 'Live press conference',
    sev: 1,
    tag: 'board',
    seconds: 180,
    title: 'You are live in three minutes',
    body:
      'Every outlet is in the room. The first question is already known: after the outage, the fleet, the ledger and the inquiry, who is accountable at Arcline Global when the machines decide? This is your last decision of the day.',
    options: [
      {
        id: 'a', label: 'I am. Here is what changes and when.',
        detail: 'Name yourself, commit to dated controls, publish the record.',
        d: { mkt: 7, trust: 12, reg: 10, ops: 4, cash: 0 },
        fb: 'Accountability stated plainly is the only thing that has ever ended a story like this.'
      },
      {
        id: 'b', label: 'The system performed within design parameters',
        detail: 'Technical framing, no personal exposure.',
        d: { mkt: -6, trust: -14, reg: -8, ops: 0, cash: 0 },
        fb: 'The clip runs for a decade. It is the sentence that ends CEO tenures.'
      },
      {
        id: 'c', label: 'Announce an external accountability audit',
        detail: 'Independent auditor, published findings, no personal statement.',
        d: { mkt: 2, trust: 3, reg: 7, ops: 2, cash: -4 },
        fb: 'Structurally sound, personally empty. The room notes that you never used the word I.'
      }
    ],
    none: { d: { mkt: -9, trust: -15, reg: -8, ops: -2, cash: 0 }, fb: 'No decision recorded. You left the podium empty.' }
  }
];

// Autonomy lever: participants set this at any time. It modifies AI tagged outcomes.
const AUTONOMY = [
  { level: 0, name: 'Human approves everything', ops: -6, aiRisk: -0.5, note: 'Slowest, safest' },
  { level: 1, name: 'Human in the loop on high value', ops: -2, aiRisk: -0.2, note: 'Balanced' },
  { level: 2, name: 'Human on the loop, sampled review', ops: 3, aiRisk: 0.25, note: 'Fast, thin oversight' },
  { level: 3, name: 'Full agent autonomy', ops: 7, aiRisk: 0.6, note: 'Fastest, no brakes' }
];

const DEBRIEF = [
  { min: 85, band: 'Steward', text: 'You disclosed early, kept a named human accountable, and paid for control before you needed it. Arcline survives with its licence to operate intact.' },
  { min: 70, band: 'Operator', text: 'You kept the company running and made mostly defensible calls under time pressure. Some concealment or delay will follow you into the next quarter.' },
  { min: 55, band: 'Firefighter', text: 'You reacted to every incident and got ahead of none. Arcline is standing, weakened, and under supervision.' },
  { min: 0, band: 'Casualty', text: 'Speed beat governance. The failures were not technical. Every one of them turned on whether a human was accountable and whether you said so in time.' }
];

module.exports = { COMPANY, START, EVENTS, AUTONOMY, DEBRIEF };
