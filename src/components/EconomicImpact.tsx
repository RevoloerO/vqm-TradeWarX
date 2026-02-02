import React from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartData as ChartJsData,
  Filler
} from 'chart.js';
import { historicalEvents, calculateCumulativeImpact } from '../data/historicalEvents';
import '../css/EconomicImpact.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface EconomicImpactProps {
  selectedTimestamp?: number;
}

const EconomicImpact: React.FC<EconomicImpactProps> = ({ selectedTimestamp }) => {
  const currentTimestamp = selectedTimestamp || Date.now();
  const cumulative = calculateCumulativeImpact(currentTimestamp);

  // GDP Growth Over Time
  const gdpTimelineData: ChartJsData<'line'> = {
    labels: historicalEvents
      .filter(e => e.timestamp <= currentTimestamp)
      .map(e => e.date),
    datasets: [
      {
        label: 'US GDP Impact (%)',
        data: historicalEvents
          .filter(e => e.timestamp <= currentTimestamp)
          .map((_e, index) => {
            const eventsUpTo = historicalEvents.slice(0, index + 1);
            return eventsUpTo.reduce((sum, event) => sum + event.gdpImpact.us, 0);
          }),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'China GDP Impact (%)',
        data: historicalEvents
          .filter(e => e.timestamp <= currentTimestamp)
          .map((_e, index) => {
            const eventsUpTo = historicalEvents.slice(0, index + 1);
            return eventsUpTo.reduce((sum, event) => sum + event.gdpImpact.china, 0);
          }),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const gdpOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const
      },
      title: {
        display: true,
        text: 'Cumulative GDP Impact Over Time',
        font: { size: 16 }
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            return `${context.dataset.label}: ${context.parsed.y.toFixed(2)}%`;
          }
        }
      }
    },
    scales: {
      y: {
        title: {
          display: true,
          text: 'GDP Impact (%)'
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  // Sector Impact Bar Chart
  const sectorData: ChartJsData<'bar'> = {
    labels: ['Technology', 'Agriculture', 'Manufacturing', 'Services'],
    datasets: [
      {
        label: 'Sector Impact Score',
        data: [
          cumulative.sectors.tech,
          cumulative.sectors.agriculture,
          cumulative.sectors.manufacturing,
          cumulative.sectors.services
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.7)',
          'rgba(34, 197, 94, 0.7)',
          'rgba(249, 115, 22, 0.7)',
          'rgba(168, 85, 247, 0.7)'
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(34, 197, 94)',
          'rgb(249, 115, 22)',
          'rgb(168, 85, 247)'
        ],
        borderWidth: 2
      }
    ]
  };

  const sectorOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Sector-Specific Impact Analysis',
        font: { size: 16 }
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.parsed.y;
            return `Impact: ${value > 0 ? '+' : ''}${value.toFixed(1)}`;
          }
        }
      }
    },
    scales: {
      y: {
        title: {
          display: true,
          text: 'Impact Score'
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  // Component Impact Distribution (US)
  const usComponentData: ChartJsData<'doughnut'> = {
    labels: ['Economic', 'Political', 'Tech', 'Supply Chain'],
    datasets: [
      {
        label: 'US Impact Distribution',
        data: [
          Math.abs(cumulative.us.economic),
          Math.abs(cumulative.us.political),
          Math.abs(cumulative.us.tech),
          Math.abs(cumulative.us.supplyChain)
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.7)',
          'rgba(239, 68, 68, 0.7)',
          'rgba(34, 197, 94, 0.7)',
          'rgba(249, 115, 22, 0.7)'
        ],
        borderColor: 'white',
        borderWidth: 2
      }
    ]
  };

  // Component Impact Distribution (China)
  const chinaComponentData: ChartJsData<'doughnut'> = {
    labels: ['Economic', 'Political', 'Tech', 'Supply Chain'],
    datasets: [
      {
        label: 'China Impact Distribution',
        data: [
          Math.abs(cumulative.china.economic),
          Math.abs(cumulative.china.political),
          Math.abs(cumulative.china.tech),
          Math.abs(cumulative.china.supplyChain)
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.7)',
          'rgba(239, 68, 68, 0.7)',
          'rgba(34, 197, 94, 0.7)',
          'rgba(249, 115, 22, 0.7)'
        ],
        borderColor: 'white',
        borderWidth: 2
      }
    ]
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value.toFixed(1)} (${percentage}%)`;
          }
        }
      }
    }
  };

  return (
    <div className="economic-impact-container">
      <div className="impact-header">
        <h2>Economic Impact Analysis</h2>
        <p>Comprehensive analysis of trade war effects on GDP, sectors, and strategic components</p>
      </div>

      {/* Summary Cards */}
      <div className="impact-summary-cards">
        <div className="summary-card us-card">
          <h3>🇺🇸 United States</h3>
          <div className="summary-stats">
            <div className="stat-item">
              <span className="stat-label">Cumulative GDP Impact</span>
              <span className={`stat-value ${cumulative.gdpImpact.us >= 0 ? 'positive' : 'negative'}`}>
                {cumulative.gdpImpact.us >= 0 ? '+' : ''}{cumulative.gdpImpact.us.toFixed(2)}%
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Economic Score</span>
              <span className={`stat-value ${cumulative.us.economic >= 0 ? 'positive' : 'negative'}`}>
                {cumulative.us.economic >= 0 ? '+' : ''}{cumulative.us.economic.toFixed(1)}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Tech Dominance</span>
              <span className={`stat-value ${cumulative.us.tech >= 0 ? 'positive' : 'negative'}`}>
                {cumulative.us.tech >= 0 ? '+' : ''}{cumulative.us.tech.toFixed(1)}
              </span>
            </div>
          </div>
        </div>

        <div className="summary-card china-card">
          <h3>🇨🇳 China</h3>
          <div className="summary-stats">
            <div className="stat-item">
              <span className="stat-label">Cumulative GDP Impact</span>
              <span className={`stat-value ${cumulative.gdpImpact.china >= 0 ? 'positive' : 'negative'}`}>
                {cumulative.gdpImpact.china >= 0 ? '+' : ''}{cumulative.gdpImpact.china.toFixed(2)}%
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Economic Score</span>
              <span className={`stat-value ${cumulative.china.economic >= 0 ? 'positive' : 'negative'}`}>
                {cumulative.china.economic >= 0 ? '+' : ''}{cumulative.china.economic.toFixed(1)}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Tech Dominance</span>
              <span className={`stat-value ${cumulative.china.tech >= 0 ? 'positive' : 'negative'}`}>
                {cumulative.china.tech >= 0 ? '+' : ''}{cumulative.china.tech.toFixed(1)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        <div className="chart-card full-width">
          <Line data={gdpTimelineData} options={gdpOptions} />
        </div>

        <div className="chart-card">
          <Bar data={sectorData} options={sectorOptions} />
        </div>

        <div className="chart-card">
          <h4>US Impact Distribution</h4>
          <Doughnut data={usComponentData} options={doughnutOptions} />
        </div>

        <div className="chart-card">
          <h4>China Impact Distribution</h4>
          <Doughnut data={chinaComponentData} options={doughnutOptions} />
        </div>
      </div>

      {/* Sector Details */}
      <div className="sector-details">
        <h3>Detailed Sector Analysis</h3>
        <div className="sector-grid">
          <div className="sector-card">
            <div className="sector-icon">💻</div>
            <h4>Technology</h4>
            <div className="sector-impact">
              <span>Impact Score:</span>
              <span className={cumulative.sectors.tech >= 0 ? 'positive' : 'negative'}>
                {cumulative.sectors.tech >= 0 ? '+' : ''}{cumulative.sectors.tech.toFixed(1)}
              </span>
            </div>
            <p className="sector-description">
              Semiconductor restrictions, AI chip bans, and tech export controls have significantly impacted both nations' tech industries.
            </p>
          </div>

          <div className="sector-card">
            <div className="sector-icon">🌾</div>
            <h4>Agriculture</h4>
            <div className="sector-impact">
              <span>Impact Score:</span>
              <span className={cumulative.sectors.agriculture >= 0 ? 'positive' : 'negative'}>
                {cumulative.sectors.agriculture >= 0 ? '+' : ''}{cumulative.sectors.agriculture.toFixed(1)}
              </span>
            </div>
            <p className="sector-description">
              US farmers facing reduced exports to China, while China seeks alternative suppliers for soybeans and pork.
            </p>
          </div>

          <div className="sector-card">
            <div className="sector-icon">🏭</div>
            <h4>Manufacturing</h4>
            <div className="sector-impact">
              <span>Impact Score:</span>
              <span className={cumulative.sectors.manufacturing >= 0 ? 'positive' : 'negative'}>
                {cumulative.sectors.manufacturing >= 0 ? '+' : ''}{cumulative.sectors.manufacturing.toFixed(1)}
              </span>
            </div>
            <p className="sector-description">
              Supply chain disruptions and tariffs increase costs for manufacturers in both countries.
            </p>
          </div>

          <div className="sector-card">
            <div className="sector-icon">💼</div>
            <h4>Services</h4>
            <div className="sector-impact">
              <span>Impact Score:</span>
              <span className={cumulative.sectors.services >= 0 ? 'positive' : 'negative'}>
                {cumulative.sectors.services >= 0 ? '+' : ''}{cumulative.sectors.services.toFixed(1)}
              </span>
            </div>
            <p className="sector-description">
              Tourism, education, and financial services affected by increased tensions and travel restrictions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EconomicImpact;
