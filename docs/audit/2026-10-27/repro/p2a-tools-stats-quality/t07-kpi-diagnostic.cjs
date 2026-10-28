// KPI Diagnostic: how little evidence produces a "Most likely" cause, and what it hands to 5 Whys / Action Tracker.
const { tool, check, note, text } = require('./lib.cjs');
const run = (lang, answers) => {
  const w = tool(`${lang === 'en' ? '' : `/${lang}`}/tools/kpi-diagnostic/`, {});
  const form = w.document.querySelector('[data-diagnostic]');
  const sets = [...form.querySelectorAll('fieldset.statement')];
  sets.forEach((set, i) => { const inputs = set.querySelectorAll('input[type=radio]'); const pick = inputs[answers[i]]; pick.checked = true; });
  form.dispatchEvent(new w.Event('submit', { bubbles: true, cancelable: true }));
  const causes = sets.map((s) => s.querySelector('input').dataset.cause);
  return { w, causes, head: text(w, '[data-result] .result-head'), all: text(w, '[data-result]'), links: [...w.document.querySelectorAll('[data-result] a')].map((a) => decodeURIComponent(a.href)) };
};
// statements order: s1 clarity, s2 capacity, s3 design, s4 skill, s5 ownership, s6 clarity, s7 design, s8 capacity, s9 ownership, s10 skill
// Case A: clarity "Mostly"+"Partly" (=3), every other statement split Partly/Not true (=1 each)
const A = run('en', [2, 1, 1, 1, 1, 1, 0, 0, 0, 0]);
note('causes per statement', A.causes);
note('A head', A.head);
check('A: a 2-point margin from two self-rated statements is NOT presented as "Most likely: Clarity"', false, /Most likely/.test(A.head));
note('A: caveat about self-assessment present?', /self|opinion|hypothes|check it|verify|not proof|guess/i.test(A.all));
note('A: 5 Whys / tracker links', A.links.filter((l) => /five-whys|action-tracker/.test(l)).map((l) => l.slice(l.indexOf('?'), l.indexOf('?') + 220)));
// Case B: every answer "Fully true" -> all 6 -> no single cause
const B = run('en', Array(10).fill(3));
note('B all fully true', B.head);
// Case C: DE and SQ wording of the conclusion
note('DE head', run('de', [2, 1, 1, 1, 1, 1, 0, 0, 0, 0]).head);
note('SQ head', run('sq', [2, 1, 1, 1, 1, 1, 0, 0, 0, 0]).head);
