# Stiven Catalyst: Brand Philosophy

## Core idea
**Stiven Catalyst exists to turn clearer thinking into better action.**

The mark is the circled point: the full stop of "Management without theatre.", a square in the accent blue, with a ring drawn round it by hand. The pages around it are quiet: dark neutrals, one blue accent, and colour that means something every time it appears. The name is "Stiven Catalyst", without "Coaching".

## Headline
**Management without theatre.**

Supporting line: **Ideas that move work forward.** The homepage opens with both: the headline says what the publication is about and how it speaks, the line under it says for whom.

## Brand line
**See clearly. Think differently. Act deliberately.**

The philosophy behind the work, on the About page.

## Meaning of the symbol
- **The point** is the full stop of the headline: said, done, no performance. It is exact, a square like the full stop of the display type, and it never moves.
- **The ring** is the pen mark a manager makes on a report: not a speech, a circle round the number that matters. It is drawn by hand, so it is not perfect, and it does not close.
- **Together** they read as the centre of the system and its first orbit (the four families turn round it), and as the C of Catalyst.

How it is drawn: one colour for the ring (the text colour of the theme), the accent blue for the point, flat, with no glow, no gradient and no shadow. In one colour the point takes the colour of the ring. The ring is always the same drawing, in two weights: the heavier for small sizes (`--mark-ring` in `src/css/01-foundation.css`, `src/favicon.svg`), the lighter for display sizes (`--mark-ring-display`, and the same line in `src/js/cosmos.js`). It is never redrawn, stretched or closed.

On the homepage the mark appears twice more. The full stop of the headline is the mark itself (`.hero-stop`, `--mark-ring-display`). And the centre of the system is the mark (`src/js/cosmos.js`): the point never moves, the ring is drawn round it once as the light comes up and again when it is tapped, and the families turn round it. There it is flat too; the soft light of the system begins outside the ring.

Where the site marks a place with something small, it is the point of the mark: a square, quiet at rest and in the accent where you are. The items of the menu carry it, and so do the essays button and the three cards of the homepage hero, each card's point in its own colour.

Beside the heading of every page, beside the title of every reflection and on the poster of the About page, the mark stands at the centre of a small system: three thin orbits and the four families as small planets in their own colours. Beside the headings and the reflections it is one picture (`src/media/stiven-catalyst-mark-hero.jpg`, made by `scripts/mark-hero.py`); on the poster it is drawn in the page itself, the ring is drawn round the point as the poster comes into view and the planets turn. In both the mark stays flat, and the soft light begins outside the ring.

The pictures a reader takes away carry the mark too. The card of a field note (`src/media/notes/`, `scripts/note-cards.mjs`) has it in the banner at its foot, at the centre of its system with the name beside it. The link previews (`src/media/social/`) have it beside the name on the cards of the tools and the roles, at the centre of the Tools card and of the homepage card (`scripts/social-cards.mjs`), and in the corner of the cards of the essays, the reflections and the writing pages (`scripts/page-cards.mjs`, from `src/favicon.svg`). `src/social.png` is the card of the site itself, the mark with the name and the motto (`scripts/social-default.mjs`).

The earlier mark was a hanging light bulb on a red-to-blue gradient, with the name "Stiven Catalyst Coaching". Its small light still marks the chosen topic of a list, the steps of Start here and the essays read in a series; these are replaced in a step that follows, and nothing new is drawn with it. A bulb is also the cover art of the publications (the magazine covers and their link previews, the podcast cover): that is the picture of those covers, not the mark. The light of Lumen is that planet's own and stays.

## Four pillars
1. **Clarity**: Understand before reacting.
2. **People**: Results are created by people inside real systems.
3. **Systems**: Make good performance repeatable.
4. **Change**: Turn insight into action and action into progress.

## Colour language
One accent, used sparingly. Hierarchy comes from typography, space and thin lines, not from colour. Atmosphere comes from photography, not from the interface.

| Role | Token | Where it may appear |
|---|---|---|
| Deep black / charcoal, with a hint of blue | `--paper`, `--paper-2` | Backgrounds. Discipline, seriousness, authority. |
| White and soft grey | `--ink`, `--muted`, `--line` | Text, borders, dividers. Clarity and breathing space. |
| **Electric blue: the one accent** | `--blue`, `--blue-soft` | Links, eyebrows, numbers, the selected filter or tab, focus, progress, the main button. Clarity and analysis. |
| Red: the signature | `--red` | Only a single word in the manifesto. Not in the mark. Never a button, a bar, a glow or a chart. |
| Gold | `--gold` | The Reflections, and the small lights that are left from the earlier mark (lists, Start here, a series) until they are replaced. Not in the mark. |
| State colours | `--ok`, `--warn`, `--danger` | Only inside tools, to report a result: right or wrong, better or worse, a check passed, a warning, an error. Never decoration. |

Rules:
- **No red-to-blue gradients on interface elements.** A highlight is solid blue, or blue into soft blue.
- **No coloured background glows** except a soft blue light at the top of a page.
- **A state colour means the same thing everywhere.** Red-for-error is `--danger`, not the brand red, so the brand never reads as a mistake.
- **New colours are not added in components.** A tool uses the tokens above; if it needs a new role, the role is added here first.
- **Tool families** keep their own colour for wayfinding: Pulse violet, Zenith blue, Lumen gold, Atlas silver. None of them is red or green, so a family never reads as an error or a success. Inside a family the family colour takes the place of blue, so a page still has a single accent.

## Editorial scope
Stiven Catalyst is broader than a coaching site. It is a modern publication and professional archive covering leadership, management, operations, hospitality, logistics, service, people, systems, field notes and projects.

## Design principles
- Dark-first, cinematic but restrained.
- Strong typography with large editorial headlines.
- The mark has no gradient: a page has one accent, and so does the mark.
- Colour must earn its place: if removing it loses no meaning, remove it.
- The mark is the only symbol of the brand: one drawing, the same everywhere, never beside a second symbol.
- Content must remain fast, readable and useful on mobile.
