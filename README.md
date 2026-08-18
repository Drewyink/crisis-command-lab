# Arcline Global 2035: Crisis Command Lab

A live, instructor driven crisis simulation for conference stages and workshop rooms, built for Echolink Solutions.

Every attendee becomes CEO of Arcline Global, a 2035 company running autonomous freight, modular construction, and agentic operations for health systems in 41 countries. Ninety one percent of routine decisions are made by AI agents with no human in the loop. They have 60 minutes. You control what happens to them from the instructor dashboard.

## The three screens

| Screen | Address | Who uses it |
| --- | --- | --- |
| Command deck | `/` | Every attendee, on their phone |
| Instructor control | `/instructor` | You, on a laptop or phone |
| Stage screen | `/screen` | The projector behind you |
| Solo file | `public/solo.html` | One person, no server needed |

The instructor and stage screens ask for the instructor key. The command deck asks only for a name.

## The single file version

`public/solo.html` is the whole simulation in one HTML file. Double click it, or email it, or drop it on any static host. No server, no install, nothing to configure.

It runs the same 14 injects on an automatic run sheet so one person can play the full day alone, with a facilitator panel to fire injects manually, pause the clock, or reveal results early. Choose a 60 minute day or a 20 minute express version at the start.

Use it to preview the experience before a conference, to demo the lab in a sales conversation, to leave with attendees afterward, or to run the exercise when you have no reliable venue wifi.

It is rebuilt from the scenario with `node build-solo.js`, so edits to `scenario.js` flow into both versions. Run that after any scenario change.

## Run it locally

```
npm install
npm start
```

Open http://localhost:3000 for the deck and http://localhost:3000/instructor for control. The default key is `echolink2035`.

Optional smoke test, with the server already running in another terminal:

```
node test.js
```

It joins two participants and an instructor, fires an event, submits decisions, and prints the roster and CSV.

## Deploy on Render

1. Push this folder to a Git repository.
2. New Web Service, Node environment.
3. Build command `npm install`, start command `npm start`.
4. Environment variable `INSTRUCTOR_KEY`, set it to something only you have.
5. Deploy. Render sets `PORT` automatically.

Give the room the base URL, or a QR code pointing at it. Nothing to install, nothing to log into.

## Running the session

**Before you start.** Open `/instructor` and `/screen` on the projector. Set the room to join and take a seat. Watch the seated count climb on the stage screen.

**Start the clock.** Press Start clock. The 60 minute countdown runs on every device.

**Fire injects.** Each button in the Injects panel pushes a full screen takeover to every attendee at once with a live countdown. Fired buttons dim so you can see what you have already used. Nothing fires on a timer, so the pace is always yours.

**The stage moment.** Ask the room how everyone is doing, then press GLOBAL DISRUPTION. Every screen goes to a SEV-1 takeover: the primary AI provider is offline, three minutes to respond. The stage screen shows the room's decision pips turn red, then green as people commit.

**Stack the pressure.** Fire a second inject while the first is still open. The deck shows how many incidents are waiting behind the current one and the standing decays while things sit unresolved. This is the lesson: crises do not queue politely.

**Message the room.** The text box pushes a line from the board onto every deck and the stage screen. Useful for improvised pressure: "Two directors just called me. They want a name."

**Close it.** Fire Live press conference last. When it resolves, press Reveal results. Every attendee sees their band, their rank, and a full record of every decision with its consequence. Download the CSV for follow up.

## Suggested run sheet for 60 minutes

| Clock | Inject |
| --- | --- |
| 00:00 | Start clock, set the scene |
| 04:00 | Agent drift |
| 12:00 | Supplier collapse, then Schedule slip |
| 20:00 | GLOBAL DISRUPTION, from the stage |
| 26:00 | Cyber incident, while the outage is still open |
| 32:00 | Fleet fault |
| 38:00 | Ledger variance and Regulator inquiry together |
| 45:00 | Short report, Internal leak, Guardrail bypass |
| 52:00 | Board ultimatum |
| 56:00 | Live press conference, then Reveal results |

Fourteen injects are available. You will not use all of them in 60 minutes, which is the point: the unused ones are your material for a different room.

## How scoring works

Five measures move with every decision: market index, public trust, regulator confidence, operating integrity, and cash runway in days. Company standing is a weighted composite, weighted toward market and trust.

Attendees also set an agent autonomy level from 0 to 3 at any time. Higher autonomy raises operating integrity and amplifies every loss on an AI incident. Nobody is told this outright. Most people set it to 3 early and discover the tradeoff during the outage.

Unresolved incidents drain standing every 15 seconds. Letting a window expire is always worse than a bad decision made on time.

Final bands: Steward, Operator, Firefighter, Casualty.

## Debrief questions that land

- Who set autonomy to 3 before the outage? What did it cost you?
- Everybody who paid the ransom, put your hand up. Now everybody whose regulator confidence is under 50.
- The ledger reconciled cryptographically and was still wrong. What does a valid signature actually prove?
- Look at your record. How many of your decisions were about technology, and how many were about who was accountable and when you said so?
- The winning move on nine of these fourteen injects was disclose early and name a human. Why is that so hard in the moment?

## Editing the scenario

All content lives in `scenario.js`: the company brief, starting values, and the 14 events with their options, deltas, and consequence text. Add an event by copying the shape of an existing one. The instructor dashboard picks up new events automatically, no other file needs changing.

To rebrand for a different audience, change `COMPANY` in `scenario.js` and the brand line in `public/index.html`. Then run `node build-solo.js` so the single file version picks up the change.

## The logo

One Echolink lockup per screen, no duplicates: the orange ES mark, ECHOLINK, and SOLUTIONS letterspaced beneath, in brand orange #E8641E.

It sits on the join screen of the deck, on the instructor login, and on the stage screen. On the instructor and stage screens the same element moves up into the header when the session opens, so it is always present and never doubled. The browser tab icon is the ES mark. Arcline stays the hero on the projector because the room is meant to believe in the company, with Echolink as the house presenting it.

The lockup is inline SVG, sized by width with `clamp()` so it scales with the screen and cannot clip on a narrow phone. That also keeps `solo.html` a genuine single file you can email.

To use the original artwork instead, replace the `<svg>...</svg>` inside `<div class="lockup" id="eslogo">` with `<img src="echolink.png" alt="Echolink Solutions" style="width:clamp(132px,42vw,178px);height:auto">` and put the file beside the HTML. Edit `solo.src.html`, not `public/solo.html`, then rerun `node build-solo.js`. Clean the cream background to transparent first. Keep the SVG if you plan to email the single file, since an image would have to travel with it.

## Phones and tablets

All four screens are built for handheld use.

- Deck: single column on a phone, three across on a tablet, with decision options side by side on wider screens. Touch targets are at least 48px, and the alarm and outcome panels clear the iPhone home bar.
- Instructor: header controls wrap to full width, injects go two across, the standings table scrolls sideways rather than squeezing, and every control is at least 46px tall so you can fire an inject from your hand on stage.
- Stage screen: on a tablet in portrait it stacks into one column, grows the clock, and enlarges the room pips. On a projector it stays two columns.
- Solo: the facilitator panel sits above the home bar and its injects go two across on small phones.

## Notes

- State is held in memory. A server restart clears the session, so avoid redeploying mid workshop.
- Attendees who join after an inject fires do not receive that inject. Seat everyone before the first one.
- Reset session clears every participant and score. Use it between cohorts.
- Results CSV is at `/export.csv?key=YOURKEY`.

Built by Echolink Solutions.
