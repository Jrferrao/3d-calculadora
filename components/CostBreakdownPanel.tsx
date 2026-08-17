"use client";

import {
  CostBreakdown,
  GlobalSettings,
  Marketplace,
} from "@/lib/types";
import { formatCurrency, formatHours } from "@/lib/calculations";
import {
  Package,
  Zap,
  Wrench,
  Clock,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  RotateCcw,
} from "lucide-react";

interface CostBreakdownPanelProps {
  breakdown: CostBreakdown;
  settings: GlobalSettings;
  profitMarginPercent: number;
  marketplace: Marketplace;
  onMarketplaceChange: (marketplace: Marketplace) => void;
  onSalePriceChange: (price: number | undefined) => void;
}

export function CostBreakdownPanel({
  breakdown,
  settings,
  profitMarginPercent,
  marketplace,
  onMarketplaceChange,
  onSalePriceChange,
}: CostBreakdownPanelProps) {
  const items = [
    {
      label: "Custo do Filamento",
      value: breakdown.filamentCost,
      icon: Package,
      color: "text-blue-400",
    },
    {
      label: "Custo de Energia",
      value: breakdown.energyCost,
      icon: Zap,
      color: "text-yellow-400",
      detail: `${settings.printerWatts}W · ${formatCurrency(settings.energyCostPerKwh)}/kWh · ${formatHours(breakdown.totalPrintHours)}`,
    },
    {
      label: "Custo de Manutenção",
      value: breakdown.maintenanceCost,
      icon: Wrench,
      color: "text-orange-400",
      detail: `${formatCurrency(settings.maintenanceRatePerHour)}/h`,
    },
    {
      label: "Mão de Obra + Insumos",
      value: breakdown.laborCost + breakdown.additionalCostsTotal,
      icon: Clock,
      color: "text-purple-400",
    },
    {
      label: `Taxa de Falha (${settings.failureRatePercent}%)`,
      value: breakdown.failureCost,
      icon: AlertTriangle,
      color: "text-red-400",
    },
  ];

  return (
    <div className="card space-y-5">
      <div>
        <h3 className="text-sm font-semibold text-white">Breakdown do Custo</h3>
        <p className="mt-0.5 text-xs text-gray-400">
          Detalhamento completo da produção
        </p>
      </div>

      <div className="space-y-2">
        {items.map(({ label, value, icon: Icon, color, detail }) => (
          <div
            key={label}
            className="flex items-center justify-between rounded-lg bg-surface-overlay px-3 py-2.5"
          >
            <div className="flex items-center gap-2.5">
              <Icon className={`h-4 w-4 ${color}`} />
              <div>
                <p className="text-sm text-gray-300">{label}</p>
                {detail && (
                  <p className="text-xs text-gray-500">{detail}</p>
                )}
              </div>
            </div>
            <span className="text-sm font-medium text-gray-100">
              {formatCurrency(value)}
            </span>
          </div>
        ))}
      </div>

      <div className="border-t border-surface-border pt-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">Subtotal de Produção</span>
          <span className="text-sm font-medium text-gray-200">
            {formatCurrency(breakdown.subtotal)}
          </span>
        </div>

        <div className="flex items-center justify-between rounded-lg bg-surface px-3 py-3">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-gray-400" />
            <span className="font-medium text-gray-200">
              Custo Total de Produção
            </span>
          </div>
          <span className="text-lg font-bold text-white">
            {formatCurrency(breakdown.productionCost)}
          </span>
        </div>

        <div className="rounded-lg border border-surface-border bg-surface-overlay p-4 space-y-3">
          <div>
            <label className="label-text">
              Marketplace
            </label>

            <select
              value={marketplace}
              onChange={(e) =>
                onMarketplaceChange(e.target.value as Marketplace)
              }
              className="input-field"
            >
              <option value="none">Sem marketplace</option>
              <option value="mercadoLivre">Mercado Livre</option>
              <option value="shopee">Shopee</option>
              <option value="tiktokShop">TikTok Shop</option>
            </select>
          </div>

          {marketplace !== "none" && (
            <div className="rounded-lg bg-surface px-3 py-3 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">
                  Taxa do marketplace
                </span>

                <span className="font-medium text-gray-200">
                  {(breakdown.marketplaceFeePercent ?? 0).toFixed(2)}%                
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">
                  Valor da taxa
                </span>

                <span className="font-medium text-gray-200">
                  {formatCurrency(breakdown.marketplaceFeeAmount ?? 0)}
                </span>
              </div>

              <div className="flex items-center justify-between border-t border-surface-border pt-2">
                <span className="font-medium text-gray-200">
                  Preço sugerido com marketplace
                </span>

                <span className="text-lg font-bold text-accent">
                  {formatCurrency(breakdown.marketplaceSalePrice ?? breakdown.suggestedSalePrice)}
                </span>
              </div>
            </div>
          )}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">
              Preço sugerido ({profitMarginPercent}% margem)
            </span>
            <span className="font-medium text-gray-300">
              {formatCurrency(breakdown.suggestedSalePrice)}
            </span>
          </div>

          <div>
            <label className="label-text flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5" />
              Preço de Venda Final
            </label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">R$</span>
              <input
                type="number"
                min={0}
                step={0.01}
                value={
                  breakdown.salePrice > 0
                    ? breakdown.salePrice.toFixed(2)
                    : ""
                }
                onChange={(e) => {
                  const value = parseFloat(e.target.value);

                  onSalePriceChange(
                    e.target.value === "" ? undefined : value
                  );
                }}
                className="input-field text-lg font-bold text-accent"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">
              {breakdown.isManualPrice ? (
                <>
                  Margem efetiva{" "}
                  <span className="font-medium text-gray-300">
                    {breakdown.effectiveMarginPercent.toFixed(1)}%
                  </span>
                </>
              ) : (
                <>Seguindo margem de {profitMarginPercent}%</>
              )}
            </span>
            <span className="text-gray-400">
              Lucro {formatCurrency(breakdown.profitAmount)}
            </span>
          </div>

          {breakdown.isManualPrice && (
            <button
              type="button"
              onClick={() => onSalePriceChange(undefined)}
              className="flex w-full items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs text-gray-400 transition-colors hover:text-accent"
            >
              <RotateCcw className="h-3 w-3" />
              Usar preço sugerido ({formatCurrency(breakdown.suggestedSalePrice)})
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
