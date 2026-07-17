import { useEffect, useState } from 'react';
import { formatGuatemalaClock, formatGuatemalaDate } from '../../utils/time.js';
import './Clock.css';

const Clock = () => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="clock">
      <svg className="clock__icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3.5 2" />
      </svg>
      <div className="clock__readout">
        <span className="clock__time">{formatGuatemalaClock(now)}</span>
        <span className="clock__date">{formatGuatemalaDate(now)}</span>
      </div>
    </div>
  );
};

export default Clock;
