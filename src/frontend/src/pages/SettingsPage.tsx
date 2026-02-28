import { Switch } from "@/components/ui/switch";
import { Building2, Info, Moon, Palette, Percent, Upload } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">
          Settings
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Platform configuration and display preferences.
        </p>
      </div>

      {/* Company Info */}
      <section className="rounded-xl border border-border bg-card shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center gap-2">
          <Building2 className="w-4 h-4 text-muted-foreground" />
          <h2 className="font-semibold text-foreground text-sm">
            Company Information
          </h2>
        </div>
        <div className="p-5 space-y-4">
          {[
            { label: "Company Name", value: "Indu Home & Estate Services" },
            { label: "Proprietor", value: "Mounith H C" },
            {
              label: "Address",
              value: "Chikmagalur, Karnataka, India — 577101",
            },
            {
              label: "Tagline",
              value: "From Homes to Estates – We Handle It All.",
            },
            { label: "Contact", value: "+91 94482 XXXXX" },
            { label: "GSTIN", value: "Applied For" },
          ].map((field) => (
            <div key={field.label} className="flex items-start gap-4">
              <span className="text-xs font-medium text-muted-foreground w-28 pt-0.5 shrink-0">
                {field.label}
              </span>
              <span className="text-sm text-foreground font-medium">
                {field.value}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Financial Settings */}
      <section className="rounded-xl border border-border bg-card shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center gap-2">
          <Percent className="w-4 h-4 text-muted-foreground" />
          <h2 className="font-semibold text-foreground text-sm">
            Financial Settings
          </h2>
        </div>
        <div className="p-5 space-y-4">
          {[
            {
              label: "Technician Commission",
              value: "40%",
              note: "Of total booking amount",
            },
            {
              label: "Company Revenue Share",
              value: "60%",
              note: "Net profit after commission",
            },
            {
              label: "Advance Rate",
              value: "30%",
              note: "Required at booking time",
            },
          ].map((field) => (
            <div key={field.label} className="flex items-start gap-4">
              <span className="text-xs font-medium text-muted-foreground w-44 pt-0.5 shrink-0">
                {field.label}
              </span>
              <div>
                <span className="text-sm text-foreground font-semibold">
                  {field.value}
                </span>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {field.note}
                </p>
              </div>
            </div>
          ))}

          <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800/40 p-3 mt-2">
            <Info className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-700 dark:text-amber-400">
              Financial rates are system-level constants. Contact the system
              administrator to modify these values.
            </p>
          </div>
        </div>
      </section>

      {/* Appearance */}
      <section className="rounded-xl border border-border bg-card shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center gap-2">
          <Palette className="w-4 h-4 text-muted-foreground" />
          <h2 className="font-semibold text-foreground text-sm">Appearance</h2>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                <Moon className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Dark Mode</p>
                <p className="text-xs text-muted-foreground">
                  Toggle between light and dark theme
                </p>
              </div>
            </div>
            {mounted && (
              <Switch
                checked={theme === "dark"}
                onCheckedChange={(checked) =>
                  setTheme(checked ? "dark" : "light")
                }
              />
            )}
          </div>
        </div>
      </section>

      {/* Logo Upload */}
      <section className="rounded-xl border border-border bg-card shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center gap-2">
          <Upload className="w-4 h-4 text-muted-foreground" />
          <h2 className="font-semibold text-foreground text-sm">
            Company Logo
          </h2>
        </div>
        <div className="p-5">
          <div className="rounded-lg border-2 border-dashed border-border p-8 flex flex-col items-center gap-3 text-center hover:border-primary/40 transition-colors cursor-pointer">
            <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
              <Upload className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                Upload Company Logo
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                PNG, JPG up to 2MB · Recommended: 200×200px
              </p>
            </div>
            <span className="text-xs text-muted-foreground px-3 py-1 bg-muted rounded-md">
              Upload functionality coming soon
            </span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <p className="text-xs text-muted-foreground text-center pb-4">
        © {new Date().getFullYear()} Indu Home & Estate Services. All rights
        reserved.
      </p>
    </div>
  );
}
