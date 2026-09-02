import { useState, useRef, useEffect, useCallback } from 'react';
import './Chatbot.css';

// ========================================
// KNOWLEDGE BASE
// ========================================
const KB = {
  name: 'Pugazhenthi J',
  roles: ['Cybersecurity Enthusiast', 'Bug Researcher', 'Ethical Hacker', 'Penetration Tester', 'CTF Player'],
  slogans: [
    'Breaking systems to understand them. Building technology to secure them.',
    'Exploit. Analyze. Harden everything.',
    'Learn. Break. Build. Secure.',
    'Hack to protect. Learn to improve. Report responsibly.',
  ],
  location: 'Chidambaram, Tamil Nadu, India',
  email: 'pugazhenthij283@gmail.com',
  phone: '+91 8608442802',
  resume: '/cyber_security-resiume.pdf',
  socials: {
    github: 'https://github.com/pugazhexploit',
    linkedin: 'https://in.linkedin.com/in/pugazhenthij-cyber',
    tryhackme: 'https://tryhackme.com/p/pugazhenthij283',
  },
  education: {
    degree: 'B.Sc Computer Science',
    institution: 'AVC College (Autonomous)',
    location: 'Mayiladuthurai, Tamil Nadu',
    duration: '2024 — 2027',
    team: 'Team ASTRA',
  },
  experience: {
    role: 'Web Developer · Stage Designer · Book Wrapper Designer',
    duration: '2-Year Internship',
    org: 'Ilanthoodhu Student Magazine — AVC College',
    tasks: ['Web platform development', 'Stage design for launches', 'Publication cover design'],
  },
  skills: {
    cyber: ['Penetration Testing', 'Ethical Hacking', 'Web App Security (OWASP Top 10)', 'OSINT', 'Cryptography', 'Digital Forensics', 'Network Security', 'CTF Challenges'],
    programming: ['Python', 'JavaScript', 'Bash/Linux', 'HTML/CSS'],
    frameworks: ['FastAPI', 'React.js', 'Telegram Bot API', 'GIS Mapping', 'Google Gemini API'],
    tools: ['Kali Linux', 'Nmap', 'Nuclei', 'GitHub', 'TryHackMe'],
    ai: ['Prompt Engineering', 'Machine Learning', 'Geospatial AI'],
    cloud: ['AWS (Beginner — IAM, S3, CloudFront, EC2)'],
  },
  projects: [
    { name: 'KALI MCP TERMINAL', desc: 'FastAPI Remote Shell + AI Cybersecurity Assistant for CTF and pentesting through a web terminal.', tech: 'Gemini AI, FastAPI, Linux Terminal', github: 'https://github.com/pugazhexploit/kali-mcp', section: 'projects' },
    { name: 'AI-AGENT-SARA V2.0', desc: 'Telegram AI Bot with Google Gemini for cybersecurity learning, email generation, and OSINT.', tech: 'Python, Gemini API, Telegram Bot API', github: 'https://github.com/pugazhexploit/AI-agent-sara-cyber-security-', section: 'projects' },
    { name: 'RURALCARE-MAP-AI', desc: 'AI-Powered Geospatial Healthcare Platform for rural Tamil Nadu. Won 2nd Prize + ₹4,000 at TN Govt Youth Fest.', tech: 'React.js, Python, AI/ML, GIS', github: 'https://github.com/pugazhexploit/Ruralcare-Map-AI', section: 'projects' },
    { name: 'WEBPYS', desc: 'Python-based Web Pentesting, Vulnerability & Subdomain Scanner with Nmap and Nuclei integration.', tech: 'Python, Nmap, Nuclei, SSL/TLS', github: 'https://github.com/pugazhexploit/Webpys', section: 'projects' },
    { name: 'IT WEBSITE & MAGAZINE PLATFORM', desc: 'Official departmental web portal and digital student publication showcase.', tech: 'React.js, HTML5, CSS3, JavaScript', github: 'https://github.com/pugazhexploit/it-website', section: 'projects' },
  ],
  achievements: [
    { title: 'Government Vulnerability Disclosure (*.gov.in)', detail: 'Officially acknowledged responsible disclosure of a security misconfiguration on an Indian Government website. Reference number assigned.' },
    { title: 'Chaitanya CTF 2025 — 14th Place', detail: '9,737+ points across Web Security, Crypto, OSINT, Forensics, and Reverse Engineering.' },
    { title: 'TN Govt Youth Festival — 2nd Prize', detail: 'Prompt Engineering Competition. Won ₹4,000 Cash Award from District Collector Srikanth H.S. for Ruralcare-Map-AI.' },
    { title: 'TryHackMe Weekly League — 2nd Place', detail: '816 points, earned 2 Gold Tickets.' },
    { title: '30-Day TryHackMe Streak', detail: 'Continuous hands-on security labs and challenge rooms.' },
    { title: 'National MIME Event — 1st Place', detail: 'At Rabiyammal Ahmed Maideen College, Thiruvarur.' },
  ],
  certifications: [
    { name: 'CCEP — Certified Cybersecurity Educator Professional', issuer: 'Red Team Leaders', year: '2025' },
    { name: 'TryHackMe Active Learning Path', issuer: 'TryHackMe', year: '2024–2025' },
    { name: 'CNSP — Certified Network Security Practitioner', issuer: 'The SecOps Group', year: '2025' },
  ],
  ctf: {
    platform: 'TryHackMe',
    team: 'Team ASTRA',
    status: 'Active',
    killChain: ['RECON', 'ENUMERATION', 'EXPLOIT', 'PRIVESC', 'FORENSICS', 'FLAG CAPTURED'],
    focusAreas: ['Web Security', 'Cryptography', 'OSINT', 'Forensics', 'Reverse Engineering', 'Steganography'],
  },
  govDisclosure: {
    target: 'Indian Government (*.gov.in) Website',
    type: 'Security Misconfiguration',
    status: 'Acknowledged — Reference Number Assigned — Remediation In Progress',
    impact: 'Zero data accessed — non-intrusive verification',
  },
};

// ========================================
// INTENT MATCHING
// ========================================
const normalize = (s) => s.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();

const intents = [
  {
    keys: ['who', 'introduce', 'yourself', 'about', 'tell me', 'who are you', 'what do you do', 'what is this'],
    section: 'about',
    response: () =>
      `I'm the portfolio assistant for <strong>${KB.name}</strong> — ${KB.roles.join(', ')}.\n\n"${KB.slogans[0]}"\n\nHe's a ${KB.education.degree} student at ${KB.education.institution} (${KB.education.duration}), focused on cybersecurity, ethical hacking, and AI-driven security systems.\n\nMember of <strong>${KB.education.team}</strong>.`,
  },
  {
    keys: ['skill', 'skills', 'tech stack', 'technologies', 'what can', 'expertise', 'arsenal'],
    section: 'skills',
    response: () =>
      `<strong>🛡️ Cybersecurity:</strong> ${KB.skills.cyber.join(', ')}\n\n<strong>💻 Programming:</strong> ${KB.skills.programming.join(', ')}\n\n<strong>⚡ Frameworks:</strong> ${KB.skills.frameworks.join(', ')}\n\n<strong>🔧 Tools:</strong> ${KB.skills.tools.join(', ')}\n\n<strong>🤖 AI/ML:</strong> ${KB.skills.ai.join(', ')}\n\n<strong>☁️ Cloud:</strong> ${KB.skills.cloud.join(', ')}`,
  },
  {
    keys: ['project', 'projects', 'built', 'tools', 'work', 'portfolio', 'developed', 'created'],
    section: 'projects',
    response: () =>
      KB.projects.map((p, i) => `<strong>${i + 1}. ${p.name}</strong>\n${p.desc}\nTech: ${p.tech}`).join('\n\n'),
  },
  {
    keys: ['achievement', 'achieve', 'award', 'prize', 'recognition', 'accomplish', 'won'],
    section: 'achievements',
    response: () =>
      KB.achievements.map((a) => `<strong>🏆 ${a.title}</strong>\n${a.detail}`).join('\n\n'),
  },
  {
    keys: ['certif', 'cert', 'certs', 'certified', 'ccep', 'cnsp'],
    section: 'certifications',
    response: () =>
      KB.certifications.map((c) => `<strong>📜 ${c.name}</strong>\nIssued by ${c.issuer} (${c.year})`).join('\n\n'),
  },
  {
    keys: ['ctf', 'capture the flag', 'tryhackme', 'hack', 'cyber range', 'kill chain'],
    section: 'ctf',
    response: () =>
      `<strong>Platform:</strong> ${KB.ctf.platform}\n<strong>Team:</strong> ${KB.ctf.team}\n<strong>Status:</strong> ${KB.ctf.status}\n\n<strong>Kill Chain:</strong> ${KB.ctf.killChain.join(' → ')}\n\n<strong>Focus Areas:</strong> ${KB.ctf.focusAreas.join(', ')}`,
  },
  {
    keys: ['experience', 'intern', 'work history', 'job', 'ilanthoodhu', 'magazine'],
    section: 'experience',
    response: () =>
      `<strong>${KB.experience.role}</strong>\n${KB.experience.duration} at ${KB.experience.org}\n\nKey tasks:\n${KB.experience.tasks.map(t => `• ${t}`).join('\n')}`,
  },
  {
    keys: ['education', 'college', 'degree', 'university', 'study', 'avc', 'school'],
    section: 'education',
    response: () =>
      `<strong>${KB.education.degree}</strong>\n${KB.education.institution}, ${KB.education.location}\nBatch: ${KB.education.duration}\nTeam: ${KB.education.team}`,
  },
  {
    keys: ['contact', 'email', 'phone', 'reach', 'hire', 'connect', 'message'],
    section: 'contact',
    response: () =>
      `<strong>📧 Email:</strong> <a href="mailto:${KB.email}">${KB.email}</a>\n<strong>📞 Phone:</strong> ${KB.phone}\n<strong>📍 Location:</strong> ${KB.location}\n\n<strong>Socials:</strong>\n• <a href="${KB.socials.github}" target="_blank">GitHub</a>\n• <a href="${KB.socials.linkedin}" target="_blank">LinkedIn</a>\n• <a href="${KB.socials.tryhackme}" target="_blank">TryHackMe</a>`,
  },
  {
    keys: ['resume', 'cv', 'download'],
    response: () =>
      `You can download the resume here:\n<a href="${KB.resume}" target="_blank"><strong>📄 Download Resume (PDF)</strong></a>`,
  },
  {
    keys: ['github', 'git', 'repo', 'source code', 'open source'],
    response: () =>
      `GitHub: <a href="${KB.socials.github}" target="_blank"><strong>github.com/pugazhexploit</strong></a>\n\nProject repos:\n${KB.projects.map(p => `• <a href="${p.github}" target="_blank">${p.name}</a>`).join('\n')}`,
  },
  {
    keys: ['vulnerability', 'gov', 'disclosure', 'bug', 'government', 'milestone'],
    section: 'milestone',
    response: () =>
      `<strong>🛡️ Government Vulnerability Disclosure</strong>\n\nTarget: ${KB.govDisclosure.target}\nType: ${KB.govDisclosure.type}\nStatus: ${KB.govDisclosure.status}\nImpact: ${KB.govDisclosure.impact}\n\nThis milestone demonstrates responsible security research and ethical bug reporting through official CERT channels.`,
  },
  {
    keys: ['kali', 'mcp', 'terminal', 'remote shell'],
    section: 'projects',
    response: () => {
      const p = KB.projects[0];
      return `<strong>${p.name}</strong>\n${p.desc}\n\nTech: ${p.tech}\n<a href="${p.github}" target="_blank">View on GitHub →</a>`;
    },
  },
  {
    keys: ['sara', 'telegram', 'bot', 'ai agent'],
    section: 'projects',
    response: () => {
      const p = KB.projects[1];
      return `<strong>${p.name}</strong>\n${p.desc}\n\nTech: ${p.tech}\n<a href="${p.github}" target="_blank">View on GitHub →</a>`;
    },
  },
  {
    keys: ['ruralcare', 'healthcare', 'gis', 'geospatial', 'rural'],
    section: 'projects',
    response: () => {
      const p = KB.projects[2];
      return `<strong>${p.name}</strong>\n${p.desc}\n\nTech: ${p.tech}\n<a href="${p.github}" target="_blank">View on GitHub →</a>`;
    },
  },
  {
    keys: ['webpys', 'scanner', 'subdomain', 'vulnerability scan'],
    section: 'projects',
    response: () => {
      const p = KB.projects[3];
      return `<strong>${p.name}</strong>\n${p.desc}\n\nTech: ${p.tech}\n<a href="${p.github}" target="_blank">View on GitHub →</a>`;
    },
  },
  {
    keys: ['team', 'astra'],
    response: () =>
      `<strong>Team ASTRA</strong> is the cybersecurity research and CTF competition team that ${KB.name} is an active member of at ${KB.education.institution}.`,
  },
  {
    keys: ['location', 'where', 'based', 'city', 'country', 'india'],
    response: () =>
      `${KB.name} is based in <strong>${KB.location}</strong>.`,
  },
  {
    keys: ['navigate', 'go to', 'show me', 'take me', 'scroll', 'jump'],
    response: (input) => {
      const sectionMap = {
        home: 'hero', top: 'hero', about: 'about', skill: 'skills', project: 'projects',
        achieve: 'achievements', experience: 'experience', education: 'education',
        cert: 'certifications', ctf: 'ctf', contact: 'contact', milestone: 'milestone',
        disclosure: 'milestone', focus: 'cyberfocus',
      };
      const norm = normalize(input);
      for (const [key, sectionId] of Object.entries(sectionMap)) {
        if (norm.includes(key)) {
          return { text: `Navigating to the <strong>${key}</strong> section...`, navigateTo: sectionId };
        }
      }
      return `Which section? Try: Home, About, Skills, Projects, Achievements, Experience, Education, Certifications, CTF, Contact, or Milestone.`;
    },
  },
  {
    keys: ['hello', 'hi', 'hey', 'hola', 'sup', 'greet', 'good morning', 'good evening'],
    response: () =>
      `Hey there! 👋 I'm <strong>CyberBot</strong>, the AI assistant for ${KB.name}'s portfolio.\n\nI can help you explore skills, projects, achievements, certifications, and more. What would you like to know?`,
  },
  {
    keys: ['thanks', 'thank', 'bye', 'goodbye', 'see you', 'later'],
    response: () =>
      `Glad I could help! 🛡️ Feel free to come back anytime.\n\n<em>"${KB.slogans[Math.floor(Math.random() * KB.slogans.length)]}"</em>`,
  },
];

function getResponse(input) {
  const norm = normalize(input);
  if (!norm) return { text: 'Type a question about this portfolio — I know everything here! 🔍' };

  // Check each intent
  for (const intent of intents) {
    const matched = intent.keys.some((k) => norm.includes(k));
    if (matched) {
      const result = intent.response(input);
      if (typeof result === 'object' && result.text) {
        return { text: result.text, navigateTo: result.navigateTo, section: intent.section };
      }
      return { text: result, section: intent.section };
    }
  }

  // Fallback
  return {
    text: `I'm not sure about that. Try asking about:\n• <strong>Skills</strong> & tech stack\n• <strong>Projects</strong> I've built\n• <strong>Achievements</strong> & awards\n• <strong>Certifications</strong>\n• <strong>CTF</strong> & hacking\n• <strong>Education</strong> & experience\n• <strong>Contact</strong> info\n• <strong>Resume</strong> download\n• <strong>Navigate</strong> to any section`,
  };
}

// ========================================
// QUICK ACTION CHIPS
// ========================================
const quickActions = [
  { label: '🛡️ Skills', query: 'What are your skills?' },
  { label: '🚀 Projects', query: 'Show me the projects' },
  { label: '🏆 Achievements', query: 'What achievements?' },
  { label: '📜 Certs', query: 'Certifications' },
  { label: '🎯 CTF', query: 'Tell me about CTF' },
  { label: '📧 Contact', query: 'How to contact?' },
  { label: '📄 Resume', query: 'Download resume' },
];

// ========================================
// COMPONENT
// ========================================
export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showBadge, setShowBadge] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Welcome message on first open
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setIsTyping(true);
      setTimeout(() => {
        setMessages([
          {
            type: 'bot',
            html: `Welcome to <strong>${KB.name}</strong>'s terminal! 🖥️\n\nI'm <strong>CyberBot</strong> — your guide to this portfolio. I can tell you about skills, projects, achievements, certifications, CTF activities, and more.\n\nAsk me anything or tap a quick action below!`,
            chips: quickActions,
          },
        ]);
        setIsTyping(false);
      }, 800);
    }
  }, [isOpen]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 400);
    }
  }, [isOpen]);

  const scrollToSection = useCallback((sectionId) => {
    if (!sectionId) return;
    const el = document.getElementById(sectionId);
    if (el) {
      const offset = 70;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }, []);

  const handleSend = useCallback((text) => {
    const query = text || input.trim();
    if (!query) return;

    // Add user message
    setMessages((prev) => [...prev, { type: 'user', html: query }]);
    setInput('');
    setIsTyping(true);

    // Simulate thinking delay
    const delay = 400 + Math.random() * 600;
    setTimeout(() => {
      const result = getResponse(query);
      setMessages((prev) => [
        ...prev,
        { type: 'bot', html: result.text, chips: null },
      ]);
      setIsTyping(false);

      // Navigate if needed
      if (result.navigateTo) {
        setTimeout(() => scrollToSection(result.navigateTo), 500);
      } else if (result.section) {
        // Optional: scroll to section for context
      }
    }, delay);
  }, [input, scrollToSection]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChipClick = (query) => {
    handleSend(query);
  };

  const toggleChat = () => {
    setIsOpen((prev) => !prev);
    setShowBadge(false);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        className={`cyberbot-toggle${isOpen ? ' open' : ''}`}
        onClick={toggleChat}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
        title="CyberBot — Portfolio Assistant"
      >
        {isOpen ? (
          <i className="fas fa-times"></i>
        ) : (
          <i className="fas fa-robot"></i>
        )}
        {showBadge && !isOpen && <span className="cyberbot-badge"></span>}
      </button>

      {/* Chat Window */}
      <div className={`cyberbot-window${isOpen ? ' open' : ''}`}>
        {/* Header */}
        <div className="cyberbot-header">
          <div className="cyberbot-avatar">
            <i className="fas fa-shield-halved"></i>
          </div>
          <div className="cyberbot-header-info">
            <div className="cyberbot-header-name">CYBERBOT</div>
            <div className="cyberbot-header-status">
              <span className="cyberbot-status-dot"></span>
              ONLINE — PORTFOLIO ASSISTANT
            </div>
          </div>
          <button className="cyberbot-close" onClick={() => setIsOpen(false)} aria-label="Close">
            <i className="fas fa-minus"></i>
          </button>
        </div>

        {/* Messages */}
        <div className="cyberbot-messages">
          {messages.map((msg, i) => (
            <div key={i} className={`cyberbot-msg ${msg.type}`}>
              <div className="cyberbot-msg-icon">
                {msg.type === 'bot' ? (
                  <i className="fas fa-terminal"></i>
                ) : (
                  <i className="fas fa-user"></i>
                )}
              </div>
              <div>
                <div
                  className="cyberbot-msg-bubble"
                  dangerouslySetInnerHTML={{ __html: msg.html.replace(/\n/g, '<br/>') }}
                />
                {msg.chips && (
                  <div className="cyberbot-quick-actions">
                    {msg.chips.map((chip, j) => (
                      <button
                        key={j}
                        className="cyberbot-chip"
                        onClick={() => handleChipClick(chip.query)}
                      >
                        {chip.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="cyberbot-typing">
              <div className="cyberbot-typing-dot"></div>
              <div className="cyberbot-typing-dot"></div>
              <div className="cyberbot-typing-dot"></div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="cyberbot-input-area">
          <input
            ref={inputRef}
            className="cyberbot-input"
            type="text"
            placeholder="Ask me anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            autoComplete="off"
          />
          <button className="cyberbot-send" onClick={() => handleSend()} aria-label="Send">
            <i className="fas fa-paper-plane"></i>
          </button>
        </div>

        {/* Footer */}
        <div className="cyberbot-footer">
          Powered by CyberBot · {KB.name}'s Portfolio
        </div>
      </div>
    </>
  );
}
