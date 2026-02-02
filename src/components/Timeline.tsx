import React, { useState } from 'react';
import { historicalEvents, getEventByDate, HistoricalEvent } from '../data/historicalEvents';
import '../css/Timeline.css';

interface TimelineProps {
  onDateChange: (timestamp: number, event?: HistoricalEvent) => void;
}

const Timeline: React.FC<TimelineProps> = ({ onDateChange }) => {
  const minDate = historicalEvents[0].timestamp;
  const maxDate = historicalEvents[historicalEvents.length - 1].timestamp;
  const [currentTimestamp, setCurrentTimestamp] = useState<number>(maxDate);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const currentEvent = getEventByDate(currentTimestamp);
  const currentDate = new Date(currentTimestamp);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const timestamp = parseInt(e.target.value);
    setCurrentTimestamp(timestamp);
    const event = getEventByDate(timestamp);
    onDateChange(timestamp, event);
  };

  const handleEventClick = (event: HistoricalEvent) => {
    setCurrentTimestamp(event.timestamp);
    onDateChange(event.timestamp, event);
  };

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  const getCategoryColor = (category: string): string => {
    const colors: { [key: string]: string } = {
      tariff: '#ef4444',
      tech: '#3b82f6',
      negotiation: '#10b981',
      sanction: '#f59e0b',
      other: '#6b7280'
    };
    return colors[category] || colors.other;
  };

  const getCategoryIcon = (category: string): string => {
    const icons: { [key: string]: string } = {
      tariff: '💰',
      tech: '💻',
      negotiation: '🤝',
      sanction: '⚠️',
      other: '📋'
    };
    return icons[category] || icons.other;
  };

  const playTimeline = () => {
    setIsPlaying(!isPlaying);
    // Animation logic would go here for auto-playing through events
  };

  return (
    <div className="timeline-container">
      <div className="timeline-header">
        <h3>Historical Trade War Timeline</h3>
        <div className="timeline-controls">
          <button className="play-button" onClick={playTimeline}>
            {isPlaying ? '⏸' : '▶️'} {isPlaying ? 'Pause' : 'Play'}
          </button>
          <span className="current-date">{formatDate(currentTimestamp)}</span>
        </div>
      </div>

      <div className="timeline-slider-container">
        <input
          type="range"
          min={minDate}
          max={maxDate}
          value={currentTimestamp}
          onChange={handleSliderChange}
          className="timeline-slider"
          step={86400000} // 1 day in milliseconds
        />
        <div className="timeline-markers">
          {historicalEvents.map((event) => {
            const position = ((event.timestamp - minDate) / (maxDate - minDate)) * 100;
            return (
              <div
                key={event.id}
                className="timeline-marker"
                style={{
                  left: `${position}%`,
                  backgroundColor: getCategoryColor(event.category)
                }}
                onClick={() => handleEventClick(event)}
                title={event.title}
              />
            );
          })}
        </div>
      </div>

      {currentEvent && (
        <div className="current-event-card">
          <div className="event-header">
            <span className="event-icon">{getCategoryIcon(currentEvent.category)}</span>
            <div className="event-title-section">
              <h4>{currentEvent.title}</h4>
              <span className="event-date">{currentEvent.date}</span>
            </div>
            <span
              className="event-category-badge"
              style={{ backgroundColor: getCategoryColor(currentEvent.category) }}
            >
              {currentEvent.category}
            </span>
          </div>
          <p className="event-description">{currentEvent.description}</p>
          <div className="event-actions">
            <div className="action-column">
              <strong>🇺🇸 US Action:</strong>
              <span>{currentEvent.usAction || 'No action'}</span>
            </div>
            <div className="action-column">
              <strong>🇨🇳 China Action:</strong>
              <span>{currentEvent.chinaAction || 'No action'}</span>
            </div>
          </div>
          <div className="event-impact-summary">
            <div className="impact-item">
              <span>GDP Impact (US):</span>
              <span className={currentEvent.gdpImpact.us >= 0 ? 'positive' : 'negative'}>
                {currentEvent.gdpImpact.us >= 0 ? '+' : ''}{currentEvent.gdpImpact.us}%
              </span>
            </div>
            <div className="impact-item">
              <span>GDP Impact (China):</span>
              <span className={currentEvent.gdpImpact.china >= 0 ? 'positive' : 'negative'}>
                {currentEvent.gdpImpact.china >= 0 ? '+' : ''}{currentEvent.gdpImpact.china}%
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="events-list">
        <h4>All Events</h4>
        <div className="events-grid">
          {historicalEvents.map((event) => (
            <div
              key={event.id}
              className={`event-item ${currentEvent?.id === event.id ? 'active' : ''}`}
              onClick={() => handleEventClick(event)}
              style={{ borderLeftColor: getCategoryColor(event.category) }}
            >
              <span className="event-icon-small">{getCategoryIcon(event.category)}</span>
              <div className="event-content">
                <strong>{event.date}</strong>
                <span>{event.title}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Timeline;
