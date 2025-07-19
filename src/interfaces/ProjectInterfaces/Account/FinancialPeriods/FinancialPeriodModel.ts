interface FinancialPeriodModel {
  id: string;
  yearNumber: string;
  periodTypeByMonth: number;
  startDate: Date | null;
  endDate: Date | null;
  isEditable? : boolean;
  isDeletable? : boolean;
  isNameEditable : boolean;
}

export default FinancialPeriodModel;