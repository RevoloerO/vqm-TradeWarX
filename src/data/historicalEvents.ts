export interface HistoricalEvent {
  id: string;
  date: string;
  timestamp: number;
  title: string;
  description: string;
  category: 'tariff' | 'tech' | 'negotiation' | 'sanction' | 'other';
  usAction?: string;
  chinaAction?: string;
  impact: {
    us: {
      economic: number;
      political: number;
      tech: number;
      supplyChain: number;
    };
    china: {
      economic: number;
      political: number;
      tech: number;
      supplyChain: number;
    };
  };
  gdpImpact: {
    us: number;
    china: number;
  };
  sectors: {
    tech: number;
    agriculture: number;
    manufacturing: number;
    services: number;
  };
}

export const historicalEvents: HistoricalEvent[] = [
  {
    id: 'event-1',
    date: 'March 2018',
    timestamp: new Date('2018-03-01').getTime(),
    title: 'First Tariffs Announced',
    description: 'Trump administration announces tariffs on steel (25%) and aluminum (10%) imports, citing national security concerns.',
    category: 'tariff',
    usAction: 'Impose tariffs',
    chinaAction: 'Threaten retaliation',
    impact: {
      us: { economic: -2, political: 5, tech: 0, supplyChain: -3 },
      china: { economic: -3, political: -2, tech: 0, supplyChain: -2 }
    },
    gdpImpact: { us: -0.1, china: -0.15 },
    sectors: { tech: -1, agriculture: 0, manufacturing: -3, services: 0 }
  },
  {
    id: 'event-2',
    date: 'April 2018',
    timestamp: new Date('2018-04-02').getTime(),
    title: 'China Retaliates',
    description: 'China imposes retaliatory tariffs on $3 billion worth of US goods, including pork, fruit, and steel pipes.',
    category: 'tariff',
    usAction: 'Status quo',
    chinaAction: 'Impose counter-tariffs',
    impact: {
      us: { economic: -3, political: -1, tech: 0, supplyChain: -4 },
      china: { economic: -2, political: 4, tech: 0, supplyChain: -3 }
    },
    gdpImpact: { us: -0.2, china: -0.2 },
    sectors: { tech: 0, agriculture: -5, manufacturing: -2, services: -1 }
  },
  {
    id: 'event-3',
    date: 'July 2018',
    timestamp: new Date('2018-07-06').getTime(),
    title: 'Trade War Escalates',
    description: 'US imposes 25% tariffs on $34 billion of Chinese goods. China immediately retaliates with matching tariffs.',
    category: 'tariff',
    usAction: 'Escalate tariffs',
    chinaAction: 'Escalate counter-tariffs',
    impact: {
      us: { economic: -5, political: 3, tech: -2, supplyChain: -6 },
      china: { economic: -6, political: 2, tech: -1, supplyChain: -5 }
    },
    gdpImpact: { us: -0.4, china: -0.5 },
    sectors: { tech: -2, agriculture: -6, manufacturing: -5, services: -2 }
  },
  {
    id: 'event-4',
    date: 'May 2019',
    timestamp: new Date('2019-05-05').getTime(),
    title: 'Huawei Ban',
    description: 'US adds Huawei to Entity List, effectively banning American companies from selling technology to the Chinese firm.',
    category: 'tech',
    usAction: 'Tech restrictions',
    chinaAction: 'Threaten rare earth restrictions',
    impact: {
      us: { economic: -3, political: 6, tech: 5, supplyChain: -4 },
      china: { economic: -7, political: -3, tech: -6, supplyChain: 2 }
    },
    gdpImpact: { us: -0.3, china: -0.7 },
    sectors: { tech: -8, agriculture: -4, manufacturing: -3, services: -2 }
  },
  {
    id: 'event-5',
    date: 'January 2020',
    timestamp: new Date('2020-01-15').getTime(),
    title: 'Phase One Deal',
    description: 'US and China sign Phase One trade deal. China agrees to purchase $200 billion more in US goods over two years.',
    category: 'negotiation',
    usAction: 'De-escalate',
    chinaAction: 'De-escalate',
    impact: {
      us: { economic: 4, political: 7, tech: 0, supplyChain: 3 },
      china: { economic: 3, political: 5, tech: 0, supplyChain: 2 }
    },
    gdpImpact: { us: 0.3, china: 0.25 },
    sectors: { tech: 1, agriculture: 6, manufacturing: 3, services: 2 }
  },
  {
    id: 'event-6',
    date: 'August 2020',
    timestamp: new Date('2020-08-06').getTime(),
    title: 'TikTok Executive Order',
    description: 'Trump signs executive orders to ban TikTok and WeChat, citing national security concerns.',
    category: 'tech',
    usAction: 'Tech ban',
    chinaAction: 'Export restrictions',
    impact: {
      us: { economic: -2, political: 5, tech: 3, supplyChain: -1 },
      china: { economic: -4, political: -2, tech: -5, supplyChain: 1 }
    },
    gdpImpact: { us: -0.15, china: -0.35 },
    sectors: { tech: -6, agriculture: 0, manufacturing: -1, services: -3 }
  },
  {
    id: 'event-7',
    date: 'October 2022',
    timestamp: new Date('2022-10-07').getTime(),
    title: 'Semiconductor Export Controls',
    description: 'Biden administration implements sweeping restrictions on semiconductor exports to China, targeting AI chips and manufacturing equipment.',
    category: 'tech',
    usAction: 'Export controls',
    chinaAction: 'Accelerate self-sufficiency',
    impact: {
      us: { economic: -2, political: 6, tech: 7, supplyChain: -3 },
      china: { economic: -8, political: -4, tech: -8, supplyChain: -6 }
    },
    gdpImpact: { us: -0.25, china: -0.9 },
    sectors: { tech: -10, agriculture: 0, manufacturing: -2, services: -1 }
  },
  {
    id: 'event-8',
    date: 'February 2023',
    timestamp: new Date('2023-02-03').getTime(),
    title: 'Balloon Incident',
    description: 'US shoots down Chinese surveillance balloon, causing diplomatic tensions and cancelled high-level meetings.',
    category: 'other',
    usAction: 'Military action',
    chinaAction: 'Diplomatic protest',
    impact: {
      us: { economic: -1, political: 8, tech: 0, supplyChain: -1 },
      china: { economic: -1, political: -5, tech: 0, supplyChain: 0 }
    },
    gdpImpact: { us: -0.05, china: -0.1 },
    sectors: { tech: -1, agriculture: -1, manufacturing: -1, services: -2 }
  },
  {
    id: 'event-9',
    date: 'August 2023',
    timestamp: new Date('2023-08-09').getTime(),
    title: 'Biden Executive Order on Outbound Investment',
    description: 'Biden signs executive order restricting US investment in Chinese tech sectors including semiconductors, AI, and quantum computing.',
    category: 'tech',
    usAction: 'Investment restrictions',
    chinaAction: 'Restrict critical minerals',
    impact: {
      us: { economic: -3, political: 5, tech: 6, supplyChain: -5 },
      china: { economic: -6, political: -3, tech: -7, supplyChain: 3 }
    },
    gdpImpact: { us: -0.3, china: -0.65 },
    sectors: { tech: -9, agriculture: -1, manufacturing: -3, services: -2 }
  },
  {
    id: 'event-10',
    date: 'January 2025',
    timestamp: new Date('2025-01-20').getTime(),
    title: 'Trump 2.0 Tariff Threats',
    description: 'Trump returns to office and immediately threatens 60% tariffs on all Chinese imports, citing trade deficits and fentanyl crisis.',
    category: 'tariff',
    usAction: 'Threaten massive tariffs',
    chinaAction: 'Prepare countermeasures',
    impact: {
      us: { economic: -7, political: 7, tech: -2, supplyChain: -8 },
      china: { economic: -8, political: -4, tech: -3, supplyChain: -7 }
    },
    gdpImpact: { us: -0.8, china: -1.2 },
    sectors: { tech: -5, agriculture: -7, manufacturing: -8, services: -4 }
  }
];

export const getEventsBeforeDate = (timestamp: number): HistoricalEvent[] => {
  return historicalEvents.filter(event => event.timestamp <= timestamp);
};

export const getEventByDate = (timestamp: number): HistoricalEvent | undefined => {
  return historicalEvents.find(event =>
    Math.abs(event.timestamp - timestamp) < 86400000 * 15 // Within 15 days
  );
};

export const calculateCumulativeImpact = (timestamp: number) => {
  const events = getEventsBeforeDate(timestamp);

  const cumulative = {
    us: { economic: 0, political: 0, tech: 0, supplyChain: 0 },
    china: { economic: 0, political: 0, tech: 0, supplyChain: 0 },
    gdpImpact: { us: 0, china: 0 },
    sectors: { tech: 0, agriculture: 0, manufacturing: 0, services: 0 }
  };

  events.forEach(event => {
    cumulative.us.economic += event.impact.us.economic;
    cumulative.us.political += event.impact.us.political;
    cumulative.us.tech += event.impact.us.tech;
    cumulative.us.supplyChain += event.impact.us.supplyChain;

    cumulative.china.economic += event.impact.china.economic;
    cumulative.china.political += event.impact.china.political;
    cumulative.china.tech += event.impact.china.tech;
    cumulative.china.supplyChain += event.impact.china.supplyChain;

    cumulative.gdpImpact.us += event.gdpImpact.us;
    cumulative.gdpImpact.china += event.gdpImpact.china;

    cumulative.sectors.tech += event.sectors.tech;
    cumulative.sectors.agriculture += event.sectors.agriculture;
    cumulative.sectors.manufacturing += event.sectors.manufacturing;
    cumulative.sectors.services += event.sectors.services;
  });

  return cumulative;
};
