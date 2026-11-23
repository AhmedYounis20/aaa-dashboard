import { describe, expect, it } from "vitest";
import { SubLedgerType } from "@/interfaces/ProjectInterfaces/Account/ChartOfAccount/SubLedgerType";
import { PaymentType } from "@/interfaces/ProjectInterfaces/Account/Entries/PaymentType";
import type { ChartOfAccountModel } from "@/interfaces/ProjectInterfaces";
import { ENTRY_KIND_CONFIG } from "../entryKind";
import { filterPaymentAccounts } from "./filterPaymentAccounts";

function coa(partial: Partial<ChartOfAccountModel> & { id: string }): ChartOfAccountModel {
  return {
    code: "1",
    name: "n",
    nameSecondLanguage: "n2",
    subLeadgerType: SubLedgerType.Bank,
    ...partial,
  } as ChartOfAccountModel;
}

describe("filterPaymentAccounts", () => {
  const accounts = [
    coa({ id: "cash", subLeadgerType: SubLedgerType.CashInBox }),
    coa({ id: "bank", subLeadgerType: SubLedgerType.Bank }),
    coa({ id: "payable", subLeadgerType: SubLedgerType.Bank }),
    coa({ id: "other", subLeadgerType: null as unknown as SubLedgerType }),
  ];

  it("filters cash to CashInBox for payment vouchers", () => {
    const result = filterPaymentAccounts(accounts, PaymentType.Cash, ENTRY_KIND_CONFIG.payment);
    expect(result.map((a) => a.id)).toEqual(["cash"]);
  });

  it("filters cheque to notes account for payment vouchers", () => {
    const config = {
      ...ENTRY_KIND_CONFIG.payment,
      notesAccountId: "payable",
    };
    const result = filterPaymentAccounts(accounts, PaymentType.Cheque, config);
    expect(result.map((a) => a.id)).toEqual(["payable"]);
  });

  it("returns all accounts for combined + PaymentType.None", () => {
    const result = filterPaymentAccounts(accounts, PaymentType.None, ENTRY_KIND_CONFIG.combined);
    expect(result).toHaveLength(accounts.length);
  });
});

describe("ENTRY_KIND_CONFIG", () => {
  it("covers all five entry kinds with expected modes", () => {
    expect(ENTRY_KIND_CONFIG.payment.mode).toBe("complex");
    expect(ENTRY_KIND_CONFIG.receipt.mode).toBe("complex");
    expect(ENTRY_KIND_CONFIG.combined.mode).toBe("complex");
    expect(ENTRY_KIND_CONFIG.journal.mode).toBe("simple");
    expect(ENTRY_KIND_CONFIG.opening.mode).toBe("simple");
  });

  it("normalizes combined title to CombinedEntries", () => {
    expect(ENTRY_KIND_CONFIG.combined.titleKey).toBe("CombinedEntries");
  });

  it("only combined allows payment toggle", () => {
    expect(ENTRY_KIND_CONFIG.combined.allowPaymentToggle).toBe(true);
    expect(ENTRY_KIND_CONFIG.payment.allowPaymentToggle).toBe(false);
    expect(ENTRY_KIND_CONFIG.receipt.allowPaymentToggle).toBe(false);
  });
});
