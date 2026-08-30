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
import PasswordAnalyzer from './components/PasswordAnalyzer';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Analytics } from '@vercel/analytics/react';
import {
  useScrollReveal,
  useConsoleEasterEgg,
  useGlitchEffect,
} from './hooks/useAnimations';

export default function App() {
  useScrollReveal();
  useConsoleEasterEgg();
  useGlitchEffect();

  return (
    <>
      <ParticleCanvas />
      <Navbar />
      <main role="main" itemScope itemType="https://schema.org/ProfilePage" aria-label="Pugazhenthi J - Cybersecurity Researcher Portfolio">
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

      <Footer />
      <BackToTop />
      <Chatbot />
      <SpeedInsights />
      <Analytics />
    </>
  );
}
