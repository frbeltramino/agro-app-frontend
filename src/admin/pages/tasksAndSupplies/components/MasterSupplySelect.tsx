import { useEffect, useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useMasterSupply } from "@/admin/hooks/useMasterSupply";
import { UNITS } from "@/constants/units";
import { useSupplyCategories } from "@/admin/hooks/useSupplyCategories";
import { CustomSelectWithCreate } from "@/components/custom/CustomSelectWithCreate";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";

interface MasterSupplySelectProps {
  control: any;
  setValue: any;
  index: number;
  name: string;
  errors: any;
  editingSupply?: any;
}

export const MasterSupplySelect = ({
  control,
  setValue,
  index,
  name,
  errors,
  editingSupply,
}: MasterSupplySelectProps) => {
  const { data, isLoading, mutation } = useMasterSupply();
  const { data: categoriesData, createCategory } = useSupplyCategories();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [serviceError, setServiceError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const MAX_RESULTS = 20;
  const [isFocused, setIsFocused] = useState(false);
  const listRef = useRef<HTMLUListElement>(null);

  const { register, watch, reset, trigger } = useForm({
    defaultValues: { name: "", unit: "", categoryId: "" },
  });

  const modalValues = watch();
  const supplies = data?.master_supplies || [];
  const categories = categoriesData?.categories || [];

  const handleAddNewSupply = async () => {
    if (!modalValues.name || !modalValues.unit || !modalValues.categoryId) {
      setServiceError("Todos los campos son requeridos");
      return;
    }

    const isValid = await trigger();
    if (!isValid) return;

    try {
      await mutation.mutateAsync({
        name: modalValues.name,
        unit: modalValues.unit,
        categoryId: Number(modalValues.categoryId),
      });
      setServiceError(null);
      reset();
      setIsDialogOpen(false);
    } catch (error: any) {
      const message =
        error?.response?.data?.message || error?.message || "Error al crear el suministro";
      setServiceError(message);
    }
  };

  useEffect(() => {
    if (serviceError) setServiceError(null);
  }, [modalValues.name, modalValues.unit, modalValues.categoryId]);

  useEffect(() => {
    if (!editingSupply) return;
    const selectedSupply = supplies.find(
      (s) => s.id === editingSupply.master_supply_id
    );
    if (selectedSupply) {
      setValue(name, selectedSupply.id);
      setValue(`supplies.${index}.unit`, selectedSupply.unit);
      setValue(`supplies.${index}.categoryId`, selectedSupply.category_id.toString());
      setValue(`supplies.${index}.productName`, selectedSupply.name);
    }
  }, [editingSupply, supplies]);

  useEffect(() => {
    if (!listRef.current) return;
    const listItems = listRef.current.children;
    if (listItems[highlightedIndex]) {
      (listItems[highlightedIndex] as HTMLElement).scrollIntoView({
        block: "nearest",
      });
    }
  }, [highlightedIndex]);

  if (isLoading) return <p className="text-sm text-muted-foreground">Cargando suministros…</p>;

  const filteredSupplies = search != ""
    ? supplies.filter((s) =>
      s.name.toLowerCase().includes(search.toLowerCase())
    )
    : supplies.slice(0, MAX_RESULTS);

  const handleKeyDown = (e: React.KeyboardEvent, field?: any) => {
    if (!filteredSupplies.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev + 1) % filteredSupplies.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev - 1 + filteredSupplies.length) % filteredSupplies.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const supply = filteredSupplies[highlightedIndex];
      if (supply) selectSupply(supply, field);
    } else if (e.key === "Escape") {
      setSearch("");
    }
  };

  const selectSupply = (supply: any, field?: any) => {
    setValue(`supplies.${index}.unit`, supply.unit);
    setValue(`supplies.${index}.categoryId`, supply.category_id.toString());
    setValue(`supplies.${index}.productName`, supply.name);
    setValue(`supplies.${index}.master_supply_id`, supply.id);
    if (field) field.onChange(supply.id);
    setSearch("");
    setHighlightedIndex(0);
    setIsFocused(false);
  };

  return (
    <div className="space-y-2 relative">
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium">Suministro *</label>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setIsDialogOpen(true)}
          className="h-7 text-xs"
        >
          <Plus className="h-3 w-3 mr-1" /> Nuevo
        </Button>
      </div>

      <Controller
        name={name}
        control={control}
        rules={{ required: "El suministro es requerido" }}
        render={({ field }) => {
          const selectedSupply = supplies.find((s) => s.id === field.value);

          return (
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                placeholder="Buscar suministro..."
                value={search !== "" ? search : selectedSupply?.name || ""}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setHighlightedIndex(0);
                }}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setTimeout(() => setIsFocused(false), 150)} // timeout permite click en la lista
                onKeyDown={(e) => { handleKeyDown(e, field) }}
                className="
                  w-full px-3 py-2 rounded-md
                  border border-border
                  bg-background
                  text-foreground
                  placeholder:text-muted-foreground

                  focus:outline-none
                  focus:ring-2
                  focus:ring-ring
                  focus:border-ring
                "
              />

              {isFocused && filteredSupplies.length > 0 && (
                <ul
                  ref={listRef}
                  className="
                  absolute z-10 w-full mt-1
                  max-h-40 overflow-y-auto
                  rounded-md
                  border border-border
                  bg-popover
                  text-popover-foreground
                  shadow-lg
                "
                >
                  {filteredSupplies.map((s, idx) => (
                    <li
                      key={s.id}
                      className={`
                        px-3 py-2 cursor-pointer
                        text-foreground
                        transition-colors

                        hover:bg-accent
                        hover:text-accent-foreground

                        ${idx === highlightedIndex ? "bg-accent text-accent-foreground" : ""}
                      `}
                      onMouseDown={() => selectSupply(s, field)}
                    >
                      {s.name} ({s.category_name})
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        }}
      />
      {errors?.supplies?.[index]?.supply_id && (
        <p className="text-destructive text-sm mt-1">
          {errors.supplies[index].supply_id?.message}
        </p>
      )}

      {/* Modal para crear nuevo suministro */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Nuevo Suministro</DialogTitle>
          </DialogHeader>

          <form className="space-y-3 mt-2">
            <label className="block text-sm font-medium mb-2">Nombre del producto</label>
            <input
              type="text"
              placeholder="Nombre del producto"
              {...register("name", { required: "El nombre del producto es requerido" })}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
            />

            <CustomSelectWithCreate
              label="Categoría"
              name="categoryId"
              options={categories || []}
              register={register}
              errors={errors}
              onCreate={async (name: string) => {
                await createCategory(name);
              }}
            />

            <label className="block text-sm font-medium mb-2">Unidad</label>
            <select
              {...register("unit", { required: "La unidad es requerida" })}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Selecciona una unidad</option>
              {UNITS.map((u) => (
                <option key={u.value} value={u.value}>
                  {u.label}
                </option>
              ))}
            </select>

            {serviceError && <p className="text-destructive text-sm mt-2">{serviceError}</p>}

            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="button" onClick={handleAddNewSupply}>
                <Plus className="w-4 h-4" /> Agregar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
