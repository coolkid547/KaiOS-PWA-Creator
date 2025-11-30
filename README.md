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

## Beta Testing Guide

### For Testers (App Won't Download)

If showing as "beta" but won't download:
- Clear App Store Cache (Settings > Apps > App Store > Storage > Clear Cache)
- Restart your phone
- Verify IMEI is registered with developer
- Check KaiOS version 2.5+ (Settings > About > OS Version)
- Retry App Store refresh

### For Developers (Build Not Syncing)

After uploading to KaiOS Marketplace:
- Wait 15-30 minutes for sync
- Run `npm run test` to validate manifest
- Verify required fields: name, short_name, start_url, icons, display, orientation, minimum_kaios_version
- Ensure HTTPS hosting (localhost for testing)
- Re-upload if fixed

---

Built for KaiOS developers — happy PWA creating! 🚀
i# KaiOS-PWA-Creator
A PWA creator PWA specifically for KaiOS
