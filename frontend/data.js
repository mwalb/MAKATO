/**
 * ============================================================================
 * KOKOTOA MAKATO - DATA RASMI YA MAKATO YA MITANDAO YA SIMU TANZANIA
 * ============================================================================
 * Mitandao: M-Pesa, AzamPesa, Airtel Money, HaloPesa, Mixx by Yas
 * Lipa Namba: Makato yanauwiano sawa kwa mitandao yote
 * ============================================================================
 */

// Transaction type labels
const TX_TYPE_LABELS = {
    send_same:  'Ndani ya Mtandao',
    send_other: 'Mitandao Mingine',
    withdraw:   'Toa Pesa (Agent)',
    lipa_namba: 'Lipa Namba'
};

const TX_TYPE_SHORT = {
    send_same:  'Ndani',
    send_other: 'Nje',
    withdraw:   'Toa',
    lipa_namba: 'Lipa'
};

const MIN_AMOUNT = 1;
const MAX_AMOUNT = 10000000;

// ============================================================================
// LIPA NAMBA TARIFFS (Sawa kwa Mitandao Yote)
// ============================================================================
const LIPA_NAMBA_TIERS = [
    { min: 0,       max: 999,       network: 20,   agent: 0,    total: 20    },
    { min: 1000,    max: 1999,      network: 50,   agent: 100,  total: 150   },
    { min: 2000,    max: 2999,      network: 70,   agent: 100,  total: 170   },
    { min: 3000,    max: 3999,      network: 100,  agent: 150,  total: 250   },
    { min: 4000,    max: 4999,      network: 200,  agent: 200,  total: 400   },
    { min: 5000,    max: 6999,      network: 300,  agent: 500,  total: 800   },
    { min: 7000,    max: 9999,      network: 500,  agent: 500,  total: 1000  },
    { min: 10000,   max: 14999,     network: 700,  agent: 500,  total: 1200  },
    { min: 15000,   max: 19999,     network: 850,  agent: 700,  total: 1550  },
    { min: 20000,   max: 29999,     network: 920,  agent: 700,  total: 1620  },
    { min: 30000,   max: 39999,     network: 1000, agent: 800,  total: 1800  },
    { min: 40000,   max: 49999,     network: 1200, agent: 800,  total: 2000  },
    { min: 50000,   max: 99999,     network: 1700, agent: 1000, total: 2700  },
    { min: 100000,  max: 199999,    network: 2000, agent: 1500, total: 3500  },
    { min: 200000,  max: 299999,    network: 2600, agent: 1500, total: 4100  },
    { min: 300000,  max: 399999,    network: 3000, agent: 2500, total: 5500  },
    { min: 400000,  max: 499999,    network: 3300, agent: 3000, total: 6300  },
    { min: 500000,  max: 599999,    network: 4500, agent: 3000, total: 7500  },
    { min: 600000,  max: 699999,    network: 5500, agent: 3000, total: 8500  },
    { min: 700000,  max: 799999,    network: 5700, agent: 4000, total: 9700  },
    { min: 800000,  max: 899999,    network: 6000, agent: 4000, total: 10000 },
    { min: 900000,  max: 1000000,   network: 6000, agent: 5000, total: 11000 },
    { min: 1000001, max: 3000000,   network: 6000, agent: 6000, total: 12000 },
    { min: 3000001, max: Infinity,   network: 6000, agent: 7000, total: 13000 }
];

function getLipaNambaFee(amount) {
    for (var i = 0; i < LIPA_NAMBA_TIERS.length; i++) {
        var tier = LIPA_NAMBA_TIERS[i];
        if (amount >= tier.min && amount <= tier.max) {
            return { network: tier.network, agent: tier.agent, total: tier.total };
        }
    }
    var last = LIPA_NAMBA_TIERS[LIPA_NAMBA_TIERS.length - 1];
    return { network: last.network, agent: last.agent, total: last.total };
}

// ============================================================================
// TZ NETWORKS
// ============================================================================
const TZ_NETWORKS = [
    {
        id: 'mpesa',
        name: 'M-Pesa',
        shortName: 'M-Pesa',
        logo: 'mpesa.jpeg',
        color: '#e60000',
        tiers: [
            { min: 0,       max: 999,       send_same: 10,    send_other: 15,    withdraw: 185,   lipa_namba: 20,    lipa_namba_network: 20,   lipa_namba_agent: 0    },
            { min: 1000,    max: 1999,      send_same: 30,    send_other: 35,    withdraw: 360,   lipa_namba: 150,   lipa_namba_network: 50,   lipa_namba_agent: 100  },
            { min: 2000,    max: 2999,      send_same: 30,    send_other: 45,    withdraw: 410,   lipa_namba: 170,   lipa_namba_network: 70,   lipa_namba_agent: 100  },
            { min: 3000,    max: 3999,      send_same: 50,    send_other: 68,    withdraw: 614,   lipa_namba: 250,   lipa_namba_network: 100,  lipa_namba_agent: 150  },
            { min: 4000,    max: 4999,      send_same: 60,    send_other: 81,    withdraw: 677,   lipa_namba: 400,   lipa_namba_network: 200,  lipa_namba_agent: 200  },
            { min: 5000,    max: 6999,      send_same: 130,   send_other: 180,   withdraw: 1004,  lipa_namba: 800,   lipa_namba_network: 300,  lipa_namba_agent: 500  },
            { min: 7000,    max: 9999,      send_same: 150,   send_other: 180,   withdraw: 1056,  lipa_namba: 1000,  lipa_namba_network: 500,  lipa_namba_agent: 500  },
            { min: 10000,   max: 14999,     send_same: 350,   send_other: 495,   withdraw: 1552,  lipa_namba: 1200,  lipa_namba_network: 700,  lipa_namba_agent: 500  },
            { min: 15000,   max: 19999,     send_same: 360,   send_other: 495,   withdraw: 1645,  lipa_namba: 1550,  lipa_namba_network: 850,  lipa_namba_agent: 700  },
            { min: 20000,   max: 29999,     send_same: 380,   send_other: 540,   withdraw: 2156,  lipa_namba: 1620,  lipa_namba_network: 920,  lipa_namba_agent: 700  },
            { min: 30000,   max: 39999,     send_same: 400,   send_other: 612,   withdraw: 2201,  lipa_namba: 1800,  lipa_namba_network: 1000, lipa_namba_agent: 800  },
            { min: 40000,   max: 49999,     send_same: 410,   send_other: 675,   withdraw: 2769,  lipa_namba: 2000,  lipa_namba_network: 1200, lipa_namba_agent: 800  },
            { min: 50000,   max: 99999,     send_same: 720,   send_other: 1125,  withdraw: 3273,  lipa_namba: 2700,  lipa_namba_network: 1700, lipa_namba_agent: 1000 },
            { min: 100000,  max: 199999,    send_same: 1000,  send_other: 1440,  withdraw: 4357,  lipa_namba: 3500,  lipa_namba_network: 2000, lipa_namba_agent: 1500 },
            { min: 200000,  max: 299999,    send_same: 1200,  send_other: 1710,  withdraw: 6121,  lipa_namba: 4100,  lipa_namba_network: 2600, lipa_namba_agent: 1500 },
            { min: 300000,  max: 399999,    send_same: 1500,  send_other: 2070,  withdraw: 7338,  lipa_namba: 5500,  lipa_namba_network: 3000, lipa_namba_agent: 2500 },
            { min: 400000,  max: 499999,    send_same: 1500,  send_other: 2250,  withdraw: 7932,  lipa_namba: 6300,  lipa_namba_network: 3300, lipa_namba_agent: 3000 },
            { min: 500000,  max: 599999,    send_same: 2200,  send_other: 2880,  withdraw: 8745,  lipa_namba: 7500,  lipa_namba_network: 4500, lipa_namba_agent: 3000 },
            { min: 600000,  max: 699999,    send_same: 3300,  send_other: 3870,  withdraw: 9532,  lipa_namba: 8500,  lipa_namba_network: 5500, lipa_namba_agent: 3000 },
            { min: 700000,  max: 799999,    send_same: 3300,  send_other: 3870,  withdraw: 9700,  lipa_namba: 9700,  lipa_namba_network: 5700, lipa_namba_agent: 4000 },
            { min: 800000,  max: 899999,    send_same: 3500,  send_other: 3870,  withdraw: 9750,  lipa_namba: 10000, lipa_namba_network: 6000, lipa_namba_agent: 4000 },
            { min: 900000,  max: 1000000,   send_same: 3500,  send_other: 5400,  withdraw: 9776,  lipa_namba: 11000, lipa_namba_network: 6000, lipa_namba_agent: 5000 },
            { min: 1000001, max: 3000000,   send_same: 4800,  send_other: 5400,  withdraw: 9875,  lipa_namba: 12000, lipa_namba_network: 6000, lipa_namba_agent: 6000 },
            { min: 3000001, max: Infinity,   send_same: 4800,  send_other: 5400,  withdraw: 12000, lipa_namba: 13000, lipa_namba_network: 6000, lipa_namba_agent: 7000 }
        ]
    },
    {
        id: 'azampesa',
        name: 'AzamPesa',
        shortName: 'AzamPesa',
        logo: 'azampesa.jpeg',
        color: '#00a8cc',
        tiers: [
            { min: 0,       max: 999,       send_same: 10,    send_other: 10,    withdraw: 160,   lipa_namba: 20,    lipa_namba_network: 20,   lipa_namba_agent: 0    },
            { min: 1000,    max: 1999,      send_same: 10,    send_other: 10,    withdraw: 252,   lipa_namba: 150,   lipa_namba_network: 50,   lipa_namba_agent: 100  },
            { min: 2000,    max: 2999,      send_same: 10,    send_other: 10,    withdraw: 359,   lipa_namba: 170,   lipa_namba_network: 70,   lipa_namba_agent: 100  },
            { min: 3000,    max: 3999,      send_same: 14,    send_other: 14,    withdraw: 500,   lipa_namba: 250,   lipa_namba_network: 100,  lipa_namba_agent: 150  },
            { min: 4000,    max: 4999,      send_same: 27,    send_other: 27,    withdraw: 595,   lipa_namba: 400,   lipa_namba_network: 200,  lipa_namba_agent: 200  },
            { min: 5000,    max: 6999,      send_same: 54,    send_other: 54,    withdraw: 788,   lipa_namba: 800,   lipa_namba_network: 300,  lipa_namba_agent: 500  },
            { min: 7000,    max: 9999,      send_same: 56,    send_other: 56,    withdraw: 879,   lipa_namba: 1000,  lipa_namba_network: 500,  lipa_namba_agent: 500  },
            { min: 10000,   max: 14999,     send_same: 102,   send_other: 102,   withdraw: 1225,  lipa_namba: 1200,  lipa_namba_network: 700,  lipa_namba_agent: 500  },
            { min: 15000,   max: 19999,     send_same: 195,   send_other: 195,   withdraw: 1325,  lipa_namba: 1550,  lipa_namba_network: 850,  lipa_namba_agent: 700  },
            { min: 20000,   max: 29999,     send_same: 306,   send_other: 306,   withdraw: 1561,  lipa_namba: 1620,  lipa_namba_network: 920,  lipa_namba_agent: 700  },
            { min: 30000,   max: 39999,     send_same: 351,   send_other: 351,   withdraw: 1926,  lipa_namba: 1800,  lipa_namba_network: 1000, lipa_namba_agent: 800  },
            { min: 40000,   max: 49999,     send_same: 419,   send_other: 419,   withdraw: 2489,  lipa_namba: 2000,  lipa_namba_network: 1200, lipa_namba_agent: 800  },
            { min: 50000,   max: 99999,     send_same: 573,   send_other: 573,   withdraw: 3003,  lipa_namba: 2700,  lipa_namba_network: 1700, lipa_namba_agent: 1000 },
            { min: 100000,  max: 199999,    send_same: 707,   send_other: 707,   withdraw: 3992,  lipa_namba: 3500,  lipa_namba_network: 2000, lipa_namba_agent: 1500 },
            { min: 200000,  max: 299999,    send_same: 821,   send_other: 821,   withdraw: 5411,  lipa_namba: 4100,  lipa_namba_network: 2600, lipa_namba_agent: 1500 },
            { min: 300000,  max: 399999,    send_same: 838,   send_other: 838,   withdraw: 6238,  lipa_namba: 5500,  lipa_namba_network: 3000, lipa_namba_agent: 2500 },
            { min: 400000,  max: 499999,    send_same: 982,   send_other: 982,   withdraw: 6832,  lipa_namba: 6300,  lipa_namba_network: 3300, lipa_namba_agent: 3000 },
            { min: 500000,  max: 599999,    send_same: 1245,  send_other: 1245,  withdraw: 7545,  lipa_namba: 7500,  lipa_namba_network: 4500, lipa_namba_agent: 3000 },
            { min: 600000,  max: 699999,    send_same: 1532,  send_other: 1532,  withdraw: 8282,  lipa_namba: 8500,  lipa_namba_network: 5500, lipa_namba_agent: 3000 },
            { min: 700000,  max: 799999,    send_same: 1700,  send_other: 1700,  withdraw: 8450,  lipa_namba: 9700,  lipa_namba_network: 5700, lipa_namba_agent: 4000 },
            { min: 800000,  max: 899999,    send_same: 1500,  send_other: 1500,  withdraw: 8250,  lipa_namba: 10000, lipa_namba_network: 6000, lipa_namba_agent: 4000 },
            { min: 900000,  max: 1000000,   send_same: 1776,  send_other: 1776,  withdraw: 8526,  lipa_namba: 11000, lipa_namba_network: 6000, lipa_namba_agent: 5000 },
            { min: 1000001, max: 3000000,   send_same: 1875,  send_other: 1875,  withdraw: 8625,  lipa_namba: 12000, lipa_namba_network: 6000, lipa_namba_agent: 6000 },
            { min: 3000001, max: Infinity,   send_same: 2000,  send_other: 2000,  withdraw: 9125,  lipa_namba: 13000, lipa_namba_network: 6000, lipa_namba_agent: 7000 }
        ]
    },
    {
        id: 'airtelmoney',
        name: 'Airtel Money',
        shortName: 'Airtel',
        logo: 'airtelmoney.jpeg',
        color: '#ff0000',
        tiers: [
            { min: 0,       max: 999,       send_same: 10,    send_other: 15,    withdraw: 100,   lipa_namba: 20,    lipa_namba_network: 20,   lipa_namba_agent: 0    },
            { min: 1000,    max: 1999,      send_same: 30,    send_other: 45,    withdraw: 310,   lipa_namba: 150,   lipa_namba_network: 50,   lipa_namba_agent: 100  },
            { min: 2000,    max: 2999,      send_same: 30,    send_other: 45,    withdraw: 410,   lipa_namba: 170,   lipa_namba_network: 70,   lipa_namba_agent: 100  },
            { min: 3000,    max: 3999,      send_same: 50,    send_other: 90,    withdraw: 614,   lipa_namba: 250,   lipa_namba_network: 100,  lipa_namba_agent: 150  },
            { min: 4000,    max: 4999,      send_same: 60,    send_other: 90,    withdraw: 677,   lipa_namba: 400,   lipa_namba_network: 200,  lipa_namba_agent: 200  },
            { min: 5000,    max: 6999,      send_same: 130,   send_other: 180,   withdraw: 1004,  lipa_namba: 800,   lipa_namba_network: 300,  lipa_namba_agent: 500  },
            { min: 7000,    max: 9999,      send_same: 150,   send_other: 180,   withdraw: 1056,  lipa_namba: 1000,  lipa_namba_network: 500,  lipa_namba_agent: 500  },
            { min: 10000,   max: 14999,     send_same: 360,   send_other: 495,   withdraw: 1552,  lipa_namba: 1200,  lipa_namba_network: 700,  lipa_namba_agent: 500  },
            { min: 15000,   max: 19999,     send_same: 360,   send_other: 495,   withdraw: 1645,  lipa_namba: 1550,  lipa_namba_network: 850,  lipa_namba_agent: 700  },
            { min: 20000,   max: 29999,     send_same: 380,   send_other: 540,   withdraw: 2156,  lipa_namba: 1620,  lipa_namba_network: 920,  lipa_namba_agent: 700  },
            { min: 30000,   max: 39999,     send_same: 400,   send_other: 612,   withdraw: 2201,  lipa_namba: 1800,  lipa_namba_network: 1000, lipa_namba_agent: 800  },
            { min: 40000,   max: 49999,     send_same: 410,   send_other: 675,   withdraw: 2769,  lipa_namba: 2000,  lipa_namba_network: 1200, lipa_namba_agent: 800  },
            { min: 50000,   max: 99999,     send_same: 720,   send_other: 1125,  withdraw: 3273,  lipa_namba: 2700,  lipa_namba_network: 1700, lipa_namba_agent: 1000 },
            { min: 100000,  max: 199999,    send_same: 1000,  send_other: 1440,  withdraw: 4357,  lipa_namba: 3500,  lipa_namba_network: 2000, lipa_namba_agent: 1500 },
            { min: 200000,  max: 299999,    send_same: 1200,  send_other: 1710,  withdraw: 6121,  lipa_namba: 4100,  lipa_namba_network: 2600, lipa_namba_agent: 1500 },
            { min: 300000,  max: 399999,    send_same: 1500,  send_other: 2070,  withdraw: 7338,  lipa_namba: 5500,  lipa_namba_network: 3000, lipa_namba_agent: 2500 },
            { min: 400000,  max: 499999,    send_same: 1500,  send_other: 2250,  withdraw: 7982,  lipa_namba: 6300,  lipa_namba_network: 3300, lipa_namba_agent: 3000 },
            { min: 500000,  max: 599999,    send_same: 2200,  send_other: 2880,  withdraw: 8745,  lipa_namba: 7500,  lipa_namba_network: 4500, lipa_namba_agent: 3000 },
            { min: 600000,  max: 699999,    send_same: 3300,  send_other: 3870,  withdraw: 9532,  lipa_namba: 8500,  lipa_namba_network: 5500, lipa_namba_agent: 3000 },
            { min: 700000,  max: 799999,    send_same: 3300,  send_other: 3870,  withdraw: 9700,  lipa_namba: 9700,  lipa_namba_network: 5700, lipa_namba_agent: 4000 },
            { min: 800000,  max: 899999,    send_same: 3500,  send_other: 3870,  withdraw: 9750,  lipa_namba: 10000, lipa_namba_network: 6000, lipa_namba_agent: 4000 },
            { min: 900000,  max: 1000000,   send_same: 3500,  send_other: 5400,  withdraw: 9776,  lipa_namba: 11000, lipa_namba_network: 6000, lipa_namba_agent: 5000 },
            { min: 1000001, max: 3000000,   send_same: 4800,  send_other: 5400,  withdraw: 9875,  lipa_namba: 12000, lipa_namba_network: 6000, lipa_namba_agent: 6000 },
            { min: 3000001, max: Infinity,   send_same: 4800,  send_other: 5400,  withdraw: 12000, lipa_namba: 13000, lipa_namba_network: 6000, lipa_namba_agent: 7000 }
        ]
    },
    {
        id: 'halopesa',
        name: 'HaloPesa',
        shortName: 'HaloPesa',
        logo: 'halopesa.png',
        color: '#00a651',
        tiers: [
            { min: 0,       max: 999,       send_same: 10,    send_other: 10,    withdraw: 10,    lipa_namba: 20,    lipa_namba_network: 20,   lipa_namba_agent: 0    },
            { min: 1000,    max: 1999,      send_same: 25,    send_other: 40,    withdraw: 310,   lipa_namba: 150,   lipa_namba_network: 50,   lipa_namba_agent: 100  },
            { min: 2000,    max: 2999,      send_same: 25,    send_other: 40,    withdraw: 340,   lipa_namba: 170,   lipa_namba_network: 70,   lipa_namba_agent: 100  },
            { min: 3000,    max: 3999,      send_same: 50,    send_other: 80,    withdraw: 454,   lipa_namba: 250,   lipa_namba_network: 100,  lipa_namba_agent: 150  },
            { min: 4000,    max: 4999,      send_same: 60,    send_other: 85,    withdraw: 627,   lipa_namba: 400,   lipa_namba_network: 200,  lipa_namba_agent: 200  },
            { min: 5000,    max: 6999,      send_same: 130,   send_other: 178,   withdraw: 899,   lipa_namba: 800,   lipa_namba_network: 300,  lipa_namba_agent: 500  },
            { min: 7000,    max: 9999,      send_same: 140,   send_other: 180,   withdraw: 956,   lipa_namba: 1000,  lipa_namba_network: 500,  lipa_namba_agent: 500  },
            { min: 10000,   max: 14999,     send_same: 330,   send_other: 480,   withdraw: 1402,  lipa_namba: 1200,  lipa_namba_network: 700,  lipa_namba_agent: 500  },
            { min: 15000,   max: 19999,     send_same: 340,   send_other: 490,   withdraw: 1595,  lipa_namba: 1550,  lipa_namba_network: 850,  lipa_namba_agent: 700  },
            { min: 20000,   max: 29999,     send_same: 360,   send_other: 520,   withdraw: 1956,  lipa_namba: 1620,  lipa_namba_network: 920,  lipa_namba_agent: 700  },
            { min: 30000,   max: 39999,     send_same: 370,   send_other: 600,   withdraw: 2151,  lipa_namba: 1800,  lipa_namba_network: 1000, lipa_namba_agent: 800  },
            { min: 40000,   max: 49999,     send_same: 380,   send_other: 648,   withdraw: 2519,  lipa_namba: 2000,  lipa_namba_network: 1200, lipa_namba_agent: 800  },
            { min: 50000,   max: 99999,     send_same: 580,   send_other: 900,   withdraw: 3073,  lipa_namba: 2700,  lipa_namba_network: 1700, lipa_namba_agent: 1000 },
            { min: 100000,  max: 199999,    send_same: 700,   send_other: 1350,  withdraw: 4007,  lipa_namba: 3500,  lipa_namba_network: 2000, lipa_namba_agent: 1500 },
            { min: 200000,  max: 299999,    send_same: 750,   send_other: 1620,  withdraw: 5321,  lipa_namba: 4100,  lipa_namba_network: 2600, lipa_namba_agent: 1500 },
            { min: 300000,  max: 399999,    send_same: 950,   send_other: 1800,  withdraw: 6338,  lipa_namba: 5500,  lipa_namba_network: 3000, lipa_namba_agent: 2500 },
            { min: 400000,  max: 499999,    send_same: 1200,  send_other: 1980,  withdraw: 6982,  lipa_namba: 6300,  lipa_namba_network: 3300, lipa_namba_agent: 3000 },
            { min: 500000,  max: 599999,    send_same: 1300,  send_other: 2520,  withdraw: 7645,  lipa_namba: 7500,  lipa_namba_network: 4500, lipa_namba_agent: 3000 },
            { min: 600000,  max: 699999,    send_same: 1400,  send_other: 2880,  withdraw: 8532,  lipa_namba: 8500,  lipa_namba_network: 5500, lipa_namba_agent: 3000 },
            { min: 700000,  max: 799999,    send_same: 1400,  send_other: 2880,  withdraw: 8700,  lipa_namba: 9700,  lipa_namba_network: 5700, lipa_namba_agent: 4000 },
            { min: 800000,  max: 899999,    send_same: 1750,  send_other: 3150,  withdraw: 9250,  lipa_namba: 10000, lipa_namba_network: 6000, lipa_namba_agent: 4000 },
            { min: 900000,  max: 1000000,   send_same: 1750,  send_other: 3150,  withdraw: 9276,  lipa_namba: 11000, lipa_namba_network: 6000, lipa_namba_agent: 5000 },
            { min: 1000001, max: 3000000,   send_same: 3000,  send_other: 3600,  withdraw: 9375,  lipa_namba: 12000, lipa_namba_network: 6000, lipa_namba_agent: 6000 },
            { min: 3000001, max: Infinity,   send_same: 3000,  send_other: 4500,  withdraw: 9500,  lipa_namba: 13000, lipa_namba_network: 6000, lipa_namba_agent: 7000 }
        ]
    },
    {
        id: 'yas',
        name: 'Mixx by Yas',
        shortName: 'Mixx by Yas',
        logo: 'yas.png',
        color: '#0039a6',
        tiers: [
            { min: 0,       max: 999,       send_same: 10,    send_other: 15,    withdraw: 0,     lipa_namba: 20,    lipa_namba_network: 20,   lipa_namba_agent: 0    },
            { min: 1000,    max: 1999,      send_same: 30,    send_other: 45,    withdraw: 310,   lipa_namba: 150,   lipa_namba_network: 50,   lipa_namba_agent: 100  },
            { min: 2000,    max: 2999,      send_same: 30,    send_other: 45,    withdraw: 410,   lipa_namba: 170,   lipa_namba_network: 70,   lipa_namba_agent: 100  },
            { min: 3000,    max: 3999,      send_same: 50,    send_other: 90,    withdraw: 614,   lipa_namba: 250,   lipa_namba_network: 100,  lipa_namba_agent: 150  },
            { min: 4000,    max: 4999,      send_same: 60,    send_other: 90,    withdraw: 677,   lipa_namba: 400,   lipa_namba_network: 200,  lipa_namba_agent: 200  },
            { min: 5000,    max: 6999,      send_same: 130,   send_other: 180,   withdraw: 1004,  lipa_namba: 800,   lipa_namba_network: 300,  lipa_namba_agent: 500  },
            { min: 7000,    max: 9999,      send_same: 150,   send_other: 180,   withdraw: 1056,  lipa_namba: 1000,  lipa_namba_network: 500,  lipa_namba_agent: 500  },
            { min: 10000,   max: 14999,     send_same: 360,   send_other: 495,   withdraw: 1552,  lipa_namba: 1200,  lipa_namba_network: 700,  lipa_namba_agent: 500  },
            { min: 15000,   max: 19999,     send_same: 360,   send_other: 495,   withdraw: 1645,  lipa_namba: 1550,  lipa_namba_network: 850,  lipa_namba_agent: 700  },
            { min: 20000,   max: 29999,     send_same: 380,   send_other: 540,   withdraw: 2156,  lipa_namba: 1620,  lipa_namba_network: 920,  lipa_namba_agent: 700  },
            { min: 30000,   max: 39999,     send_same: 400,   send_other: 612,   withdraw: 2201,  lipa_namba: 1800,  lipa_namba_network: 1000, lipa_namba_agent: 800  },
            { min: 40000,   max: 49999,     send_same: 410,   send_other: 675,   withdraw: 2769,  lipa_namba: 2000,  lipa_namba_network: 1200, lipa_namba_agent: 800  },
            { min: 50000,   max: 99999,     send_same: 720,   send_other: 1125,  withdraw: 3273,  lipa_namba: 2700,  lipa_namba_network: 1700, lipa_namba_agent: 1000 },
            { min: 100000,  max: 199999,    send_same: 1000,  send_other: 1440,  withdraw: 4357,  lipa_namba: 3500,  lipa_namba_network: 2000, lipa_namba_agent: 1500 },
            { min: 200000,  max: 299999,    send_same: 1200,  send_other: 1710,  withdraw: 6121,  lipa_namba: 4100,  lipa_namba_network: 2600, lipa_namba_agent: 1500 },
            { min: 300000,  max: 399999,    send_same: 1500,  send_other: 2070,  withdraw: 7338,  lipa_namba: 5500,  lipa_namba_network: 3000, lipa_namba_agent: 2500 },
            { min: 400000,  max: 499999,    send_same: 1500,  send_other: 2250,  withdraw: 7982,  lipa_namba: 6300,  lipa_namba_network: 3300, lipa_namba_agent: 3000 },
            { min: 500000,  max: 599999,    send_same: 2200,  send_other: 2880,  withdraw: 8745,  lipa_namba: 7500,  lipa_namba_network: 4500, lipa_namba_agent: 3000 },
            { min: 600000,  max: 699999,    send_same: 3300,  send_other: 3870,  withdraw: 9532,  lipa_namba: 8500,  lipa_namba_network: 5500, lipa_namba_agent: 3000 },
            { min: 700000,  max: 799999,    send_same: 3300,  send_other: 3870,  withdraw: 9700,  lipa_namba: 9700,  lipa_namba_network: 5700, lipa_namba_agent: 4000 },
            { min: 800000,  max: 899999,    send_same: 3500,  send_other: 3870,  withdraw: 9750,  lipa_namba: 10000, lipa_namba_network: 6000, lipa_namba_agent: 4000 },
            { min: 900000,  max: 1000000,   send_same: 3500,  send_other: 5400,  withdraw: 9776,  lipa_namba: 11000, lipa_namba_network: 6000, lipa_namba_agent: 5000 },
            { min: 1000001, max: 3000000,   send_same: 4800,  send_other: 5400,  withdraw: 9875,  lipa_namba: 12000, lipa_namba_network: 6000, lipa_namba_agent: 6000 },
            { min: 3000001, max: Infinity,   send_same: 4800,  send_other: 5400,  withdraw: 12000, lipa_namba: 13000, lipa_namba_network: 6000, lipa_namba_agent: 7000 }
        ]
    }
];