import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateTechnician } from "@/hooks/useQueries";
import { Loader2, UserPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function AddTechnicianPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const { mutateAsync: createTechnician, isPending } = useCreateTechnician();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    try {
      const tech = await createTechnician({
        name: name.trim(),
        phone: phone.trim(),
      });
      toast.success(`Technician "${tech.name}" added successfully`);
      setName("");
      setPhone("");
    } catch {
      toast.error("Failed to add technician.");
    }
  };

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-foreground">
          Add Technician
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Register a new field technician to the system.
        </p>
      </div>

      <div className="rounded-xl border border-[#E5E7EB] bg-white shadow-xs p-5 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label
                htmlFor="tech-name"
                className="text-sm font-medium text-foreground"
              >
                Full Name
              </Label>
              <Input
                id="tech-name"
                placeholder="e.g. Suresh Kumar"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isPending}
                className="bg-background"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label
                htmlFor="tech-phone"
                className="text-sm font-medium text-foreground"
              >
                Phone Number
              </Label>
              <Input
                id="tech-phone"
                type="tel"
                placeholder="+91 98765 XXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={isPending}
                className="bg-background"
                required
              />
            </div>
          </div>
          <Button
            type="submit"
            disabled={isPending || !name.trim() || !phone.trim()}
            className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4" />
                Add Technician
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
