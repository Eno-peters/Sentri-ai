import { Badge } from "@/components/ui/badge";

interface RiskBadgeProps {
  risk: 'High' | 'Low' | null;
}

export function RiskBadge({ risk }: RiskBadgeProps) {
  if (risk === 'High') {
    return (
      <Badge variant="destructive" className="font-semibold">
        High Risk
      </Badge>
    );
  }
  
  if (risk === 'Low') {
    return (
      <Badge className="bg-success text-success-foreground hover:bg-success/90 font-semibold">
        On Track
      </Badge>
    );
  }
  
  return (
    <Badge variant="secondary" className="font-semibold">
      Processing...
    </Badge>
  );
}
