import { TransportLocation, BusSchedule, TrainSchedule, DeveloperAccessCode, StaffUpdateLog } from '../types';

export const INITIAL_LOCATIONS: TransportLocation[] = [
  {
    id: 'loc-pune-station',
    name: 'Pune Railway Station & Bus Terminal',
    marathiName: 'पुणे रेल्वे स्टेशन आणि बस स्थानक',
    city: 'Pune',
    district: 'Pune',
    type: 'INTERMODAL_HUB',
    division: 'Pune Central Division',
    platformBaysCount: 6,
    capacityPerHr: 1200,
    currentEstimatedDemand: 1380,
    crowdIndex: 115,
    crowdLevel: 'HIGH',
    lastUpdatedTime: new Date(Date.now() - 4 * 60000).toISOString(),
    updatedBy: 'Chief Station Superintendent (Pune)',
    provenance: 'STAFF_UPDATED',
    coordinates: [18.5289, 73.8744],
    nearbyStationIds: ['loc-shivajinagar', 'loc-swargate'],
    currentBusesAvailable: 14,
    currentTrainsAvailable: 8,
    estimatedWaitTimeMin: 18,
    serviceStatus: 'HEAVY_RUSH',
    manualOverrideReason: 'Evening commuter peak + Vande Bharat & Deccan Queen turnaround boarding rush',
    activeAnnouncements: [
      'Platform 1: Deccan Queen boarding in progress. Maintain queue at Foot Overbridge 2.',
      'Special MSRTC Shivneri feeder buses to Hinjewadi & Swargate operational every 10 mins from Portico.'
    ]
  },
  {
    id: 'loc-swargate',
    name: 'Swargate MSRTC Central Bus Station',
    marathiName: 'स्वारगेट मध्यवर्ती बस स्थानक',
    city: 'Pune',
    district: 'Pune',
    type: 'BUS_STAND',
    division: 'MSRTC Pune Division',
    platformBaysCount: 18,
    capacityPerHr: 950,
    currentEstimatedDemand: 1280,
    crowdIndex: 135,
    crowdLevel: 'VERY_HIGH',
    lastUpdatedTime: new Date(Date.now() - 2 * 60000).toISOString(),
    updatedBy: 'Depot Manager - Swargate',
    provenance: 'STAFF_UPDATED',
    coordinates: [18.5018, 73.8586],
    nearbyStationIds: ['loc-pune-station', 'loc-shivajinagar'],
    currentBusesAvailable: 22,
    currentTrainsAvailable: 0,
    estimatedWaitTimeMin: 35,
    serviceStatus: 'HEAVY_RUSH',
    manualOverrideReason: 'Weekend exodus rush towards Satara, Kolhapur, Solapur and Konkan ghat routes',
    activeAnnouncements: [
      'High passenger buildup in Bays 4 to 8. Extra semi-luxury buses dispatched from Katraj depot.',
      'QR Code paperless booking enabled at counters 3 and 7 to alleviate ticketing congestion.'
    ]
  },
  {
    id: 'loc-shivajinagar',
    name: 'Shivajinagar Bus Stand & Rail Station',
    marathiName: 'शिवाजीनगर बस आणि रेल्वे स्थानक',
    city: 'Pune',
    district: 'Pune',
    type: 'INTERMODAL_HUB',
    division: 'Pune North & MSRTC',
    platformBaysCount: 12,
    capacityPerHr: 800,
    currentEstimatedDemand: 560,
    crowdIndex: 70,
    crowdLevel: 'MODERATE',
    lastUpdatedTime: new Date(Date.now() - 12 * 60000).toISOString(),
    updatedBy: 'Automated Passenger Counter Sensors (Gate 1-4)',
    provenance: 'LIVE_API',
    coordinates: [18.5314, 73.8446],
    nearbyStationIds: ['loc-pune-station', 'loc-swargate'],
    currentBusesAvailable: 16,
    currentTrainsAvailable: 4,
    estimatedWaitTimeMin: 12,
    serviceStatus: 'NORMAL',
    activeAnnouncements: [
      'Pune Metro Line 1 & Line 3 interchange walking skywalk fully functional with clear signage.'
    ]
  },
  {
    id: 'loc-csmt-mumbai',
    name: 'Chhatrapati Shivaji Maharaj Terminus (CSMT)',
    marathiName: 'छत्रपती शिवाजी महाराज टर्मिनस (मुंबई)',
    city: 'Mumbai',
    district: 'Mumbai City',
    type: 'RAILWAY_STATION',
    division: 'Central Railway Mumbai Division',
    platformBaysCount: 18,
    capacityPerHr: 3500,
    currentEstimatedDemand: 3150,
    crowdIndex: 90,
    crowdLevel: 'HIGH',
    lastUpdatedTime: new Date(Date.now() - 6 * 60000).toISOString(),
    updatedBy: 'CR Operations Control Center (Mumbai)',
    provenance: 'LIVE_API',
    coordinates: [18.9401, 72.8355],
    nearbyStationIds: ['loc-dadar'],
    currentBusesAvailable: 28,
    currentTrainsAvailable: 16,
    estimatedWaitTimeMin: 8,
    serviceStatus: 'NORMAL',
    activeAnnouncements: [
      'Suburban slow and fast locals running on normal 3-minute schedule on Central Line.',
      'Vande Bharat Exp (22225) to Solapur ready on PF 14 for boarding.'
    ]
  },
  {
    id: 'loc-dadar',
    name: 'Dadar Intermodal Terminal (CR / WR & Asiad Stand)',
    marathiName: 'दादर मध्यवर्ती जंक्शन आणि बस स्थानक',
    city: 'Mumbai',
    district: 'Mumbai Suburban',
    type: 'INTERMODAL_HUB',
    division: 'Mumbai Intermodal Division',
    platformBaysCount: 22,
    capacityPerHr: 4200,
    currentEstimatedDemand: 5460,
    crowdIndex: 130,
    crowdLevel: 'VERY_HIGH',
    lastUpdatedTime: new Date(Date.now() - 1 * 60000).toISOString(),
    updatedBy: 'Station Master (Dadar Junction)',
    provenance: 'STAFF_UPDATED',
    coordinates: [19.0178, 72.8478],
    nearbyStationIds: ['loc-csmt-mumbai', 'loc-thane'],
    currentBusesAvailable: 19,
    currentTrainsAvailable: 24,
    estimatedWaitTimeMin: 25,
    serviceStatus: 'HEAVY_RUSH',
    manualOverrideReason: 'Evening crossover interchange between Western and Central railway lines + Pune Asiad rush',
    activeAnnouncements: [
      'Overcrowding advisory: Use newly widened North Overbridge to transfer between WR and CR platforms.',
      'Dadar to Pune Shivneri departures departing from Senapati Bapat Marg bay.'
    ]
  },
  {
    id: 'loc-thane',
    name: 'Thane Railway Junction & CIDCO Bus Terminal',
    marathiName: 'ठाणे रेल्वे जंक्शन आणि सिडको बस स्थानक',
    city: 'Thane',
    district: 'Thane',
    type: 'INTERMODAL_HUB',
    division: 'Central Railway & TMT',
    platformBaysCount: 14,
    capacityPerHr: 2800,
    currentEstimatedDemand: 2240,
    crowdIndex: 80,
    crowdLevel: 'MODERATE',
    lastUpdatedTime: new Date(Date.now() - 15 * 60000).toISOString(),
    updatedBy: 'Thane Traffic & Transit Desk',
    provenance: 'STAFF_UPDATED',
    coordinates: [19.1860, 72.9759],
    nearbyStationIds: ['loc-dadar'],
    currentBusesAvailable: 31,
    currentTrainsAvailable: 18,
    estimatedWaitTimeMin: 10,
    serviceStatus: 'NORMAL',
    activeAnnouncements: [
      'Trans-harbour line trains to Navi Mumbai & Panvel operating at 5 min intervals.'
    ]
  },
  {
    id: 'loc-nagpur-central',
    name: 'Nagpur Central Railway Station & Mor Bhavan Stand',
    marathiName: 'नागपूर मध्यवर्ती रेल्वे स्टेशन आणि मोरभवन बस स्थानक',
    city: 'Nagpur',
    district: 'Nagpur',
    type: 'INTERMODAL_HUB',
    division: 'Nagpur SECR / CR & MSRTC',
    platformBaysCount: 10,
    capacityPerHr: 1500,
    currentEstimatedDemand: 600,
    crowdIndex: 40,
    crowdLevel: 'LOW',
    lastUpdatedTime: new Date(Date.now() - 8 * 60000).toISOString(),
    updatedBy: 'SECR Nagpur Control Panel',
    provenance: 'LIVE_API',
    coordinates: [21.1524, 79.0888],
    nearbyStationIds: [],
    currentBusesAvailable: 24,
    currentTrainsAvailable: 12,
    estimatedWaitTimeMin: 6,
    serviceStatus: 'NORMAL',
    activeAnnouncements: [
      'Nagpur Metro interchange available directly at West Gate subway.',
      'Vidarbha Express to CSMT on schedule for 17:00 departure.'
    ]
  },
  {
    id: 'loc-nashik-cbs',
    name: 'Nashik CBS (Central Bus Stand) & Road Station',
    marathiName: 'नाशिक सीबीएस बस स्थानक आणि रेल्वे स्टेशन',
    city: 'Nashik',
    district: 'Nashik',
    type: 'BUS_STAND',
    division: 'MSRTC Nashik Division',
    platformBaysCount: 16,
    capacityPerHr: 900,
    currentEstimatedDemand: 630,
    crowdIndex: 70,
    crowdLevel: 'MODERATE',
    lastUpdatedTime: new Date(Date.now() - 20 * 60000).toISOString(),
    updatedBy: 'Nashik Divisional Controller',
    provenance: 'STAFF_UPDATED',
    coordinates: [19.9975, 73.7898],
    nearbyStationIds: [],
    currentBusesAvailable: 20,
    currentTrainsAvailable: 5,
    estimatedWaitTimeMin: 14,
    serviceStatus: 'NORMAL',
    activeAnnouncements: [
      'Panchavati Express and Mumbai AC Superfast connectivity regular via Nashik Road.'
    ]
  },
  {
    id: 'loc-aurangabad',
    name: 'Chhatrapati Sambhajinagar (Aurangabad) Central',
    marathiName: 'छत्रपती संभाजीनगर मध्यवर्ती स्थानक',
    city: 'Chhatrapati Sambhajinagar',
    district: 'Chhatrapati Sambhajinagar',
    type: 'INTERMODAL_HUB',
    division: 'Marathwada MSRTC & SCR',
    platformBaysCount: 14,
    capacityPerHr: 850,
    currentEstimatedDemand: 380,
    crowdIndex: 45,
    crowdLevel: 'LOW',
    lastUpdatedTime: new Date(Date.now() - 25 * 60000).toISOString(),
    updatedBy: 'SCR Station Superintendent',
    provenance: 'LIVE_API',
    coordinates: [19.8762, 75.3433],
    nearbyStationIds: [],
    currentBusesAvailable: 15,
    currentTrainsAvailable: 6,
    estimatedWaitTimeMin: 8,
    serviceStatus: 'NORMAL',
    activeAnnouncements: [
      'Jalna-Mumbai Vande Bharat Express halts at PF 1. Ticket counters clear.'
    ]
  },
  {
    id: 'loc-kolhapur-cbs',
    name: 'Kolhapur Central Bus Stand (CBS) & Mahalaxmi Terminus',
    marathiName: 'कोल्हापूर मध्यवर्ती बस स्थानक आणि महालक्ष्मी टर्मिनस',
    city: 'Kolhapur',
    district: 'Kolhapur',
    type: 'INTERMODAL_HUB',
    division: 'Kolhapur Division MSRTC & CR',
    platformBaysCount: 15,
    capacityPerHr: 750,
    currentEstimatedDemand: 675,
    crowdIndex: 90,
    crowdLevel: 'HIGH',
    lastUpdatedTime: new Date(Date.now() - 5 * 60000).toISOString(),
    updatedBy: 'Depot Manager - Kolhapur CBS',
    provenance: 'STAFF_UPDATED',
    coordinates: [16.7050, 74.2433],
    nearbyStationIds: [],
    currentBusesAvailable: 18,
    currentTrainsAvailable: 3,
    estimatedWaitTimeMin: 22,
    serviceStatus: 'HEAVY_RUSH',
    manualOverrideReason: 'Pilgrim influx for Mahalaxmi Temple darshan and weekend Pune-bound return flow',
    activeAnnouncements: [
      'Special electric E-Shivai buses to Pune Swargate departing every 20 minutes from Bay 1.'
    ]
  }
];

// Waypoint coordinates for moving GPS vehicles along Maharashtra transit corridors
const ROUTE_PUNE_MUMBAI_BUS: [number, number][] = [
  [18.5018, 73.8586], // Swargate
  [18.5314, 73.8446], // Shivajinagar
  [18.5808, 73.7997], // Wakad Flyover
  [18.7557, 73.4091], // Lonavala / Khandala Ghat
  [18.9894, 73.1175], // Panvel Expressway Gate
  [19.0330, 73.0297], // Vashi Toll Plaza
  [19.0178, 72.8478], // Dadar Asiad Stand
  [18.9401, 72.8355]  // CSMT / Fort
];

const ROUTE_PUNE_NASHIK_BUS: [number, number][] = [
  [18.5314, 73.8446], // Shivajinagar
  [18.6298, 73.8131], // Bhosari / Chakan
  [18.8682, 73.9171], // Manchar
  [19.2483, 73.9482], // Narayangaon / Sangamner
  [19.6740, 73.7780], // Sinnar
  [19.9975, 73.7898]  // Nashik CBS
];

const ROUTE_PUNE_SOLAPUR_BUS: [number, number][] = [
  [18.5018, 73.8586], // Swargate
  [18.4988, 73.9582], // Hadapsar
  [18.4239, 74.5772], // Daund bypass
  [18.1780, 75.0315], // Indapur
  [17.6599, 75.9064]  // Solapur CBS
];

const ROUTE_CR_MUMBAI_PUNE_TRAIN: [number, number][] = [
  [18.9401, 72.8355], // CSMT
  [19.0178, 72.8478], // Dadar
  [19.1860, 72.9759], // Thane
  [19.2437, 73.1355], // Kalyan
  [19.0707, 73.2872], // Karjat
  [18.7557, 73.4091], // Lonavala Ghat
  [18.5314, 73.8446], // Shivajinagar
  [18.5289, 73.8744]  // Pune Central Station
];

const ROUTE_CR_PUNE_SOLAPUR_TRAIN: [number, number][] = [
  [18.5289, 73.8744], // Pune Station
  [18.4630, 74.5780], // Daund Junction
  [17.9780, 75.3210], // Kurduvadi Junction
  [17.6599, 75.9064]  // Solapur Central
];

export const INITIAL_BUSES: BusSchedule[] = [
  {
    id: 'bus-shivneri-101',
    busNumber: 'MH-14-BT-3091',
    serviceName: 'MSRTC Shivneri AC (Volvo B11R)',
    source: 'Swargate, Pune',
    destination: 'Dadar Asiad, Mumbai',
    viaRoutes: ['Shivajinagar', 'Wakad', 'Lonavala', 'Vashi'],
    departureTime: '14:30',
    expectedDeparture: '14:30',
    platformBay: 'Bay 3',
    status: 'RUNNING' as any,
    delayMinutes: 0,
    occupancyPercent: 92,
    currentCoords: [18.7557, 73.4091], // Currently at Lonavala
    speedKmH: 78,
    heading: 310,
    provenance: 'LIVE_API',
    routeCoordinates: ROUTE_PUNE_MUMBAI_BUS,
    currentRouteIndex: 3,
    routeProgress: 0.45,
    externalSyncId: 'MSRTC-PUN-MUM-7721'
  },
  {
    id: 'bus-lalpari-204',
    busNumber: 'MH-12-RN-8840',
    serviceName: 'MSRTC Lal Pari (Ordinary Express)',
    source: 'Swargate, Pune',
    destination: 'Kolhapur CBS',
    viaRoutes: ['Shirwal', 'Satara', 'Karad'],
    departureTime: '14:45',
    expectedDeparture: '14:55',
    platformBay: 'Bay 7',
    status: 'BOARDING',
    delayMinutes: 10,
    occupancyPercent: 98,
    currentCoords: [18.5018, 73.8586],
    speedKmH: 0,
    heading: 180,
    provenance: 'STAFF_UPDATED',
    routeCoordinates: [[18.5018, 73.8586], [17.6805, 73.9935], [16.7050, 74.2433]],
    currentRouteIndex: 0,
    routeProgress: 0.05,
    externalSyncId: 'MSRTC-SWG-KOL-1102'
  },
  {
    id: 'bus-eshivai-305',
    busNumber: 'MH-20-EV-4412',
    serviceName: 'E-Shivai Electric AC (Zero Emission)',
    source: 'Shivajinagar, Pune',
    destination: 'Nashik CBS',
    viaRoutes: ['Chakan', 'Manchar', 'Sangamner', 'Sinnar'],
    departureTime: '15:15',
    expectedDeparture: '15:15',
    platformBay: 'Bay 2',
    status: 'ON_TIME',
    delayMinutes: 0,
    occupancyPercent: 65,
    currentCoords: [18.8682, 73.9171],
    speedKmH: 64,
    heading: 10,
    provenance: 'LIVE_API',
    routeCoordinates: ROUTE_PUNE_NASHIK_BUS,
    currentRouteIndex: 2,
    routeProgress: 0.35,
    externalSyncId: 'MSRTC-PUN-NSK-4401'
  },
  {
    id: 'bus-asiad-408',
    busNumber: 'MH-13-CU-1904',
    serviceName: 'MSRTC Hirkani (Semi-Luxury Asiad)',
    source: 'Swargate, Pune',
    destination: 'Solapur Central',
    viaRoutes: ['Hadapsar', 'Daund Bypass', 'Indapur'],
    departureTime: '15:30',
    expectedDeparture: '15:45',
    platformBay: 'Bay 11',
    status: 'DELAYED',
    delayMinutes: 15,
    occupancyPercent: 88,
    currentCoords: [18.4988, 73.9582],
    speedKmH: 45,
    heading: 120,
    provenance: 'STAFF_UPDATED',
    routeCoordinates: ROUTE_PUNE_SOLAPUR_BUS,
    currentRouteIndex: 1,
    routeProgress: 0.18,
    externalSyncId: 'MSRTC-SWG-SOL-9930'
  },
  {
    id: 'bus-best-501',
    busNumber: 'MH-01-DR-6120',
    serviceName: 'BEST AC Fast Bus (Express Corridor)',
    source: 'CSMT Mumbai',
    destination: 'Thane Central',
    viaRoutes: ['Dadar TT', 'Sion', 'Ghatkopar', 'Mulund'],
    departureTime: '14:50',
    expectedDeparture: '14:50',
    platformBay: 'Bay A1',
    status: 'RUNNING' as any,
    delayMinutes: 0,
    occupancyPercent: 84,
    currentCoords: [19.0500, 72.8800],
    speedKmH: 38,
    heading: 35,
    provenance: 'LIVE_API',
    routeCoordinates: [[18.9401, 72.8355], [19.0178, 72.8478], [19.0600, 72.8600], [19.1860, 72.9759]],
    currentRouteIndex: 2,
    routeProgress: 0.55,
    externalSyncId: 'BEST-CSMT-THN-501'
  }
];

export const INITIAL_TRAINS: TrainSchedule[] = [
  {
    id: 'train-vb-22225',
    trainNumber: '22225 / 22226',
    trainName: 'Mumbai CSMT - Solapur Vande Bharat Express',
    trainType: 'Vande Bharat',
    source: 'Mumbai CSMT (16:05)',
    destination: 'Solapur Jn (22:40)',
    currentStation: 'Dadar Central',
    nextStation: 'Thane Jn (16:33)',
    scheduledArrival: '16:15',
    expectedArrival: '16:15',
    scheduledDeparture: '16:17',
    delayMinutes: 0,
    platform: 'Platform 4',
    status: 'RUNNING',
    crowdScoreByCategory: {
      general: 'MODERATE',
      sleeper: 'LOW',
      ac: 'HIGH'
    },
    currentCoords: [19.0178, 72.8478],
    speedKmH: 105,
    provenance: 'LIVE_API',
    routeCoordinates: ROUTE_CR_MUMBAI_PUNE_TRAIN,
    currentRouteIndex: 1,
    externalSyncId: 'IRCTC-CR-22225-VB'
  },
  {
    id: 'train-dq-12124',
    trainNumber: '12124',
    trainName: 'Deccan Queen Superfast Express',
    trainType: 'Superfast',
    source: 'Pune Jn (07:15)',
    destination: 'Mumbai CSMT (10:25)',
    currentStation: 'Lonavala',
    nextStation: 'Karjat Jn',
    scheduledArrival: '08:20',
    expectedArrival: '08:26',
    scheduledDeparture: '08:28',
    delayMinutes: 6,
    platform: 'Platform 2',
    status: 'RUNNING',
    crowdScoreByCategory: {
      general: 'VERY_HIGH',
      sleeper: 'HIGH',
      ac: 'HIGH'
    },
    currentCoords: [18.7557, 73.4091],
    speedKmH: 72,
    provenance: 'STAFF_UPDATED',
    routeCoordinates: ROUTE_CR_MUMBAI_PUNE_TRAIN,
    currentRouteIndex: 5,
    externalSyncId: 'IRCTC-CR-12124-DQ'
  },
  {
    id: 'train-sinhagad-11010',
    trainNumber: '11010',
    trainName: 'Sinhagad Express',
    trainType: 'Express',
    source: 'Pune Jn (06:05)',
    destination: 'Mumbai CSMT (09:55)',
    currentStation: 'Kalyan Jn',
    nextStation: 'Thane Jn',
    scheduledArrival: '09:05',
    expectedArrival: '09:17',
    scheduledDeparture: '09:19',
    delayMinutes: 12,
    platform: 'Platform 5',
    status: 'DELAYED',
    crowdScoreByCategory: {
      general: 'VERY_HIGH',
      sleeper: 'HIGH',
      ac: 'MODERATE'
    },
    currentCoords: [19.2437, 73.1355],
    speedKmH: 55,
    provenance: 'LIVE_API',
    routeCoordinates: ROUTE_CR_MUMBAI_PUNE_TRAIN,
    currentRouteIndex: 3,
    externalSyncId: 'IRCTC-CR-11010-SINH'
  },
  {
    id: 'train-local-97089',
    trainNumber: 'CR-LOCAL-97089',
    trainName: 'CSMT - Kalyan Fast 15-Car AC Suburban Local',
    trainType: 'Suburban Local',
    source: 'Mumbai CSMT',
    destination: 'Kalyan Jn',
    currentStation: 'Kurla Jn',
    nextStation: 'Ghatkopar',
    scheduledArrival: '14:42',
    expectedArrival: '14:42',
    scheduledDeparture: '14:43',
    delayMinutes: 0,
    platform: 'Platform 1',
    status: 'RUNNING',
    crowdScoreByCategory: {
      general: 'VERY_HIGH',
      sleeper: 'LOW',
      ac: 'VERY_HIGH'
    },
    currentCoords: [19.0650, 72.8800],
    speedKmH: 82,
    provenance: 'LIVE_API',
    routeCoordinates: [[18.9401, 72.8355], [19.0178, 72.8478], [19.0650, 72.8800], [19.1860, 72.9759], [19.2437, 73.1355]],
    currentRouteIndex: 2,
    externalSyncId: 'CR-MUM-SUB-97089'
  },
  {
    id: 'train-vb-20705',
    trainNumber: '20705 / 20706',
    trainName: 'Mumbai CSMT - Jalna Vande Bharat Express',
    trainType: 'Vande Bharat',
    source: 'Mumbai CSMT (13:10)',
    destination: 'Jalna (20:30)',
    currentStation: 'Nashik Road',
    nextStation: 'Manmad Jn',
    scheduledArrival: '16:40',
    expectedArrival: '16:40',
    scheduledDeparture: '16:42',
    delayMinutes: 0,
    platform: 'Platform 1',
    status: 'RUNNING',
    crowdScoreByCategory: {
      general: 'MODERATE',
      sleeper: 'LOW',
      ac: 'HIGH'
    },
    currentCoords: [19.9500, 73.8300],
    speedKmH: 110,
    provenance: 'LIVE_API',
    routeCoordinates: [[18.9401, 72.8355], [19.1860, 72.9759], [19.9500, 73.8300], [20.2500, 74.4400], [19.8762, 75.3433]],
    currentRouteIndex: 2,
    externalSyncId: 'IRCTC-CR-20705-VB'
  }
];

export const INITIAL_STAFF_LOGS: StaffUpdateLog[] = [
  {
    id: 'log-101',
    locationId: 'loc-swargate',
    locationName: 'Swargate MSRTC Central Bus Station',
    staffId: 'STF-PUN-8821',
    staffName: 'Ramesh K. Shinde (Depot Head)',
    crowdLevel: 'VERY_HIGH',
    crowdIndex: 135,
    busesAvailable: 22,
    trainsAvailable: 0,
    waitTimeMinutes: 35,
    overrideReason: 'Severe passenger buildup on Satara/Kolhapur platforms. Extra 8 buses called from reserve depot.',
    announcement: 'Special express shuttle buses deployed for Satara and Karad passengers from Platform 7.',
    timestamp: new Date(Date.now() - 2 * 60000).toISOString(),
    provenance: 'STAFF_UPDATED'
  },
  {
    id: 'log-102',
    locationId: 'loc-pune-station',
    locationName: 'Pune Railway Station & Bus Terminal',
    staffId: 'STF-RLY-4409',
    staffName: 'Sanjay V. Patil (Station Supt.)',
    crowdLevel: 'HIGH',
    crowdIndex: 115,
    busesAvailable: 14,
    trainsAvailable: 8,
    waitTimeMinutes: 18,
    overrideReason: 'Vande Bharat and Intercity evening turnaround surge on Platforms 1 & 3.',
    announcement: 'Queue managers deployed at FOB 2 and Main Concourse ticket gates.',
    timestamp: new Date(Date.now() - 4 * 60000).toISOString(),
    provenance: 'STAFF_UPDATED'
  },
  {
    id: 'log-103',
    locationId: 'loc-dadar',
    locationName: 'Dadar Intermodal Terminal',
    staffId: 'STF-CR-9011',
    staffName: 'Pooja Deshmukh (Transit Officer)',
    crowdLevel: 'VERY_HIGH',
    crowdIndex: 130,
    busesAvailable: 19,
    trainsAvailable: 24,
    waitTimeMinutes: 25,
    overrideReason: 'Peak commuter interchange rush between WR and CR + long-distance train boarding.',
    timestamp: new Date(Date.now() - 1 * 60000).toISOString(),
    provenance: 'STAFF_UPDATED'
  }
];

export const AUTHORIZED_DEVELOPER_EMAILS = [
  'venomx2424@gmail.com',
  'visionx2425@gmail.com',
  'developer@mahaflow.gov.in'
];

export const INITIAL_DEVELOPER_CODES: DeveloperAccessCode[] = [
  {
    id: 'code-admin-master',
    code: 'MAHA-ADMIN-2025',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    createdBy: 'System Root Developer',
    isActive: true,
    roleToGrant: 'staff',
    description: 'Official Maharashtra Transport Admin Staff Elevation Key',
    redeemedCount: 2,
    redeemedBy: [
      {
        name: 'Ramesh K. Shinde',
        email: 'ramesh.shinde@msrtc.gov.in',
        phone: '+91 98220 11234',
        redeemedAt: new Date(Date.now() - 12000000).toISOString(),
        roleGranted: 'staff'
      },
      {
        name: 'Sanjay V. Patil',
        email: 'sanjay.patil@cr.railnet.gov.in',
        phone: '+91 94230 55678',
        redeemedAt: new Date(Date.now() - 6000000).toISOString(),
        roleGranted: 'staff'
      }
    ]
  },
  {
    id: 'code-staff-pune',
    code: 'STAFF-PUNE-108',
    createdAt: new Date(Date.now() - 43200000).toISOString(),
    createdBy: 'MahaFlow Control',
    isActive: true,
    roleToGrant: 'staff',
    description: 'Pune & Swargate Division Admin Staff Access Key',
    redeemedCount: 1,
    redeemedBy: [
      {
        name: 'Depot Duty Officer Pune',
        email: 'duty.pune@msrtc.maharashtra.gov.in',
        phone: '+91 98230 44321',
        redeemedAt: new Date(Date.now() - 18000000).toISOString(),
        roleGranted: 'staff'
      }
    ]
  },
  {
    id: 'code-admin-hq',
    code: 'ADMIN-HQ-2026',
    createdAt: new Date(Date.now() - 43200000).toISOString(),
    createdBy: 'MahaFlow HQ',
    isActive: true,
    roleToGrant: 'staff',
    description: 'State Transport Central HQ Admin Staff Key',
    redeemedCount: 0,
    redeemedBy: []
  },
  {
    id: 'code-dev-override',
    code: 'DEV-MASTER-999',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    createdBy: 'System Architect',
    isActive: true,
    roleToGrant: 'developer',
    description: 'Full Developer Bypass & System Maintenance Control Key',
    redeemedCount: 3,
    redeemedBy: [
      {
        name: 'VisionX Developer',
        email: 'visionx2425@gmail.com',
        phone: '+91 98810 99887',
        redeemedAt: new Date(Date.now() - 120000).toISOString(),
        roleGranted: 'developer'
      },
      {
        name: 'VenomX Developer',
        email: 'venomx2424@gmail.com',
        phone: '+91 98220 54321',
        redeemedAt: new Date(Date.now() - 60000).toISOString(),
        roleGranted: 'developer'
      },
      {
        name: 'Lead Developer',
        email: 'developer@mahaflow.gov.in',
        phone: '+91 99000 00000',
        redeemedAt: new Date(Date.now() - 50000000).toISOString(),
        roleGranted: 'developer'
      }
    ]
  }
];

export function calculateCrowdIndex(estimatedDemand: number, capacityPerHr: number): {
  index: number;
  level: 'LOW' | 'MODERATE' | 'HIGH' | 'VERY_HIGH';
} {
  const safeCapacity = capacityPerHr > 0 ? capacityPerHr : 100;
  const index = Math.round((estimatedDemand / safeCapacity) * 100);
  
  let level: 'LOW' | 'MODERATE' | 'HIGH' | 'VERY_HIGH';
  if (index <= 50) {
    level = 'LOW';
  } else if (index <= 80) {
    level = 'MODERATE';
  } else if (index <= 120) {
    level = 'HIGH';
  } else {
    level = 'VERY_HIGH';
  }

  return { index, level };
}

export function generateCrowdPrediction(location: TransportLocation): {
  plus30: { demand: number; index: number; level: 'LOW' | 'MODERATE' | 'HIGH' | 'VERY_HIGH'; factor: string };
  plus60: { demand: number; index: number; level: 'LOW' | 'MODERATE' | 'HIGH' | 'VERY_HIGH'; factor: string };
} {
  const currentHour = new Date().getHours();
  // Commuter surge peaks in Maharashtra: 08:30-11:00 and 17:00-20:30
  const isEveningRush = currentHour >= 16 && currentHour <= 20;
  const isMorningRush = currentHour >= 8 && currentHour <= 11;
  
  let factor30 = 'Normal schedule transition & passenger turnover';
  let factor60 = 'Historical transit pattern convergence';
  
  let delta30 = 0.08;
  let delta60 = 0.15;
  
  if (isEveningRush) {
    delta30 = 0.18;
    delta60 = 0.28;
    factor30 = 'Approaching peak office-dispersal & suburban train arrival surges';
    factor60 = 'Peak intercity departure window for MSRTC Shivneri and Express trains';
  } else if (isMorningRush) {
    delta30 = 0.12;
    delta60 = 0.22;
    factor30 = 'Inflow from incoming long-distance morning expresses';
    factor60 = 'Suburban connection rush towards commercial hubs';
  } else {
    delta30 = -0.05;
    delta60 = -0.12;
    factor30 = 'Off-peak dispersal cycle with steady feeder bus arrivals';
    factor60 = 'Reduced passenger influx before evening commute cycle';
  }

  const demand30 = Math.max(100, Math.round(location.currentEstimatedDemand * (1 + delta30)));
  const demand60 = Math.max(100, Math.round(location.currentEstimatedDemand * (1 + delta60)));

  const p30 = calculateCrowdIndex(demand30, location.capacityPerHr);
  const p60 = calculateCrowdIndex(demand60, location.capacityPerHr);

  return {
    plus30: { demand: demand30, index: p30.index, level: p30.level, factor: factor30 },
    plus60: { demand: demand60, index: p60.index, level: p60.level, factor: factor60 }
  };
}
