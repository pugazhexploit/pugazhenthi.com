import { useVisitorTracker } from '../hooks/useVisitorTracker';
import './VisitorCounter.css';

export default function VisitorCounter() {
  const { visitorId, visitCount, firstVisit, lastVisit, isReturning, globalVisitors, activeNow } =
    useVisitorTracker();

  return (
    <div className="visitor-badge-container">
      <div className="visitor-badge-header">
        <div className="visitor-badge-title">
          <span className="live-dot"></span> LIVE VISITOR METRICS
        </div>
        <div className="visitor-id-tag">ID: {visitorId || 'VIP-7A9B3'}</div>
      </div>

      <div className="visitor-badge-grid">
        <div className="visitor-metric-box">
          <div className="metric-num">{globalVisitors}</div>
          <div className="metric-label">TOTAL VISITS</div>
        </div>
        <div className="visitor-metric-box">
          <div className="metric-num highlight">{visitCount}</div>
          <div className="metric-label">YOUR VISITS</div>
        </div>
        <div className="visitor-metric-box">
          <div className="metric-num online">{activeNow}</div>
          <div className="metric-label">ONLINE NOW</div>
        </div>
      </div>

      <div className="visitor-badge-status">
        {isReturning ? (
          <span>
            👋 Welcome back, Cyber Explorer! Previous visit: <strong>{lastVisit}</strong>
          </span>
        ) : (
          <span>
            🚀 First time visiting! Initialized session on <strong>{firstVisit}</strong>
          </span>
        )}
      </div>
    </div>
  );
}
