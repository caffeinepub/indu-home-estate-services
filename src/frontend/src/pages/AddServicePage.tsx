import { SERVICES, SUB_SERVICES } from "@/constants/catalog";
import { Info, Settings } from "lucide-react";
import { motion } from "motion/react";

export function AddServicePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-foreground">
          Add Service
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage the service catalog for the platform.
        </p>
      </div>

      {/* Notice */}
      <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
        <Info className="w-4 h-4 text-amber-700 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-medium text-amber-800">System Catalog</p>
          <p className="text-sm text-amber-700 mt-0.5">
            Services are defined in the system catalog. Contact the system
            administrator to add new services or sub-services to the catalog.
          </p>
        </div>
      </div>

      {/* Current services */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-muted-foreground" />
          <h2 className="font-semibold text-foreground text-sm">
            Current Services ({SERVICES.length})
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {SERVICES.map((service, i) => {
            const subCount = SUB_SERVICES.filter(
              (ss) => ss.serviceId === service.id,
            ).length;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-xl border border-border bg-card p-4 shadow-xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Settings className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                    {subCount} sub-services
                  </span>
                </div>
                <p className="font-semibold text-foreground mt-3 text-sm">
                  {service.name}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 font-mono">
                  {service.id}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
