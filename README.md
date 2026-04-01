# UBL Fraud Detection - Redesigned Frontend (Node.js/React)

Modern knowledge base style frontend built with React 18 and Vite.

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ (check with `node --version`)
- npm (comes with Node.js)

### Installation

```bash
# 1. Navigate to project folder
cd redesigned-frontend-react

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

The application will open automatically at `http://localhost:3000`

## 📦 Project Structure

```
redesigned-frontend-react/
├── src/
│   ├── App.jsx          # Main application component
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── index.html           # HTML template
├── package.json         # Dependencies
├── vite.config.js       # Vite configuration
└── README.md           # This file
```

## 🎨 Features

- ✅ Modern knowledge base UI design
- ✅ Sidebar navigation
- ✅ Drag-and-drop file upload
- ✅ Two tabs: Generate Rules & Detect Fraud
- ✅ Real-time rules list fetching
- ✅ Click-to-select rules files
- ✅ Date validation
- ✅ Success/error messages
- ✅ Loading states
- ✅ Responsive design
- ✅ Dark professional theme

## 🔧 Available Scripts

```bash
# Start development server (with hot reload)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🌐 Backend Configuration

Make sure your backend is running on `http://localhost:8000`

If your backend URL is different, edit `src/App.jsx`:

```javascript
const API_BASE_URL = 'http://your-backend-url:port'
```

## 📝 Usage

### Generate Rules
1. Click "Generate Rules" tab
2. Upload CSV file (drag & drop or click upload)
3. Enter reference date (DD/MM/YYYY format)
4. Click "Generate Rules"

### Detect Fraud
1. Click "Detect Fraud" tab
2. Upload transaction CSV file
3. Enter detection date
4. Select rules file from the list (or enter rules date manually)
5. Click "Detect and download results"

## 🎯 CSV Format

Your CSV files should have these columns:
- account_number
- transaction_id
- transaction_timestamp (DD/MM/YYYY HH:MM:SS)
- transaction_amount
- cr_dr_ind (C or D)
- New Beneficiary Flag (0 or 1)
- device_id
- transaction_type_code

## 🛠️ Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **CSS3** - Styling (no frameworks)

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🚨 Troubleshooting

### Port already in use
If port 3000 is busy, Vite will automatically try the next available port.

### Backend connection error
Ensure your backend is running:
```bash
cd backend
python main.py
```

### Module not found errors
Delete `node_modules` and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

## 🔥 Hot Module Replacement

Changes to your code will automatically reflect in the browser without page refresh!

## 📦 Building for Production

```bash
# Create optimized production build
npm run build

# Output will be in the 'dist' folder
# You can serve it with any static file server
```

## 🎨 Customization

### Change Colors
Edit `src/index.css` and modify the color values:
- Background: `#0d0d0d`
- Cards: `#1a1a1a`
- Accent: `#4CAF50`

### Change API URL
Edit `src/App.jsx`:
```javascript
const API_BASE_URL = 'http://your-url'
```

### Change Port
Edit `vite.config.js`:
```javascript
server: {
  port: 3000  // Change to your desired port
}
```

## 📄 License

MIT

## 🆘 Need Help?

If you encounter any issues:
1. Make sure Node.js 16+ is installed
2. Delete `node_modules` and run `npm install` again
3. Check that backend is running
4. Check browser console for errors

---

**Enjoy the redesigned interface!** 🎉
