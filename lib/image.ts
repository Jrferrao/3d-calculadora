const MAX_WIDTH = 800;
const JPEG_QUALITY = 0.75;
const MAX_FILE_SIZE_MB = 5;

export function isValidImageFile(file: File): boolean {
  return file.type.startsWith("image/") && file.size <= MAX_FILE_SIZE_MB * 1024 * 1024;
}

export async function compressImage(file: File): Promise<string> {
  if (!isValidImageFile(file)) {
    throw new Error(
      `Arquivo inválido. Use uma imagem de até ${MAX_FILE_SIZE_MB}MB.`
    );
  }

  const dataUrl = await readFileAsDataUrl(file);
  const img = await loadImage(dataUrl);

  const scale = Math.min(1, MAX_WIDTH / img.width);
  const width = Math.round(img.width * scale);
  const height = Math.round(img.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Não foi possível processar a imagem.");

  ctx.drawImage(img, 0, 0, width, height);
  return canvas.toDataURL("image/jpeg", JPEG_QUALITY);
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Erro ao ler o arquivo."));
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Erro ao carregar a imagem."));
    img.src = src;
  });
}
