export type UserRole = 'user' | 'staff' | 'developer';

export type DataProvenance = 'LIVE_API' | 'STAFF_UPDATED';

export type CrowdLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'VERY_HIGH';

export type LocationType = 'RAILWAY_STATION' | 'BUS_STAND' | 'INTERMODAL_HUB';

export interface TransportLocation {
  id: string;
  name: string;
  marathiName?: string;
  city: string;
  district: string;
  type: LocationType;
  division: string;
  platformBaysCount: number;
  capacityPerHr: number;
  currentEstimatedDemand: number;
  crowdIndex: number; // Demand / Capacity * 100
  crowdLevel: CrowdLevel;
  manualOverrideReason?: string;
  lastUpdatedTime: string;
  updatedBy: string;
  provenance: DataProvenance;
  coordinates: [number, number]; // [lat, lng]
  nearbyStationIds: string[];
  currentBusesAvailable: number;
  currentTrainsAvailable: number;
  estimatedWaitTimeMin: number;
  serviceStatus: 'NORMAL' | 'DELAYED' | 'HEAVY_RUSH' | 'DISRUPTED';
  activeAnnouncements: string[];
}

export interface BusSchedule {
  id: string;
  busNumber: string;
  serviceName: string; // 'Shivneri AC' | 'Lal Pari' | 'Hirkani Asiad' | 'E-Shivai' | 'PMPML/BEST Express'
  source: string;
  destination: string;
  viaRoutes: string[];
  departureTime: string;
  expectedDeparture: string;
  platformBay: string;
  status: 'ON_TIME' | 'BOARDING' | 'DELAYED' | 'ARRIVING' | 'DEPARTED';
  delayMinutes: number;
  occupancyPercent: number;
  currentCoords: [number, number];
  speedKmH: number;
  heading: number; // degrees
  provenance: DataProvenance;
  routeCoordinates: [number, number][];
  currentRouteIndex: number;
  routeProgress: number; // 0 to 1
  externalSyncId: string;
}

export interface TrainSchedule {
  id: string;
  trainNumber: string;
  trainName: string;
  trainType: 'Vande Bharat' | 'Superfast' | 'Suburban Local' | 'Express' | 'Intercity';
  source: string;
  destination: string;
  currentStation: string;
  nextStation: string;
  scheduledArrival: string;
  expectedArrival: string;
  scheduledDeparture: string;
  delayMinutes: number;
  platform: string;
  status: 'ON_TIME' | 'DELAYED' | 'ARRIVING' | 'HALTED' | 'RUNNING';
  crowdScoreByCategory: {
    general: CrowdLevel;
    sleeper: CrowdLevel;
    ac: CrowdLevel;
  };
  currentCoords: [number, number];
  speedKmH: number;
  provenance: DataProvenance;
  routeCoordinates: [number, number][];
  currentRouteIndex: number;
  externalSyncId: string;
}

export interface StaffUpdateLog {
  id: string;
  locationId: string;
  locationName: string;
  staffId: string;
  staffName: string;
  crowdLevel: CrowdLevel;
  crowdIndex: number;
  busesAvailable: number;
  trainsAvailable: number;
  waitTimeMinutes: number;
  overrideReason: string;
  announcement?: string;
  timestamp: string;
  provenance: DataProvenance;
}

export interface RedeemedUser {
  name: string;
  email: string;
  phone: string;
  redeemedAt: string;
  roleGranted: UserRole;
}

export interface DeveloperAccessCode {
  id: string;
  code: string;
  createdAt: string;
  createdBy: string;
  isActive: boolean;
  roleToGrant: UserRole;
  description: string;
  redeemedCount: number;
  redeemedBy: RedeemedUser[];
}

export interface UserProfile {
  email: string;
  name: string;
  phone: string;
  avatarUrl: string;
  role: UserRole;
  assignedLocationId?: string;
  isGoogleAuthed: boolean;
  joinedViaCode?: string;
  registeredAt: string;
}

export interface DeveloperSettings {
  isMaintenanceMode: boolean;
  maintenanceReason: string;
  appName: string;
  appLogoUrl: string;
  currentDataSource: 'STAFF_HYBRID' | 'LIVE_API_READY';
  externalSyncEnabled: boolean;
  lastExternalSyncTime: string;
  autoCrowdDecay: boolean;
}

export interface CrowdPrediction {
  locationId: string;
  timeHorizon: '+30m' | '+1h';
  predictedDemand: number;
  predictedCapacity: number;
  predictedCrowdIndex: number;
  predictedCrowdLevel: CrowdLevel;
  confidenceScore: number;
  primaryFactor: string;
  factors: string[];
}
