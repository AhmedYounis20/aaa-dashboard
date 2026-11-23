import type { ChartOfAccountModel } from "@/interfaces/ProjectInterfaces";
import { SubLedgerType } from "@/interfaces/ProjectInterfaces/Account/ChartOfAccount/SubLedgerType";
import { PaymentType } from "@/interfaces/ProjectInterfaces/Account/Entries/PaymentType";
import type { EntryKindConfig } from "../entryKind";

/** Filter COA options for the payment instrument side of a complex line. */
export function filterPaymentAccounts(
  chartOfAccounts: ChartOfAccountModel[],
  paymentType: PaymentType,
  config: EntryKindConfig
): ChartOfAccountModel[] {
  if (config.kind === "combined") {
    if (paymentType === PaymentType.None) return chartOfAccounts;
    return chartOfAccounts.filter((item) =>
      paymentType === PaymentType.Cash
        ? item.subLeadgerType === SubLedgerType.CashInBox
        : item.subLeadgerType === SubLedgerType.Bank
    );
  }

  if (config.mode === "simple") {
    return chartOfAccounts.filter((item) =>
      paymentType === PaymentType.Cash
        ? item.subLeadgerType === SubLedgerType.CashInBox
        : item.subLeadgerType === SubLedgerType.Bank
    );
  }

  // payment / receipt vouchers
  return chartOfAccounts.filter((item) => {
    if (paymentType === PaymentType.Cash) {
      return item.subLeadgerType === SubLedgerType.CashInBox;
    }
    if (paymentType === PaymentType.Cheque && config.notesAccountId) {
      return item.id === config.notesAccountId;
    }
    return item.subLeadgerType === SubLedgerType.Bank;
  });
}
