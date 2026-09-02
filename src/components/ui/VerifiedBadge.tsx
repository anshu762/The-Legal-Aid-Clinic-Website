import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";

export function VerifiedBadge() {
  return (
    <Badge variant="secondary" className="flex items-center gap-1 bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 shadow-sm transition-colors cursor-default">
      <CheckCircle className="w-3 h-3" />
      <span>Verified Advisor</span>
    </Badge>
  );
}
