"use client";

import { useState } from "react";
import { FileBox } from 'lucide-react';
import { Navigation, TabId } from "@/components/Navigation";
import { SettingsPanel } from "@/components/SettingsPanel";
import { FilamentManager } from "@/components/FilamentManager";
import { CalculatorPanel } from "@/components/CalculatorPanel";
import { SavedPartsPanel } from "@/components/SavedPartsPanel";
import { useLocalStorage } from "@/lib/hooks/useLocalStorage";
import {
  DEFAULT_SETTINGS,
  Filament,
  GlobalSettings,
  SavedPart,
  STORAGE_KEYS,
} from "@/lib/types";
import Image from "next/image";

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>("calculator");
  const [settings, setSettings, settingsLoaded] =
    useLocalStorage<GlobalSettings>(STORAGE_KEYS.settings, DEFAULT_SETTINGS);
  const [filaments, setFilaments, filamentsLoaded] = useLocalStorage<
    Filament[]
  >(STORAGE_KEYS.filaments, []);
  const [savedParts, setSavedParts, partsLoaded] = useLocalStorage<
    SavedPart[]
  >(STORAGE_KEYS.savedParts, []);

  const isLoaded = settingsLoaded && filamentsLoaded && partsLoaded;

  function handleSavePart(part: SavedPart) {
    setSavedParts((prev) => [...prev, part]);
  }

  function handleUpdatePart(id: string, updates: Partial<SavedPart>) {
    setSavedParts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  }

  function handleDeletePart(id: string) {
    setSavedParts((prev) => prev.filter((p) => p.id !== id));
  }

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-surface-border bg-surface-raised/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-4 sm:px-6">
          <div className="relative h-12 w-12 overflow-hidden rounded-xl border border-white/10 shadow-md transition-transform hover:scale-105">
            <img
              src="/logo.png"
              alt="Logo Mundo Trizzi"
              className="h-full w-full object-cover"
            />
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              Calculadora de Impressão 3D
            </h1>
            <p className="text-sm text-gray-400">
              Custo de produção, preço de venda e portfólio.
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="mt-6">
          {activeTab === "calculator" && (
            <CalculatorPanel
              settings={settings}
              filaments={filaments}
              onSavePart={handleSavePart}
              onUpdatePart={handleUpdatePart}
            />
          )}
          {activeTab === "filaments" && (
            <FilamentManager filaments={filaments} onChange={setFilaments} />
          )}
          {activeTab === "saved" && (
            <SavedPartsPanel
              parts={savedParts}
              onDelete={handleDeletePart}
              onUpdatePart={handleUpdatePart}
            />
          )}
          {activeTab === "settings" && (
            <SettingsPanel settings={settings} onChange={setSettings} />
          )}
        </div>
      </main>

      <footer className="border-t border-surface-border py-4 text-center text-xs text-gray-500">
        &reg; Mundo Trizzi - Impressão 3D
      </footer>
    </div>
  );
}
