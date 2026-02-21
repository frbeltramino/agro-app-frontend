export const lots = [
  {
    lot_id: 1,
    lot_name: "A 1",
    hectares: 13.31,
    crops: [
      {
        crop_id: 34,
        crop_name: "Girasol",
        seed_type: "DM3423",
        real_yield: 60,
        start_date: "2026-02-13",
        end_date: "2026-02-13",
      },
    ],
  },
];

export const variableExpenses = [
  {
    lotId: 1,
    lotName: "A 1",
    expenses: [
      {
        id: 32,
        user_id: 1,
        campaign_id: 1,
        lot_id: 1,
        crop_id: 34,
        hectares: 13.31,
        tons_harvested: 60,
        expense_type_id: 4,
        provider: "Fran",
        expense_date: "2026-02-18",
        amount: 20,
        deleted_at: null,
        created_at: "2026-02-18 18:09:03",
        updated_at: "2026-02-18 18:09:03",
        expense_type_name: "Asesoramiento",
        crop_name: "Girasol",
        lotName: "A 1",
      },
    ],
  },
];

export const deliveriesAndSales = {
  campaign_id: "1",
  crops: [
    {
      userId: 1,
      campaign_id: 1,
      campaign_name: "24/25",
      crop_name_id: 5,
      crop_name: "Girasol",
      seed_deliveries: [
        {
          id: 43,
          tn_sold: 0,
          tn_delivered: 60,
          waybill_number: "CP-002",
          destination: "Rosario",
          status: "pending",
          delivery_date: "2026-02-18",
          deleted_at: null,
          created_at: "2026-02-18 18:06:30",
          updated_at: "2026-02-18 18:06:30",
        },
      ],
      seed_sales: [
        {
          id: 53,
          primary_liquidation_number: "LP-2026-02",
          destination: "AGD",
          tn_sold: 30,
          price_per_tn: 100,
          sale_date: "2026-02-18",
          deleted_at: null,
          created_at: "2026-02-18 18:06:47",
          updated_at: "2026-02-18 18:06:47",
        },
      ],
    },
  ],
};

export const laborsAndSupplies = [
  {
    id: 55,
    crop_id: 34,
    task_type_id: 2,
    provider_id: 6,
    description: "Fertilización 16/02",
    total_price: 74.97,
    laborCost: 55,
    date: "2026-02-16",
    status: "active",
    note: null,
    created_at: "2026-02-16 09:49:00",
    updated_at: "2026-02-16 09:49:00",
    performed_at: "2026-02-16",
    type: "Fertilización",
    provider_name: "Boscarol Jose",
    supplies: [
      {
        supply_id: null,
        master_supply_id: null,
        stock_id: 4,
        supply_name: "A 2",
        category_name: "Herbicida",
        unit: "lt",
        price_per_unit: 1.5,
        dose_per_ha: 1,
        hectares: 13.31,
        total_used: 13.31,
        from_stock: true,
      },
    ],
  },
];
