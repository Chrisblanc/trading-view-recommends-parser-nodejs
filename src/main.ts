import { 
  REQUEST_INDICATORS, 
  EXCHANGES_ENUM, 
  SCREENERS_ENUM, 
  INTERVALS_ENUM, 
  INTERVALS_SCHEMA 
} from './contracts';
import { ParseTAResponse } from './reponseParser';
const SCAN_URL = 'https://scanner.tradingview.com/';
import Axios from 'axios';

function getData(symbol: string, interval: INTERVALS_ENUM) {
  const preparedInterval = INTERVALS_SCHEMA?.[interval] || '';
  return {
    symbols: { tickers: [symbol.toUpperCase()], query: { types: [] } },
    columns: REQUEST_INDICATORS.map((i) => i.replace('{}', preparedInterval)),
  };
}

export class TradingViewScan {
  constructor(
    public screener: SCREENERS_ENUM,
    public exchange: EXCHANGES_ENUM,
    public symbol: string,
    public interval: INTERVALS_ENUM,
    private axiosInstance: typeof Axios = Axios
  ) {}

  public async analyze() {
    this.validateExchange();
    this.validateScreener();
    this.validateSymbol();

    return await this._makeRequest();
  }

  public async _makeRequest() {
    const exch_smbl = `${this.exchange.toUpperCase()}:${this.symbol.toUpperCase()}`;
    const reqData = getData(exch_smbl, this.interval);

    try {
      const { data } = await this.axiosInstance.post(
        `${SCAN_URL}${this.screener.toLowerCase()}/scan`,
        reqData
      );
      // Utiliser le ParseTAResponse mis à jour
      return new ParseTAResponse(data).parse();
    } catch (error) {
      console.error('Error in fetching or processing data:', error);
      throw error;
    }
  }

  public validateExchange() {
    if (Object.values(EXCHANGES_ENUM).indexOf(this.exchange) === -1) {
      throw new Error(`Exchange "${this.exchange}" is not valid`);
    }
  }

  public validateScreener() {
    if (Object.values(SCREENERS_ENUM).indexOf(this.screener) === -1) {
      throw new Error(`Screener "${this.screener}" is not valid`);
    }
  }

  public validateSymbol() {
    if (typeof this.symbol !== 'string') {
      throw new Error(`Symbol "${this.symbol}" is not valid`);
    }
  }
}