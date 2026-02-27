import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useActor } from "./useActor";
import type { User, Service, SubService, Booking } from "../backend";
import { Role } from "../backend";

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
    }: {
      customerId: bigint;
      subServiceId: bigint;
      propertyType: string;
      quantity: bigint;
    }): Promise<Booking> => {
      if (!actor) throw new Error("No actor available");
      return actor.createBooking(customerId, subServiceId, propertyType, quantity);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
}

export { Role };
