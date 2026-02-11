# Core Tracker - Deployment Guide

## Quick Deploy to Vercel (5 Minutes)

### Prerequisites
- GitHub account (free)
- Vercel account (free - sign up with GitHub)

### Step 1: Get the Code to GitHub

**Option A: Using GitHub Desktop (Easiest)**
1. Download GitHub Desktop: https://desktop.github.com
2. Install and sign in with your GitHub account
3. Click "Create New Repository"
   - Name: `core-tracker`
   - Local Path: Choose where you saved these files
   - Click "Create Repository"
4. Click "Publish repository" (top right)
5. Uncheck "Keep this code private" if you want it public
6. Click "Publish Repository"

**Option B: Using Git Command Line**
```bash
# Navigate to this directory
cd /path/to/deployment

# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit"

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/core-tracker.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to https://vercel.com
2. Click "Sign Up" (use GitHub to sign in)
3. Once logged in, click "Add New..." → "Project"
4. Click "Import" next to your `core-tracker` repository
5. Configure:
   - Framework Preset: **Vite**
   - Root Directory: `./` (leave as default)
   - Build Command: `npm run build` (should auto-detect)
   - Output Directory: `dist` (should auto-detect)
6. Click "Deploy"
7. Wait 2-3 minutes...
8. **DONE!** You'll get a URL like: `core-tracker.vercel.app`

### Step 3: Add to Your Phone

**iOS:**
1. Open Safari (must be Safari)
2. Go to your Vercel URL
3. Tap the Share button
4. Tap "Add to Home Screen"
5. Name it "Core Tracker"
6. Tap "Add"

**Android:**
1. Open Chrome
2. Go to your Vercel URL
3. Tap the three dots
4. Tap "Add to Home screen" or "Install app"
5. Name it "Core Tracker"
6. Tap "Add"

### Step 4: Get a Custom Domain (Optional)

1. In Vercel dashboard, click your project
2. Go to "Settings" → "Domains"
3. Add your domain (e.g., `coretracker.com`)
4. Follow the DNS setup instructions
5. **Cost:** $10-15/year for a .com domain

---

## Alternative: Deploy to Netlify

1. Go to https://netlify.com
2. Sign up with GitHub
3. Click "Add new site" → "Import an existing project"
4. Choose your GitHub repository
5. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Click "Deploy"
7. Get URL like: `core-tracker.netlify.app`

---

## Local Development (Test Before Deploy)

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open browser to: http://localhost:5173
```

---

## Troubleshooting

**Build fails on Vercel:**
- Check that all files are committed to GitHub
- Verify `package.json` is in the root directory
- Check Vercel build logs for specific errors

**App doesn't load:**
- Clear browser cache
- Check browser console for errors (F12)
- Verify all files were deployed

**Data not saving:**
- Check browser allows localStorage
- Try in different browser
- Check browser console for errors

**PWA not installing:**
- Must use HTTPS (Vercel provides this automatically)
- Must have manifest.json (included)
- Try different browser

---

## File Structure

```
deployment/
├── index.html              # Entry point
├── package.json            # Dependencies
├── vite.config.js          # Build config
├── public/
│   └── manifest.json       # PWA manifest
└── src/
    ├── main.jsx            # React bootstrap
    └── ChampionshipTracker.jsx  # Main app
```

---

## Updating Your App

1. Make changes to code locally
2. Commit changes:
   ```bash
   git add .
   git commit -m "Update description"
   git push
   ```
3. Vercel auto-deploys in 1-2 minutes
4. Refresh your app to see changes

---

## Backup Your Data

Your tracking data lives in browser localStorage. To backup:

1. Open browser console (F12)
2. Go to "Application" or "Storage" tab
3. Find "Local Storage" → your domain
4. Copy the values for:
   - `championship-entries-v2`
   - `core-values`
   - `declarations`
   - `responses`
   - `goals`
5. Save to a text file

To restore: Paste back into localStorage

---

## Support

If you get stuck:
- Check Vercel docs: https://vercel.com/docs
- GitHub Desktop guide: https://docs.github.com/en/desktop
- Vite docs: https://vitejs.dev

Your app will be live at: `https://YOUR_PROJECT.vercel.app`

Add it to your home screen and use it like a native app!
