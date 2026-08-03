"use client";

import { useState } from "react";
import { Filament, FILAMENT_TYPES, FilamentType } from "@/lib/types";
import { formatCurrency, generateId } from "@/lib/calculations";
import { Plus, Trash2, Layers } from "lucide-react";

interface FilamentManagerProps {
  filaments: Filament[];
  onChange: (filaments: Filament[]) => void;
}

const emptyForm = {
  name: "",
  type: "PLA" as FilamentType,
  spoolWeightGrams: 1000,
  spoolPrice: 0,
};

export function FilamentManager({ filaments, onChange }: FilamentManagerProps) {
  const [form, setForm] = useState(emptyForm);

  const costPerGram =
    form.spoolWeightGrams > 0 ? form.spoolPrice / form.spoolWeightGrams : 0;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || form.spoolPrice <= 0 || form.spoolWeightGrams <= 0)
      return;

    const newFilament: Filament = {
      id: generateId(),
      name: form.name.trim(),
      type: form.type,
      spoolWeightGrams: form.spoolWeightGrams,
      spoolPrice: form.spoolPrice,
      costPerGram,
      createdAt: new Date().toISOString(),
    };

    onChange([...filaments, newFilament]);
    setForm(emptyForm);
  }

  function handleDelete(id: string) {
    onChange(filaments.filter((f) => f.id !== id));
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-white">Gestão de Filamentos</h2>
        <p className="mt-1 text-sm text-gray-400">
          Cadastre seus filamentos para calcular o custo por grama automaticamente.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-4">
        <h3 className="text-sm font-medium text-gray-200">Novo Filamento</h3>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label-text">Nome / Marca</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Ex: eSun PLA+ Branco"
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="label-text">Tipo</label>
            <select
              value={form.type}
              onChange={(e) =>
                setForm({ ...form, type: e.target.value as FilamentType })
              }
              className="input-field"
            >
              {FILAMENT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label-text">Peso do Carretel</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                value={form.spoolWeightGrams}
                onChange={(e) =>
                  setForm({
                    ...form,
                    spoolWeightGrams: parseFloat(e.target.value) || 0,
                  })
                }
                className="input-field"
                required
              />
              <span className="text-xs text-gray-500">g</span>
            </div>
          </div>

          <div>
            <label className="label-text">Preço Pago</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={0.01}
                step={0.01}
                value={form.spoolPrice || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    spoolPrice: parseFloat(e.target.value) || 0,
                  })
                }
                className="input-field"
                required
              />
              <span className="text-xs text-gray-500">R$</span>
            </div>
          </div>
        </div>

        {form.spoolPrice > 0 && form.spoolWeightGrams > 0 && (
          <div className="rounded-lg bg-surface-overlay px-4 py-3">
            <p className="text-xs text-gray-400">Custo por grama calculado</p>
            <p className="text-lg font-semibold text-accent">
              {formatCurrency(costPerGram)}
              <span className="ml-1 text-sm font-normal text-gray-400">/g</span>
            </p>
          </div>
        )}

        <button type="submit" className="btn-primary">
          <Plus className="h-4 w-4" />
          Adicionar Filamento
        </button>
      </form>

      {filaments.length > 0 ? (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-300">
            Filamentos Cadastrados ({filaments.length})
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {filaments.map((f) => (
              <div
                key={f.id}
                className="card flex items-start justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-accent/20 px-2 py-0.5 text-xs font-medium text-accent">
                      {f.type}
                    </span>
                    <span className="font-medium text-gray-100">{f.name}</span>
                  </div>
                  <p className="mt-2 text-sm text-gray-400">
                    {f.spoolWeightGrams}g · {formatCurrency(f.spoolPrice)}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-accent">
                    {formatCurrency(f.costPerGram)}/g
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(f.id)}
                  className="btn-danger shrink-0"
                  title="Remover filamento"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="card flex flex-col items-center py-12 text-center">
          <Layers className="h-10 w-10 text-gray-600" />
          <p className="mt-3 text-sm text-gray-400">
            Nenhum filamento cadastrado ainda.
          </p>
        </div>
      )}
    </div>
  );
}
