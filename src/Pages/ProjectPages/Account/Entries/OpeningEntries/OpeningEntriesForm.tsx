import { FormTypes } from "@/interfaces/Components/FormType";
import ComplexEntryForm from "@/modules/account/entries/components/ComplexEntryForm";

/** @deprecated Prefer ComplexEntryForm with entryKind="opening" */
const OpeningEntriesForm: React.FC<{
  formType: FormTypes;
  id: string;
  handleCloseForm: () => void;
  afterAction: () => void;
}> = (props) => <ComplexEntryForm entryKind="opening" {...props} />;

export default OpeningEntriesForm;
