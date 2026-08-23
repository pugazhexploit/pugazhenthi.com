import { useState, useEffect } from 'react';
import './CTFChallenge.css';

const VALID_FLAGS = [
  'CTF{PUGAZH_CRACKED_2026}',
  'CTF{CYBER_ASTRA_CRACKED_2026}',
  'CTF{WEBPYS_RECON}',
  'CTF{GOV_DISCLOSURE_ACK}',
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

  // Optional manual utility toolkit state
  const [showToolbox, setShowToolbox] = useState(false);
  const [toolInput, setToolInput] = useState('');
  const [toolOutput, setToolOutput] = useState('');

  // Console easter egg flag injection
  useEffect(() => {
    console.log(
      '%c 🚩 CTF RECON CHALLENGE %c',
      'background: #00ff41; color: #0a0a0f; font-weight: bold; font-size: 14px; padding: 4px 8px;',
      'color: #00f3ff; font-size: 12px;',
      '\n[+] System Inspection: Hidden Flag Found:\nCTF{GOV_DISCLOSURE_ACK}'
    );
  }, []);

  const handleToolDecode = (type) => {
    if (!toolInput.trim()) return;
    try {
      if (type === 'b64') {
        setToolOutput(atob(toolInput.trim()));
      } else if (type === 'rot13') {
        const rot13 = (str) =>
          str.replace(/[a-zA-Z]/g, (c) =>
            String.fromCharCode((c <= 'Z' ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26)
          );
        setToolOutput(rot13(toolInput.trim()));
      } else if (type === 'hex') {
        const clean = toolInput.replace(/\s+/g, '');
        let str = '';
        for (let i = 0; i < clean.length; i += 2) {
          str += String.fromCharCode(parseInt(clean.substr(i, 2), 16));
        }
        setToolOutput(str);
      }
    } catch {
      setToolOutput('Error: Unable to decode payload with selected format.');
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
        msg: `🎉 FLAG ACCEPTED! Excellent work, hacker! [${
          solvedFlags.includes(clean) ? solvedFlags.length : solvedFlags.length + 1
        }/${VALID_FLAGS.length} Solved]`,
      });
      setFlagInput('');
    } else {
      setStatus({
        success: false,
        msg: '❌ INVALID FLAG: Solve the ciphers or inspect console logs and try again.',
      });
    }
  };

  return (
    <div className="ctf-challenge-box reveal">
      <div className="ctf-challenge-header">
        <div className="ctf-challenge-title">
          <i className="fas fa-shield-halved text-[#00ff41]"></i> AUTHENTIC CTF CHALLENGES
        </div>
        <div className="ctf-score-badge">
          FLAGS SOLVED: <span className="highlight">{solvedFlags.length}</span> / {VALID_FLAGS.length}
        </div>
      </div>

      <div className="ctf-challenge-body">
        {/* TASK 1: Base64 Crypto */}
        <div className="ctf-task">
          <div className="task-header-line">
            <span className="task-title">⚡ TASK 1: BASE64 CIPHERPAYLOAD</span>
            <span className="task-level easy">EASY</span>
          </div>
          <p className="task-desc">
            Analyze and decode this Base64 encrypted payload to discover Flag 1:
          </p>
          <div className="ctf-payload-display">
            <code>Q1RGe1BVR0AZSF9DUkFDS0VEXzIwMjZ9</code>
          </div>
        </div>

        {/* TASK 2: ROT13 Caesar Substitution */}
        <div className="ctf-task">
          <div className="task-header-line">
            <span className="task-title">🔑 TASK 2: ROT13 CAESAR SUBSTITUTION</span>
            <span className="task-level medium">MEDIUM</span>
          </div>
          <p className="task-desc">
            This cipher string is encrypted using 13-letter Caesar shift substitution (ROT13):
          </p>
          <div className="ctf-payload-display">
            <code>PGF&#123;CLORE_NFGEN_PENPXRQ_2026&#125;</code>
          </div>
        </div>

        {/* TASK 3: Hexadecimal Packet Inspection */}
        <div className="ctf-task">
          <div className="task-header-line">
            <span className="task-title">🔬 TASK 3: HEXADECIMAL PACKET PAYLOAD</span>
            <span className="task-level medium">MEDIUM</span>
          </div>
          <p className="task-desc">
            Convert these raw hexadecimal byte values into plain text ASCII format:
          </p>
          <div className="ctf-payload-display">
            <code>43 54 46 7b 57 45 42 50 59 53 5f 52 45 43 4f 4e 7d</code>
          </div>
        </div>

        {/* TASK 4: Browser Console Recon */}
        <div className="ctf-task">
          <div className="task-header-line">
            <span className="task-title">🔍 TASK 4: BROWSER CONSOLE RECONNAISSANCE</span>
            <span className="task-level hard">HARD</span>
          </div>
          <p className="task-desc">
            Open Developer Tools (Press <code>F12</code> or <code>Right-Click ➔ Inspect</code>) and examine the <strong>Console</strong> tab logs to capture Flag 4.
          </p>
        </div>

        {/* Optional Decoder Tool Toggle */}
        <div className="ctf-toolbox-toggle">
          <button
            type="button"
            className="btn-outline toolbox-btn"
            onClick={() => setShowToolbox(!showToolbox)}
          >
            <i className="fas fa-wrench"></i> {showToolbox ? 'HIDE CYBER DECODER TOOLKIT' : 'OPEN CYBER DECODER TOOLKIT'}
          </button>
        </div>

        {/* Manual Cyber Toolkit */}
        {showToolbox && (
          <div className="ctf-toolkit-box">
            <div className="toolkit-title">⚙️ MANUAL CYBER DECODER TOOLKIT</div>
            <div className="toolkit-input-group">
              <input
                type="text"
                className="ctf-input"
                value={toolInput}
                onChange={(e) => setToolInput(e.target.value)}
                placeholder="Paste payload string to decode..."
              />
              <div className="toolkit-actions">
                <button className="btn-solid tool-btn" onClick={() => handleToolDecode('b64')}>Base64</button>
                <button className="btn-solid tool-btn" onClick={() => handleToolDecode('rot13')}>ROT13</button>
                <button className="btn-solid tool-btn" onClick={() => handleToolDecode('hex')}>Hex ➔ ASCII</button>
              </div>
            </div>
            {toolOutput && (
              <div className="toolkit-result">
                <span>Output:</span> <code>{toolOutput}</code>
              </div>
            )}
          </div>
        )}

        {/* Single Main Flag Submission Box */}
        <form onSubmit={handleFlagSubmit} className="ctf-submit-form">
          <div className="submit-title">🚩 SUBMIT DISCOVERED FLAG</div>
          <div className="submit-input-group">
            <span className="terminal-prefix">root@pugazh-ctf:~#</span>
            <input
              type="text"
              className="ctf-input flag-input"
              value={flagInput}
              onChange={(e) => setFlagInput(e.target.value)}
              placeholder="Enter flag format: CTF{...}"
            />
            <button type="submit" className="btn-outline submit-flag-btn">
              VALIDATE FLAG
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
              <div className="unlocked-sub">You have solved {solvedFlags.length} of {VALID_FLAGS.length} security challenges!</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
