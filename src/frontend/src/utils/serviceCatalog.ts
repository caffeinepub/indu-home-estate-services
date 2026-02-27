/**
 * serviceCatalog.ts
 *
 * Append-only seeding utility for the service catalog stored in localStorage.
 *
 * Rules:
 * - NEVER overwrites existing entries
 * - NEVER touches the "bookings" key
 * - Checks by id, appends only missing entries
 */

export interface LocalService {
  id: string;
  name: string;
}

export interface LocalSubService {
  id: string;
  serviceId: string;
  name: string;
}

/* ─── Master Service List ───────────────────────────────────────── */

export const MASTER_SERVICES: LocalService[] = [
  { id: "plumbing", name: "Plumbing" },
  { id: "electrical", name: "Electrical" },
  { id: "deep_cleaning", name: "Deep Cleaning" },
  { id: "painting", name: "Painting" },
  { id: "ac_service", name: "AC Service" },
  { id: "pest_control", name: "Pest Control" },
  { id: "estate_maintenance", name: "Estate Maintenance" },
];

/* ─── Master Sub-Service Catalog ────────────────────────────────── */

export const MASTER_SUB_SERVICES: LocalSubService[] = [
  // Plumbing
  { id: "plumbing_leak_fix", serviceId: "plumbing", name: "Leak Fix" },
  {
    id: "plumbing_pipe_installation",
    serviceId: "plumbing",
    name: "Pipe Installation",
  },
  {
    id: "plumbing_bathroom_fitting",
    serviceId: "plumbing",
    name: "Bathroom Fitting",
  },
  {
    id: "plumbing_tap_replacement",
    serviceId: "plumbing",
    name: "Tap Replacement",
  },
  {
    id: "plumbing_drain_block_removal",
    serviceId: "plumbing",
    name: "Drain Block Removal",
  },
  {
    id: "plumbing_water_tank_cleaning",
    serviceId: "plumbing",
    name: "Water Tank Cleaning",
  },
  {
    id: "plumbing_motor_installation",
    serviceId: "plumbing",
    name: "Motor Installation",
  },

  // Electrical
  { id: "electrical_wiring", serviceId: "electrical", name: "Wiring" },
  {
    id: "electrical_switchboard_repair",
    serviceId: "electrical",
    name: "Switch Board Repair",
  },
  {
    id: "electrical_fan_installation",
    serviceId: "electrical",
    name: "Fan Installation",
  },
  {
    id: "electrical_light_installation",
    serviceId: "electrical",
    name: "Light Installation",
  },
  {
    id: "electrical_inverter_setup",
    serviceId: "electrical",
    name: "Inverter Setup",
  },
  {
    id: "electrical_mcb_replacement",
    serviceId: "electrical",
    name: "MCB Replacement",
  },
  {
    id: "electrical_power_failure_fix",
    serviceId: "electrical",
    name: "Power Failure Fix",
  },

  // Deep Cleaning
  {
    id: "deep_cleaning_home",
    serviceId: "deep_cleaning",
    name: "Home Deep Cleaning",
  },
  {
    id: "deep_cleaning_apartment",
    serviceId: "deep_cleaning",
    name: "Apartment Cleaning",
  },
  {
    id: "deep_cleaning_kitchen",
    serviceId: "deep_cleaning",
    name: "Kitchen Deep Cleaning",
  },
  {
    id: "deep_cleaning_bathroom",
    serviceId: "deep_cleaning",
    name: "Bathroom Deep Cleaning",
  },
  {
    id: "deep_cleaning_sofa",
    serviceId: "deep_cleaning",
    name: "Sofa Cleaning",
  },
  {
    id: "deep_cleaning_mattress",
    serviceId: "deep_cleaning",
    name: "Mattress Cleaning",
  },

  // Painting
  { id: "painting_interior", serviceId: "painting", name: "Interior Painting" },
  { id: "painting_exterior", serviceId: "painting", name: "Exterior Painting" },
  { id: "painting_wall_putty", serviceId: "painting", name: "Wall Putty" },
  {
    id: "painting_waterproofing",
    serviceId: "painting",
    name: "Waterproofing",
  },
  { id: "painting_texture", serviceId: "painting", name: "Texture Painting" },

  // AC Service
  { id: "ac_installation", serviceId: "ac_service", name: "AC Installation" },
  { id: "ac_gas_filling", serviceId: "ac_service", name: "AC Gas Filling" },
  { id: "ac_repair", serviceId: "ac_service", name: "AC Repair" },
  {
    id: "ac_general_service",
    serviceId: "ac_service",
    name: "AC General Service",
  },
  {
    id: "ac_water_leakage_fix",
    serviceId: "ac_service",
    name: "AC Water Leakage Fix",
  },

  // Pest Control
  {
    id: "pest_termite_treatment",
    serviceId: "pest_control",
    name: "Termite Treatment",
  },
  {
    id: "pest_cockroach_control",
    serviceId: "pest_control",
    name: "Cockroach Control",
  },
  {
    id: "pest_bed_bug_treatment",
    serviceId: "pest_control",
    name: "Bed Bug Treatment",
  },
  {
    id: "pest_rodent_control",
    serviceId: "pest_control",
    name: "Rodent Control",
  },
  {
    id: "pest_general_control",
    serviceId: "pest_control",
    name: "General Pest Control",
  },

  // Estate Maintenance
  {
    id: "estate_garden_cleaning",
    serviceId: "estate_maintenance",
    name: "Garden Cleaning",
  },
  {
    id: "estate_grass_cutting",
    serviceId: "estate_maintenance",
    name: "Grass Cutting",
  },
  {
    id: "estate_borewell_service",
    serviceId: "estate_maintenance",
    name: "Borewell Service",
  },
  {
    id: "estate_farm_maintenance",
    serviceId: "estate_maintenance",
    name: "Farm Maintenance",
  },
  {
    id: "estate_fence_repair",
    serviceId: "estate_maintenance",
    name: "Fence Repair",
  },
];

/* ─── ensureServiceCatalog ──────────────────────────────────────── */

/**
 * Reads services and subServices from localStorage, appends any entries
 * that are missing (checked by id), and saves back.
 *
 * NEVER touches the "bookings" key.
 * NEVER overwrites existing entries.
 */
export function ensureServiceCatalog(): {
  services: LocalService[];
  subServices: LocalSubService[];
} {
  // ── Services ──────────────────────────────────────────────────
  let storedServices: LocalService[] = [];
  try {
    const raw = localStorage.getItem("services");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) storedServices = parsed;
    }
  } catch {
    storedServices = [];
  }

  const existingServiceIds = new Set(storedServices.map((s) => s.id));
  const missingServices = MASTER_SERVICES.filter(
    (s) => !existingServiceIds.has(s.id),
  );

  if (missingServices.length > 0) {
    storedServices = [...storedServices, ...missingServices];
    try {
      localStorage.setItem("services", JSON.stringify(storedServices));
    } catch {
      // ignore storage errors
    }
  }

  // ── Sub-Services ───────────────────────────────────────────────
  let storedSubServices: LocalSubService[] = [];
  try {
    const raw = localStorage.getItem("subServices");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) storedSubServices = parsed;
    }
  } catch {
    storedSubServices = [];
  }

  const existingSubServiceIds = new Set(storedSubServices.map((ss) => ss.id));
  const missingSubServices = MASTER_SUB_SERVICES.filter(
    (ss) => !existingSubServiceIds.has(ss.id),
  );

  if (missingSubServices.length > 0) {
    storedSubServices = [...storedSubServices, ...missingSubServices];
    try {
      localStorage.setItem("subServices", JSON.stringify(storedSubServices));
    } catch {
      // ignore storage errors
    }
  }

  console.log(
    `[ServiceCatalog] services=${storedServices.length}, subServices=${storedSubServices.length}`,
    "Services:",
    storedServices,
  );

  return { services: storedServices, subServices: storedSubServices };
}
