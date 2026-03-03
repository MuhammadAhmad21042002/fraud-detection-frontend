import React, { useState } from 'react';
import { Upload, CheckCircle, AlertCircle, Download, Calendar, Shield, Database, TrendingUp } from 'lucide-react';

// API Configuration
const API_BASE_URL = 'http://localhost:8000';

const FraudDetectionApp = () => {
  const [activeTab, setActiveTab] = useState('generate');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Generate Rules State
  const [rulesFile, setRulesFile] = useState(null);
  const [rulesDate, setRulesDate] = useState('');

  // Detect Fraud State
  const [detectFile, setDetectFile] = useState(null);
  const [detectionDate, setDetectionDate] = useState('');
  const [ruleFileDate, setRuleFileDate] = useState('');

  const formatDateForDisplay = (dateStr) => {
    if (!dateStr) return '';
    const [day, month, year] = dateStr.split('/');
    return `${day}/${month}/${year}`;
  };

  const validateDate = (dateStr) => {
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    if (!regex.test(dateStr)) return false;
    const [, day, month, year] = regex.exec(dateStr);
    const date = new Date(year, month - 1, day);
    return date.getFullYear() == year && date.getMonth() == month - 1 && date.getDate() == day;
  };

  const handleGenerateRules = async (e) => {
    e.preventDefault();
    
    if (!rulesFile) {
      setMessage({ type: 'error', text: 'Please upload a CSV file' });
      return;
    }

    if (!validateDate(rulesDate)) {
      setMessage({ type: 'error', text: 'Please enter a valid date in DD/MM/YYYY format' });
      return;
    }

    setLoading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append('file', rulesFile);
    formData.append('input_date', rulesDate);

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/generate-rules`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: 'success',
          text: `Rules generated successfully for ${data.accounts_processed} accounts. Rules file: ${data.rules_file}`,
          details: data
        });
        setRulesFile(null);
        setRulesDate('');
        document.getElementById('rules-file-input').value = '';
      } else {
        setMessage({ type: 'error', text: data.detail || 'Failed to generate rules' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please ensure the backend is running.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDetectFraud = async (e) => {
    e.preventDefault();

    if (!detectFile) {
      setMessage({ type: 'error', text: 'Please upload a CSV file' });
      return;
    }

    if (!validateDate(detectionDate) || !validateDate(ruleFileDate)) {
      setMessage({ type: 'error', text: 'Please enter valid dates in DD/MM/YYYY format' });
      return;
    }

    setLoading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append('file', detectFile);
    formData.append('detection_date', detectionDate);
    formData.append('rules_date', ruleFileDate);

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/detect-fraud`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        // Get the blob from response
        const blob = await response.blob();
        
        // Extract filename from Content-Disposition header
        const contentDisposition = response.headers.get('Content-Disposition');
        const filenameMatch = contentDisposition && contentDisposition.match(/filename="?(.+)"?/);
        const filename = filenameMatch ? filenameMatch[1] : `fraud_detection_results_${Date.now()}.csv`;

        // Create download link
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        setMessage({
          type: 'success',
          text: `Fraud detection completed! Results downloaded as ${filename}`
        });
        
        setDetectFile(null);
        setDetectionDate('');
        setRuleFileDate('');
        document.getElementById('detect-file-input').value = '';
      } else {
        const data = await response.json();
        setMessage({ type: 'error', text: data.detail || 'Failed to detect fraud' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please ensure the backend is running.' });
    } finally {
      setLoading(false);
    }
  };

  const FileUploadZone = ({ file, onChange, id, accept = ".csv" }) => {
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = (e) => {
      e.preventDefault();
      setIsDragging(true);
    };

    const handleDragLeave = () => {
      setIsDragging(false);
    };

    const handleDrop = (e) => {
      e.preventDefault();
      setIsDragging(false);
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile && droppedFile.name.endsWith('.csv')) {
        onChange(droppedFile);
      }
    };

    return (
      <div
        className={`upload-zone ${isDragging ? 'dragging' : ''} ${file ? 'has-file' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id={id}
          accept={accept}
          onChange={(e) => onChange(e.target.files[0])}
          style={{ display: 'none' }}
        />
        <label htmlFor={id} className="upload-label">
          {file ? (
            <>
              <CheckCircle size={32} className="upload-icon success" />
              <div className="file-name">{file.name}</div>
              <div className="file-size">{(file.size / 1024).toFixed(2)} KB</div>
            </>
          ) : (
            <>
              <Upload size={32} className="upload-icon" />
              <div className="upload-text">
                <strong>Drop CSV file here</strong> or click to browse
              </div>
              <div className="upload-hint">Maximum file size: 50MB</div>
            </>
          )}
        </label>
      </div>
    );
  };

  return (
    <div className="app-container">
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <Shield size={32} />
            <div className="logo-text">
              <h1>UBL Fraud Detection</h1>
              <p>United Bank Limited</p>
            </div>
          </div>
          <div className="header-stats">
            <div className="stat">
              <Database size={18} />
              <span>Real-time Analysis</span>
            </div>
            <div className="stat">
              <TrendingUp size={18} />
              <span>AI-Powered</span>
            </div>
          </div>
        </div>
      </header>

      <nav className="tab-navigation">
        <button
          className={`tab ${activeTab === 'generate' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('generate');
            setMessage(null);
          }}
        >
          <Calendar size={20} />
          Generate Rules
        </button>
        <button
          className={`tab ${activeTab === 'detect' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('detect');
            setMessage(null);
          }}
        >
          <Shield size={20} />
          Detect Fraud
        </button>
      </nav>

      <main className="main-content">
        {message && (
          <div className={`message ${message.type}`}>
            {message.type === 'success' ? (
              <CheckCircle size={20} />
            ) : (
              <AlertCircle size={20} />
            )}
            <div className="message-content">
              <div className="message-text">{message.text}</div>
              {message.details && (
                <div className="message-details">
                  <div>Date Range: {message.details.date_range.start} to {message.details.date_range.end}</div>
                  <div>Accounts Processed: {message.details.accounts_processed}</div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'generate' && (
          <div className="panel">
            <div className="panel-header">
              <h2>Generate Fraud Detection Rules</h2>
              <p>Analyze historical transaction data to create account-specific behavioral rules</p>
            </div>

            <form onSubmit={handleGenerateRules} className="form">
              <div className="form-group">
                <label className="form-label">
                  <Database size={18} />
                  Transaction Data (CSV)
                </label>
                <FileUploadZone
                  file={rulesFile}
                  onChange={setRulesFile}
                  id="rules-file-input"
                />
                <div className="form-hint">
                  Required columns: account_number, transaction_id, transaction_timestamp, 
                  transaction_amount, cr_dr_ind, New Beneficiary Flag, device_id, transaction_type_code
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="rules-date">
                  <Calendar size={18} />
                  Reference Date
                </label>
                <input
                  type="text"
                  id="rules-date"
                  className="date-input"
                  placeholder="DD/MM/YYYY"
                  value={rulesDate}
                  onChange={(e) => setRulesDate(e.target.value)}
                  maxLength={10}
                />
                <div className="form-hint">
                  Rules will be generated from 3 months before this date
                </div>
              </div>

              <button
                type="submit"
                className="submit-button"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="spinner" />
                    Processing...
                  </>
                ) : (
                  <>
                    <TrendingUp size={20} />
                    Generate Rules
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'detect' && (
          <div className="panel">
            <div className="panel-header">
              <h2>Detect Fraudulent Transactions</h2>
              <p>Apply detection rules to identify potentially fraudulent activities</p>
            </div>

            <form onSubmit={handleDetectFraud} className="form">
              <div className="form-group">
                <label className="form-label">
                  <Database size={18} />
                  Transaction Data (CSV)
                </label>
                <FileUploadZone
                  file={detectFile}
                  onChange={setDetectFile}
                  id="detect-file-input"
                />
                <div className="form-hint">
                  Upload transaction data for fraud analysis
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="detection-date">
                    <Calendar size={18} />
                    Detection Date
                  </label>
                  <input
                    type="text"
                    id="detection-date"
                    className="date-input"
                    placeholder="DD/MM/YYYY"
                    value={detectionDate}
                    onChange={(e) => setDetectionDate(e.target.value)}
                    maxLength={10}
                  />
                  <div className="form-hint">Date to analyze for fraud</div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="rules-file-date">
                    <Shield size={18} />
                    Rules Date
                  </label>
                  <input
                    type="text"
                    id="rules-file-date"
                    className="date-input"
                    placeholder="DD/MM/YYYY"
                    value={ruleFileDate}
                    onChange={(e) => setRuleFileDate(e.target.value)}
                    maxLength={10}
                  />
                  <div className="form-hint">Date of rules file to use</div>
                </div>
              </div>

              <button
                type="submit"
                className="submit-button detect"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="spinner" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Download size={20} />
                    Detect & Download Results
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </main>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          background: linear-gradient(135deg, #0f1419 0%, #1a2332 100%);
          min-height: 100vh;
          color: #e4e7eb;
        }

        .app-container {
          min-height: 100vh;
          padding-bottom: 40px;
        }

        .header {
          background: rgba(15, 20, 25, 0.8);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(52, 211, 153, 0.1);
          padding: 24px 0;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .header-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 32px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .logo svg {
          color: #34d399;
          filter: drop-shadow(0 0 8px rgba(52, 211, 153, 0.3));
        }

        .logo-text h1 {
          font-size: 24px;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: -0.5px;
        }

        .logo-text p {
          font-size: 13px;
          color: #9ca3af;
          margin-top: 2px;
        }

        .header-stats {
          display: flex;
          gap: 24px;
        }

        .stat {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #9ca3af;
        }

        .stat svg {
          color: #34d399;
        }

        .tab-navigation {
          max-width: 1200px;
          margin: 32px auto 0;
          padding: 0 32px;
          display: flex;
          gap: 12px;
          border-bottom: 2px solid rgba(52, 211, 153, 0.1);
        }

        .tab {
          background: transparent;
          border: none;
          padding: 16px 24px;
          font-size: 15px;
          font-weight: 600;
          color: #9ca3af;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          border-bottom: 3px solid transparent;
          transition: all 0.3s ease;
          position: relative;
          bottom: -2px;
        }

        .tab:hover {
          color: #d1d5db;
          background: rgba(52, 211, 153, 0.05);
        }

        .tab.active {
          color: #34d399;
          border-bottom-color: #34d399;
        }

        .tab svg {
          transition: transform 0.3s ease;
        }

        .tab.active svg {
          transform: scale(1.1);
        }

        .main-content {
          max-width: 800px;
          margin: 40px auto;
          padding: 0 32px;
        }

        .message {
          background: rgba(52, 211, 153, 0.1);
          border: 1px solid #34d399;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 32px;
          display: flex;
          gap: 16px;
          animation: slideIn 0.3s ease;
        }

        .message.error {
          background: rgba(239, 68, 68, 0.1);
          border-color: #ef4444;
        }

        .message svg {
          flex-shrink: 0;
          margin-top: 2px;
        }

        .message.success svg {
          color: #34d399;
        }

        .message.error svg {
          color: #ef4444;
        }

        .message-content {
          flex: 1;
        }

        .message-text {
          font-size: 15px;
          font-weight: 500;
          margin-bottom: 8px;
        }

        .message-details {
          font-size: 13px;
          color: #9ca3af;
          margin-top: 8px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .panel {
          background: rgba(26, 35, 50, 0.6);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(52, 211, 153, 0.15);
          border-radius: 16px;
          padding: 32px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
          animation: fadeIn 0.4s ease;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .panel-header {
          margin-bottom: 32px;
          padding-bottom: 20px;
          border-bottom: 1px solid rgba(52, 211, 153, 0.1);
        }

        .panel-header h2 {
          font-size: 22px;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 8px;
        }

        .panel-header p {
          font-size: 14px;
          color: #9ca3af;
        }

        .form {
          display: flex;
          flex-direction: column;
          gap: 28px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .form-label {
          font-size: 14px;
          font-weight: 600;
          color: #d1d5db;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .form-label svg {
          color: #34d399;
        }

        .form-hint {
          font-size: 13px;
          color: #6b7280;
          line-height: 1.5;
        }

        .upload-zone {
          background: rgba(15, 20, 25, 0.6);
          border: 2px dashed rgba(52, 211, 153, 0.3);
          border-radius: 12px;
          padding: 40px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .upload-zone:hover {
          border-color: rgba(52, 211, 153, 0.6);
          background: rgba(15, 20, 25, 0.8);
        }

        .upload-zone.dragging {
          border-color: #34d399;
          background: rgba(52, 211, 153, 0.1);
          transform: scale(1.02);
        }

        .upload-zone.has-file {
          border-color: #34d399;
          background: rgba(52, 211, 153, 0.05);
        }

        .upload-label {
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .upload-icon {
          color: #34d399;
          transition: transform 0.3s ease;
        }

        .upload-icon.success {
          animation: bounce 0.5s ease;
        }

        @keyframes bounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        .upload-zone:hover .upload-icon {
          transform: translateY(-4px);
        }

        .upload-text {
          font-size: 15px;
          color: #d1d5db;
        }

        .upload-text strong {
          color: #34d399;
        }

        .upload-hint {
          font-size: 13px;
          color: #6b7280;
        }

        .file-name {
          font-size: 15px;
          font-weight: 600;
          color: #34d399;
        }

        .file-size {
          font-size: 13px;
          color: #9ca3af;
        }

        .date-input {
          background: rgba(15, 20, 25, 0.6);
          border: 1px solid rgba(52, 211, 153, 0.2);
          border-radius: 8px;
          padding: 14px 16px;
          font-size: 15px;
          color: #e4e7eb;
          transition: all 0.3s ease;
          font-family: 'Monaco', 'Courier New', monospace;
          letter-spacing: 0.5px;
        }

        .date-input:focus {
          outline: none;
          border-color: #34d399;
          background: rgba(15, 20, 25, 0.8);
          box-shadow: 0 0 0 3px rgba(52, 211, 153, 0.1);
        }

        .date-input::placeholder {
          color: #6b7280;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .submit-button {
          background: linear-gradient(135deg, #34d399 0%, #10b981 100%);
          border: none;
          border-radius: 10px;
          padding: 16px 32px;
          font-size: 15px;
          font-weight: 600;
          color: #0f1419;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.3s ease;
          margin-top: 8px;
          box-shadow: 0 4px 12px rgba(52, 211, 153, 0.3);
        }

        .submit-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(52, 211, 153, 0.4);
        }

        .submit-button:active:not(:disabled) {
          transform: translateY(0);
        }

        .submit-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .submit-button.detect {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        .submit-button.detect:hover:not(:disabled) {
          box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
        }

        .spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(15, 20, 25, 0.3);
          border-top-color: #0f1419;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .header-content {
            padding: 0 20px;
            flex-direction: column;
            gap: 16px;
            align-items: flex-start;
          }

          .header-stats {
            width: 100%;
            justify-content: space-between;
          }

          .tab-navigation {
            padding: 0 20px;
          }

          .main-content {
            padding: 0 20px;
          }

          .panel {
            padding: 24px;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .upload-zone {
            padding: 30px 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default FraudDetectionApp;
