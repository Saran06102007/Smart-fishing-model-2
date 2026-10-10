// Change these to your own area.
export const LOCATION = {
  name: 'Chennai coast',
  lat: 13.0827,
  lon: 80.2707,
  marineLat: 13.05, // a point just offshore, so the wave data has a sea cell to read
  marineLon: 80.4,
}

// Optional: URL of your Python backend that serves the RandomForest model.
// Set it in a .env file (VITE_API_URL=https://your-api.example.com) or as a
// repository variable named VITE_API_URL for GitHub Actions.
export const API_URL = import.meta.env.VITE_API_URL || ''
