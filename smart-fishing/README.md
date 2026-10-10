# Smart Fishing

A mobile-first website for the Smart Fishing Sustainability project. It predicts marine
extinction risk from sensor readings and shows weather, fishing zones, and a catch log.

- Intro splash: water fills the screen while a fish swims across
- Swimming fish, waves, bubbles, and tap ripples on every page
- Home page scrolls itself down to a login card (touch it to take over)
- Every page scrolls on its own with a draggable scroll bar, and swiping left or right changes tab
- Predict, Weather, Zones, and Log stay locked until you sign in
- Live weather and wave height from Open-Meteo (no API key), plus simulated sunny, rainy, and stormy modes
- Works in light and dark mode

## Run it on your computer

You need Node.js 18 or newer.

```
npm install
npm run dev
```

Open the address it prints (usually http://localhost:5173/smart-fishing/).

## Put it on GitHub Pages

1. Create a new repository on GitHub. Use the name `smart-fishing`, or any name you like.
2. In VS Code's terminal, inside this folder:
   ```
   git init
   git add .
   git commit -m "first version"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
   git push -u origin main
   ```
3. On GitHub, open **Settings**, then **Pages**, and set **Source** to **GitHub Actions**.
4. Open the **Actions** tab and wait for "Deploy to GitHub Pages" to finish (about a minute).
5. Your site is live at `https://YOUR-USERNAME.github.io/YOUR-REPO/`.

Every push to `main` updates the site automatically. The workflow reads your repository
name for the site address, so you do not need to edit `vite.config.js` for deployment.
For `npm run dev` to match, change the fallback in `vite.config.js` if your repo is not
named `smart-fishing`.

## Connect your RandomForest model (optional)

GitHub Pages only hosts the website, not Python. Until you add a backend, the Predict page
uses a built-in estimate (`src/lib/risk.js`).

To use your trained model, host a small API (for example FastAPI on Render or Hugging Face Spaces):

```
POST /predict
{ "temperature": 24, "oxygen": 5.2, "ph": 8.0, "salinity": 35 }

response: { "risk": 55 }     # 0 to 100
```

Then set the address:

- Locally: create a `.env` file with `VITE_API_URL=https://your-api.example.com`
- On GitHub: **Settings, Secrets and variables, Actions, Variables**, add `VITE_API_URL`

Remember to allow your site's address in the API's CORS settings.

## Make the login real

The login is a demo: it saves a name in the browser and does not check passwords.
To make it real, replace `signIn` in `src/context/AuthContext.jsx` with a call to
Firebase Auth, Supabase, or your own API. The page locking in
`src/components/ProtectedRoute.jsx` already works with whatever user you set there.

## Change the location

Edit `src/config.js` to set the coordinates used for live weather and waves.

## Project map

```
src/
  App.jsx                  layout, tabs, swipe, tap ripples
  components/
    Water.jsx, Fish.jsx    swimming fish and waves
    Background.jsx         bubbles, clouds, rain, lightning
    PageShell.jsx          page transition, scrolling, scroll bar
    Splash.jsx             intro
    ProtectedRoute.jsx     login lock
  context/                 login, weather, scroll progress
  pages/                   Home, Predict, Weather, Zones, Log
  lib/risk.js              risk estimate and backend call
  data/zones.js            zone list
  styles.css               all styling
```
