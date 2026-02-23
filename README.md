# Michael Musallam — Personal Portfolio

A personal portfolio website with a **neo-brutalist** design — bold black borders, hard box shadows, and a vibrant yellow (`#f2d200`) / blue (`#47b9fb`) / pink (`#f70db0`) accent palette on a clean white layout.

## Pages

| Page | File | Status | Description |
|------|------|--------|-------------|
| Home | `index.html` | ✅ Built | Hero intro, profile photo with floating code icons, skill badges, about section, and journey timeline with world map |
| Projects | `projects.html` | 🚧 WIP | Scaffold with basic nav links — content TBD |

## Home Page Sections

- **Nav Bar** — Logo ("MM"), nav links (Home, About, Journey, Skills), "Get in touch!" CTA, and a menu button
- **Hero / Intro** — Bio paragraph with profile image (`me.png`) + floating decorative code icons (`>_`, `</>`, `{ }`, "Math Brain, Dev Hands")
- **Skill Badges** — Python, C++, JavaScript, HTML, CSS — each with its logo icon
- **About** — Highlighted bio with colored keyword spans (yellow, blue, pink)
- **Journey** — "Life Landmarks" timeline (Bethlehem/Beit Sahour → Famagusta, Cyprus) with a world map and crosshair pin

## Structure

```
├── index.html          # Main homepage
├── projects.html       # Projects page (WIP)
├── css/
│   └── style.css       # All styles — layout, nav, cards, icons
├── js/
│   └── script.js       # JS (placeholder)
├── assets/
│   ├── images/         # Profile photo, logos, world map, icons
│   └── icons/          # (empty)
├── fonts/
│   └── GeneralSans-Variable.ttf
└── README.md
```

## Tech Stack

- **HTML5** — Semantic markup
- **CSS3** — Grid, flexbox, custom `@font-face`, box-shadow brutalist cards
- **Fonts** — Google Fonts ([Bungee](https://fonts.google.com/specimen/Bungee)) for headings + local [GeneralSans](fonts/GeneralSans-Variable.ttf) variable font for body text
- **No frameworks** — Pure vanilla HTML/CSS/JS

## Getting Started

Open `index.html` in any browser. No build step or dependencies required.