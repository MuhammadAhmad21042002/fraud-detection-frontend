import { useState, useEffect } from 'react'

// API Configuration
const API_BASE_URL = 'http://localhost:8000'

// Icon Components
const HomeIcon = () => (
  <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
)

const SearchIcon = () => (
  <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"></circle>
    <path d="m21 21-4.35-4.35"></path>
  </svg>
)

const UploadCloudIcon = ({ size = 60, className = '' }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M17 21H7a4 4 0 01-4-4V9a4 4 0 014-4h10a4 4 0 014 4v8a4 4 0 01-4 4z"></path>
    <path d="M8 11l4-4 4 4"></path>
    <path d="M12 7v10"></path>
  </svg>
)

const CheckCircleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
)

const AlertCircleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="8" x2="12" y2="12"></line>
    <line x1="12" y1="16" x2="12.01" y2="16"></line>
  </svg>
)

const UploadIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="17 8 12 3 7 8"></polyline>
    <line x1="12" y1="3" x2="12" y2="15"></line>
  </svg>
)

const DownloadIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
)

const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
)

function App() {
  const [activeTab, setActiveTab] = useState('generate')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const [availableRules, setAvailableRules] = useState([])
  const [loadingRules, setLoadingRules] = useState(false)

  // Generate Rules State
  const [rulesFile, setRulesFile] = useState(null)
  const [rulesDate, setRulesDate] = useState('')

  // Detect Fraud State
  const [detectFile, setDetectFile] = useState(null)
  const [detectionDate, setDetectionDate] = useState('')
  const [ruleFileDate, setRuleFileDate] = useState('')
  const [selectedRuleIndex, setSelectedRuleIndex] = useState(null)

  // Drag and drop states
  const [isDragging, setIsDragging] = useState(false)

  // Fetch available rules when detect tab is opened
  useEffect(() => {
    if (activeTab === 'detect') {
      fetchAvailableRules()
    }
  }, [activeTab])

  const fetchAvailableRules = async () => {
    setLoadingRules(true)
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/rules/list`)
      if (response.ok) {
        const data = await response.json()
        setAvailableRules(data.rules_files || [])
      }
    } catch (error) {
      console.error('Error fetching rules:', error)
    } finally {
      setLoadingRules(false)
    }
  }

  const validateDate = (dateStr) => {
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/
    if (!regex.test(dateStr)) return false
    const [, day, month, year] = regex.exec(dateStr)
    const date = new Date(year, month - 1, day)
    return date.getFullYear() == year && date.getMonth() == month - 1 && date.getDate() == day
  }

  const handleGenerateRules = async () => {
    if (!rulesFile) {
      setMessage({ type: 'error', text: 'Please upload a CSV file' })
      return
    }

    if (!validateDate(rulesDate)) {
      setMessage({ type: 'error', text: 'Please enter a valid date in DD/MM/YYYY format' })
      return
    }

    setLoading(true)
    setMessage(null)

    const formData = new FormData()
    formData.append('file', rulesFile)
    formData.append('input_date', rulesDate)

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/generate-rules`, {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({
          type: 'success',
          text: `Rules generated successfully for ${data.accounts_processed} accounts. Rules file: ${data.rules_file}`
        })
        setRulesFile(null)
        setRulesDate('')
        fetchAvailableRules()
      } else {
        setMessage({ type: 'error', text: data.detail || 'Failed to generate rules' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please ensure the backend is running.' })
    } finally {
      setLoading(false)
    }
  }

  const handleDetectFraud = async () => {
    if (!detectFile) {
      setMessage({ type: 'error', text: 'Please upload a CSV file' })
      return
    }

    if (!validateDate(detectionDate) || !validateDate(ruleFileDate)) {
      setMessage({ type: 'error', text: 'Please enter valid dates in DD/MM/YYYY format' })
      return
    }

    setLoading(true)
    setMessage(null)

    const formData = new FormData()
    formData.append('file', detectFile)
    formData.append('detection_date', detectionDate)
    formData.append('rules_date', ruleFileDate)

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/detect-fraud`, {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const blob = await response.blob()
        const contentDisposition = response.headers.get('Content-Disposition')
        const filenameMatch = contentDisposition && contentDisposition.match(/filename="?(.+)"?/)
        const filename = filenameMatch ? filenameMatch[1] : `fraud_detection_results_${Date.now()}.csv`

        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)

        setMessage({
          type: 'success',
          text: `Fraud detection completed! Results downloaded as ${filename}`
        })

        setDetectFile(null)
        setDetectionDate('')
        setRuleFileDate('')
        setSelectedRuleIndex(null)
      } else {
        const data = await response.json()
        setMessage({ type: 'error', text: data.detail || 'Failed to detect fraud' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please ensure the backend is running.' })
    } finally {
      setLoading(false)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && droppedFile.name.endsWith('.csv')) {
      if (activeTab === 'generate') {
        setRulesFile(droppedFile)
      } else {
        setDetectFile(droppedFile)
      }
    }
  }

  const handleFileInput = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (activeTab === 'generate') {
        setRulesFile(file)
      } else {
        setDetectFile(file)
      }
    }
    // Reset input value to allow selecting the same file again
    e.target.value = ''
  }

  const selectRule = (rule, index) => {
    setRuleFileDate(rule.date)
    setSelectedRuleIndex(index)
  }

  const currentFile = activeTab === 'generate' ? rulesFile : detectFile

  return (
    <div className="app">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-logo">
          <HomeIcon />
        </div>
        <div className="sidebar-icon active">
          <SearchIcon />
        </div>
        <div className="sidebar-settings">
          <div className="sidebar-icon">⚙</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <div className="header">
          <div className="breadcrumb">
            <span>Home</span>
            <span>›</span>
            <span className="breadcrumb-active">Knowledge Base</span>
          </div>
          <div className="header-right">
            <div className="notification-icon">
              🔔
              <span className="notification-badge">1</span>
            </div>
            <div className="theme-toggle">🌙</div>
            <div className="user-avatar"></div>
          </div>
        </div>

        {/* Content */}
        <div className="content">
          <div className="content-header">
            <h1 className="content-title">Fraud Detection</h1>
            <p className="content-subtitle">Manage your organization's documents and files</p>
          </div>

          {/* Tabs */}
          <div className="tabs">
            <button
              className={`tab ${activeTab === 'generate' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('generate')
                setMessage(null)
              }}
            >
              Generate Rules
            </button>
            <button
              className={`tab ${activeTab === 'detect' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('detect')
                setMessage(null)
              }}
            >
              Detect Fraud
            </button>
          </div>

          {/* Message */}
          {message && (
            <div className={`message ${message.type}`}>
              <div className="message-icon">
                {message.type === 'success' ? <CheckCircleIcon /> : <AlertCircleIcon />}
              </div>
              <div className="message-text">{message.text}</div>
              <div className="message-close" onClick={() => setMessage(null)}>
                <XIcon />
              </div>
            </div>
          )}

          {/* Search and Upload Bar */}
          <div className="action-bar">
            <div style={{ position: 'relative', flex: 1 }}>
              <span className="search-icon"><SearchIcon /></span>
              <input
                type="text"
                className="search-box"
                placeholder="Search files and folders..."
              />
            </div>
            <input
              type="file"
              id="file-input"
              accept=".csv"
              onChange={handleFileInput}
              style={{ display: 'none' }}
            />
            <button
              className="upload-btn"
              onClick={() => document.getElementById('file-input').click()}
            >
              <UploadIcon />
              Upload
            </button>
          </div>

          {/* Upload Area */}
          <div
            className={`upload-area ${isDragging ? 'dragging' : ''} ${currentFile ? 'has-file' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-input').click()}
          >
            {currentFile ? (
              <>
                <UploadCloudIcon className="upload-icon success" />
                <div className="file-info">
                  <div className="file-name">{currentFile.name}</div>
                  <div className="file-size">{(currentFile.size / 1024).toFixed(2)} KB</div>
                </div>
              </>
            ) : (
              <>
                <UploadCloudIcon className="upload-icon" />
                <div className="upload-title">This folder is empty</div>
                <div className="upload-subtitle">
                  Right-click for options, or drag & drop files here
                </div>
                <button className="upload-button-center">
                  <UploadIcon />
                  Upload Files
                </button>
              </>
            )}
          </div>

          {/* Bottom Section */}
          {activeTab === 'generate' && (
            <div className="bottom-section">
              <div className="form-row form-row-single">
                <div className="form-group">
                  <label className="form-label">Reference Date</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="06/06/2024"
                    value={rulesDate}
                    onChange={(e) => setRulesDate(e.target.value)}
                    maxLength={10}
                  />
                  <div className="form-hint">
                    Rules will be generated from 3 months before this date
                  </div>
                </div>
              </div>

              <button
                className="action-button"
                onClick={handleGenerateRules}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="spinner"></div>
                    Processing...
                  </>
                ) : (
                  'Generate Rules'
                )}
              </button>
            </div>
          )}

          {activeTab === 'detect' && (
            <div className="bottom-section">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Detection Date</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="06/06/2024"
                    value={detectionDate}
                    onChange={(e) => setDetectionDate(e.target.value)}
                    maxLength={10}
                  />
                  <div className="form-hint">Date to analyse for fraud</div>
                </div>

                <div className="form-group">
                  <label className="form-label">Rules date</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="06/06/2024"
                    value={ruleFileDate}
                    onChange={(e) => setRuleFileDate(e.target.value)}
                    maxLength={10}
                  />
                  <div className="form-hint">Date of rules file to use</div>
                </div>
              </div>

              {/* Available Rules */}
              <div className="rules-section">
                <div className="rules-header">Available Rules File</div>
                <div className="rules-list">
                  {loadingRules ? (
                    <div className="no-rules">Loading rules...</div>
                  ) : availableRules.length === 0 ? (
                    <div className="no-rules">No rules files available</div>
                  ) : (
                    availableRules.map((rule, index) => (
                      <div
                        key={index}
                        className={`rule-item ${selectedRuleIndex === index ? 'selected' : ''}`}
                        onClick={() => selectRule(rule, index)}
                      >
                        <div className="rule-date">{rule.date}</div>
                        <div className="rule-filename">{rule.filename}</div>
                        <div className="rule-meta">
                          {rule.size_kb}KB • Created {rule.created}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <button
                className="action-button"
                onClick={handleDetectFraud}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="spinner"></div>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <DownloadIcon />
                    Detect and download results
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
