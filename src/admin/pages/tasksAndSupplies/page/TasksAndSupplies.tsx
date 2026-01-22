
import { Wrench, CheckCircle, Boxes, Coins } from "lucide-react";

import { Breadcrumbs } from "../../../components/Breadcrumbs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCampaignStore } from "../../../store/campaign.store";
import { useLotStore } from "../../../store/lot.store";
import { useCropStore } from "../../../store/crop.store";
import { CustomFullScreenLoading } from "@/components/custom/CustomFullScreenLoading";
import { useTasks } from "../../../hooks/useTasks";
import { CustomNoResultsScreen } from "@/components/custom/CustomNoResultsScreen";
import { useSupply } from "../../../hooks/useSupply";
import { TasksCard } from "../components/TasksCard";
import { SuppliesCard } from "../components/SuppliesCard";
import { StatCard } from "@/admin/components/StatCard";
import { PageHeader } from "@/admin/components/PageHeader";
import { formatCurrency } from "@/lib/currency-formatter-usd";


export const TasksAndSupplies = () => {
  const { selectedCampaign } = useCampaignStore();
  const { selectedLot } = useLotStore()
  const { selectedCrop } = useCropStore();

  if (!selectedCrop) return <CustomFullScreenLoading />;

  const { data: tasksData, isLoading, isError } = useTasks({ cropId: selectedCrop.id });

  const { data: suppliesData, isLoading: isLoadingSupplies, isError: isErrorSupplies } = useSupply({ cropId: selectedCrop.id });

  if (isError || isErrorSupplies) return <CustomNoResultsScreen message="Los trabajos no pudieron ser cargados" />;

  if (isLoading || isLoadingSupplies) return <CustomFullScreenLoading />;



  const calcultateTotalCost = () => {
    const safeNum = (val: any) => {
      const n = Number(val);
      return isNaN(n) ? 0 : n;
    };

    const totalCostTasks = tasksData?.tasks.reduce(
      (acc, work) => acc + safeNum(work.laborCost),
      0
    );

    const totalCostSupplies = tasksData?.tasks.reduce(
      (acc, task) =>
        acc +
        (task.supplies?.reduce(
          (sum, supply) => sum + safeNum(supply.price_per_unit) * (safeNum(supply.dose_per_ha) * safeNum(supply.hectares)),
          0
        ) || 0),
      0
    );

    const total = (totalCostTasks || 0) + (totalCostSupplies || 0);
    return formatCurrency(total);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Breadcrumbs
        items={[
          { label: selectedCampaign?.name || "Campañas", href: "/admin/campaigns" },
          { label: selectedLot?.name || "Lotes", href: `/admin/campaigns/${selectedCampaign?.id}/lots` },
          { label: selectedCrop?.crop_name || "Cultivos", href: `/admin/campaigns/${selectedCampaign?.id}/lots/${selectedLot?.id}/crops` },
          { label: "Labores e Insumos", href: `/admin/campaigns/${selectedCampaign?.id}/lots/${selectedLot?.id}/crops/${selectedCrop?.id}/TasksAndSupplies` },
        ]}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeader title="Labores e Insumos" subtitle="Gestiona las Labores realizadas y los insumos utilizados" />
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          title="Total Labores"
          value={tasksData?.total || 0}
          icon={<Wrench className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard
          title="Completadas"
          value={tasksData?.tasks.length || 0}
          icon={<CheckCircle className="h-4 w-4 text-green-600" />}
        />
        <StatCard
          title="Insumos"
          value={suppliesData?.total || 0}
          icon={<Boxes className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard
          title="Costo Total"
          value={calcultateTotalCost()}
          icon={<Coins className="h-4 w-4 text-muted-foreground" />}
          tooltipContent="Incluye mano de obra + insumos utilizados en las tareas"
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="works" className="space-y-4">
        <TabsList>
          <TabsTrigger value="works">Labores Realizadas</TabsTrigger>
          <TabsTrigger value="products">Insumos Utilizados</TabsTrigger>
        </TabsList>

        <TabsContent value="works" className="space-y-4">
          <TasksCard />
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <SuppliesCard />

        </TabsContent>
      </Tabs>
    </div>
  );
};


