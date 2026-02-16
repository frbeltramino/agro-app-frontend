export interface LotsStatsResponse {
  lotes: Lote[];
}

export interface Lote {
  id: number;
  lote: string;
  superficieHa: number;
  cultivos: Cultivo[];
}

export interface Cultivo {
  cropId: number;
  cropName: string;
  lotId: number;
  cosecha: number;
  ingresos: number;
  semillas: number;
  insumosSinSemillas: number;
  insumos: number;
  cosechaLabores: number;
  otrasLabores: number;
  labores: number;
  costoVariable: number;
  margenBruto: number;
  precioPromedioPonderado: number;
}
