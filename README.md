# Afrikana Digital Menu

A professional digital menu for Afrikana restaurant, built for mobile-first QR code scanning.

## Folder Structure

```
afrikana-menu/
├── index.html          ← Main menu page (all content here)
├── vercel.json         ← Vercel deployment config
├── src/
│   ├── style.css       ← All styling
│   └── main.js         ← Tab navigation logic
└── public/
    └── images/         ← Place your logo and any images here
```

## How to Deploy on Vercel

### Step 1 — Create GitHub Account
Go to https://github.com and sign up (free)

### Step 2 — Upload Your Code
1. Click the **+** button → New repository
2. Name it `afrikana-menu`
3. Upload all files (drag and drop the folder)
4. Click **Commit changes**

### Step 3 — Deploy on Vercel
1. Go to https://vercel.com and sign up with your GitHub account
2. Click **Add New Project**
3. Select your `afrikana-menu` repository
4. Click **Deploy** — done!

### Step 4 — Get Your Link
Vercel gives you a free link like:
`https://afrikana-menu.vercel.app`

### Step 5 — Generate QR Code
1. Go to https://qrcode-monkey.com
2. Paste your Vercel link
3. Upload your cafe logo
4. Download and print!

## Updating the Menu

1. Edit `index.html` (change prices, add/remove items)
2. Save and push to GitHub
3. Vercel auto-updates in under 1 minute
4. QR code never needs to change!
