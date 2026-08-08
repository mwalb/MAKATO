/**
 * ============================================================================
 * TANZANIA MOBILE MONEY TARIFF DATA
 * ============================================================================
 * 
 * INSTRUCTIONS FOR TEAM MEMBERS:
 * ----------------------------
 * 1. Download official tariff PDFs from each provider's website.
 * 2. Locate the "Transaction Fee" or "Makato" tables.
 * 3. Update the `tiers` arrays below to match the exact brackets and fees.
 * 4. Each tier object represents one fee bracket:
 *    - min:    Minimum transaction amount (inclusive) in TSh
 *    - max:    Maximum transaction amount (inclusive) in TSh
 *              Use Infinity for the top unbounded tier.
 *    - send_same:  Fee for sending within the SAME network
 *    - send_other: Fee for sending to a DIFFERENT network
 *    - withdraw:   Fee for cash withdrawal at an agent
 * 
 * 5. Save the file and test immediately — the UI auto-refreshes.
 * 
 * NOTE: The data below uses REALISTIC PLACEHOLDER values modeled on
 * typical Tanzanian market rates. Replace with official figures.
 * ============================================================================
 */

const TZ_NETWORKS = [
    {
        id: 'mpesa',
        name: 'Vodacom M-Pesa',
        shortName: 'M-Pesa',
        logo: 'mpesa.jpeg',
        color: '#e60000',
        // Source: Vodacom Tanzania tariff guide (update from vodacom.co.tz)
        tiers: [
            { min: 0,       max: 999,       send_same: 10,    send_other: 15,    withdraw: 10    },
            { min: 1000,    max: 1999,      send_same: 20,    send_other: 30,    withdraw: 20    },
            { min: 2000,    max: 2999,      send_same: 30,    send_other: 40,    withdraw: 30    },
            { min: 3000,    max: 4999,      send_same: 50,    send_other: 60,    withdraw: 50    },
            { min: 5000,    max: 9999,      send_same: 100,   send_other: 120,   withdraw: 100   },
            { min: 10000,   max: 19999,     send_same: 200,   send_other: 250,   withdraw: 200   },
            { min: 20000,   max: 29999,     send_same: 300,   send_other: 350,   withdraw: 300   },
            { min: 30000,   max: 39999,     send_same: 400,   send_other: 450,   withdraw: 400   },
            { min: 40000,   max: 49999,     send_same: 500,   send_other: 550,   withdraw: 500   },
            { min: 50000,   max: 99999,     send_same: 1000,  send_other: 1100,  withdraw: 1000  },
            { min: 100000,  max: 199999,    send_same: 2000,  send_other: 2200,  withdraw: 2000  },
            { min: 200000,  max: 299999,    send_same: 3000,  send_other: 3300,  withdraw: 3000  },
            { min: 300000,  max: 399999,    send_same: 4000,  send_other: 4400,  withdraw: 4000  },
            { min: 400000,  max: 499999,    send_same: 5000,  send_other: 5500,  withdraw: 5000  },
            { min: 500000,  max: 999999,    send_same: 10000, send_other: 11000, withdraw: 10000 },
            { min: 1000000, max: 1999999,   send_same: 20000, send_other: 22000, withdraw: 20000 },
            { min: 2000000, max: 3000000,   send_same: 30000, send_other: 33000, withdraw: 30000 },
            { min: 3000001, max: Infinity,   send_same: 50000, send_other: 55000, withdraw: 50000 }
        ]
    },
    {
        id: 'halopesa',
        name: 'Halopesa',
        shortName: 'Halopesa',
        logo: 'halopesa.png',
        color: '#00a651',
        // Source: Halotel/Halopesa tariff guide (update from halotel.co.tz)
        // Halopesa typically positions as low-cost; fees are modeled lower
        tiers: [
            { min: 0,       max: 999,       send_same: 5,     send_other: 10,    withdraw: 5     },
            { min: 1000,    max: 1999,      send_same: 10,    send_other: 15,    withdraw: 10    },
            { min: 2000,    max: 2999,      send_same: 15,    send_other: 20,    withdraw: 15    },
            { min: 3000,    max: 4999,      send_same: 25,    send_other: 35,    withdraw: 25    },
            { min: 5000,    max: 9999,      send_same: 50,    send_other: 70,    withdraw: 50    },
            { min: 10000,   max: 19999,     send_same: 100,   send_other: 130,   withdraw: 100   },
            { min: 20000,   max: 29999,     send_same: 150,   send_other: 200,   withdraw: 150   },
            { min: 30000,   max: 39999,     send_same: 200,   send_other: 260,   withdraw: 200   },
            { min: 40000,   max: 49999,     send_same: 250,   send_other: 320,   withdraw: 250   },
            { min: 50000,   max: 99999,     send_same: 500,   send_other: 650,   withdraw: 500   },
            { min: 100000,  max: 199999,    send_same: 1000,  send_other: 1300,  withdraw: 1000  },
            { min: 200000,  max: 299999,    send_same: 1500,  send_other: 1950,  withdraw: 1500  },
            { min: 300000,  max: 399999,    send_same: 2000,  send_other: 2600,  withdraw: 2000  },
            { min: 400000,  max: 499999,    send_same: 2500,  send_other: 3250,  withdraw: 2500  },
            { min: 500000,  max: 999999,    send_same: 5000,  send_other: 6500,  withdraw: 5000  },
            { min: 1000000, max: 1999999,   send_same: 10000, send_other: 13000, withdraw: 10000 },
            { min: 2000000, max: 3000000,   send_same: 15000, send_other: 19500, withdraw: 15000 },
            { min: 3000001, max: Infinity,   send_same: 25000, send_other: 32500, withdraw: 25000 }
        ]
    },
    {
        id: 'azampesa',
        name: 'AzamPesa',
        shortName: 'AzamPesa',
        logo: 'azampesa.jpeg',
        color: '#00a8cc',
        // Source: AzamPesa tariff guide (update from azampesa.co.tz)
        tiers: [
            { min: 0,       max: 999,       send_same: 8,     send_other: 12,    withdraw: 8     },
            { min: 1000,    max: 1999,      send_same: 18,    send_other: 25,    withdraw: 18    },
            { min: 2000,    max: 2999,      send_same: 28,    send_other: 38,    withdraw: 28    },
            { min: 3000,    max: 4999,      send_same: 45,    send_other: 55,    withdraw: 45    },
            { min: 5000,    max: 9999,      send_same: 90,    send_other: 110,   withdraw: 90    },
            { min: 10000,   max: 19999,     send_same: 180,   send_other: 220,   withdraw: 180   },
            { min: 20000,   max: 29999,     send_same: 280,   send_other: 330,   withdraw: 280   },
            { min: 30000,   max: 39999,     send_same: 380,   send_other: 430,   withdraw: 380   },
            { min: 40000,   max: 49999,     send_same: 480,   send_other: 530,   withdraw: 480   },
            { min: 50000,   max: 99999,     send_same: 950,   send_other: 1050,  withdraw: 950   },
            { min: 100000,  max: 199999,    send_same: 1900,  send_other: 2100,  withdraw: 1900  },
            { min: 200000,  max: 299999,    send_same: 2900,  send_other: 3200,  withdraw: 2900  },
            { min: 300000,  max: 399999,    send_same: 3900,  send_other: 4300,  withdraw: 3900  },
            { min: 400000,  max: 499999,    send_same: 4900,  send_other: 5400,  withdraw: 4900  },
            { min: 500000,  max: 999999,    send_same: 9500,  send_other: 10500, withdraw: 9500  },
            { min: 1000000, max: 1999999,   send_same: 19000, send_other: 21000, withdraw: 19000 },
            { min: 2000000, max: 3000000,   send_same: 29000, send_other: 32000, withdraw: 29000 },
            { min: 3000001, max: Infinity,   send_same: 48000, send_other: 53000, withdraw: 48000 }
        ]
    },
    {
        id: 'yas',
        name: 'Yas',
        shortName: 'Yas',
        logo: 'yas.png',
        color: '#0039a6',
        // Source: Yas Tanzania tariff guide (update from yas.tz)
        tiers: [
            { min: 0,       max: 999,       send_same: 12,    send_other: 18,    withdraw: 12    },
            { min: 1000,    max: 1999,      send_same: 22,    send_other: 32,    withdraw: 22    },
            { min: 2000,    max: 2999,      send_same: 32,    send_other: 42,    withdraw: 32    },
            { min: 3000,    max: 4999,      send_same: 52,    send_other: 62,    withdraw: 52    },
            { min: 5000,    max: 9999,      send_same: 105,   send_other: 125,   withdraw: 105   },
            { min: 10000,   max: 19999,     send_same: 210,   send_other: 260,   withdraw: 210   },
            { min: 20000,   max: 29999,     send_same: 310,   send_other: 360,   withdraw: 310   },
            { min: 30000,   max: 39999,     send_same: 410,   send_other: 460,   withdraw: 410   },
            { min: 40000,   max: 49999,     send_same: 510,   send_other: 560,   withdraw: 510   },
            { min: 50000,   max: 99999,     send_same: 1020,  send_other: 1120,  withdraw: 1020  },
            { min: 100000,  max: 199999,    send_same: 2050,  send_other: 2250,  withdraw: 2050  },
            { min: 200000,  max: 299999,    send_same: 3050,  send_other: 3350,  withdraw: 3050  },
            { min: 300000,  max: 399999,    send_same: 4050,  send_other: 4450,  withdraw: 4050  },
            { min: 400000,  max: 499999,    send_same: 5050,  send_other: 5550,  withdraw: 5050  },
            { min: 500000,  max: 999999,    send_same: 10100, send_other: 11100, withdraw: 10100 },
            { min: 1000000, max: 1999999,   send_same: 20200, send_other: 22200, withdraw: 20200 },
            { min: 2000000, max: 3000000,   send_same: 30200, send_other: 33200, withdraw: 30200 },
            { min: 3000001, max: Infinity,   send_same: 50200, send_other: 55200, withdraw: 50200 }
        ]
    },
    {
        id: 'airtelmoney',
        name: 'Airtel Money',
        shortName: 'Airtel',
        logo: 'airtelmoney.jpeg',
        color: '#ff0000',
        // Source: Airtel Tanzania tariff guide (update from airtel.co.tz)
        tiers: [
            { min: 0,       max: 999,       send_same: 10,    send_other: 15,    withdraw: 10    },
            { min: 1000,    max: 1999,      send_same: 20,    send_other: 30,    withdraw: 20    },
            { min: 2000,    max: 2999,      send_same: 30,    send_other: 40,    withdraw: 30    },
            { min: 3000,    max: 4999,      send_same: 50,    send_other: 60,    withdraw: 50    },
            { min: 5000,    max: 9999,      send_same: 100,   send_other: 120,   withdraw: 100   },
            { min: 10000,   max: 19999,     send_same: 200,   send_other: 240,   withdraw: 200   },
            { min: 20000,   max: 29999,     send_same: 300,   send_other: 340,   withdraw: 300   },
            { min: 30000,   max: 39999,     send_same: 400,   send_other: 440,   withdraw: 400   },
            { min: 40000,   max: 49999,     send_same: 500,   send_other: 540,   withdraw: 500   },
            { min: 50000,   max: 99999,     send_same: 1000,  send_other: 1080,  withdraw: 1000  },
            { min: 100000,  max: 199999,    send_same: 2000,  send_other: 2160,  withdraw: 2000  },
            { min: 200000,  max: 299999,    send_same: 3000,  send_other: 3240,  withdraw: 3000  },
            { min: 300000,  max: 399999,    send_same: 4000,  send_other: 4320,  withdraw: 4000  },
            { min: 400000,  max: 499999,    send_same: 5000,  send_other: 5400,  withdraw: 5000  },
            { min: 500000,  max: 999999,    send_same: 10000, send_other: 10800, withdraw: 10000 },
            { min: 1000000, max: 1999999,   send_same: 20000, send_other: 21600, withdraw: 20000 },
            { min: 2000000, max: 3000000,   send_same: 30000, send_other: 32400, withdraw: 30000 },
            { min: 3000001, max: Infinity,   send_same: 50000, send_other: 54000, withdraw: 50000 }
        ]
    }
];

// Transaction type labels for UI display
const TX_TYPE_LABELS = {
    send_same: 'Tuma Ndani ya Mtandao',
    send_other: 'Tuma Kwenye Mtandao Mwingine',
    withdraw: 'Toa Pesa (Agent)'
};

// Transaction type short labels for table display
const TX_TYPE_SHORT = {
    send_same: 'Ndani',
    send_other: 'Nje',
    withdraw: 'Toa'
};

// Minimum valid transaction amount
const MIN_AMOUNT = 1;

// Maximum reasonable transaction amount (for validation warning)
const MAX_AMOUNT = 10000000; // 10M TSh