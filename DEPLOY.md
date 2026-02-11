# Core Tracker - Deployment Instructions

## CRITICAL: File Structure Must Look Like This

```
core-tracker/              ← Your repository root
├── index.html            ← Must be at root
├── package.json          ← Must be at root
├── vite.config.js        ← Must be at root
├── .gitignore            ← Must be at root
└── src/                  ← Folder named 'src'
    ├── main.jsx          ← Inside src folder
    └── ChampionshipTracker.jsx  ← Inside src folder
```

**IF THE STRUCTURE IS WRONG, THE BUILD WILL FAIL!**

---

## Method 1: Upload to GitHub (Web Interface)

### Step 1: Create Repository
1. Go to **github.com** and sign in
2. Click **"+"** (top right) → **"New repository"**
3. Repository name: **core-tracker**
4. Make it **Public**
5. **DO NOT** check "Add a README file"
6. Click **"Create repository"**

### Step 2: Upload Files CORRECTLY

**IMPORTANT: You MUST preserve the folder structure!**

1. On the repository page, click **"uploading an existing file"**
2. **Open your local deployment-v2 folder**
3. **Select ALL files AND the src folder**:
   - index.html
   - package.json  
   - vite.config.js
   - .gitignore
   - src/ (the entire folder)
4. **Drag and drop ALL of them at once** into GitHub
5. GitHub should show:
   ```
   index.html
   package.json
   vite.config.js
   .gitignore
   src/main.jsx
   src/ChampionshipTracker.jsx
   ```
6. Scroll down and click **"Commit changes"**

### Step 3: Verify Structure
1. After upload, your repository should look like:
   ```
   core-tracker/
   ├── index.html
   ├── package.json
   ├── vite.config.js
   ├── .gitignore
   └── src/
       ├── main.jsx
       └── ChampionshipTracker.jsx
   ```
2. **If it looks different, DELETE the repository and start over!**

---

## Method 2: GitHub Desktop (Easier for Maintaining Structure)

### Step 1: Install GitHub Desktop
1. Download: https://desktop.github.com
2. Install and sign in with GitHub account

### Step 2: Create Repository
1. Open GitHub Desktop
2. File → **New Repository**
3. Name: **core-tracker**
4. Local path: Choose where to save
5. Click **"Create Repository"**

### Step 3: Add Files
1. Open the repository folder on your computer
2. Copy ALL files from deployment-v2:
   - index.html
   - package.json
   - vite.config.js
   - .gitignore
   - src/ (entire folder)
3. Paste into your repository folder
4. Go back to GitHub Desktop
5. You should see all files listed
6. Add commit message: "Initial commit"
7. Click **"Commit to main"**
8. Click **"Publish repository"** (top bar)
9. Choose Public or Private
10. Click **"Publish Repository"**

---

## Deploy to Vercel

1. Go to **vercel.com**
2. **Sign Up** with GitHub
3. Click **"Add New..."** → **"Project"**
4. Find **core-tracker** repository
5. Click **"Import"**
6. **Verify settings:**
   - Framework Preset: **Vite** ✓
   - Root Directory: **./** (leave blank or put ./)
   - Build Command: **npm run build** ✓
   - Output Directory: **dist** ✓
7. Click **"Deploy"**
8. Wait 2-3 minutes
9. You'll get: **core-tracker.vercel.app**

---

## Troubleshooting

### Error: "Rollup failed to resolve import"

**Cause:** Files are not in the correct structure

**Fix:**
1. Go to your GitHub repository
2. Check the file structure
3. If `src/main.jsx` is not showing as `src/main.jsx`, the structure is wrong
4. Delete the repository and re-upload with correct structure

**Common mistakes:**
- ❌ Uploading the `deployment-v2` folder itself (creates extra nesting)
- ❌ Uploading files individually without the src folder
- ❌ Having files at wrong levels

**Correct structure on GitHub:**
```
Your repository root should show:
- index.html
- package.json
- vite.config.js
- .gitignore
- src/ (click to see main.jsx and ChampionshipTracker.jsx inside)
```

### Build Still Failing?

1. **Check Vercel Build Logs:**
   - Click on your failed deployment
   - Read the error message carefully
   - Look for "cannot find" or "failed to resolve"

2. **Verify GitHub Structure Again:**
   - Go to github.com/YOUR_USERNAME/core-tracker
   - Click on `src` folder
   - You should see both .jsx files
   - If not, structure is wrong

3. **Start Fresh:**
   - Delete the repository on GitHub
   - Delete the project on Vercel
   - Re-upload files using Method 2 (GitHub Desktop)

### Other Common Issues

**"npm install failed"**
- Check package.json is at root level
- Make sure it wasn't corrupted during upload

**"Build succeeds but app is blank"**
- Clear browser cache
- Check browser console (F12) for errors
- Verify both .jsx files uploaded correctly

**"Can't add to home screen"**
- Must use HTTPS (Vercel provides this)
- iOS: Must use Safari browser
- Android: Must use Chrome browser

---

## After Successful Deploy

### Add to Phone

**iOS:**
1. Open Safari
2. Go to your-app.vercel.app
3. Tap Share → Add to Home Screen
4. Name: Core Tracker
5. Tap Add

**Android:**
1. Open Chrome  
2. Go to your-app.vercel.app
3. Tap ⋮ → Add to Home screen
4. Name: Core Tracker
5. Tap Add

### Get Custom Domain (Optional)

1. Buy domain at Namecheap or Google Domains ($10-15/year)
2. In Vercel: Settings → Domains
3. Add your domain
4. Follow DNS instructions
5. Wait 10 minutes
6. Done!

---

## Need Help?

If you're stuck:
1. Take a screenshot of your GitHub repository page
2. Take a screenshot of Vercel error message
3. Share with me and I'll help debug

The most common issue is incorrect file structure on GitHub. Double-check that first!
