import { useState, useEffect } from 'react';
import './CTFChallenge.css';

const VALID_FLAGS = [
  'CTF{PUGAZH_CRACKED_2026}',
  'CTF{CYBER_ASTRA_CRACKED_2026}',
  'CTF{WEBPYS_RECON}',
  'CTF{GOV_DISCLOSURE_ACK}',
];

// Synthetic Cyber Sound Effects using Web Audio API
function playSuccessSound() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 cyber arpeggio chime
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.08);
      gain.gain.setValueAtTime(0.18, ctx.currentTime + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.08 + 0.28);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.08);
      osc.stop(ctx.currentTime + i * 0.08 + 0.28);
    });
  } catch {
    // Audio Context fallback
  }
}

function playErrorSound() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(110, ctx.currentTime + 0.22);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.22);
  } catch {
    // Audio Context fallback
  }
}

export default function CTFChallenge() {
  const [taskInputs, setTaskInputs] = useState({
    task1: '',
    task2: '',
    task3: '',
    task4: '',
    main: '',
  });
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

  const handleTaskInputChange = (key, val) => {
    setTaskInputs((prev) => ({ ...prev, [key]: val }));
  };

  const validateAndSubmitFlag = (rawInput, taskKey) => {
    const clean = (rawInput || '').trim().replace(/^['"]|['"]$/g, '');
    if (!clean) return;

    const matchedFlag = VALID_FLAGS.find(
      (f) => f.toLowerCase() === clean.toLowerCase()
    );

    if (matchedFlag) {
      playSuccessSound();
      if (!solvedFlags.includes(matchedFlag)) {
        const updated = [...solvedFlags, matchedFlag];
        setSolvedFlags(updated);
        localStorage.setItem('solved_ctf_flags', JSON.stringify(updated));
      }
      setStatus({
        success: true,
        msg: `🎉 FLAG ACCEPTED! Excellent work, hacker! [${
          solvedFlags.includes(matchedFlag) ? solvedFlags.length : solvedFlags.length + 1
        }/${VALID_FLAGS.length} Solved]`,
      });
      if (taskKey) {
        setTaskInputs((prev) => ({ ...prev, [taskKey]: '' }));
      }
    } else {
      playErrorSound();
      setStatus({
        success: false,
        msg: '❌ INVALID FLAG: Solve the ciphers or inspect console logs and try again.',
      });
    }
  };

  const handleSubmit = (e, taskKey) => {
    e.preventDefault();
    validateAndSubmitFlag(taskInputs[taskKey], taskKey);
  };

  return (
    <div className="ctf-challenge-box reveal">
      <div className="ctf-challenge-header">
        <div className="ctf-challenge-title">
          <i className="fas fa-shield-halved text-[#00ff41]"></i> AUTHENTIC CTF CHALLENGES & FLAG LAB
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
            <code>Q1RGe1BVR0FaSF9DUkFDS0VEXzIwMjZ9</code>
          </div>

          <form onSubmit={(e) => handleSubmit(e, 'task1')} className="task-submit-row">
            <input
              type="text"
              className="ctf-input task-flag-input"
              value={taskInputs.task1}
              onChange={(e) => handleTaskInputChange('task1', e.target.value)}
              placeholder="Submit Flag 1: CTF{...}"
            />
            <button type="submit" className="btn-solid submit-task-btn">
              SUBMIT FLAG
            </button>
          </form>
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

          <form onSubmit={(e) => handleSubmit(e, 'task2')} className="task-submit-row">
            <input
              type="text"
              className="ctf-input task-flag-input"
              value={taskInputs.task2}
              onChange={(e) => handleTaskInputChange('task2', e.target.value)}
              placeholder="Submit Flag 2: CTF{...}"
            />
            <button type="submit" className="btn-solid submit-task-btn">
              SUBMIT FLAG
            </button>
          </form>
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

          <form onSubmit={(e) => handleSubmit(e, 'task3')} className="task-submit-row">
            <input
              type="text"
              className="ctf-input task-flag-input"
              value={taskInputs.task3}
              onChange={(e) => handleTaskInputChange('task3', e.target.value)}
              placeholder="Submit Flag 3: CTF{...}"
            />
            <button type="submit" className="btn-solid submit-task-btn">
              SUBMIT FLAG
            </button>
          </form>
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

          <form onSubmit={(e) => handleSubmit(e, 'task4')} className="task-submit-row">
            <input
              type="text"
              className="ctf-input task-flag-input"
              value={taskInputs.task4}
              onChange={(e) => handleTaskInputChange('task4', e.target.value)}
              placeholder="Submit Flag 4: CTF{...}"
            />
            <button type="submit" className="btn-solid submit-task-btn">
              SUBMIT FLAG
            </button>
          </form>
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
        <form onSubmit={(e) => handleSubmit(e, 'main')} className="ctf-submit-form">
          <div className="submit-title">🚩 GLOBAL FLAG VALIDATION TERMINAL</div>
          <div className="submit-input-group">
            <span className="terminal-prefix">root@pugazh-ctf:~#</span>
            <input
              type="text"
              className="ctf-input flag-input"
              value={taskInputs.main}
              onChange={(e) => handleTaskInputChange('main', e.target.value)}
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
