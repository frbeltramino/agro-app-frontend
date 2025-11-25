
export const CustomLoadingCard = () => {
  return (
    <div className="flex w-full justify-center py-8">
      <div className="flex flex-col items-center gap-2">
        {/* Spinner */}
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-sm font-medium text-muted-foreground">Cargando...</p>
      </div>
    </div>
  );
};
