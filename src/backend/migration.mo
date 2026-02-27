module {
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

  type ServiceCanister = {
    bookings : [Booking];
  };

  public func run(serviceCanister : ServiceCanister) : ServiceCanister {
    serviceCanister;
  };
};
