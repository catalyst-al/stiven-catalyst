// Night Audit and Incomplete Control on their own examples (first visit): what the head numbers say.
const { tool, note, text } = require('./lib.cjs');
for (const slug of ['night-audit', 'incomplete-control', 'damage-control']) {
  const w = tool(`/tools/${slug}/`, {});
  note(`${slug} head`, text(w, '[data-results] .result-head, [data-results] .dl-stats').slice(0, 420));
  note(`${slug} example note visible`, !w.document.querySelector('.dl-example-note').hidden);
  note(`${slug} errors`, w.__errors.slice(0, 2));
}
