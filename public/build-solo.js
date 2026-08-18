// Builds public/solo.html: a single self contained file with the scenario and
// the participant styles inlined. No server, no network, no dependencies.
const fs = require('fs');
const scenario = require('./scenario');
const deck = fs.readFileSync('public/index.html', 'utf8');
const style = deck.match(/<style>([\s\S]*?)<\/style>/)[1];
const out = fs.readFileSync('solo.src.html', 'utf8')
  .replace('__STYLE__', style)
  .replace('__SCENARIO__', JSON.stringify(scenario, null, 0));
fs.writeFileSync('public/solo.html', out);
console.log('public/solo.html written,', Math.round(out.length/1024), 'KB');
