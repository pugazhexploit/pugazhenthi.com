import { useState, useEffect } from 'react';
import './CTFChallenge.css';

const VALID_FLAGS = [
  'CTF{PUGAZH_CRACKED_2026}',
  'CTF{CYBER_ASTRA_RECON}',
  'CTF{RESPONSIBLE_DISCLOSURE_GOV}',
];

export default function CTFChallenge() {
  const [flagInput, setFlagInput] = useState('');
  const [status, setStatus] = useState(null); // { success: boolean, msg: string }
  const [solvedFlags, setSolvedFlags] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('solved_ctf_flags') || '[]');
    } catch {
      return [];
    }
  });

  // Base64 decoder tool state
  const [b64Input, setB64Input] = useState('Q1RGe1BVR0AZSF9DUkFDS0VEXzIwMjZ9');
  const [b64Output, setB64Output] = useState('');

  // Console easter egg flag injection
  useEffect(() => {
    console.log(
      '%c 🚩 CTF CHALLENGE HINT %c',
      'background: #00ff41; color: #0a0a0f; font-weight: bold; font-size: 14px; padding: 4px 8px;',
      'color: #00f3ff; font-size: 12px;',
      '\nFound console logs? Here is your hidden flag:\nCTF{CYBER_ASTRA_RECON}'
    );
  }, []);

  const handleDecode = () => {
    try {
      const decoded = atob(b64Input.trim());
      setB64Output(decoded);
    } catch {
      setB64Output('Error: Invalid Base64 String');
    }
  };

  const handleFlagSubmit = (e) => {
    e.preventDefault();
    const clean = flagInput.trim();
    if (!clean) return;

    if (VALID_FLAGS.includes(clean)) {
      if (!solvedFlags.includes(clean)) {
        const updated = [...solvedFlags, clean];
        setSolvedFlags(updated);
        localStorage.setItem('solved_ctf_flags', JSON.stringify(updated));
      }
      setStatus({
        success: true,
        msg: `🎉 FLAG ACCEPTED! Excellent work, hacker! [${solvedFlags.length + 1}/${VALID_FLAGS.length} Solved]`,
      });
      setFlagInput('');
    } else {
      setStatus({
        success: false,
        msg: '❌ INVALID FLAG: Check your cipher or console logs and try again.',
      });
    }
  };

  return (
    <div className="ctf-challenge-box reveal">
      <div className="ctf-challenge-header">
        <div className="ctf-challenge-title">
          <i className="fas fa-[#00ff41] fa-flag"></i> INTERACTIVE CTF CHALLENGE & DECODER
        </div>
        <div className="ctf-score-badge">
          SOLVED: <span className="highlight">{solvedFlags.length}</span> / {VALID_FLAGS.length}
        </div>
      </div>

      <div className="ctf-challenge-body">
        {/* Challenge 1: Base64 Crypto */}
        <div className="ctf-task">
          <div className="task-title">⚡ TASK 1: CRYPTO CIPHER DECODE</div>
          <p className="task-desc">
            Decode the payload below to reveal the Flag format <code>CTF&#123;...&#125;</code>:
          </p>

          <div className="ctf-decoder-tool">
            <div className="decoder-input-group">
              <input
                type="text"
                className="ctf-input"
                value={b64Input}
                onChange={(e) => setB64Input(e.target.value)}
                placeholder="Paste Base64 payload..."
              />
              <button className="btn-solid decode-btn" onClick={handleDecode}>
                DECODE BASE64
              </button>
            </div>
            {b64Output && (
              <div className="decoder-output">
                <span>Result:</span> <code>{b64Output}</code>
              </div>
            )}
          </div>
        </div>

        {/* Task 2: Console Recon Hint */}
        <div className="ctf-task">
          <div className="task-title">🔍 TASK 2: BROWSER CONSOLE RECON</div>
          <p className="task-desc">
            Open your Developer Tools (Press <code>F12</code> or <code>Right-Click → Inspect</code>) and check the <strong>Console</strong> tab for hidden system logs.
          </p>
        </div>

        {/* Flag Submission Box */}
        <form onSubmit={handleFlagSubmit} className="ctf-submit-form">
          <div className="submit-input-group">
            <span className="terminal-prefix">root@pugazh-ctf:~#</span>
            <input
              type="text"
              className="ctf-input flag-input"
              value={flagInput}
              onChange={(e) => setFlagInput(e.target.value)}
              placeholder="Submit flag format: CTF{...}"
            />
            <button type="submit" className="btn-outline submit-flag-btn">
              SUBMIT FLAG
            </button>
          </div>
        </form>

        {/* Status Message */}
        {status && (
          <div className={`ctf-status-msg ${status.success ? 'success' : 'error'}`}>
            {status.msg}
          </div>
        )}

        {/* Unlocked Badges */}
        {solvedFlags.length > 0 && (
          <div className="ctf-unlocked-banner">
            <span className="banner-icon">🛡️</span>
            <div>
              <strong>CLASSIFIED BADGE UNLOCKED:</strong> VERIFIED CTF SOLVER
              <div className="unlocked-sub">You have successfully solved {solvedFlags.length} security challenges!</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
