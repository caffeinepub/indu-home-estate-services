export interface CatalogService {
  id: string;
  name: string;
}

export interface CatalogSubService {
  id: string;
  serviceId: string;
  name: string;
  price: number;
  pricingType: "fixed" | "per_sqft" | "per_acre";
}

export const SERVICES: CatalogService[] = [
  { id: "plumbing", name: "Plumbing" },
  { id: "electrical", name: "Electrical" },
  { id: "deep_cleaning", name: "Deep Cleaning" },
  { id: "painting", name: "Painting" },
  { id: "ac_service", name: "AC Service" },
  { id: "pest_control", name: "Pest Control" },
  { id: "estate_maintenance", name: "Estate Maintenance" },
];

export const SUB_SERVICES: CatalogSubService[] = [
  // Plumbing
  {
    id: "plumbing_leak_fix",
    serviceId: "plumbing",
    name: "Leak Fix",
    price: 499,
    pricingType: "fixed",
  },
  {
    id: "plumbing_pipe_installation",
    serviceId: "plumbing",
    name: "Pipe Installation",
    price: 999,
    pricingType: "fixed",
  },
  {
    id: "plumbing_bathroom_fitting",
    serviceId: "plumbing",
    name: "Bathroom Fitting",
    price: 3500,
    pricingType: "fixed",
  },
  {
    id: "plumbing_tap_replacement",
    serviceId: "plumbing",
    name: "Tap Replacement",
    price: 499,
    pricingType: "fixed",
  },
  {
    id: "plumbing_drain_block_removal",
    serviceId: "plumbing",
    name: "Drain Block Removal",
    price: 1200,
    pricingType: "fixed",
  },
  {
    id: "plumbing_water_tank_cleaning",
    serviceId: "plumbing",
    name: "Water Tank Cleaning",
    price: 1800,
    pricingType: "fixed",
  },
  {
    id: "plumbing_motor_installation",
    serviceId: "plumbing",
    name: "Motor Installation",
    price: 1500,
    pricingType: "fixed",
  },
  // Electrical
  {
    id: "electrical_wiring",
    serviceId: "electrical",
    name: "Wiring",
    price: 20,
    pricingType: "per_sqft",
  },
  {
    id: "electrical_switch_board_repair",
    serviceId: "electrical",
    name: "Switch Board Repair",
    price: 299,
    pricingType: "fixed",
  },
  {
    id: "electrical_fan_installation",
    serviceId: "electrical",
    name: "Fan Installation",
    price: 399,
    pricingType: "fixed",
  },
  {
    id: "electrical_light_installation",
    serviceId: "electrical",
    name: "Light Installation",
    price: 299,
    pricingType: "fixed",
  },
  {
    id: "electrical_inverter_setup",
    serviceId: "electrical",
    name: "Inverter Setup",
    price: 1500,
    pricingType: "fixed",
  },
  {
    id: "electrical_mcb_replacement",
    serviceId: "electrical",
    name: "MCB Replacement",
    price: 800,
    pricingType: "fixed",
  },
  {
    id: "electrical_power_failure_fix",
    serviceId: "electrical",
    name: "Power Failure Fix",
    price: 700,
    pricingType: "fixed",
  },
  // Deep Cleaning
  {
    id: "cleaning_home_deep",
    serviceId: "deep_cleaning",
    name: "Home Deep Cleaning",
    price: 8,
    pricingType: "per_sqft",
  },
  {
    id: "cleaning_apartment",
    serviceId: "deep_cleaning",
    name: "Apartment Cleaning",
    price: 7,
    pricingType: "per_sqft",
  },
  {
    id: "cleaning_kitchen_deep",
    serviceId: "deep_cleaning",
    name: "Kitchen Deep Cleaning",
    price: 2500,
    pricingType: "fixed",
  },
  {
    id: "cleaning_bathroom_deep",
    serviceId: "deep_cleaning",
    name: "Bathroom Deep Cleaning",
    price: 1500,
    pricingType: "fixed",
  },
  {
    id: "cleaning_sofa",
    serviceId: "deep_cleaning",
    name: "Sofa Cleaning",
    price: 1200,
    pricingType: "fixed",
  },
  {
    id: "cleaning_mattress",
    serviceId: "deep_cleaning",
    name: "Mattress Cleaning",
    price: 800,
    pricingType: "fixed",
  },
  // Painting
  {
    id: "painting_interior",
    serviceId: "painting",
    name: "Interior Painting",
    price: 18,
    pricingType: "per_sqft",
  },
  {
    id: "painting_exterior",
    serviceId: "painting",
    name: "Exterior Painting",
    price: 20,
    pricingType: "per_sqft",
  },
  {
    id: "painting_wall_putty",
    serviceId: "painting",
    name: "Wall Putty",
    price: 12,
    pricingType: "per_sqft",
  },
  {
    id: "painting_waterproofing",
    serviceId: "painting",
    name: "Waterproofing",
    price: 18,
    pricingType: "per_sqft",
  },
  {
    id: "painting_texture",
    serviceId: "painting",
    name: "Texture Painting",
    price: 45,
    pricingType: "per_sqft",
  },
  // AC Service
  {
    id: "ac_installation",
    serviceId: "ac_service",
    name: "AC Installation",
    price: 1800,
    pricingType: "fixed",
  },
  {
    id: "ac_gas_filling",
    serviceId: "ac_service",
    name: "AC Gas Filling",
    price: 2500,
    pricingType: "fixed",
  },
  {
    id: "ac_repair",
    serviceId: "ac_service",
    name: "AC Repair",
    price: 1200,
    pricingType: "fixed",
  },
  {
    id: "ac_general_service",
    serviceId: "ac_service",
    name: "AC General Service",
    price: 999,
    pricingType: "fixed",
  },
  {
    id: "ac_water_leakage_fix",
    serviceId: "ac_service",
    name: "AC Water Leakage Fix",
    price: 1000,
    pricingType: "fixed",
  },
  // Pest Control
  {
    id: "pest_termite_treatment",
    serviceId: "pest_control",
    name: "Termite Treatment",
    price: 3500,
    pricingType: "fixed",
  },
  {
    id: "pest_cockroach_control",
    serviceId: "pest_control",
    name: "Cockroach Control",
    price: 1200,
    pricingType: "fixed",
  },
  {
    id: "pest_bed_bug_treatment",
    serviceId: "pest_control",
    name: "Bed Bug Treatment",
    price: 2000,
    pricingType: "fixed",
  },
  {
    id: "pest_rodent_control",
    serviceId: "pest_control",
    name: "Rodent Control",
    price: 2500,
    pricingType: "fixed",
  },
  {
    id: "pest_general_control",
    serviceId: "pest_control",
    name: "General Pest Control",
    price: 1500,
    pricingType: "fixed",
  },
  // Estate Maintenance
  {
    id: "estate_garden_cleaning",
    serviceId: "estate_maintenance",
    name: "Garden Cleaning",
    price: 3000,
    pricingType: "fixed",
  },
  {
    id: "estate_grass_cutting",
    serviceId: "estate_maintenance",
    name: "Grass Cutting",
    price: 1500,
    pricingType: "fixed",
  },
  {
    id: "estate_borewell_service",
    serviceId: "estate_maintenance",
    name: "Borewell Service",
    price: 2500,
    pricingType: "fixed",
  },
  {
    id: "estate_farm_maintenance",
    serviceId: "estate_maintenance",
    name: "Farm Maintenance",
    price: 3000,
    pricingType: "per_acre",
  },
  {
    id: "estate_fence_repair",
    serviceId: "estate_maintenance",
    name: "Fence Repair",
    price: 2000,
    pricingType: "fixed",
  },
];
