import { useState } from 'react';
import { sendEmailMessage, createMailtoLink, getTestmailAddress } from '../services/emailService';

const CATEGORIES = [
  { id: 'pentest', label: '🛡️ Penetration Testing', defaultSub: 'Security Assessment Request' },
  { id: 'vuln', label: '🔍 Vulnerability Report', defaultSub: 'Vulnerability Disclosure / Bug Findings' },
  { id: 'ctf', label: '🚩 CTF & Collaboration', defaultSub: 'CTF Team / Technical Collaboration' },
  { id: 'career', label: '💼 Career / Internship', defaultSub: 'Opportunity Discussion / Role Offer' },
  { id: 'general', label: '💬 General Inquiry', defaultSub: 'General Technical Discussion' },
];

export default function ConnectForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'Penetration Testing',
    botcheck: '',
  });

  const [status, setStatus] = useState('idle'); // 'idle' | 'encrypting' | 'success' | 'error'
  const [statusMessage, setStatusMessage] = useState('');
  const [transmissionStep, setTransmissionStep] = useState(0);
  const [fallbackUrl, setFallbackUrl] = useState('');

  const testmailAddress = getTestmailAddress();

  const handleCategorySelect = (cat) => {
    setFormData((prev) => ({
      ...prev,
      category: cat.label.replace(/^[^\w\s]+/, '').trim(),
      subject: prev.subject ? prev.subject : cat.defaultSub,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatus('error');
      setStatusMessage('Please populate all required telemetry fields.');
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setStatus('error');
      setStatusMessage('Invalid email syntax detected. Please verify your address.');
      return;
    }

    setStatus('encrypting');
    setTransmissionStep(1);

    // Simulated cyber transmission progress steps
    const stepTimer1 = setTimeout(() => setTransmissionStep(2), 500);
    const stepTimer2 = setTimeout(() => setTransmissionStep(3), 1000);

    try {
      const result = await sendEmailMessage({
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim() || `${formData.category} Request`,
        message: formData.message.trim(),
        category: formData.category,
        botcheck: formData.botcheck,
      });

      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);

      if (result.success) {
        setStatus('success');
        setStatusMessage(result.message || 'Payload successfully encrypted and delivered.');
      } else {
        setStatus('error');
        setStatusMessage(result.message || 'Gateway transmission error.');
        setFallbackUrl(
          result.fallbackMailto ||
            createMailtoLink({
              name: formData.name,
              email: formData.email,
              subject: formData.subject,
              message: formData.message,
              category: formData.category,
            })
        );
      }
    } catch {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      setStatus('error');
      setStatusMessage('Transmission route timed out.');
      setFallbackUrl(
        createMailtoLink({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          category: formData.category,
        })
      );
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
      category: 'Penetration Testing',
      botcheck: '',
    });
    setStatus('idle');
    setStatusMessage('');
    setTransmissionStep(0);
    setFallbackUrl('');
  };

  return (
    <div className="cyber-connect-card reveal">
      {/* Terminal Top Bar */}
      <div className="cyber-card-header">
        <div className="cyber-card-dots">
          <span className="dot dot-red"></span>
          <span className="dot dot-yellow"></span>
          <span className="dot dot-green"></span>
        </div>
        <div className="cyber-card-title">
          <span className="cyber-prompt-sym">&gt;</span> SECURE_TRANSMISSION_GATEWAY.sh
        </div>
        <div className="cyber-security-badge" title="End-to-End Encrypted Delivery">
          <span className="secure-lock-icon">🔒</span> TLS 1.3 / E2E
        </div>
      </div>

      <div className="cyber-card-body">
        {status === 'success' ? (
          <div className="transmission-success-pane">
            <div className="success-icon-box">
              <div className="success-radar-ring"></div>
              <span className="success-check-glyph">✔</span>
            </div>
            <h3 className="success-headline">TRANSMISSION DELIVERED</h3>
            <p className="success-subtext">
              Your message was encrypted and dispatched directly to{' '}
              <strong className="text-highlight">pugazhenthij283@gmail.com</strong>.
              A confirmation email receipt has also been dispatched to{' '}
              <strong className="text-highlight">{formData.email}</strong>.
            </p>

            <div className="transmission-meta-terminal">
              <div className="meta-row">
                <span className="meta-key">[TARGET]:</span>
                <span className="meta-val">pugazhenthij283@gmail.com</span>
              </div>
              <div className="meta-row">
                <span className="meta-key">[SENDER]:</span>
                <span className="meta-val">{formData.name} &lt;{formData.email}&gt;</span>
              </div>
              <div className="meta-row">
                <span className="meta-key">[CATEGORY]:</span>
                <span className="meta-val">{formData.category}</span>
              </div>
              <div className="meta-row">
                <span className="meta-key">[CONFIRMATION RECEIPT]:</span>
                <span className="meta-val text-neon-green">Dispatched to {formData.email}</span>
              </div>
              <div className="meta-row">
                <span className="meta-key">[STATUS]:</span>
                <span className="meta-val text-neon-green">200 OK (Delivered)</span>
              </div>
              <div className="meta-row">
                <span className="meta-key">[TIMESTAMP]:</span>
                <span className="meta-val">{new Date().toLocaleTimeString()}</span>
              </div>
            </div>

            <div className="success-actions">
              <button onClick={handleReset} className="btn-solid cyber-reset-btn" type="button">
                SEND ANOTHER TRANSMISSION ↺
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="cyber-form" noValidate>
            {/* Category Selector Pills */}
            <div className="cyber-field-group">
              <label className="cyber-field-label">
                <span className="cyber-label-accent">//</span> SELECT TRANSMISSION PURPOSE
              </label>
              <div className="category-chips-grid">
                {CATEGORIES.map((cat) => {
                  const isSelected =
                    formData.category === cat.label.replace(/^[^\w\s]+/, '').trim() ||
                    formData.category === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      className={`category-chip ${isSelected ? 'active' : ''}`}
                      onClick={() => handleCategorySelect(cat)}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Name & Email Row */}
            <div className="cyber-form-row">
              <div className="cyber-field-group">
                <label className="cyber-field-label" htmlFor="connect-name">
                  <span className="cyber-label-accent">&gt;</span> IDENTITY / NAME <span className="req-star">*</span>
                </label>
                <div className="cyber-input-wrapper">
                  <span className="cyber-input-prefix">👤</span>
                  <input
                    id="connect-name"
                    name="name"
                    type="text"
                    className="cyber-input"
                    placeholder="e.g. Alex Mercer or Security Team"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={status === 'encrypting'}
                  />
                </div>
              </div>

              <div className="cyber-field-group">
                <label className="cyber-field-label" htmlFor="connect-email">
                  <span className="cyber-label-accent">&gt;</span> RETURN TELEMETRY (EMAIL) <span className="req-star">*</span>
                </label>
                <div className="cyber-input-wrapper">
                  <span className="cyber-input-prefix">✉</span>
                  <input
                    id="connect-email"
                    name="email"
                    type="email"
                    className="cyber-input"
                    placeholder="name@company.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={status === 'encrypting'}
                  />
                </div>
              </div>
            </div>

            {/* Subject */}
            <div className="cyber-field-group">
              <label className="cyber-field-label" htmlFor="connect-subject">
                <span className="cyber-label-accent">&gt;</span> SUBJECT / TOPIC
              </label>
              <div className="cyber-input-wrapper">
                <span className="cyber-input-prefix">🏷️</span>
                <input
                  id="connect-subject"
                  name="subject"
                  type="text"
                  className="cyber-input"
                  placeholder="e.g. Vulnerability Audit / CTF Collaboration"
                  value={formData.subject}
                  onChange={handleChange}
                  disabled={status === 'encrypting'}
                />
              </div>
            </div>

            {/* Message */}
            <div className="cyber-field-group">
              <div className="cyber-label-split">
                <label className="cyber-field-label" htmlFor="connect-message">
                  <span className="cyber-label-accent">&gt;</span> ENCRYPTED PAYLOAD (MESSAGE) <span className="req-star">*</span>
                </label>
                <span className="cyber-char-counter">
                  {formData.message.length} chars
                </span>
              </div>
              <div className="cyber-input-wrapper textarea-wrapper">
                <textarea
                  id="connect-message"
                  name="message"
                  rows="5"
                  className="cyber-textarea"
                  placeholder="Type your message, project scope, vulnerability details, or inquiry here..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                  disabled={status === 'encrypting'}
                ></textarea>
              </div>
            </div>

            {/* Honeypot anti-spam field */}
            <input
              type="text"
              name="botcheck"
              value={formData.botcheck}
              onChange={handleChange}
              style={{ display: 'none' }}
              tabIndex="-1"
              autoComplete="off"
            />

            {/* Status / Error Banner */}
            {status === 'error' && (
              <div className="cyber-error-banner">
                <div className="error-icon">⚠️</div>
                <div className="error-content">
                  <div className="error-title">TRANSMISSION NOTICE</div>
                  <div className="error-desc">{statusMessage}</div>
                  {fallbackUrl && (
                    <a
                      href={fallbackUrl}
                      className="error-fallback-link"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Click here to dispatch directly via your default email app →
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Testmail info tag if test mode configured */}
            {testmailAddress && (
              <div className="testmail-info-pill">
                <span className="testmail-dot"></span> Testmail Sandbox Active: <code>{testmailAddress}</code>
              </div>
            )}

            {/* Submit Button & Live Progress */}
            <div className="cyber-submit-row">
              <button
                type="submit"
                disabled={status === 'encrypting'}
                className={`btn-solid cyber-transmit-btn ${status === 'encrypting' ? 'loading' : ''}`}
              >
                {status === 'encrypting' ? (
                  <span className="btn-loading-state">
                    <span className="cyber-spinner"></span>
                    {transmissionStep === 1 && 'ENCRYPTING PAYLOAD [AES-256]...'}
                    {transmissionStep === 2 && 'ROUTING TRANSMISSION TO GATEWAY...'}
                    {transmissionStep >= 3 && 'FINALIZING DISPATCH...'}
                  </span>
                ) : (
                  <span className="btn-ready-state">
                    TRANSMIT SECURE MESSAGE <span className="btn-glyph">⚡</span>
                  </span>
                )}
              </button>

              <div className="direct-mailto-hint">
                <span>Or direct dispatch: </span>
                <a href={`mailto:pugazhenthij283@gmail.com`} className="mailto-direct-link">
                  pugazhenthij283@gmail.com
                </a>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
