import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Property } from "@/types/website";
import { BedDouble, MapPin, Maximize2, MessageSquare, Tag } from "lucide-react";

interface PropertyCardProps {
  property: Property;
  onInquire: (property: Property) => void;
  onClick: (property: Property) => void;
}

const STATUS_COLORS: Record<
  Property["status"],
  { bg: string; text: string; label: string }
> = {
  available: { bg: "#dcfce7", text: "#15803d", label: "Available" },
  sold: { bg: "#fee2e2", text: "#dc2626", label: "Sold" },
  rented: { bg: "#dbeafe", text: "#1d4ed8", label: "Rented" },
};

export function PropertyCard({
  property,
  onInquire,
  onClick,
}: PropertyCardProps) {
  const statusConfig = STATUS_COLORS[property.status];

  return (
    <div
      className="group rounded-2xl overflow-hidden cursor-pointer bg-white transition-all duration-300"
      style={{
        border: "1px solid #e5e7eb",
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = "translateY(-4px)";
        el.style.boxShadow = "0 20px 40px rgba(37,99,235,0.15)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = "none";
        el.style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)";
      }}
      onClick={() => onClick(property)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick(property);
      }}
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={property.imageUrl}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
          loading="lazy"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />
        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)",
          }}
        />
        {/* Status badge */}
        <div className="absolute top-3 right-3">
          <span
            className="px-2.5 py-1 rounded-full text-xs font-semibold"
            style={{ background: statusConfig.bg, color: statusConfig.text }}
          >
            {statusConfig.label}
          </span>
        </div>
        {/* Property type */}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/90 text-gray-700">
            {property.propertyType}
          </span>
        </div>
        {/* Price overlay */}
        <div className="absolute bottom-3 left-3">
          <p className="text-white font-bold text-lg leading-none">
            {property.price}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-display text-base font-bold text-gray-900 mb-1.5 truncate">
          {property.title}
        </h3>
        <p className="flex items-center gap-1 text-xs text-gray-500 mb-3">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{property.location}</span>
        </p>

        {/* Stats */}
        <div className="flex items-center gap-4 mb-4 py-3 border-y border-gray-100">
          {property.bedrooms > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-gray-600">
              <BedDouble className="w-3.5 h-3.5 text-blue-500" />
              <span>{property.bedrooms} Beds</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <Maximize2 className="w-3.5 h-3.5 text-blue-500" />
            <span>{property.area}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <Tag className="w-3.5 h-3.5 text-blue-500" />
            <span>{property.price}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-gray-500 mb-4 line-clamp-2 leading-relaxed">
          {property.description}
        </p>

        {/* CTA */}
        <Button
          type="button"
          size="sm"
          className="w-full gap-1.5"
          style={{ background: "#2563eb" }}
          onClick={(e) => {
            e.stopPropagation();
            onInquire(property);
          }}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          Inquire Now
        </Button>
      </div>
    </div>
  );
}
