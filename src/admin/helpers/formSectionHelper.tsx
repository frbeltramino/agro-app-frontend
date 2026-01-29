import { cn } from "@/lib/utils";

interface FormSectionProps {
  children: React.ReactNode;
  className?: string;
}

export const FormSection = ({ children, className }: FormSectionProps) => (
  <div className={cn("py-4 sm:py-6", className)}>
    {children}
  </div>
);
