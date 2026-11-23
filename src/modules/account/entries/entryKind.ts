import type { AnyObjectSchema } from "yup";
import type { ApiResult } from "@/interfaces/ApiResponse";
import { payableNotesId, receivableNotesId } from "@/Utilities/SD";
import { EntrySchema, SimpleEntrySchema } from "./validation";
import {
  createCombinedEntry,
  createJournalEntry,
  createOpeningEntry,
  createPaymentEntry,
  createReceiptEntry,
  deleteCombinedEntry,
  deleteJournalEntry,
  deleteOpeningEntry,
  deletePaymentEntry,
  deleteReceiptEntry,
  getCombinedEntries,
  getCombinedEntryById,
  getJournalEntries,
  getJournalEntryById,
  getOpeningEntries,
  getOpeningEntryById,
  getPaymentEntries,
  getPaymentEntryById,
  getReceiptEntries,
  getReceiptEntryById,
  updateCombinedEntry,
  updateJournalEntry,
  updateOpeningEntry,
  updatePaymentEntry,
  updateReceiptEntry,
} from "./api";

export type EntryKind = "payment" | "receipt" | "combined" | "journal" | "opening";

export type EntryMode = "complex" | "simple";

export type ChequeBankSource = "coa" | "banks";

/** How cheque notes accounts are filtered for payment/receipt vouchers. */
export type NotesAccountMode = "payable" | "receivable" | "none";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type EntryApiFn = (...args: any[]) => Promise<ApiResult<any> | null | ApiResult<any>>;

export interface EntryKindConfig {
  kind: EntryKind;
  mode: EntryMode;
  /** i18n key for list title */
  titleKey: string;
  defaultIsPaymentTransaction: boolean;
  /** Combined entries can flip payment ↔ receipt per line */
  allowPaymentToggle: boolean;
  notesAccountMode: NotesAccountMode;
  notesAccountId: string | null;
  chequeBankSource: ChequeBankSource;
  hasCostCenters: boolean;
  hasCollectionBooks: boolean;
  /** Payment-type fields (cash/cheque/wire/…) on complex lines */
  hasPaymentDetails: boolean;
  schema: AnyObjectSchema;
  list: EntryApiFn;
  getById: EntryApiFn;
  create: EntryApiFn;
  update: EntryApiFn;
  delete: EntryApiFn;
}

const paymentConfig: EntryKindConfig = {
  kind: "payment",
  mode: "complex",
  titleKey: "PaymentVouchers",
  defaultIsPaymentTransaction: true,
  allowPaymentToggle: false,
  notesAccountMode: "payable",
  notesAccountId: payableNotesId,
  chequeBankSource: "coa",
  hasCostCenters: true,
  hasCollectionBooks: true,
  hasPaymentDetails: true,
  schema: EntrySchema,
  list: getPaymentEntries,
  getById: getPaymentEntryById,
  create: createPaymentEntry,
  update: updatePaymentEntry,
  delete: deletePaymentEntry,
};

const receiptConfig: EntryKindConfig = {
  kind: "receipt",
  mode: "complex",
  titleKey: "ReceiptVouchers",
  defaultIsPaymentTransaction: false,
  allowPaymentToggle: false,
  notesAccountMode: "receivable",
  notesAccountId: receivableNotesId,
  chequeBankSource: "coa",
  hasCostCenters: true,
  hasCollectionBooks: true,
  hasPaymentDetails: true,
  schema: EntrySchema,
  list: getReceiptEntries,
  getById: getReceiptEntryById,
  create: createReceiptEntry,
  update: updateReceiptEntry,
  delete: deleteReceiptEntry,
};

const combinedConfig: EntryKindConfig = {
  kind: "combined",
  mode: "complex",
  titleKey: "CombinedEntries",
  defaultIsPaymentTransaction: true,
  allowPaymentToggle: true,
  notesAccountMode: "none",
  notesAccountId: null,
  chequeBankSource: "banks",
  hasCostCenters: true,
  hasCollectionBooks: true,
  hasPaymentDetails: true,
  schema: EntrySchema,
  list: getCombinedEntries,
  getById: getCombinedEntryById,
  create: createCombinedEntry,
  update: updateCombinedEntry,
  delete: deleteCombinedEntry,
};

const journalConfig: EntryKindConfig = {
  kind: "journal",
  mode: "simple",
  titleKey: "JournalEntries",
  defaultIsPaymentTransaction: true,
  allowPaymentToggle: false,
  notesAccountMode: "none",
  notesAccountId: null,
  chequeBankSource: "coa",
  hasCostCenters: false,
  hasCollectionBooks: false,
  hasPaymentDetails: false,
  schema: SimpleEntrySchema,
  list: getJournalEntries,
  getById: getJournalEntryById,
  create: createJournalEntry,
  update: updateJournalEntry,
  delete: deleteJournalEntry,
};

const openingConfig: EntryKindConfig = {
  kind: "opening",
  mode: "simple",
  titleKey: "OpeningEntries",
  defaultIsPaymentTransaction: true,
  allowPaymentToggle: false,
  notesAccountMode: "none",
  notesAccountId: null,
  chequeBankSource: "coa",
  hasCostCenters: false,
  hasCollectionBooks: false,
  hasPaymentDetails: false,
  schema: SimpleEntrySchema,
  list: getOpeningEntries,
  getById: getOpeningEntryById,
  create: createOpeningEntry,
  update: updateOpeningEntry,
  delete: deleteOpeningEntry,
};

export const ENTRY_KIND_CONFIG: Record<EntryKind, EntryKindConfig> = {
  payment: paymentConfig,
  receipt: receiptConfig,
  combined: combinedConfig,
  journal: journalConfig,
  opening: openingConfig,
};

export function getEntryKindConfig(kind: EntryKind): EntryKindConfig {
  return ENTRY_KIND_CONFIG[kind];
}
