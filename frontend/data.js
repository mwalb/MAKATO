/**
 * ============================================================================
 * KOKOTOA MAKATO - DATA RASMI YA MAKATO YA MITANDAO YA SIMU TANZANIA
 * ============================================================================
 * Chanzo: Makato Calculator - Master Tariff Data (PDF rasmi)
 * Mitandao: M-Pesa, AzamPesa, Airtel Money, HaloPesa, Mixx by Yas
 * ============================================================================
 */

const TZ_NETWORKS = [
    {
        id: 'mpesa',
        name: 'M-Pesa',
        shortName: 'M-Pesa',
        logo: 'mpesa.jpeg',
        color: '#e60000',
        tiers: [
            { min: 0,       max: 999,       send_same: 10,    send_other: 15,    withdraw: 185   },
            { min: 1000,    max: 1999,      send_same: 30,    send_other: 35,    withdraw: 360   },
            { min: 2000,    max: 2999,      send_same: 30,    send_other: 45,    withdraw: 410   },
            { min: 3000,    max: 3999,      send_same: 50,    send_other: 68,    withdraw: 614   },
            { min: 4000,    max: 4999,      send_same: 60,    send_other: 81,    withdraw: 677   },
            { min: 5000,    max: 6999,      send_same: 130,   send_other: 180,   withdraw: 1004  },
            { min: 7000,    max: 9999,      send_same: 150,   send_other: 180,   withdraw: 1056  },
            { min: 10000,   max: 14999,     send_same: 350,   send_other: 495,   withdraw: 1552  },
            { min: 15000,   max: 19999,     send_same: 360,   send_other: 495,   withdraw: 1645  },
            { min: 20000,   max: 29999,     send_same: 380,   send_other: 540,   withdraw: 2156  },
            { min: 30000,   max: 39999,     send_same: 400,   send_other: 612,   withdraw: 2201  },
            { min: 40000,   max: 49999,     send_same: 410,   send_other: 675,   withdraw: 2769  },
            { min: 50000,   max: 99999,     send_same: 720,   send_other: 1125,  withdraw: 3273  },
            { min: 100000,  max: 199999,    send_same: 1000,  send_other: 1440,  withdraw: 4357  },
            { min: 200000,  max: 299999,    send_same: 1200,  send_other: 1710,  withdraw: 6121  },
            { min: 300000,  max: 399999,    send_same: 1500,  send_other: 2070,  withdraw: 7338  },
            { min: 400000,  max: 499999,    send_same: 1500,  send_other: 2250,  withdraw: 7932  },
            { min: 500000,  max: 599999,    send_same: 2200,  send_other: 2880,  withdraw: 8745  },
            { min: 600000,  max: 699999,    send_same: 3300,  send_other: 3870,  withdraw: 9532  },
            { min: 700000,  max: 799999,    send_same: 3300,  send_other: 3870,  withdraw: 9700  },
            { min: 800000,  max: 899999,    send_same: 3500,  send_other: 3870,  withdraw: 9750  },
            { min: 900000,  max: 1000000,   send_same: 3500,  send_other: 5400,  withdraw: 9776  },
            { min: 1000001, max: 3000000,   send_same: 4800,  send_other: 5400,  withdraw: 9875  },
            { min: 3000001, max: Infinity,   send_same: 4800,  send_other: 5400,  withdraw: 12000 }
        ]
    },
    {
        id: 'azampesa',
        name: 'AzamPesa',
        shortName: 'AzamPesa',
        logo: 'azampesa.jpeg',
        color: '#00a8cc',
        tiers: [
            { min: 0,       max: 999,       send_same: 10,    send_other: 10,    withdraw: 160   },
            { min: 1000,    max: 1999,      send_same: 10,    send_other: 10,    withdraw: 252   },
            { min: 2000,    max: 2999,      send_same: 10,    send_other: 10,    withdraw: 359   },
            { min: 3000,    max: 3999,      send_same: 14,    send_other: 14,    withdraw: 500   },
            { min: 4000,    max: 4999,      send_same: 27,    send_other: 27,    withdraw: 595   },
            { min: 5000,    max: 6999,      send_same: 54,    send_other: 54,    withdraw: 788   },
            { min: 7000,    max: 9999,      send_same: 56,    send_other: 56,    withdraw: 879   },
            { min: 10000,   max: 14999,     send_same: 102,   send_other: 102,   withdraw: 1225  },
            { min: 15000,   max: 19999,     send_same: 195,   send_other: 195,   withdraw: 1325  },
            { min: 20000,   max: 29999,     send_same: 306,   send_other: 306,   withdraw: 1561  },
            { min: 30000,   max: 39999,     send_same: 351,   send_other: 351,   withdraw: 1926  },
            { min: 40000,   max: 49999,     send_same: 419,   send_other: 419,   withdraw: 2489  },
            { min: 50000,   max: 99999,     send_same: 573,   send_other: 573,   withdraw: 3003  },
            { min: 100000,  max: 199999,    send_same: 707,   send_other: 707,   withdraw: 3992  },
            { min: 200000,  max: 299999,    send_same: 821,   send_other: 821,   withdraw: 5411  },
            { min: 300000,  max: 399999,    send_same: 838,   send_other: 838,   withdraw: 6238  },
            { min: 400000,  max: 499999,    send_same: 982,   send_other: 982,   withdraw: 6832  },
            { min: 500000,  max: 599999,    send_same: 1245,  send_other: 1245,  withdraw: 7545  },
            { min: 600000,  max: 699999,    send_same: 1532,  send_other: 1532,  withdraw: 8282  },
            { min: 700000,  max: 799999,    send_same: 1700,  send_other: 1700,  withdraw: 8450  },
            { min: 800000,  max: 899999,    send_same: 1500,  send_other: 1500,  withdraw: 8250  },
            { min: 900000,  max: 1000000,   send_same: 1776,  send_other: 1776,  withdraw: 8526  },
            { min: 1000001, max: 3000000,   send_same: 1875,  send_other: 1875,  withdraw: 8625  },
            { min: 3000001, max: Infinity,   send_same: 2000,  send_other: 2000,  withdraw: 9125 }
        ]
    },
    {
        id: 'airtelmoney',
        name: 'Airtel Money',
        shortName: 'Airtel',
        logo: 'airtelmoney.jpeg',
        color: '#ff0000',
        tiers: [
            { min: 0,       max: 999,       send_same: 10,    send_other: 15,    withdraw: 100   },
            { min: 1000,    max: 1999,      send_same: 30,    send_other: 45,    withdraw: 310   },
            { min: 2000,    max: 2999,      send_same: 30,    send_other: 45,    withdraw: 410   },
            { min: 3000,    max: 3999,      send_same: 50,    send_other: 90,    withdraw: 614   },
            { min: 4000,    max: 4999,      send_same: 60,    send_other: 90,    withdraw: 677   },
            { min: 5000,    max: 6999,      send_same: 130,   send_other: 180,   withdraw: 1004  },
            { min: 7000,    max: 9999,      send_same: 150,   send_other: 180,   withdraw: 1056  },
            { min: 10000,   max: 14999,     send_same: 360,   send_other: 495,   withdraw: 1552  },
            { min: 15000,   max: 19999,     send_same: 360,   send_other: 495,   withdraw: 1645  },
            { min: 20000,   max: 29999,     send_same: 380,   send_other: 540,   withdraw: 2156  },
            { min: 30000,   max: 39999,     send_same: 400,   send_other: 612,   withdraw: 2201  },
            { min: 40000,   max: 49999,     send_same: 410,   send_other: 675,   withdraw: 2769  },
            { min: 50000,   max: 99999,     send_same: 720,   send_other: 1125,  withdraw: 3273  },
            { min: 100000,  max: 199999,    send_same: 1000,  send_other: 1440,  withdraw: 4357  },
            { min: 200000,  max: 299999,    send_same: 1200,  send_other: 1710,  withdraw: 6121  },
            { min: 300000,  max: 399999,    send_same: 1500,  send_other: 2070,  withdraw: 7338  },
            { min: 400000,  max: 499999,    send_same: 1500,  send_other: 2250,  withdraw: 7982  },
            { min: 500000,  max: 599999,    send_same: 2200,  send_other: 2880,  withdraw: 8745  },
            { min: 600000,  max: 699999,    send_same: 3300,  send_other: 3870,  withdraw: 9532  },
            { min: 700000,  max: 799999,    send_same: 3300,  send_other: 3870,  withdraw: 9700  },
            { min: 800000,  max: 899999,    send_same: 3500,  send_other: 3870,  withdraw: 9750  },
            { min: 900000,  max: 1000000,   send_same: 3500,  send_other: 5400,  withdraw: 9776  },
            { min: 1000001, max: 3000000,   send_same: 4800,  send_other: 5400,  withdraw: 9875  },
            { min: 3000001, max: Infinity,   send_same: 4800,  send_other: 5400,  withdraw: 12000 }
        ]
    },
    {
        id: 'halopesa',
        name: 'HaloPesa',
        shortName: 'HaloPesa',
        logo: 'halopesa.png',
        color: '#00a651',
        tiers: [
            { min: 0,       max: 999,       send_same: 10,    send_other: 10,    withdraw: 10    },
            { min: 1000,    max: 1999,      send_same: 25,    send_other: 40,    withdraw: 310   },
            { min: 2000,    max: 2999,      send_same: 25,    send_other: 40,    withdraw: 340   },
            { min: 3000,    max: 3999,      send_same: 50,    send_other: 80,    withdraw: 454   },
            { min: 4000,    max: 4999,      send_same: 60,    send_other: 85,    withdraw: 627   },
            { min: 5000,    max: 6999,      send_same: 130,   send_other: 178,   withdraw: 899   },
            { min: 7000,    max: 9999,      send_same: 140,   send_other: 180,   withdraw: 956   },
            { min: 10000,   max: 14999,     send_same: 330,   send_other: 480,   withdraw: 1402  },
            { min: 15000,   max: 19999,     send_same: 340,   send_other: 490,   withdraw: 1595  },
            { min: 20000,   max: 29999,     send_same: 360,   send_other: 520,   withdraw: 1956  },
            { min: 30000,   max: 39999,     send_same: 370,   send_other: 600,   withdraw: 2151  },
            { min: 40000,   max: 49999,     send_same: 380,   send_other: 648,   withdraw: 2519  },
            { min: 50000,   max: 99999,     send_same: 580,   send_other: 900,   withdraw: 3073  },
            { min: 100000,  max: 199999,    send_same: 700,   send_other: 1350,  withdraw: 4007  },
            { min: 200000,  max: 299999,    send_same: 750,   send_other: 1620,  withdraw: 5321  },
            { min: 300000,  max: 399999,    send_same: 950,   send_other: 1800,  withdraw: 6338  },
            { min: 400000,  max: 499999,    send_same: 1200,  send_other: 1980,  withdraw: 6982  },
            { min: 500000,  max: 599999,    send_same: 1300,  send_other: 2520,  withdraw: 7645  },
            { min: 600000,  max: 699999,    send_same: 1400,  send_other: 2880,  withdraw: 8532  },
            { min: 700000,  max: 799999,    send_same: 1400,  send_other: 2880,  withdraw: 8700  },
            { min: 800000,  max: 899999,    send_same: 1750,  send_other: 3150,  withdraw: 9250  },
            { min: 900000,  max: 1000000,   send_same: 1750,  send_other: 3150,  withdraw: 9276  },
            { min: 1000001, max: 3000000,   send_same: 3000,  send_other: 3600,  withdraw: 9375  },
            { min: 3000001, max: Infinity,   send_same: 3000,  send_other: 4500,  withdraw: 9500 }
        ]
    },
    {
        id: 'yas',
        name: 'Mixx by Yas',
        shortName: 'Mixx by Yas',
        logo: 'yas.png',
        color: '#0039a6',
        tiers: [
            { min: 0,       max: 999,       send_same: 10,    send_other: 15,    withdraw: 0     },
            { min: 1000,    max: 1999,      send_same: 30,    send_other: 45,    withdraw: 310   },
            { min: 2000,    max: 2999,      send_same: 30,    send_other: 45,    withdraw: 410   },
            { min: 3000,    max: 3999,      send_same: 50,    send_other: 90,    withdraw: 614   },
            { min: 4000,    max: 4999,      send_same: 60,    send_other: 90,    withdraw: 677   },
            { min: 5000,    max: 6999,      send_same: 130,   send_other: 180,   withdraw: 1004  },
            { min: 7000,    max: 9999,      send_same: 150,   send_other: 180,   withdraw: 1056  },
            { min: 10000,   max: 14999,     send_same: 360,   send_other: 495,   withdraw: 1552  },
            { min: 15000,   max: 19999,     send_same: 360,   send_other: 495,   withdraw: 1645  },
            { min: 20000,   max: 29999,     send_same: 380,   send_other: 540,   withdraw: 2156  },
            { min: 30000,   max: 39999,     send_same: 400,   send_other: 612,   withdraw: 2201  },
            { min: 40000,   max: 49999,     send_same: 410,   send_other: 675,   withdraw: 2769  },
            { min: 50000,   max: 99999,     send_same: 720,   send_other: 1125,  withdraw: 3273  },
            { min: 100000,  max: 199999,    send_same: 1000,  send_other: 1440,  withdraw: 4357  },
            { min: 200000,  max: 299999,    send_same: 1200,  send_other: 1710,  withdraw: 6121  },
            { min: 300000,  max: 399999,    send_same: 1500,  send_other: 2070,  withdraw: 7338  },
            { min: 400000,  max: 499999,    send_same: 1500,  send_other: 2250,  withdraw: 7982  },
            { min: 500000,  max: 599999,    send_same: 2200,  send_other: 2880,  withdraw: 8745  },
            { min: 600000,  max: 699999,    send_same: 3300,  send_other: 3870,  withdraw: 9532  },
            { min: 700000,  max: 799999,    send_same: 3300,  send_other: 3870,  withdraw: 9700  },
            { min: 800000,  max: 899999,    send_same: 3500,  send_other: 3870,  withdraw: 9750  },
            { min: 900000,  max: 1000000,   send_same: 3500,  send_other: 5400,  withdraw: 9776  },
            { min: 1000001, max: 3000000,   send_same: 4800,  send_other: 5400,  withdraw: 9875  },
            { min: 3000001, max: Infinity,   send_same: 4800,  send_other: 5400,  withdraw: 12000 }
        ]
    }
];

// Transaction type labels for UI display
const TX_TYPE_LABELS = {
    send_same: 'Ndani ya Mtandao',
    send_other: 'Mitandao Mingine',
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