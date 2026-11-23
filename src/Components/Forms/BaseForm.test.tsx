import { describe, expect, it, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BaseForm from "./BaseForm";
import { FormTypes } from "../../interfaces/Components/FormType";
import { renderWithProviders } from "../../test/testUtils";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: "en" },
  }),
}));

describe("BaseForm", () => {
  it("calls handleAdd and closes on successful submit", async () => {
    const user = userEvent.setup();
    const handleAdd = vi.fn(async () => true);
    const handleCloseForm = vi.fn();

    renderWithProviders(
      <BaseForm
        formType={FormTypes.Add}
        title="Item"
        handleAdd={handleAdd}
        handleCloseForm={handleCloseForm}
      >
        <div>Form body</div>
      </BaseForm>
    );

    expect(screen.getByText("Form body")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => {
      expect(handleAdd).toHaveBeenCalledTimes(1);
      expect(handleCloseForm).toHaveBeenCalledTimes(1);
    });
  });

  it("does not close when submit handler returns false", async () => {
    const user = userEvent.setup();
    const handleUpdate = vi.fn(async () => false);
    const handleCloseForm = vi.fn();

    renderWithProviders(
      <BaseForm
        formType={FormTypes.Edit}
        title="Item"
        handleUpdate={handleUpdate}
        handleCloseForm={handleCloseForm}
      >
        <div>Edit body</div>
      </BaseForm>
    );

    await user.click(screen.getByRole("button", { name: "Update" }));

    await waitFor(() => {
      expect(handleUpdate).toHaveBeenCalledTimes(1);
    });
    expect(handleCloseForm).not.toHaveBeenCalled();
  });

  it("closes via Cancel without submitting", async () => {
    const user = userEvent.setup();
    const handleAdd = vi.fn(async () => true);
    const handleCloseForm = vi.fn();

    renderWithProviders(
      <BaseForm formType={FormTypes.Add} handleAdd={handleAdd} handleCloseForm={handleCloseForm}>
        <div>Body</div>
      </BaseForm>
    );

    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(handleCloseForm).toHaveBeenCalledTimes(1);
    expect(handleAdd).not.toHaveBeenCalled();
  });
});
