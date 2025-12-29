import { useEffect, useState } from "react";
import "../styles/global.css";

export default function GameOverlay({ getEvents, clearEvents }) {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newEvents = getEvents();
      if (newEvents.length > 0) {
        setEvents(newEvents.slice(-3)); // show last 3 events
        clearEvents();
      }
    }, 300);

    return () => clearInterval(interval);
  }, [getEvents, clearEvents]);

  return (
    <div className="game-overlay">
      {events.map((e) => (
        <div key={e.id} className={`overlay-item ${e.type}`}>
          {e.label}
        </div>
      ))}
    </div>
  );
}
