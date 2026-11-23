import React from "react";
import { FormTypes } from "@/interfaces/Components/FormType";
import ComplexEntryForm from "@/modules/account/entries/components/ComplexEntryForm";

/** @deprecated Prefer ComplexEntryForm with entryKind="combined" */
const CombinedEntriesForm: React.FC<{
  formType: FormTypes;
  id: string;
  handleCloseForm: () => void;
  afterAction: () => void;
}> = (props) => <ComplexEntryForm entryKind="combined" {...props} />;

export default CombinedEntriesForm;
