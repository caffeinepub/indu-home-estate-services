import { TechnicianCard } from "@/components/TechnicianCard";
import { UserSkeleton } from "@/components/UserCard";
import { useGetTechnicians } from "@/hooks/useQueries";
import { Wrench } from "lucide-react";
import { motion } from "motion/react";

interface TechnicianListPageProps {
  isAdmin: boolean;
}

export function TechnicianListPage({ isAdmin }: TechnicianListPageProps) {
  const { data: technicians, isLoading } = useGetTechnicians();

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-foreground">
            Technician List
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage field technicians and their performance stats.
          </p>
        </div>
        {!isLoading && technicians && (
          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full shrink-0">
            {technicians.length}{" "}
            {technicians.length === 1 ? "technician" : "technicians"}
          </span>
        )}
      </div>

      {isLoading && (
        <div className="space-y-2">
          {[0, 1, 2].map((i) => (
            <UserSkeleton key={i} />
          ))}
        </div>
      )}

      {!isLoading && technicians && technicians.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 space-y-2"
        >
          <Wrench className="w-10 h-10 text-muted-foreground/30 mx-auto" />
          <p className="text-muted-foreground text-sm">No technicians yet.</p>
          <p className="text-muted-foreground/60 text-xs">
            Add technicians from the Add Technician page.
          </p>
        </motion.div>
      )}

      {!isLoading && technicians && technicians.length > 0 && (
        <div className="space-y-2">
          {technicians.map((tech, i) => (
            <TechnicianCard
              key={String(tech.id)}
              tech={tech}
              index={i}
              isAdmin={isAdmin}
            />
          ))}
        </div>
      )}
    </div>
  );
}
