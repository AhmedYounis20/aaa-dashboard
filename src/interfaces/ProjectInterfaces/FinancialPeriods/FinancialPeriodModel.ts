import { Dayjs } from "dayjs";

interface FinancialPeriodModel {
  yearNumber: string;
  periodTypeByMonth: number;
  startDate: Date | null;
  endDate : Dayjs;
}

export default FinancialPeriodModel;