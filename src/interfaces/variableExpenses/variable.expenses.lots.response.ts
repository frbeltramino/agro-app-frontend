export interface VariableExpensesLots {
  lots: Lot[];
}

export interface Lot {
  lot_id: number;
  lot_name: string;
  lot_hectares: number;
  lot_location: null;
  crop_id: number;
  crop_name: string;
  real_yield: number;
  expected_yield: null;
  start_date: string;
  end_date: string;
}
