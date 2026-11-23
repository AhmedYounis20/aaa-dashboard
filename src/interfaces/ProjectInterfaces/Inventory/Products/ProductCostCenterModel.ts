interface ProductCostCenterModel {
  id?: string;
  costCenterId: string | null;
  percent: number;
  name?: string;
  nameSecondLanguage?: string;
}

export default ProductCostCenterModel;
