# Movista

[![Next.js](https://img.shields.io/badge/Next.js-15.3.3-blue?logo=next.js)](https://nextjs.org/) [![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4.1-38bdf8?logo=tailwindcss)](https://tailwindcss.com/) [![Genkit AI](https://img.shields.io/badge/Genkit-1.8.0-ffb300?logo=google)](https://github.com/genkit-ai/genkit) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> **Movista** is a modern web app for discovering, searching, and getting AI-powered movie and TV show recommendations. Built with Next.js, Tailwind CSS, and Genkit AI, it offers a beautiful, responsive interface and smart features for movie lovers.

---

## ✨ Features

- **Trending & Popular**: Browse trending and popular movies and TV shows, powered by TMDB.
- **AI Movie Suggestions**: Get personalized movie recommendations using an AI agent. Suggestions are based on your viewing history, liked movies, and genre preferences.
- **Favorites**: Save your favorite movies and TV shows for quick access.
- **Search**: Find movies and TV shows by title or genre, with advanced sorting and filtering.
- **Responsive UI**: Clean, modern design with Tailwind CSS and Radix UI components.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd movista
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Set up environment variables:**
   - Copy `.env.example` to `.env` and fill in the required values (e.g., TMDB API key, Firebase config).

### Development

Start the development server:
```bash
npm run dev
```

### Production Build

Build and start the app in production mode:
```bash
npm run build
npm start
```

---

## 🗂️ Project Structure

```
├── src/
│   ├── app/           # Main Next.js app directory (pages, layouts, etc.)
│   ├── ai/            # AI flows and Genkit integration for movie suggestions
│   ├── components/    # Reusable UI components
│   ├── context/       # React context providers (e.g., Favorites)
│   └── lib/           # Utility functions and API wrappers
├── public/            # Static assets
├── package.json       # Project metadata and scripts
└── ...
```

---

## 🤖 AI Movie Suggestions

The [`/suggestions`](./src/app/suggestions/page.tsx) page lets you get movie recommendations by entering your viewing history, liked movies, and genre preferences. The AI agent uses this data to suggest new movies you might enjoy.

## ❤️ Favorites

The [`/favorites`](./src/app/favorites/page.tsx) page displays your saved movies and TV shows. Add items to your favorites from anywhere in the app for easy access later.

## 🔍 Search

Use the [`/search`](./src/app/search/page.tsx) page to find movies and TV shows by title or genre, with options to sort and filter results.

## 🌟 Popular

Browse paginated lists of popular movies and TV shows at `/popular/movie/[page]` and `/popular/tv/[page]`.

---

## 🛠️ Technologies Used

- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Genkit AI](https://github.com/genkit-ai/genkit)
- [TMDB API](https://www.themoviedb.org/documentation/api)
- [Radix UI](https://www.radix-ui.com/)

---

## 📜 Scripts

- `npm run dev` – Start development server
- `npm run build` – Build for production
- `npm start` – Start production server
- `npm run lint` – Lint code
- `npm run typecheck` – TypeScript type checking

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to open an [issue](https://github.com/mishcoders/movies-site/issues) or submit a pull request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a pull request

---

## 📄 License

This project is [MIT](LICENSE) licensed.

---

## 🙏 Acknowledgements

- [TMDB](https://www.themoviedb.org/) for movie and TV data
- [Genkit AI](https://github.com/genkit-ai/genkit) for AI movie suggestions
- [Next.js](https://nextjs.org/) and [Tailwind CSS](https://tailwindcss.com/) for the tech stack
