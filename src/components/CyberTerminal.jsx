import { useState, useEffect, useRef } from 'react';
import './CyberTerminal.css';

const COMMANDS = {
  help: `Available Commands:
------------------------------------------------------------
  whoami       - Display identity & profile summary
  skills       - Show technical skills matrix
  projects     - List key cybersecurity projects
  achievements - View competitions & awards
  certs        - Display certifications
  cat resume   - Output resume overview
  nmap <host>  - Run interactive port scan simulation
  scan         - Execute vulnerability scanner simulation
  flag         - Show CTF challenge hint
  matrix       - Toggle Cyber Matrix animation
  contact      - Display direct contact info & links
  clear        - Clear terminal screen
  exit         - Close terminal session
------------------------------------------------------------`,

  whoami: `PUGAZHENTHI J [/bin/pugazh-shell]
------------------------------------------------------------
Role      : Cybersecurity Enthusiast | Ethical Hacker | Penetration Tester
Location  : Chidambaram, Tamil Nadu, India
Education : B.Sc Computer Science, AVC College (Autonomous)
Team      : Team ASTRA (CTF & Security Research)
Slogan    : "Breaking systems to understand them. Building technology to secure them."`,

  skills: `TECHNICAL ARSENAL:
------------------------------------------------------------
[+] OFFENSIVE SEC : Penetration Testing, Web Security, OWASP Top 10, OSINT
[+] DEFENSIVE SEC : Digital Forensics, Network Security, Cryptography
[+] LANGUAGES     : Python, JavaScript, Bash/Linux, HTML/CSS
[+] FRAMEWORKS    : FastAPI, React.js, Telegram Bot API, GIS Mapping
[+] TOOLS         : Kali Linux, Nmap, Nuclei, GitHub, TryHackMe
[+] AI & CLOUD    : Gemini API, Prompt Engineering, AWS (IAM/S3/EC2)`,

  projects: `KEY PROJECTS:
------------------------------------------------------------
1. KALI MCP TERMINAL     - FastAPI Remote Shell + AI Pentest Assistant
2. AI-AGENT-SARA V2.0    - Telegram AI Bot for Cyber Learning & OSINT
3. RURALCARE-MAP-AI      - Award-Winning AI Geospatial Healthcare App (₹4,000 Award)
4. WEBPYS                - Web Pentest, Subdomain & Vulnerability Scanner
5. IT WEBSITE PLATFORM   - Departmental Web Portal & Magazine Platform`,

  achievements: `HONORS & MILESTONES:
------------------------------------------------------------
🏆 Indian Govt (*.gov.in) Responsible Vulnerability Disclosure
🏆 Chaitanya CTF 2025 — 14th Place (9,737+ Points)
🏆 TN Govt Youth Festival — 2nd Prize (₹4,000 Award)
🏆 TryHackMe Weekly League — 2nd Place (816 Points, 2 Gold Tickets)
🏆 30-Day Active TryHackMe Streak
🏆 National Level MIME Event — 1st Place`,

  certs: `CERTIFICATIONS:
------------------------------------------------------------
📜 CCEP — Certified Cybersecurity Educator Professional (Red Team Leaders)
📜 TryHackMe Active Learning Path Completion
📜 CNSP — Certified Network Security Practitioner (The SecOps Group)`,

  'cat resume': `RESUME OVERVIEW:
------------------------------------------------------------
Name     : PUGAZHENTHI J
Email    : pugazhenthij283@gmail.com
Phone    : +91 8608442802
Degree   : B.Sc Computer Science (2024 - 2027)
Download : /cyber_security-resiume.pdf`,

  contact: `DIRECT CONTACT CHANNELS:
------------------------------------------------------------
Email    : pugazhenthij283@gmail.com
Phone    : +91 8608442802
GitHub   : https://github.com/pugazhexploit
LinkedIn : https://linkedin.com/in/pugazh28
TryHackMe: https://tryhackme.com/p/pugazhenthij283`,

  flag: `[+] CTF HINT:
------------------------------------------------------------
Decoding is key to security research.
Try Base64 decoding this cipher string:
  Q1RGe1BVR0AZSF9DUkFDS0VEXzIwMjZ9
Or inspect your browser console (F12) for hidden packet logs!`,
};

export default function CyberTerminal({ isOpen, onClose }) {
  const [history, setHistory] = useState([
    { type: 'sys', text: 'PUGAZHENTHI OS [/bin/pugazh-shell v2.4]' },
    { type: 'sys', text: 'Type "help" for a list of available commands.' },
  ]);
  const [inputVal, setInputVal] = useState('');
  const [cmdHistory, setCmdHistory] = useState([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [isScanning, setIsScanning] = useState(false);
  const [matrixActive, setMatrixActive] = useState(false);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, isScanning]);

  const handleCommand = (cmdStr) => {
    const trimmed = cmdStr.trim();
    if (!trimmed) return;

    // Add to command history
    setCmdHistory((prev) => [...prev, trimmed]);
    setHistoryIdx(-1);

    const lower = trimmed.toLowerCase();

    // Print user prompt
    const newLogs = [{ type: 'user', text: `root@pugazh-sec:~# ${trimmed}` }];

    if (lower === 'clear') {
      setHistory([]);
      setInputVal('');
      return;
    }

    if (lower === 'exit') {
      onClose();
      setInputVal('');
      return;
    }

    if (lower === 'matrix') {
      setMatrixActive((prev) => !prev);
      newLogs.push({ type: 'sys', text: `Matrix animation toggled.` });
      setHistory((prev) => [...prev, ...newLogs]);
      setInputVal('');
      return;
    }

    if (lower.startsWith('nmap')) {
      const target = trimmed.split(' ')[1] || 'target.local';
      newLogs.push({ type: 'sys', text: `Starting Nmap 7.94 ( https://nmap.org ) at ${new Date().toLocaleTimeString()}...` });
      setHistory((prev) => [...prev, ...newLogs]);
      setIsScanning(true);

      setTimeout(() => {
        setHistory((prev) => [
          ...prev,
          { type: 'out', text: `Nmap scan report for ${target}` },
          { type: 'out', text: `PORT     STATE SERVICE    VERSION` },
          { type: 'out', text: `22/tcp   open  ssh        OpenSSH 8.9p1 Ubuntu` },
          { type: 'out', text: `80/tcp   open  http       Nginx 1.18.0 (Security Hardened)` },
          { type: 'out', text: `443/tcp  open  ssl/https  TLS v1.3 Cipher Suite` },
          { type: 'out', text: `8000/tcp open  http-alt   FastAPI Remote Shell [/bin/kali-mcp]` },
          { type: 'sys', text: `[✓] Nmap done: 1 IP address (1 host up) scanned in 1.42 seconds.` },
        ]);
        setIsScanning(false);
      }, 1400);

      setInputVal('');
      return;
    }

    if (lower === 'scan') {
      newLogs.push({ type: 'sys', text: `Executing WebPyS passive vulnerability scan...` });
      setHistory((prev) => [...prev, ...newLogs]);
      setIsScanning(true);

      setTimeout(() => {
        setHistory((prev) => [
          ...prev,
          { type: 'out', text: `[*] Target: pugazhenthi.com` },
          { type: 'out', text: `[+] WAF Detection: Active (Cloudflare / Custom Rules)` },
          { type: 'out', text: `[+] SSL/TLS: Valid 256-bit Encryption` },
          { type: 'out', text: `[+] Security Headers: HSTS, CSP, X-Frame-Options (Compliant)` },
          { type: 'out', text: `[+] Vulnerabilities: 0 High, 0 Medium` },
          { type: 'sys', text: `[✓] WebPyS Audit Complete: Grade A+ Security Posture` },
        ]);
        setIsScanning(false);
      }, 1500);

      setInputVal('');
      return;
    }

    // Match predefined commands
    if (COMMANDS[lower]) {
      newLogs.push({ type: 'out', text: COMMANDS[lower] });
    } else {
      newLogs.push({
        type: 'err',
        text: `zsh: command not found: ${trimmed}. Type "help" for available commands.`,
      });
    }

    setHistory((prev) => [...prev, ...newLogs]);
    setInputVal('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleCommand(inputVal);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistory.length > 0) {
        const nextIdx = historyIdx + 1 < cmdHistory.length ? historyIdx + 1 : historyIdx;
        setHistoryIdx(nextIdx);
        setInputVal(cmdHistory[cmdHistory.length - 1 - nextIdx] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx > 0) {
        const nextIdx = historyIdx - 1;
        setHistoryIdx(nextIdx);
        setInputVal(cmdHistory[cmdHistory.length - 1 - nextIdx] || '');
      } else if (historyIdx === 0) {
        setHistoryIdx(-1);
        setInputVal('');
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="terminal-overlay" onClick={onClose}>
      <div className={`terminal-modal ${matrixActive ? 'matrix-bg' : ''}`} onClick={(e) => e.stopPropagation()}>
        {/* Terminal Header */}
        <div className="terminal-modal-header">
          <div className="terminal-modal-dots">
            <span className="dot red" onClick={onClose} title="Close"></span>
            <span className="dot yellow" title="Minimize"></span>
            <span className="dot green" title="Maximize"></span>
          </div>
          <div className="terminal-modal-title">root@pugazh-sec: ~ (/bin/pugazh-shell)</div>
          <button className="terminal-close-btn" onClick={onClose}>&times;</button>
        </div>

        {/* Terminal Body */}
        <div className="terminal-modal-body" onClick={() => inputRef.current?.focus()}>
          {history.map((item, idx) => (
            <div key={idx} className={`terminal-log ${item.type}`}>
              <pre>{item.text}</pre>
            </div>
          ))}

          {isScanning && (
            <div className="terminal-scanning">
              <span className="scan-spinner"></span> Processing...
            </div>
          )}

          {/* Active Input Line */}
          <div className="terminal-prompt-line">
            <span className="prompt-prefix">root@pugazh-sec:~#</span>
            <input
              ref={inputRef}
              type="text"
              className="terminal-input"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              spellCheck="false"
              autoComplete="off"
            />
          </div>
          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  );
}
