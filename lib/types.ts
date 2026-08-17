export type FilamentType = "PLA" | "PETG" | "ABS" | "TPU";

export interface GlobalSettings {
  energyCostPerKwh: number;
  printerWatts: number;
  maintenanceRatePerHour: number;
  laborRatePerHour: number;
  failureRatePercent: number;
  mercadoLivreFeePercent: number;
  shopeeFeePercent: number;
  tiktokShopFeePercent: number;
}

export interface Filament {
  id: string;
  name: string;
  type: FilamentType;
  spoolWeightGrams: number;
  spoolPrice: number;
  costPerGram: number;
  createdAt: string;
}

export interface AdditionalCost {
  id: string;
  name: string;
  value: number;
}

export type Marketplace =
  | "none"
  | "mercadoLivre"
  | "shopee"
  | "tiktokShop";

export interface PartCalculation {
  filamentId: string;
  partWeightGrams: number;
  printHours: number;
  printMinutes: number;
  additionalCosts: AdditionalCost[];
  postProcessingMinutes: number;
  profitMarginPercent: number;
  marketplace?: Marketplace;
  manualSalePrice?: number;
}

export interface CostBreakdown {
  filamentCost: number;
  energyCost: number;
  maintenanceCost: number;
  laborCost: number;
  additionalCostsTotal: number;
  subtotal: number;
  failureCost: number;
  productionCost: number;
  suggestedSalePrice: number;
  salePrice: number;
  profitAmount: number;
  effectiveMarginPercent: number;
  isManualPrice: boolean;
  totalPrintHours: number;
  marketplaceFeePercent: number;
  marketplaceFeeAmount: number;
  marketplaceSalePrice: number;
}

export interface SavedPart {
  id: string;
  name: string;
  calculation: PartCalculation;
  breakdown: CostBreakdown;
  filamentName: string;
  savedAt: string;
  photoUrl?: string;
}

export const DEFAULT_SETTINGS: GlobalSettings = {
  energyCostPerKwh: 0.85,
  printerWatts: 150,
  maintenanceRatePerHour: 0.5,
  laborRatePerHour: 25,
  failureRatePercent: 5,
  mercadoLivreFeePercent: 0,
  shopeeFeePercent: 0,
  tiktokShopFeePercent: 0,
};

export const FILAMENT_TYPES: FilamentType[] = ["PLA", "PETG", "ABS", "TPU"];

export const STORAGE_KEYS = {
  settings: "calc3d_settings",
  filaments: "calc3d_filaments",
  savedParts: "calc3d_saved_parts",
} as const;
