"use client";

import { useRef, useState, useEffect } from "react";
import { Camera, X, Upload, Trash2, ImageIcon } from "lucide-react";
import { compressImage } from "@/lib/image";

interface PartPhotoModalProps {
  isOpen: boolean;
  partName: string;
  currentPhoto?: string;
  onSave: (photoUrl: string | undefined) => void;
  onClose: () => void;
}

export function PartPhotoModal({
  isOpen,
  partName,
  currentPhoto,
  onSave,
  onClose,
}: PartPhotoModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | undefined>(currentPhoto);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPreview(currentPhoto);
      setError("");
    }
  }, [isOpen, currentPhoto]);

  if (!isOpen) return null;

  async function handleFile(file: File) {
    setError("");
    setLoading(true);
    try {
      const compressed = await compressImage(file);
      setPreview(compressed);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao processar imagem.");
    } finally {
      setLoading(false);
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  function handleRemove() {
    setPreview(undefined);
    setError("");
  }

  function handleConfirm() {
    onSave(preview);
    onClose();
  }

  function handleSkip() {
    onSave(currentPhoto);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <div
        className="relative w-full max-w-md rounded-xl border border-surface-border bg-surface-raised shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-surface-border px-5 py-4">
          <div>
            <h3 className="font-semibold text-white">Foto da Peça</h3>
            <p className="mt-0.5 text-xs text-gray-400 truncate max-w-[260px]">
              {partName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-surface-overlay hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {preview ? (
            <div className="relative overflow-hidden rounded-lg border border-surface-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview}
                alt={`Foto de ${partName}`}
                className="aspect-video w-full object-cover"
              />
              <button
                onClick={handleRemove}
                className="absolute right-2 top-2 rounded-lg bg-black/60 p-1.5 text-red-400 transition-colors hover:bg-black/80"
                title="Remover foto"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
              className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-10 transition-colors ${
                dragOver
                  ? "border-accent bg-accent/10"
                  : "border-surface-border bg-surface-overlay hover:border-accent/50"
              }`}
            >
              {loading ? (
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
              ) : (
                <>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/20">
                    <Camera className="h-6 w-6 text-accent" />
                  </div>
                  <p className="mt-3 text-sm font-medium text-gray-200">
                    Clique ou arraste uma foto
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    JPG, PNG ou WebP · até 5MB
                  </p>
                </>
              )}
            </div>
          )}

          {preview && (
            <button
              onClick={() => inputRef.current?.click()}
              disabled={loading}
              className="btn-secondary w-full"
            >
              <Upload className="h-4 w-4" />
              Trocar foto
            </button>
          )}

          {error && (
            <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">
              {error}
            </p>
          )}

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleInputChange}
          />
        </div>

        <div className="flex gap-2 border-t border-surface-border px-5 py-4">
          {!preview && !currentPhoto && (
            <button onClick={handleSkip} className="btn-secondary flex-1">
              <ImageIcon className="h-4 w-4" />
              Pular
            </button>
          )}
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="btn-primary flex-1"
          >
            {preview ? "Salvar foto" : currentPhoto ? "Manter atual" : "Fechar"}
          </button>
        </div>
      </div>
    </div>
  );
}
