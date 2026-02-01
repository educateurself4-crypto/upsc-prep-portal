# 🚀 GitHub Launch Guide

Follow these steps to put your UPSC Preparation Portal live on GitHub Pages.

## 1. Create your Repository
1. Go to [GitHub.com](https://github.com) and log in.
2. Click the **+** (top right) -> **New repository**.
3. Name it: `upsc-prep-portal`.
4. Keep it **Public**.
5. Do **not** initialize it with a README or .gitignore (I have already created these for you).
6. Click **Create repository**.

## 2. Connect Your Folder (Terminal)
Open your terminal in VS Code (`Ctrl + ~`) and paste these commands one by one:

```bash
# 1. Initialize Git
git init

# 2. Add your files
git add .

# 3. Save your changes
git commit -m "Deployment: Pro UPSC Portal"

# 4. Connect to your GitHub (Replace YOUR_USERNAME with your real GitHub name)
git remote add origin https://github.com/YOUR_USERNAME/upsc-prep-portal.git

# 5. Send your code to GitHub
git push -u origin main
```

## 3. Deploy to the Web!
Now that your code is on GitHub, run this single command to launch the live website:

```bash
npm run deploy
```

## 4. Final Settings on GitHub
1. Go to your repository on GitHub.com.
2. Click **Settings** (top tab) -> **Pages** (left sidebar).
3. Under **Build and deployment > Branch**, ensure it is set to `gh-pages` and folder `/ (root)`.
4. Wait 1-2 minutes. GitHub will provide a link like:
   `https://YOUR_USERNAME.github.io/upsc-prep-portal/`

---

### Every time you make an update:
1. Run `npm run deploy` again.
2. That's it! GitHub will update your website automatically in 60 seconds.
