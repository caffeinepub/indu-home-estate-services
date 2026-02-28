import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useWebsiteStore } from "@/hooks/useWebsiteStore";
import {
  addProperty,
  deleteProperty,
  updatePropertyStatus,
} from "@/store/websiteStore";
import type { Property } from "@/types/website";
import { BedDouble, MapPin, Maximize2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const STATUS_CONFIG: Record<
  Property["status"],
  { label: string; bg: string; text: string }
> = {
  available: { label: "Available", bg: "#dcfce7", text: "#15803d" },
  sold: { label: "Sold", bg: "#fee2e2", text: "#dc2626" },
  rented: { label: "Rented", bg: "#dbeafe", text: "#1d4ed8" },
};

const PROPERTY_TYPES = ["Apartment", "Villa", "Estate", "Commercial", "Plot"];

export function PropertiesAdminPage() {
  const store = useWebsiteStore();
  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState<Property["status"]>("available");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [bedrooms, setBedrooms] = useState("0");
  const [area, setArea] = useState("");
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setTitle("");
    setLocation("");
    setPrice("");
    setStatus("available");
    setDescription("");
    setImageUrl("");
    setPropertyType("");
    setBedrooms("0");
    setArea("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !location || !price || !propertyType || !area) {
      toast.error("Please fill all required fields.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      addProperty({
        title,
        location,
        price,
        status,
        description,
        imageUrl:
          imageUrl || "/assets/generated/property-apartment-1.dim_800x600.jpg",
        propertyType,
        bedrooms: Number.parseInt(bedrooms) || 0,
        area,
      });
      setLoading(false);
      setShowForm(false);
      resetForm();
      toast.success("Property added successfully!");
    }, 400);
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this property?")) {
      deleteProperty(id);
      toast.success("Property deleted.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-foreground">
            Properties
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage properties shown on the public website.
          </p>
        </div>
        <Button
          type="button"
          className="gap-1.5 text-white"
          style={{ background: "#2563eb" }}
          onClick={() => setShowForm(!showForm)}
        >
          <Plus className="w-4 h-4" />
          Add Property
        </Button>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-xs">
          <h2 className="font-semibold text-foreground mb-4">
            Add New Property
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="p-title">Title *</Label>
                <Input
                  id="p-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Property title"
                  required
                />
              </div>
              <div>
                <Label htmlFor="p-location">Location *</Label>
                <Input
                  id="p-location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Near Bus Stand, Chikmagalur"
                  required
                />
              </div>
              <div>
                <Label htmlFor="p-price">Price *</Label>
                <Input
                  id="p-price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g. ₹45 Lakhs"
                  required
                />
              </div>
              <div>
                <Label htmlFor="p-status">Status</Label>
                <Select
                  value={status}
                  onValueChange={(v) => setStatus(v as Property["status"])}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="sold">Sold</SelectItem>
                    <SelectItem value="rented">Rented</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="p-type">Property Type *</Label>
                <Select value={propertyType} onValueChange={setPropertyType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROPERTY_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="p-bedrooms">Bedrooms</Label>
                <Input
                  id="p-bedrooms"
                  type="number"
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                  min="0"
                />
              </div>
              <div>
                <Label htmlFor="p-area">Area *</Label>
                <Input
                  id="p-area"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="e.g. 1200 sqft, 2 acres"
                  required
                />
              </div>
              <div>
                <Label htmlFor="p-image">Image URL</Label>
                <Input
                  id="p-image"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="/assets/generated/property.jpg"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="p-desc">Description</Label>
              <Textarea
                id="p-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Property description..."
              />
            </div>
            <div className="flex gap-3">
              <Button
                type="submit"
                className="text-white"
                style={{ background: "#2563eb" }}
                disabled={loading}
              >
                {loading ? "Adding..." : "Add Property"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Properties list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {store.properties.map((p) => {
          const sc = STATUS_CONFIG[p.status];
          return (
            <div
              key={p.id}
              className="rounded-xl border border-[#E5E7EB] bg-white overflow-hidden shadow-xs"
            >
              {/* Image */}
              <div className="relative h-40 bg-gray-100">
                <img
                  src={p.imageUrl}
                  alt={p.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display =
                      "none";
                  }}
                />
                <div className="absolute top-2 right-2">
                  <Select
                    value={p.status}
                    onValueChange={(v) =>
                      updatePropertyStatus(p.id, v as Property["status"])
                    }
                  >
                    <SelectTrigger
                      className="h-6 text-[11px] px-2 font-semibold"
                      style={{
                        background: sc.bg,
                        color: sc.text,
                        border: "none",
                      }}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available" className="text-xs">
                        Available
                      </SelectItem>
                      <SelectItem value="sold" className="text-xs">
                        Sold
                      </SelectItem>
                      <SelectItem value="rented" className="text-xs">
                        Rented
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <p className="font-semibold text-sm text-foreground">
                      {p.title}
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3" />
                      {p.location}
                    </p>
                  </div>
                  <p className="text-sm font-bold text-blue-600 shrink-0">
                    {p.price}
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                  {p.bedrooms > 0 && (
                    <span className="flex items-center gap-1">
                      <BedDouble className="w-3 h-3" />
                      {p.bedrooms} Bed
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Maximize2 className="w-3 h-3" />
                    {p.area}
                  </span>
                  <Badge variant="outline" className="text-[10px] h-4 px-1.5">
                    {p.propertyType}
                  </Badge>
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="w-full h-7 text-xs gap-1"
                  onClick={() => handleDelete(p.id)}
                >
                  <Trash2 className="w-3 h-3" />
                  Delete
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {store.properties.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-sm">
            No properties added yet. Click "Add Property" to get started.
          </p>
        </div>
      )}
    </div>
  );
}
