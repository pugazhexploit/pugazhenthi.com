import { useState, useEffect } from 'react';

// Helper to set cookie
function setCookie(name, value, days = 365) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

// Helper to get cookie
function getCookie(name) {
  return document.cookie.split('; ').reduce((r, v) => {
    const parts = v.split('=');
    return parts[0] === name ? decodeURIComponent(parts[1]) : r;
  }, '');
}

export function useVisitorTracker() {
  const [visitorData, setVisitorData] = useState({
    visitorId: '',
    visitCount: 1,
    firstVisit: '',
    lastVisit: '',
    isReturning: false,
    globalVisitors: 1482,
    activeNow: 4,
  });

  useEffect(() => {
    try {
      // 1. Get or generate Visitor ID
      let id = getCookie('cyber_visitor_id') || localStorage.getItem('cyber_visitor_id');
      if (!id) {
        id = 'VIP-' + Math.random().toString(36).substring(2, 7).toUpperCase();
        setCookie('cyber_visitor_id', id);
        localStorage.setItem('cyber_visitor_id', id);
      }

      // 2. First visit timestamp
      let first = getCookie('cyber_first_visit') || localStorage.getItem('cyber_first_visit');
      if (!first) {
        first = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        setCookie('cyber_first_visit', first);
        localStorage.setItem('cyber_first_visit', first);
      }

      // 3. Last visit timestamp
      const prevLast = getCookie('cyber_last_visit') || localStorage.getItem('cyber_last_visit') || 'Just Now';
      const nowFormatted = new Date().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
      setCookie('cyber_last_visit', nowFormatted);
      localStorage.setItem('cyber_last_visit', nowFormatted);

      // 4. Visit count calculation
      let count = parseInt(getCookie('cyber_visit_count') || localStorage.getItem('cyber_visit_count') || '0', 10);
      const sessionActive = sessionStorage.getItem('cyber_session');

      if (!sessionActive) {
        count += 1;
        sessionStorage.setItem('cyber_session', 'active');
        setCookie('cyber_visit_count', count.toString());
        localStorage.setItem('cyber_visit_count', count.toString());
      }

      // Simulated global count (Base 1480 + offset)
      const baseGlobal = 1480 + count * 2;
      const simulatedActive = Math.floor(Math.random() * 5) + 3; // 3-7 active now

      setVisitorData({
        visitorId: id,
        visitCount: count || 1,
        firstVisit: first,
        lastVisit: prevLast,
        isReturning: count > 1,
        globalVisitors: baseGlobal,
        activeNow: simulatedActive,
      });
    } catch {
      // Fallback
    }
  }, []);

  return visitorData;
}
