// The long German compounds in the titles of the sources, with the places they break. The text of an issue or a
// volume lists its sources in a narrow column, and on a phone a word of 19 letters or more is wider than the line:
// with no place of its own to break, the browser would split it anywhere ("Betriebsverfassungsgeset/z"). A soft
// hyphen at each part of the compound lets it break there, with a hyphen, in every browser, whatever its
// dictionaries. The printed pages keep the titles as they are: their column holds them.
// tests/title-fit.test.cjs checks that every word this long in a source title is listed here.
export const LONG = 19;

const COMPOUNDS = [
  "Arbeits·schutz·gesetz",
  "Beschäftigten·größen·klassen",
  "Betriebs·verfassungs·gesetz",
  "Fachkräfte·engpass·analyse",
  "Unternehmens·strategie",
];

const BREAKS = new Map(COMPOUNDS.map((word) => [word.replaceAll("·", ""), word.replaceAll("·", "­")]));

export const longWords = (text) => String(text || "").match(new RegExp(`\\p{L}{${LONG},}`, "gu")) || [];

// {{ s.title | softHyphens }}
export const softHyphens = (text) => String(text ?? "").replace(new RegExp(`\\p{L}{${LONG},}`, "gu"), (word) => BREAKS.get(word) ?? word);

export const hasBreaks = (word) => BREAKS.has(word);
