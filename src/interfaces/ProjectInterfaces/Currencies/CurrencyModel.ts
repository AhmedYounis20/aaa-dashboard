interface CurrencyModel {
  name: string;
  nameSecondLanguage: string;
  exchangeRate : number,
  symbol:string,
  isDefault:boolean,
  isActive:boolean
}

export default CurrencyModel;