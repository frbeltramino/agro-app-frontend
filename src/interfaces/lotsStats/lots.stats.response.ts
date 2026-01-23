export interface LotsStatsResponse {
  lotes: Lote[];
}

export interface Lote {
  id: number;
  lote: string;
  superficieHa: number;
  insumos: number;
  labores: number;
  cosecha: number;
  costoVariable: number;
  margenBruto: number;
}
