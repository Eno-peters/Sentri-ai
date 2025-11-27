import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  iconColor?: string;
}

export function StatsCard({ title, value, icon: Icon, iconColor = "text-primary" }: StatsCardProps) {
  return (
    <Card className="p-6 transition-all hover:shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-3xl font-bold mt-2">{value.toLocaleString()}</h3>
        </div>
        <div className={`p-3 rounded-lg bg-secondary ${iconColor}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </Card>
  );
}
