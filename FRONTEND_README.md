# UBL Fraud Detection System - Frontend

A modern, professional React-based frontend for the United Bank Limited Fraud Detection System. This application provides an intuitive interface for generating fraud detection rules and analyzing transactions for potential fraudulent activities.

## 🎨 Features

- **Clean, Modern UI**: Professional banking-grade interface with smooth animations
- **Dual Functionality**: 
  - Generate fraud detection rules from historical data
  - Detect fraud in real-time transactions
- **Drag & Drop File Upload**: Easy CSV file handling with visual feedback
- **Real-time Validation**: Input validation for dates and file formats
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Loading States**: Clear visual feedback during API operations
- **Error Handling**: User-friendly error messages and status updates

## 🚀 Quick Start

### Option 1: Standalone HTML (Easiest)

The simplest way to run the frontend is using the standalone HTML file:

1. **Open the file**:
   ```bash
   # Simply open index.html in your browser
   open index.html
   # or
   chrome index.html
   # or double-click the file
   ```

2. **That's it!** The application will run directly in your browser using CDN-hosted React libraries.

**Note**: Make sure your backend is running on `http://localhost:8000`

### Option 2: Vite Development Server (Recommended for Development)

For a better development experience with hot module replacement:

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```

3. **Open Browser**:
   The application will automatically open at `http://localhost:3000`

4. **Build for Production**:
   ```bash
   npm run build
   ```

## 📋 Prerequisites

- **Backend**: The FastAPI backend must be running on `http://localhost:8000`
- **Node.js**: Version 16+ (only needed for npm-based setup)
- **Modern Browser**: Chrome, Firefox, Safari, or Edge

## 🏗️ Project Structure

```
fraud-detection-frontend/
├── index.html                    # Standalone version (CDN-based)
├── package.json                  # NPM dependencies
├── vite.config.js               # Vite configuration
├── vite-index.html              # Index for Vite build
├── src/
│   ├── main.jsx                 # Vite entry point
│   └── App.jsx                  # Main React component
└── README.md                    # This file
```

## 🎯 Usage Guide

### Generate Fraud Detection Rules

1. **Navigate to "Generate Rules" tab**
2. **Upload CSV file** containing historical transaction data with these columns:
   - `account_number`
   - `transaction_id`
   - `transaction_timestamp` (DD/MM/YYYY HH:MM:SS)
   - `transaction_amount`
   - `cr_dr_ind` (C for Credit, D for Debit)
   - `New Beneficiary Flag` (0 or 1)
   - `device_id`
   - `transaction_type_code`

3. **Enter Reference Date** (DD/MM/YYYY format)
   - Rules will be generated from 3 months before this date

4. **Click "Generate Rules"**
   - Wait for processing
   - Success message will show number of accounts processed

### Detect Fraudulent Transactions

1. **Navigate to "Detect Fraud" tab**
2. **Upload CSV file** with transaction data (same format as above)
3. **Enter Detection Date** (DD/MM/YYYY)
   - The date you want to analyze for fraud
4. **Enter Rules Date** (DD/MM/YYYY)
   - The date of the rules file to use (must match a previously generated rules file)
5. **Click "Detect & Download Results"**
   - Processing will begin
   - Results CSV will automatically download
   - File contains all transactions marked as fraud/non-fraud

## 📊 Output Format

The fraud detection results CSV includes:

**Original Transaction Data**:
- All input columns

**Calculated Features**:
- `transaction_hour`
- `cumulative_daily_amount`
- `cumulative_daily_count`
- `cumulative_hourly_count`
- `cumulative_microfinance_daily_amount`

**Fraud Detection Flags** (0 or 1):
- `fraud_device_change`
- `fraud_daily_debit_count`
- `fraud_daily_debit_amt`
- `fraud_txn_amt`
- `fraud_hourly_count`
- `fraud_new_bene_high_transaction`
- `fraud_unusual_hour`
- `fraud_device_change_new_bene_bb_75k`

**Final Results**:
- `rule_based_fraud_score` (sum of all flags)
- `rule_based_fraud_detected` (True/False)

## ⚙️ Configuration

To change the backend API URL, edit the `API_BASE_URL` constant in the source files:

```javascript
const API_BASE_URL = 'http://localhost:8000'; // Change this
```

## 🎨 Design Features

- **Dark Theme**: Professional banking-grade dark theme
- **Gradient Accents**: Emerald green (#34d399) for trust and security
- **Smooth Animations**: Polished transitions and micro-interactions
- **Glassmorphism**: Backdrop blur effects for modern aesthetics
- **Responsive Layout**: Adapts to all screen sizes

## 🔧 Development

### Making Changes

1. Edit `src/App.jsx` for component logic
2. CSS is embedded in the component (styled-jsx approach)
3. Changes auto-reload with Vite dev server

### Building for Production

```bash
npm run build
```

Output will be in the `dist/` folder, ready for deployment.

## 🐛 Troubleshooting

### Backend Connection Issues

**Error**: "Network error. Please ensure the backend is running"

**Solution**:
- Verify backend is running: `python main.py`
- Check backend URL is `http://localhost:8000`
- Ensure CORS is enabled in backend (should be by default)

### File Upload Issues

**Error**: "Missing required columns"

**Solution**:
- Verify CSV has all required columns
- Check column names match exactly (case-sensitive)
- Ensure CSV is properly formatted

### Rules File Not Found

**Error**: "Rules file not found for date..."

**Solution**:
- Generate rules first using "Generate Rules" tab
- Ensure the rules date matches a previously generated rules file
- Check the rules date format (DD/MM/YYYY)

### Date Format Issues

**Error**: "Please enter a valid date in DD/MM/YYYY format"

**Solution**:
- Use exact format: DD/MM/YYYY (e.g., 31/12/2023)
- Ensure day and month have leading zeros (01, not 1)
- Validate the date is actually valid (e.g., not 31/02/2023)

## 🔐 Security Notes

- This frontend is designed for internal use within UBL's secure network
- All API communication should be over HTTPS in production
- Implement proper authentication/authorization in production
- CSV files may contain sensitive financial data - handle appropriately

## 📝 Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 🤝 Support

For technical support or questions:
- Check backend logs for API errors
- Verify CSV file format matches requirements
- Ensure all required backend dependencies are installed

## 📄 License

Proprietary - United Bank Limited

---

**Version**: 1.0.0  
**Last Updated**: February 2026  
**Developed for**: United Bank Limited
