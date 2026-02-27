import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface User {
    id: bigint;
    name: string;
    createdAt: bigint;
    role: Role;
}
export interface SubService {
    id: bigint;
    pricingType: string;
    name: string;
    createdAt: bigint;
    serviceId: bigint;
    basePrice: bigint;
}
export interface Service {
    id: bigint;
    pricingType: string;
    name: string;
    createdAt: bigint;
    category: string;
    basePrice: bigint;
}
export interface Booking {
    id: bigint;
    status: BookingStatus;
    balanceAmount: bigint;
    paymentStatus: string;
    propertyType: string;
    scheduledDate: string;
    scheduledTime: string;
    createdAt: bigint;
    commission: bigint;
    subServiceId: bigint;
    advanceAmount: bigint;
    totalAmount: bigint;
    address: string;
    technicianId?: bigint;
    notes: string;
    quantity: bigint;
    customerId: bigint;
    paymentReference?: string;
}
export interface Invoice {
    balanceAmount: bigint;
    serviceName: string;
    paymentStatus: string;
    bookingId: bigint;
    scheduledDate: string;
    scheduledTime: string;
    commission: bigint;
    subServiceName: string;
    advanceAmount: bigint;
    totalAmount: bigint;
    address: string;
    quantity: bigint;
}
export interface Technician {
    id: bigint;
    totalCompleted: bigint;
    totalAssigned: bigint;
    name: string;
    createdAt: bigint;
    activeStatus: boolean;
    phone: string;
}
export enum BookingStatus {
    assigned = "assigned",
    cancelled = "cancelled",
    pending = "pending",
    completed = "completed",
    confirmed = "confirmed",
    inProgress = "inProgress"
}
export enum Role {
    technician = "technician",
    admin = "admin",
    customer = "customer"
}
export interface backendInterface {
    assignTechnician(bookingId: bigint, technicianId: bigint): Promise<boolean>;
    cancelBooking(bookingId: bigint): Promise<boolean>;
    createBooking(customerId: bigint, subServiceId: bigint, propertyType: string, quantity: bigint, scheduledDate: string, scheduledTime: string, address: string, notes: string): Promise<Booking>;
    createService(name: string, category: string, basePrice: bigint, pricingType: string): Promise<Service>;
    createSubService(serviceId: bigint, name: string, basePrice: bigint, pricingType: string): Promise<SubService>;
    createTechnician(name: string, phone: string): Promise<Technician>;
    createUser(name: string, role: Role): Promise<User>;
    deactivateTechnician(technicianId: bigint): Promise<boolean>;
    generateInvoice(bookingId: bigint): Promise<Invoice | null>;
    getBookings(): Promise<Array<Booking>>;
    getServices(): Promise<Array<Service>>;
    getSubServicesByService(serviceId: bigint): Promise<Array<SubService>>;
    getTechnicians(): Promise<Array<Technician>>;
    getUsers(): Promise<Array<User>>;
    isSeedDone(): Promise<boolean>;
    markFullyPaid(bookingId: bigint): Promise<boolean>;
    markPayment(bookingId: bigint, referenceId: string): Promise<boolean>;
    seedData(): Promise<void>;
    seedSubServicesV2(): Promise<void>;
    updateBookingStatus(bookingId: bigint, newStatus: BookingStatus): Promise<boolean>;
}
