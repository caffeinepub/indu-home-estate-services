import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
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
    propertyType: string;
    createdAt: bigint;
    subServiceId: bigint;
    advanceAmount: bigint;
    totalAmount: bigint;
    quantity: bigint;
    customerId: bigint;
}
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
export enum BookingStatus {
    assigned = "assigned",
    cancelled = "cancelled",
    pending = "pending",
    completed = "completed",
    inProgress = "inProgress"
}
export enum Role {
    technician = "technician",
    admin = "admin",
    customer = "customer"
}
export interface backendInterface {
    createBooking(customerId: bigint, subServiceId: bigint, propertyType: string, quantity: bigint): Promise<Booking>;
    createService(name: string, category: string, basePrice: bigint, pricingType: string): Promise<Service>;
    createSubService(serviceId: bigint, name: string, basePrice: bigint, pricingType: string): Promise<SubService>;
    createUser(name: string, role: Role): Promise<User>;
    getBookings(): Promise<Array<Booking>>;
    getServices(): Promise<Array<Service>>;
    getSubServicesByService(serviceId: bigint): Promise<Array<SubService>>;
    getUsers(): Promise<Array<User>>;
}
