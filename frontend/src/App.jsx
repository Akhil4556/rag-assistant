import { useState, useRef } from "react";

const API = "http://127.0.0.1:8000";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'Inter', sans-serif;
    background: #0a0a0f;
    color: #e8e8f0;
    min-height: 100vh;
  }

  .app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 48px 20px;
    background: radial-gradient(ellipse 80% 60% at 50% -10%, rgba(99,102,241,0.15) 0%, transparent 70%);
  }

  .header {
    text-align: center;
    margin-bottom: 48px;
  }

  .badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(99,102,241,0.12);
    border: 1px solid rgba(99,102,241,0.3);
    color: #a5b4fc;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 6px 14px;
    border-radius: 100px;
    margin-bottom: 20px;
  }

  .badge-dot {
    width: 6px; height: 6px;
    background: #6366f1;
    border-radius: 50%;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(0.8); }
  }

  h1 {
    font-size: 42px;
    font-weight: 700;
    letter-spacing: -0.03em;
    line-height: 1.1;
    background: linear-gradient(135deg, #fff 40%, #a5b4fc 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 12px;
  }

  .subtitle {
    color: #6b6b8a;
    font-size: 16px;
    font-weight: 400;
  }

  .card {
    width: 100%;
    max-width: 680px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 20px;
    padding: 32px;
    margin-bottom: 16px;
    backdrop-filter: blur(10px);
  }

  .section-label {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #4b4b6a;
    margin-bottom: 16px;
  }

  /* Drop Zone */
  .drop-zone {
    border: 1.5px dashed rgba(99,102,241,0.3);
    border-radius: 14px;
    padding: 40px 24px;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s ease;
    background: rgba(99,102,241,0.03);
    position: relative;
  }

  .drop-zone:hover, .drop-zone.dragging {
    border-color: rgba(99,102,241,0.7);
    background: rgba(99,102,241,0.07);
  }

  .drop-zone input[type="file"] {
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
    width: 100%;
    height: 100%;
  }

  .drop-icon {
    font-size: 36px;
    margin-bottom: 12px;
    display: block;
  }

  .drop-title {
    font-size: 15px;
    font-weight: 500;
    color: #c8c8e0;
    margin-bottom: 6px;
  }

  .drop-sub {
    font-size: 13px;
    color: #4b4b6a;
  }

  /* File selected state */
  .file-selected {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    background: rgba(99,102,241,0.08);
    border: 1.5px solid rgba(99,102,241,0.35);
    border-radius: 14px;
    padding: 18px 24px;
    margin-top: 14px;
  }

  .file-icon {
    font-size: 22px;
  }

  .file-name {
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px;
    color: #a5b4fc;
    flex: 1;
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .change-btn {
    font-size: 12px;
    color: #6b6b8a;
    background: none;
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 6px;
    padding: 4px 10px;
    cursor: pointer;
    transition: all 0.15s;
    font-family: 'Inter', sans-serif;
  }

  .change-btn:hover {
    color: #c8c8e0;
    border-color: rgba(255,255,255,0.2);
  }

  /* Upload Button */
  .upload-btn {
    width: 100%;
    margin-top: 16px;
    padding: 13px;
    background: linear-gradient(135deg, #6366f1, #4f46e5);
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    font-family: 'Inter', sans-serif;
    letter-spacing: -0.01em;
  }

  .upload-btn:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 8px 25px rgba(99,102,241,0.35);
  }

  .upload-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  /* Status */
  .status {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 14px;
    padding: 12px 16px;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 500;
  }

  .status.success {
    background: rgba(34,197,94,0.08);
    border: 1px solid rgba(34,197,94,0.2);
    color: #86efac;
  }

  .status.error {
    background: rgba(239,68,68,0.08);
    border: 1px solid rgba(239,68,68,0.2);
    color: #fca5a5;
  }

  .status.loading {
    background: rgba(99,102,241,0.08);
    border: 1px solid rgba(99,102,241,0.2);
    color: #a5b4fc;
  }

  /* Ask Section */
  .ask-row {
    display: flex;
    gap: 10px;
    align-items: center;
  }

  .ask-input {
    flex: 1;
    padding: 13px 16px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 12px;
    color: #e8e8f0;
    font-size: 15px;
    font-family: 'Inter', sans-serif;
    outline: none;
    transition: border-color 0.2s;
  }

  .ask-input::placeholder { color: #3b3b5a; }

  .ask-input:focus {
    border-color: rgba(99,102,241,0.5);
    background: rgba(99,102,241,0.04);
  }

  .ask-btn {
    padding: 13px 22px;
    background: linear-gradient(135deg, #6366f1, #4f46e5);
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    font-family: 'Inter', sans-serif;
    white-space: nowrap;
  }

  .ask-btn:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 8px 25px rgba(99,102,241,0.35);
  }

  .ask-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  /* Answer */
  .answer-card {
    width: 100%;
    max-width: 680px;
    background: rgba(99,102,241,0.05);
    border: 1px solid rgba(99,102,241,0.15);
    border-radius: 20px;
    padding: 28px 32px;
    animation: fadeUp 0.3s ease;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .answer-q {
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #4b4b6a;
    margin-bottom: 8px;
  }

  .answer-question-text {
    font-size: 15px;
    color: #a5b4fc;
    font-weight: 500;
    margin-bottom: 20px;
    padding-bottom: 20px;
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }

  .answer-a {
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #4b4b6a;
    margin-bottom: 10px;
  }

  .answer-text {
    font-size: 15px;
    line-height: 1.7;
    color: #c8c8e0;
  }

  /* Thinking animation */
  .thinking {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #6b6b8a;
    font-size: 14px;
    padding: 8px 0;
  }

  .dot-bounce {
    display: flex; gap: 4px;
  }

  .dot-bounce span {
    width: 5px; height: 5px;
    background: #6366f1;
    border-radius: 50%;
    display: inline-block;
    animation: bounce 1.2s infinite;
  }

  .dot-bounce span:nth-child(2) { animation-delay: 0.15s; }
  .dot-bounce span:nth-child(3) { animation-delay: 0.3s; }

  @keyframes bounce {
    0%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(-6px); }
  }

  .hidden-input { display: none; }
`;

export default function App() {
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null); // {type, message}
  const [uploading, setUploading] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState(null);
  const [asking, setAsking] = useState(false);
  const fileInputRef = useRef(null);
  const changeInputRef = useRef(null);

  const handleFile = (f) => {
    if (f && f.type === "application/pdf") {
      setFile(f);
      setUploadStatus(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setUploadStatus({ type: "loading", message: "Uploading and processing PDF..." });

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${API}/upload`, { method: "POST", body: formData });
      const data = await res.json();
      setUploadStatus({ type: "success", message: `${data.message} — ${data.chunks_created} chunks indexed` });
    } catch {
      setUploadStatus({ type: "error", message: "Upload failed. Make sure the backend is running." });
    } finally {
      setUploading(false);
    }
  };

  const handleAsk = async () => {
    if (!question.trim() || asking) return;
    setAsking(true);
    setAnswer(null);

    try {
      const res = await fetch(`${API}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();
      setAnswer({ question, text: data.answer });
    } catch {
      setAnswer({ question, text: "Failed to get an answer. Is the backend running?" });
    } finally {
      setAsking(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="app">

        {/* Header */}
        <div className="header">
          <div className="badge">
            <span className="badge-dot" />
            AI Powered
          </div>
          <h1>RAG Assistant</h1>
          <p className="subtitle">Upload a PDF and ask anything about it</p>
        </div>

        {/* Upload Card */}
        <div className="card">
          <div className="section-label">Document</div>

          {/* Drop Zone (shown when no file) */}
          {!file && (
            <div
              className={`drop-zone ${dragging ? "dragging" : ""}`}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
            >
              <input
                type="file"
                accept=".pdf"
                ref={fileInputRef}
                onChange={(e) => handleFile(e.target.files[0])}
              />
              <span className="drop-icon">📄</span>
              <div className="drop-title">Drop your PDF here</div>
              <div className="drop-sub">or click to browse files</div>
            </div>
          )}

          {/* File Selected (shown in middle when file chosen) */}
          {file && (
            <div className="file-selected">
              <span className="file-icon">📄</span>
              <span className="file-name">{file.name}</span>
              <input
                type="file"
                accept=".pdf"
                ref={changeInputRef}
                className="hidden-input"
                onChange={(e) => { handleFile(e.target.files[0]); setUploadStatus(null); }}
              />
              <button className="change-btn" onClick={() => changeInputRef.current.click()}>
                Change
              </button>
            </div>
          )}

          {/* Upload Button */}
          <button
            className="upload-btn"
            onClick={handleUpload}
            disabled={!file || uploading}
          >
            {uploading ? "Processing..." : "Upload & Index PDF"}
          </button>

          {/* Status */}
          {uploadStatus && (
            <div className={`status ${uploadStatus.type}`}>
              <span>
                {uploadStatus.type === "success" ? "✅" : uploadStatus.type === "error" ? "❌" : "⏳"}
              </span>
              {uploadStatus.message}
            </div>
          )}
        </div>

        {/* Ask Card */}
        <div className="card">
          <div className="section-label">Ask a Question</div>
          <div className="ask-row">
            <input
              className="ask-input"
              type="text"
              placeholder="What is this document about?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAsk()}
            />
            <button className="ask-btn" onClick={handleAsk} disabled={asking || !question.trim()}>
              {asking ? "..." : "Ask"}
            </button>
          </div>

          {asking && (
            <div className="thinking">
              <div className="dot-bounce">
                <span /><span /><span />
              </div>
              Thinking...
            </div>
          )}
        </div>

        {/* Answer */}
        {answer && (
          <div className="answer-card">
            <div className="answer-q">Question</div>
            <div className="answer-question-text">{answer.question}</div>
            <div className="answer-a">Answer</div>
            <div className="answer-text">{answer.text}</div>
          </div>
        )}

      </div>
    </>
  );
}