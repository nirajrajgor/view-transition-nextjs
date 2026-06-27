# View Transition Next.js Demo

A Next.js demo project for experimenting with page and UI transitions using the View Transitions API.

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

```bash
npm run dev      # Start the local development server
npm run build    # Create a production build
npm run start    # Start the production server
```

## Project Structure

```text
app/
  page.tsx                 # Home page
  pokemon/[name]/page.tsx  # Pokemon detail route
  _components/             # Shared app components
public/
  videos/                  # Demo video assets served from /videos/*
```

## Video Assets

The demo videos live in `public/videos/` and can be referenced from the app with root-relative URLs:

- `/videos/crossfade.webm`
- `/videos/morph.webm`
- `/videos/nav.webm`
- `/videos/view-transition-demo.webm`

## License

MIT
