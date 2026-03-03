# 🚀 Quick Start Guide - UBL Fraud Detection Frontend

## Fastest Way to Get Started (30 seconds)

### Step 1: Start Backend
Open a terminal and run:
```bash
cd <backend-directory>
python main.py
```
Backend should now be running on http://localhost:8000

### Step 2: Open Frontend
**Option A - Standalone (Easiest)**:
Simply double-click `index.html` or drag it into your browser.

**Option B - With npm (Better for development)**:
```bash
npm install
npm run dev
```
Frontend will open at http://localhost:3000

### Step 3: Use the Application

**Generate Rules:**
1. Click "Generate Rules" tab
2. Upload a CSV file with transaction data
3. Enter a date (DD/MM/YYYY)
4. Click "Generate Rules"

**Detect Fraud:**
1. Click "Detect Fraud" tab
2. Upload a CSV file with transaction data
3. Enter detection date (DD/MM/YYYY)
4. Enter rules date (DD/MM/YYYY) - must match a previously generated rules file
5. Click "Detect & Download Results"
6. CSV file will automatically download

## Files Included

```
fraud-detection-frontend/
├── index.html              ⭐ STANDALONE VERSION - Just open in browser!
├── package.json            📦 npm dependencies
├── vite.config.js         ⚙️  Vite configuration
├── index-vite.html        📄 HTML for npm build
├── .gitignore             🚫 Git ignore rules
├── FRONTEND_README.md     📖 Full documentation
├── QUICK_START.md         🚀 This file
└── src/
    ├── main.jsx           🎯 Entry point for npm build
    └── App.jsx            ⚛️  Main React component
```

## Required CSV Format

Your CSV files must have these columns:
- account_number
- transaction_id
- transaction_timestamp (format: DD/MM/YYYY HH:MM:SS)
- transaction_amount
- cr_dr_ind (C or D)
- New Beneficiary Flag (0 or 1)
- device_id
- transaction_type_code

## Common Issues

**"Network error"** → Backend not running. Start it with `python main.py`

**"Rules file not found"** → Generate rules first before detecting fraud

**"Invalid date format"** → Use DD/MM/YYYY format (e.g., 31/12/2023)

## Next Steps

Read `FRONTEND_README.md` for:
- Detailed usage instructions
- Troubleshooting guide
- Configuration options
- Development tips

---

**Need Help?** Check FRONTEND_README.md or contact the development team.
