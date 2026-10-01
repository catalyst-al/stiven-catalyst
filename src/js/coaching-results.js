// Display only validated snapshots. Saved numbers are never recalculated by a language model.
window.CoachingResults = {
  html(snapshot, tx, escape, lang = 'en') {
    if (!window.CoachingCore.validSnapshot(snapshot)) return '';
    const E = escape, p = snapshot.payload;
    const n = v => new Intl.NumberFormat(lang === 'en' ? 'en-GB' : 'de-DE', { maximumFractionDigits: 4 }).format(v);
    const pct = v => new Intl.NumberFormat(lang === 'en' ? 'en-GB' : 'de-DE', { style: 'percent', maximumFractionDigits: 2 }).format(v);
    const paragraph = (key, value) => `<p><strong>${E(tx(key))}</strong><br>${E(value)}</p>`;
    const table = (keys, rows) => `<div class="coaching-table"><table><thead><tr>${keys.map(k => `<th scope="col">${E(tx(k))}</th>`).join('')}</tr></thead><tbody>${rows.map(row => `<tr>${row.map(v => `<td>${E(v)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
    // The moment the result was taken, as a reader writes it (01.10.2026, 08:49), not the stored ISO text.
    const when = (iso) => {
      const d = new Date(iso);
      if (Number.isNaN(d.getTime())) return String(iso ?? '');
      const pad = v => String(v).padStart(2, '0');
      const day = lang === 'en' ? `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` : `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}`;
      return `${day}, ${pad(d.getHours())}:${pad(d.getMinutes())}`;
    };
    const header = `<p>${E(snapshot.tool)} · ${E(tx('captured'))}: ${E(when(snapshot.captured))}</p>`;
    if (snapshot.tool === 'five-whys') return header + paragraph('situation', p.problem) + `<ol>${p.whys.map(v => `<li>${E(v)}</li>`).join('')}</ol>` + paragraph('hypothesis', p.hypothesis) + paragraph('action', p.action) + paragraph('owner', p.owner) + paragraph('due', p.due) + paragraph('verify', p.check);
    if (snapshot.tool === 'kpi-diagnostic') return header + paragraph('measure', p.kpi) + table(['category', 'score'], p.scores.map(r => [r.label, `${r.score}/6`])) + `<p>${E(tx('facts'))}: ${p.answers.map(a => n(a.score)).join(' · ')}</p>`;
    return header + paragraph('source', p.source) + `<p>${E(tx('total'))}: ${n(p.total)} ${E(p.unit)} · ${E(tx('skipped'))}: ${p.skipped}</p>` + paragraph('scope', [p.from, p.to, p.filter].filter(Boolean).join(' · ')) + table(['category', 'amount', 'share', 'cumulative'], p.items.map(r => [r.name, n(r.amount), pct(r.share), pct(r.cumulative)]));
  }
};
