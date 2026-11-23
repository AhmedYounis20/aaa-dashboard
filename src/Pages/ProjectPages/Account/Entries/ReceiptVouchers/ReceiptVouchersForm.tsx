import { FormTypes } from "@/interfaces/Components/FormType";
import ComplexEntryForm from "@/modules/account/entries/components/ComplexEntryForm";

/** @deprecated Prefer ComplexEntryForm with entryKind="receipt". actionAfter normalized to afterAction. */
const ReceiptVouchersForm: React.FC<{
  formType: FormTypes;
  id: string;
  handleCloseForm: () => void;
  /** @deprecated use afterAction */
  actionAfter?: () => void;
  afterAction?: () => void;
}> = ({ actionAfter, afterAction, ...props }) => (
  <ComplexEntryForm
    entryKind="receipt"
    afterAction={afterAction ?? actionAfter ?? (() => undefined)}
    {...props}
  />
);

export default ReceiptVouchersForm;
