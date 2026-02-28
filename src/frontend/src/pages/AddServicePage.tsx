import type { Service, SubService } from "@/backend";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useCreateService,
  useCreateSubService,
  useGetServices,
  useGetSubServicesByService,
} from "@/hooks/useQueries";
import { useQueryClient } from "@tanstack/react-query";
import {
  ChevronDown,
  ChevronUp,
  Loader2,
  Plus,
  Settings,
  Tag,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

// ─── Add Service Form ────────────────────────────────────────────
function AddServiceForm({ onCreated }: { onCreated: () => void }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [pricingType, setPricingType] = useState("fixed");
  const { mutateAsync: createService, isPending } = useCreateService();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Service name is required.");
      return;
    }
    if (!category.trim()) {
      toast.error("Category is required.");
      return;
    }
    const price = Number(basePrice);
    if (!basePrice || Number.isNaN(price) || price < 0) {
      toast.error("Please enter a valid base price.");
      return;
    }
    try {
      await createService({
        name: name.trim(),
        category: category.trim(),
        basePrice: BigInt(Math.round(price)),
        pricingType,
      });
      toast.success(`Service "${name.trim()}" created successfully.`);
      setName("");
      setCategory("");
      setBasePrice("");
      setPricingType("fixed");
      onCreated();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      toast.error(`Failed to create service: ${msg}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label
            htmlFor="svcName"
            className="text-sm font-medium text-foreground"
          >
            Service Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="svcName"
            placeholder="e.g. Plumbing"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isPending}
            className="bg-background"
          />
        </div>
        <div className="space-y-1.5">
          <Label
            htmlFor="svcCategory"
            className="text-sm font-medium text-foreground"
          >
            Category <span className="text-red-500">*</span>
          </Label>
          <Input
            id="svcCategory"
            placeholder="e.g. Home Repair"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={isPending}
            className="bg-background"
          />
        </div>
        <div className="space-y-1.5">
          <Label
            htmlFor="svcBasePrice"
            className="text-sm font-medium text-foreground"
          >
            Base Price (₹)
          </Label>
          <Input
            id="svcBasePrice"
            type="number"
            min="0"
            placeholder="e.g. 500"
            value={basePrice}
            onChange={(e) => setBasePrice(e.target.value)}
            disabled={isPending}
            className="bg-background"
          />
        </div>
        <div className="space-y-1.5">
          <Label
            htmlFor="svcPricingType"
            className="text-sm font-medium text-foreground"
          >
            Pricing Type
          </Label>
          <select
            id="svcPricingType"
            value={pricingType}
            onChange={(e) => setPricingType(e.target.value)}
            disabled={isPending}
            className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <option value="fixed">Fixed</option>
            <option value="per_sqft">Per Sq Ft</option>
            <option value="per_acre">Per Acre</option>
            <option value="custom">Custom / Site Estimate</option>
          </select>
        </div>
      </div>
      <Button type="submit" disabled={isPending} className="gap-2">
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Plus className="h-4 w-4" />
        )}
        Add Service
      </Button>
    </form>
  );
}

// ─── Add Sub-Service Form ────────────────────────────────────────
function AddSubServiceForm({
  service,
  onCreated,
}: {
  service: Service;
  onCreated: () => void;
}) {
  const [name, setName] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [pricingType, setPricingType] = useState("fixed");
  const { mutateAsync: createSubService, isPending } = useCreateSubService();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Sub-service name is required.");
      return;
    }
    const price = Number(basePrice);
    if (!basePrice || Number.isNaN(price) || price < 0) {
      toast.error("Please enter a valid base price.");
      return;
    }
    try {
      await createSubService({
        serviceId: service.id,
        name: name.trim(),
        basePrice: BigInt(Math.round(price)),
        pricingType,
      });
      toast.success(`Sub-service "${name.trim()}" added to ${service.name}.`);
      setName("");
      setBasePrice("");
      setPricingType("fixed");
      onCreated();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      toast.error(`Failed to create sub-service: ${msg}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 pt-2">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
        Add Sub-Service to {service.name}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="space-y-1">
          <Label className="text-xs font-medium text-foreground">
            Name <span className="text-red-500">*</span>
          </Label>
          <Input
            placeholder="e.g. Leak Fix"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isPending}
            className="bg-background h-8 text-xs"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs font-medium text-foreground">
            Price (₹) <span className="text-red-500">*</span>
          </Label>
          <Input
            type="number"
            min="0"
            placeholder="e.g. 499"
            value={basePrice}
            onChange={(e) => setBasePrice(e.target.value)}
            disabled={isPending}
            className="bg-background h-8 text-xs"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs font-medium text-foreground">
            Pricing Type
          </Label>
          <select
            value={pricingType}
            onChange={(e) => setPricingType(e.target.value)}
            disabled={isPending}
            className="w-full h-8 rounded-md border border-input bg-background px-2 py-1 text-xs ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <option value="fixed">Fixed</option>
            <option value="per_sqft">Per Sq Ft</option>
            <option value="per_acre">Per Acre</option>
          </select>
        </div>
      </div>
      <Button
        type="submit"
        disabled={isPending}
        size="sm"
        className="gap-1.5 h-7 text-xs"
      >
        {isPending ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : (
          <Plus className="h-3 w-3" />
        )}
        Add Sub-Service
      </Button>
    </form>
  );
}

// ─── Service Card with Sub-Services ─────────────────────────────
function ServiceCard({
  service,
  index,
}: {
  service: Service;
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const [showAddSub, setShowAddSub] = useState(false);
  const queryClient = useQueryClient();

  const { data: subServices = [], isLoading } = useGetSubServicesByService(
    expanded ? service.id : null,
  );

  const pricingLabel = (pt: string) => {
    if (pt === "per_sqft") return "Per Sq Ft";
    if (pt === "per_acre") return "Per Acre";
    if (pt === "custom") return "Custom";
    return "Fixed";
  };

  const pricingColor = (pt: string) => {
    if (pt === "per_sqft") return "bg-amber-50 text-amber-700 border-amber-200";
    if (pt === "per_acre")
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (pt === "custom")
      return "bg-purple-50 text-purple-700 border-purple-200";
    return "bg-blue-50 text-blue-700 border-blue-200";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="rounded-xl border border-[#E5E7EB] bg-white shadow-xs overflow-hidden"
    >
      {/* Service header row */}
      <div className="flex items-center justify-between p-4 gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Settings className="w-4 h-4 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-foreground text-sm truncate">
              {service.name}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {service.category}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Badge
            variant="outline"
            className={`text-xs ${pricingColor(service.pricingType)}`}
          >
            {pricingLabel(service.pricingType)}
          </Badge>
          <span className="text-xs font-semibold text-foreground">
            ₹{Number(service.basePrice).toLocaleString("en-IN")}
          </span>
          <button
            type="button"
            onClick={() => setExpanded((p) => !p)}
            className="ml-1 text-muted-foreground hover:text-foreground transition-colors"
            title={expanded ? "Collapse" : "Expand sub-services"}
          >
            {expanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Expanded: sub-service list + add form */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-border"
          >
            <div className="p-4 space-y-3">
              {/* Sub-services table */}
              {isLoading ? (
                <p className="text-xs text-muted-foreground">
                  Loading sub-services...
                </p>
              ) : subServices.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">
                  No sub-services yet. Add one below.
                </p>
              ) : (
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-muted/30">
                      <th className="text-left px-3 py-2 text-muted-foreground font-semibold">
                        Name
                      </th>
                      <th className="text-right px-3 py-2 text-muted-foreground font-semibold">
                        Price
                      </th>
                      <th className="text-left px-3 py-2 text-muted-foreground font-semibold hidden sm:table-cell">
                        Type
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {subServices.map((sub: SubService) => (
                      <tr
                        key={String(sub.id)}
                        className="border-t border-border/40 hover:bg-muted/10 transition-colors"
                      >
                        <td className="px-3 py-2 font-medium text-foreground">
                          {sub.name}
                        </td>
                        <td className="px-3 py-2 text-right font-semibold text-foreground">
                          ₹{Number(sub.basePrice).toLocaleString("en-IN")}
                          {sub.pricingType !== "fixed" && (
                            <span className="font-normal text-muted-foreground ml-1">
                              /
                              {sub.pricingType === "per_sqft" ? "sqft" : "acre"}
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-2 hidden sm:table-cell">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${pricingColor(sub.pricingType)}`}
                          >
                            {pricingLabel(sub.pricingType)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {/* Toggle Add Sub-Service form */}
              {!showAddSub ? (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="gap-1.5 h-7 text-xs"
                  onClick={() => setShowAddSub(true)}
                >
                  <Plus className="h-3 w-3" />
                  Add Sub-Service
                </Button>
              ) : (
                <div className="rounded-md border border-dashed border-primary/40 bg-primary/5 p-3 relative">
                  <button
                    type="button"
                    onClick={() => setShowAddSub(false)}
                    className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
                    title="Close"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                  <AddSubServiceForm
                    service={service}
                    onCreated={() => {
                      setShowAddSub(false);
                      queryClient.invalidateQueries({
                        queryKey: ["subServices", service.id.toString()],
                      });
                    }}
                  />
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────
export function AddServicePage() {
  const [showAddForm, setShowAddForm] = useState(false);
  const queryClient = useQueryClient();

  const { data: services = [], isLoading } = useGetServices();

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-foreground">
            Service Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Create and manage services and sub-services. Booking form loads
            services dynamically from this list.
          </p>
        </div>
        <Button
          type="button"
          className="gap-2 shrink-0"
          onClick={() => setShowAddForm((p) => !p)}
        >
          {showAddForm ? (
            <>
              <X className="h-4 w-4" />
              Cancel
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" />
              New Service
            </>
          )}
        </Button>
      </div>

      {/* Add Service Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="rounded-xl border border-[#E5E7EB] bg-white shadow-xs p-5">
              <div className="flex items-center gap-2 mb-4">
                <Tag className="w-4 h-4 text-primary" />
                <h2 className="font-semibold text-foreground text-sm">
                  Create New Service
                </h2>
              </div>
              <AddServiceForm
                onCreated={() => {
                  setShowAddForm(false);
                  queryClient.invalidateQueries({ queryKey: ["services"] });
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Services list */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-muted-foreground" />
          <h2 className="font-semibold text-foreground text-sm">
            {isLoading
              ? "Loading services..."
              : `${services.length} Service${services.length !== 1 ? "s" : ""}`}
          </h2>
          <span className="text-xs text-muted-foreground">
            (click to expand sub-services)
          </span>
        </div>

        {!isLoading && services.length === 0 && (
          <div className="rounded-xl border border-dashed border-[#E5E7EB] bg-white p-10 text-center">
            <Settings className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No services yet.</p>
            <p className="text-xs text-muted-foreground/60 mt-0.5">
              Click "New Service" to add the first service.
            </p>
          </div>
        )}

        {services.map((service, i) => (
          <ServiceCard key={String(service.id)} service={service} index={i} />
        ))}
      </div>
    </div>
  );
}
