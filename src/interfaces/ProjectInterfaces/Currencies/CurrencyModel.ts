interface CurrencyModel {
  id: string,
  name: string;
  nameSecondLanguage: string;
  exchangeRate : number,
  symbol:string,
  isDefault:boolean,
  isActive:boolean
}

export default CurrencyModel;