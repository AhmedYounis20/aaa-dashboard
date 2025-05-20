interface FinancialPeriodModel {
  id: string;
  yearNumber: string;
  periodTypeByMonth: number;
  startDate: Date | null;
  endDate: Date | null;
}

export default FinancialPeriodModel;