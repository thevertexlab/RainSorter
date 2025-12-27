# RainSorter

A simple React app to view and organize your unsorted Raindrop.io bookmarks.

## Features

- 🔐 **Secure OAuth Authentication** with Raindrop.io
- 📋 **Table View** of all unsorted bookmarks
- 🏷️ **Tag Display** with visual badges
- 📄 **Pagination** for easy navigation
- 📱 **Responsive Design** that works on mobile and desktop
- ⚡ **Fast** and lightweight with Vite + React

## Tech Stack

- **Frontend**: Vite + React
- **State Management**: Jotai
- **Styling**: Plain CSS (no UI framework)
- **Backend**: Express.js (OAuth proxy)
- **API**: Raindrop.io REST API

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A Raindrop.io account
- Raindrop.io OAuth app credentials (see setup below)

## Getting OAuth Credentials

1. Go to [Raindrop.io Integrations Settings](https://raindrop.io/settings/integrations)
2. Click "Create new app" or "+ for developers"
3. Fill in the app details:
   - **App Name**: RainSorter (or your choice)
   - **Description**: View unsorted bookmarks
   - **Redirect URI**: `http://localhost:5173/callback`
4. Save and copy your:
   - **Client ID**
   - **Client Secret**

## Installation

### 1. Clone and Install Dependencies

```bash
# Clone the repository
cd rainsorter

# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 2. Configure Environment Variables

#### Frontend Environment (`.env`)

Create a `.env` file in the root directory:

```env
VITE_RAINDROP_CLIENT_ID=your_client_id_here
VITE_REDIRECT_URI=http://localhost:5173/callback
VITE_PROXY_API_URL=http://localhost:3001/api
```

#### Backend Environment (`server/.env`)

Create a `server/.env` file:

```env
RAINDROP_CLIENT_ID=your_client_id_here
RAINDROP_CLIENT_SECRET=your_client_secret_here
FRONTEND_URL=http://localhost:5173
PORT=3001
```

**Note**: Your `.env` files are already gitignored for security.

## Running the App

### Option 1: Run Both Servers Together (Recommended)

```bash
npm start
```

This will start both the backend proxy (port 3001) and frontend (port 5173) in a single terminal with colored output.

### Option 2: Run Servers Separately

If you prefer to run them in separate terminals:

**Terminal 1: Start Backend Proxy**

```bash
npm run server
# or
cd server && npm start
```

**Terminal 2: Start Frontend**

```bash
npm run dev
```

## Usage

1. Open `http://localhost:5173` in your browser
2. Click "Login with Raindrop.io"
3. Authorize the app in Raindrop.io
4. You'll be redirected back and see your unsorted bookmarks
5. Use pagination to navigate through your bookmarks
6. Click on any title to open the bookmark in a new tab

## Project Structure

```
rainsorter/
├── src/
│   ├── components/       # React components
│   │   ├── ErrorMessage.jsx
│   │   ├── Header.jsx
│   │   ├── Loader.jsx
│   │   ├── RaindropRow.jsx
│   │   └── RaindropsTable.jsx
│   ├── pages/           # Page components
│   │   ├── CallbackPage.jsx
│   │   ├── DashboardPage.jsx
│   │   └── LoginPage.jsx
│   ├── hooks/           # Custom React hooks
│   │   ├── useAuth.js
│   │   ├── useOAuthCallback.js
│   │   └── useRaindrops.js
│   ├── services/        # API services
│   │   ├── authService.js
│   │   ├── proxyApi.js
│   │   └── raindropApi.js
│   ├── store/           # Jotai atoms (state)
│   │   ├── authAtoms.js
│   │   ├── raindropsAtoms.js
│   │   └── uiAtoms.js
│   ├── utils/           # Utility functions
│   │   ├── constants.js
│   │   ├── formatters.js
│   │   └── storage.js
│   ├── styles/          # CSS files
│   ├── App.jsx          # Main app with routing
│   └── main.jsx         # Entry point
├── server/              # Backend OAuth proxy
│   ├── index.js        # Express server
│   └── package.json
├── .env                 # Frontend environment variables
└── README.md
```

## Architecture

### OAuth Flow (Security)

RainSorter uses a **backend proxy** to keep your OAuth credentials secure:

1. **Frontend** redirects user to Raindrop.io for authorization
2. **Raindrop.io** redirects back with an authorization code
3. **Frontend** sends code to **backend proxy**
4. **Backend** exchanges code + client_secret for access token (secure!)
5. **Backend** returns token to **frontend**
6. **Frontend** uses token to fetch bookmarks

This ensures your `client_secret` never appears in browser JavaScript.

### State Management

Uses **Jotai** atoms for reactive state:
- `authAtoms`: Access token, refresh token, authentication status
- `raindropsAtoms`: Bookmarks data, loading, errors, pagination
- `uiAtoms`: UI preferences (items per page)

Tokens persist in `localStorage` via Jotai's `atomWithStorage`.

### API Integration

- **Raindrop.io API**: `https://api.raindrop.io/rest/v1/`
- **Unsorted Collection**: Collection ID `-1`
- **Pagination**: 50 items per page (API maximum)
- **Token Refresh**: Automatic when token expires

## Troubleshooting

### "OAuth error" or "bad_authorization_code"

- Check that your `REDIRECT_URI` in `.env` matches exactly what's registered in Raindrop.io
- Make sure both backend and frontend servers are running

### CORS errors

- Verify `FRONTEND_URL` in `server/.env` matches your frontend URL
- Check that the backend server is running on port 3001

### "No authorization code found"

- Clear your browser cookies and localStorage
- Try the login flow again

### Tokens not persisting

- Check browser console for localStorage errors
- Ensure you're not in private/incognito mode

## Development

### Adding Features

- **New API calls**: Add to `src/services/raindropApi.js`
- **New state**: Create atoms in `src/store/`
- **New components**: Add to `src/components/`
- **Styling**: Update `src/App.css`

### Code Style

- Use functional components with hooks
- Keep components small and focused
- Use custom hooks for complex logic
- Follow existing naming conventions

## Production Deployment

### Frontend (Vercel/Netlify)

1. Build the app: `npm run build`
2. Deploy the `dist` folder
3. Update `.env` with production URLs

### Backend (Railway/Heroku/Render)

1. Deploy the `server` folder
2. Set environment variables in hosting dashboard
3. Update `FRONTEND_URL` to your production frontend URL

### Environment Variables for Production

**Frontend**:
```
VITE_RAINDROP_CLIENT_ID=your_client_id
VITE_REDIRECT_URI=https://your-domain.com/callback
VITE_PROXY_API_URL=https://your-backend.com/api
```

**Backend**:
```
RAINDROP_CLIENT_ID=your_client_id
RAINDROP_CLIENT_SECRET=your_client_secret
FRONTEND_URL=https://your-domain.com
PORT=3001
```

Don't forget to register your production redirect URI in Raindrop.io!

## Security Notes

- ✅ OAuth client secret stored securely on backend
- ✅ Tokens stored in localStorage (encrypted in transit)
- ✅ CORS properly configured
- ⚠️ This is a personal tool - don't share your OAuth credentials

## License

MIT

## Credits

Built with:
- [Vite](https://vitejs.dev/)
- [React](https://react.dev/)
- [Jotai](https://jotai.org/)
- [Raindrop.io API](https://developer.raindrop.io/)

---

**Happy organizing! 📚✨**
