# Modern Web Calculator

A fully functional modern calculator web application inspired by the Windows 11 Calculator app UI and functionality. Built with React, Vite, Tailwind CSS, and Zustand.

## Features

- **Standard Calculator**: Basic arithmetic, percentages, memory functions (MC, MR, M+, M-, MS).
- **Scientific Calculator**: Trigonometry, logarithms, powers, roots, factorials, and more.
- **Graphing Mode**: Plot equations and visualize them interactively (built using mathjs and recharts).
- **Programmer Mode**: Hex, Dec, Oct, Bin conversions and bitwise operations.
- **Date Calculation**: Calculate difference between dates or add/subtract days.
- **Unit Converters**: Convert length, weight, area, volume, temperature, and more.
- **Modern UI**: Glassmorphism design, dark/light theme support, responsive sidebar, smooth framer-motion animations.

## Tech Stack
- Frontend: React 18, Vite
- Styling: Tailwind CSS, Vanilla CSS (Glassmorphism utilities)
- State Management: Zustand
- Math Engine: Math.js
- Charts: Recharts
- Animations: Framer Motion
- Icons: Lucide React
- Date utils: date-fns

## Deployment Instructions (Vercel / Netlify)

This project is fully frontend-based and requires no backend or database.

### Deploying to Vercel
1. Push your code to a GitHub repository.
2. Go to [Vercel](https://vercel.com/) and create a new project.
3. Import your GitHub repository.
4. Vercel will automatically detect the Vite framework.
5. Leave the Build Command as `npm run build` and Output Directory as `dist`.
6. Click **Deploy**.

### Deploying to Netlify
1. Push your code to a GitHub repository.
2. Go to [Netlify](https://netlify.com/) and create a new site.
3. Import your GitHub repository.
4. Netlify will detect Vite.
5. Set Build Command to `npm run build` and Publish directory to `dist`.
6. Click **Deploy Site**.

## Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```
