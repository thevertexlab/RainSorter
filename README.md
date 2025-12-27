# 🌧️ RainSorter

> AI-powered tool to help you organize your Raindrop.io bookmarks efficiently

## What is RainSorter?

RainSorter is an open-source web app that helps you sort through your unsorted Raindrop.io bookmarks. It uses Raindrop's built-in AI to suggest which folder each bookmark belongs to, and lets you move them with a single click.

**Perfect for when you have hundreds of unsorted bookmarks and need help organizing them!**

## Why Use RainSorter?

- 📚 **Bulk Organization**: Sort through all your unsorted bookmarks in one place
- 🤖 **AI-Powered**: Get smart folder suggestions based on bookmark content
- 🔍 **Quick Review**: See all items in existing folders while sorting
- ↩️ **Easy Revert**: Made a mistake? Easily undo all changes (see below)
- 🏷️ **Tagged Sorting**: Special tags track what you've sorted, so you can always revert

## Quick Start

### Prerequisites
- A [Raindrop.io](https://raindrop.io) account
- Basic command line knowledge
- Node.js installed on your computer

### Setup (5 minutes)

1. **Get OAuth Credentials**
   - Go to https://raindrop.io/settings/integrations
   - Click "Create new app"
   - Set redirect URI: `http://localhost:5173/callback`
   - Copy your Client ID and Client Secret

2. **Configure Environment**
   ```bash
   # Frontend (.env)
   VITE_RAINDROP_CLIENT_ID=your_client_id_here
   VITE_REDIRECT_URI=http://localhost:5173/callback
   VITE_PROXY_API_URL=http://localhost:3001/api

   # Backend (server/.env)
   RAINDROP_CLIENT_ID=your_client_id_here
   RAINDROP_CLIENT_SECRET=your_client_secret_here
   FRONTEND_URL=http://localhost:5173
   PORT=3001
   ```

3. **Install & Run**
   ```bash
   npm install
   npm start
   ```

4. **Open Browser**
   - Visit http://localhost:5173
   - Login with Raindrop.io
   - Start sorting!

## How to Use

### Main Workflow

1. **View Your Unsorted Items**
   - All unsorted bookmarks load automatically
   - See title, URL, tags, and creation date

2. **Get AI Suggestions**
   - Click **"✨ Fetch Suggestions"** button
   - Wait for AI to analyze your bookmarks (progress shown live)
   - See suggested folders with confidence scores (e.g., "Work (85%)")

3. **Sort Your Bookmarks**

   **Method 1: Click AI Suggestion**
   - Click a suggested folder badge
   - Item moves to that folder
   - Gets tagged with `_rainsorter`

   **Method 2: Manual Selection**
   - Click the **✏️** icon
   - Search or browse full folder tree
   - Select any folder manually
   - Gets tagged with `_rainsorter_manual`

4. **Filter & Review**
   - Click folders in left sidebar to filter view
   - See existing items in selected folder (top panel)
   - Use "Hide sorted" checkbox to hide organized items

### Understanding the Tags

RainSorter adds special tags to help you track and revert changes:

#### `_rainsorter` Tag
- **When**: Automatically added when you click an AI suggestion
- **Means**: "This was sorted using AI suggestions"
- **Why**: So you can easily find and review AI-sorted items later

#### `_rainsorter_manual` Tag
- **When**: Automatically added when you use the ✏️ manual selector
- **Means**: "I manually chose this folder (not AI, not official app)"
- **Why**: Different from AI suggestions, but still tracked for reverting

### Why These Tags Matter

**🔄 Easy Revert**: Made mistakes while sorting? Want to start over?

Just search for items with `_rainsorter` or `_rainsorter_manual` tags in the official Raindrop app, select all, and move them back to Unsorted. All your sorting decisions are reversible!

**📊 Track Your Progress**:
- Items with `_rainsorter` = AI helped you decide
- Items with `_rainsorter_manual` = You decided manually
- No tag = Sorted in official app or pre-existing

## Tips & Best Practices

### Sorting Strategy

1. **Start Small**: Click "Fetch Suggestions" to analyze your bookmarks
2. **Trust High Confidence**: Suggestions with 80%+ confidence are usually accurate
3. **Use Manual for Edge Cases**: Use ✏️ when AI suggestion doesn't fit
4. **Review Before Finalizing**: Click folders in sidebar to preview what's already there

### Managing Large Collections

- **Batch Processing**: Suggestions fetch in the background, stats update live
- **Filter by Folder**: Click sidebar folders to focus on specific categories
- **Hide Sorted**: Check "Hide sorted" to see only remaining unsorted items

### Reverting Mistakes

**Option 1: Revert Everything**
```
1. In official Raindrop app, search: #_rainsorter OR #_rainsorter_manual
2. Select all results
3. Move to "Unsorted"
4. Remove tags
```

**Option 2: Revert AI Only**
```
Search: #_rainsorter
Move to Unsorted
(Keeps your manual decisions)
```

**Option 3: Revert Manual Only**
```
Search: #_rainsorter_manual
Move to Unsorted
(Keeps AI suggestions)
```

## Features Overview

- ✅ OAuth2 authentication (secure, no password storage)
- ✅ Fetch ALL unsorted bookmarks (no pagination limits)
- ✅ AI-powered folder suggestions with confidence scores
- ✅ One-click sorting to suggested folders
- ✅ Manual folder selector with search
- ✅ Tree-view sidebar with folder hierarchy
- ✅ Preview existing items in folders
- ✅ Real-time suggestion fetching progress
- ✅ Hide sorted items filter
- ✅ Tag-based revert system
- ✅ Full JSON inspector for debugging

## FAQ

**Q: Will this delete my bookmarks?**
A: No! It only moves bookmarks between folders and adds tags. Nothing is deleted.

**Q: Can I undo sorting decisions?**
A: Yes! Items are tagged with `_rainsorter` or `_rainsorter_manual`. Search for these tags in the official app and move them back to Unsorted.

**Q: Does this work with shared collections?**
A: It works with any collections in your account that you have edit access to.

**Q: Is my data safe?**
A: Yes! RainSorter uses OAuth2 (official Raindrop authentication). Your credentials never touch our servers. The app runs locally on your computer.

**Q: Why run a local server?**
A: The backend proxy keeps your OAuth client secret secure (can't expose it in browser JavaScript). This follows security best practices.

## Troubleshooting

**"No authorization code found"**
- Check your redirect URI in Raindrop.io settings matches exactly: `http://localhost:5173/callback`

**"Failed to fetch suggestions"**
- You might be rate-limited. Wait 30 seconds and try again.
- Suggestions fetch in batches (5 at a time) to avoid hitting rate limits.

**"Items not showing up"**
- Click the 🔄 Refresh button
- Check "Hide sorted" is unchecked if you want to see sorted items

---

## For Developers

### Tech Stack
- **Frontend**: Vite + React + Jotai (state)
- **Backend**: Express.js (OAuth proxy)
- **API**: Raindrop.io REST API
- **Styling**: Plain CSS (no frameworks)

### Project Structure
```
rainsorter/
├── src/                    # Frontend React app
│   ├── components/        # UI components
│   ├── hooks/            # Custom React hooks
│   ├── services/         # API clients
│   ├── store/            # Jotai atoms (state)
│   └── utils/            # Helpers
└── server/               # Express OAuth proxy
    └── index.js
```

### Development

```bash
# Install dependencies
npm install
cd server && npm install

# Run both servers
npm start

# Or run separately
npm run dev          # Frontend (port 5173)
npm run server       # Backend (port 3001)
```

### Key Design Decisions

- **Backend Proxy**: Required to keep OAuth client_secret secure
- **Jotai + localStorage**: Persistent state across page refreshes
- **Batched Fetching**: Avoid rate limits (5 concurrent, 500ms delay)
- **Tag-Based Tracking**: Enable reversible sorting operations
- **No Pagination**: Fetch ALL items for complete view

### API Endpoints Used

- `GET /rest/v1/raindrops/-1` - Fetch unsorted items
- `GET /rest/v1/raindrops/0?search=#tag` - Fetch tagged items
- `GET /rest/v1/raindrop/{id}/suggest` - Get AI suggestions
- `PUT /rest/v1/raindrop/{id}` - Update raindrop
- `GET /rest/v1/collections` - Get folder tree

### Contributing

Issues and pull requests welcome! This is a community tool to help Raindrop users.

### License

MIT - Free to use, modify, and distribute.

---

Made with ☕ by Raindrop.io users, for Raindrop.io users
