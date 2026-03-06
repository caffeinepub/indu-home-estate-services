import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { exportToCsv } from "@/utils/exportToExcel";
import {
  AlertTriangle,
  Archive,
  Download,
  Minus,
  Package,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";

interface InventoryItem {
  id: number;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  minThreshold: number;
  lastUpdated: string;
}

const CATEGORIES = [
  "Pest Control",
  "Painting",
  "AC Service",
  "Plumbing",
  "Cleaning",
  "Electrical",
  "Other",
];

const SEED_ITEMS: InventoryItem[] = [
  {
    id: 1,
    name: "Termite Chemical",
    category: "Pest Control",
    quantity: 15,
    unit: "liters",
    minThreshold: 5,
    lastUpdated: "2026-03-01",
  },
  {
    id: 2,
    name: "Cockroach Gel",
    category: "Pest Control",
    quantity: 3,
    unit: "tubes",
    minThreshold: 5,
    lastUpdated: "2026-03-02",
  },
  {
    id: 3,
    name: "Paint Brush Set",
    category: "Painting",
    quantity: 8,
    unit: "sets",
    minThreshold: 3,
    lastUpdated: "2026-02-28",
  },
  {
    id: 4,
    name: "AC Gas Refrigerant",
    category: "AC Service",
    quantity: 2,
    unit: "cylinders",
    minThreshold: 3,
    lastUpdated: "2026-03-04",
  },
  {
    id: 5,
    name: "Drain Cleaner",
    category: "Plumbing",
    quantity: 20,
    unit: "bottles",
    minThreshold: 5,
    lastUpdated: "2026-03-01",
  },
  {
    id: 6,
    name: "Disinfectant Spray",
    category: "Cleaning",
    quantity: 12,
    unit: "bottles",
    minThreshold: 8,
    lastUpdated: "2026-03-03",
  },
];

export function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>(SEED_ITEMS);
  const [showAddForm, setShowAddForm] = useState(false);
  const [nextId, setNextId] = useState(7);

  // Add form state
  const [addName, setAddName] = useState("");
  const [addCategory, setAddCategory] = useState("Pest Control");
  const [addQuantity, setAddQuantity] = useState(0);
  const [addUnit, setAddUnit] = useState("");
  const [addThreshold, setAddThreshold] = useState(5);

  // Inline stock adjustment state: { [itemId]: value }
  const [stockAdjust, setStockAdjust] = useState<Record<number, string>>({});
  const [activeAdjust, setActiveAdjust] = useState<{
    id: number;
    type: "add" | "use";
  } | null>(null);

  const lowStockCount = items.filter((i) => i.quantity < i.minThreshold).length;
  const categoriesCount = new Set(items.map((i) => i.category)).size;

  const today = new Date().toISOString().split("T")[0];

  const handleSave = () => {
    if (!addName.trim() || !addUnit.trim()) return;
    const newItem: InventoryItem = {
      id: nextId,
      name: addName.trim(),
      category: addCategory,
      quantity: addQuantity,
      unit: addUnit.trim(),
      minThreshold: addThreshold,
      lastUpdated: today,
    };
    setItems((prev) => [...prev, newItem]);
    setNextId((n) => n + 1);
    setAddName("");
    setAddCategory("Pest Control");
    setAddQuantity(0);
    setAddUnit("");
    setAddThreshold(5);
    setShowAddForm(false);
  };

  const handleDelete = (id: number) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleApplyAdjust = () => {
    if (!activeAdjust) return;
    const val = Number.parseInt(stockAdjust[activeAdjust.id] || "0", 10);
    if (Number.isNaN(val) || val <= 0) {
      setActiveAdjust(null);
      setStockAdjust((p) => ({ ...p, [activeAdjust.id]: "" }));
      return;
    }
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== activeAdjust.id) return item;
        const newQty =
          activeAdjust.type === "add"
            ? item.quantity + val
            : Math.max(0, item.quantity - val);
        return { ...item, quantity: newQty, lastUpdated: today };
      }),
    );
    setActiveAdjust(null);
    setStockAdjust((p) => ({ ...p, [activeAdjust.id]: "" }));
  };

  const handleExport = () => {
    exportToCsv(
      "inventory.csv",
      items.map((i) => ({
        Name: i.name,
        Category: i.category,
        Quantity: i.quantity,
        Unit: i.unit,
        "Min Threshold": i.minThreshold,
        "Low Stock": i.quantity < i.minThreshold ? "Yes" : "No",
        "Last Updated": i.lastUpdated,
      })),
    );
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Inventory Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track chemicals, tools, and materials stock levels.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="h-8 gap-1.5 text-xs"
            onClick={handleExport}
          >
            <Download className="h-3.5 w-3.5" />
            Export CSV
          </Button>
          <Button
            size="sm"
            className="h-8 gap-1.5 text-xs"
            onClick={() => setShowAddForm((p) => !p)}
            data-ocid="inventory.add_button"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Item
          </Button>
        </div>
      </div>

      {/* Summary bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: "Total Items",
            value: items.length,
            icon: Package,
            iconBg: "bg-blue-50",
            iconColor: "text-blue-600",
            valueColor: "#2563EB",
          },
          {
            label: "Low Stock",
            value: lowStockCount,
            icon: AlertTriangle,
            iconBg: "bg-red-50",
            iconColor: "text-red-600",
            valueColor: "#DC2626",
          },
          {
            label: "Categories",
            value: categoriesCount,
            icon: Archive,
            iconBg: "bg-emerald-50",
            iconColor: "text-emerald-600",
            valueColor: "#16A34A",
          },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="rounded-xl border border-[#E5E7EB] bg-white p-4 flex items-center gap-4 shadow-xs"
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${card.iconBg}`}
              >
                <Icon className={`w-5 h-5 ${card.iconColor}`} />
              </div>
              <div>
                <p
                  className="font-display text-2xl font-bold"
                  style={{ color: card.valueColor }}
                >
                  {card.value}
                </p>
                <p className="text-xs text-muted-foreground">{card.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Item form */}
      {showAddForm && (
        <div className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground text-sm">
              Add New Item
            </h2>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-1">
              <span className="text-xs font-medium text-muted-foreground">
                Item Name *
              </span>
              <input
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                value={addName}
                onChange={(e) => setAddName(e.target.value)}
                placeholder="e.g., Termite Chemical"
              />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-medium text-muted-foreground">
                Category *
              </span>
              <select
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                value={addCategory}
                onChange={(e) => setAddCategory(e.target.value)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-medium text-muted-foreground">
                Quantity *
              </span>
              <input
                type="number"
                min={0}
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                value={addQuantity}
                onChange={(e) => setAddQuantity(Number(e.target.value))}
              />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-medium text-muted-foreground">
                Unit *
              </span>
              <input
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                value={addUnit}
                onChange={(e) => setAddUnit(e.target.value)}
                placeholder="e.g., liters, bottles"
              />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-medium text-muted-foreground">
                Min Threshold *
              </span>
              <input
                type="number"
                min={0}
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                value={addThreshold}
                onChange={(e) => setAddThreshold(Number(e.target.value))}
              />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <Button
              size="sm"
              className="h-8 text-xs"
              onClick={handleSave}
              data-ocid="inventory.save_button"
            >
              Save Item
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-8 text-xs"
              onClick={() => setShowAddForm(false)}
              data-ocid="inventory.cancel_button"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Inventory Table */}
      <div
        className="rounded-xl border border-[#E5E7EB] bg-white shadow-xs overflow-hidden"
        data-ocid="inventory.table"
      >
        <div className="px-5 py-4 border-b border-border flex items-center gap-2">
          <Archive className="w-4 h-4 text-muted-foreground" />
          <h2 className="font-semibold text-foreground text-sm">
            Stock Inventory
          </h2>
          <Badge variant="secondary" className="ml-auto text-xs">
            {items.length} items
          </Badge>
        </div>

        {items.length === 0 ? (
          <div
            className="text-center py-12 text-muted-foreground text-sm"
            data-ocid="inventory.empty_state"
          >
            No inventory items found. Add your first item above.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/30">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">
                    Item Name
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground hidden sm:table-cell">
                    Category
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground">
                    Quantity
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground hidden md:table-cell">
                    Unit
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground hidden lg:table-cell">
                    Stock Status
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground hidden lg:table-cell">
                    Last Updated
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => {
                  const isLow = item.quantity < item.minThreshold;
                  const isAdjusting =
                    activeAdjust && activeAdjust.id === item.id;
                  return (
                    <tr
                      key={item.id}
                      className={`border-t border-border/60 transition-colors ${isLow ? "bg-red-50/60" : "hover:bg-muted/20"}`}
                      data-ocid={`inventory.item.${idx + 1}`}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {isLow && (
                            <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                          )}
                          <span className="font-medium text-foreground text-xs">
                            {item.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <Badge variant="outline" className="text-xs">
                          {item.category}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span
                          className={`font-semibold text-xs ${isLow ? "text-red-600" : "text-[#111827]"}`}
                        >
                          {item.quantity}
                        </span>
                        <span className="text-muted-foreground text-xs ml-1">
                          / {item.minThreshold}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell text-xs text-muted-foreground">
                        {item.unit}
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        {isLow ? (
                          <Badge
                            variant="destructive"
                            className="text-xs font-medium"
                          >
                            Low Stock
                          </Badge>
                        ) : (
                          <Badge
                            variant="secondary"
                            className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200"
                          >
                            OK
                          </Badge>
                        )}
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell text-xs text-muted-foreground">
                        {item.lastUpdated}
                      </td>
                      <td className="px-4 py-3">
                        {isAdjusting ? (
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              min={1}
                              className="w-16 h-7 rounded border border-input bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
                              value={stockAdjust[item.id] || ""}
                              onChange={(e) =>
                                setStockAdjust((p) => ({
                                  ...p,
                                  [item.id]: e.target.value,
                                }))
                              }
                              placeholder="Qty"
                            />
                            <Button
                              size="sm"
                              className="h-7 px-2 text-xs"
                              onClick={handleApplyAdjust}
                            >
                              OK
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 px-1.5 text-xs"
                              onClick={() => setActiveAdjust(null)}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 px-2 text-xs gap-1"
                              title="Add Stock"
                              onClick={() => {
                                setActiveAdjust({ id: item.id, type: "add" });
                                setStockAdjust((p) => ({
                                  ...p,
                                  [item.id]: "",
                                }));
                              }}
                            >
                              <Plus className="w-3 h-3" />
                              Add
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 px-2 text-xs gap-1"
                              title="Use Stock"
                              onClick={() => {
                                setActiveAdjust({ id: item.id, type: "use" });
                                setStockAdjust((p) => ({
                                  ...p,
                                  [item.id]: "",
                                }));
                              }}
                            >
                              <Minus className="w-3 h-3" />
                              Use
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 px-1.5 text-red-500 hover:text-red-700 hover:bg-red-50"
                              title="Delete"
                              onClick={() => handleDelete(item.id)}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
