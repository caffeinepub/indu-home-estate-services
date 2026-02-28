import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateBooking,
  useGetServices,
  useGetSubServicesByService,
} from "@/hooks/useQueries";
import { TIME_SLOTS, sendWhatsAppNotification } from "@/lib/helpers";
import { useQueryClient } from "@tanstack/react-query";
import {
  CalendarDays,
  CheckCheck,
  Clock,
  Copy,
  Loader2,
  MapPin,
  MessageSquare,
  StickyNote,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

export function BookingForm() {
  const [serviceId, setServiceId] = useState<string>("");
  const [subServiceId, setSubServiceId] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("");
  const [scheduledDate, setScheduledDate] = useState<string>("");
  const [scheduledTime, setScheduledTime] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [whatsappMsg, setWhatsappMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Load services from backend
  const { data: services = [], isLoading: servicesLoading } = useGetServices();

  // Load sub-services for selected service from backend
  const selectedServiceId = serviceId ? BigInt(serviceId) : null;
  const { data: subServices = [], isLoading: subServicesLoading } =
    useGetSubServicesByService(selectedServiceId);

  const selectedSubService = subServices.find(
    (ss) => String(ss.id) === subServiceId,
  );

  const qty = Number(quantity) || 1;
  let computedTotal = 0;
  if (selectedSubService) {
    const basePrice = Number(selectedSubService.basePrice);
    if (selectedSubService.pricingType === "fixed") {
      computedTotal = basePrice;
    } else {
      computedTotal = basePrice * qty;
    }
    if (computedTotal < 1000) computedTotal = 1000;
  }
  const computedAdvance = Math.round(computedTotal * 0.3);
  const computedBalance = computedTotal - computedAdvance;

  const { mutateAsync: createBooking, isPending } = useCreateBooking();
  const queryClient = useQueryClient();

  const handleCreateBooking = async () => {
    if (!serviceId) {
      toast.error("Please select a service.");
      return;
    }
    if (!subServiceId) {
      toast.error("Please select a sub-service.");
      return;
    }
    const qtyNum = Number(quantity);
    if (!quantity || Number.isNaN(qtyNum) || qtyNum <= 0) {
      toast.error("Please enter a valid quantity (must be greater than 0).");
      return;
    }
    if (!scheduledDate) {
      toast.error("Please select a scheduled date.");
      return;
    }
    if (!scheduledTime) {
      toast.error("Please select a time slot.");
      return;
    }
    if (!address.trim()) {
      toast.error("Please enter the service address.");
      return;
    }

    try {
      const numericSubServiceId = BigInt(subServiceId);

      const booking = await createBooking({
        customerId: 0n,
        subServiceId: numericSubServiceId,
        propertyType: "Apartment",
        quantity: BigInt(qtyNum),
        scheduledDate,
        scheduledTime,
        address: address.trim(),
        notes: notes.trim(),
      });

      console.log("Booking saved:", booking);

      await queryClient.refetchQueries({
        queryKey: ["bookings"],
        type: "active",
      });

      const selectedService = services.find((s) => String(s.id) === serviceId);
      const serviceName = selectedService?.name ?? "Service";
      const subServiceName = selectedSubService?.name ?? "Sub-service";

      sendWhatsAppNotification("confirmed", {
        to: "+91XXXXXXXXXX",
        bookingId: booking.id,
        service: subServiceName,
        date: scheduledDate,
      });

      const waMsg = `*New Booking – Indu Home & Estate Services*\n\nCustomer Name: Guest\nService: ${serviceName}\nSub-Service: ${subServiceName}\nDate: ${scheduledDate} at ${scheduledTime}\nAddress: ${address.trim()}\nTotal: ₹${Number(booking.totalAmount).toLocaleString("en-IN")}\nAdvance: ₹${Number(booking.advanceAmount).toLocaleString("en-IN")}\nBalance: ₹${Number(booking.balanceAmount).toLocaleString("en-IN")}\nPayment Status: Unpaid\n\nBooking ID: #${String(booking.id).padStart(4, "0")}`;
      setWhatsappMsg(waMsg);

      toast.success("Booking Created Successfully");
      setServiceId("");
      setSubServiceId("");
      setQuantity("");
      setScheduledDate("");
      setScheduledTime("");
      setAddress("");
      setNotes("");
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      toast.error(`Booking failed: ${message}`);
    }
  };

  const handleCopyWhatsApp = async () => {
    if (!whatsappMsg) return;
    try {
      await navigator.clipboard.writeText(whatsappMsg);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy to clipboard.");
    }
  };

  return (
    <div className="space-y-4">
      {/* Service dropdown */}
      <div className="space-y-1.5">
        <Label
          htmlFor="service"
          className="text-sm font-medium text-foreground"
        >
          Service
        </Label>
        <select
          id="service"
          value={serviceId}
          onChange={(e) => {
            setServiceId(e.target.value);
            setSubServiceId("");
          }}
          className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <option value="">
            {servicesLoading ? "Loading services..." : "Select a service"}
          </option>
          {services.map((service) => (
            <option key={String(service.id)} value={String(service.id)}>
              {service.name}
            </option>
          ))}
        </select>
        {!servicesLoading && services.length === 0 && (
          <p className="text-xs text-amber-700">
            No services found. Please add services from the Services section.
          </p>
        )}
      </div>

      {/* SubService dropdown */}
      <div className="space-y-1.5">
        <Label
          htmlFor="subservice"
          className="text-sm font-medium text-foreground"
        >
          Sub-Service
        </Label>
        <select
          id="subservice"
          value={subServiceId}
          onChange={(e) => setSubServiceId(e.target.value)}
          className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <option value="">
            {subServicesLoading
              ? "Loading..."
              : serviceId
                ? "Select a sub-service"
                : "Select a service first"}
          </option>
          {subServices.map((sub) => (
            <option key={String(sub.id)} value={String(sub.id)}>
              {sub.name}
            </option>
          ))}
        </select>
      </div>

      {/* Pricing Preview Card */}
      <AnimatePresence>
        {selectedSubService && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="rounded-md border border-border bg-muted/50 px-4 py-3 space-y-1.5 text-sm">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                Price Estimate
              </p>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Base Price</span>
                <span className="text-foreground font-medium">
                  ₹
                  {Number(selectedSubService.basePrice).toLocaleString("en-IN")}
                  {selectedSubService.pricingType !== "fixed" && (
                    <span className="text-muted-foreground font-normal text-xs ml-1">
                      per{" "}
                      {selectedSubService.pricingType === "per_sqft"
                        ? "sq ft"
                        : "acre"}
                    </span>
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-border/60 pt-1.5 mt-1.5">
                <span className="text-muted-foreground font-medium">
                  Total Amount
                </span>
                <span className="text-foreground font-semibold">
                  ₹{computedTotal.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Advance (30%)</span>
                <span className="text-emerald-700 font-medium">
                  ₹{computedAdvance.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Balance (70%)</span>
                <span className="text-amber-700 font-medium">
                  ₹{computedBalance.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quantity */}
      <div className="space-y-1.5">
        <Label
          htmlFor="quantity"
          className="text-sm font-medium text-foreground"
        >
          Quantity
          {selectedSubService && selectedSubService.pricingType !== "fixed" && (
            <span className="text-xs text-muted-foreground font-normal ml-1">
              (
              {selectedSubService.pricingType === "per_sqft"
                ? "sq ft"
                : "acres"}
              )
            </span>
          )}
        </Label>
        <Input
          id="quantity"
          type="number"
          min="1"
          placeholder="e.g. 1200"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          disabled={isPending}
          className="bg-background"
          required
        />
      </div>

      {/* Scheduled Date */}
      <div className="space-y-1.5">
        <Label
          htmlFor="scheduledDate"
          className="text-sm font-medium text-foreground flex items-center gap-1.5"
        >
          <CalendarDays className="w-3.5 h-3.5 text-muted-foreground" />
          Scheduled Date
        </Label>
        <Input
          id="scheduledDate"
          type="date"
          value={scheduledDate}
          onChange={(e) => setScheduledDate(e.target.value)}
          disabled={isPending}
          className="bg-background"
          required
          min={new Date().toISOString().split("T")[0]}
        />
      </div>

      {/* Time Slot */}
      <div className="space-y-1.5">
        <Label
          htmlFor="timeSlot"
          className="text-sm font-medium text-foreground flex items-center gap-1.5"
        >
          <Clock className="w-3.5 h-3.5 text-muted-foreground" />
          Time Slot
        </Label>
        <select
          id="timeSlot"
          value={scheduledTime}
          onChange={(e) => setScheduledTime(e.target.value)}
          className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <option value="">Select a time slot</option>
          {TIME_SLOTS.map((slot) => (
            <option key={slot} value={slot}>
              {slot}
            </option>
          ))}
        </select>
      </div>

      {/* Address */}
      <div className="space-y-1.5">
        <Label
          htmlFor="address"
          className="text-sm font-medium text-foreground flex items-center gap-1.5"
        >
          <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
          Service Address <span className="text-red-500 ml-0.5">*</span>
        </Label>
        <Textarea
          id="address"
          placeholder="Enter service address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          disabled={isPending}
          className="bg-background resize-none"
          rows={2}
          required
        />
      </div>

      {/* Notes */}
      <div className="space-y-1.5">
        <Label
          htmlFor="notes"
          className="text-sm font-medium text-foreground flex items-center gap-1.5"
        >
          <StickyNote className="w-3.5 h-3.5 text-muted-foreground" />
          Notes{" "}
          <span className="text-xs text-muted-foreground font-normal">
            (optional)
          </span>
        </Label>
        <Textarea
          id="notes"
          placeholder="Any special instructions (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          disabled={isPending}
          className="bg-background resize-none"
          rows={2}
        />
      </div>

      <Button
        type="button"
        onClick={handleCreateBooking}
        disabled={isPending}
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating Booking...
          </>
        ) : (
          "Create Booking"
        )}
      </Button>

      {/* WhatsApp Preview Panel */}
      <AnimatePresence>
        {whatsappMsg && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="rounded-md border border-emerald-200 bg-emerald-50 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-emerald-700" />
                  <p className="text-sm font-medium text-emerald-800">
                    WhatsApp Message Ready
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setWhatsappMsg(null)}
                  className="text-emerald-600 hover:text-emerald-800 text-xs underline underline-offset-2"
                >
                  Dismiss
                </button>
              </div>
              <pre className="text-xs text-emerald-900 bg-white border border-emerald-100 rounded p-3 whitespace-pre-wrap font-sans leading-relaxed overflow-x-auto">
                {whatsappMsg}
              </pre>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="border-emerald-300 text-emerald-800 hover:bg-emerald-100 w-full"
                onClick={handleCopyWhatsApp}
              >
                {copied ? (
                  <>
                    <CheckCheck className="mr-2 h-3.5 w-3.5 text-emerald-600" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-3.5 w-3.5" />
                    Copy Message
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
