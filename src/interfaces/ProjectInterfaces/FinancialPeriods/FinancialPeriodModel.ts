import { Dayjs } from "dayjs";

interface FinancialPeriodModel {
  id:string;
  yearNumber: string;
  periodTypeByMonth: number;
  startDate: Date | null;
  endDate : Dayjs;
}

export default FinancialPeriodModel;