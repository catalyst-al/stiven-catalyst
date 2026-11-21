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

How it is drawn: one colour for the ring (the text colour of the theme), the accent blue for the point, flat, with no glow, no gradient and no shadow. In one colour the point takes the colour of the ring. The ring is always the same drawing (`--mark-ring` in `src/css/01-foundation.css`, `src/favicon.svg`); it is never redrawn, stretched or closed.

The earlier mark was a hanging light bulb on a red-to-blue gradient. The header, the footer, the favicon and the app icons now carry the circled point. The small lights in the menu and in the homepage hero, and the light at the centre of the homepage system, are still the bulb; they are replaced in the steps that follow, and nothing new is drawn with it.

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
| Red: the signature | `--red` | Only the poster of the earlier mark and a single word in the manifesto. Not in the mark. Never a button, a bar, a glow or a chart. |
| Gold | `--gold` | Only the small lights of the menu and the hero that are left from the earlier mark, until they are replaced. Not in the mark. |
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
