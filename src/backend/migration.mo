import Array "mo:core/Array";
import Nat "mo:core/Nat";

module {
  type Role = {
    #admin;
    #technician;
    #customer;
  };

  type User = {
    id : Nat;
    name : Text;
    role : Role;
    createdAt : Int;
  };

  type Service = {
    id : Nat;
    name : Text;
    category : Text;
    basePrice : Nat;
    pricingType : Text;
    createdAt : Int;
  };

  type SubService = {
    id : Nat;
    serviceId : Nat;
    name : Text;
    basePrice : Nat;
    pricingType : Text;
    createdAt : Int;
  };

  type Technician = {
    id : Nat;
    name : Text;
    phone : Text;
    activeStatus : Bool;
    createdAt : Int;
    totalAssigned : Nat;
    totalCompleted : Nat;
  };

  type BookingStatus = {
    #pending;
    #confirmed;
    #assigned;
    #inProgress;
    #completed;
    #cancelled;
  };

  // Old Booking type (without balanceAmount)
  type OldBooking = {
    id : Nat;
    customerId : Nat;
    subServiceId : Nat;
    propertyType : Text;
    quantity : Nat;
    totalAmount : Nat;
    advanceAmount : Nat;
    commission : Nat;
    status : BookingStatus;
    createdAt : Int;
    technicianId : ?Nat;
    paymentStatus : Text;
    paymentReference : ?Text;
    scheduledDate : Text;
    scheduledTime : Text;
    address : Text;
    notes : Text;
  };

  // New Booking type (with balanceAmount)
  type NewBooking = {
    id : Nat;
    customerId : Nat;
    subServiceId : Nat;
    propertyType : Text;
    quantity : Nat;
    totalAmount : Nat;
    advanceAmount : Nat;
    commission : Nat;
    status : BookingStatus;
    createdAt : Int;
    technicianId : ?Nat;
    paymentStatus : Text;
    paymentReference : ?Text;
    scheduledDate : Text;
    scheduledTime : Text;
    address : Text;
    notes : Text;
    balanceAmount : Nat;
  };

  // Old Actor State (without balanceAmount in Booking)
  type OldState = {
    users : [User];
    services : [Service];
    subServices : [SubService];
    bookings : [OldBooking];
    technicians : [Technician];
    nextUserId : Nat;
    nextServiceId : Nat;
    nextSubServiceId : Nat;
    nextBookingId : Nat;
    seedDone : Bool;
    subServicesSeedV2Done : Bool;
    nextTechnicianId : Nat;
  };

  // New Actor State (with balanceAmount in Booking)
  type NewState = {
    users : [User];
    services : [Service];
    subServices : [SubService];
    bookings : [NewBooking];
    technicians : [Technician];
    nextUserId : Nat;
    nextServiceId : Nat;
    nextSubServiceId : Nat;
    nextBookingId : Nat;
    seedDone : Bool;
    subServicesSeedV2Done : Bool;
    nextTechnicianId : Nat;
  };

  public func run(old : OldState) : NewState {
    let newBookings = old.bookings.map(
      func(oldBooking) {
        let balanceAmount = if (oldBooking.totalAmount > oldBooking.advanceAmount) {
          oldBooking.totalAmount - oldBooking.advanceAmount;
        } else {
          0;
        };

        {
          oldBooking with
          balanceAmount
        };
      }
    );

    {
      old with
      bookings = newBookings;
    };
  };
};
