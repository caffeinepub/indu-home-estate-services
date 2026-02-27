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

  type Booking = {
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

  type Invoice = {
    bookingId : Nat;
    serviceName : Text;
    subServiceName : Text;
    quantity : Nat;
    totalAmount : Nat;
    advanceAmount : Nat;
    balanceAmount : Nat;
    commission : Nat;
    paymentStatus : Text;
    scheduledDate : Text;
    scheduledTime : Text;
    address : Text;
  };

  stable var users : [User] = [];
  stable var services : [Service] = [];
  stable var subServices : [SubService] = [];
  stable var bookings : [Booking] = [];
  stable var technicians : [Technician] = [];
  stable var nextUserId = 0;
  stable var nextServiceId = 0;
  stable var nextSubServiceId = 0;
  stable var nextBookingId = 0;
  stable var seedDone = false;
  stable var subServicesSeedV2Done = false;
  stable var nextTechnicianId = 0;

  public query func isSeedDone() : async Bool {
    seedDone;
  };

  public shared ({ caller }) func seedData() : async () {
    if (seedDone) { return };

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

  public shared ({ caller }) func seedSubServicesV2() : async () {
    if (subServicesSeedV2Done) { return };

    let newSubServices : [SubService] = [
      // Plumbing (serviceId 0) — IDs 14–23
      { id = 14; serviceId = 0; name = "Leak Detection"; basePrice = 699; pricingType = "fixed"; createdAt = Time.now() },
      { id = 15; serviceId = 0; name = "Tap Installation"; basePrice = 499; pricingType = "fixed"; createdAt = Time.now() },
      { id = 16; serviceId = 0; name = "Shower Installation"; basePrice = 999; pricingType = "fixed"; createdAt = Time.now() },
      { id = 17; serviceId = 0; name = "Geyser Plumbing"; basePrice = 1200; pricingType = "fixed"; createdAt = Time.now() },
      { id = 18; serviceId = 0; name = "Drain Block Removal"; basePrice = 1200; pricingType = "fixed"; createdAt = Time.now() },
      { id = 19; serviceId = 0; name = "Bathroom Renovation Plumbing"; basePrice = 5000; pricingType = "fixed"; createdAt = Time.now() },
      { id = 20; serviceId = 0; name = "Borewell Motor Connection"; basePrice = 1500; pricingType = "fixed"; createdAt = Time.now() },
      { id = 21; serviceId = 0; name = "Overhead Tank Plumbing"; basePrice = 2000; pricingType = "fixed"; createdAt = Time.now() },
      { id = 22; serviceId = 0; name = "Water Pressure Fix"; basePrice = 800; pricingType = "fixed"; createdAt = Time.now() },
      { id = 23; serviceId = 0; name = "Pipeline Replacement"; basePrice = 3500; pricingType = "fixed"; createdAt = Time.now() },

      // Electrical (serviceId 1) — IDs 24–33
      { id = 24; serviceId = 1; name = "Full House Wiring"; basePrice = 25; pricingType = "per_sqft"; createdAt = Time.now() },
      { id = 25; serviceId = 1; name = "Switch Installation"; basePrice = 299; pricingType = "fixed"; createdAt = Time.now() },
      { id = 26; serviceId = 1; name = "MCB Installation"; basePrice = 799; pricingType = "fixed"; createdAt = Time.now() },
      { id = 27; serviceId = 1; name = "Earthing Work"; basePrice = 2500; pricingType = "fixed"; createdAt = Time.now() },
      { id = 28; serviceId = 1; name = "Power Backup Setup"; basePrice = 1500; pricingType = "fixed"; createdAt = Time.now() },
      { id = 29; serviceId = 1; name = "Solar Panel Wiring"; basePrice = 5000; pricingType = "fixed"; createdAt = Time.now() },
      { id = 30; serviceId = 1; name = "Outdoor Lighting"; basePrice = 1200; pricingType = "fixed"; createdAt = Time.now() },
      { id = 31; serviceId = 1; name = "LED Conversion"; basePrice = 299; pricingType = "fixed"; createdAt = Time.now() },
      { id = 32; serviceId = 1; name = "Electrical Inspection"; basePrice = 699; pricingType = "fixed"; createdAt = Time.now() },
      { id = 33; serviceId = 1; name = "Fuse Replacement"; basePrice = 299; pricingType = "fixed"; createdAt = Time.now() },

      // Deep Cleaning (serviceId 2) — IDs 34–43
      { id = 34; serviceId = 2; name = "Full House Deep Cleaning"; basePrice = 8; pricingType = "per_sqft"; createdAt = Time.now() },
      { id = 35; serviceId = 2; name = "Villa Deep Cleaning"; basePrice = 7; pricingType = "per_sqft"; createdAt = Time.now() },
      { id = 36; serviceId = 2; name = "Move-in Cleaning"; basePrice = 4000; pricingType = "fixed"; createdAt = Time.now() },
      { id = 37; serviceId = 2; name = "Move-out Cleaning"; basePrice = 4000; pricingType = "fixed"; createdAt = Time.now() },
      { id = 38; serviceId = 2; name = "Post Construction Cleaning"; basePrice = 10; pricingType = "per_sqft"; createdAt = Time.now() },
      { id = 39; serviceId = 2; name = "Office Deep Cleaning"; basePrice = 6; pricingType = "per_sqft"; createdAt = Time.now() },
      { id = 40; serviceId = 2; name = "Floor Scrubbing"; basePrice = 3; pricingType = "per_sqft"; createdAt = Time.now() },
      { id = 41; serviceId = 2; name = "Marble Polishing"; basePrice = 5; pricingType = "per_sqft"; createdAt = Time.now() },
      { id = 42; serviceId = 2; name = "Window Cleaning"; basePrice = 1500; pricingType = "fixed"; createdAt = Time.now() },
      { id = 43; serviceId = 2; name = "Carpet Cleaning"; basePrice = 2000; pricingType = "fixed"; createdAt = Time.now() },

      // Painting (serviceId 3) — IDs 44–53
      { id = 44; serviceId = 3; name = "Interior Repainting"; basePrice = 12; pricingType = "per_sqft"; createdAt = Time.now() },
      { id = 45; serviceId = 3; name = "Exterior Repainting"; basePrice = 18; pricingType = "per_sqft"; createdAt = Time.now() },
      { id = 46; serviceId = 3; name = "Commercial Painting"; basePrice = 10; pricingType = "per_sqft"; createdAt = Time.now() },
      { id = 47; serviceId = 3; name = "Fence Painting"; basePrice = 2000; pricingType = "fixed"; createdAt = Time.now() },
      { id = 48; serviceId = 3; name = "Gate Painting"; basePrice = 1500; pricingType = "fixed"; createdAt = Time.now() },
      { id = 49; serviceId = 3; name = "Ceiling Painting"; basePrice = 8; pricingType = "per_sqft"; createdAt = Time.now() },
      { id = 50; serviceId = 3; name = "Crack Filling"; basePrice = 3000; pricingType = "fixed"; createdAt = Time.now() },
      { id = 51; serviceId = 3; name = "Damp Proof Painting"; basePrice = 20; pricingType = "per_sqft"; createdAt = Time.now() },
      { id = 52; serviceId = 3; name = "Primer Application"; basePrice = 6; pricingType = "per_sqft"; createdAt = Time.now() },
      { id = 53; serviceId = 3; name = "Luxury Finish Painting"; basePrice = 45; pricingType = "per_sqft"; createdAt = Time.now() },

      // AC Service (serviceId 4) — IDs 54–63
      { id = 54; serviceId = 4; name = "Split AC Installation"; basePrice = 1800; pricingType = "fixed"; createdAt = Time.now() },
      { id = 55; serviceId = 4; name = "Window AC Installation"; basePrice = 1200; pricingType = "fixed"; createdAt = Time.now() },
      { id = 56; serviceId = 4; name = "AC Dismantling"; basePrice = 800; pricingType = "fixed"; createdAt = Time.now() },
      { id = 57; serviceId = 4; name = "AC Relocation"; basePrice = 2500; pricingType = "fixed"; createdAt = Time.now() },
      { id = 58; serviceId = 4; name = "Cooling Issue Diagnosis"; basePrice = 499; pricingType = "fixed"; createdAt = Time.now() },
      { id = 59; serviceId = 4; name = "AC Coil Cleaning"; basePrice = 1500; pricingType = "fixed"; createdAt = Time.now() },
      { id = 60; serviceId = 4; name = "AC PCB Repair"; basePrice = 2000; pricingType = "fixed"; createdAt = Time.now() },
      { id = 61; serviceId = 4; name = "AMC Annual Contract"; basePrice = 3500; pricingType = "fixed"; createdAt = Time.now() },
      { id = 62; serviceId = 4; name = "AC Deep Service"; basePrice = 1999; pricingType = "fixed"; createdAt = Time.now() },
      { id = 63; serviceId = 4; name = "AC Water Leakage Fix"; basePrice = 999; pricingType = "fixed"; createdAt = Time.now() },

      // Pest Control (serviceId 5) — IDs 64–73
      { id = 64; serviceId = 5; name = "Termite Anti Treatment"; basePrice = 12; pricingType = "per_sqft"; createdAt = Time.now() },
      { id = 65; serviceId = 5; name = "Pre Construction Termite"; basePrice = 10; pricingType = "per_sqft"; createdAt = Time.now() },
      { id = 66; serviceId = 5; name = "Cockroach Gel Treatment"; basePrice = 1200; pricingType = "fixed"; createdAt = Time.now() },
      { id = 67; serviceId = 5; name = "Mosquito Fogging"; basePrice = 1500; pricingType = "fixed"; createdAt = Time.now() },
      { id = 68; serviceId = 5; name = "Ant Control"; basePrice = 1000; pricingType = "fixed"; createdAt = Time.now() },
      { id = 69; serviceId = 5; name = "Spider Control"; basePrice = 1000; pricingType = "fixed"; createdAt = Time.now() },
      { id = 70; serviceId = 5; name = "Lizard Control"; basePrice = 1200; pricingType = "fixed"; createdAt = Time.now() },
      { id = 71; serviceId = 5; name = "Warehouse Pest Control"; basePrice = 5; pricingType = "per_sqft"; createdAt = Time.now() },
      { id = 72; serviceId = 5; name = "Farm Pest Control"; basePrice = 2500; pricingType = "fixed"; createdAt = Time.now() },
      { id = 73; serviceId = 5; name = "Eco Friendly Pest Control"; basePrice = 1800; pricingType = "fixed"; createdAt = Time.now() },

      // Estate Maintenance (serviceId 6) — IDs 74–83
      { id = 74; serviceId = 6; name = "Full Estate Supervision"; basePrice = 20000; pricingType = "fixed"; createdAt = Time.now() },
      { id = 75; serviceId = 6; name = "Farm Management"; basePrice = 15000; pricingType = "fixed"; createdAt = Time.now() },
      { id = 76; serviceId = 6; name = "Coffee Plantation Maintenance"; basePrice = 3000; pricingType = "per_acre"; createdAt = Time.now() },
      { id = 77; serviceId = 6; name = "Irrigation System Check"; basePrice = 3500; pricingType = "fixed"; createdAt = Time.now() },
      { id = 78; serviceId = 6; name = "Fence Repair"; basePrice = 2000; pricingType = "fixed"; createdAt = Time.now() },
      { id = 79; serviceId = 6; name = "Labor Supervision"; basePrice = 5000; pricingType = "fixed"; createdAt = Time.now() },
      { id = 80; serviceId = 6; name = "Property Inspection"; basePrice = 2500; pricingType = "fixed"; createdAt = Time.now() },
      { id = 81; serviceId = 6; name = "Estate Cleaning"; basePrice = 500; pricingType = "per_acre"; createdAt = Time.now() },
      { id = 82; serviceId = 6; name = "Security Patrol"; basePrice = 8000; pricingType = "fixed"; createdAt = Time.now() },
      { id = 83; serviceId = 6; name = "Harvest Support"; basePrice = 4000; pricingType = "fixed"; createdAt = Time.now() }
    ];

    subServices := subServices.concat(newSubServices);
    nextSubServiceId := 84;
    subServicesSeedV2Done := true;
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

  public query ({ caller }) func getTechnicians() : async [Technician] {
    technicians;
  };

  public shared ({ caller }) func createBooking(
    customerId : Nat,
    subServiceId : Nat,
    propertyType : Text,
    quantity : Nat,
    scheduledDate : Text,
    scheduledTime : Text,
    address : Text,
    notes : Text,
  ) : async Booking {
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
    let commission = totalAmount / 10;
    let balanceAmount = totalAmount - advanceAmount;

    let booking : Booking = {
      id = nextBookingId;
      customerId;
      subServiceId;
      propertyType;
      quantity;
      totalAmount;
      advanceAmount;
      commission;
      status = #pending;
      createdAt = Time.now();
      technicianId = null;
      paymentStatus = "unpaid";
      paymentReference = null;
      scheduledDate;
      scheduledTime;
      address;
      notes;
      balanceAmount;
    };

    bookings := bookings.concat([booking]);
    nextBookingId += 1;
    booking;
  };

  public shared ({ caller }) func assignTechnician(bookingId : Nat, technicianId : Nat) : async Bool {
    var found = false;

    // Update booking status and technician ID
    bookings := bookings.map<Booking, Booking>(
      func(b) {
        if (b.id == bookingId and not found) {
          found := true;
          {
            b with
            technicianId = ?technicianId;
            status = #assigned;
          };
        } else { b };
      }
    );

    // Increment totalAssigned for the specific technician who was assigned
    technicians := technicians.map<Technician, Technician>(
      func(t) {
        if (t.id == technicianId and found) {
          { t with totalAssigned = t.totalAssigned + 1 };
        } else { t };
      }
    );

    found;
  };

  public shared ({ caller }) func markPayment(bookingId : Nat, referenceId : Text) : async Bool {
    var found = false;
    bookings := bookings.map<Booking, Booking>(
      func(b) {
        if (b.id == bookingId and not found) {
          found := true;
          {
            b with
            paymentStatus = "partial";
            paymentReference = ?referenceId;
            status = #confirmed;
          };
        } else { b };
      }
    );
    found;
  };

  func canTransition(currentStatus : BookingStatus, newStatus : BookingStatus) : Bool {
    switch (currentStatus, newStatus) {
      case (#pending, #assigned) { true };
      case (#assigned, #inProgress) { true };
      case (#inProgress, #completed) { true };
      case (_, #cancelled) { true };
      case (#confirmed, #assigned) { true };
      case (_, _) { false };
    };
  };

  public shared ({ caller }) func updateBookingStatus(bookingId : Nat, newStatus : BookingStatus) : async Bool {
    var found = false;
    var transitionAllowed = false;
    var assignedTechnicianId : ?Nat = null;

    bookings := bookings.map<Booking, Booking>(
      func(b) {
        if (b.id == bookingId and not found) {
          found := true;
          if (canTransition(b.status, newStatus)) {
            transitionAllowed := true;
            assignedTechnicianId := b.technicianId;
            { b with status = newStatus };
          } else { b };
        } else { b };
      }
    );

    // Increment totalCompleted for the assigned technician when completing
    if (transitionAllowed and newStatus == #completed) {
      let technicianId = switch (assignedTechnicianId) {
        case (null) { null };
        case (?id) {
          technicians := technicians.map<Technician, Technician>(
            func(t) {
              if (t.id == id) {
                { t with totalCompleted = t.totalCompleted + 1 };
              } else { t };
            }
          );
          null;
        };
      };
    };

    found and transitionAllowed;
  };

  public shared ({ caller }) func createTechnician(name : Text, phone : Text) : async Technician {
    let technician : Technician = {
      id = nextTechnicianId;
      name;
      phone;
      activeStatus = true;
      createdAt = Time.now();
      totalAssigned = 0;
      totalCompleted = 0;
    };
    technicians := technicians.concat([technician]);
    nextTechnicianId += 1;
    technician;
  };

  public shared ({ caller }) func deactivateTechnician(technicianId : Nat) : async Bool {
    var found = false;
    technicians := technicians.map<Technician, Technician>(
      func(t) {
        if (t.id == technicianId and not found) {
          found := true;
          { t with activeStatus = false };
        } else { t };
      }
    );
    found;
  };

  public query ({ caller }) func generateInvoice(bookingId : Nat) : async ?Invoice {
    let bookingOpt = bookings.find(func(b) { b.id == bookingId });
    switch (bookingOpt) {
      case (null) { null };
      case (?booking) {
        let subServiceOpt = subServices.find(
          func(s) { s.id == booking.subServiceId }
        );
        let (serviceName, subServiceName) = switch (subServiceOpt) {
          case (null) { ("Unknown", "Unknown") };
          case (?subService) {
            let serviceOpt = services.find(
              func(s) { s.id == subService.serviceId }
            );
            switch (serviceOpt) {
              case (null) { ("Unknown", subService.name) };
              case (?service) { (service.name, subService.name) };
            };
          };
        };

        let invoice : Invoice = {
          bookingId = booking.id;
          serviceName;
          subServiceName;
          quantity = booking.quantity;
          totalAmount = booking.totalAmount;
          advanceAmount = booking.advanceAmount;
          balanceAmount = switch (booking.totalAmount > booking.advanceAmount) {
            case (true) { booking.totalAmount - booking.advanceAmount };
            case (false) { 0 };
          };
          commission = booking.commission;
          paymentStatus = booking.paymentStatus;
          scheduledDate = booking.scheduledDate;
          scheduledTime = booking.scheduledTime;
          address = booking.address;
        };
        ?invoice;
      };
    };
  };

  public query ({ caller }) func getBookings() : async [Booking] {
    bookings;
  };

  public shared ({ caller }) func markFullyPaid(bookingId : Nat) : async Bool {
    var found = false;
    bookings := bookings.map<Booking, Booking>(
      func(b) {
        if (b.id == bookingId and not found) {
          found := true;
          { b with paymentStatus = "paid" };
        } else { b };
      }
    );
    found;
  };

  public shared ({ caller }) func cancelBooking(bookingId : Nat) : async Bool {
    var found = false;
    bookings := bookings.map<Booking, Booking>(
      func(b) {
        if (b.id == bookingId and not found) {
          found := true;
          { b with status = #cancelled };
        } else { b };
      }
    );
    found;
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

    if (not subServicesSeedV2Done) {
      let newSubServices : [SubService] = [
        { id = 14; serviceId = 0; name = "Leak Detection"; basePrice = 699; pricingType = "fixed"; createdAt = Time.now() },
        { id = 15; serviceId = 0; name = "Tap Installation"; basePrice = 499; pricingType = "fixed"; createdAt = Time.now() },
        { id = 16; serviceId = 0; name = "Shower Installation"; basePrice = 999; pricingType = "fixed"; createdAt = Time.now() },
        { id = 17; serviceId = 0; name = "Geyser Plumbing"; basePrice = 1200; pricingType = "fixed"; createdAt = Time.now() },
        { id = 18; serviceId = 0; name = "Drain Block Removal"; basePrice = 1200; pricingType = "fixed"; createdAt = Time.now() },
        { id = 19; serviceId = 0; name = "Bathroom Renovation Plumbing"; basePrice = 5000; pricingType = "fixed"; createdAt = Time.now() },
        { id = 20; serviceId = 0; name = "Borewell Motor Connection"; basePrice = 1500; pricingType = "fixed"; createdAt = Time.now() },
        { id = 21; serviceId = 0; name = "Overhead Tank Plumbing"; basePrice = 2000; pricingType = "fixed"; createdAt = Time.now() },
        { id = 22; serviceId = 0; name = "Water Pressure Fix"; basePrice = 800; pricingType = "fixed"; createdAt = Time.now() },
        { id = 23; serviceId = 0; name = "Pipeline Replacement"; basePrice = 3500; pricingType = "fixed"; createdAt = Time.now() },
        { id = 24; serviceId = 1; name = "Full House Wiring"; basePrice = 25; pricingType = "per_sqft"; createdAt = Time.now() },
        { id = 25; serviceId = 1; name = "Switch Installation"; basePrice = 299; pricingType = "fixed"; createdAt = Time.now() },
        { id = 26; serviceId = 1; name = "MCB Installation"; basePrice = 799; pricingType = "fixed"; createdAt = Time.now() },
        { id = 27; serviceId = 1; name = "Earthing Work"; basePrice = 2500; pricingType = "fixed"; createdAt = Time.now() },
        { id = 28; serviceId = 1; name = "Power Backup Setup"; basePrice = 1500; pricingType = "fixed"; createdAt = Time.now() },
        { id = 29; serviceId = 1; name = "Solar Panel Wiring"; basePrice = 5000; pricingType = "fixed"; createdAt = Time.now() },
        { id = 30; serviceId = 1; name = "Outdoor Lighting"; basePrice = 1200; pricingType = "fixed"; createdAt = Time.now() },
        { id = 31; serviceId = 1; name = "LED Conversion"; basePrice = 299; pricingType = "fixed"; createdAt = Time.now() },
        { id = 32; serviceId = 1; name = "Electrical Inspection"; basePrice = 699; pricingType = "fixed"; createdAt = Time.now() },
        { id = 33; serviceId = 1; name = "Fuse Replacement"; basePrice = 299; pricingType = "fixed"; createdAt = Time.now() },
        { id = 34; serviceId = 2; name = "Full House Deep Cleaning"; basePrice = 8; pricingType = "per_sqft"; createdAt = Time.now() },
        { id = 35; serviceId = 2; name = "Villa Deep Cleaning"; basePrice = 7; pricingType = "per_sqft"; createdAt = Time.now() },
        { id = 36; serviceId = 2; name = "Move-in Cleaning"; basePrice = 4000; pricingType = "fixed"; createdAt = Time.now() },
        { id = 37; serviceId = 2; name = "Move-out Cleaning"; basePrice = 4000; pricingType = "fixed"; createdAt = Time.now() },
        { id = 38; serviceId = 2; name = "Post Construction Cleaning"; basePrice = 10; pricingType = "per_sqft"; createdAt = Time.now() },
        { id = 39; serviceId = 2; name = "Office Deep Cleaning"; basePrice = 6; pricingType = "per_sqft"; createdAt = Time.now() },
        { id = 40; serviceId = 2; name = "Floor Scrubbing"; basePrice = 3; pricingType = "per_sqft"; createdAt = Time.now() },
        { id = 41; serviceId = 2; name = "Marble Polishing"; basePrice = 5; pricingType = "per_sqft"; createdAt = Time.now() },
        { id = 42; serviceId = 2; name = "Window Cleaning"; basePrice = 1500; pricingType = "fixed"; createdAt = Time.now() },
        { id = 43; serviceId = 2; name = "Carpet Cleaning"; basePrice = 2000; pricingType = "fixed"; createdAt = Time.now() },
        { id = 44; serviceId = 3; name = "Interior Repainting"; basePrice = 12; pricingType = "per_sqft"; createdAt = Time.now() },
        { id = 45; serviceId = 3; name = "Exterior Repainting"; basePrice = 18; pricingType = "per_sqft"; createdAt = Time.now() },
        { id = 46; serviceId = 3; name = "Commercial Painting"; basePrice = 10; pricingType = "per_sqft"; createdAt = Time.now() },
        { id = 47; serviceId = 3; name = "Fence Painting"; basePrice = 2000; pricingType = "fixed"; createdAt = Time.now() },
        { id = 48; serviceId = 3; name = "Gate Painting"; basePrice = 1500; pricingType = "fixed"; createdAt = Time.now() },
        { id = 49; serviceId = 3; name = "Ceiling Painting"; basePrice = 8; pricingType = "per_sqft"; createdAt = Time.now() },
        { id = 50; serviceId = 3; name = "Crack Filling"; basePrice = 3000; pricingType = "fixed"; createdAt = Time.now() },
        { id = 51; serviceId = 3; name = "Damp Proof Painting"; basePrice = 20; pricingType = "per_sqft"; createdAt = Time.now() },
        { id = 52; serviceId = 3; name = "Primer Application"; basePrice = 6; pricingType = "per_sqft"; createdAt = Time.now() },
        { id = 53; serviceId = 3; name = "Luxury Finish Painting"; basePrice = 45; pricingType = "per_sqft"; createdAt = Time.now() },
        { id = 54; serviceId = 4; name = "Split AC Installation"; basePrice = 1800; pricingType = "fixed"; createdAt = Time.now() },
        { id = 55; serviceId = 4; name = "Window AC Installation"; basePrice = 1200; pricingType = "fixed"; createdAt = Time.now() },
        { id = 56; serviceId = 4; name = "AC Dismantling"; basePrice = 800; pricingType = "fixed"; createdAt = Time.now() },
        { id = 57; serviceId = 4; name = "AC Relocation"; basePrice = 2500; pricingType = "fixed"; createdAt = Time.now() },
        { id = 58; serviceId = 4; name = "Cooling Issue Diagnosis"; basePrice = 499; pricingType = "fixed"; createdAt = Time.now() },
        { id = 59; serviceId = 4; name = "AC Coil Cleaning"; basePrice = 1500; pricingType = "fixed"; createdAt = Time.now() },
        { id = 60; serviceId = 4; name = "AC PCB Repair"; basePrice = 2000; pricingType = "fixed"; createdAt = Time.now() },
        { id = 61; serviceId = 4; name = "AMC Annual Contract"; basePrice = 3500; pricingType = "fixed"; createdAt = Time.now() },
        { id = 62; serviceId = 4; name = "AC Deep Service"; basePrice = 1999; pricingType = "fixed"; createdAt = Time.now() },
        { id = 63; serviceId = 4; name = "AC Water Leakage Fix"; basePrice = 999; pricingType = "fixed"; createdAt = Time.now() },
        { id = 64; serviceId = 5; name = "Termite Anti Treatment"; basePrice = 12; pricingType = "per_sqft"; createdAt = Time.now() },
        { id = 65; serviceId = 5; name = "Pre Construction Termite"; basePrice = 10; pricingType = "per_sqft"; createdAt = Time.now() },
        { id = 66; serviceId = 5; name = "Cockroach Gel Treatment"; basePrice = 1200; pricingType = "fixed"; createdAt = Time.now() },
        { id = 67; serviceId = 5; name = "Mosquito Fogging"; basePrice = 1500; pricingType = "fixed"; createdAt = Time.now() },
        { id = 68; serviceId = 5; name = "Ant Control"; basePrice = 1000; pricingType = "fixed"; createdAt = Time.now() },
        { id = 69; serviceId = 5; name = "Spider Control"; basePrice = 1000; pricingType = "fixed"; createdAt = Time.now() },
        { id = 70; serviceId = 5; name = "Lizard Control"; basePrice = 1200; pricingType = "fixed"; createdAt = Time.now() },
        { id = 71; serviceId = 5; name = "Warehouse Pest Control"; basePrice = 5; pricingType = "per_sqft"; createdAt = Time.now() },
        { id = 72; serviceId = 5; name = "Farm Pest Control"; basePrice = 2500; pricingType = "fixed"; createdAt = Time.now() },
        { id = 73; serviceId = 5; name = "Eco Friendly Pest Control"; basePrice = 1800; pricingType = "fixed"; createdAt = Time.now() },
        { id = 74; serviceId = 6; name = "Full Estate Supervision"; basePrice = 20000; pricingType = "fixed"; createdAt = Time.now() },
        { id = 75; serviceId = 6; name = "Farm Management"; basePrice = 15000; pricingType = "fixed"; createdAt = Time.now() },
        { id = 76; serviceId = 6; name = "Coffee Plantation Maintenance"; basePrice = 3000; pricingType = "per_acre"; createdAt = Time.now() },
        { id = 77; serviceId = 6; name = "Irrigation System Check"; basePrice = 3500; pricingType = "fixed"; createdAt = Time.now() },
        { id = 78; serviceId = 6; name = "Fence Repair"; basePrice = 2000; pricingType = "fixed"; createdAt = Time.now() },
        { id = 79; serviceId = 6; name = "Labor Supervision"; basePrice = 5000; pricingType = "fixed"; createdAt = Time.now() },
        { id = 80; serviceId = 6; name = "Property Inspection"; basePrice = 2500; pricingType = "fixed"; createdAt = Time.now() },
        { id = 81; serviceId = 6; name = "Estate Cleaning"; basePrice = 500; pricingType = "per_acre"; createdAt = Time.now() },
        { id = 82; serviceId = 6; name = "Security Patrol"; basePrice = 8000; pricingType = "fixed"; createdAt = Time.now() },
        { id = 83; serviceId = 6; name = "Harvest Support"; basePrice = 4000; pricingType = "fixed"; createdAt = Time.now() }
      ];

      subServices := subServices.concat(newSubServices);
      nextSubServiceId := 84;
      subServicesSeedV2Done := true;
    };
  };
};
