interface StepIndicatorProps {
  step: number;
  totalSteps: number;
}

export function StepIndicator({ step, totalSteps }: StepIndicatorProps) {
  const percentage = (step / totalSteps) * 100;

  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm font-medium mb-1">
        {[...Array(totalSteps)].map((_, i) => (
          <span key={i} className={i + 1 === step ? "text-primary" : "text-muted-foreground"}>
            Paso {i + 1}
          </span>
        ))}
      </div>
      <div className="w-full h-2 bg-muted rounded-full">
        <div
          className="h-2 bg-primary rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
