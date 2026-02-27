import Array "mo:core/Array";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Migration "migration";

(with migration = Migration.run)
actor {
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

  type BookingStatus = {
    #pending;
    #assigned;
    #inProgress;
    #completed;
    #cancelled;
  };

  type Booking = {
    id : Nat;
    customerId : Nat;
    subServiceId : Nat;
    propertyType : Text;
    quantity : Nat;
    totalAmount : Nat;
    advanceAmount : Nat;
    status : BookingStatus;
    createdAt : Int;
  };

  var users : [User] = [];
  var services : [Service] = [];
  var subServices : [SubService] = [];
  var bookings : [Booking] = [];
  var nextUserId = 0;
  var nextServiceId = 0;
  var nextSubServiceId = 0;
  var nextBookingId = 0;

  public shared ({ caller }) func createUser(name : Text, role : Role) : async User {
    let user : User = {
      id = nextUserId;
      name;
      role;
      createdAt = Time.now();
    };
    users := users.concat([user]);
    nextUserId += 1;
    user;
  };

  public query ({ caller }) func getUsers() : async [User] {
    users;
  };

  public shared ({ caller }) func createService(name : Text, category : Text, basePrice : Nat, pricingType : Text) : async Service {
    let service : Service = {
      id = nextServiceId;
      name;
      category;
      basePrice;
      pricingType;
      createdAt = Time.now();
    };
    services := services.concat([service]);
    nextServiceId += 1;
    service;
  };

  public query ({ caller }) func getServices() : async [Service] {
    services;
  };

  public shared ({ caller }) func createSubService(serviceId : Nat, name : Text, basePrice : Nat, pricingType : Text) : async SubService {
    let subService : SubService = {
      id = nextSubServiceId;
      serviceId;
      name;
      basePrice;
      pricingType;
      createdAt = Time.now();
    };
    subServices := subServices.concat([subService]);
    nextSubServiceId += 1;
    subService;
  };

  public query ({ caller }) func getSubServicesByService(serviceId : Nat) : async [SubService] {
    subServices.filter(
      func(subService) {
        subService.serviceId == serviceId;
      }
    );
  };

  public shared ({ caller }) func createBooking(customerId : Nat, subServiceId : Nat, propertyType : Text, quantity : Nat) : async Booking {
    // Step 1: Find the subService by id
    // Step 2: Get basePrice and pricingType from the found subService (default to basePrice=0, pricingType="fixed" if not found)
    // Step 3: Calculate totalAmount:
    //   if pricingType == "fixed": totalAmount = basePrice
    //   if pricingType == "per_sqft": totalAmount = quantity * basePrice
    //   if pricingType == "per_acre": totalAmount = quantity * basePrice
    //   otherwise: totalAmount = basePrice
    // Step 4: Apply minimum charge: if totalAmount < 1000, set totalAmount = 1000
    // Step 5: advanceAmount = totalAmount / 3
    // Step 6: Create and store booking with status = #pending, totalAmount, advanceAmount

    let foundSubService = subServices.find(func(s) { s.id == subServiceId });
    let basePrice = switch (foundSubService) {
      case (null) { 0 };
      case (?subService) { subService.basePrice };
    };
    let pricingType = switch (foundSubService) {
      case (null) { "fixed" };
      case (?subService) { subService.pricingType };
    };

    var totalAmount = switch (pricingType) {
      case ("fixed") { basePrice };
      case ("per_sqft") { quantity * basePrice };
      case ("per_acre") { quantity * basePrice };
      case (_) { basePrice };
    };

    if (totalAmount < 1000) { totalAmount := 1000 };
    let advanceAmount = totalAmount / 3;

    let booking : Booking = {
      id = nextBookingId;
      customerId;
      subServiceId;
      propertyType;
      quantity;
      totalAmount;
      advanceAmount;
      status = #pending;
      createdAt = Time.now();
    };

    bookings := bookings.concat([booking]);
    nextBookingId += 1;
    booking;
  };

  public query ({ caller }) func getBookings() : async [Booking] {
    bookings;
  };
};
