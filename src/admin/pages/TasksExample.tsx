// import { useState } from "react";
// import { useParams } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import { Plus, Search, Edit, Trash2, Wrench, Package, ChevronDown, ChevronRight } from "lucide-react";
// import { toast } from "sonner";
// import { Breadcrumbs } from "@/components/Breadcrumbs";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

// // Mock data con productos asociados
// const mockWorks = [
//   {
//     id: "1",
//     type: "Aplicación",
//     description: "Herbicida pre-emergente",
//     date: "2024-01-22",
//     cost: 15000,
//     status: "completed",
//     products: [
//       { id: "1", name: "Glifosato 48%", type: "Herbicida", quantity: 15, unit: "L", cost_per_unit: 800, total_cost: 12000 },
//       { id: "2", name: "Adherente", type: "Coadyuvante", quantity: 2, unit: "L", cost_per_unit: 600, total_cost: 1200 },
//       { id: "3", name: "Agua", type: "Diluyente", quantity: 200, unit: "L", cost_per_unit: 5, total_cost: 1000 },
//     ]
//   },
//   {
//     id: "2",
//     type: "Fertilización",
//     description: "Fertilizante base NPK",
//     date: "2024-01-25",
//     cost: 25000,
//     status: "completed",
//     products: [
//       { id: "4", name: "Urea Granulada", type: "Fertilizante", quantity: 250, unit: "kg", cost_per_unit: 90, total_cost: 22500 },
//       { id: "5", name: "Fosfato Diamónico", type: "Fertilizante", quantity: 100, unit: "kg", cost_per_unit: 120, total_cost: 12000 },
//       { id: "6", name: "Cloruro de Potasio", type: "Fertilizante", quantity: 80, unit: "kg", cost_per_unit: 95, total_cost: 7600 },
//       { id: "7", name: "Sulfato de Zinc", type: "Micronutriente", quantity: 10, unit: "kg", cost_per_unit: 450, total_cost: 4500 },
//     ]
//   },
//   {
//     id: "3",
//     type: "Fumigación",
//     description: "Control de plagas",
//     date: "2024-03-10",
//     cost: 12000,
//     status: "completed",
//     products: [
//       { id: "8", name: "Insecticida Lambda", type: "Insecticida", quantity: 8, unit: "L", cost_per_unit: 1500, total_cost: 12000 },
//       { id: "9", name: "Aceite Mineral", type: "Coadyuvante", quantity: 5, unit: "L", cost_per_unit: 350, total_cost: 1750 },
//       { id: "10", name: "Surfactante", type: "Coadyuvante", quantity: 3, unit: "L", cost_per_unit: 280, total_cost: 840 },
//       { id: "11", name: "Regulador pH", type: "Corrector", quantity: 2, unit: "L", cost_per_unit: 420, total_cost: 840 },
//       { id: "12", name: "Anti-espumante", type: "Aditivo", quantity: 1, unit: "L", cost_per_unit: 320, total_cost: 320 },
//     ]
//   },
//   {
//     id: "4",
//     type: "Riego",
//     description: "Riego complementario",
//     date: "2024-04-15",
//     cost: 8000,
//     status: "pending",
//     products: [
//       { id: "13", name: "Fertilizante Líquido", type: "Fertilizante", quantity: 50, unit: "L", cost_per_unit: 150, total_cost: 7500 },
//       { id: "14", name: "Ácido Fosfórico", type: "Corrector", quantity: 10, unit: "L", cost_per_unit: 180, total_cost: 1800 },
//       { id: "15", name: "Quelato de Hierro", type: "Micronutriente", quantity: 5, unit: "kg", cost_per_unit: 650, total_cost: 3250 },
//       { id: "16", name: "Algas Marinas", type: "Bioestimulante", quantity: 8, unit: "L", cost_per_unit: 890, total_cost: 7120 },
//       { id: "17", name: "Calcio Líquido", type: "Nutriente", quantity: 15, unit: "L", cost_per_unit: 220, total_cost: 3300 },
//       { id: "18", name: "Boro Líquido", type: "Micronutriente", quantity: 3, unit: "L", cost_per_unit: 380, total_cost: 1140 },
//     ]
//   },
// ];

// const mockProducts = mockWorks.flatMap(work => work.products);

// export const Works = () => {
//   const { campaignId, lotId, plantingId } = useParams();
//   const [searchTerm, setSearchTerm] = useState("");
//   const [workTypeFilter, setWorkTypeFilter] = useState("all");
//   const [productSearchTerm, setProductSearchTerm] = useState("");
//   const [expandedWorks, setExpandedWorks] = useState<string[]>([]);

//   const toggleWorkExpansion = (workId: string) => {
//     setExpandedWorks(prev =>
//       prev.includes(workId)
//         ? prev.filter(id => id !== workId)
//         : [...prev, workId]
//     );
//   };

//   const filteredWorks = mockWorks.filter((work) => {
//     const matchesType = workTypeFilter === "all" || work.type === workTypeFilter;
//     const matchesSearch = work.description.toLowerCase().includes(searchTerm.toLowerCase());
//     return matchesType && matchesSearch;
//   });

//   const filteredProducts = mockProducts.filter((product) =>
//     product.name.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
//     product.type.toLowerCase().includes(productSearchTerm.toLowerCase())
//   );

//   type WorkStatus = "pending" | "in_progress" | "completed";

//   const getStatusBadge = (status: WorkStatus) => {
//     const variants: Record<WorkStatus, "secondary" | "default" | "outline"> = {
//       pending: "secondary",
//       in_progress: "default",
//       completed: "outline",
//     };

//     const labels: Record<WorkStatus, string> = {
//       pending: "Pendiente",
//       in_progress: "En Progreso",
//       completed: "Completado",
//     };

//     return <Badge variant={variants[status]}>{labels[status]}</Badge>;
//   };

//   return (
//     <div className="container mx-auto p-6 space-y-6">
 



  

//       {/* Tabs */}
//       <Tabs defaultValue="works" className="space-y-4">
//         <TabsList>
//           <TabsTrigger value="works">Trabajos Realizados</TabsTrigger>
//           <TabsTrigger value="products">Productos Utilizados</TabsTrigger>
//         </TabsList>

//         <TabsContent value="works" className="space-y-4">
//           <Card>
//             <CardHeader>
//               <div className="flex items-center justify-between">
//                 <div>
                
//                 </div>
              
//               </div>
            
//             </CardHeader>

//             <CardContent>
//               <div className="overflow-x-auto">
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead className="w-[50px]"></TableHead>
//                       <TableHead>Tipo</TableHead>
//                       <TableHead>Descripción</TableHead>
//                       <TableHead>Fecha</TableHead>
//                       <TableHead>Productos</TableHead>
//                       <TableHead>Costo</TableHead>
//                       <TableHead>Estado</TableHead>
//                       <TableHead className="text-right">Acciones</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {filteredWorks.map((work) => (
//                       <Collapsible key={work.id} open={expandedWorks.includes(work.id)}>
//                         <TableRow>
//                           <TableCell>
//                             <CollapsibleTrigger asChild>
//                               <Button
//                                 variant="ghost"
//                                 size="icon"
//                                 onClick={() => toggleWorkExpansion(work.id)}
//                               >
//                                 {expandedWorks.includes(work.id) ? (
//                                   <ChevronDown className="h-4 w-4" />
//                                 ) : (
//                                   <ChevronRight className="h-4 w-4" />
//                                 )}
//                               </Button>
//                             </CollapsibleTrigger>
//                           </TableCell>
//                           <TableCell className="font-medium">{work.type}</TableCell>
//                           <TableCell>{work.description}</TableCell>
//                           <TableCell>{new Date(work.date).toLocaleDateString()}</TableCell>
//                           <TableCell>
//                             <Badge variant="secondary">{work.products.length} productos</Badge>
//                           </TableCell>
//                           <TableCell>${work.cost.toLocaleString()}</TableCell>
//                           <TableCell>{getStatusBadge(work.status as WorkStatus)}</TableCell>
//                           <TableCell className="text-right">
//                             <div className="flex justify-end gap-2">
//                               <Button
//                                 variant="ghost"
//                                 size="icon"
//                                 onClick={() => toast.info("Función de editar próximamente")}
//                               >
//                                 <Edit className="h-4 w-4" />
//                               </Button>
//                               <Button
//                                 variant="ghost"
//                                 size="icon"
//                                 onClick={() => toast.info("Función de eliminar próximamente")}
//                               >
//                                 <Trash2 className="h-4 w-4" />
//                               </Button>
//                             </div>
//                           </TableCell>
//                         </TableRow>
//                         <CollapsibleContent asChild>
//                           <TableRow>
//                             <TableCell colSpan={8} className="bg-muted/30 p-0">
//                               <div className="p-4">
//                                 <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
//                                   <Package className="h-4 w-4" />
//                                   Productos utilizados en este trabajo
//                                 </h4>
//                                 <Table>
//                                   <TableHeader>
//                                     <TableRow>
//                                       <TableHead>Producto</TableHead>
//                                       <TableHead>Tipo</TableHead>
//                                       <TableHead>Cantidad</TableHead>
//                                       <TableHead>Costo/Unidad</TableHead>
//                                       <TableHead>Costo Total</TableHead>
//                                       <TableHead className="text-right">Acciones</TableHead>
//                                     </TableRow>
//                                   </TableHeader>
//                                   <TableBody>
//                                     {work.products.map((product) => (
//                                       <TableRow key={product.id}>
//                                         <TableCell className="font-medium">{product.name}</TableCell>
//                                         <TableCell>
//                                           <Badge variant="outline">{product.type}</Badge>
//                                         </TableCell>
//                                         <TableCell>
//                                           {product.quantity} {product.unit}
//                                         </TableCell>
//                                         <TableCell>${product.cost_per_unit.toLocaleString()}</TableCell>
//                                         <TableCell className="font-medium">
//                                           ${product.total_cost.toLocaleString()}
//                                         </TableCell>
//                                         <TableCell className="text-right">
//                                           <div className="flex justify-end gap-2">
//                                             <Button
//                                               variant="ghost"
//                                               size="icon"
//                                               onClick={() => toast.info("Función de editar producto próximamente")}
//                                             >
//                                               <Edit className="h-4 w-4" />
//                                             </Button>
//                                             <Button
//                                               variant="ghost"
//                                               size="icon"
//                                               onClick={() => toast.info("Función de eliminar producto próximamente")}
//                                             >
//                                               <Trash2 className="h-4 w-4" />
//                                             </Button>
//                                           </div>
//                                         </TableCell>
//                                       </TableRow>
//                                     ))}
//                                   </TableBody>
//                                 </Table>
//                               </div>
//                             </TableCell>
//                           </TableRow>
//                         </CollapsibleContent>
//                       </Collapsible>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value="products" className="space-y-4">
//           <Card>
//             <CardHeader>
//               <div className="flex items-center justify-between">
//                 <div>
//                   <CardTitle>Productos Utilizados</CardTitle>
//                   <CardDescription>
//                     {filteredProducts.length} productos registrados
//                   </CardDescription>
//                 </div>
//                 <Button
//                   onClick={() => toast.info("Función de agregar producto próximamente")}
//                 >
//                   <Plus className="mr-2 h-4 w-4" />
//                   Nuevo Producto
//                 </Button>
//               </div>
//               <div className="flex items-center gap-2 mt-4">
//                 <div className="relative flex-1">
//                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                   <Input
//                     placeholder="Buscar productos..."
//                     value={productSearchTerm}
//                     onChange={(e) => setProductSearchTerm(e.target.value)}
//                     className="pl-10"
//                   />
//                 </div>
//               </div>
//             </CardHeader>

//             <CardContent>
//               <div className="overflow-x-auto">
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead>Producto</TableHead>
//                       <TableHead>Tipo</TableHead>
//                       <TableHead>Cantidad</TableHead>
//                       <TableHead>Costo/Unidad</TableHead>
//                       <TableHead>Costo Total</TableHead>
//                       <TableHead className="text-right">Acciones</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {filteredProducts.map((product) => (
//                       <TableRow key={product.id}>
//                         <TableCell className="font-medium">{product.name}</TableCell>
//                         <TableCell>
//                           <Badge variant="outline">{product.type}</Badge>
//                         </TableCell>
//                         <TableCell>
//                           {product.quantity} {product.unit}
//                         </TableCell>
//                         <TableCell>${product.cost_per_unit.toLocaleString()}</TableCell>
//                         <TableCell className="font-medium">
//                           ${product.total_cost.toLocaleString()}
//                         </TableCell>
//                         <TableCell className="text-right">
//                           <div className="flex justify-end gap-2">
//                             <Button
//                               variant="ghost"
//                               size="icon"
//                               onClick={() => toast.info("Función de editar próximamente")}
//                             >
//                               <Edit className="h-4 w-4" />
//                             </Button>
//                             <Button
//                               variant="ghost"
//                               size="icon"
//                               onClick={() => toast.info("Función de eliminar próximamente")}
//                             >
//                               <Trash2 className="h-4 w-4" />
//                             </Button>
//                           </div>
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// };

// export default Works;