import { FormTypes } from "@/interfaces/Components/FormType";
import ComplexEntryForm from "@/modules/account/entries/components/ComplexEntryForm";

/** @deprecated Prefer ComplexEntryForm with entryKind="journal". actionAfter normalized to afterAction. */
const JournalEntriesForm: React.FC<{
  formType: FormTypes;
  id: string;
  handleCloseForm: () => void;
  /** @deprecated use afterAction */
  actionAfter?: () => void;
  afterAction?: () => void;
}> = ({ actionAfter, afterAction, ...props }) => (
  <ComplexEntryForm
    entryKind="journal"
    afterAction={afterAction ?? actionAfter ?? (() => undefined)}
    {...props}
  />
);

export default JournalEntriesForm;
