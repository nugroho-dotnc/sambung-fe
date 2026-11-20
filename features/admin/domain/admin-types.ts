/**
 * Domain types for Admin & Governance Panel (Fase 4).
 */

export interface PriceObservationRecord {
  id: string;
  province: string;
  commodity: string;
  price: number;
  unit: string;
  source: string;
  period: string;
  status: "Valid" | "Ditolak" | "Anomali" | "Duplikat";
  reason?: string;
}

export interface SystemParameters {
  orderExpiryHours: number;
  fairPriceToleranceDelta: number; // e.g. 0.03 (3%)
  rendemenGKP: number; // e.g. 0.5338 (53.38%)
  rendemenGKG: number; // e.g. 0.63 (63%)
  governmentFloorPriceGKP: number; // HPP, e.g. 6000
  lastUpdated: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorRole: "admin" | "petani" | "pembeli" | "sistem";
  actorName: string;
  action: string;
  targetType: string;
  targetId: string;
  details: string;
}

export interface ModelEvaluationRecord {
  province: string;
  horizon: "2 Pekan" | "4 Pekan";
  mase: number;
  intervalCoverage: string;
  status: "Lulus Target" | "Gagal Ambang Target";
  activeMethod: "Model AI (Ensemble)" | "Prakiraan Baseline";
  isFallback: boolean;
}

export interface AdminStats {
  totalOffers: number;
  totalVolumeKg: number;
  activeContracts: number;
  approvedContracts: number;
  flaggedOffers: number;
  registeredUsers: number;
  auditEntriesCount: number;
  dataFreshnessStatus: string;
}
