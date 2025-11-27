import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";

interface SelectWithCreateProps {
  label: string;
  name: string;
  options: { id: number | string; name: string }[];
  register: any; // del react-hook-form
  errors: any;
  onCreate?: (newValue: string) => Promise<void>;
  mb?: string
  selectHeight?: string
}

export const CustomSelectWithCreate = ({
  label,
  name,
  options,
  register,
  errors,
  onCreate,
  mb,
  selectHeight
}: SelectWithCreateProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newValue, setNewValue] = useState("");

  const handleAdd = async () => {
    if (!newValue.trim() || !onCreate) return;
    await onCreate(newValue.trim());
    setNewValue("");
    setIsAdding(false);
  };

  return (
    <div>
      <div className={`flex items-center justify-between ${mb ? `mb-${mb}` : "mb-2"}`}>
        <label className="block text-sm font-medium">{label} *</label>

        {onCreate && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setIsAdding(!isAdding)}
            className="h-7 text-xs"
          >
            {isAdding ? (
              <>
                <X className="h-3 w-3 mr-1" />
                Cancelar
              </>
            ) : (
              <>
                <Plus className="h-3 w-3 mr-1" />
                Nuevo
              </>
            )}
          </Button>
        )}
      </div>

      {isAdding && (
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && (e.preventDefault(), handleAdd())
            }
            className="flex-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder={`Nuevo ${label.toLowerCase()}`}
          />
          <Button
            type="button"
            onClick={handleAdd}
            disabled={!newValue.trim()}
            size="sm"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      )}

      <select
        {...register(name, { required: `${label} es requerida` })}
        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent ${selectHeight ? selectHeight : ""}`}
      >
        <option value="">Selecciona {label.toLowerCase()}</option>
        {options.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.name}
          </option>
        ))}
      </select>

      {errors[name] && (
        <p className="text-destructive text-sm mt-1">{errors[name].message}</p>
      )}
    </div>
  );
};