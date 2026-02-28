import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  Booking,
  Invoice,
  Service,
  SubService,
  Technician,
  User,
} from "../backend";
import { BookingStatus, Role } from "../backend";
import { useActor } from "./useActor";

export function useGetUsers() {
  const { actor, isFetching } = useActor();
  return useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getUsers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateUser() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ name, role }: { name: string; role: Role }) => {
      if (!actor) throw new Error("No actor available");
      return actor.createUser(name, role);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

export function useGetServices() {
  const { actor, isFetching } = useActor();
  return useQuery<Service[]>({
    queryKey: ["services"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getServices();
    },
    enabled: !!actor && !isFetching,
    staleTime: 0,
    refetchOnMount: true,
  });
}

export function useCreateService() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      name,
      category,
      basePrice,
      pricingType,
    }: {
      name: string;
      category: string;
      basePrice: bigint;
      pricingType: string;
    }): Promise<Service> => {
      if (!actor) throw new Error("No actor available");
      return actor.createService(name, category, basePrice, pricingType);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
}

export function useGetSubServicesByService(serviceId: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<SubService[]>({
    queryKey: ["subServices", serviceId?.toString()],
    queryFn: async () => {
      if (!actor || serviceId === null) return [];
      return actor.getSubServicesByService(serviceId);
    },
    enabled: !!actor && !isFetching && serviceId !== null,
    staleTime: 0,
    refetchOnMount: true,
  });
}

export function useCreateSubService() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      serviceId,
      name,
      basePrice,
      pricingType,
    }: {
      serviceId: bigint;
      name: string;
      basePrice: bigint;
      pricingType: string;
    }): Promise<SubService> => {
      if (!actor) throw new Error("No actor available");
      return actor.createSubService(serviceId, name, basePrice, pricingType);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["subServices", variables.serviceId.toString()],
      });
      queryClient.invalidateQueries({ queryKey: ["allSubServices"] });
    },
  });
}

export function useCreateBooking() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      customerId,
      subServiceId,
      propertyType,
      quantity,
      scheduledDate,
      scheduledTime,
      address,
      notes,
    }: {
      customerId: bigint;
      subServiceId: bigint;
      propertyType: string;
      quantity: bigint;
      scheduledDate: string;
      scheduledTime: string;
      address: string;
      notes: string;
    }): Promise<Booking> => {
      if (!actor) throw new Error("No actor available");
      return actor.createBooking(
        customerId,
        subServiceId,
        propertyType,
        quantity,
        scheduledDate,
        scheduledTime,
        address,
        notes,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["bookings"],
        refetchType: "all",
      });
    },
  });
}

export function useGetBookings() {
  const { actor, isFetching } = useActor();
  return useQuery<Booking[]>({
    queryKey: ["bookings"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getBookings();
    },
    enabled: !!actor && !isFetching,
    staleTime: 0,
    refetchOnMount: true,
  });
}

export function useUpdateBookingStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      bookingId,
      newStatus,
    }: {
      bookingId: bigint;
      newStatus: BookingStatus;
    }): Promise<boolean> => {
      if (!actor) throw new Error("No actor available");
      return actor.updateBookingStatus(bookingId, newStatus);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
}

/* ─── Technician Hooks ──────────────────────────────────────── */

export function useGetTechnicians() {
  const { actor, isFetching } = useActor();
  return useQuery<Technician[]>({
    queryKey: ["technicians"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTechnicians();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateTechnician() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      name,
      phone,
    }: { name: string; phone: string }): Promise<Technician> => {
      if (!actor) throw new Error("No actor available");
      return actor.createTechnician(name, phone);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["technicians"] });
    },
  });
}

export function useAssignTechnician() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      bookingId,
      technicianId,
    }: {
      bookingId: bigint;
      technicianId: bigint;
    }): Promise<boolean> => {
      if (!actor) throw new Error("No actor available");
      return actor.assignTechnician(bookingId, technicianId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["technicians"] });
    },
  });
}

export function useMarkPayment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      bookingId,
      referenceId,
    }: {
      bookingId: bigint;
      referenceId: string;
    }): Promise<boolean> => {
      if (!actor) throw new Error("No actor available");
      return actor.markPayment(bookingId, referenceId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
}

export function useDeactivateTechnician() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      technicianId,
    }: { technicianId: bigint }): Promise<boolean> => {
      if (!actor) throw new Error("No actor available");
      return actor.deactivateTechnician(technicianId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["technicians"] });
    },
  });
}

export function useGenerateInvoice(bookingId: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Invoice | null>({
    queryKey: ["invoice", bookingId?.toString()],
    queryFn: async () => {
      if (!actor || bookingId === null) return null;
      return actor.generateInvoice(bookingId);
    },
    enabled: !!actor && !isFetching && bookingId !== null,
  });
}

export function useMarkFullyPaid() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      bookingId,
    }: { bookingId: bigint }): Promise<boolean> => {
      if (!actor) throw new Error("No actor available");
      return actor.markFullyPaid(bookingId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
}

export function useCancelBooking() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      bookingId,
    }: { bookingId: bigint }): Promise<boolean> => {
      if (!actor) throw new Error("No actor available");
      return actor.cancelBooking(bookingId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
}

export { Role, BookingStatus };
export type { Technician, Invoice };
