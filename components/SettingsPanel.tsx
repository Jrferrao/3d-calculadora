"use client";

import { GlobalSettings } from "@/lib/types";
import { Zap, Wrench, Clock, AlertTriangle, DollarSign } from "lucide-react";

interface SettingsPanelProps {
  settings: GlobalSettings;
  onChange: (settings: GlobalSettings) => void;
}

export function SettingsPanel({ settings, onChange }: SettingsPanelProps) {
  const fields = [
    {
      key: "energyCostPerKwh" as const,
      label: "Custo da Energia Elétrica",
      unit: "R$/kWh",
      icon: Zap,
      step: 0.01,
    },
    {
      key: "printerWatts" as const,
      label: "Consumo da Impressora",
      unit: "Watts",
      icon: Zap,
      step: 1,
    },
    {
      key: "maintenanceRatePerHour" as const,
      label: "Taxa de Manutenção / Depreciação",
      unit: "R$/h",
      icon: Wrench,
      step: 0.01,
    },
    {
      key: "laborRatePerHour" as const,
      label: "Valor da Hora de Trabalho",
      unit: "R$/h",
      icon: Clock,
      step: 0.5,
    },
    {
      key: "failureRatePercent" as const,
      label: "Taxa de Erro / Perda",
      unit: "%",
      icon: AlertTriangle,
      step: 0.5,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-white">Configurações Globais</h2>
        <p className="mt-1 text-sm text-gray-400">
          Taxas fixas usadas em todos os cálculos de peças.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map(({ key, label, unit, icon: Icon, step }) => (
          <div key={key} className="card">
            <label className="label-text flex items-center gap-1.5">
              <Icon className="h-3.5 w-3.5" />
              {label}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={0}
                step={step}
                value={settings[key]}
                onChange={(e) =>
                  onChange({
                    ...settings,
                    [key]: parseFloat(e.target.value) || 0,
                  })
                }
                className="input-field"
              />
              <span className="shrink-0 text-xs text-gray-500">{unit}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="card border-accent/20 bg-accent/5">
        <div className="flex items-start gap-3">
          <DollarSign className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
          <div>
            <p className="text-sm font-medium text-gray-200">Dica</p>
            <p className="mt-1 text-sm text-gray-400">
              A taxa de erro/perda é aplicada sobre o subtotal de produção para
              cobrir falhas de impressão, retrabalho e material desperdiçado.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
