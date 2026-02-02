import React, { useState } from 'react';
import Timeline from './components/Timeline';
import EconomicImpact from './components/EconomicImpact';
import { HistoricalEvent } from './data/historicalEvents';
import './css/HistoricalAnalysis.css';

const HistoricalAnalysis: React.FC = () => {
  const [selectedTimestamp, setSelectedTimestamp] = useState<number>(Date.now());
  const [selectedEvent, setSelectedEvent] = useState<HistoricalEvent | undefined>();

  const handleDateChange = (timestamp: number, event?: HistoricalEvent) => {
    setSelectedTimestamp(timestamp);
    setSelectedEvent(event);
  };

  return (
    <div className="historical-analysis-container">
      <header className="analysis-header">
        <h1>Historical Trade War Analysis</h1>
        <p>Explore the timeline of US-China trade tensions and their economic impacts from 2018 to 2025</p>
      </header>

      <div className="analysis-content">
        <section className="timeline-section">
          <Timeline onDateChange={handleDateChange} />
        </section>

        <section className="impact-section">
          <EconomicImpact selectedTimestamp={selectedTimestamp} />
        </section>

        {selectedEvent && (
          <section className="insights-section">
            <div className="insights-card">
              <h3>💡 Key Insights</h3>
              <div className="insights-content">
                <div className="insight-row">
                  <strong>What happened:</strong>
                  <p>{selectedEvent.description}</p>
                </div>
                <div className="insight-row">
                  <strong>Strategic context:</strong>
                  <p>
                    {selectedEvent.category === 'tariff' &&
                      'Tariff escalations are classic tit-for-tat strategies in trade wars, often leading to economic losses for both sides.'}
                    {selectedEvent.category === 'tech' &&
                      'Technology restrictions represent a shift from traditional trade policy to strategic competition over future industries.'}
                    {selectedEvent.category === 'negotiation' &&
                      'Negotiated agreements offer the potential for Pareto-optimal outcomes where both sides can benefit.'}
                    {selectedEvent.category === 'sanction' &&
                      'Sanctions target specific entities or sectors, aiming for precision over broad economic impact.'}
                    {selectedEvent.category === 'other' &&
                      'Non-economic events can still significantly impact trade relations and strategic calculus.'}
                  </p>
                </div>
                <div className="insight-row">
                  <strong>Game theory perspective:</strong>
                  <p>
                    {(selectedEvent.usAction?.includes('Escalate') ||
                      selectedEvent.chinaAction?.includes('Escalate')) &&
                      'Both players escalating suggests movement away from Nash Equilibrium toward mutually destructive outcomes.'}
                    {(selectedEvent.usAction?.includes('De-escalate') &&
                      selectedEvent.chinaAction?.includes('De-escalate')) &&
                      'Mutual de-escalation moves toward Pareto-optimal outcomes, though politically costly.'}
                    {((selectedEvent.usAction?.includes('Escalate') &&
                        selectedEvent.chinaAction?.includes('Status')) ||
                      (selectedEvent.usAction?.includes('Status') &&
                        selectedEvent.chinaAction?.includes('Escalate'))) &&
                      'Asymmetric responses create the "Unstable Détente" equilibrium described in the research.'}
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        <section className="comparison-section">
          <div className="comparison-card">
            <h3>📊 Comparative Analysis</h3>
            <div className="comparison-grid">
              <div className="comparison-item">
                <h4>Most Impacted Sectors</h4>
                <ul>
                  <li>🥇 Technology (-{Math.abs(calculateSectorImpact('tech')).toFixed(1)} points)</li>
                  <li>🥈 Manufacturing (-{Math.abs(calculateSectorImpact('manufacturing')).toFixed(1)} points)</li>
                  <li>🥉 Agriculture (-{Math.abs(calculateSectorImpact('agriculture')).toFixed(1)} points)</li>
                </ul>
              </div>
              <div className="comparison-item">
                <h4>Key Turning Points</h4>
                <ul>
                  <li>📍 First Tariffs (Mar 2018) - Initial escalation</li>
                  <li>📍 Huawei Ban (May 2019) - Tech war begins</li>
                  <li>📍 Phase One Deal (Jan 2020) - Temporary relief</li>
                  <li>📍 Semiconductor Controls (Oct 2022) - Strategic decoupling</li>
                </ul>
              </div>
              <div className="comparison-item">
                <h4>Winners & Losers</h4>
                <p><strong>Relative Winners:</strong> Third-party countries (Vietnam, Mexico) benefiting from supply chain diversification</p>
                <p><strong>Clear Losers:</strong> Consumers in both countries facing higher prices, farmers losing market access</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

// Helper function to calculate sector impact up to current time
const calculateSectorImpact = (sector: 'tech' | 'agriculture' | 'manufacturing' | 'services'): number => {
  // This is a simplified calculation - in reality would use the cumulative data
  const impacts = {
    tech: -42,
    manufacturing: -25,
    agriculture: -23,
    services: -10
  };
  return impacts[sector];
};

export default HistoricalAnalysis;
