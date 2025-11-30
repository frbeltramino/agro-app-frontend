"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trash2, Plus } from "lucide-react"

interface Sale {
  id: string
  date: string
  product: string
  quantity: number
  price: number
  total: number
}

export const SalesRecorder = () => {
  const [sales, setSales] = useState<Sale[]>([
    { id: "1", date: "2024-01-15", product: "Laptop Dell XPS", quantity: 2, price: 1299.99, total: 2599.98 },
    { id: "2", date: "2024-01-14", product: "Mouse Inalámbrico", quantity: 10, price: 29.99, total: 299.9 },
    { id: "3", date: "2024-01-13", product: "Teclado Mecánico", quantity: 5, price: 89.99, total: 449.95 },
  ])
  const [newSale, setNewSale] = useState({ product: "", quantity: "", price: "" })

  const handleAddSale = () => {
    if (newSale.product && newSale.quantity && newSale.price) {
      const sale: Sale = {
        id: Math.random().toString(),
        date: new Date().toISOString().split("T")[0],
        product: newSale.product,
        quantity: Number.parseInt(newSale.quantity),
        price: Number.parseFloat(newSale.price),
        total: Number.parseInt(newSale.quantity) * Number.parseFloat(newSale.price),
      }
      setSales([sale, ...sales])
      setNewSale({ product: "", quantity: "", price: "" })
    }
  }

  const handleDelete = (id: string) => {
    setSales(sales.filter((s) => s.id !== id))
  }

  const totalIncome = sales.reduce((sum, sale) => sum + sale.total, 0)

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Nueva Venta</CardTitle>
          <CardDescription>Registra una nueva transacción de venta</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="Producto"
              value={newSale.product}
              onChange={(e) => setNewSale({ ...newSale, product: e.target.value })}
            />
            <Input
              placeholder="Cantidad"
              type="number"
              value={newSale.quantity}
              onChange={(e) => setNewSale({ ...newSale, quantity: e.target.value })}
            />
            <Input
              placeholder="Precio unitario"
              type="number"
              value={newSale.price}
              onChange={(e) => setNewSale({ ...newSale, price: e.target.value })}
            />
            <Button onClick={handleAddSale} className="gap-2">
              <Plus className="h-4 w-4" />
              Registrar
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Ventas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalIncome.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Transacciones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sales.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Promedio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(totalIncome / sales.length || 0).toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historial de Ventas</CardTitle>
          <CardDescription>Últimas transacciones registradas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>Fecha</TableHeader>
                  <TableHeader>Producto</TableHeader>
                  <TableHeader>Cantidad</TableHeader>
                  <TableHeader>Precio Unit.</TableHeader>
                  <TableHeader>Total</TableHeader>
                  <TableHeader>Acción</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {sales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell>{sale.date}</TableCell>
                    <TableCell className="font-medium">{sale.product}</TableCell>
                    <TableCell>{sale.quantity}</TableCell>
                    <TableCell>${sale.price.toFixed(2)}</TableCell>
                    <TableCell className="font-bold text-primary">${sale.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(sale.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
