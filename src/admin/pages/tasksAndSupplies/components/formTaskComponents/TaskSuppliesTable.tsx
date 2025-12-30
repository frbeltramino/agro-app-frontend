import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";

interface Props {
  supplies: any[];
  isAddingSupply?: boolean;
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
}

export function TaskSuppliesTable({ supplies, isAddingSupply, onEdit, onDelete }: Props) {
  console.log({ supplies })

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Mobile view */}
      <div className="md:hidden divide-y">
        {supplies.map((s, index) => (
          <div key={index} className="p-3 space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-sm">{s.productName || s.stockName || "Suministro"}</p>
                <p className="text-xs text-muted-foreground">{s.supplyType === "stock" ? "De Stock" : "Compra"}</p>
              </div>
              <div className="flex gap-1">
                <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEdit(index)} disabled={isAddingSupply}>
                  <Edit2 className="w-3.5 h-3.5" />
                </Button>
                <Button type="button" variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => onDelete(index)} disabled={isAddingSupply}>
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Unidad</p>
                <p className="font-medium">{s.unit}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Dosis / Hectárea</p>
                <p className="font-medium">{s.dosagePerHectare}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <Table className="w-full table-fixed">
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="text-right">Unidad</TableHead>
              <TableHead className="text-right">Dosis/Hectárea</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {supplies.map((s, index) => (
              <TableRow key={index}>
                <TableCell>{s.productName || s.stockName || "Suministro"}</TableCell>
                <TableCell>{s.supplyType === "stock" ? "De Stock" : "Compra"}</TableCell>
                <TableCell className="text-right">{s.unit}</TableCell>
                <TableCell className="text-right">{s.dosagePerHectare}</TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-1 justify-end">
                    <Button type="button" variant="ghost" size="sm" onClick={() => onEdit(index)} disabled={isAddingSupply}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button type="button" variant="ghost" size="sm" onClick={() => onDelete(index)} disabled={isAddingSupply}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
