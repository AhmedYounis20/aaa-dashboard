import { describe, expect, it, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test/testUtils";
import { FormTypes } from "@/interfaces/Components/FormType";
import ComplexEntryForm from "./ComplexEntryForm";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: "en" },
  }),
}));

const { getById, update, create, deleteFn, journalConfig } = vi.hoisted(() => {
  const getById = vi.fn();
  const update = vi.fn();
  const create = vi.fn();
  const deleteFn = vi.fn();
  const journalConfig = {
    kind: "journal" as const,
    mode: "simple" as const,
    titleKey: "JournalEntries",
    defaultIsPaymentTransaction: true,
    allowPaymentToggle: false,
    notesAccountMode: "none" as const,
    notesAccountId: null,
    chequeBankSource: "coa" as const,
    hasCostCenters: false,
    hasCollectionBooks: false,
    hasPaymentDetails: false,
    schema: {
      validate: vi.fn(async () => true),
    },
    list: vi.fn(),
    getById,
    create,
    update,
    delete: deleteFn,
  };
  return { getById, update, create, deleteFn, journalConfig };
});

vi.mock("../entryKind", () => ({
  getEntryKindConfig: () => journalConfig,
}));

vi.mock("@/hooks/queries", () => ({
  useCurrencies: () => ({ data: [] }),
  useBranches: () => ({ data: [] }),
  useChartOfAccounts: () => ({ data: [] }),
  useCostCenters: () => ({ data: [] }),
  useCollectionBooks: () => ({ data: [] }),
  useBanksList: () => ({ data: [] }),
}));

vi.mock("../api", () => ({
  getEntryNumber: vi.fn(async () => null),
}));

describe("ComplexEntryForm detail load failure", () => {
  beforeEach(() => {
    getById.mockReset();
    update.mockReset();
    create.mockReset();
    deleteFn.mockReset();
  });

  it("shows ErrorState and does not call update when getById fails", async () => {
    getById.mockResolvedValue({
      isSuccess: false,
      result: null,
      errorMessages: ["not found"],
      statusCode: 404,
      successMessage: "",
    });

    const user = userEvent.setup();
    renderWithProviders(
      <ComplexEntryForm
        entryKind="journal"
        formType={FormTypes.Edit}
        id="entry-1"
        handleCloseForm={vi.fn()}
        afterAction={vi.fn()}
      />
    );

    await waitFor(() => {
      expect(screen.getByText("SomethingWentWrong")).toBeInTheDocument();
    });

    const updateBtn = screen.queryByRole("button", { name: "Update" });
    if (updateBtn) {
      await user.click(updateBtn);
    }
    expect(update).not.toHaveBeenCalled();
  });

  it("retries getById from ErrorState", async () => {
    const success = {
      isSuccess: true,
      result: {
        id: "entry-1",
        entryNumber: "J-1",
        exchangeRate: 1,
        branchId: "b1",
        currencyId: "c1",
        entryDate: new Date(),
        documentNumber: "D-1",
        financialPeriodId: "fp1",
        notes: "",
        receiverName: "",
        attachments: [],
        financialPeriodNumber: "1",
        financialTransactions: [],
      },
      errorMessages: [],
      statusCode: 200,
      successMessage: "",
    };

    getById.mockResolvedValue({
      isSuccess: false,
      result: null,
      errorMessages: ["boom"],
      statusCode: 500,
      successMessage: "",
    });

    const user = userEvent.setup();
    renderWithProviders(
      <ComplexEntryForm
        entryKind="journal"
        formType={FormTypes.Edit}
        id="entry-1"
        handleCloseForm={vi.fn()}
        afterAction={vi.fn()}
      />
    );

    await waitFor(() => {
      expect(screen.getByText("SomethingWentWrong")).toBeInTheDocument();
    });

    const callsBeforeRetry = getById.mock.calls.length;
    getById.mockResolvedValue(success);

    await user.click(screen.getByRole("button", { name: "Retry" }));

    await waitFor(() => {
      expect(getById.mock.calls.length).toBeGreaterThan(callsBeforeRetry);
      expect(screen.queryByText("SomethingWentWrong")).not.toBeInTheDocument();
    });
  });
});
