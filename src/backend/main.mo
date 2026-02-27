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
  var seedDone = false;

  public query func isSeedDone() : async Bool {
    seedDone;
  };

  public shared ({ caller }) func seedData() : async () {
    if (seedDone) { return };

    // Create hard-coded services
    let hardcodedServices : [Service] = [
      {
        id = 0;
        name = "Plumbing";
        category = "Home Repair";
        basePrice = 500;
        pricingType = "fixed";
        createdAt = Time.now();
      },
      {
        id = 1;
        name = "Electrical";
        category = "Home Repair";
        basePrice = 600;
        pricingType = "fixed";
        createdAt = Time.now();
      },
      {
        id = 2;
        name = "Deep Cleaning";
        category = "Cleaning";
        basePrice = 8;
        pricingType = "per_sqft";
        createdAt = Time.now();
      },
      {
        id = 3;
        name = "Painting";
        category = "Renovation";
        basePrice = 12;
        pricingType = "per_sqft";
        createdAt = Time.now();
      },
      {
        id = 4;
        name = "AC Service";
        category = "Appliances";
        basePrice = 1200;
        pricingType = "fixed";
        createdAt = Time.now();
      },
      {
        id = 5;
        name = "Pest Control";
        category = "Cleaning";
        basePrice = 1500;
        pricingType = "fixed";
        createdAt = Time.now();
      },
      {
        id = 6;
        name = "Estate Maintenance";
        category = "Estate";
        basePrice = 2000;
        pricingType = "custom";
        createdAt = Time.now();
      },
    ];

    let hardcodedSubServices : [SubService] = [
      // Plumbing (serviceId 0)
      {
        id = 0;
        serviceId = 0;
        name = "Leak Fix";
        basePrice = 500;
        pricingType = "fixed";
        createdAt = Time.now();
      },
      {
        id = 1;
        serviceId = 0;
        name = "Pipe Installation";
        basePrice = 800;
        pricingType = "fixed";
        createdAt = Time.now();
      },
      // Electrical (serviceId 1)
      {
        id = 2;
        serviceId = 1;
        name = "Wiring";
        basePrice = 600;
        pricingType = "fixed";
        createdAt = Time.now();
      },
      {
        id = 3;
        serviceId = 1;
        name = "Switch Board Repair";
        basePrice = 400;
        pricingType = "fixed";
        createdAt = Time.now();
      },
      // Deep Cleaning (serviceId 2)
      {
        id = 4;
        serviceId = 2;
        name = "Home Deep Cleaning";
        basePrice = 8;
        pricingType = "per_sqft";
        createdAt = Time.now();
      },
      {
        id = 5;
        serviceId = 2;
        name = "Apartment Deep Cleaning";
        basePrice = 8;
        pricingType = "per_sqft";
        createdAt = Time.now();
      },
      // Painting (serviceId 3)
      {
        id = 6;
        serviceId = 3;
        name = "Interior Painting";
        basePrice = 12;
        pricingType = "per_sqft";
        createdAt = Time.now();
      },
      {
        id = 7;
        serviceId = 3;
        name = "Exterior Painting";
        basePrice = 15;
        pricingType = "per_sqft";
        createdAt = Time.now();
      },
      // AC Service (serviceId 4)
      {
        id = 8;
        serviceId = 4;
        name = "AC General Service";
        basePrice = 1200;
        pricingType = "fixed";
        createdAt = Time.now();
      },
      {
        id = 9;
        serviceId = 4;
        name = "AC Gas Refill";
        basePrice = 2500;
        pricingType = "fixed";
        createdAt = Time.now();
      },
      // Pest Control (serviceId 5)
      {
        id = 10;
        serviceId = 5;
        name = "Termite Treatment";
        basePrice = 8000;
        pricingType = "fixed";
        createdAt = Time.now();
      },
      {
        id = 11;
        serviceId = 5;
        name = "General Pest Control";
        basePrice = 1500;
        pricingType = "fixed";
        createdAt = Time.now();
      },
      // Estate Maintenance (serviceId 6)
      {
        id = 12;
        serviceId = 6;
        name = "Garden Maintenance";
        basePrice = 3000;
        pricingType = "fixed";
        createdAt = Time.now();
      },
      {
        id = 13;
        serviceId = 6;
        name = "Full Estate Management";
        basePrice = 15000;
        pricingType = "fixed";
        createdAt = Time.now();
      },
    ];

    services := hardcodedServices;
    subServices := hardcodedSubServices;
    nextServiceId := 7;
    nextSubServiceId := 14;
    seedDone := true;
  };

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

  system func postupgrade() {
    if (services.size() == 0) {
      let hardcodedServices : [Service] = [
        {
          id = 0;
          name = "Plumbing";
          category = "Home Repair";
          basePrice = 500;
          pricingType = "fixed";
          createdAt = Time.now();
        },
        {
          id = 1;
          name = "Electrical";
          category = "Home Repair";
          basePrice = 600;
          pricingType = "fixed";
          createdAt = Time.now();
        },
        {
          id = 2;
          name = "Deep Cleaning";
          category = "Cleaning";
          basePrice = 8;
          pricingType = "per_sqft";
          createdAt = Time.now();
        },
        {
          id = 3;
          name = "Painting";
          category = "Renovation";
          basePrice = 12;
          pricingType = "per_sqft";
          createdAt = Time.now();
        },
        {
          id = 4;
          name = "AC Service";
          category = "Appliances";
          basePrice = 1200;
          pricingType = "fixed";
          createdAt = Time.now();
        },
        {
          id = 5;
          name = "Pest Control";
          category = "Cleaning";
          basePrice = 1500;
          pricingType = "fixed";
          createdAt = Time.now();
        },
        {
          id = 6;
          name = "Estate Maintenance";
          category = "Estate";
          basePrice = 2000;
          pricingType = "custom";
          createdAt = Time.now();
        },
      ];

      let hardcodedSubServices : [SubService] = [
        // Plumbing (serviceId 0)
        {
          id = 0;
          serviceId = 0;
          name = "Leak Fix";
          basePrice = 500;
          pricingType = "fixed";
          createdAt = Time.now();
        },
        {
          id = 1;
          serviceId = 0;
          name = "Pipe Installation";
          basePrice = 800;
          pricingType = "fixed";
          createdAt = Time.now();
        },
        // Electrical (serviceId 1)
        {
          id = 2;
          serviceId = 1;
          name = "Wiring";
          basePrice = 600;
          pricingType = "fixed";
          createdAt = Time.now();
        },
        {
          id = 3;
          serviceId = 1;
          name = "Switch Board Repair";
          basePrice = 400;
          pricingType = "fixed";
          createdAt = Time.now();
        },
        // Deep Cleaning (serviceId 2)
        {
          id = 4;
          serviceId = 2;
          name = "Home Deep Cleaning";
          basePrice = 8;
          pricingType = "per_sqft";
          createdAt = Time.now();
        },
        {
          id = 5;
          serviceId = 2;
          name = "Apartment Deep Cleaning";
          basePrice = 8;
          pricingType = "per_sqft";
          createdAt = Time.now();
        },
        // Painting (serviceId 3)
        {
          id = 6;
          serviceId = 3;
          name = "Interior Painting";
          basePrice = 12;
          pricingType = "per_sqft";
          createdAt = Time.now();
        },
        {
          id = 7;
          serviceId = 3;
          name = "Exterior Painting";
          basePrice = 15;
          pricingType = "per_sqft";
          createdAt = Time.now();
        },
        // AC Service (serviceId 4)
        {
          id = 8;
          serviceId = 4;
          name = "AC General Service";
          basePrice = 1200;
          pricingType = "fixed";
          createdAt = Time.now();
        },
        {
          id = 9;
          serviceId = 4;
          name = "AC Gas Refill";
          basePrice = 2500;
          pricingType = "fixed";
          createdAt = Time.now();
        },
        // Pest Control (serviceId 5)
        {
          id = 10;
          serviceId = 5;
          name = "Termite Treatment";
          basePrice = 8000;
          pricingType = "fixed";
          createdAt = Time.now();
        },
        {
          id = 11;
          serviceId = 5;
          name = "General Pest Control";
          basePrice = 1500;
          pricingType = "fixed";
          createdAt = Time.now();
        },
        // Estate Maintenance (serviceId 6)
        {
          id = 12;
          serviceId = 6;
          name = "Garden Maintenance";
          basePrice = 3000;
          pricingType = "fixed";
          createdAt = Time.now();
        },
        {
          id = 13;
          serviceId = 6;
          name = "Full Estate Management";
          basePrice = 15000;
          pricingType = "fixed";
          createdAt = Time.now();
        },
      ];

      services := hardcodedServices;
      subServices := hardcodedSubServices;
      nextServiceId := 7;
      nextSubServiceId := 14;
      seedDone := true;
    };
  };
};
