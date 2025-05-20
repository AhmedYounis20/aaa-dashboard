import DepreciationApplication from "./DepreciationApplication";

interface GlSettingsModel {
  isAllowingEditVoucher: boolean;
  isAllowingDeleteVoucher: boolean;
  isAllowingNegativeBalances: boolean;
  decimalDigitsNumber: number;
  monthDays: number;
  depreciationApplication: DepreciationApplication;
}

export default GlSettingsModel;