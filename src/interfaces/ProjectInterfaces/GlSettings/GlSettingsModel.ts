interface GlSettingsModel {
  isAllowingEditVoucher: boolean;
  isAllowingDeleteVoucher: boolean;
  isAllowingNegativeBalances: boolean;
  decimalDigitsNumber: number;
  monthDays: number;
  depreciationApplication: number;
}

export default GlSettingsModel;