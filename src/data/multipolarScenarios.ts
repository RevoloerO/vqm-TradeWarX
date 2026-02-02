// Multi-dimensional payoff structure for three-player game
export interface MultiDimensionalPayoff {
  economic: number;      // Trade, investment, GDP impact (-10 to +10)
  security: number;      // Military alliances, stability (-10 to +10)
  technology: number;    // Tech leadership, innovation (-10 to +10)
  resources: number;     // Energy, minerals, food security (-10 to +10)
  diplomatic: number;    // Global influence, soft power (-10 to +10)
}

export interface ThreePlayerPayoff {
  usa: MultiDimensionalPayoff;
  brics: MultiDimensionalPayoff;
  eu: MultiDimensionalPayoff;
}

export interface CoalitionStability {
  bricsUnity: number;    // 0-100, measures internal cohesion
  euAlignment: number;   // -100 (China) to +100 (USA)
  fragmentation: {
    india: number;       // Tendency to defect from BRICS (0-100)
    brazil: number;
    russia: number;
    southAfrica: number;
  };
}

export interface StrategyOption {
  key: string;
  label: string;
  description: string;
}

export interface ThreePlayerScenario {
  id: string;
  title: string;
  description: string;
  context: string;
  initialStability: CoalitionStability;
  strategies: {
    usa: StrategyOption[];
    brics: StrategyOption[];
    eu: StrategyOption[];
  };
  payoffMatrix: {
    [usaStrategy: string]: {
      [bricsStrategy: string]: {
        [euStrategy: string]: ThreePlayerPayoff;
      };
    };
  };
}

// Real-world scenarios
export const multipolarScenarios: ThreePlayerScenario[] = [
  {
    id: 'semiconductor-alliance',
    title: 'Semiconductor Alliance',
    description: 'US attempts to build a semiconductor alliance with EU and allies to contain China\'s chip ambitions.',
    context: 'The global semiconductor supply chain has become the primary battleground. USA controls chip design, BRICS (via China) dominates manufacturing and rare earths, EU holds lithography equipment monopoly (ASML).',
    initialStability: {
      bricsUnity: 65,
      euAlignment: 30,
      fragmentation: {
        india: 45,    // India interested in alternatives to China
        brazil: 25,   // Brazil relatively neutral
        russia: 20,   // Russia closely aligned with China
        southAfrica: 30
      }
    },
    strategies: {
      usa: [
        { key: 'chip4', label: 'Build Chip 4 Alliance', description: 'Form exclusive alliance with Taiwan, Korea, Japan, excluding China completely' },
        { key: 'selective', label: 'Selective Controls', description: 'Target only advanced chips, allow mature node exports' },
        { key: 'negotiate', label: 'Negotiate Access', description: 'Trade chip access for concessions on other issues' },
        { key: 'full-ban', label: 'Full Technology Ban', description: 'Complete embargo on all semiconductor technology to China' }
      ],
      brics: [
        { key: 'self-reliance', label: 'Accelerate Self-Reliance', description: 'Massive investment in domestic chip manufacturing' },
        { key: 'rare-earth', label: 'Leverage Rare Earths', description: 'Restrict critical minerals essential for chip production' },
        { key: 'huawei-push', label: 'Champion Huawei', description: 'Promote Huawei\'s 7nm breakthrough as alternative to Western tech' },
        { key: 'compromise', label: 'Seek Compromise', description: 'Accept restrictions on advanced chips, maintain access to mature nodes' }
      ],
      eu: [
        { key: 'usa-align', label: 'Align with USA', description: 'Join Chip 4, restrict ASML exports to China' },
        { key: 'strategic-autonomy', label: 'Strategic Autonomy', description: 'Build independent European chip capacity' },
        { key: 'neutral-trade', label: 'Neutral Trader', description: 'Maintain commercial relations with both sides' },
        { key: 'china-hedge', label: 'Hedge with China', description: 'Preserve Chinese market access for European firms' }
      ]
    },
    payoffMatrix: {
      'chip4': {
        'self-reliance': {
          'usa-align': {
            usa: { economic: 6, security: 8, technology: 9, resources: -2, diplomatic: 7 },
            brics: { economic: -7, security: -3, technology: -5, resources: 6, diplomatic: -4 },
            eu: { economic: 4, security: 6, technology: 5, resources: -3, diplomatic: 3 }
          },
          'strategic-autonomy': {
            usa: { economic: 5, security: 6, technology: 7, resources: -2, diplomatic: 5 },
            brics: { economic: -6, security: -3, technology: -4, resources: 5, diplomatic: -3 },
            eu: { economic: 2, security: 4, technology: 7, resources: -2, diplomatic: 6 }
          },
          'neutral-trade': {
            usa: { economic: 3, security: 5, technology: 6, resources: -3, diplomatic: 2 },
            brics: { economic: -4, security: -2, technology: -3, resources: 4, diplomatic: 0 },
            eu: { economic: 5, security: 2, technology: 4, resources: 0, diplomatic: 4 }
          },
          'china-hedge': {
            usa: { economic: 2, security: 3, technology: 5, resources: -4, diplomatic: 0 },
            brics: { economic: -2, security: -1, technology: -2, resources: 3, diplomatic: 2 },
            eu: { economic: 6, security: 0, technology: 3, resources: 1, diplomatic: 2 }
          }
        },
        'rare-earth': {
          'usa-align': {
            usa: { economic: 3, security: 6, technology: 7, resources: -6, diplomatic: 5 },
            brics: { economic: -4, security: 0, technology: -3, resources: 8, diplomatic: 0 },
            eu: { economic: 1, security: 4, technology: 3, resources: -7, diplomatic: 1 }
          },
          'strategic-autonomy': {
            usa: { economic: 2, security: 5, technology: 6, resources: -5, diplomatic: 4 },
            brics: { economic: -3, security: 0, technology: -2, resources: 7, diplomatic: 1 },
            eu: { economic: 0, security: 3, technology: 5, resources: -6, diplomatic: 5 }
          },
          'neutral-trade': {
            usa: { economic: 1, security: 4, technology: 5, resources: -4, diplomatic: 2 },
            brics: { economic: 0, security: 1, technology: 0, resources: 6, diplomatic: 3 },
            eu: { economic: 4, security: 2, technology: 3, resources: -3, diplomatic: 4 }
          },
          'china-hedge': {
            usa: { economic: 0, security: 2, technology: 4, resources: -5, diplomatic: -1 },
            brics: { economic: 2, security: 2, technology: 1, resources: 5, diplomatic: 4 },
            eu: { economic: 5, security: 1, technology: 2, resources: -2, diplomatic: 3 }
          }
        },
        'huawei-push': {
          'usa-align': {
            usa: { economic: 4, security: 7, technology: 5, resources: -3, diplomatic: 6 },
            brics: { economic: -3, security: -2, technology: 3, resources: 4, diplomatic: 0 },
            eu: { economic: 2, security: 5, technology: 2, resources: -4, diplomatic: 2 }
          },
          'strategic-autonomy': {
            usa: { economic: 3, security: 5, technology: 4, resources: -3, diplomatic: 4 },
            brics: { economic: -2, security: -1, technology: 4, resources: 3, diplomatic: 1 },
            eu: { economic: 1, security: 3, technology: 6, resources: -3, diplomatic: 5 }
          },
          'neutral-trade': {
            usa: { economic: 2, security: 4, technology: 3, resources: -2, diplomatic: 2 },
            brics: { economic: 0, security: 0, technology: 5, resources: 2, diplomatic: 3 },
            eu: { economic: 4, security: 2, technology: 4, resources: -1, diplomatic: 4 }
          },
          'china-hedge': {
            usa: { economic: 1, security: 2, technology: 2, resources: -3, diplomatic: 0 },
            brics: { economic: 2, security: 1, technology: 6, resources: 1, diplomatic: 4 },
            eu: { economic: 5, security: 0, technology: 3, resources: 0, diplomatic: 3 }
          }
        },
        'compromise': {
          'usa-align': {
            usa: { economic: 5, security: 6, technology: 6, resources: 0, diplomatic: 5 },
            brics: { economic: 0, security: 0, technology: -1, resources: 2, diplomatic: 1 },
            eu: { economic: 4, security: 4, technology: 4, resources: -1, diplomatic: 4 }
          },
          'strategic-autonomy': {
            usa: { economic: 4, security: 5, technology: 5, resources: 0, diplomatic: 4 },
            brics: { economic: 1, security: 1, technology: 0, resources: 1, diplomatic: 2 },
            eu: { economic: 3, security: 3, technology: 6, resources: 0, diplomatic: 6 }
          },
          'neutral-trade': {
            usa: { economic: 3, security: 4, technology: 4, resources: 1, diplomatic: 3 },
            brics: { economic: 2, security: 2, technology: 1, resources: 0, diplomatic: 3 },
            eu: { economic: 5, security: 2, technology: 5, resources: 1, diplomatic: 5 }
          },
          'china-hedge': {
            usa: { economic: 2, security: 3, technology: 3, resources: 0, diplomatic: 2 },
            brics: { economic: 3, security: 2, technology: 2, resources: -1, diplomatic: 4 },
            eu: { economic: 6, security: 1, technology: 4, resources: 2, diplomatic: 4 }
          }
        }
      },
      'selective': {
        'self-reliance': {
          'usa-align': {
            usa: { economic: 4, security: 5, technology: 6, resources: 0, diplomatic: 4 },
            brics: { economic: -3, security: -1, technology: -2, resources: 3, diplomatic: -2 },
            eu: { economic: 5, security: 4, technology: 4, resources: 0, diplomatic: 3 }
          },
          'strategic-autonomy': {
            usa: { economic: 3, security: 4, technology: 5, resources: 0, diplomatic: 3 },
            brics: { economic: -2, security: -1, technology: -1, resources: 2, diplomatic: -1 },
            eu: { economic: 4, security: 3, technology: 6, resources: 0, diplomatic: 5 }
          },
          'neutral-trade': {
            usa: { economic: 2, security: 3, technology: 4, resources: 1, diplomatic: 2 },
            brics: { economic: 0, security: 0, technology: 0, resources: 1, diplomatic: 1 },
            eu: { economic: 6, security: 2, technology: 5, resources: 1, diplomatic: 4 }
          },
          'china-hedge': {
            usa: { economic: 1, security: 2, technology: 3, resources: 0, diplomatic: 1 },
            brics: { economic: 1, security: 0, technology: 1, resources: 0, diplomatic: 2 },
            eu: { economic: 7, security: 1, technology: 4, resources: 2, diplomatic: 3 }
          }
        },
        'rare-earth': {
          'usa-align': {
            usa: { economic: 2, security: 4, technology: 5, resources: -4, diplomatic: 3 },
            brics: { economic: -1, security: 1, technology: -1, resources: 5, diplomatic: 0 },
            eu: { economic: 3, security: 3, technology: 3, resources: -5, diplomatic: 2 }
          },
          'strategic-autonomy': {
            usa: { economic: 1, security: 3, technology: 4, resources: -3, diplomatic: 2 },
            brics: { economic: 0, security: 1, technology: 0, resources: 4, diplomatic: 1 },
            eu: { economic: 2, security: 2, technology: 5, resources: -4, diplomatic: 4 }
          },
          'neutral-trade': {
            usa: { economic: 0, security: 2, technology: 3, resources: -2, diplomatic: 1 },
            brics: { economic: 1, security: 2, technology: 1, resources: 3, diplomatic: 2 },
            eu: { economic: 5, security: 1, technology: 4, resources: -2, diplomatic: 3 }
          },
          'china-hedge': {
            usa: { economic: -1, security: 1, technology: 2, resources: -3, diplomatic: 0 },
            brics: { economic: 2, security: 2, technology: 2, resources: 2, diplomatic: 3 },
            eu: { economic: 6, security: 0, technology: 3, resources: -1, diplomatic: 2 }
          }
        },
        'huawei-push': {
          'usa-align': {
            usa: { economic: 3, security: 5, technology: 4, resources: 0, diplomatic: 4 },
            brics: { economic: -1, security: 0, technology: 2, resources: 2, diplomatic: 0 },
            eu: { economic: 4, security: 4, technology: 3, resources: 0, diplomatic: 3 }
          },
          'strategic-autonomy': {
            usa: { economic: 2, security: 4, technology: 3, resources: 0, diplomatic: 3 },
            brics: { economic: 0, security: 0, technology: 3, resources: 1, diplomatic: 1 },
            eu: { economic: 3, security: 3, technology: 5, resources: 0, diplomatic: 4 }
          },
          'neutral-trade': {
            usa: { economic: 1, security: 3, technology: 2, resources: 1, diplomatic: 2 },
            brics: { economic: 1, security: 1, technology: 4, resources: 0, diplomatic: 2 },
            eu: { economic: 5, security: 2, technology: 4, resources: 1, diplomatic: 3 }
          },
          'china-hedge': {
            usa: { economic: 0, security: 2, technology: 1, resources: 0, diplomatic: 1 },
            brics: { economic: 2, security: 1, technology: 5, resources: -1, diplomatic: 3 },
            eu: { economic: 6, security: 1, technology: 3, resources: 1, diplomatic: 2 }
          }
        },
        'compromise': {
          'usa-align': {
            usa: { economic: 5, security: 5, technology: 5, resources: 2, diplomatic: 5 },
            brics: { economic: 2, security: 1, technology: 1, resources: 1, diplomatic: 2 },
            eu: { economic: 5, security: 4, technology: 4, resources: 1, diplomatic: 4 }
          },
          'strategic-autonomy': {
            usa: { economic: 4, security: 4, technology: 4, resources: 2, diplomatic: 4 },
            brics: { economic: 3, security: 2, technology: 2, resources: 0, diplomatic: 3 },
            eu: { economic: 4, security: 3, technology: 6, resources: 1, diplomatic: 6 }
          },
          'neutral-trade': {
            usa: { economic: 3, security: 3, technology: 3, resources: 3, diplomatic: 3 },
            brics: { economic: 4, security: 3, technology: 3, resources: -1, diplomatic: 4 },
            eu: { economic: 6, security: 2, technology: 5, resources: 2, diplomatic: 5 }
          },
          'china-hedge': {
            usa: { economic: 2, security: 2, technology: 2, resources: 2, diplomatic: 2 },
            brics: { economic: 5, security: 3, technology: 4, resources: -2, diplomatic: 5 },
            eu: { economic: 7, security: 1, technology: 4, resources: 3, diplomatic: 4 }
          }
        }
      },
      'negotiate': {
        'self-reliance': {
          'usa-align': {
            usa: { economic: 3, security: 4, technology: 4, resources: 1, diplomatic: 5 },
            brics: { economic: -2, security: 0, technology: -1, resources: 2, diplomatic: 0 },
            eu: { economic: 5, security: 3, technology: 3, resources: 1, diplomatic: 4 }
          },
          'strategic-autonomy': {
            usa: { economic: 2, security: 3, technology: 3, resources: 1, diplomatic: 4 },
            brics: { economic: -1, security: 0, technology: 0, resources: 1, diplomatic: 1 },
            eu: { economic: 4, security: 2, technology: 5, resources: 1, diplomatic: 5 }
          },
          'neutral-trade': {
            usa: { economic: 1, security: 2, technology: 2, resources: 2, diplomatic: 3 },
            brics: { economic: 1, security: 1, technology: 1, resources: 0, diplomatic: 2 },
            eu: { economic: 6, security: 1, technology: 4, resources: 2, diplomatic: 4 }
          },
          'china-hedge': {
            usa: { economic: 0, security: 1, technology: 1, resources: 1, diplomatic: 2 },
            brics: { economic: 2, security: 1, technology: 2, resources: -1, diplomatic: 3 },
            eu: { economic: 7, security: 0, technology: 3, resources: 3, diplomatic: 3 }
          }
        },
        'rare-earth': {
          'usa-align': {
            usa: { economic: 1, security: 3, technology: 3, resources: -3, diplomatic: 4 },
            brics: { economic: 0, security: 2, technology: 0, resources: 4, diplomatic: 1 },
            eu: { economic: 3, security: 2, technology: 2, resources: -4, diplomatic: 3 }
          },
          'strategic-autonomy': {
            usa: { economic: 0, security: 2, technology: 2, resources: -2, diplomatic: 3 },
            brics: { economic: 1, security: 2, technology: 1, resources: 3, diplomatic: 2 },
            eu: { economic: 2, security: 1, technology: 4, resources: -3, diplomatic: 4 }
          },
          'neutral-trade': {
            usa: { economic: -1, security: 1, technology: 1, resources: -1, diplomatic: 2 },
            brics: { economic: 2, security: 3, technology: 2, resources: 2, diplomatic: 3 },
            eu: { economic: 4, security: 0, technology: 3, resources: -1, diplomatic: 3 }
          },
          'china-hedge': {
            usa: { economic: -2, security: 0, technology: 0, resources: -2, diplomatic: 1 },
            brics: { economic: 3, security: 3, technology: 3, resources: 1, diplomatic: 4 },
            eu: { economic: 5, security: -1, technology: 2, resources: 0, diplomatic: 2 }
          }
        },
        'huawei-push': {
          'usa-align': {
            usa: { economic: 2, security: 4, technology: 3, resources: 1, diplomatic: 5 },
            brics: { economic: 0, security: 1, technology: 3, resources: 1, diplomatic: 1 },
            eu: { economic: 4, security: 3, technology: 2, resources: 1, diplomatic: 4 }
          },
          'strategic-autonomy': {
            usa: { economic: 1, security: 3, technology: 2, resources: 1, diplomatic: 4 },
            brics: { economic: 1, security: 1, technology: 4, resources: 0, diplomatic: 2 },
            eu: { economic: 3, security: 2, technology: 4, resources: 1, diplomatic: 5 }
          },
          'neutral-trade': {
            usa: { economic: 0, security: 2, technology: 1, resources: 2, diplomatic: 3 },
            brics: { economic: 2, security: 2, technology: 5, resources: -1, diplomatic: 3 },
            eu: { economic: 5, security: 1, technology: 3, resources: 2, diplomatic: 4 }
          },
          'china-hedge': {
            usa: { economic: -1, security: 1, technology: 0, resources: 1, diplomatic: 2 },
            brics: { economic: 3, security: 2, technology: 6, resources: -2, diplomatic: 4 },
            eu: { economic: 6, security: 0, technology: 2, resources: 2, diplomatic: 3 }
          }
        },
        'compromise': {
          'usa-align': {
            usa: { economic: 5, security: 5, technology: 5, resources: 3, diplomatic: 6 },
            brics: { economic: 4, security: 3, technology: 3, resources: 0, diplomatic: 4 },
            eu: { economic: 6, security: 4, technology: 4, resources: 2, diplomatic: 5 }
          },
          'strategic-autonomy': {
            usa: { economic: 4, security: 4, technology: 4, resources: 3, diplomatic: 5 },
            brics: { economic: 5, security: 4, technology: 4, resources: -1, diplomatic: 5 },
            eu: { economic: 5, security: 3, technology: 6, resources: 2, diplomatic: 7 }
          },
          'neutral-trade': {
            usa: { economic: 3, security: 3, technology: 3, resources: 4, diplomatic: 4 },
            brics: { economic: 6, security: 5, technology: 5, resources: -2, diplomatic: 6 },
            eu: { economic: 7, security: 2, technology: 5, resources: 3, diplomatic: 6 }
          },
          'china-hedge': {
            usa: { economic: 2, security: 2, technology: 2, resources: 3, diplomatic: 3 },
            brics: { economic: 7, security: 5, technology: 6, resources: -3, diplomatic: 7 },
            eu: { economic: 8, security: 1, technology: 4, resources: 4, diplomatic: 5 }
          }
        }
      },
      'full-ban': {
        'self-reliance': {
          'usa-align': {
            usa: { economic: 5, security: 9, technology: 8, resources: -4, diplomatic: 6 },
            brics: { economic: -8, security: -5, technology: -7, resources: 7, diplomatic: -6 },
            eu: { economic: 2, security: 7, technology: 4, resources: -5, diplomatic: 2 }
          },
          'strategic-autonomy': {
            usa: { economic: 4, security: 7, technology: 7, resources: -4, diplomatic: 4 },
            brics: { economic: -7, security: -4, technology: -6, resources: 6, diplomatic: -5 },
            eu: { economic: 0, security: 5, technology: 6, resources: -4, diplomatic: 4 }
          },
          'neutral-trade': {
            usa: { economic: 2, security: 6, technology: 6, resources: -5, diplomatic: 1 },
            brics: { economic: -5, security: -3, technology: -5, resources: 5, diplomatic: -2 },
            eu: { economic: 3, security: 3, technology: 4, resources: -2, diplomatic: 3 }
          },
          'china-hedge': {
            usa: { economic: 1, security: 4, technology: 5, resources: -6, diplomatic: -1 },
            brics: { economic: -3, security: -2, technology: -4, resources: 4, diplomatic: 0 },
            eu: { economic: 4, security: 1, technology: 3, resources: -1, diplomatic: 1 }
          }
        },
        'rare-earth': {
          'usa-align': {
            usa: { economic: 1, security: 7, technology: 6, resources: -8, diplomatic: 4 },
            brics: { economic: -5, security: -2, technology: -5, resources: 9, diplomatic: -2 },
            eu: { economic: -1, security: 5, technology: 2, resources: -9, diplomatic: 0 }
          },
          'strategic-autonomy': {
            usa: { economic: 0, security: 6, technology: 5, resources: -7, diplomatic: 3 },
            brics: { economic: -4, security: -1, technology: -4, resources: 8, diplomatic: -1 },
            eu: { economic: -2, security: 4, technology: 4, resources: -8, diplomatic: 3 }
          },
          'neutral-trade': {
            usa: { economic: -1, security: 5, technology: 4, resources: -6, diplomatic: 1 },
            brics: { economic: -2, security: 0, technology: -2, resources: 7, diplomatic: 1 },
            eu: { economic: 2, security: 2, technology: 3, resources: -4, diplomatic: 2 }
          },
          'china-hedge': {
            usa: { economic: -2, security: 3, technology: 3, resources: -7, diplomatic: -2 },
            brics: { economic: 0, security: 1, technology: -1, resources: 6, diplomatic: 2 },
            eu: { economic: 3, security: 0, technology: 2, resources: -3, diplomatic: 1 }
          }
        },
        'huawei-push': {
          'usa-align': {
            usa: { economic: 3, security: 8, technology: 5, resources: -5, diplomatic: 5 },
            brics: { economic: -4, security: -3, technology: 0, resources: 5, diplomatic: -3 },
            eu: { economic: 0, security: 6, technology: 1, resources: -6, diplomatic: 1 }
          },
          'strategic-autonomy': {
            usa: { economic: 2, security: 6, technology: 4, resources: -5, diplomatic: 3 },
            brics: { economic: -3, security: -2, technology: 1, resources: 4, diplomatic: -2 },
            eu: { economic: -1, security: 4, technology: 4, resources: -5, diplomatic: 3 }
          },
          'neutral-trade': {
            usa: { economic: 1, security: 5, technology: 3, resources: -4, diplomatic: 1 },
            brics: { economic: -1, security: -1, technology: 2, resources: 3, diplomatic: 0 },
            eu: { economic: 2, security: 2, technology: 3, resources: -3, diplomatic: 2 }
          },
          'china-hedge': {
            usa: { economic: 0, security: 3, technology: 2, resources: -5, diplomatic: -1 },
            brics: { economic: 1, security: 0, technology: 3, resources: 2, diplomatic: 1 },
            eu: { economic: 3, security: 0, technology: 2, resources: -2, diplomatic: 1 }
          }
        },
        'compromise': {
          'usa-align': {
            usa: { economic: 4, security: 7, technology: 6, resources: -2, diplomatic: 5 },
            brics: { economic: -2, security: -1, technology: -2, resources: 3, diplomatic: 0 },
            eu: { economic: 2, security: 5, technology: 3, resources: -3, diplomatic: 3 }
          },
          'strategic-autonomy': {
            usa: { economic: 3, security: 6, technology: 5, resources: -2, diplomatic: 4 },
            brics: { economic: -1, security: 0, technology: -1, resources: 2, diplomatic: 1 },
            eu: { economic: 1, security: 4, technology: 5, resources: -2, diplomatic: 4 }
          },
          'neutral-trade': {
            usa: { economic: 2, security: 5, technology: 4, resources: -1, diplomatic: 3 },
            brics: { economic: 1, security: 1, technology: 0, resources: 1, diplomatic: 2 },
            eu: { economic: 4, security: 2, technology: 4, resources: 0, diplomatic: 3 }
          },
          'china-hedge': {
            usa: { economic: 1, security: 3, technology: 3, resources: -2, diplomatic: 1 },
            brics: { economic: 2, security: 2, technology: 1, resources: 0, diplomatic: 3 },
            eu: { economic: 5, security: 1, technology: 3, resources: 1, diplomatic: 2 }
          }
        }
      }
    }
  },
  {
    id: 'brics-payment-system',
    title: 'BRICS Payment System',
    description: 'BRICS launches alternative to SWIFT, challenging dollar hegemony and US financial sanctions power.',
    context: 'De-dollarization becomes central as BRICS develops payment systems bypassing SWIFT. USA controls global reserve currency, BRICS holds 45% of global population as potential users, EU faces choice between systems.',
    initialStability: {
      bricsUnity: 75,
      euAlignment: 10,
      fragmentation: {
        india: 35,
        brazil: 30,
        russia: 15,    // Russia strongly motivated due to sanctions
        southAfrica: 40
      }
    },
    strategies: {
      usa: [
        { key: 'defend-dollar', label: 'Defend Dollar Hegemony', description: 'Aggressive sanctions on BRICS payment users' },
        { key: 'reform-swift', label: 'Reform SWIFT', description: 'Make SWIFT more inclusive to retain users' },
        { key: 'digital-dollar', label: 'Accelerate Digital Dollar', description: 'Launch CBDC to compete with BRICS system' },
        { key: 'status-quo', label: 'Status Quo', description: 'Rely on dollar\'s network effects and inertia' }
      ],
      brics: [
        { key: 'full-launch', label: 'Full System Launch', description: 'Deploy complete alternative to SWIFT' },
        { key: 'gradual-rollout', label: 'Gradual Rollout', description: 'Start with bilateral trade settlements' },
        { key: 'commodity-backed', label: 'Gold/Commodity Backed', description: 'Link BRICS currency to physical commodities' },
        { key: 'abandon', label: 'Abandon Project', description: 'Accept dollar system dominance' }
      ],
      eu: [
        { key: 'dual-system', label: 'Use Both Systems', description: 'Maintain SWIFT but also integrate BRICS payments' },
        { key: 'swift-loyalty', label: 'SWIFT Loyalty', description: 'Reject BRICS system, stay with dollar' },
        { key: 'euro-alternative', label: 'Promote Euro Alternative', description: 'Build European payment independence' },
        { key: 'wait-see', label: 'Wait and See', description: 'Delay decision until clear winner emerges' }
      ]
    },
    payoffMatrix: {
      'defend-dollar': {
        'full-launch': {
          'dual-system': {
            usa: { economic: -2, security: 5, technology: 0, resources: 2, diplomatic: -3 },
            brics: { economic: 4, security: -2, technology: 3, resources: 0, diplomatic: 5 },
            eu: { economic: 6, security: 0, technology: 2, resources: 1, diplomatic: 7 }
          },
          'swift-loyalty': {
            usa: { economic: 3, security: 8, technology: 0, resources: 3, diplomatic: 5 },
            brics: { economic: -3, security: -4, technology: 0, resources: -2, diplomatic: -2 },
            eu: { economic: -2, security: 6, technology: -1, resources: 0, diplomatic: 2 }
          },
          'euro-alternative': {
            usa: { economic: 0, security: 4, technology: -1, resources: 1, diplomatic: 0 },
            brics: { economic: 2, security: -1, technology: 2, resources: 0, diplomatic: 3 },
            eu: { economic: 5, security: 3, technology: 4, resources: 0, diplomatic: 6 }
          },
          'wait-see': {
            usa: { economic: 1, security: 6, technology: 0, resources: 2, diplomatic: 2 },
            brics: { economic: 1, security: -3, technology: 1, resources: -1, diplomatic: 1 },
            eu: { economic: 3, security: 2, technology: 0, resources: 0, diplomatic: 4 }
          }
        },
        'gradual-rollout': {
          'dual-system': {
            usa: { economic: 0, security: 4, technology: 0, resources: 2, diplomatic: 0 },
            brics: { economic: 3, security: 0, technology: 2, resources: 0, diplomatic: 3 },
            eu: { economic: 5, security: 1, technology: 1, resources: 1, diplomatic: 5 }
          },
          'swift-loyalty': {
            usa: { economic: 4, security: 7, technology: 0, resources: 3, diplomatic: 4 },
            brics: { economic: -1, security: -2, technology: 0, resources: -1, diplomatic: 0 },
            eu: { economic: 0, security: 5, technology: 0, resources: 0, diplomatic: 2 }
          },
          'euro-alternative': {
            usa: { economic: 1, security: 3, technology: -1, resources: 1, diplomatic: 1 },
            brics: { economic: 2, security: 0, technology: 1, resources: 0, diplomatic: 2 },
            eu: { economic: 6, security: 2, technology: 4, resources: 0, diplomatic: 6 }
          },
          'wait-see': {
            usa: { economic: 2, security: 5, technology: 0, resources: 2, diplomatic: 2 },
            brics: { economic: 1, security: -1, technology: 1, resources: 0, diplomatic: 1 },
            eu: { economic: 4, security: 2, technology: 0, resources: 0, diplomatic: 3 }
          }
        },
        'commodity-backed': {
          'dual-system': {
            usa: { economic: -3, security: 3, technology: 0, resources: -2, diplomatic: -2 },
            brics: { economic: 6, security: 0, technology: 2, resources: 7, diplomatic: 6 },
            eu: { economic: 4, security: 0, technology: 1, resources: 3, diplomatic: 5 }
          },
          'swift-loyalty': {
            usa: { economic: 2, security: 7, technology: 0, resources: 1, diplomatic: 3 },
            brics: { economic: -2, security: -3, technology: -1, resources: 2, diplomatic: -1 },
            eu: { economic: -1, security: 5, technology: -1, resources: 1, diplomatic: 1 }
          },
          'euro-alternative': {
            usa: { economic: -1, security: 4, technology: -1, resources: 0, diplomatic: 0 },
            brics: { economic: 3, security: -1, technology: 1, resources: 5, diplomatic: 4 },
            eu: { economic: 5, security: 2, technology: 3, resources: 2, diplomatic: 5 }
          },
          'wait-see': {
            usa: { economic: 0, security: 5, technology: 0, resources: 0, diplomatic: 1 },
            brics: { economic: 2, security: -2, technology: 0, resources: 4, diplomatic: 2 },
            eu: { economic: 3, security: 1, technology: 0, resources: 2, diplomatic: 3 }
          }
        },
        'abandon': {
          'dual-system': {
            usa: { economic: 5, security: 8, technology: 1, resources: 3, diplomatic: 6 },
            brics: { economic: -4, security: -5, technology: -2, resources: -3, diplomatic: -5 },
            eu: { economic: 2, security: 4, technology: 0, resources: 0, diplomatic: 2 }
          },
          'swift-loyalty': {
            usa: { economic: 7, security: 9, technology: 1, resources: 4, diplomatic: 8 },
            brics: { economic: -6, security: -7, technology: -3, resources: -4, diplomatic: -7 },
            eu: { economic: 1, security: 6, technology: 0, resources: 0, diplomatic: 3 }
          },
          'euro-alternative': {
            usa: { economic: 3, security: 5, technology: 0, resources: 2, diplomatic: 3 },
            brics: { economic: -3, security: -4, technology: -2, resources: -2, diplomatic: -4 },
            eu: { economic: 6, security: 3, technology: 5, resources: 0, diplomatic: 7 }
          },
          'wait-see': {
            usa: { economic: 5, security: 7, technology: 1, resources: 3, diplomatic: 5 },
            brics: { economic: -4, security: -5, technology: -2, resources: -3, diplomatic: -5 },
            eu: { economic: 3, security: 3, technology: 0, resources: 0, diplomatic: 3 }
          }
        }
      },
      'reform-swift': {
        'full-launch': {
          'dual-system': {
            usa: { economic: 1, security: 3, technology: 2, resources: 2, diplomatic: 2 },
            brics: { economic: 5, security: 0, technology: 4, resources: 1, diplomatic: 6 },
            eu: { economic: 7, security: 1, technology: 3, resources: 2, diplomatic: 8 }
          },
          'swift-loyalty': {
            usa: { economic: 4, security: 6, technology: 2, resources: 3, diplomatic: 5 },
            brics: { economic: -1, security: -2, technology: 1, resources: 0, diplomatic: 0 },
            eu: { economic: 2, security: 5, technology: 1, resources: 1, diplomatic: 4 }
          },
          'euro-alternative': {
            usa: { economic: 2, security: 3, technology: 1, resources: 2, diplomatic: 2 },
            brics: { economic: 3, security: 0, technology: 3, resources: 0, diplomatic: 4 },
            eu: { economic: 6, security: 2, technology: 5, resources: 1, diplomatic: 7 }
          },
          'wait-see': {
            usa: { economic: 3, security: 4, technology: 2, resources: 2, diplomatic: 3 },
            brics: { economic: 2, security: -1, technology: 2, resources: 0, diplomatic: 2 },
            eu: { economic: 5, security: 2, technology: 1, resources: 1, diplomatic: 5 }
          }
        },
        'gradual-rollout': {
          'dual-system': {
            usa: { economic: 3, security: 4, technology: 3, resources: 3, diplomatic: 4 },
            brics: { economic: 4, security: 2, technology: 3, resources: 1, diplomatic: 5 },
            eu: { economic: 6, security: 2, technology: 2, resources: 2, diplomatic: 7 }
          },
          'swift-loyalty': {
            usa: { economic: 5, security: 6, technology: 3, resources: 4, diplomatic: 6 },
            brics: { economic: 1, security: 0, technology: 1, resources: 0, diplomatic: 2 },
            eu: { economic: 3, security: 5, technology: 1, resources: 1, diplomatic: 5 }
          },
          'euro-alternative': {
            usa: { economic: 3, security: 4, technology: 2, resources: 3, diplomatic: 4 },
            brics: { economic: 3, security: 1, technology: 2, resources: 0, diplomatic: 4 },
            eu: { economic: 7, security: 3, technology: 6, resources: 1, diplomatic: 8 }
          },
          'wait-see': {
            usa: { economic: 4, security: 5, technology: 3, resources: 3, diplomatic: 5 },
            brics: { economic: 2, security: 1, technology: 2, resources: 0, diplomatic: 3 },
            eu: { economic: 5, security: 3, technology: 1, resources: 1, diplomatic: 6 }
          }
        },
        'commodity-backed': {
          'dual-system': {
            usa: { economic: 0, security: 2, technology: 2, resources: 0, diplomatic: 1 },
            brics: { economic: 7, security: 1, technology: 3, resources: 8, diplomatic: 7 },
            eu: { economic: 5, security: 1, technology: 2, resources: 4, diplomatic: 6 }
          },
          'swift-loyalty': {
            usa: { economic: 3, security: 5, technology: 2, resources: 2, diplomatic: 4 },
            brics: { economic: 0, security: -1, technology: 0, resources: 3, diplomatic: 1 },
            eu: { economic: 1, security: 4, technology: 1, resources: 2, diplomatic: 3 }
          },
          'euro-alternative': {
            usa: { economic: 1, security: 3, technology: 1, resources: 1, diplomatic: 2 },
            brics: { economic: 4, security: 0, technology: 2, resources: 6, diplomatic: 5 },
            eu: { economic: 6, security: 2, technology: 4, resources: 3, diplomatic: 6 }
          },
          'wait-see': {
            usa: { economic: 2, security: 4, technology: 2, resources: 1, diplomatic: 3 },
            brics: { economic: 3, security: -1, technology: 1, resources: 5, diplomatic: 3 },
            eu: { economic: 4, security: 2, technology: 1, resources: 3, diplomatic: 4 }
          }
        },
        'abandon': {
          'dual-system': {
            usa: { economic: 6, security: 7, technology: 4, resources: 4, diplomatic: 7 },
            brics: { economic: -3, security: -4, technology: -1, resources: -2, diplomatic: -4 },
            eu: { economic: 4, security: 4, technology: 2, resources: 1, diplomatic: 5 }
          },
          'swift-loyalty': {
            usa: { economic: 8, security: 8, technology: 4, resources: 5, diplomatic: 9 },
            brics: { economic: -5, security: -6, technology: -2, resources: -3, diplomatic: -6 },
            eu: { economic: 3, security: 6, technology: 2, resources: 1, diplomatic: 5 }
          },
          'euro-alternative': {
            usa: { economic: 4, security: 5, technology: 3, resources: 3, diplomatic: 5 },
            brics: { economic: -2, security: -3, technology: -1, resources: -1, diplomatic: -3 },
            eu: { economic: 7, security: 4, technology: 6, resources: 1, diplomatic: 8 }
          },
          'wait-see': {
            usa: { economic: 6, security: 6, technology: 4, resources: 4, diplomatic: 7 },
            brics: { economic: -3, security: -4, technology: -1, resources: -2, diplomatic: -4 },
            eu: { economic: 4, security: 4, technology: 2, resources: 1, diplomatic: 5 }
          }
        }
      },
      'digital-dollar': {
        'full-launch': {
          'dual-system': {
            usa: { economic: 2, security: 4, technology: 6, resources: 2, diplomatic: 3 },
            brics: { economic: 3, security: -1, technology: 2, resources: 1, diplomatic: 4 },
            eu: { economic: 6, security: 1, technology: 4, resources: 2, diplomatic: 7 }
          },
          'swift-loyalty': {
            usa: { economic: 5, security: 7, technology: 7, resources: 3, diplomatic: 6 },
            brics: { economic: -2, security: -3, technology: -1, resources: 0, diplomatic: -1 },
            eu: { economic: 1, security: 5, technology: 3, resources: 1, diplomatic: 4 }
          },
          'euro-alternative': {
            usa: { economic: 3, security: 4, technology: 5, resources: 2, diplomatic: 3 },
            brics: { economic: 2, security: -1, technology: 1, resources: 0, diplomatic: 3 },
            eu: { economic: 5, security: 2, technology: 7, resources: 1, diplomatic: 6 }
          },
          'wait-see': {
            usa: { economic: 4, security: 5, technology: 6, resources: 2, diplomatic: 4 },
            brics: { economic: 1, security: -2, technology: 1, resources: 0, diplomatic: 2 },
            eu: { economic: 4, security: 2, technology: 3, resources: 1, diplomatic: 5 }
          }
        },
        'gradual-rollout': {
          'dual-system': {
            usa: { economic: 4, security: 5, technology: 7, resources: 3, diplomatic: 5 },
            brics: { economic: 3, security: 1, technology: 2, resources: 1, diplomatic: 4 },
            eu: { economic: 6, security: 2, technology: 5, resources: 2, diplomatic: 7 }
          },
          'swift-loyalty': {
            usa: { economic: 6, security: 7, technology: 8, resources: 4, diplomatic: 7 },
            brics: { economic: 0, security: -1, technology: 0, resources: 0, diplomatic: 1 },
            eu: { economic: 2, security: 5, technology: 4, resources: 1, diplomatic: 5 }
          },
          'euro-alternative': {
            usa: { economic: 4, security: 5, technology: 6, resources: 3, diplomatic: 5 },
            brics: { economic: 2, security: 0, technology: 1, resources: 0, diplomatic: 3 },
            eu: { economic: 7, security: 3, technology: 8, resources: 1, diplomatic: 8 }
          },
          'wait-see': {
            usa: { economic: 5, security: 6, technology: 7, resources: 3, diplomatic: 6 },
            brics: { economic: 1, security: 0, technology: 1, resources: 0, diplomatic: 2 },
            eu: { economic: 5, security: 3, technology: 4, resources: 1, diplomatic: 6 }
          }
        },
        'commodity-backed': {
          'dual-system': {
            usa: { economic: 1, security: 3, technology: 5, resources: -1, diplomatic: 2 },
            brics: { economic: 6, security: 1, technology: 2, resources: 7, diplomatic: 6 },
            eu: { economic: 5, security: 1, technology: 4, resources: 3, diplomatic: 6 }
          },
          'swift-loyalty': {
            usa: { economic: 4, security: 6, technology: 7, resources: 1, diplomatic: 5 },
            brics: { economic: -1, security: -2, technology: -1, resources: 2, diplomatic: 0 },
            eu: { economic: 0, security: 4, technology: 3, resources: 1, diplomatic: 3 }
          },
          'euro-alternative': {
            usa: { economic: 2, security: 4, technology: 5, resources: 0, diplomatic: 3 },
            brics: { economic: 3, security: 0, technology: 1, resources: 5, diplomatic: 4 },
            eu: { economic: 6, security: 2, technology: 6, resources: 2, diplomatic: 6 }
          },
          'wait-see': {
            usa: { economic: 3, security: 5, technology: 6, resources: 0, diplomatic: 4 },
            brics: { economic: 2, security: -1, technology: 0, resources: 4, diplomatic: 2 },
            eu: { economic: 4, security: 2, technology: 4, resources: 2, diplomatic: 4 }
          }
        },
        'abandon': {
          'dual-system': {
            usa: { economic: 7, security: 8, technology: 9, resources: 4, diplomatic: 8 },
            brics: { economic: -4, security: -5, technology: -3, resources: -2, diplomatic: -5 },
            eu: { economic: 3, security: 4, technology: 5, resources: 1, diplomatic: 5 }
          },
          'swift-loyalty': {
            usa: { economic: 9, security: 9, technology: 10, resources: 5, diplomatic: 10 },
            brics: { economic: -6, security: -7, technology: -4, resources: -3, diplomatic: -7 },
            eu: { economic: 2, security: 6, technology: 5, resources: 1, diplomatic: 5 }
          },
          'euro-alternative': {
            usa: { economic: 5, security: 6, technology: 8, resources: 3, diplomatic: 6 },
            brics: { economic: -3, security: -4, technology: -2, resources: -1, diplomatic: -4 },
            eu: { economic: 7, security: 4, technology: 9, resources: 1, diplomatic: 8 }
          },
          'wait-see': {
            usa: { economic: 7, security: 7, technology: 9, resources: 4, diplomatic: 8 },
            brics: { economic: -4, security: -5, technology: -3, resources: -2, diplomatic: -5 },
            eu: { economic: 4, security: 4, technology: 5, resources: 1, diplomatic: 6 }
          }
        }
      },
      'status-quo': {
        'full-launch': {
          'dual-system': {
            usa: { economic: -1, security: 2, technology: 0, resources: 1, diplomatic: -2 },
            brics: { economic: 6, security: 1, technology: 5, resources: 2, diplomatic: 7 },
            eu: { economic: 7, security: 0, technology: 3, resources: 2, diplomatic: 8 }
          },
          'swift-loyalty': {
            usa: { economic: 2, security: 5, technology: 0, resources: 2, diplomatic: 3 },
            brics: { economic: -2, security: -3, technology: 1, resources: 0, diplomatic: -1 },
            eu: { economic: 0, security: 4, technology: 0, resources: 1, diplomatic: 2 }
          },
          'euro-alternative': {
            usa: { economic: 0, security: 2, technology: -1, resources: 1, diplomatic: 0 },
            brics: { economic: 4, security: 0, technology: 4, resources: 1, diplomatic: 5 },
            eu: { economic: 6, security: 1, technology: 6, resources: 1, diplomatic: 7 }
          },
          'wait-see': {
            usa: { economic: 1, security: 3, technology: 0, resources: 1, diplomatic: 1 },
            brics: { economic: 3, security: -1, technology: 3, resources: 1, diplomatic: 3 },
            eu: { economic: 5, security: 1, technology: 2, resources: 1, diplomatic: 5 }
          }
        },
        'gradual-rollout': {
          'dual-system': {
            usa: { economic: 1, security: 3, technology: 0, resources: 2, diplomatic: 1 },
            brics: { economic: 5, security: 2, technology: 4, resources: 2, diplomatic: 6 },
            eu: { economic: 6, security: 1, technology: 2, resources: 2, diplomatic: 7 }
          },
          'swift-loyalty': {
            usa: { economic: 3, security: 5, technology: 0, resources: 3, diplomatic: 4 },
            brics: { economic: 0, security: -1, technology: 1, resources: 0, diplomatic: 1 },
            eu: { economic: 1, security: 4, technology: 0, resources: 1, diplomatic: 3 }
          },
          'euro-alternative': {
            usa: { economic: 1, security: 3, technology: -1, resources: 2, diplomatic: 2 },
            brics: { economic: 4, security: 1, technology: 3, resources: 1, diplomatic: 5 },
            eu: { economic: 7, security: 2, technology: 7, resources: 1, diplomatic: 8 }
          },
          'wait-see': {
            usa: { economic: 2, security: 4, technology: 0, resources: 2, diplomatic: 3 },
            brics: { economic: 3, security: 1, technology: 2, resources: 1, diplomatic: 4 },
            eu: { economic: 5, security: 2, technology: 2, resources: 1, diplomatic: 6 }
          }
        },
        'commodity-backed': {
          'dual-system': {
            usa: { economic: -2, security: 1, technology: 0, resources: -2, diplomatic: -3 },
            brics: { economic: 8, security: 2, technology: 4, resources: 9, diplomatic: 8 },
            eu: { economic: 5, security: 0, technology: 2, resources: 4, diplomatic: 6 }
          },
          'swift-loyalty': {
            usa: { economic: 1, security: 4, technology: 0, resources: 0, diplomatic: 2 },
            brics: { economic: -1, security: -2, technology: 0, resources: 3, diplomatic: 0 },
            eu: { economic: -1, security: 3, technology: 0, resources: 1, diplomatic: 1 }
          },
          'euro-alternative': {
            usa: { economic: -1, security: 2, technology: -1, resources: -1, diplomatic: -1 },
            brics: { economic: 5, security: 1, technology: 3, resources: 7, diplomatic: 6 },
            eu: { economic: 6, security: 1, technology: 5, resources: 3, diplomatic: 6 }
          },
          'wait-see': {
            usa: { economic: 0, security: 3, technology: 0, resources: -1, diplomatic: 0 },
            brics: { economic: 4, security: 0, technology: 2, resources: 6, diplomatic: 4 },
            eu: { economic: 4, security: 1, technology: 1, resources: 2, diplomatic: 4 }
          }
        },
        'abandon': {
          'dual-system': {
            usa: { economic: 5, security: 6, technology: 1, resources: 3, diplomatic: 6 },
            brics: { economic: -5, security: -6, technology: -3, resources: -3, diplomatic: -6 },
            eu: { economic: 3, security: 3, technology: 1, resources: 1, diplomatic: 4 }
          },
          'swift-loyalty': {
            usa: { economic: 6, security: 7, technology: 1, resources: 4, diplomatic: 7 },
            brics: { economic: -6, security: -7, technology: -4, resources: -4, diplomatic: -7 },
            eu: { economic: 2, security: 5, technology: 1, resources: 1, diplomatic: 4 }
          },
          'euro-alternative': {
            usa: { economic: 3, security: 4, technology: 0, resources: 2, diplomatic: 4 },
            brics: { economic: -4, security: -5, technology: -3, resources: -2, diplomatic: -5 },
            eu: { economic: 7, security: 3, technology: 6, resources: 1, diplomatic: 8 }
          },
          'wait-see': {
            usa: { economic: 5, security: 5, technology: 1, resources: 3, diplomatic: 6 },
            brics: { economic: -5, security: -6, technology: -3, resources: -3, diplomatic: -6 },
            eu: { economic: 4, security: 3, technology: 1, resources: 1, diplomatic: 5 }
          }
        }
      }
    }
  }
];

// Calculate overall utility score using weights
export const calculateUtility = (
  payoff: MultiDimensionalPayoff,
  weights: { economic: number; security: number; technology: number; resources: number; diplomatic: number }
): number => {
  return (
    payoff.economic * weights.economic +
    payoff.security * weights.security +
    payoff.technology * weights.technology +
    payoff.resources * weights.resources +
    payoff.diplomatic * weights.diplomatic
  );
};

// Default weights for each player (can be customized)
export const defaultWeights = {
  usa: {
    economic: 0.25,
    security: 0.30,
    technology: 0.25,
    resources: 0.10,
    diplomatic: 0.10
  },
  brics: {
    economic: 0.30,
    security: 0.20,
    technology: 0.20,
    resources: 0.20,
    diplomatic: 0.10
  },
  eu: {
    economic: 0.35,
    security: 0.15,
    technology: 0.20,
    resources: 0.15,
    diplomatic: 0.15
  }
};

// Check for Nash Equilibrium in 3-player game
export const isNashEquilibrium3P = (
  scenario: ThreePlayerScenario,
  usaStrategy: string,
  bricsStrategy: string,
  euStrategy: string
): boolean => {
  const currentPayoff = scenario.payoffMatrix[usaStrategy]?.[bricsStrategy]?.[euStrategy];
  if (!currentPayoff) return false;

  const usaUtility = calculateUtility(currentPayoff.usa, defaultWeights.usa);
  const bricsUtility = calculateUtility(currentPayoff.brics, defaultWeights.brics);
  const euUtility = calculateUtility(currentPayoff.eu, defaultWeights.eu);

  // Check if USA can improve by deviating
  for (const altUsaStrategy of scenario.strategies.usa.map(s => s.key)) {
    if (altUsaStrategy === usaStrategy) continue;
    const altPayoff = scenario.payoffMatrix[altUsaStrategy]?.[bricsStrategy]?.[euStrategy];
    if (altPayoff && calculateUtility(altPayoff.usa, defaultWeights.usa) > usaUtility) {
      return false;
    }
  }

  // Check if BRICS can improve by deviating
  for (const altBricsStrategy of scenario.strategies.brics.map(s => s.key)) {
    if (altBricsStrategy === bricsStrategy) continue;
    const altPayoff = scenario.payoffMatrix[usaStrategy]?.[altBricsStrategy]?.[euStrategy];
    if (altPayoff && calculateUtility(altPayoff.brics, defaultWeights.brics) > bricsUtility) {
      return false;
    }
  }

  // Check if EU can improve by deviating
  for (const altEuStrategy of scenario.strategies.eu.map(s => s.key)) {
    if (altEuStrategy === euStrategy) continue;
    const altPayoff = scenario.payoffMatrix[usaStrategy]?.[bricsStrategy]?.[altEuStrategy];
    if (altPayoff && calculateUtility(altPayoff.eu, defaultWeights.eu) > euUtility) {
      return false;
    }
  }

  return true;
};

// Check for Pareto Optimality
export const isParetoOptimal3P = (
  scenario: ThreePlayerScenario,
  usaStrategy: string,
  bricsStrategy: string,
  euStrategy: string
): boolean => {
  const currentPayoff = scenario.payoffMatrix[usaStrategy]?.[bricsStrategy]?.[euStrategy];
  if (!currentPayoff) return false;

  const currentUtilities = {
    usa: calculateUtility(currentPayoff.usa, defaultWeights.usa),
    brics: calculateUtility(currentPayoff.brics, defaultWeights.brics),
    eu: calculateUtility(currentPayoff.eu, defaultWeights.eu)
  };

  // Check all other strategy combinations
  for (const altUsa of scenario.strategies.usa.map(s => s.key)) {
    for (const altBrics of scenario.strategies.brics.map(s => s.key)) {
      for (const altEu of scenario.strategies.eu.map(s => s.key)) {
        const altPayoff = scenario.payoffMatrix[altUsa]?.[altBrics]?.[altEu];
        if (!altPayoff) continue;

        const altUtilities = {
          usa: calculateUtility(altPayoff.usa, defaultWeights.usa),
          brics: calculateUtility(altPayoff.brics, defaultWeights.brics),
          eu: calculateUtility(altPayoff.eu, defaultWeights.eu)
        };

        // If all players are at least as well off, and at least one is strictly better off
        if (
          altUtilities.usa >= currentUtilities.usa &&
          altUtilities.brics >= currentUtilities.brics &&
          altUtilities.eu >= currentUtilities.eu &&
          (altUtilities.usa > currentUtilities.usa ||
            altUtilities.brics > currentUtilities.brics ||
            altUtilities.eu > currentUtilities.eu)
        ) {
          return false; // Not Pareto optimal
        }
      }
    }
  }

  return true;
};
