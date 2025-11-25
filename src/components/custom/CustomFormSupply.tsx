interface CustomFormSupplyProps {
  index: number;
  register: any;
  errors: any;
  watchSupplies: any[];
  categories: Array<{ id: number; name: string }>;
  stockSupplies: Array<{ id: number; name: string }>;
  supplyType: string; // stock | purchase
}

export const CustomFormSupply = ({
  index,
  register,
  errors,
  watchSupplies,
  categories,
  stockSupplies,
  supplyType,
}: CustomFormSupplyProps) => {
  return (
    <>
      {/* Tipo de Suministro */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Tipo de Suministro *
        </label>
        <select
          {...register(`supplies.${index}.supplyType`, {
            required: "Selecciona el tipo de suministro",
          })}
          className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary text-sm"
        >
          <option value="stock">De Stock</option>
          <option value="purchase">Comprar para esta tarea</option>
        </select>
      </div>

      {/* Si el suministro viene de stock */}
      {supplyType === "stock" ? (
        <div>
          <label className="block text-sm font-medium mb-1">
            Seleccionar Suministro de Stock *
          </label>
          <select
            {...register(`supplies.${index}.stockId`, {
              required: "Selecciona un suministro de stock",
            })}
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary text-sm"
          >
            <option value="">Selecciona un suministro</option>
            {stockSupplies?.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          {errors.supplies?.[index]?.stockId && (
            <p className="text-destructive text-sm mt-1">
              {errors.supplies[index]?.stockId?.message}
            </p>
          )}
        </div>
      ) : (
        <>
          {/* Nombre del producto */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Nombre del Producto *
            </label>
            <input
              type="text"
              {...register(`supplies.${index}.productName`, {
                required: "El nombre del producto es requerido",
              })}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary text-sm"
              placeholder="Ej: Fertilizante NPK 10-20-20"
            />
            {errors.supplies?.[index]?.productName && (
              <p className="text-destructive text-sm mt-1">
                {errors.supplies[index]?.productName?.message}
              </p>
            )}
          </div>

          {/* Categoría */}
          <div>
            <label className="block text-sm font-medium mb-1">Categoría *</label>
            <select
              {...register(`supplies.${index}.categoryId`, {
                required: "La categoría es requerida",
              })}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary text-sm"
            >
              <option value="">Selecciona una categoría</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            {errors.supplies?.[index]?.categoryId && (
              <p className="text-destructive text-sm mt-1">
                {errors.supplies[index]?.categoryId?.message}
              </p>
            )}
          </div>

          {/* Unidad y precio */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Unidad *</label>
              <select
                {...register(`supplies.${index}.unit`, {
                  required: "La unidad es requerida",
                })}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary text-sm"
              >
                <option value="">Selecciona una unidad</option>
                <option value="lt">Litros (lt)</option>
                <option value="kg">Kilogramos (kg)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Precio por Unidad *
              </label>
              <input
                type="number"
                step="0.01"
                {...register(`supplies.${index}.pricePerUnit`, {
                  required: "El precio es requerido",
                  min: { value: 0, message: "Debe ser positivo" },
                })}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary text-sm"
                placeholder="0.00"
              />
            </div>
          </div>
        </>
      )}

      {/* Dosis por hectárea */}
      <div className="grid grid-cols-2 gap-3 mt-3">
        <div>
          <label className="block text-sm font-medium mb-1">
            Dosis por Hectárea ({watchSupplies[index]?.unit || "unidad"}) *
          </label>
          <input
            type="number"
            step="0.01"
            {...register(`supplies.${index}.dosagePerHectare`, {
              required: "La dosis es requerida",
              min: { value: 0, message: "Debe ser positivo" },
            })}
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary text-sm"
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Cantidad de Hectáreas *
          </label>
          <input
            type="number"
            step="0.01"
            {...register(`supplies.${index}.hectareQuantity`, {
              required: "La cantidad es requerida",
              min: { value: 0, message: "Debe ser positiva" },
            })}
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary text-sm"
            placeholder="0.00"
          />
        </div>
      </div>
    </>
  );
};
