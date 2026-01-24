export interface LotsStatsResponse {
  lotes: Lote[];
}

export interface Lote {
  id: number;
  lote: string;
  superficieHa: number;
  insumos: number;
  insumosPorCategoria: InsumosPorCategoria[];
  labores: number;
  cosecha: number;
  costoVariable: number;
  margenBruto: number;
}

export interface InsumosPorCategoria {
  categoria: string;
  total: number;
}

