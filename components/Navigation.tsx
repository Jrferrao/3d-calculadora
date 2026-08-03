"use client";

import { Settings, Calculator, Layers, Archive } from "lucide-react";

export type TabId = "calculator" | "filaments" | "settings" | "saved";

interface NavigationProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const tabs: { id: TabId; label: string; icon: typeof Calculator }[] = [
  { id: "calculator", label: "Calculadora", icon: Calculator },
  { id: "filaments", label: "Filamentos", icon: Layers },
  { id: "saved", label: "Peças Salvas", icon: Archive },
  { id: "settings", label: "Configurações", icon: Settings },
];

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  return (
    <nav className="flex gap-1 overflow-x-auto rounded-xl border border-surface-border bg-surface-raised p-1">
      {tabs.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onTabChange(id)}
          className={`flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
            activeTab === id
              ? "bg-accent text-white shadow-lg shadow-accent/20"
              : "text-gray-400 hover:bg-surface-overlay hover:text-gray-200"
          }`}
        >
          <Icon className="h-4 w-4" />
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </nav>
  );
}
