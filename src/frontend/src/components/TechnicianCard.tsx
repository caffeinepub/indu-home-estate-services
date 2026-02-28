import type { Technician } from "@/backend";
import { Button } from "@/components/ui/button";
import { useDeactivateTechnician } from "@/hooks/useQueries";
import { Ban, Loader2, Phone, Wrench } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";

interface TechnicianCardProps {
  tech: Technician;
  index: number;
  isAdmin: boolean;
}

export function TechnicianCard({ tech, index, isAdmin }: TechnicianCardProps) {
  const { mutateAsync: deactivateTechnician, isPending: isDeactivating } =
    useDeactivateTechnician();

  const handleDeactivate = async () => {
    try {
      await deactivateTechnician({ technicianId: tech.id });
      toast.success(`Technician "${tech.name}" deactivated`);
    } catch {
      toast.error("Failed to deactivate technician.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.05 }}
      className="flex items-center gap-4 px-4 py-3 rounded-lg bg-card border border-border hover:border-primary/30 transition-colors"
    >
      <div className="w-9 h-9 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
        <Wrench className="w-4 h-4 text-emerald-700" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-foreground truncate">{tech.name}</p>
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <Phone className="w-3 h-3" />
          {tech.phone}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          Assigned: {String(tech.totalAssigned)} | Completed:{" "}
          {String(tech.totalCompleted)}
        </p>
      </div>
      <span className="text-xs text-muted-foreground font-mono hidden sm:block">
        ID #{String(tech.id)}
      </span>
      <div className="flex items-center gap-2">
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
            tech.activeStatus
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-muted text-muted-foreground border-border"
          }`}
        >
          {tech.activeStatus ? "Active" : "Inactive"}
        </span>
        {isAdmin && tech.activeStatus && (
          <Button
            size="sm"
            variant="outline"
            className="h-6 text-xs px-2 border-red-200 text-red-600 hover:bg-red-50"
            onClick={handleDeactivate}
            disabled={isDeactivating}
          >
            {isDeactivating ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Ban className="h-3 w-3" />
            )}
            <span className="ml-1 hidden sm:inline">Deactivate</span>
          </Button>
        )}
      </div>
    </motion.div>
  );
}
