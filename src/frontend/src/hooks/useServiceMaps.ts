/**
 * Shared hook that builds service/sub-service lookup maps from backend data.
 * Used by AllBookings, Invoices, Reports, TechnicianJobs, CustomerBookings, DashboardCards.
 */
import type { SubService } from "@/backend";
import { useActor } from "@/hooks/useActor";
import { useGetServices } from "@/hooks/useQueries";
import { useEffect, useMemo, useState } from "react";

export function useServiceMaps() {
  const { data: services = [] } = useGetServices();
  const { actor } = useActor();
  const [allSubServices, setAllSubServices] = useState<SubService[]>([]);

  useEffect(() => {
    if (!actor || services.length === 0) return;
    Promise.all(services.map((s) => actor.getSubServicesByService(s.id))).then(
      (results) => {
        setAllSubServices(results.flat());
      },
    );
  }, [actor, services]);

  const subServiceMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const ss of allSubServices) map.set(String(ss.id), ss.name);
    return map;
  }, [allSubServices]);

  const serviceMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const s of services) map.set(String(s.id), s.name);
    return map;
  }, [services]);

  const subServiceToServiceMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const ss of allSubServices)
      map.set(String(ss.id), String(ss.serviceId));
    return map;
  }, [allSubServices]);

  return { subServiceMap, serviceMap, subServiceToServiceMap };
}
