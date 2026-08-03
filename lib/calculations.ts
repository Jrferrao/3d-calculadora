import {
  CostBreakdown,
  DEFAULT_SETTINGS,
  Filament,
  GlobalSettings,
  PartCalculation,
  SavedPart,
  STORAGE_KEYS,
} from "./types";

export function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function saveToStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function loadSettings(): GlobalSettings {
  return loadFromStorage(STORAGE_KEYS.settings, DEFAULT_SETTINGS);
}

export function saveSettings(settings: GlobalSettings): void {
  saveToStorage(STORAGE_KEYS.settings, settings);
}

export function loadFilaments(): Filament[] {
  return loadFromStorage<Filament[]>(STORAGE_KEYS.filaments, []);
}

export function saveFilaments(filaments: Filament[]): void {
  saveToStorage(STORAGE_KEYS.filaments, filaments);
}

export function loadSavedParts(): SavedPart[] {
  return loadFromStorage<SavedPart[]>(STORAGE_KEYS.savedParts, []);
}

export function saveSavedParts(parts: SavedPart[]): void {
  saveToStorage(STORAGE_KEYS.savedParts, parts);
}

export function calculateCostBreakdown(
  settings: GlobalSettings,
  filament: Filament | undefined,
  calculation: PartCalculation
): CostBreakdown {
  const totalPrintHours =
    calculation.printHours + calculation.printMinutes / 60;

  const filamentCost = filament
    ? calculation.partWeightGrams * filament.costPerGram
    : 0;

  const energyCost =
    totalPrintHours *
    (settings.printerWatts / 1000) *
    settings.energyCostPerKwh;

  const maintenanceCost =
    totalPrintHours * settings.maintenanceRatePerHour;

  const laborCost =
    (calculation.postProcessingMinutes / 60) * settings.laborRatePerHour;

  const additionalCostsTotal = calculation.additionalCosts.reduce(
    (sum, item) => sum + item.value,
    0
  );

  const subtotal =
    filamentCost +
    energyCost +
    maintenanceCost +
    laborCost +
    additionalCostsTotal;

  const failureCost = subtotal * (settings.failureRatePercent / 100);
  const productionCost = subtotal + failureCost;
  const suggestedSalePrice =
    productionCost * (1 + calculation.profitMarginPercent / 100);

  const isManualPrice = calculation.manualSalePrice != null;

  const salePrice = isManualPrice
    ? calculation.manualSalePrice!
    : suggestedSalePrice;

  const profitAmount = salePrice - productionCost;
  const effectiveMarginPercent =
    productionCost > 0 ? (salePrice / productionCost - 1) * 100 : 0;

  return {
    filamentCost,
    energyCost,
    maintenanceCost,
    laborCost,
    additionalCostsTotal,
    subtotal,
    failureCost,
    productionCost,
    suggestedSalePrice,
    salePrice,
    profitAmount,
    effectiveMarginPercent,
    isManualPrice,
    totalPrintHours,
  };
}

export function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function formatHours(hours: number): string {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  if (h === 0) return `${m}min`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}min`;
}

export function generateId(): string {
  return crypto.randomUUID();
}
