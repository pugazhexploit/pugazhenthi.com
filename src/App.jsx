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
import { SpeedInsights } from '@vercel/speed-insights/react';
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
        <Certifications />
        <Recognition />
        <CyberFocus />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
      <Chatbot />
      <SpeedInsights />
    </>
  );
}
