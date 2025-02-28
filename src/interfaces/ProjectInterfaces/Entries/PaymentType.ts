export enum PaymentType {
  Cash,
  Cheque,
  Promissory,
  WireTransfer,
  Atm,
  CreditCard,
}

export const PaymentTypeOptions = Object.entries(PaymentType)
  .filter(([, value]) => typeof value === "number")
  .map(([key, value]) => ({ label: key, value }));

