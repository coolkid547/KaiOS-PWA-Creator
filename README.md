# KaiOS PWA Creator

A Progressive Web App (PWA) for creating other PWAs optimized for KaiOS devices. This tool helps developers generate the necessary files (`manifest.json`, service workers, and HTML templates) for building Progressive Web Apps that work well on KaiOS phones.

## Quick Start

```bash
cd KaiOS-PWA-Creator
python3 -m http.server 8000
# Open http://localhost:8000 in your browser
```

## What this project contains

- `index.html` — Web UI to configure and generate PWA files
- `manifest.json` — Example manifest for the creator app
- `sw.js` — Service worker providing offline support for the creator
- `js/app.js` — Generator logic (creates manifest, sw, and sample index)
- `styles/main.css` — KaiOS-optimized responsive styling
- `assets/` — Generated icon and screenshot placeholders

## Usage

1. Open `index.html` in a browser (or run the quick start server above).
2. Fill the form with your app details and click **Generate PWA Files**.
3. Download or copy the generated `manifest.json`, `sw.js`, and sample `index.html`.
4. Integrate those files into your own web app and host them over HTTPS.

## Notes and Troubleshooting

- The creator is built to work well on KaiOS (small screens, limited resources).
- If service worker registration fails, make sure you serve over HTTPS or use localhost for testing.
- If files are not showing as tracked by git, run:

```bash
cd /workspaces/KaiOS-PWA-Creator
git add .
git commit -m "Add KaiOS PWA Creator files"
git push
```

If the terminal in your environment shows filesystem provider errors (ENOPRO), try restarting your editor/IDE or running the git commands from a local terminal.

---

Built for KaiOS developers — happy PWA creating! 🚀
i# KaiOS-PWA-Creator
A PWA creator PWA specifically for KaiOS
