import { useState, useEffect } from 'react';
import ParticleCanvas from './components/ParticleCanvas';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import VulnerabilityDisclosure from './components/VulnerabilityDisclosure';
import CoreMissions from './components/CoreMissions';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Education from './components/Education';
import Achievements from './components/Achievements';
import CTF from './components/CTF';
import Certifications from './components/Certifications';
import Recognition from './components/Recognition';
import CyberFocus from './components/CyberFocus';
import Contact from './components/Contact';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import Chatbot from './components/Chatbot';
import CyberTerminal from './components/CyberTerminal';
import PasswordAnalyzer from './components/PasswordAnalyzer';
import { SpeedInsights } from '@vercel/speed-insights/react';
import {
  useScrollReveal,
  useConsoleEasterEgg,
  useGlitchEffect,
} from './hooks/useAnimations';

export default function App() {
  const [terminalOpen, setTerminalOpen] = useState(false);

  useScrollReveal();
  useConsoleEasterEgg();
  useGlitchEffect();

  // Keyboard shortcut: Ctrl + ~ or ` (Backtick) opens terminal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey && e.key === '~') || (e.ctrlKey && e.key === '`')) {
        e.preventDefault();
        setTerminalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <ParticleCanvas />
      <Navbar />
      <main>
        <Hero />
        <About />
        <VulnerabilityDisclosure />
        <CoreMissions />
        <Skills />
        <Projects />
        <Experience />
        <Education />
        <Achievements />
        <CTF />
        <PasswordAnalyzer />
        <Certifications />
        <Recognition />
        <CyberFocus />
        <Contact />
      </main>

      {/* Floating Terminal Trigger Button */}
      <button
        className="cyber-terminal-trigger"
        onClick={() => setTerminalOpen(true)}
        title="Open Interactive Cyber Shell (Ctrl + ~)"
      >
        <i className="fas fa-terminal"></i> &gt;_ TERMINAL
      </button>

      {/* Interactive Cyber CLI Terminal Modal */}
      <CyberTerminal
        isOpen={terminalOpen}
        onClose={() => setTerminalOpen(false)}
      />

      <Footer />
      <BackToTop />
      <Chatbot />
      <SpeedInsights />
    </>
  );
}
