import { FormTypes } from "@/interfaces/Components/FormType";
import ComplexEntryForm from "@/modules/account/entries/components/ComplexEntryForm";

/** @deprecated Prefer ComplexEntryForm with entryKind="payment" */
const PaymentVouchersForm: React.FC<{
  formType: FormTypes;
  id: string;
  handleCloseForm: () => void;
  afterAction: () => void;
}> = (props) => <ComplexEntryForm entryKind="payment" {...props} />;

export default PaymentVouchersForm;
