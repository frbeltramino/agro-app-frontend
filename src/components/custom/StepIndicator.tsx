interface StepperProps {
  step: number;       // Paso actual (1 o 2)
  steps: string[];    // Nombres de los pasos
}

export function Stepper({ step, steps }: StepperProps) {
  return (
    <div className="flex items-center justify-center gap-2 pt-4">
      {steps.map((label, index) => {
        const isActive = step === index + 1;
        const isCompleted = step > index + 1;

        return (
          <div key={index} className="flex-1 flex items-center">
            {/* Círculo */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center border-2
                ${isActive
                  ? "border-primary bg-primary text-black shadow-lg"
                  : isCompleted
                    ? "border-green-600 bg-green-600 text-white"
                    : "border-gray-400 bg-gray-100 text-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400"
                }`}
            >
              {index + 1}
            </div>

            {/* Texto */}
            <span className={`ml-2 text-sm font-medium 
              ${isActive
                ? "text-primary dark:text-primary"
                : isCompleted
                  ? "text-green-600 dark:text-green-400"
                  : "text-gray-600 dark:text-gray-300"
              }`}
            >
              {label}
            </span>

            {/* Línea de conexión */}
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-1 mx-2 rounded
                  ${isCompleted ? "bg-green-600" : "bg-gray-300 dark:bg-gray-700"}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
