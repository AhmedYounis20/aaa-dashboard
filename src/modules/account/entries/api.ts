import { httpGet } from "@/Apis/Axios/axiosMethods";
import type { ApiResult } from "@/interfaces/ApiResponse";
import type EntryNumber from "@/interfaces/ProjectInterfaces/Account/Entries/EntryNumber";

export {
  getPaymentEntries,
  getPaymentEntryById,
  createPaymentEntry,
  updatePaymentEntry,
  deletePaymentEntry,
} from "@/Apis/Account/PaymentEntriesApi";

export {
  getReceiptEntries,
  getReceiptEntryById,
  createReceiptEntry,
  updateReceiptEntry,
  deleteReceiptEntry,
} from "@/Apis/Account/ReceiptEntriesApi";

export {
  getCombinedEntries,
  getCombinedEntryById,
  createCombinedEntry,
  updateCombinedEntry,
  deleteCombinedEntry,
} from "@/Apis/Account/CombinedEntriesApi";

export {
  getJournalEntries,
  getJournalEntryById,
  createJournalEntry,
  updateJournalEntry,
  deleteJournalEntry,
} from "@/Apis/Account/JournalEntriesApi";

export {
  getOpeningEntries,
  getOpeningEntryById,
  createOpeningEntry,
  updateOpeningEntry,
  deleteOpeningEntry,
} from "@/Apis/Account/OpeningEntriesApi";

/** Shared entry-number lookup used by all entry kinds. */
export async function getEntryNumber(
  datetime: Date | string
): Promise<ApiResult<EntryNumber> | null> {
  return httpGet<EntryNumber>("entries/getEntryNumber", { datetime });
}
