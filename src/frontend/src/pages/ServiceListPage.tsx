import type { SubService } from "@/backend";
import { useGetServices, useGetSubServicesByService } from "@/hooks/useQueries";
import { ChevronDown, ChevronUp, Settings } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

function PricingBadge({ pricingType }: { pricingType: string }) {
  const config =
    pricingType === "per_sqft"
      ? {
          label: "Per Sq Ft",
          className: "bg-amber-50 text-amber-700 border-amber-200",
        }
      : pricingType === "per_acre"
        ? {
            label: "Per Acre",
            className: "bg-emerald-50 text-emerald-700 border-emerald-200",
          }
        : pricingType === "custom"
          ? {
              label: "Custom",
              className: "bg-purple-50 text-purple-700 border-purple-200",
            }
          : {
              label: "Fixed",
              className: "bg-blue-50 text-blue-700 border-blue-200",
            };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${config.className}`}
    >
      {config.label}
    </span>
  );
}

function ServiceRow({
  service,
  index,
}: {
  service: {
    id: bigint;
    name: string;
    category: string;
    basePrice: bigint;
    pricingType: string;
  };
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);

  const { data: subServices = [], isLoading } = useGetSubServicesByService(
    expanded ? service.id : null,
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="rounded-xl border border-[#E5E7EB] bg-white shadow-xs overflow-hidden"
    >
      <button
        type="button"
        onClick={() => setExpanded((p) => !p)}
        className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Settings className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-foreground text-sm">
              {service.name}
            </p>
            <p className="text-xs text-muted-foreground">{service.category}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <PricingBadge pricingType={service.pricingType} />
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="border-t border-border">
              {isLoading ? (
                <p className="px-4 py-3 text-xs text-muted-foreground">
                  Loading sub-services...
                </p>
              ) : subServices.length === 0 ? (
                <p className="px-4 py-3 text-xs text-muted-foreground italic">
                  No sub-services found.
                </p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/30">
                      <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">
                        Sub-Service
                      </th>
                      <th className="text-right px-4 py-2.5 text-xs font-semibold text-muted-foreground">
                        Price
                      </th>
                      <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground hidden sm:table-cell">
                        Pricing Type
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {subServices.map((sub: SubService, j: number) => (
                      <motion.tr
                        key={String(sub.id)}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: j * 0.03 }}
                        className="border-t border-border/40 hover:bg-muted/10 transition-colors"
                      >
                        <td className="px-4 py-2.5">
                          <p className="text-foreground font-medium text-xs">
                            {sub.name}
                          </p>
                        </td>
                        <td className="px-4 py-2.5 text-right">
                          <span className="font-semibold text-foreground text-xs">
                            ₹{Number(sub.basePrice).toLocaleString("en-IN")}
                            {sub.pricingType !== "fixed" && (
                              <span className="font-normal text-muted-foreground ml-1">
                                /
                                {sub.pricingType === "per_sqft"
                                  ? "sqft"
                                  : "acre"}
                              </span>
                            )}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 hidden sm:table-cell">
                          <PricingBadge pricingType={sub.pricingType} />
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function ServiceListPage() {
  const { data: services = [], isLoading } = useGetServices();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-foreground">
          Service List
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Browse all available services and their sub-services with pricing.
        </p>
      </div>

      {isLoading && (
        <p className="text-sm text-muted-foreground">Loading services...</p>
      )}

      {!isLoading && services.length === 0 && (
        <div className="rounded-xl border border-dashed border-[#E5E7EB] bg-white p-10 text-center">
          <Settings className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            No services available.
          </p>
          <p className="text-xs text-muted-foreground/60 mt-0.5">
            Add services from the Service Management page.
          </p>
        </div>
      )}

      <div className="space-y-3">
        {services.map((service, i) => (
          <ServiceRow key={String(service.id)} service={service} index={i} />
        ))}
      </div>
    </div>
  );
}
