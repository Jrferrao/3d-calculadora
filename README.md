# Calculadora de Custo de Impressão 3D

Aplicação Next.js para calcular o custo de produção e preço de venda de peças impressas em 3D.

## Funcionalidades

- **Configurações globais** — energia, consumo da impressora, manutenção, mão de obra e taxa de erro
- **Gestão de filamentos** — cadastro com cálculo automático de R$/g
- **Calculadora de peças** — breakdown completo de custos com margem de lucro
- **Peças salvas** — histórico de projetos no LocalStorage

## Desenvolvimento

```bash
npm install
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

## Deploy na Vercel

1. Faça push do repositório para o GitHub
2. Importe o projeto em [vercel.com](https://vercel.com)
3. Deploy automático — nenhuma configuração extra necessária

## Stack

- Next.js 15 (App Router)
- React 19
- Tailwind CSS
- Lucide React
- TypeScript
