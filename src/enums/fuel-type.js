const FuelType = Object.freeze({
  SUPER: 1,
  DIESEL: 2,
  // Add other fuel types as needed
});

export function getFuelType(value) {
  if (typeof value === 'number') {
    switch (value) {
      case FuelType.SUPER:
        return 'super';
      case FuelType.DIESEL:
        return 'diesel';
      // Add other cases as needed
      default:
        return undefined;
    }
  } else if (typeof value === 'string') {
    switch (value.toLowerCase()) {
      case 'super':
        return FuelType.SUPER;
      case 'diesel':
        return FuelType.DIESEL;
      // Add other cases as needed
      default:
        return undefined; // or return null, or throw an error
    }
  } else {
    return undefined; // or return null, or throw an error
  }
}

// Usage:
console.log(getFuelType(1)); // Outputs: "super"
console.log(getFuelType('super')); // Outputs: 1
console.log(getFuelType(2)); // Outputs: "diesel"
console.log(getFuelType('diesel')); // Outputs: 2
