import { SERVICES, SUB_SERVICES } from "@/constants/catalog";
import { ChevronDown, ChevronUp, Settings } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

export function ServiceListPage() {
  const [expandedService, setExpandedService] = useState<string | null>(null);

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

      <div className="space-y-3">
        {SERVICES.map((service, i) => {
          const subServices = SUB_SERVICES.filter(
            (ss) => ss.serviceId === service.id,
          );
          const isExpanded = expandedService === service.id;

          return (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl border border-border bg-card shadow-xs overflow-hidden"
            >
              <button
                type="button"
                onClick={() =>
                  setExpandedService(isExpanded ? null : service.id)
                }
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
                    <p className="text-xs text-muted-foreground">
                      {subServices.length} sub-services
                    </p>
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                )}
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-border">
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
                          {subServices.map((sub, j) => (
                            <motion.tr
                              key={sub.id}
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
                                  ₹{sub.price.toLocaleString("en-IN")}
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
                                <span
                                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
                                    sub.pricingType === "fixed"
                                      ? "bg-blue-50 text-blue-700 border-blue-200"
                                      : sub.pricingType === "per_sqft"
                                        ? "bg-amber-50 text-amber-700 border-amber-200"
                                        : "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  }`}
                                >
                                  {sub.pricingType === "fixed"
                                    ? "Fixed"
                                    : sub.pricingType === "per_sqft"
                                      ? "Per Sq Ft"
                                      : "Per Acre"}
                                </span>
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
