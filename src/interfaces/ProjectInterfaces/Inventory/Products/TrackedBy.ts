export enum TrackedBy {
  ByQuantity = 0,
  ByLot = 1,
  BySerialNumber = 2,
}

export const TrackedByOptions = [
  { value: TrackedBy.ByQuantity, label: "ByQuantity" },
  { value: TrackedBy.ByLot, label: "ByLot" },
  { value: TrackedBy.BySerialNumber, label: "BySerialNumber" },
];
