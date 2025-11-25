import { CardTitle, CardDescription } from "@/components/ui/card";

interface Props {
  title: string;
  count: number;
  label: string;
}

export const CardTitleSummary = ({ title, count, label }: Props) => (
  <>
    <CardTitle>{title}</CardTitle>
    <CardDescription>
      {count} {label}
    </CardDescription>
  </>
)