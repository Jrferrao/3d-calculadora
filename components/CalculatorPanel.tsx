"use client";

import { useState, useRef } from "react";
import {
  Filament,
  GlobalSettings,
  PartCalculation,
  SavedPart,
  AdditionalCost,
} from "@/lib/types";
import {
  calculateCostBreakdown,
  formatCurrency,
  generateId,
} from "@/lib/calculations";
import { CostBreakdownPanel } from "./CostBreakdownPanel";
import { PartPhotoModal } from "./PartPhotoModal";
import { Plus, Trash2, Save, Package, Camera } from "lucide-react";
import { compressImage } from "@/lib/image";

interface CalculatorPanelProps {
  settings: GlobalSettings;
  filaments: Filament[];
  onSavePart: (part: SavedPart) => void;
  onUpdatePart: (id: string, updates: Partial<SavedPart>) => void;
}

const defaultCalculation: PartCalculation = {
  filamentId: "",
  partWeightGrams: 0,
  printHours: 0,
  printMinutes: 0,
  additionalCosts: [],
  postProcessingMinutes: 0,
  profitMarginPercent: 30,
};

export function CalculatorPanel({
  settings,
  filaments,
  onSavePart,
  onUpdatePart,
}: CalculatorPanelProps) {
  const [calculation, setCalculation] =
    useState<PartCalculation>(defaultCalculation);
  const [partName, setPartName] = useState("");
  const [partPhoto, setPartPhoto] = useState<string | undefined>();
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [photoModalPart, setPhotoModalPart] = useState<SavedPart | null>(null);
  const [photoLoading, setPhotoLoading] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const selectedFilament = filaments.find(
    (f) => f.id === calculation.filamentId
  );

  const breakdown = calculateCostBreakdown(
    settings,
    selectedFilament,
    calculation
  );

  function updateCalculation(partial: Partial<PartCalculation>) {
    setCalculation((prev) => ({ ...prev, ...partial }));
  }

  function handleMarginChange(margin: number) {
    updateCalculation({
      profitMarginPercent: margin,
      manualSalePrice: undefined,
    });
  }

  function handleSalePriceChange(price: number | undefined) {
    updateCalculation({ manualSalePrice: price });
  }

  function addAdditionalCost() {
    updateCalculation({
      additionalCosts: [
        ...calculation.additionalCosts,
        { id: generateId(), name: "", value: 0 },
      ],
    });
  }

  function updateAdditionalCost(
    id: string,
    field: keyof AdditionalCost,
    value: string | number
  ) {
    updateCalculation({
      additionalCosts: calculation.additionalCosts.map((c) =>
        c.id === id ? { ...c, [field]: value } : c
      ),
    });
  }

  function removeAdditionalCost(id: string) {
    updateCalculation({
      additionalCosts: calculation.additionalCosts.filter((c) => c.id !== id),
    });
  }

  function handleSave() {
    if (!partName.trim()) return;

    const part: SavedPart = {
      id: generateId(),
      name: partName.trim(),
      calculation: { ...calculation },
      breakdown: { ...breakdown },
      filamentName: selectedFilament?.name ?? "Sem filamento",
      savedAt: new Date().toISOString(),
      photoUrl: partPhoto,
    };

    onSavePart(part);
    setPartName("");
    setPartPhoto(undefined);
    setShowSaveForm(false);

    if (!partPhoto) {
      setPhotoModalPart(part);
    }
  }

  async function handleInlinePhoto(file: File) {
    setPhotoLoading(true);
    try {
      const compressed = await compressImage(file);
      setPartPhoto(compressed);
    } catch {
      // silently fail — user can retry
    } finally {
      setPhotoLoading(false);
    }
  }

  function handlePhotoModalSave(photoUrl: string | undefined) {
    if (photoModalPart && photoUrl) {
      onUpdatePart(photoModalPart.id, { photoUrl });
    }
    setPhotoModalPart(null);
  }

  function resetSaveForm() {
    setShowSaveForm(false);
    setPartName("");
    setPartPhoto(undefined);
  }

  const hasValidCalculation =
    calculation.filamentId &&
    calculation.partWeightGrams > 0 &&
    (calculation.printHours > 0 || calculation.printMinutes > 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-white">
          Calculadora de Peças impressas em 3D
        </h2>
        <p className="mt-1 text-sm text-gray-400">
          Insira os dados da peça para calcular o custo e preço de venda.
        </p>
      </div>

      {filaments.length === 0 ? (
        <div className="card flex flex-col items-center py-12 text-center">
          <Package className="h-10 w-10 text-gray-600" />
          <p className="mt-3 text-sm text-gray-400">
            Cadastre pelo menos um filamento na aba &quot;Filamentos&quot; para
            começar a calcular.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="card space-y-5">
            <h3 className="text-sm font-medium text-gray-200">Dados da Peça</h3>

            <div>
              <label className="label-text">Filamento</label>
              <select
                value={calculation.filamentId}
                onChange={(e) =>
                  updateCalculation({ filamentId: e.target.value })
                }
                className="input-field"
              >
                <option value="">Selecione um filamento</option>
                {filaments.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} ({f.type}) — {formatCurrency(f.costPerGram)}/g
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label-text">Peso da Peça Fatiada</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  step={0.1}
                  value={calculation.partWeightGrams || ""}
                  onChange={(e) =>
                    updateCalculation({
                      partWeightGrams: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="input-field"
                  placeholder="Ex: 45.5"
                />
                <span className="text-xs text-gray-500">g</span>
              </div>
            </div>

            <div>
              <label className="label-text">Tempo de Impressão</label>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    value={calculation.printHours || ""}
                    onChange={(e) =>
                      updateCalculation({
                        printHours: parseInt(e.target.value) || 0,
                      })
                    }
                    className="input-field"
                    placeholder="0"
                  />
                  <span className="text-xs text-gray-500">h</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    max={59}
                    value={calculation.printMinutes || ""}
                    onChange={(e) =>
                      updateCalculation({
                        printMinutes: parseInt(e.target.value) || 0,
                      })
                    }
                    className="input-field"
                    placeholder="0"
                  />
                  <span className="text-xs text-gray-500">min</span>
                </div>
              </div>
            </div>

            <div>
              <label className="label-text">
                Tempo de Fatiamento / Pós-processamento
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  value={calculation.postProcessingMinutes || ""}
                  onChange={(e) =>
                    updateCalculation({
                      postProcessingMinutes: parseInt(e.target.value) || 0,
                    })
                  }
                  className="input-field"
                  placeholder="Ex: 15"
                />
                <span className="text-xs text-gray-500">min</span>
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="label-text mb-0">Custos Adicionais</label>
                <button
                  type="button"
                  onClick={addAdditionalCost}
                  className="btn-secondary py-1 px-2 text-xs"
                >
                  <Plus className="h-3 w-3" />
                  Adicionar
                </button>
              </div>

              {calculation.additionalCosts.length === 0 ? (
                <p className="text-xs text-gray-500">
                  Ex: Imã, Parafuso, Cola, Embalagem
                </p>
              ) : (
                <div className="space-y-2">
                  {calculation.additionalCosts.map((cost) => (
                    <div key={cost.id} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={cost.name}
                        onChange={(e) =>
                          updateAdditionalCost(cost.id, "name", e.target.value)
                        }
                        placeholder="Nome"
                        className="input-field flex-1"
                      />
                      <input
                        type="number"
                        min={0}
                        step={0.01}
                        value={cost.value || ""}
                        onChange={(e) =>
                          updateAdditionalCost(
                            cost.id,
                            "value",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        placeholder="R$"
                        className="input-field w-24"
                      />
                      <button
                        onClick={() => removeAdditionalCost(cost.id)}
                        className="btn-danger p-1.5"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="label-text">Margem de Lucro Desejada</label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={0}
                  max={500}
                  step={5}
                  value={calculation.profitMarginPercent}
                  onChange={(e) =>
                    handleMarginChange(parseInt(e.target.value))
                  }
                  className="h-2 flex-1 cursor-pointer appearance-none rounded-full bg-surface-overlay accent-accent"
                />
                <span className="w-12 text-right text-sm font-semibold text-accent">
                  {calculation.profitMarginPercent}%
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {hasValidCalculation ? (
              <>
                <CostBreakdownPanel
                  breakdown={breakdown}
                  settings={settings}
                  profitMarginPercent={calculation.profitMarginPercent}
                  onSalePriceChange={handleSalePriceChange}
                />

                {!showSaveForm ? (
                  <button
                    onClick={() => setShowSaveForm(true)}
                    className="btn-primary w-full"
                  >
                    <Save className="h-4 w-4" />
                    Salvar Peça
                  </button>
                ) : (
                  <div className="card space-y-4">
                    <div>
                      <label className="label-text">Nome da Peça / Projeto</label>
                      <input
                        type="text"
                        value={partName}
                        onChange={(e) => setPartName(e.target.value)}
                        placeholder="Ex: Suporte de Celular v2"
                        className="input-field"
                        autoFocus
                      />
                    </div>

                    <div>
                      <label className="label-text">Foto da Peça (opcional)</label>
                      {partPhoto ? (
                        <div className="relative overflow-hidden rounded-lg border border-surface-border">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={partPhoto}
                            alt="Preview da peça"
                            className="aspect-video w-full object-cover"
                          />
                          <button
                            onClick={() => setPartPhoto(undefined)}
                            className="absolute right-2 top-2 rounded-lg bg-black/60 p-1.5 text-red-400 hover:bg-black/80"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => photoInputRef.current?.click()}
                          disabled={photoLoading}
                          className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-surface-border bg-surface-overlay px-4 py-6 text-sm text-gray-400 transition-colors hover:border-accent/50 hover:text-gray-200"
                        >
                          {photoLoading ? (
                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-accent border-t-transparent" />
                          ) : (
                            <>
                              <Camera className="h-5 w-5" />
                              Adicionar foto
                            </>
                          )}
                        </button>
                      )}
                      <input
                        ref={photoInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleInlinePhoto(file);
                          e.target.value = "";
                        }}
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={handleSave}
                        disabled={!partName.trim()}
                        className="btn-primary flex-1"
                      >
                        <Save className="h-4 w-4" />
                        Confirmar
                      </button>
                      <button onClick={resetSaveForm} className="btn-secondary">
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="card flex flex-col items-center py-16 text-center">
                <Package className="h-10 w-10 text-gray-600" />
                <p className="mt-3 text-sm text-gray-400">
                  Preencha filamento, peso e tempo de impressão para ver o
                  breakdown de custos.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {photoModalPart && (
        <PartPhotoModal
          isOpen={!!photoModalPart}
          partName={photoModalPart.name}
          onSave={handlePhotoModalSave}
          onClose={() => setPhotoModalPart(null)}
        />
      )}
    </div>
  );
}
