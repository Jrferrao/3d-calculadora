"use client";

import { useState } from "react";
import { SavedPart } from "@/lib/types";
import { formatCurrency, formatHours } from "@/lib/calculations";
import { PartPhotoModal } from "./PartPhotoModal";
import { Archive, Trash2, TrendingUp, Package, Camera } from "lucide-react";

interface SavedPartsPanelProps {
  parts: SavedPart[];
  onDelete: (id: string) => void;
  onUpdatePart: (id: string, updates: Partial<SavedPart>) => void;
}

export function SavedPartsPanel({
  parts,
  onDelete,
  onUpdatePart,
}: SavedPartsPanelProps) {
  const [photoModalPart, setPhotoModalPart] = useState<SavedPart | null>(null);

  const sortedParts = [...parts].sort(
    (a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()
  );

  function handlePhotoSave(photoUrl: string | undefined) {
    if (photoModalPart) {
      onUpdatePart(photoModalPart.id, { photoUrl });
    }
    setPhotoModalPart(null);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-white">Peças Salvas</h2>
        <p className="mt-1 text-sm text-gray-400">
          Projetos calculados salvos para consulta futura.
        </p>
      </div>

      {sortedParts.length === 0 ? (
        <div className="card flex flex-col items-center py-12 text-center">
          <Archive className="h-10 w-10 text-gray-600" />
          <p className="mt-3 text-sm text-gray-400">
            Nenhuma peça salva ainda. Calcule e salve na aba Calculadora.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sortedParts.map((part) => (
            <div key={part.id} className="card flex flex-col overflow-hidden p-0">
              <div className="relative">
                {part.photoUrl ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={part.photoUrl}
                      alt={`Foto de ${part.name}`}
                      className="aspect-video w-full object-cover"
                    />
                    <button
                      onClick={() => setPhotoModalPart(part)}
                      className="absolute bottom-2 right-2 flex items-center gap-1.5 rounded-lg bg-black/60 px-2.5 py-1.5 text-xs font-medium text-white backdrop-blur-sm transition-colors hover:bg-black/80"
                    >
                      <Camera className="h-3.5 w-3.5" />
                      Editar foto
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setPhotoModalPart(part)}
                    className="flex aspect-video w-full flex-col items-center justify-center gap-2 bg-surface-overlay transition-colors hover:bg-surface-border/50"
                  >
                    <Camera className="h-8 w-8 text-gray-600" />
                    <span className="text-xs text-gray-500">Adicionar foto</span>
                  </button>
                )}
              </div>

              <div className="flex flex-1 flex-col p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-medium text-gray-100">{part.name}</h3>
                    <p className="mt-0.5 text-xs text-gray-500">
                      {new Date(part.savedAt).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <button
                    onClick={() => onDelete(part.id)}
                    className="btn-danger shrink-0 p-1.5"
                    title="Remover peça"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="mt-3 space-y-1.5 text-sm">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Package className="h-3.5 w-3.5" />
                    <span>
                      {part.filamentName} · {part.calculation.partWeightGrams}g
                    </span>
                  </div>
                  <div className="text-gray-400">
                    Impressão: {formatHours(part.breakdown.totalPrintHours)}
                  </div>
                </div>

                <div className="mt-auto border-t border-surface-border pt-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Custo de Produção</span>
                    <span className="text-gray-200">
                      {formatCurrency(part.breakdown.productionCost)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="flex items-center gap-1 text-sm text-accent">
                      <TrendingUp className="h-3.5 w-3.5" />
                      Preço de Venda
                    </span>
                    <span className="font-bold text-accent">
                      {formatCurrency(part.breakdown.salePrice)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>
                      {part.breakdown.isManualPrice
                        ? `Margem efetiva ${(part.breakdown.effectiveMarginPercent ?? 0).toFixed(1)}%`
                        : `Margem ${part.calculation.profitMarginPercent}%`}
                    </span>
                    <span>
                      Lucro {formatCurrency(part.breakdown.profitAmount)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {photoModalPart && (
        <PartPhotoModal
          isOpen={!!photoModalPart}
          partName={photoModalPart.name}
          currentPhoto={photoModalPart.photoUrl}
          onSave={handlePhotoSave}
          onClose={() => setPhotoModalPart(null)}
        />
      )}
    </div>
  );
}
