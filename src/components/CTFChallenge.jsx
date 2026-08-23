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

  // Task 1: Base64 Decoder State
  const [b64Input, setB64Input] = useState('Q1RGe1BVR0FaSF9DUkFDS0VEXzIwMjZ9');
  const [b64Output, setB64Output] = useState('');

  // Task 2: ROT13 Cipher State
  const [rotInput, setRotInput] = useState('PGF{CLORE_NFGEN_PENPXRQ_2026}');
  const [rotOutput, setRotOutput] = useState('');

  // Task 3: Hex to ASCII State
  const [hexInput, setHexInput] = useState('43 54 46 7b 57 45 42 50 59 53 5f 52 45 43 4f 4e 7d');
  const [hexOutput, setHexOutput] = useState('');

  // Console easter egg flag injection
  useEffect(() => {
    console.log(
      '%c 🚩 CTF RECON CHALLENGE %c',
      'background: #00ff41; color: #0a0a0f; font-weight: bold; font-size: 14px; padding: 4px 8px;',
      'color: #00f3ff; font-size: 12px;',
      '\n[+] System Inspection: Hidden Flag Found:\nCTF{GOV_DISCLOSURE_ACK}'
    );
  }, []);

  // Base64 Decode
  const handleB64Decode = () => {
    try {
      const decoded = atob(b64Input.trim());
      setB64Output(decoded);
    } catch {
      setB64Output('Error: Invalid Base64 String');
    }
  };

  // ROT13 Decode Function
  const handleRot13Decode = () => {
    const rot13 = (str) =>
      str.replace(/[a-zA-Z]/g, (c) =>
        String.fromCharCode((c <= 'Z' ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26)
      );
    setRotOutput(rot13(rotInput.trim()));
  };

  // Hex to ASCII Decode Function
  const handleHexDecode = () => {
    try {
      const clean = hexInput.replace(/\s+/g, '');
      let str = '';
      for (let i = 0; i < clean.length; i += 2) {
        str += String.fromCharCode(parseInt(clean.substr(i, 2), 16));
      }
      setHexOutput(str);
    } catch {
      setHexOutput('Error: Invalid Hexadecimal Payload');
    }
  };

  const submitDirectFlag = (flag) => {
    if (!flag || flag.startsWith('Error')) return;
    setFlagInput(flag);
    validateFlag(flag);
  };

  const validateFlag = (flagToValidate) => {
    const clean = (flagToValidate || flagInput).trim();
    if (!clean) return;

    if (VALID_FLAGS.includes(clean)) {
      if (!solvedFlags.includes(clean)) {
        const updated = [...solvedFlags, clean];
        setSolvedFlags(updated);
        localStorage.setItem('solved_ctf_flags', JSON.stringify(updated));
      }
      setStatus({
        success: true,
        msg: `🎉 FLAG ACCEPTED! Excellent work, hacker! [${Math.min(
          solvedFlags.includes(clean) ? solvedFlags.length : solvedFlags.length + 1,
          VALID_FLAGS.length
        )}/${VALID_FLAGS.length} Solved]`,
      });
    } else {
      setStatus({
        success: false,
        msg: '❌ INVALID FLAG: Check your cipher decode output or console logs.',
      });
    }
  };

  const handleFlagSubmit = (e) => {
    e.preventDefault();
    validateFlag(flagInput);
  };

  return (
    <div className="ctf-challenge-box reveal">
      <div className="ctf-challenge-header">
        <div className="ctf-challenge-title">
          <i className="fas fa-shield-halved text-[#00ff41]"></i> INTERACTIVE CTF LAB & CYBER DECODERS
        </div>
        <div className="ctf-score-badge">
          FLAGS SOLVED: <span className="highlight">{solvedFlags.length}</span> / {VALID_FLAGS.length}
        </div>
      </div>

      <div className="ctf-challenge-body">
        {/* TASK 1: Base64 Crypto (EASY) */}
        <div className="ctf-task">
          <div className="task-header-line">
            <span className="task-title">⚡ TASK 1: BASE64 CRYPTO CIPHER</span>
            <span className="task-level easy">EASY</span>
          </div>
          <p className="task-desc">
            Decode the Base64 payload to reveal the flag format <code>CTF&#123;...&#125;</code>:
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
              <button className="btn-solid decode-btn" onClick={handleB64Decode}>
                DECODE BASE64
              </button>
            </div>
            {b64Output && (
              <div className="decoder-output">
                <div>
                  <span>Decoded Result:</span> <code>{b64Output}</code>
                </div>
                <button className="btn-outline submit-direct-btn" onClick={() => submitDirectFlag(b64Output)}>
                  SUBMIT THIS FLAG →
                </button>
              </div>
            )}
          </div>
        </div>

        {/* TASK 2: ROT13 Substitution Cipher (MEDIUM) */}
        <div className="ctf-task">
          <div className="task-header-line">
            <span className="task-title">🔑 TASK 2: ROT13 CAESAR SUBSTITUTION</span>
            <span className="task-level medium">MEDIUM</span>
          </div>
          <p className="task-desc">
            This cipher uses a 13-character letter shift substitution (ROT13). Decode the shifted flag payload below:
          </p>

          <div className="ctf-decoder-tool">
            <div className="decoder-input-group">
              <input
                type="text"
                className="ctf-input"
                value={rotInput}
                onChange={(e) => setRotInput(e.target.value)}
                placeholder="Paste ROT13 cipher text..."
              />
              <button className="btn-solid decode-btn" onClick={handleRot13Decode}>
                APPLY ROT13
              </button>
            </div>
            {rotOutput && (
              <div className="decoder-output">
                <div>
                  <span>Decoded Result:</span> <code>{rotOutput}</code>
                </div>
                <button className="btn-outline submit-direct-btn" onClick={() => submitDirectFlag(rotOutput)}>
                  SUBMIT THIS FLAG →
                </button>
              </div>
            )}
          </div>
        </div>

        {/* TASK 3: Hexadecimal & ASCII Analysis (MEDIUM) */}
        <div className="ctf-task">
          <div className="task-header-line">
            <span className="task-title">🔬 TASK 3: HEXADECIMAL PAYLOAD ANALYSIS</span>
            <span className="task-level medium">MEDIUM</span>
          </div>
          <p className="task-desc">
            Convert the raw hexadecimal packet payload bytes into readable ASCII text:
          </p>

          <div className="ctf-decoder-tool">
            <div className="decoder-input-group">
              <input
                type="text"
                className="ctf-input"
                value={hexInput}
                onChange={(e) => setHexInput(e.target.value)}
                placeholder="Hex payload bytes (e.g. 43 54 46...)"
              />
              <button className="btn-solid decode-btn" onClick={handleHexDecode}>
                HEX ➔ ASCII
              </button>
            </div>
            {hexOutput && (
              <div className="decoder-output">
                <div>
                  <span>Decoded Result:</span> <code>{hexOutput}</code>
                </div>
                <button className="btn-outline submit-direct-btn" onClick={() => submitDirectFlag(hexOutput)}>
                  SUBMIT THIS FLAG →
                </button>
              </div>
            )}
          </div>
        </div>

        {/* TASK 4: Console Recon (INSPECTION) */}
        <div className="ctf-task">
          <div className="task-header-line">
            <span className="task-title">🔍 TASK 4: BROWSER CONSOLE RECON</span>
            <span className="task-level medium">HARD</span>
          </div>
          <p className="task-desc">
            Open Developer Tools (Press <code>F12</code> or <code>Right-Click ➔ Inspect</code>) and check the <strong>Console</strong> tab for hidden system logs and dispatch keys.
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
              <div className="unlocked-sub">You have successfully solved {solvedFlags.length} of {VALID_FLAGS.length} security challenges!</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
