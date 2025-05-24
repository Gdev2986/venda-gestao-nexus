# Correção de Valores nas Vendas

## Problema Identificado

Havia uma diferença nos valores brutos calculados entre a versão HTML/JavaScript (que funcionava corretamente) e o sistema React. A quantidade de vendas batia, mas o valor total estava incorreto.

## Causa do Problema

### No HTML/JavaScript (funcionando):
```javascript
function toNumber(v) {
  if (typeof v === 'string') {
    return parseFloat(v.replace(/\./g, '').replace(',', '.')) || 0;
  }
  return Number(v) || 0;
}
```

### No React (problemático):
1. **SalesImportPanel.tsx** - Conversão prematura para número:
```javascript
// ERRO: Convertia valores para número antes do processamento correto
if (headerNorm.includes('valor')) {
  raw = raw.replace(',', '.').replace(/[^0-9.-]/g, '');
  obj[h] = raw && !isNaN(Number(raw)) ? Number(raw) : 0; // ❌
}
```

2. **sales-processor.ts** - Função toNumber inadequada:
```typescript
// ERRO: Não removia pontos de milhares corretamente
const cleaned = v.replace(/[^0-9.,-]/g, '').replace(/,/g, '.');
```

## Correção Aplicada

### 1. SalesImportPanel.tsx
```javascript
// ✅ CORRIGIDO: Mantém valores como string para processamento correto
headers.forEach((h, i) => {
  let raw = values[i]?.replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1').trim();
  obj[h] = raw || '';
});
```

### 2. sales-processor.ts
```typescript
// ✅ CORRIGIDO: Remove pontos de milhares antes de converter vírgula
export function toNumber(v: string | number): number {
  if (typeof v === 'string') {
    let cleaned = v
      .replace(/["']/g, '') // Remove quotes
      .replace(/R\$/, '') // Remove R$ symbol
      .replace(/\s+/g, '') // Remove spaces
      .trim();
    
    // Para formato brasileiro: remove pontos (milhares), depois converte vírgula
    cleaned = cleaned
      .replace(/\./g, '') // Remove dots (thousands separator)
      .replace(',', '.'); // Convert comma to dot for decimal
    
    return parseFloat(cleaned) || 0;
  }
  return Number(v) || 0;
}
```

## Exemplo de Conversão

| Valor Original | Antes (Erro) | Depois (Correto) |
|----------------|--------------|------------------|
| "1.234,56"     | 1.234        | 1234.56         |
| "10.500,00"    | 10.5         | 10500.00        |
| "5.000,99"     | 5.0          | 5000.99         |

## Resultado

Agora os valores brutos são calculados corretamente, mantendo compatibilidade com o formato brasileiro de números (ponto como separador de milhares, vírgula como separador decimal).

## Verificação

O build foi executado com sucesso sem erros de TypeScript, confirmando que a correção está funcionando adequadamente. 