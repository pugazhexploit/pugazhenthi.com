import { useState, useMemo } from 'react';
import './PasswordAnalyzer.css';

// Common weak passwords list
const COMMON_PASSWORDS = [
  'password', '123456', '12345678', 'qwerty', 'abc123', 'monkey', 'master',
  'dragon', 'login', 'princess', 'football', 'shadow', 'sunshine', 'trustno1',
  'iloveyou', 'batman', 'access', 'hello', 'charlie', 'admin', 'letmein',
  'welcome', 'passw0rd', 'p@ssword', 'root', 'toor', 'pass123', '123456789',
  '1234567890', 'password1', 'password123', 'qwerty123', 'admin123',
];

// Sequential patterns
const SEQUENCES = 'abcdefghijklmnopqrstuvwxyz0123456789qwertyuiopasdfghjklzxcvbnm';

function analyzePassword(pw) {
  if (!pw) {
    return {
      score: 0, label: 'EMPTY', entropy: 0, crackTime: '—', color: '#3a3a4a',
      charsetSize: 0, checks: [], composition: { upper: 0, lower: 0, digits: 0, symbols: 0, spaces: 0 },
      recommendations: [],
    };
  }

  const len = pw.length;
  const comp = { upper: 0, lower: 0, digits: 0, symbols: 0, spaces: 0 };

  for (const c of pw) {
    if (/[A-Z]/.test(c)) comp.upper++;
    else if (/[a-z]/.test(c)) comp.lower++;
    else if (/[0-9]/.test(c)) comp.digits++;
    else if (c === ' ') comp.spaces++;
    else comp.symbols++;
  }

  // Charset size calculation
  let charsetSize = 0;
  if (comp.lower > 0) charsetSize += 26;
  if (comp.upper > 0) charsetSize += 26;
  if (comp.digits > 0) charsetSize += 10;
  if (comp.symbols > 0) charsetSize += 33;
  if (comp.spaces > 0) charsetSize += 1;

  // Entropy = log2(charsetSize^length)
  const entropy = charsetSize > 0 ? len * Math.log2(charsetSize) : 0;

  // Crack time estimation (assuming 10 billion guesses/sec — modern GPU cluster)
  const guessesPerSec = 1e10;
  const totalCombinations = Math.pow(charsetSize || 1, len);
  const secondsToCrack = totalCombinations / guessesPerSec / 2; // average case

  let crackTime = '';
  if (secondsToCrack < 0.001) crackTime = 'Instant';
  else if (secondsToCrack < 1) crackTime = 'Less than 1 second';
  else if (secondsToCrack < 60) crackTime = `${Math.ceil(secondsToCrack)} seconds`;
  else if (secondsToCrack < 3600) crackTime = `${Math.ceil(secondsToCrack / 60)} minutes`;
  else if (secondsToCrack < 86400) crackTime = `${Math.ceil(secondsToCrack / 3600)} hours`;
  else if (secondsToCrack < 86400 * 365) crackTime = `${Math.ceil(secondsToCrack / 86400)} days`;
  else if (secondsToCrack < 86400 * 365 * 1000) crackTime = `${Math.ceil(secondsToCrack / (86400 * 365))} years`;
  else if (secondsToCrack < 86400 * 365 * 1e6) crackTime = `${(secondsToCrack / (86400 * 365 * 1000)).toFixed(1)}K years`;
  else if (secondsToCrack < 86400 * 365 * 1e9) crackTime = `${(secondsToCrack / (86400 * 365 * 1e6)).toFixed(1)}M years`;
  else crackTime = `${(secondsToCrack / (86400 * 365 * 1e9)).toFixed(1)}B+ years`;

  // Security checks
  const checks = [];
  const pwLower = pw.toLowerCase();

  // Length check
  checks.push({ label: 'Minimum 8 characters', passed: len >= 8 });
  checks.push({ label: 'Contains uppercase letter', passed: comp.upper > 0 });
  checks.push({ label: 'Contains lowercase letter', passed: comp.lower > 0 });
  checks.push({ label: 'Contains digit', passed: comp.digits > 0 });
  checks.push({ label: 'Contains special character', passed: comp.symbols > 0 });
  checks.push({ label: '12+ characters (strong)', passed: len >= 12 });

  // Common password check
  const isCommon = COMMON_PASSWORDS.includes(pwLower);
  checks.push({ label: 'Not a common password', passed: !isCommon });

  // Repeated characters check (e.g. aaaaaa)
  const hasRepeats = /(.)\1{2,}/.test(pw);
  checks.push({ label: 'No repeated characters (3+)', passed: !hasRepeats });

  // Sequential check
  let hasSequential = false;
  for (let i = 0; i <= pwLower.length - 3; i++) {
    const sub = pwLower.substring(i, i + 3);
    if (SEQUENCES.includes(sub) || SEQUENCES.split('').reverse().join('').includes(sub)) {
      hasSequential = true;
      break;
    }
  }
  checks.push({ label: 'No sequential patterns', passed: !hasSequential });

  // Scoring
  let score = 0;
  const passedChecks = checks.filter((c) => c.passed).length;
  score = Math.round((passedChecks / checks.length) * 100);

  // Penalty for common passwords
  if (isCommon) score = Math.min(score, 10);
  // Penalty for very short
  if (len < 6) score = Math.min(score, 15);

  // Entropy-based boost
  if (entropy > 60) score = Math.min(100, score + 10);
  if (entropy > 80) score = Math.min(100, score + 5);

  // Determine label and color
  let label, color;
  if (score <= 20) { label = 'CRITICAL'; color = '#ff3333'; }
  else if (score <= 40) { label = 'WEAK'; color = '#ff5f56'; }
  else if (score <= 60) { label = 'MODERATE'; color = '#ffbd2e'; }
  else if (score <= 80) { label = 'STRONG'; color = '#00f3ff'; }
  else { label = 'FORTRESS'; color = '#00ff41'; }

  // Recommendations
  const recommendations = [];
  if (len < 12) recommendations.push('Use at least 12 characters for strong security.');
  if (comp.upper === 0) recommendations.push('Add uppercase letters (A-Z).');
  if (comp.lower === 0) recommendations.push('Add lowercase letters (a-z).');
  if (comp.digits === 0) recommendations.push('Include numbers (0-9).');
  if (comp.symbols === 0) recommendations.push('Add special characters (!@#$%^&*).');
  if (isCommon) recommendations.push('This password is in known breach databases. Choose a unique one.');
  if (hasRepeats) recommendations.push('Avoid repeated characters (e.g. aaa, 111).');
  if (hasSequential) recommendations.push('Avoid keyboard/alphabet sequences (e.g. abc, qwerty).');
  if (recommendations.length === 0) recommendations.push('Excellent! This password meets all security criteria.');

  return { score, label, entropy, crackTime, color, charsetSize, checks, composition: comp, recommendations };
}

export default function PasswordAnalyzer() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const analysis = useMemo(() => analyzePassword(password), [password]);

  return (
    <section id="password-analyzer" className="section">
      <div className="section-label reveal">Security Tool</div>
      <h2 className="section-title reveal">
        Password<br />
        <span>strength analyzer.</span>
      </h2>
      <p className="section-subtitle reveal">
        Real-time entropy analysis, crack-time estimation, and actionable security recommendations.
        All analysis runs locally in your browser — no data is transmitted.
      </p>

      <div className="pw-analyzer-box reveal">
        {/* Input Section */}
        <div className="pw-input-section">
          <div className="pw-input-wrapper">
            <span className="pw-input-icon">🔐</span>
            <input
              type={showPassword ? 'text' : 'password'}
              className="pw-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Type a password to analyze..."
              autoComplete="off"
              spellCheck="false"
            />
            <button
              type="button"
              className="pw-toggle-btn"
              onClick={() => setShowPassword(!showPassword)}
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>

          {/* Strength Bar */}
          {password && (
            <div className="pw-strength-bar-container">
              <div className="pw-strength-track">
                <div
                  className="pw-strength-fill"
                  style={{
                    width: `${analysis.score}%`,
                    background: `linear-gradient(90deg, ${analysis.color}aa, ${analysis.color})`,
                    boxShadow: `0 0 12px ${analysis.color}60`,
                  }}
                ></div>
              </div>
              <div className="pw-strength-label-row">
                <span className="pw-strength-label" style={{ color: analysis.color }}>
                  {analysis.label}
                </span>
                <span className="pw-strength-score">{analysis.score}%</span>
              </div>
            </div>
          )}
        </div>

        {/* Analysis Results */}
        {password && (
          <div className="pw-results-grid">
            {/* Metrics Row */}
            <div className="pw-metrics-row">
              <div className="pw-metric-card">
                <div className="pw-metric-value">{analysis.entropy.toFixed(1)}</div>
                <div className="pw-metric-label">ENTROPY (BITS)</div>
              </div>
              <div className="pw-metric-card">
                <div className="pw-metric-value highlight-cyan">{analysis.crackTime}</div>
                <div className="pw-metric-label">CRACK TIME (10B/s GPU)</div>
              </div>
              <div className="pw-metric-card">
                <div className="pw-metric-value">{analysis.charsetSize}</div>
                <div className="pw-metric-label">CHARSET SIZE</div>
              </div>
              <div className="pw-metric-card">
                <div className="pw-metric-value">{password.length}</div>
                <div className="pw-metric-label">LENGTH</div>
              </div>
            </div>

            {/* Composition & Checks */}
            <div className="pw-detail-grid">
              {/* Character Composition */}
              <div className="pw-detail-card">
                <div className="pw-detail-title">📊 CHARACTER COMPOSITION</div>
                <div className="pw-comp-list">
                  <div className="pw-comp-row">
                    <span>Uppercase (A-Z)</span>
                    <span className={analysis.composition.upper > 0 ? 'comp-active' : 'comp-zero'}>{analysis.composition.upper}</span>
                  </div>
                  <div className="pw-comp-row">
                    <span>Lowercase (a-z)</span>
                    <span className={analysis.composition.lower > 0 ? 'comp-active' : 'comp-zero'}>{analysis.composition.lower}</span>
                  </div>
                  <div className="pw-comp-row">
                    <span>Digits (0-9)</span>
                    <span className={analysis.composition.digits > 0 ? 'comp-active' : 'comp-zero'}>{analysis.composition.digits}</span>
                  </div>
                  <div className="pw-comp-row">
                    <span>Symbols (!@#$)</span>
                    <span className={analysis.composition.symbols > 0 ? 'comp-active' : 'comp-zero'}>{analysis.composition.symbols}</span>
                  </div>
                </div>
              </div>

              {/* Security Checks */}
              <div className="pw-detail-card">
                <div className="pw-detail-title">🛡️ SECURITY AUDIT</div>
                <div className="pw-checks-list">
                  {analysis.checks.map((check, idx) => (
                    <div key={idx} className={`pw-check-row ${check.passed ? 'passed' : 'failed'}`}>
                      <span className="check-icon">{check.passed ? '✓' : '✗'}</span>
                      <span>{check.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="pw-recommendations">
              <div className="pw-detail-title">💡 RECOMMENDATIONS</div>
              {analysis.recommendations.map((rec, idx) => (
                <div key={idx} className="pw-rec-item">
                  <span className="rec-arrow">→</span> {rec}
                </div>
              ))}
            </div>

            {/* Disclaimer */}
            <div className="pw-disclaimer">
              <i className="fas fa-lock"></i> 100% client-side analysis. No passwords are stored, logged, or transmitted.
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
