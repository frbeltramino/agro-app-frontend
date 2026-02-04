// 1️⃣ React / librerías externas
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";

// 2️⃣ Hooks
import { useCampaigns } from "@/admin/hooks/useCampaigns";
import { useLotsForVariableExpenses } from "@/admin/hooks/useLotsForVariableExpenses";
import { useVariableExpenseTypes } from "@/admin/hooks/useVariableExpenseTypes";
import { useVariableExpenses } from "@/admin/hooks/useVariableExpenses";

// 3️⃣ UI Components
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// 4️⃣ Custom / Page components
import { PageHeader } from "../../../components/PageHeader";
import { VariableExpenseTable } from "../components/VariableExpenseTable";
import { VariableExpenseFormPanel } from "../components/VariableExpenseFormPanel";
import { CustomLoadingCard } from "@/components/custom/CustomLoadingCard";

// 5️⃣ Interfaces / types
import { VariableExpenseFormData } from "@/interfaces/variableExpenses/variable-expenses";
import { Lot } from "@/interfaces/variableExpenses/variable.expenses.lots.response";
import { VariableExpense } from "@/interfaces/variableExpenses/variable.expenses.response";
import { useCampaignStore } from "../store/campaignStore";
import { CustomTasksSuppliesPagination } from "@/components/custom/CustomTasksSuppliesPagination";


export const VariableExpenses = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { selectedCampaign, setSelectedCampaign } = useCampaignStore();
  const [expenses, setExpenses] = useState<any[]>([]);
  const [expensesPagination, setExpensesPagination] = useState<any>({});
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<VariableExpense | null>(null);
  const [expenseToDelete, setExpenseToDelete] = useState<VariableExpense | null>(null);
  const [formLots, setFormLots] = useState<Lot[]>([]);
  const [formCampaignId, setFormCampaignId] = useState<number>(0);
  const { data: campaignsData, isLoading: isLoadingCampaigns } = useCampaigns();

  const { data: lotsForVariableExpensesData } = useLotsForVariableExpenses({ campaignId: formCampaignId });
  const { data: variableExpenseTypesData } = useVariableExpenseTypes();

  const campaigns = campaignsData?.campaigns || [];

  const variableExpenseTypes = variableExpenseTypesData?.expenseTypes || [];

  const { data: expensesData, isLoading: isLoadingExpenses, createVariableExpense, deleteVariableExpense } = useVariableExpenses({
    campaignId: Number(selectedCampaign),
    page: currentPage,
  });

  const handleCampaignChange = (campaignId: string) => {
    setSelectedCampaign(campaignId);
  };

  const handleFormCampaignChange = (campaignId: number) => {
    setFormCampaignId(campaignId);
  };

  useEffect(() => {
    if (lotsForVariableExpensesData?.lots) {
      setFormLots(lotsForVariableExpensesData.lots);
    }
  }, [lotsForVariableExpensesData]);

  useEffect(() => {
    if (expensesData?.variableExpenses) {
      setExpenses(expensesData.variableExpenses);
      setExpensesPagination(expensesData.pagination);
      if (selectedCampaign) {
        handleFormCampaignChange(Number(selectedCampaign))
      }
    } else {
      setExpenses([]);
    }
  }, [expensesData]);

  useEffect(() => {
    if (campaigns.length > 0) {
      setSelectedCampaign(campaigns[0].id.toString());
    }
  }, [campaigns, selectedCampaign, setSelectedCampaign]);

  const handleEdit = (expense: VariableExpense) => {
    setEditingExpense(expense);
    // setFormLots(mockLots[expense.campaign_id] || []);
    setIsFormOpen(true);
  };

  const handleDelete = (expense: VariableExpense) => {
    setExpenseToDelete(expense);
  };

  const confirmDelete = () => {
    if (expenseToDelete) {
      // Aquí llamarías al servicio para eliminar
      if (!expenseToDelete.id) {
        return;
      }
      deleteVariableExpense.mutate(expenseToDelete.id);

      setExpenseToDelete(null);
    }
  };

  const handleFormSubmit = (data: VariableExpenseFormData) => {

    const newExpense: any = {
      id: editingExpense ? editingExpense.id : null,
      campaign_id: data.campaign_id!,
      lot_id: data.lot_id!,
      hectares: data.hectares,
      tons_harvested: data.tons_harvested,
      expense_type_id: data.expense_type_id!,
      provider: data.provider || "",
      expense_date: data.expense_date,
      amount: data.amount ? data.amount : 0,
      deleted_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    createVariableExpense.mutate(newExpense);

    setIsFormOpen(false);
    setEditingExpense(null);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingExpense(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4">
        <header className=" bg-background">
          <div className="container mx-auto py-4 md:py-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

              <PageHeader
                title="Gastos Variables"
                subtitle="Gestiona los gastos variables de tus campañas"
              />

            </div>
          </div>
        </header>
        {/* Filtros y acciones */}
        <div className="flex flex-col-reverse sm:flex-row gap-4 mb-6 items-stretch sm:items-center justify-between">
          <div className="w-full sm:w-72">
            <Select
              value={selectedCampaign}
              onValueChange={handleCampaignChange}
              disabled={isLoadingCampaigns}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleccionar campaña" />
              </SelectTrigger>
              <SelectContent>
                {campaigns.map((campaign) => (
                  <SelectItem key={campaign.id} value={campaign.id.toString()}>
                    {campaign.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={() => setIsFormOpen(true)}
            className="w-full sm:w-auto gap-2"
          >
            <Plus className="h-4 w-4" />
            Nuevo Gasto
          </Button>
        </div>

        {/* Tabla o mensaje vacío */}
        {
          isLoadingExpenses && <CustomLoadingCard />
        }
        {!isLoadingExpenses && selectedCampaign ? (
          <>
            <VariableExpenseTable
              expenses={expenses}
              expensesPagination={expensesPagination}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
            {expensesPagination?.totalPages > 1 && (
              <CustomTasksSuppliesPagination
                totalPages={expensesPagination.totalPages}
                currentPage={currentPage}
                onPageChange={(page) => setCurrentPage(page)} // al cambiar página
              />
            )}
          </>


        ) : (
          <div className="text-center py-16 text-muted-foreground bg-card rounded-lg border">
            <p className="text-lg">Selecciona una campaña para ver los gastos variables</p>
          </div>
        )}

        {/* Panel de formulario */}
        <VariableExpenseFormPanel
          open={isFormOpen}
          onClose={handleCloseForm}
          onSubmit={handleFormSubmit}
          editingExpense={editingExpense}
          campaigns={campaigns}
          lots={formLots}
          expenseTypes={variableExpenseTypes}
          onCampaignChange={handleFormCampaignChange}
        />


        {/* Diálogo de confirmación de eliminación */}
        <AlertDialog
          open={!!expenseToDelete}
          onOpenChange={() => setExpenseToDelete(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Eliminar gasto variable?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción no se puede deshacer. El gasto será eliminado permanentemente.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <div className="sm:hidden left-0 w-full h-12"></div>
    </div>
  );
};


