# ScumDB Web Analyzer

> **A privacy-first, browser-based stats and vehicle analyzer for SCUM game server save files.**

---

## 🚀 Features

- **All analysis runs 100% in your browser.** No data is ever uploaded or shared—your files stay local.
- **Fan project**: Not affiliated with SCUM or Gamepires. For the community, by the community.
- **Easy-to-use UI**: Upload your `SCUM.db` save file and instantly explore stats.
- **Stat Analysis**: Visualize player kill stats, survival stats, fishing, stats, and more.
- **Squad Vehicle Analysis**: See all vehicles per user, grouped by squad.
- **Export & Share**: Download charts as images or send them directly to a Discord webhook.
- **Responsive & Accessible**: Works on desktop and mobile, with accessibility in mind.

---

## 🕹️ About SCUM

SCUM is a hardcore survival game by Gamepires. This tool is for server admins, players, and community members who want to analyze and visualize their server's save data.

---

## 🛡️ Privacy & Security

- **Your data never leaves your device.**
- All processing is done locally in your browser using [sql.js](https://github.com/sql-js/sql.js).
- No tracking, no analytics, no cloud—just you and your data.

---

## 🖥️ Technology Stack

- **React** (UI)
- **TypeScript** (type safety)
- **Vite** (build tool)
- **sql.js** (SQLite in the browser)
- **Recharts** (data visualization)
- **Material UI** (modern controls)

---

## 📸 Screenshots

> _Screenshots coming soon!_
>
> ![Dashboard Screenshot - blurred](docs/screenshots/dashboard-blurred.png)
> ![Vehicle Analysis Screenshot - blurred](docs/screenshots/vehicles-blurred.png)
>
> _Replace these placeholders with your own screenshots. Use image editing to blur player names for privacy._

---

## 🌐 Try It Online

> _A free-to-use web version will be available soon at:_
>
> **[https://yourdomain.example.com](https://yourdomain.example.com)**
>
> _Bookmark this page for updates!_

---


## 🐳 Run Locally with Docker

You can run ScumDB Web Analyzer locally using Docker. No Node.js or npm required!


### 1. Using Docker CLI

```sh
docker run --rm -p 5173:80 \
  $DOCKERHUB_USERNAME/scumdbwebanalyser:latest
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

### 2. Using Docker Compose

Create a `docker-compose.yml` like this:

```yaml
version: '3.8'
services:
  scumdbwebanalyser:
    image: $DOCKERHUB_USERNAME/scumdbwebanalyser:latest
    ports:
      - "5173:80"
```

Then run:

```sh
docker compose up
```

The app will be available at [http://localhost:5173](http://localhost:5173).

---

## 📝 How to Use

1. Download your `SCUM.db` save file from your server. This file is usually located at `/Saved/SaveFiles/SCUM.db` on your server.
2. Open the app in your browser (or use the online version above).
3. Click **Upload SCUM.db** and select your file.
4. Explore stats, vehicles, and more!
5. Export charts as images or send them to Discord.

---

## 🤝 Contributing

- PRs and suggestions are welcome!
- Please blur any sensitive data in screenshots before sharing.
- See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines (coming soon).

---


## ⚖️ License

This project is licensed under the [Creative Commons Attribution-NonCommercial 4.0 International License (CC BY-NC 4.0)](https://creativecommons.org/licenses/by-nc/4.0/).

- **You may use, modify, and distribute this software for non-commercial purposes only.**
- **You may NOT use this software on or for any server or service that operates a real-money bot shop or similar monetization scheme where the owner receives money for in-game items, bots, or services.**

See the LICENSE file for details and additional terms.

---

## ⚠️ Disclaimer

- This is a fan-made project and is **not affiliated with SCUM or Gamepires**.
- All trademarks and copyrights belong to their respective owners.
- Use at your own risk.

---

## 📣 Credits

- Developed by [Agent772](https://github.com/Agent772)
- Inspired by [scum-forge/sctl](https://github.com/scum-forge/sctl) (original idea and CLI tool)
- Powered by ChatGPT 4.1 (for code generation and assistance)
